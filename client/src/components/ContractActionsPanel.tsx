import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

const label = (ar: string, en: string, isAr: boolean) => (isAr ? ar : en);

export function ContractActionsPanel({
  transactionId,
  capabilities,
  userId,
  isAr,
  onDone,
}: {
  transactionId: number;
  capabilities: string[];
  userId: number;
  isAr: boolean;
  onDone: () => void;
}) {
  const canManageTerms = capabilities.includes("manage_terms");
  const [commercialScope, setCommercialScope] = React.useState("");
  const [structure, setStructure] = React.useState("");
  const [selectedApprovedTerm, setSelectedApprovedTerm] = React.useState("");
  const [agreementTitle, setAgreementTitle] = React.useState("");
  const [approvalNote, setApprovalNote] = React.useState("");
  const [externalReference, setExternalReference] = React.useState("");
  const [message, setMessage] = React.useState<string | null>(null);
  const terms = trpc.naqla3.commercialize.listTermSheets.useQuery({ transactionId });
  const agreements = trpc.naqla3.commercialize.listAgreementRecords.useQuery({ transactionId });
  const refresh = React.useCallback(() => {
    void terms.refetch();
    void agreements.refetch();
    onDone();
  }, [agreements, onDone, terms]);
  const createTerm = trpc.naqla3.commercialize.createTermSheet.useMutation({
    onSuccess: () => {
      setCommercialScope("");
      setStructure("");
      setMessage(label("حُفظت مسودة الشروط كإصدار قابل للمراجعة البشرية المنفصلة.", "The term draft was saved as a version awaiting separate human review.", isAr));
      refresh();
    },
    onError: error => setMessage(error.message),
  });
  const approveTerm = trpc.naqla3.commercialize.approveTermSheet.useMutation({
    onSuccess: () => {
      setApprovalNote("");
      setMessage(label("سُجلت موافقة بشرية منفصلة على مسودة الشروط.", "A separate human approval of the term draft was recorded.", isAr));
      refresh();
    },
    onError: error => setMessage(error.message),
  });
  const createAgreement = trpc.naqla3.commercialize.createAgreementRecord.useMutation({
    onSuccess: () => {
      setAgreementTitle("");
      setMessage(label("أُنشئ سجل الاتفاق كمسودة قابلة للتتبع؛ لا يُعد عقدًا منفذًا.", "The agreement record was created as a traceable draft; it is not an executed contract.", isAr));
      refresh();
    },
    onError: error => setMessage(error.message),
  });
  const setExecution = trpc.naqla3.commercialize.setAgreementExecutionStatus.useMutation({
    onSuccess: () => {
      setExternalReference("");
      setMessage(label("سُجلت حالة التنفيذ البشرية مع مرجع خارجي، دون توقيع إلكتروني داخل المنصة.", "The human execution status and external reference were recorded; no e-signature occurs in the platform.", isAr));
      refresh();
    },
    onError: error => setMessage(error.message),
  });

  const approvedTerms = (terms.data ?? []).filter(term => String(term.status) === "approved");

  if (terms.isError || agreements.isError) {
    return <Card className="border-rose-300/30 bg-slate-950/70"><CardContent className="space-y-3 p-6"><p role="alert" className="text-sm text-rose-100">{label("تعذر تحميل مسودات الشروط أو سجلات الاتفاق المصرح بها.", "Authorized term drafts or agreement records could not be loaded.", isAr)}</p><Button variant="outline" onClick={() => { void terms.refetch(); void agreements.refetch(); }}>{label("إعادة المحاولة", "Retry", isAr)}</Button></CardContent></Card>;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card className="border-cyan-300/20 bg-slate-950/70">
        <CardHeader>
          <CardTitle>{label("مسودات الشروط والمراجعة المنفصلة", "Term drafts and separate review", isAr)}</CardTitle>
          <CardDescription>{label("لا تُنشئ المنصة نصًا قانونيًا أو التزامًا. تحفظ فقط مسودة بشرية وموافقة منفصلة مع فصل الصلاحيات خادميًا.", "The platform creates neither legal text nor an obligation. It records a human draft and separate approval with server-enforced separation.", isAr)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {canManageTerms ? (
            <div className="space-y-3 border-b border-slate-800 pb-4">
              <div className="space-y-2">
                <Label htmlFor="term-commercial-scope">{label("النطاق التجاري المقترح", "Proposed commercial scope", isAr)}</Label>
                <Textarea id="term-commercial-scope" value={commercialScope} onChange={event => setCommercialScope(event.target.value)} className="min-h-24" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="term-structure">{label("هيكل المراجعة", "Review structure", isAr)}</Label>
                <Textarea id="term-structure" value={structure} onChange={event => setStructure(event.target.value)} className="min-h-24" />
              </div>
              <Button disabled={commercialScope.trim().length < 10 || structure.trim().length < 10 || createTerm.isPending} onClick={() => createTerm.mutate({ transactionId, commercialScope: commercialScope.trim(), structure: structure.trim() })}>
                {createTerm.isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                {label("حفظ مسودة الشروط", "Save term draft", isAr)}
              </Button>
            </div>
          ) : (
            <p className="rounded-xl border border-slate-700 p-3 text-sm text-slate-300">{label("تظهر السجلات المصرح بها فقط؛ لا تملك صلاحية إدارة الشروط في هذه المعاملة.", "Only authorized records are visible; you do not have permission to manage terms in this transaction.", isAr)}</p>
          )}
          {terms.isLoading ? <Loader2 className="h-5 w-5 animate-spin text-cyan-300" /> : (terms.data?.length ? <div className="space-y-3">{terms.data.map(term => <article key={String(term.id)} className="rounded-xl border border-slate-700 p-3"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-medium text-slate-100">{label("نسخة الشروط", "Term version", isAr)} {String(term.versionNumber)}</p><Badge variant="outline">{String(term.status)}</Badge></div>{canManageTerms && String(term.status) === "draft" && Number(term.createdBy) !== userId && <div className="mt-3 space-y-2"><Textarea aria-label={label("ملاحظة اعتماد الشروط", "Term approval note", isAr)} value={approvalNote} onChange={event => setApprovalNote(event.target.value)} placeholder={label("أساس المراجعة البشرية المنفصلة", "Basis for separate human review", isAr)} /><Button size="sm" disabled={approvalNote.trim().length < 8 || approveTerm.isPending} onClick={() => approveTerm.mutate({ termSheetId: Number(term.id), approvalNote: approvalNote.trim() })}>{label("اعتماد منفصل", "Approve separately", isAr)}</Button></div>}{canManageTerms && String(term.status) === "draft" && Number(term.createdBy) === userId && <p className="mt-2 text-xs text-amber-100">{label("يلزم مراجع مختلف لاعتماد هذه المسودة.", "A different reviewer must approve this draft.", isAr)}</p>}</article>)}</div> : <p className="text-sm text-slate-400">{label("لا توجد مسودات شروط ظاهرة في السياق الحالي.", "No term drafts are visible in the current context.", isAr)}</p>)}
          {message && <p role="status" className="text-sm text-cyan-100">{message}</p>}
        </CardContent>
      </Card>
      <Card className="border-cyan-300/20 bg-slate-950/70">
        <CardHeader>
          <CardTitle>{label("سجل الاتفاق والتنفيذ الخارجي", "Agreement record and external execution", isAr)}</CardTitle>
          <CardDescription>{label("لا يتم توقيع أو إصدار عقد داخل المنصة. يتطلب تسجيل التنفيذ مرجعًا خارجيًا وإدخالًا من مستخدم مختلف عن منشئ السجل.", "No agreement is signed or issued inside the platform. Recording execution requires an external reference and a user different from the record creator.", isAr)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {canManageTerms ? <div className="space-y-3 border-b border-slate-800 pb-4"><div className="space-y-2"><Label>{label("مسودة شروط معتمدة", "Approved term draft", isAr)}</Label><Select value={selectedApprovedTerm} onValueChange={setSelectedApprovedTerm}><SelectTrigger aria-label={label("مسودة شروط معتمدة", "Approved term draft", isAr)}><SelectValue placeholder={label("اختر نسخة معتمدة", "Select an approved version", isAr)} /></SelectTrigger><SelectContent>{approvedTerms.map(term => <SelectItem key={String(term.id)} value={String(term.id)}>{label("نسخة", "Version", isAr)} {String(term.versionNumber)} · {String(term.status)}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label htmlFor="agreement-title">{label("عنوان سجل الاتفاق", "Agreement record title", isAr)}</Label><Input id="agreement-title" value={agreementTitle} onChange={event => setAgreementTitle(event.target.value)} /></div><Button disabled={!selectedApprovedTerm || agreementTitle.trim().length < 3 || createAgreement.isPending} onClick={() => createAgreement.mutate({ transactionId, termSheetId: Number(selectedApprovedTerm), title: agreementTitle.trim() })}>{label("إنشاء سجل اتفاق", "Create agreement record", isAr)}</Button></div> : null}
          {agreements.isLoading ? <Loader2 className="h-5 w-5 animate-spin text-cyan-300" /> : (agreements.data?.length ? <div className="space-y-3">{agreements.data.map(agreement => <article key={String(agreement.id)} className="rounded-xl border border-slate-700 p-3"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-medium text-slate-100">{String(agreement.title)}</p><Badge variant="outline">{String(agreement.status)}</Badge></div>{canManageTerms && String(agreement.status) === "draft" && Number(agreement.createdBy) !== userId && <div className="mt-3 space-y-2"><Label htmlFor={`agreement-reference-${String(agreement.id)}`}>{label("مرجع التنفيذ الخارجي", "External execution reference", isAr)}</Label><Input id={`agreement-reference-${String(agreement.id)}`} value={externalReference} onChange={event => setExternalReference(event.target.value)} placeholder={label("مرجع توثيقي خارجي", "External documentary reference", isAr)} /><Button size="sm" disabled={externalReference.trim().length < 3 || setExecution.isPending} onClick={() => setExecution.mutate({ agreementId: Number(agreement.id), status: "executed", externalReference: externalReference.trim() })}>{label("تسجيل التنفيذ البشري", "Record human execution", isAr)}</Button></div>}{canManageTerms && String(agreement.status) === "draft" && Number(agreement.createdBy) === userId && <p className="mt-2 text-xs text-amber-100">{label("يلزم مستخدم مختلف لتسجيل التنفيذ.", "A different user must record execution.", isAr)}</p>}</article>)}</div> : <p className="text-sm text-slate-400">{label("لا توجد سجلات اتفاق ظاهرة في السياق الحالي.", "No agreement records are visible in the current context.", isAr)}</p>)}
        </CardContent>
      </Card>
    </div>
  );
}
