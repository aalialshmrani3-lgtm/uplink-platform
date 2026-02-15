import { jsPDF } from "jspdf";
import { storagePut } from "../storage";

interface ContractData {
  id: number;
  title: string;
  description: string | null;
  type: string;
  totalValue: string;
  currency: string;
  status: string;
  partyA: number;
  partyB: number;
  sellerSignatureUrl: string | null;
  buyerSignatureUrl: string | null;
  sellerSignedAt: string | null;
  buyerSignedAt: string | null;
  createdAt: string;
}

export async function generateContractPDF(contract: ContractData): Promise<string> {
  // إنشاء PDF جديد
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // إعدادات الخط
  doc.setFont("helvetica");
  
  let yPos = 20;

  // العنوان
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("عقد إلكتروني", 105, yPos, { align: "center" });
  yPos += 15;

  // رقم العقد
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Contract ID: ${contract.id}`, 105, yPos, { align: "center" });
  yPos += 10;

  // خط فاصل
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;

  // تفاصيل العقد
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Contract Details", 20, yPos);
  yPos += 8;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  
  // العنوان
  doc.text("Title:", 20, yPos);
  doc.text(contract.title, 50, yPos);
  yPos += 7;

  // النوع
  doc.text("Type:", 20, yPos);
  doc.text(contract.type, 50, yPos);
  yPos += 7;

  // القيمة
  doc.text("Total Value:", 20, yPos);
  doc.text(`${contract.totalValue} ${contract.currency}`, 50, yPos);
  yPos += 7;

  // الحالة
  doc.text("Status:", 20, yPos);
  doc.text(contract.status, 50, yPos);
  yPos += 7;

  // الوصف
  if (contract.description) {
    doc.text("Description:", 20, yPos);
    yPos += 7;
    const descLines = doc.splitTextToSize(contract.description, 170);
    doc.text(descLines, 20, yPos);
    yPos += descLines.length * 5 + 5;
  }

  yPos += 10;

  // خط فاصل
  doc.line(20, yPos, 190, yPos);
  yPos += 10;

  // التوقيعات
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Electronic Signatures", 20, yPos);
  yPos += 10;

  // توقيع البائع
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Seller (Party A):", 20, yPos);
  yPos += 7;

  if (contract.sellerSignatureUrl) {
    try {
      // تحميل صورة التوقيع
      const response = await fetch(contract.sellerSignatureUrl);
      const blob = await response.blob();
      const base64 = await blobToBase64(blob);
      
      doc.addImage(base64, "PNG", 20, yPos, 60, 20);
      yPos += 25;
      
      doc.setFontSize(9);
      doc.text(`Signed at: ${new Date(contract.sellerSignedAt!).toLocaleString()}`, 20, yPos);
      yPos += 10;
    } catch (error) {
      doc.text("Signature not available", 20, yPos);
      yPos += 10;
    }
  } else {
    doc.text("Not signed yet", 20, yPos);
    yPos += 10;
  }

  yPos += 5;

  // توقيع المشتري
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Buyer (Party B):", 20, yPos);
  yPos += 7;

  if (contract.buyerSignatureUrl) {
    try {
      const response = await fetch(contract.buyerSignatureUrl);
      const blob = await response.blob();
      const base64 = await blobToBase64(blob);
      
      doc.addImage(base64, "PNG", 20, yPos, 60, 20);
      yPos += 25;
      
      doc.setFontSize(9);
      doc.text(`Signed at: ${new Date(contract.buyerSignedAt!).toLocaleString()}`, 20, yPos);
      yPos += 10;
    } catch (error) {
      doc.text("Signature not available", 20, yPos);
      yPos += 10;
    }
  } else {
    doc.text("Not signed yet", 20, yPos);
    yPos += 10;
  }

  yPos += 10;

  // خط فاصل
  doc.line(20, yPos, 190, yPos);
  yPos += 10;

  // تاريخ الإنشاء
  doc.setFontSize(9);
  doc.text(`Contract created at: ${new Date(contract.createdAt).toLocaleString()}`, 20, yPos);

  // تحويل PDF إلى Buffer
  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

  // رفع PDF إلى S3
  const fileName = `contract-${contract.id}-signed-${Date.now()}.pdf`;
  const { url } = await storagePut(fileName, pdfBuffer, "application/pdf");

  return url;
}

// Helper function to convert Blob to base64
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
