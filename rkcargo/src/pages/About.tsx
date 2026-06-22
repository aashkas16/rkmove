import { motion } from "framer-motion";
import { Shield, Target, Eye, Award, MapPin, Clock, CheckCircle, Truck, Users, Star, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/layout/PublicLayout";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const stats = [
  { value: "15+", label: "Years Experience", icon: Award },
  { value: "50K+", label: "Shipments Delivered", icon: Package },
  { value: "200+", label: "Cities Covered", icon: MapPin },
  { value: "99%", label: "Client Satisfaction", icon: Star },
];

const milestones = [
  { year: "2009", title: "Founded in Ahmedabad", desc: "RK Cargo started as a small local packers and movers company in Chandkheda, Ahmedabad." },
  { year: "2012", title: "Expanded to Gujarat", desc: "Grew our network to cover all major cities in Gujarat including Surat, Vadodara, and Rajkot." },
  { year: "2015", title: "PAN India Operations", desc: "Launched nationwide operations covering 100+ cities across India with dedicated fleet." },
  { year: "2018", title: "50,000 Customers Milestone", desc: "Celebrated serving 50,000 happy customers with a 99% satisfaction rate." },
  { year: "2021", title: "Digital Tracking Launch", desc: "Introduced real-time parcel tracking system for complete shipment visibility." },
  { year: "2024", title: "200+ Cities Network", desc: "Expanded to 200+ cities with a fleet of 100+ vehicles and 500+ trained professionals." },
];

const values = [
  { icon: Target, title: "Our Mission", desc: "To provide world-class packers and movers services that are safe, affordable, and on-time. We aim to make every relocation a stress-free experience for our customers." },
  { icon: Eye, title: "Our Vision", desc: "To be India's most trusted and innovative logistics and relocation company, setting new standards in customer service and operational excellence." },
  { icon: Award, title: "Quality First", desc: "ISO-certified processes ensuring the highest standards in packing, transportation, and delivery. Every shipment is handled with precision and care." },
  { icon: MapPin, title: "PAN India Reach", desc: "Extensive network covering 200+ cities and towns across India. From metros to tier-2 cities, we're everywhere you need us." },
];

const team = [
  { title: "500+", label: "Trained Professionals" },
  { title: "100+", label: "Fleet Vehicles" },
  { title: "20+", label: "Warehouse Locations" },
  { title: "7 Days", label: "Customer Support" },
];

const certifications = [
  "IBA Approved Packers & Movers",
  "GST Registered Company",
  "Fully Licensed & Insured",
  "ISO Certified Processes",
  "Background Verified Staff",
  "GPS Tracked Fleet",
];

const About = () => (
  <PublicLayout>
    {/* ── Hero ── */}
    <section className="py-20 gradient-primary relative overflow-hidden" aria-label="About RK Cargo">
      {/* CSS-animated orbs — GPU composited */}
      <div className="animate-orb-up-slow absolute top-10 right-16 w-56 h-56 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
      <div className="animate-orb-down-slow absolute bottom-0 left-10 w-40 h-40 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">About Us</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            India's Trusted Packers & Movers Since 2009
          </h1>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            RK Cargo Packers and Movers is Ahmedabad's most reliable relocation company. With 15+ years of experience, we've helped over 50,000 families and businesses move safely across India.
          </p>
        </motion.div>
      </div>
    </section>

    {/* ── Stats ── */}
    <section className="py-12 bg-card border-b border-border" aria-label="Company statistics">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="text-center">
              <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center mx-auto mb-3">
                <s.icon className="w-6 h-6 text-accent-foreground" />
              </div>
              <p className="font-display text-3xl md:text-4xl font-bold text-gradient">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Story ── */}
    <section className="py-20 bg-background" aria-labelledby="story-heading">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Our Story</motion.p>
            <motion.h2 id="story-heading" variants={fadeUp} custom={1} className="font-display text-3xl font-bold text-foreground mb-6">
              Building Trust, One Shipment at a Time
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground leading-relaxed mb-4">
              Founded in 2009 in Chandkheda, Ahmedabad, <strong className="text-foreground">RK Cargo Packers and Movers</strong> started with a simple mission — to make relocation safe, affordable, and stress-free for every Indian family and business.
            </motion.p>
            <motion.p variants={fadeUp} custom={3} className="text-muted-foreground leading-relaxed mb-4">
              Over the years, we've grown from a small local mover to one of India's most trusted logistics companies. Our commitment to safety, transparency, and on-time delivery has earned us the trust of over 50,000 satisfied customers across 200+ cities.
            </motion.p>
            <motion.p variants={fadeUp} custom={4} className="text-muted-foreground leading-relaxed mb-6">
              Today, RK Cargo operates a fleet of 100+ vehicles, employs 500+ trained professionals, and maintains 20+ warehouse locations across India. We are IBA approved, GST registered, and fully licensed — giving you complete confidence in our services.
            </motion.p>
            <motion.div variants={fadeUp} custom={5}>
              <Link to="/contact">
                <Button className="gradient-primary text-primary-foreground gap-2">
                  Get Free Quote <Truck className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 gap-4">
            {values.map((item, i) => (
              <motion.div key={item.title} variants={fadeUp} custom={i} whileHover={{ scale: 1.03, y: -3 }} className="bg-card p-5 rounded-2xl shadow-card border border-border cursor-default">
                <item.icon className="w-8 h-8 text-accent mb-3" />
                <h3 className="font-display font-semibold text-sm mb-1 text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>

    {/* ── Team Stats ── */}
    <section className="py-16 gradient-primary" aria-label="Team and infrastructure">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
          <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl font-bold text-primary-foreground">
            Our Infrastructure & Team
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-primary-foreground/70 mt-2 text-sm">
            Built to handle relocations of any scale, anywhere in India.
          </motion.p>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {team.map((t, i) => (
            <motion.div key={t.label} variants={fadeUp} custom={i} className="glass-card p-6 text-center">
              <p className="font-display text-3xl font-bold text-accent mb-1">{t.title}</p>
              <p className="text-sm text-primary-foreground/80">{t.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ── Milestones ── */}
    <section className="py-20 bg-background" aria-labelledby="milestones-heading">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
          <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Our Journey</motion.p>
          <motion.h2 id="milestones-heading" variants={fadeUp} custom={1} className="font-display text-3xl md:text-4xl font-bold text-foreground">
            15 Years of Excellence in Relocation
          </motion.h2>
        </motion.div>
        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />
          <div className="flex flex-col gap-8">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex items-start gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                <div className={`md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"} pl-14 md:pl-0`}>
                  <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
                    <span className="text-accent font-bold text-lg font-display">{m.year}</span>
                    <h3 className="font-semibold text-foreground mt-1 mb-1">{m.title}</h3>
                    <p className="text-sm text-muted-foreground">{m.desc}</p>
                  </div>
                </div>
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full gradient-accent border-2 border-background -translate-x-1/2 mt-5" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* ── Certifications ── */}
    <section className="py-16 bg-muted" aria-labelledby="cert-heading">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-10">
          <motion.h2 id="cert-heading" variants={fadeUp} custom={0} className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Certifications & Credentials
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-muted-foreground mt-2 text-sm">
            We are a fully licensed, certified, and insured packers and movers company.
          </motion.p>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex flex-wrap justify-center gap-4">
          {certifications.map((cert, i) => (
            <motion.div key={cert} variants={fadeUp} custom={i} whileHover={{ scale: 1.05, y: -2 }} className="flex items-center gap-2 bg-card border border-border rounded-full px-5 py-2.5 shadow-sm cursor-default">
              <CheckCircle className="w-4 h-4 text-accent shrink-0" />
              <span className="text-sm font-medium text-foreground">{cert}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ── SEO Content ── */}
    <section className="py-16 bg-background" aria-label="About RK Cargo detailed">
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
              <p className="text-xs text-accent font-semibold uppercase tracking-widest">Why Choose Us</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Best Packers and Movers in Ahmedabad
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground leading-relaxed">
            <div className="space-y-4">
              <p>
                When it comes to choosing the best <strong className="text-foreground">packers and movers in Ahmedabad</strong>, RK Cargo stands out for its unmatched reliability, transparent pricing, and professional service. Serving Ahmedabad and Gujarat since 2009, we're one of the most experienced relocation companies in the region.
              </p>
              <p>
                Our <strong className="text-foreground">household shifting services</strong> cover everything from packing with high-quality materials to safe delivery at your new home. We handle furniture, electronics, appliances, and fragile items with utmost care — using bubble wrap, corrugated boxes, and stretch film for zero damage in transit.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                For businesses, our <strong className="text-foreground">office relocation services</strong> minimize downtime and disruption. We work around your schedule so your office is operational at the new location as quickly as possible — from IT equipment to furniture, we handle it all.
              </p>
              <p>
                Our <strong className="text-foreground">vehicle transport services</strong> use enclosed carriers and GPS tracking to ensure your car or bike arrives safely. We're one of the few packers and movers in Ahmedabad offering end-to-end vehicle transportation with full insurance coverage.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ── CTA ── */}
    {/* ── CTA ── */}
    <section className="py-16 bg-foreground" aria-label="Contact CTA">
      <div className="container mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Get Started</p>
          <h2 className="font-display text-3xl font-bold text-background mb-3">
            Ready to Experience the Best Movers in India?
          </h2>
          <p className="text-background/60 mb-6 max-w-md mx-auto text-sm">
            Get a free, no-obligation quote from RK Cargo Packers and Movers today.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/contact">
              <Button size="lg" className="gradient-primary text-white border-0 font-semibold gap-2 shadow-lg hover:opacity-90">
                Get Free Quote <Users className="w-4 h-4" />
              </Button>
            </Link>
            <a href="tel:+919227807476">
              <Button size="lg" className="bg-background/10 border border-background/20 text-background hover:bg-background/20 gap-2">
                Call: +91-92278-07476
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  </PublicLayout>
);

export default About;
