import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Instagram, Twitter, Facebook, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white pt-20 pb-10 border-t border-border">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="text-primary" size={32} strokeWidth={2.5} />
              <h2 className="text-[24px] font-[900] tracking-[-0.03em] text-text">
                StudySpace
              </h2>
            </div>
            <p className="text-muted font-medium text-base leading-relaxed max-w-[280px]">
              Premium, distraction-free environments designed for your academic success.
            </p>
            <div className="flex gap-4">
              <Link to="#" className="p-2 rounded-lg bg-bg text-text hover:text-primary transition-colors">
                <Instagram size={20} />
              </Link>
              <Link to="#" className="p-2 rounded-lg bg-bg text-text hover:text-primary transition-colors">
                <Twitter size={20} />
              </Link>
              <Link to="#" className="p-2 rounded-lg bg-bg text-text hover:text-primary transition-colors">
                <Facebook size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[18px] font-[900] text-text mb-6 tracking-tight">Company</h4>
            <ul className="flex flex-col gap-4 text-muted font-semibold">
              <li><Link to="/#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="/#plans" className="hover:text-primary transition-colors">Pricing Plans</Link></li>
              <li><Link to="/#how-it-works" className="hover:text-primary transition-colors">How it Works</Link></li>
              <li><Link to="/#reviews" className="hover:text-primary transition-colors">Reviews</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-[18px] font-[900] text-text mb-6 tracking-tight">Support</h4>
            <ul className="flex flex-col gap-4 text-muted font-semibold">
              <li><Link to="#" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/#contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-[18px] font-[900] text-text mb-6 tracking-tight">Contact</h4>
            <ul className="flex flex-col gap-5 text-muted font-semibold">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-primary shrink-0" />
                <span>123 Knowledge Lane, University District, City</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-primary shrink-0" />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-primary shrink-0" />
                <span>hello@studyspace.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted font-semibold text-sm">
            © {currentYear} StudySpace. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm font-bold text-text/60">
            <Link to="#" className="hover:text-primary">Privacy</Link>
            <Link to="#" className="hover:text-primary">Terms</Link>
            <Link to="#" className="hover:text-primary">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}