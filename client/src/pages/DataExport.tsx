/**
 * Data Export Page (Admin Only)
 * Export training data in multiple formats (CSV, JSON, Excel)
 */

import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Download, FileJson, FileSpreadsheet, FileText, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function DataExport() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [includeSuccess, setIncludeSuccess] = useState(true);
  const [includeFailure, setIncludeFailure] = useState(true);
  const [includePending, setIncludePending] = useState(false);

  // Redirect if not admin
  if (user && user.role !== 'admin') {
    navigate('/dashboard');
    return null;
  }

  // Fetch data
  const { data: stats } = trpc.ideaOutcomes.getStats.useQuery();
  const { data: trainingData, isLoading } = trpc.ideaOutcomes.getTrainingData.useQuery();

  // Filter data based on selection
  const getFilteredData = () => {
    if (!trainingData) return [];
    
    return trainingData.filter((item: any) => {
      if (item.success === 1 && includeSuccess) return true;
      if (item.success === 0 && includeFailure) return true;
      // Note: pending items don't have success field in training data
      return false;
    });
  };

  // Export as CSV
  const exportCSV = () => {
    const filtered = getFilteredData();
    if (filtered.length === 0) {
      toast.error('لا توجد بيانات للتصدير');
      return;
    }

    // Create CSV header
    const headers = Object.keys(filtered[0]).join(',');
    
    // Create CSV rows
    const rows = filtered.map((item: any) => 
      Object.values(item).map(val => 
        typeof val === 'string' && val.includes(',') ? `"${val}"` : val
      ).join(',')
    );

    const csv = [headers, ...rows].join('\n');
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `naqla_training_data_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success(`تم تصدير ${filtered.length} سجل بصيغة CSV`);
  };

  // Export as JSON
  const exportJSON = () => {
    const filtered = getFilteredData();
    if (filtered.length === 0) {
      toast.error('لا توجد بيانات للتصدير');
      return;
    }

    const json = JSON.stringify(filtered, null, 2);
    
    // Download
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `naqla_training_data_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    toast.success(`تم تصدير ${filtered.length} سجل بصيغة JSON`);
  };

  // Export as Excel (simple CSV with .xlsx extension for Excel compatibility)
  const exportExcel = () => {
    const filtered = getFilteredData();
    if (filtered.length === 0) {
      toast.error('لا توجد بيانات للتصدير');
      return;
    }

    // Create CSV (Excel can open CSV files)
    const headers = Object.keys(filtered[0]).join('\t'); // Tab-separated for better Excel compatibility
    const rows = filtered.map((item: any) => 
      Object.values(item).map(val => 
        typeof val === 'string' && (val.includes('\t') || val.includes(',')) ? `"${val}"` : val
      ).join('\t')
    );

    const tsv = [headers, ...rows].join('\n');
    
    // Download with .xls extension
    const blob = new Blob([tsv], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `naqla_training_data_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
    
    toast.success(`تم تصدير ${filtered.length} سجل بصيغة Excel`);
  };

  const filteredCount = getFilteredData().length;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">تصدير بيانات التدريب</h1>
        <p className="text-muted-foreground">
          تصدير بيانات الأفكار المصنفة بصيغ متعددة للتحليل الخارجي
        </p>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">أفكار ناجحة</CardTitle>
              <Badge variant="default" className="bg-green-600">{stats.success}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? ((stats.success / stats.total) * 100).toFixed(1) : 0}% من الإجمالي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">أفكار فاشلة</CardTitle>
              <Badge variant="default" className="bg-red-600">{stats.failure}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? ((stats.failure / stats.total) * 100).toFixed(1) : 0}% من الإجمالي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">قيد المراجعة</CardTitle>
              <Badge variant="default" className="bg-yellow-600">{stats.pending}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                غير متاحة للتصدير (لم يتم تصنيفها بعد)
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filter Options */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <CardTitle>تصفية البيانات</CardTitle>
          </div>
          <CardDescription>
            اختر أنواع الأفكار التي تريد تصديرها
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="success"
                checked={includeSuccess}
                onCheckedChange={(checked) => setIncludeSuccess(checked as boolean)}
              />
              <Label htmlFor="success" className="cursor-pointer">
                تضمين الأفكار الناجحة ({stats?.success || 0})
              </Label>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="failure"
                checked={includeFailure}
                onCheckedChange={(checked) => setIncludeFailure(checked as boolean)}
              />
              <Label htmlFor="failure" className="cursor-pointer">
                تضمين الأفكار الفاشلة ({stats?.failure || 0})
              </Label>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium">
                سيتم تصدير <span className="text-blue-600 font-bold">{filteredCount}</span> سجل
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>تصدير البيانات</CardTitle>
          <CardDescription>
            اختر الصيغة المناسبة لاحتياجاتك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CSV Export */}
            <Card className="border-2 hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-green-600" />
                  <div>
                    <CardTitle className="text-lg">CSV</CardTitle>
                    <CardDescription className="text-xs">
                      Comma-Separated Values
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  مناسب للتحليل في Excel، Google Sheets، أو Python/R
                </p>
                <Button
                  onClick={exportCSV}
                  className="w-full"
                  disabled={filteredCount === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  تصدير CSV
                </Button>
              </CardContent>
            </Card>

            {/* JSON Export */}
            <Card className="border-2 hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileJson className="w-8 h-8 text-blue-600" />
                  <div>
                    <CardTitle className="text-lg">JSON</CardTitle>
                    <CardDescription className="text-xs">
                      JavaScript Object Notation
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  مناسب للتطبيقات البرمجية وواجهات API
                </p>
                <Button
                  onClick={exportJSON}
                  className="w-full"
                  variant="outline"
                  disabled={filteredCount === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  تصدير JSON
                </Button>
              </CardContent>
            </Card>

            {/* Excel Export */}
            <Card className="border-2 hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-8 h-8 text-orange-600" />
                  <div>
                    <CardTitle className="text-lg">Excel</CardTitle>
                    <CardDescription className="text-xs">
                      Microsoft Excel Format
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  مناسب للفتح مباشرة في Microsoft Excel
                </p>
                <Button
                  onClick={exportExcel}
                  className="w-full"
                  variant="secondary"
                  disabled={filteredCount === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  تصدير Excel
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Data Preview */}
      {trainingData && trainingData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>معاينة البيانات</CardTitle>
            <CardDescription>
              أول 5 سجلات من البيانات المتاحة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-2">الميزانية</th>
                    <th className="text-right p-2">حجم الفريق</th>
                    <th className="text-right p-2">المدة</th>
                    <th className="text-right p-2">الطلب</th>
                    <th className="text-right p-2">الجدوى</th>
                    <th className="text-right p-2">النتيجة</th>
                  </tr>
                </thead>
                <tbody>
                  {trainingData.slice(0, 5).map((item: any, index: number) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-2">${item.budget?.toLocaleString() || 'N/A'}</td>
                      <td className="p-2">{item.team_size || 'N/A'}</td>
                      <td className="p-2">{item.timeline_months || 'N/A'} شهر</td>
                      <td className="p-2">{((item.market_demand || 0) * 100).toFixed(0)}%</td>
                      <td className="p-2">{((item.technical_feasibility || 0) * 100).toFixed(0)}%</td>
                      <td className="p-2">
                        <Badge variant={item.success === 1 ? 'default' : 'destructive'}>
                          {item.success === 1 ? 'نجاح' : 'فشل'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
