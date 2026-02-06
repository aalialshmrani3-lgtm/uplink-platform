import { Link } from "wouter";
import { Rocket, Twitter, Linkedin, Facebook, Instagram, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ImprovedFooter() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error(t.footer.newsletterError);
      return;
    }
    toast.success(t.footer.newsletterSuccess);
    setEmail("");
  };

  return (
    <footer className="py-16 px-6 border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient-cyan">UPLINK 5.0</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              {t.footer.tagline}
            </p>
            
            {/* Social Media Links */}
            <div className="flex items-center gap-3 mb-6">
              <a 
                href="https://twitter.com/UPLINK_SA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-secondary/50 hover:bg-cyan-500/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Twitter className="w-4 h-4 text-muted-foreground hover:text-cyan-400" />
              </a>
              <a 
                href="https://linkedin.com/company/uplink-sa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-secondary/50 hover:bg-blue-500/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="w-4 h-4 text-muted-foreground hover:text-blue-400" />
              </a>
              <a 
                href="https://facebook.com/UPLINK.SA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-secondary/50 hover:bg-blue-600/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Facebook className="w-4 h-4 text-muted-foreground hover:text-blue-500" />
              </a>
              <a 
                href="https://instagram.com/uplink.sa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-secondary/50 hover:bg-pink-500/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-4 h-4 text-muted-foreground hover:text-pink-400" />
              </a>
            </div>
            
            {/* Newsletter Signup */}
            <div>
              <h4 className="font-semibold text-foreground mb-3 text-sm">{t.footer.newsletter}</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder={t.footer.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-secondary/50 border-border/50"
                />
                <Button type="submit" size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600">
                  <Mail className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
          
          {/* Links Columns */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t.footer.engines}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/ip/register" className="hover:text-cyan-400 transition-colors">{t.footer.intellectualProperty}</Link></li>
              <li><Link href="/challenges" className="hover:text-cyan-400 transition-colors">{t.footer.challenges}</Link></li>
              <li><Link href="/marketplace" className="hover:text-cyan-400 transition-colors">{t.footer.marketplace}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t.footer.resources}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/academy" className="hover:text-cyan-400 transition-colors">{t.footer.academy}</Link></li>
              <li><Link href="/developers" className="hover:text-cyan-400 transition-colors">{t.footer.developers}</Link></li>
              <li><Link href="/elite" className="hover:text-cyan-400 transition-colors">{t.footer.elite}</Link></li>
              <li><Link href="/blog" className="hover:text-cyan-400 transition-colors">{t.footer.blog}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t.footer.tools}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/analytics" className="hover:text-cyan-400 transition-colors">{t.footer.analytics}</Link></li>
              <li><Link href="/messages" className="hover:text-cyan-400 transition-colors">{t.footer.messages}</Link></li>
              <li><Link href="/whiteboard" className="hover:text-cyan-400 transition-colors">{t.footer.whiteboard}</Link></li>
              <li><Link href="/help" className="hover:text-cyan-400 transition-colors">{t.footer.help}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {t.footer.copyright}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-cyan-400 transition-colors">{t.footer.privacy}</Link>
            <Link href="/terms" className="hover:text-cyan-400 transition-colors">{t.footer.terms}</Link>
            <Link href="/contact" className="hover:text-cyan-400 transition-colors">{t.footer.contact}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
