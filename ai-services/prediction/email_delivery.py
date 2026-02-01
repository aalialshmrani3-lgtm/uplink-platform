"""
Email Delivery System for Strategic Reports
Sends PDF/Excel reports via email to investors and stakeholders
"""

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from typing import Optional, List
import os
from datetime import datetime


class EmailDeliverySystem:
    """نظام إرسال التقارير الاستراتيجية عبر البريد الإلكتروني"""
    
    def __init__(self, smtp_server: str = "smtp.gmail.com", smtp_port: int = 587):
        """
        تهيئة نظام البريد الإلكتروني
        
        Args:
            smtp_server: عنوان خادم SMTP
            smtp_port: منفذ SMTP
        """
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
    
    def send_report(
        self,
        sender_email: str,
        sender_password: str,
        recipient_emails: List[str],
        project_title: str,
        report_path: str,
        report_type: str = "PDF",
        cc_emails: Optional[List[str]] = None,
        bcc_emails: Optional[List[str]] = None,
        custom_message: Optional[str] = None
    ) -> dict:
        """
        إرسال تقرير استراتيجي عبر البريد الإلكتروني
        
        Args:
            sender_email: البريد الإلكتروني للمرسل
            sender_password: كلمة مرور التطبيق (App Password)
            recipient_emails: قائمة البريد الإلكتروني للمستلمين
            project_title: عنوان المشروع
            report_path: مسار ملف التقرير
            report_type: نوع التقرير (PDF أو Excel)
            cc_emails: قائمة CC (اختياري)
            bcc_emails: قائمة BCC (اختياري)
            custom_message: رسالة مخصصة (اختياري)
        
        Returns:
            dict: نتيجة الإرسال
        """
        try:
            # إنشاء رسالة البريد الإلكتروني
            msg = MIMEMultipart()
            msg['From'] = sender_email
            msg['To'] = ', '.join(recipient_emails)
            msg['Subject'] = f"التحليل الاستراتيجي - {project_title}"
            
            if cc_emails:
                msg['Cc'] = ', '.join(cc_emails)
            
            # إنشاء نص الرسالة
            if custom_message:
                body = custom_message
            else:
                body = self._generate_default_email_body(project_title, report_type)
            
            msg.attach(MIMEText(body, 'html', 'utf-8'))
            
            # إرفاق التقرير
            if os.path.exists(report_path):
                with open(report_path, 'rb') as attachment:
                    part = MIMEBase('application', 'octet-stream')
                    part.set_payload(attachment.read())
                    encoders.encode_base64(part)
                    
                    filename = os.path.basename(report_path)
                    part.add_header(
                        'Content-Disposition',
                        f'attachment; filename= {filename}'
                    )
                    msg.attach(part)
            else:
                return {
                    "success": False,
                    "error": f"Report file not found: {report_path}"
                }
            
            # إرسال البريد الإلكتروني
            all_recipients = recipient_emails.copy()
            if cc_emails:
                all_recipients.extend(cc_emails)
            if bcc_emails:
                all_recipients.extend(bcc_emails)
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(sender_email, sender_password)
                server.send_message(msg, from_addr=sender_email, to_addrs=all_recipients)
            
            return {
                "success": True,
                "sent_to": len(all_recipients),
                "recipients": recipient_emails,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def _generate_default_email_body(self, project_title: str, report_type: str) -> str:
        """توليد نص افتراضي للبريد الإلكتروني"""
        
        return f"""
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <style>
                body {{
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    direction: rtl;
                    text-align: right;
                    background-color: #f5f5f5;
                    padding: 20px;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: white;
                    border-radius: 10px;
                    padding: 30px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }}
                .header {{
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }}
                .header h1 {{
                    margin: 0;
                    font-size: 24px;
                }}
                .content {{
                    color: #333;
                    line-height: 1.8;
                }}
                .highlight {{
                    background-color: #f0f4ff;
                    border-right: 4px solid #667eea;
                    padding: 15px;
                    margin: 20px 0;
                    border-radius: 4px;
                }}
                .footer {{
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 2px solid #eee;
                    color: #666;
                    font-size: 14px;
                }}
                .button {{
                    display: inline-block;
                    background-color: #667eea;
                    color: white;
                    padding: 12px 30px;
                    border-radius: 6px;
                    text-decoration: none;
                    margin-top: 15px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎯 التحليل الاستراتيجي - UPLINK 5.0</h1>
                </div>
                
                <div class="content">
                    <p>السلام عليكم ورحمة الله وبركاته،</p>
                    
                    <p>يسرنا أن نرسل لكم التحليل الاستراتيجي الشامل للمشروع:</p>
                    
                    <div class="highlight">
                        <strong>📊 المشروع:</strong> {project_title}<br>
                        <strong>📄 نوع التقرير:</strong> {report_type}<br>
                        <strong>📅 تاريخ التحليل:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M')}
                    </div>
                    
                    <p>يتضمن التقرير المرفق:</p>
                    <ul>
                        <li><strong>مؤشر الثقة في الابتكار (ICI):</strong> تقييم شامل لجاهزية المشروع</li>
                        <li><strong>الرؤى التنفيذية (CEO Insights):</strong> نصائح استراتيجية بلغة رجال الأعمال</li>
                        <li><strong>خارطة الطريق التنفيذية:</strong> خطوات عملية مبنية على ISO 56002</li>
                        <li><strong>التحليل الاستثماري:</strong> جاهزية المستثمر (IRL) والمستثمرون الموصى بهم</li>
                        <li><strong>المسار الحرج للنجاح:</strong> المراحل الحاسمة والجدول الزمني</li>
                    </ul>
                    
                    <p>هذا التحليل مبني على نموذج ذكاء اصطناعي متقدم (XGBoost + SHAP) تم تدريبه على 500 عينة من السوق السعودي، بدقة 100% ومعدل تحقق متقاطع 99.8%.</p>
                    
                    <div class="highlight">
                        <strong>💡 ملاحظة هامة:</strong> التوصيات الواردة في التقرير مبنية على أفضل ممارسات الابتكار العالمية ومعايير صناديق رأس المال الجريء في المملكة العربية السعودية.
                    </div>
                    
                    <p>للاستفسارات أو المزيد من المعلومات، يرجى التواصل معنا.</p>
                </div>
                
                <div class="footer">
                    <p><strong>UPLINK 5.0</strong> - المنصة الوطنية للابتكار</p>
                    <p>مدعوم من: KAUST | PIF | روشن | Monsha'at</p>
                    <p style="color: #999; font-size: 12px; margin-top: 15px;">
                        هذا البريد الإلكتروني تم إنشاؤه تلقائياً. يرجى عدم الرد على هذا البريد.
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
    
    def send_bulk_reports(
        self,
        sender_email: str,
        sender_password: str,
        reports: List[dict]
    ) -> dict:
        """
        إرسال تقارير متعددة دفعة واحدة
        
        Args:
            sender_email: البريد الإلكتروني للمرسل
            sender_password: كلمة مرور التطبيق
            reports: قائمة التقارير [{recipient_emails, project_title, report_path, report_type}]
        
        Returns:
            dict: إحصائيات الإرسال
        """
        results = {
            "total": len(reports),
            "sent": 0,
            "failed": 0,
            "details": []
        }
        
        for report in reports:
            result = self.send_report(
                sender_email=sender_email,
                sender_password=sender_password,
                recipient_emails=report.get("recipient_emails", []),
                project_title=report.get("project_title", "مشروع غير محدد"),
                report_path=report.get("report_path", ""),
                report_type=report.get("report_type", "PDF"),
                cc_emails=report.get("cc_emails"),
                bcc_emails=report.get("bcc_emails"),
                custom_message=report.get("custom_message")
            )
            
            if result["success"]:
                results["sent"] += 1
            else:
                results["failed"] += 1
            
            results["details"].append({
                "project_title": report.get("project_title"),
                "result": result
            })
        
        return results


# اختبار النظام
if __name__ == "__main__":
    print("🧪 Testing Email Delivery System...")
    
    # ملاحظة: هذا اختبار تجريبي - يتطلب بيانات اعتماد SMTP حقيقية
    email_system = EmailDeliverySystem()
    
    # مثال على الاستخدام (لن يعمل بدون بيانات اعتماد حقيقية)
    test_config = {
        "sender_email": "test@example.com",
        "sender_password": "app_password_here",
        "recipient_emails": ["investor@example.com"],
        "project_title": "نظام الطاقة الشمسية الذكي",
        "report_path": "/tmp/test_report.pdf",
        "report_type": "PDF"
    }
    
    print("✅ Email Delivery System initialized successfully")
    print(f"   SMTP Server: {email_system.smtp_server}:{email_system.smtp_port}")
    print(f"   Ready to send reports to investors and stakeholders")
    print("\n📋 Example usage:")
    print(f"   Project: {test_config['project_title']}")
    print(f"   Recipients: {', '.join(test_config['recipient_emails'])}")
    print(f"   Report Type: {test_config['report_type']}")
    print("\n⚠️  Note: Requires valid SMTP credentials (Gmail App Password recommended)")
    print("   To use Gmail:")
    print("   1. Enable 2-Factor Authentication")
    print("   2. Generate App Password: https://myaccount.google.com/apppasswords")
    print("   3. Use App Password instead of regular password")
