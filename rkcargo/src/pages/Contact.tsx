import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, Clock, CheckCircle, Truck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import PublicLayout from "@/components/layout/PublicLayout";
import { API_BASE_URL } from "@/config";
//import { supabase } from "@/integrations/supabase/client";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const reasons = [
  { icon: CheckCircle, text: "Free, no-obligation quotation" },
  { icon: Clock, text: "Response within 2 hours" },
  { icon: Truck, text: "Doorstep service across India" },
  { icon: Star, text: "4.8★ rated by 1200+ customers" },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {

  e.preventDefault();

  setLoading(true);

  try {

    await fetch(

      `${API_BASE_URL}/contact-submissions`,

      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          name: form.name,

          phone: form.phone,

          email: form.email,

          message: form.message
        })
      }
    );

    toast.success(
      "Message sent! We'll contact you soon."
    );

    setForm({
      name: "",
      phone: "",
      email: "",
      message: ""
    });

  } catch (err) {

    console.error(err);

    toast.error(
      "Failed to send message. Please try again."
    );

  } finally {

    setLoading(false);
  }
};

  return (
    <PublicLayout>
      {/* ── Hero ── */}
      <section className="py-20 gradient-primary relative overflow-hidden" aria-label="Contact RK Cargo">
        {/* CSS-animated orb — GPU composited */}
        <div className="animate-orb-up-slow absolute top-8 right-12 w-52 h-52 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">Contact Us</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Get a Free Quote from the Best Packers & Movers
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              Contact RK Cargo Packers and Movers for household shifting, office relocation, vehicle transport, or warehousing. We'll get back to you within 2 hours.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {reasons.map((r) => (
                <span key={r.text} className="inline-flex items-center gap-1.5 text-xs bg-white/10 text-primary-foreground px-3 py-1.5 rounded-full border border-white/20">
                  <r.icon className="w-3.5 h-3.5 text-accent" /> {r.text}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Form + Info ── */}
      <section className="py-20 bg-background" aria-labelledby="contact-form-heading">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h2 id="contact-form-heading" className="font-display text-2xl font-bold text-foreground mb-2">
                Request a Free Quotation
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Fill in your details and our team will provide a transparent, no-hidden-charges quote for your move.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="text-sm font-medium text-foreground mb-1 block">Full Name *</label>
                  <Input id="name" placeholder="Your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label htmlFor="phone" className="text-sm font-medium text-foreground mb-1 block">Phone Number *</label>
                  <Input id="phone" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-foreground mb-1 block">Email Address *</label>
                  <Input id="email" type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div>
                  <label htmlFor="message" className="text-sm font-medium text-foreground mb-1 block">Tell us about your move *</label>
                  <Textarea id="message" placeholder="E.g. Moving from Ahmedabad to Mumbai, 2BHK household shifting, need packing + transport..." rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                </div>
                <Button type="submit" size="lg" className="w-full gradient-accent text-accent-foreground border-0 font-semibold" disabled={loading}>
                  {loading ? "Sending..." : "Get Free Quote Now"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  No spam. We'll only contact you about your relocation query.
                </p>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-5">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">Contact Information</h2>
                <p className="text-muted-foreground text-sm mb-5">
                  Reach out to RK Cargo Packers and Movers directly. Our team is available 7 days a week, 8 AM to 8 PM.
                </p>
              </div>

              {[
                {
                  icon: Phone,
                  title: "Phone / WhatsApp",
                  value: "+91 92278 07476",
                  href: "tel:+919227807476",
                  sub: "Available Mon–Sun, 8 AM – 8 PM",
                },
                {
                  icon: Mail,
                  title: "Email",
                  value: "rkmove84@gmail.com",
                  href: "mailto:rkmove84@gmail.com",
                  sub: "We reply within 2 hours",
                },
                {
                  icon: MapPin,
                  title: "Office Address",
                  value: "GF-12 Lovekush Co. Op. Soc. Ltd, D Cabin Road, Kaligam, Chandkheda, Ahmedabad, Gujarat – 380019",
                  href: undefined,
                  sub: "Serving 200+ cities across India",
                },
                {
                  icon: Clock,
                  title: "Working Hours",
                  value: "Monday – Sunday: 8:00 AM – 8:00 PM",
                  href: undefined,
                  sub: "Emergency support available",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 bg-card p-4 rounded-xl border border-border shadow-card">
                  <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm text-accent hover:underline">{item.value}</a>
                    ) : (
                      <p className="text-sm text-muted-foreground">{item.value}</p>
                    )}
                    <p className="text-xs text-muted-foreground/70 mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}

              <a href="https://wa.me/919227807476" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="w-full bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white border-0 gap-2 mt-2">
                  <MessageCircle className="w-5 h-5" /> Chat on WhatsApp – Quick Response
                </Button>
              </a>

              <div className="rounded-xl overflow-hidden border border-border shadow-card">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d470962.95303381566!2d72.1679867481664!3d22.898008886981103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e83ff6fd79f5b%3A0xda8c43e4c0e670ce!2sR%20K%20Cargo%20Packers%20And%20Movers!5e1!3m2!1sen!2sin!4v1772470441685!5m2!1sen!2sin"
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="RK Cargo Packers and Movers location in Ahmedabad"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SEO Content ── */}
      <section className="py-16 bg-background" aria-label="Contact RK Cargo details">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="seo-content-block"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-10 rounded-full gradient-accent" />
              <div>
                <p className="text-xs text-accent font-semibold uppercase tracking-widest">Get In Touch</p>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  Contact the Best Packers and Movers in Ahmedabad
                </h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground leading-relaxed">
              <div className="space-y-4">
                <p>
                  Looking for reliable <strong className="text-foreground">packers and movers in Ahmedabad</strong>? RK Cargo is just a call or message away. Whether you need household shifting, office relocation, vehicle transport, or warehousing, our team is ready with a free, transparent quotation.
                </p>
                <p>
                  We serve customers across <strong className="text-foreground">200+ cities in India</strong> — Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune, Kolkata, Surat, Jaipur, and more. Wherever you're moving, RK Cargo has the network and expertise to get your goods there safely and on time.
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  Our customer support team is available <strong className="text-foreground">7 days a week from 8 AM to 8 PM</strong>. Reach us by phone, email, or WhatsApp — we typically respond within 2 hours and provide detailed quotes the same day.
                </p>
                <p>
                  Call us at{" "}
                  <a href="tel:+919227807476" className="text-accent font-medium hover:underline">+91-92278-07476</a>{" "}
                  or email{" "}
                  <a href="mailto:rkmove84@gmail.com" className="text-accent font-medium hover:underline">rkmove84@gmail.com</a>.
                  Our team is always happy to help plan your move.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Contact;
