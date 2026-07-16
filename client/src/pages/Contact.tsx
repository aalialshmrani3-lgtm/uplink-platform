import { Link } from "wouter";
import { ArrowRight, Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import ImprovedFooter from "@/components/ImprovedFooter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Contact() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error(isAr ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }
    setLoading(true);
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    toast.success(isAr ? "تم إرسال رسالتك بنجاح! سنرد عليك خلال 24 ساعة." : "Your message has been sent successfully! We will respond within 24 hours.");
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "hello@naqla.sa",
      sub: "For general inquiries",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+966 11 XXX XXXX",
      sub: "Sunday - Thursday, 9 AM - 5 PM",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Riyadh, Saudi Arabia",
      sub: "Olaya District, Innovation Tower",
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      icon: Clock,
      title: "Response Time",
      value: "Within 24 hours",
      sub: "Business Days",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
  ];

  const inquiryTypes = [
    { value: "general", label: "General Inquiry" },
    { value: "technical", label: "Technical Support" },
    { value: "partnership", label: "Strategic Partnership" },
    { value: "investment", label: "Investment & Funding" },
    { value: "media", label: "Media & Press" },
    { value: "legal", label: "Legal Inquiry" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="container flex items-center gap-4 h-16">
          <Link href="/">
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <ArrowRight className="w-4 h-4" />
              <span className="text-sm">{isAr ? isAr ? "العودة للرئيسية" : "Back to Home" : "[Back to Home]"}</span>
            </div>
          </Link>
          <span className="text-border/50">|</span>
          <span className="text-sm font-medium">{isAr ? isAr ? "اتصل بنا" : "Contact Us" : "[Contact Us]"}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="py-20 px-6 bg-gradient-to-b from-violet-500/5 to-transparent">
        <div className="container max-w-5xl mx-auto text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{isAr ? isAr ? "اتصل بنا" : "Contact Us" : "[Contact Us]"}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            فريقنا جاهز للإجابة على استفساراتك ومساعدتك في رحلة الابتكار. تواصل معنا بأي طريقة تناسبك.
          </p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="py-12 px-6">
        <div className="container max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {contactInfo.map((info, i) => {
              const Icon = info.icon;
              return (
                <div key={i} className="border border-border/50 rounded-2xl p-5 bg-card/20 text-center">
                  <div className={`w-10 h-10 ${info.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`w-5 h-5 ${info.color}`} />
                  </div>
                  <div className="font-semibold text-sm mb-1">{info.title}</div>
                  <div className={`text-sm font-medium ${info.color} mb-1`}>{info.value}</div>
                  <div className="text-xs text-muted-foreground">{info.sub}</div>
                </div>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-bold mb-3">{isAr ? isAr ? "أرسل لنا رسالة" : "Send us a message" : "[Send us a message]"}</h2>
              <p className="text-muted-foreground mb-8">
                سنرد على رسالتك خلال يوم عمل واحد. يمكنك أيضاً التواصل معنا عبر البريد الإلكتروني مباشرةً.
              </p>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{isAr ? isAr ? "تم الإرسال بنجاح!" : "Sent Successfully!" : "Submitted Successfully!"}</h3>
                  <p className="text-muted-foreground mb-6">
                    شكراً لتواصلك معنا. سنرد عليك خلال 24 ساعة على بريدك الإلكتروني.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "", type: "general" }); }}
                  >
                    إرسال رسالة أخرى
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Inquiry Type */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">{isAr ? isAr ? "نوع الاستفسار" : "Inquiry Type" : "Inquiry Type"}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {inquiryTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setForm({ ...form, type: type.value })}
                          className={`text-xs py-2 px-3 rounded-lg border transition-all ${
                            form.type === type.value
                              ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                              : "border-border/50 text-muted-foreground hover:border-border"
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">{isAr ? isAr ? "الاسم *" : "Name *" : "Name *"}</label>
                      <Input
                        placeholder={isAr ? "اسمك الكامل" : "Full Name"}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="bg-card/30"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">{isAr ? "البريد الإلكتروني *" : "Email *"}</label>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="bg-card/30"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">{isAr ? isAr ? "الموضوع" : "Subject" : "Theme"}</label>
                    <Input
                      placeholder={isAr ? "موضوع رسالتك" : "Your Message Subject"}
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="bg-card/30"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">{isAr ? isAr ? "الرسالة *" : "Message *" : "Message *"}</label>
                    <textarea
                      placeholder={isAr ? "اكتب رسالتك هنا..." : "Type your message here..."}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={5}
                      required
                      className="w-full rounded-lg border border-input bg-card/30 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/30 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white border-0"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        جاري الإرسال...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        إرسال الرسالة
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* FAQ Quick Links */}
            <div>
              <h2 className="text-2xl font-bold mb-3">{isAr ? isAr ? "أسئلة شائعة" : "FAQ" : "FAQ"}</h2>
              <p className="text-muted-foreground mb-8">
                قد تجد إجابتك في هذه الأسئلة الشائعة قبل التواصل معنا.
              </p>
              <div className="space-y-4">
                {[
                  { q: "How do I register on Naqla platform?", a: "You can register via the registration page and choose your suitable account type." },
                  { q: "Is registration free?", a: "Yes, basic registration is free. Advanced plans are available for institutions and companies." },
                  { q: "How do I protect my intellectual property?", a: "The platform provides tools for documenting and registering intellectual property according to international standards." },
                  { q: "Can international investors join?", a: "Yes, the platform is open for international registration and supports multiple languages and currencies." },
                  { q: "How do I communicate with government entities?", a: "After registration, you can submit your proposals through the National Challenges portal." },
                ].map((faq, i) => (
                  <div key={i} className="border border-border/50 rounded-xl p-4 bg-card/20">
                    <div className="font-medium text-sm mb-2">{faq.q}</div>
                    <div className="text-sm text-muted-foreground">{faq.a}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link href="/help">
                  <Button variant="outline" className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                    عرض جميع الأسئلة الشائعة
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ImprovedFooter />
    </div>
  );
}
