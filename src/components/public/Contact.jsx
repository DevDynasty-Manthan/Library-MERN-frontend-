import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactSection() {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: [
        "StudySpace Premium Library",
        "123, MG Road, Near City Mall",
        "Amravati, Maharashtra 444601",
      ],
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+91 98765 43210", "+91 98765 43211", "Mon-Sun: 6 AM - 11 PM"],
    },
    {
      icon: Mail,
      title: "Email Us",
      details: [
        "info@studyspace.com",
        "support@studyspace.com",
        "We reply within 24 hours",
      ],
    },
    {
      icon: Clock,
      title: "Operating Hours",
      details: [
        "24/7 for monthly members",
        "Daily Pass: 6 AM - 11 PM",
        "Office: 9 AM - 7 PM",
      ],
    },
  ];

  return (
    <section id="contact" className="py-20 bg-surface">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
            Get in <span className="text-primary">touch</span>
          </h2>
          <p className="text-muted text-xl leading-relaxed">
            Visit our space, call us, or drop by during office hours. We're here
            to help you find your perfect study environment.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div
                key={index}
                className="p-8 rounded-2xl border border-border bg-bg hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-primary" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold mb-4">{info.title}</h3>
                <div className="space-y-2">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-muted text-base leading-relaxed">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Placeholder */}
        <div className="rounded-2xl overflow-hidden border-2 border-border shadow-lg">
          <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-primary mx-auto mb-4" strokeWidth={1.5} />
              <p className="text-xl font-bold text-text mb-2">
                Map integration coming soon
              </p>
              <p className="text-muted">
                Or use:{" "}
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline"
                >
                  Open in Google Maps
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
