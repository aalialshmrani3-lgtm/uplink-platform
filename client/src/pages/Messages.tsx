import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, Send, Search, Phone, Video, MoreVertical,
  Paperclip, Smile, Image as ImageIcon, File, Star, Archive,
  Trash2, ChevronLeft, Shield, Lock, CheckCheck, Check,
  Users, Building2, Lightbulb, Bell, Settings, Filter,
  Plus, Circle
} from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';

// بيانات المحادثات التجريبية
const conversations = [
  {
    id: 1,
    name: 'أحمد الراشد',
    role: 'مستثمر',
    avatar: '',
    lastMessage: 'مرحباً، أود مناقشة فرصة الاستثمار في مشروعك',
    time: 'منذ 5 دقائق',
    unread: 3,
    online: true,
    verified: true,
  },
  {
    id: 2,
    name: 'سارة المنصور',
    role: 'مبتكرة',
    avatar: '',
    lastMessage: 'شكراً لاهتمامك، متى يمكننا عقد اجتماع؟',
    time: 'منذ ساعة',
    unread: 0,
    online: true,
    verified: true,
  },
  {
    id: 3,
    name: 'محمد العتيبي',
    role: 'مستثمر',
    avatar: '',
    lastMessage: 'تم مراجعة العرض التقديمي، لدي بعض الملاحظات',
    time: 'منذ 3 ساعات',
    unread: 1,
    online: false,
    verified: true,
  },
  {
    id: 4,
    name: 'نورة الدوسري',
    role: 'مبتكرة',
    avatar: '',
    lastMessage: 'هل يمكنك إرسال تفاصيل العقد؟',
    time: 'أمس',
    unread: 0,
    online: false,
    verified: false,
  },
  {
    id: 5,
    name: 'خالد السبيعي',
    role: 'مستثمر',
    avatar: '',
    lastMessage: 'ممتاز! سأقوم بمراجعة الوثائق',
    time: 'أمس',
    unread: 0,
    online: true,
    verified: true,
  },
];

// بيانات الرسائل التجريبية
const messagesData = [
  {
    id: 1,
    sender: 'أحمد الراشد',
    content: 'السلام عليكم، أنا أحمد الراشد، مستثمر في قطاع التقنية الصحية.',
    time: '10:30 ص',
    isMe: false,
    status: 'read',
  },
  {
    id: 2,
    sender: 'أحمد الراشد',
    content: 'اطلعت على مشروعك "نظام الذكاء الاصطناعي للتشخيص الطبي" وأجده واعداً جداً.',
    time: '10:31 ص',
    isMe: false,
    status: 'read',
  },
  {
    id: 3,
    sender: 'أنت',
    content: 'وعليكم السلام، أهلاً بك أستاذ أحمد. سعيد باهتمامك بالمشروع.',
    time: '10:35 ص',
    isMe: true,
    status: 'read',
  },
  {
    id: 4,
    sender: 'أحمد الراشد',
    content: 'هل يمكنك إرسال العرض التقديمي الكامل والتوقعات المالية للسنوات الثلاث القادمة؟',
    time: '10:40 ص',
    isMe: false,
    status: 'read',
  },
  {
    id: 5,
    sender: 'أنت',
    content: 'بالتأكيد، سأرسل لك الملفات المطلوبة خلال ساعة.',
    time: '10:42 ص',
    isMe: true,
    status: 'read',
  },
  {
    id: 6,
    sender: 'أحمد الراشد',
    content: 'ممتاز! كما أود معرفة المزيد عن فريق العمل وخبراتهم السابقة.',
    time: '10:45 ص',
    isMe: false,
    status: 'read',
  },
  {
    id: 7,
    sender: 'أحمد الراشد',
    content: 'مرحباً، أود مناقشة فرصة الاستثمار في مشروعك',
    time: '11:00 ص',
    isMe: false,
    status: 'delivered',
  },
];

export default function Messages() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messages, setMessages] = useState(messagesData);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg = {
      id: messages.length + 1,
      sender: 'أنت',
      content: newMessage,
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      status: 'sent' as const,
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.includes(searchQuery) || conv.lastMessage.includes(searchQuery);
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'investors' && conv.role === 'مستثمر') ||
      (activeTab === 'innovators' && conv.role === 'مبتكرة');
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">الرسائل</h1>
                <p className="text-xs text-muted-foreground">تواصل آمن ومشفر</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-0">
              <Lock className="w-3 h-3 ml-1" />
              مشفر E2E
            </Badge>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          {/* Conversations List */}
          <Card className="border-0 bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-lg">المحادثات</CardTitle>
                <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                  <Plus className="w-4 h-4 ml-1" />
                  جديد
                </Button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في المحادثات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 bg-secondary/50"
                />
              </div>
              
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                <TabsList className="w-full bg-secondary/50">
                  <TabsTrigger value="all" className="flex-1 text-xs">الكل</TabsTrigger>
                  <TabsTrigger value="investors" className="flex-1 text-xs">مستثمرين</TabsTrigger>
                  <TabsTrigger value="innovators" className="flex-1 text-xs">مبتكرين</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-380px)]">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-secondary/50 border-b border-border/30 ${
                      selectedConversation.id === conv.id ? 'bg-secondary/70' : ''
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={conv.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                          {conv.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {conv.online && (
                        <Circle className="absolute bottom-0 left-0 w-3 h-3 fill-emerald-500 text-emerald-500" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{conv.name}</span>
                        {conv.verified && (
                          <Shield className="w-4 h-4 text-cyan-400" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-muted-foreground">{conv.time}</span>
                      {conv.unread > 0 && (
                        <Badge className="bg-cyan-500 text-white text-xs px-2 py-0.5">
                          {conv.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 border-0 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                      {selectedConversation.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {selectedConversation.online && (
                    <Circle className="absolute bottom-0 left-0 w-2.5 h-2.5 fill-emerald-500 text-emerald-500" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{selectedConversation.name}</span>
                    {selectedConversation.verified && (
                      <Shield className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedConversation.online ? 'متصل الآن' : 'غير متصل'}
                    {' • '}
                    {selectedConversation.role}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {/* Security Notice */}
                <div className="flex justify-center">
                  <Badge variant="outline" className="text-xs bg-secondary/50">
                    <Lock className="w-3 h-3 ml-1" />
                    الرسائل مشفرة من طرف إلى طرف
                  </Badge>
                </div>
                
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isMe ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                        message.isMe
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-sm'
                          : 'bg-secondary/70 rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 ${
                        message.isMe ? 'text-white/70' : 'text-muted-foreground'
                      }`}>
                        <span className="text-xs">{message.time}</span>
                        {message.isMe && (
                          message.status === 'read' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-cyan-200" />
                          ) : (
                            <Check className="w-3.5 h-3.5" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border/30">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground">
                  <ImageIcon className="w-5 h-5" />
                </Button>
                
                <div className="flex-1 relative">
                  <Input
                    placeholder="اكتب رسالتك..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="pr-4 pl-10 bg-secondary/50 rounded-full"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full text-muted-foreground"
                  >
                    <Smile className="w-5 h-5" />
                  </Button>
                </div>
                
                <Button 
                  size="icon" 
                  className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
