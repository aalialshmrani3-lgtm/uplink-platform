// Added for Flowchart Match - Phase 7: Global Search
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, FileText, Users, Calendar, FileCode } from 'lucide-react';

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const { data: results, isLoading } = trpc.search.global.useQuery(
    { query, type: activeTab as any },
    { enabled: query.length > 2 }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Search className="w-10 h-10 text-purple-400" />
            البحث الشامل
          </h1>
          <p className="text-slate-400 text-lg">
            ابحث في الأفكار، المستخدمين، الفعاليات، والعقود
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="ابحث عن أي شيء..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-12 bg-slate-900/50 border-slate-700 text-white text-lg h-14"
            />
          </div>
        </div>

        {/* Results Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-900/50 border-slate-800 mb-6">
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="ideas">الأفكار</TabsTrigger>
            <TabsTrigger value="users">المستخدمين</TabsTrigger>
            <TabsTrigger value="events">الفعاليات</TabsTrigger>
            <TabsTrigger value="contracts">العقود</TabsTrigger>
          </TabsList>

          {/* All Results */}
          <TabsContent value="all">
            {isLoading && (
              <div className="text-center text-slate-400 py-12">
                جاري البحث...
              </div>
            )}

            {!isLoading && query.length > 2 && (
              <div className="space-y-4">
                {results?.ideas?.map((idea: any) => (
                  <Card key={idea.id} className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-400" />
                        {idea.title}
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        {idea.description?.substring(0, 150)}...
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}

                {results?.users?.map((user: any) => (
                  <Card key={user.id} className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        {user.name}
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        {user.email}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}

                {(!results || (results.ideas?.length === 0 && results.users?.length === 0)) && (
                  <div className="text-center text-slate-400 py-12">
                    لا توجد نتائج
                  </div>
                )}
              </div>
            )}

            {query.length <= 2 && (
              <div className="text-center text-slate-400 py-12">
                اكتب 3 أحرف على الأقل للبحث
              </div>
            )}
          </TabsContent>

          {/* Ideas Results */}
          <TabsContent value="ideas">
            <div className="space-y-4">
              {results?.ideas?.map((idea: any) => (
                <Card key={idea.id} className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">{idea.title}</CardTitle>
                    <CardDescription className="text-slate-400">
                      {idea.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                        {idea.category}
                      </span>
                      <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                        {idea.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Users Results */}
          <TabsContent value="users">
            <div className="space-y-4">
              {results?.users?.map((user: any) => (
                <Card key={user.id} className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">{user.name}</CardTitle>
                    <CardDescription className="text-slate-400">
                      {user.email} • {user.role}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Events Results */}
          <TabsContent value="events">
            <div className="text-center text-slate-400 py-12">
              قريباً...
            </div>
          </TabsContent>

          {/* Contracts Results */}
          <TabsContent value="contracts">
            <div className="text-center text-slate-400 py-12">
              قريباً...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
