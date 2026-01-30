import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { 
  Rocket, Shield, Plus, FileText, Clock, CheckCircle, 
  XCircle, AlertCircle, ExternalLink, Copy
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function IPList() {
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true });
  const { data: ipList, isLoading } = trpc.ip.getMyRegistrations.useQuery(undefined, { enabled: !!user });
  const { data: organizations = [] } = trpc.organizations.getAll.useQuery();
  
  const [orgFilter, setOrgFilter] = useState<string>('all');
  
  // Filter IP list by organization
  const filteredIpList = ipList?.filter(ip => {
    if (orgFilter === 'all') return true;
    return ip.organizations?.some((org: any) => org.id.toString() === orgFilter);
  }) || [];

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "registered": return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case "submitted": case "under_review": return <Clock className="w-5 h-5 text-blue-400" />;
      case "rejected": return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "draft": return "مسودة";
      case "submitted": return "مُقدّم";
      case "under_review": return "قيد المراجعة";
      case "approved": return "مُعتمد";
      case "rejected": return "مرفوض";
      case "registered": return "مسجّل";
      case "expired": return "منتهي";
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "patent": return "براءة اختراع";
      case "trademark": return "علامة تجارية";
      case "copyright": return "حقوق نشر";
      case "trade_secret": return "سر تجاري";
      case "industrial_design": return "تصميم صناعي";
      default: return type;
    }
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast.success("تم نسخ رقم التوثيق");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                UPLINK 5.0
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/ip/register">
              <Button className="bg-emerald-500 hover:bg-emerald-600">
                <Plus className="w-4 h-4 ml-2" />
                تسجيل جديد
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="border-slate-700 text-slate-300">
                لوحة التحكم
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">ملكياتي الفكرية</h1>
          <p className="text-slate-400">إدارة وتتبع تسجيلات الملكية الفكرية الخاصة بك</p>
        </div>

        {/* Organization Filter */}
        <div className="mb-6">
          <Select value={orgFilter} onValueChange={setOrgFilter}>
            <SelectTrigger className="w-[300px] bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="تصفية حسب الجهة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الجهات</SelectItem>
              {organizations.map((org: any) => (
                <SelectItem key={org.id} value={org.id.toString()}>
                  {org.nameAr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredIpList && filteredIpList.length > 0 ? (
          <div className="space-y-4">
            {filteredIpList.map((ip) => (
              <Card key={ip.id} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                        <Shield className="w-7 h-7 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">{ip.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {getTypeText(ip.type)}
                          </span>
                          {ip.category && (
                            <span className="px-2 py-0.5 bg-slate-700 rounded text-slate-300">
                              {ip.category}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm line-clamp-2 max-w-2xl">
                          {ip.description}
                        </p>
                        {ip.blockchainHash && (
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-xs text-slate-500">توثيق البلوكتشين:</span>
                            <code className="text-xs text-emerald-400 bg-slate-900 px-2 py-1 rounded">
                              {ip.blockchainHash.substring(0, 20)}...
                            </code>
                            <button 
                              onClick={() => ip.blockchainHash && copyHash(ip.blockchainHash)}
                              className="text-slate-400 hover:text-white"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        {/* Organizations Badges */}
                        {ip.organizations && ip.organizations.length > 0 && (
                          <div className="flex items-center gap-2 mt-3 flex-wrap">
                            <span className="text-xs text-slate-500">الجهات المشاركة:</span>
                            {ip.organizations.map((org: any) => (
                              <span
                                key={org.id}
                                className={`text-xs px-2 py-1 rounded-full ${
                                  org.type === 'government' ? 'bg-blue-500/20 text-blue-400' :
                                  org.type === 'academic' ? 'bg-purple-500/20 text-purple-400' :
                                  org.type === 'private' ? 'bg-emerald-500/20 text-emerald-400' :
                                  'bg-orange-500/20 text-orange-400'
                                }`}
                              >
                                {org.nameAr}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                        ip.status === "registered" ? "bg-emerald-500/20" :
                        ip.status === "submitted" || ip.status === "under_review" ? "bg-blue-500/20" :
                        ip.status === "rejected" ? "bg-red-500/20" :
                        "bg-slate-500/20"
                      }`}>
                        {getStatusIcon(ip.status || 'draft')}
                        <span className={`text-sm ${
                          ip.status === "registered" ? "text-emerald-400" :
                          ip.status === "submitted" || ip.status === "under_review" ? "text-blue-400" :
                          ip.status === "rejected" ? "text-red-400" :
                          "text-slate-400"
                        }`}>
                          {getStatusText(ip.status || 'draft')}
                        </span>
                      </div>
                      {ip.saipApplicationNumber && (
                        <div className="text-xs text-slate-500">
                          SAIP: {ip.saipApplicationNumber}
                        </div>
                      )}
                      <div className="text-xs text-slate-500">
                        {new Date(ip.createdAt).toLocaleDateString("ar-SA")}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="py-16 text-center">
              <Shield className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">لا توجد ملكيات فكرية</h3>
              <p className="text-slate-400 mb-6">ابدأ بتسجيل ملكيتك الفكرية الأولى</p>
              <Link href="/ip/register">
                <Button className="bg-emerald-500 hover:bg-emerald-600">
                  <Plus className="w-4 h-4 ml-2" />
                  سجّل ملكيتك الأولى
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
