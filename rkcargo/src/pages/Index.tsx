import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight, Search, FileText, Truck, Building2, Car, Warehouse, Package,
  Users, Shield, Clock, MapPin, Star, CheckCircle, Phone, ChevronDown, ChevronUp,
  Award, TrendingUp, HeartHandshake, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/layout/PublicLayout";
import heroBg from "@/assets/hero-bg.jpg";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL } from "@/config";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// Animated counter hook
function useCounter(target: number, duration = 1800, startOnView = true) {
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!startOnView) { setInView(true); return; }
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return { count, ref };
}

// Stat counter component
const StatCounter = ({ value, label, icon: Icon, i }: { value: string; label: string; icon: any; i: number }) => {
  const numeric = parseInt(value.replace(/\D/g, ""), 10);
  const suffix  = value.replace(/[0-9]/g, "");
  const { count, ref } = useCounter(numeric);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1, duration: 0.45 }}
      whileHover={{ scale: 1.06 }}
      className="flex flex-col items-center text-center px-4 py-5 cursor-default"
    >
      <Icon className="w-4 h-4 text-accent mb-2" />
      <span ref={ref} className="font-display text-2xl md:text-3xl font-black text-gradient leading-none">
        {count}{suffix}
      </span>
      <p className="text-xs text-muted-foreground font-medium mt-1">{label}</p>
    </motion.div>
  );
};

const services = [
  {
    icon: Truck,
    title: "Household Shifting",
    desc: "Safe door-to-door household goods relocation with expert packing. We handle furniture, appliances, and fragile items with utmost care.",
    keywords: "household shifting, home relocation, furniture moving",
  },
  {
    icon: Building2,
    title: "Office Relocation",
    desc: "Seamless corporate moves with minimal downtime. Our team ensures your office equipment and documents are safely transported.",
    keywords: "office relocation, corporate moving, commercial shifting",
  },
  {
    icon: Car,
    title: "Vehicle Transport",
    desc: "Secure car and bike transportation across India using enclosed carriers. GPS-tracked, fully insured vehicle shifting.",
    keywords: "car transport, bike shifting, vehicle relocation India",
  },
  {
    icon: Warehouse,
    title: "Warehousing & Storage",
    desc: "Climate-controlled, secure storage facilities for short and long-term needs. 24/7 CCTV monitored warehouses.",
    keywords: "warehousing, storage services, goods storage India",
  },
  {
    icon: Package,
    title: "Loading & Unloading",
    desc: "Professional labour for heavy and fragile items. Trained staff with proper equipment for safe handling.",
    keywords: "loading unloading services, labour services, goods handling",
  },
  {
    icon: MapPin,
    title: "PAN India Cargo",
    desc: "Express cargo delivery to 200+ cities across India. Reliable freight services for businesses and individuals.",
    keywords: "PAN India cargo, freight services, express delivery India",
  },
];

const whyUs = [
  { icon: Shield, title: "Fully Insured", desc: "100% transit insurance coverage for all your goods. Zero risk, complete peace of mind." },
  { icon: Clock, title: "On-Time Delivery", desc: "Guaranteed delivery schedules. We respect your time and commitments." },
  { icon: MapPin, title: "PAN India Network", desc: "200+ cities covered. Wherever you move, we're already there." },
  { icon: Users, title: "Expert Team", desc: "Trained, background-verified professionals handling your valuables." },
  { icon: Award, title: "15+ Years Experience", desc: "Trusted since 2009. Thousands of successful relocations across India." },
  { icon: TrendingUp, title: "Transparent Pricing", desc: "No hidden charges. Get accurate quotes upfront before we begin." },
  { icon: HeartHandshake, title: "Dedicated Support", desc: "24/7 customer support throughout your move. We're always reachable." },
  { icon: Zap, title: "Fast Processing", desc: "Quick booking, swift packing, and express delivery options available." },
];

const testimonials = [
  { name: "Rajesh Kumar", city: "Mumbai", rating: 5, text: "Excellent service! My household shifting from Ahmedabad to Mumbai was smooth and hassle-free. The team packed everything carefully and delivered on time. Highly recommended packers and movers!" },
  { name: "Priya Sharma", city: "Delhi", rating: 5, text: "Very professional team. They handled my office relocation perfectly within the timeline. All equipment arrived safely. Best corporate movers I've worked with." },
  { name: "Amit Patel", city: "Bangalore", rating: 5, text: "Best packers and movers I've used. Transparent pricing, careful handling, and real-time tracking made the whole experience stress-free." },
  { name: "Sunita Verma", city: "Hyderabad", rating: 5, text: "Used RK Cargo for vehicle transport. My car was delivered in perfect condition. The GPS tracking feature gave me complete peace of mind throughout." },
  { name: "Vikram Singh", city: "Pune", rating: 5, text: "Affordable rates and excellent service. The warehousing facility was clean and well-maintained. Will definitely use again for future moves." },
  { name: "Meera Joshi", city: "Chennai", rating: 5, text: "Relocated my entire home from Ahmedabad to Chennai. The team was punctual, professional, and handled all fragile items with extra care. 5 stars!" },
];

const cities = [
  "Ahmedabad", "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad",
  "Pune", "Kolkata", "Surat", "Jaipur", "Lucknow", "Chandigarh",
  "Indore", "Bhopal", "Nagpur", "Vadodara", "Rajkot", "Coimbatore",
];

const faqs = [
  {
    q: "How much do packers and movers charge in Ahmedabad?",
    a: "Packers and movers charges in Ahmedabad typically range from ₹5,000 to ₹30,000 depending on the volume of goods, distance, and services required. RK Cargo offers transparent pricing with no hidden charges. Contact us for a free quote.",
  },
  {
    q: "How do I track my parcel with RK Cargo?",
    a: "You can track your parcel by visiting our tracking page and entering your LR number or registered phone number to get real-time shipment status updates.",
  },
  {
    q: "Does RK Cargo provide insurance for goods during transit?",
    a: "Yes, RK Cargo provides 100% insurance coverage for all goods during transit, ensuring complete peace of mind for our customers.",
  },
  {
    q: "Which cities does RK Cargo serve?",
    a: "RK Cargo serves 200+ cities across India including Ahmedabad, Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune, Kolkata, Surat, Jaipur and many more.",
  },
  {
    q: "How long does household shifting take?",
    a: "Local moves within Ahmedabad take 1-2 days. Inter-city moves across India typically take 3-7 days depending on the distance.",
  },
  {
    q: "Do you offer packing materials?",
    a: "Yes, we provide high-quality packing materials including bubble wrap, corrugated boxes, stretch film, and foam padding to ensure your goods are fully protected.",
  },
];

const stats = [
  { value: "15+",  label: "Years Experience",  desc: "Trusted since 2009",          icon: Award },
  { value: "50K+", label: "Happy Customers",   desc: "Across India",                icon: Users },
  { value: "200+", label: "Cities Covered",    desc: "PAN India network",           icon: MapPin },
  { value: "99%",  label: "Satisfaction Rate", desc: "Verified customer reviews",   icon: Star },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const FAQ = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      layout
      className="border border-border rounded-2xl overflow-hidden bg-card"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left gap-4"
        aria-expanded={open}
      >
        <span className="font-semibold text-foreground text-sm md:text-base">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-accent shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />}
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed"
        >
          {a}
        </motion.div>
      )}
    </motion.div>
  );
};

const Index = () => {
  const [reviews, setReviews] = useState<any[]>([]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setReviews(data);
      } else {
        // Fallback to static testimonials
        setReviews(testimonials.map((t, idx) => ({
          id: -idx,
          name: t.name,
          rating: t.rating,
          review: t.text,
          city: t.city || "Verified Customer",
          admin_reply: null,
          created_at: new Date().toISOString()
        })));
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      // Fallback
      setReviews(testimonials.map((t, idx) => ({
        id: -idx,
        name: t.name,
        rating: t.rating,
        review: t.text,
        city: t.city || "Verified Customer",
        admin_reply: null,
        created_at: new Date().toISOString()
      })));
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <PublicLayout>
      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden" aria-label="Hero">
        <img
          src={heroBg}
          alt="RK Cargo Packers and Movers fleet - trusted logistics across India"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 gradient-hero" />

        {/* CSS-animated orbs — GPU composited (transform+opacity only) */}
        <div className="animate-orb-up absolute top-20 right-20 w-64 h-64 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
        <div className="animate-orb-down absolute bottom-20 right-40 w-48 h-48 rounded-full bg-primary/30 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 text-accent-foreground text-sm font-medium mb-6"
            >
              <Truck className="w-4 h-4" /> Trusted Packers & Movers Since 2009
            </motion.div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-tight mb-4">
              RK Cargo<br />
              <span className="text-accent">Packers & Movers</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-3 max-w-lg">
              India's most trusted household shifting, office relocation, vehicle transport &amp; warehousing company. Serving 200+ cities with 15+ years of experience.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {["Fully Insured", "On-Time Delivery", "No Hidden Charges", "PAN India"].map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="inline-flex items-center gap-1 text-xs bg-white/10 text-primary-foreground px-3 py-1 rounded-full border border-white/20"
                >
                  <CheckCircle className="w-3 h-3 text-accent" /> {tag}
                </motion.span>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              <Link to="/tracking">
                <Button size="lg" className="gradient-accent text-accent-foreground border-0 gap-2 font-semibold shadow-lg hover:opacity-90 animate-pulse-glow">
                  <Search className="w-4 h-4" /> Track Parcel
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" className="bg-white text-primary font-semibold shadow-lg hover:bg-white/90 gap-2 border-0">
                  <FileText className="w-4 h-4" /> Get Free Quote
                </Button>
              </Link>
              <a href="tel:+919227807476">
                <Button size="lg" className="bg-white/15 border border-white/30 text-white hover:bg-white/25 gap-2 backdrop-blur-sm">
                  <Phone className="w-4 h-4" /> Call Now
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="py-2 bg-card border-b border-border shadow-sm" aria-label="Company statistics">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {stats.map((s, i) => (
              <StatCounter key={s.label} value={s.value} label={s.label} icon={s.icon} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-20 bg-background" id="services" aria-labelledby="services-heading">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">What We Offer</motion.p>
            <motion.h2 id="services-heading" variants={fadeUp} custom={1} className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Packers & Movers Services Across India
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground mt-3 max-w-2xl mx-auto text-sm md:text-base">
              From household shifting in Ahmedabad to PAN India cargo delivery — we offer end-to-end relocation and logistics solutions tailored to your needs.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.article
                key={s.title}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6, scale: 1.02 }}
                className="bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-elevated transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <s.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2 text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{s.desc}</p>
                <p className="text-xs text-accent/70 italic">{s.keywords}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-20 gradient-primary" aria-labelledby="why-heading">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Why RK Cargo</motion.p>
            <motion.h2 id="why-heading" variants={fadeUp} custom={1} className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">
              Why Choose RK Cargo Packers and Movers?
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-primary-foreground/70 mt-3 max-w-2xl mx-auto text-sm md:text-base">
              We're not just movers — we're your relocation partners. Here's what makes us the best packers and movers in Ahmedabad and across India.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((w, i) => (
              <motion.div key={w.title} variants={fadeUp} custom={i} whileHover={{ scale: 1.04, y: -4 }} className="glass-card p-6 text-center cursor-default">
                <div className="w-14 h-14 rounded-full gradient-accent flex items-center justify-center mx-auto mb-4">
                  <w.icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="font-display font-semibold text-primary-foreground mb-2">{w.title}</h3>
                <p className="text-sm text-primary-foreground/70">{w.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 bg-muted" aria-labelledby="process-heading">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Simple Process</motion.p>
            <motion.h2 id="process-heading" variants={fadeUp} custom={1} className="font-display text-3xl md:text-4xl font-bold text-foreground">
              How Our Relocation Process Works
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm">
              Moving made simple in 4 easy steps. From booking to delivery, we handle everything.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">

            {/* Dashed connector line on desktop */}
            <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-px border-t-2 border-dashed border-border z-0" />

            {[
              {
                step: "01", icon: FileText, color: "from-blue-500 to-blue-600",
                title: "Get Free Quote",
                desc: "Contact us or fill the form. We'll provide a transparent, no-obligation quote within hours.",
                tag: "Takes 2 mins",
              },
              {
                step: "02", icon: Clock, color: "from-violet-500 to-violet-600",
                title: "Schedule Your Move",
                desc: "Pick a date that works for you. Our team confirms and plans every detail of your move.",
                tag: "Flexible dates",
              },
              {
                step: "03", icon: Package, color: "from-orange-500 to-orange-600",
                title: "Expert Packing",
                desc: "Our trained packers arrive on time with quality materials to safely pack all your belongings.",
                tag: "Zero damage",
              },
              {
                step: "04", icon: Truck, color: "from-green-500 to-green-600",
                title: "Safe Delivery",
                desc: "Your goods are transported and delivered safely. Track your shipment in real-time.",
                tag: "On-time guaranteed",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6, scale: 1.02 }}
                className="relative z-10 bg-card rounded-2xl border border-border shadow-card p-6 flex flex-col gap-4 cursor-default group"
              >
                {/* Step badge */}
                <div className="flex items-start justify-between">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="font-display font-black text-4xl text-border select-none leading-none">{item.step}</span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-foreground text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>

                {/* Tag */}
                <div className="mt-auto">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3" /> {item.tag}
                  </span>
                </div>

                {/* Arrow connector for desktop */}
                {i < 3 && (
                  <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-card border border-border items-center justify-center shadow-sm">
                    <ArrowRight className="w-4 h-4 text-accent" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-background" aria-labelledby="testimonials-heading">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Customer Reviews</motion.p>
            <motion.h2 id="testimonials-heading" variants={fadeUp} custom={1} className="font-display text-3xl md:text-4xl font-bold text-foreground">
              What Our Customers Say About Us
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm">
              Over 50,000 happy customers across India trust RK Cargo for their relocation needs. Read their experiences.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.slice(0, 6).map((r, i) => (
              <motion.article key={r.id} variants={fadeUp} custom={i} whileHover={{ y: -4, scale: 1.01 }} className="bg-card rounded-2xl p-6 shadow-card border border-border cursor-default flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 italic">"{r.review}"</p>
                  
                  {r.admin_reply && (
                    <div className="mt-4 p-3 rounded-lg bg-muted text-xs border-l-2 border-accent">
                      <p className="font-semibold text-foreground mb-1">Reply from RK Cargo:</p>
                      <p className="text-muted-foreground italic">"{r.admin_reply}"</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/50">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.city || "Verified Customer"}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          <div className="text-center mt-10">
            <Link to="/reviews">
              <Button className="gradient-accent text-accent-foreground font-semibold border-0 px-6 py-2.5 shadow-md hover:opacity-90">
                View All Reviews
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Service Areas ── */}
      <section className="py-20 bg-muted" aria-labelledby="cities-heading">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Service Areas</motion.p>
            <motion.h2 id="cities-heading" variants={fadeUp} custom={1} className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Packers & Movers Across India
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground mt-3 max-w-2xl mx-auto text-sm">
              RK Cargo provides professional packers and movers services in 200+ cities. Whether you're moving locally in Ahmedabad or relocating across India, we've got you covered.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex flex-wrap justify-center gap-3">
            {cities.map((city, i) => (
              <motion.span
                key={city}
                variants={fadeUp}
                custom={i}
                whileHover={{ scale: 1.08, y: -2 }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-card border border-border rounded-full text-sm text-foreground hover:border-accent hover:text-accent transition-colors cursor-default shadow-sm"
              >
                <MapPin className="w-3.5 h-3.5 text-accent" /> {city}
              </motion.span>
            ))}
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-muted-foreground text-sm mt-6"
          >
            + 180 more cities across India. <Link to="/contact" className="text-accent underline underline-offset-2">Contact us</Link> to check availability in your city.
          </motion.p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-background" aria-labelledby="faq-heading">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">FAQ</motion.p>
            <motion.h2 id="faq-heading" variants={fadeUp} custom={1} className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Frequently Asked Questions
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground mt-3 text-sm">
              Common questions about our packers and movers services, pricing, and process.
            </motion.p>
          </motion.div>
          <div className="flex flex-col gap-3">
            {faqs.map((faq) => (
              <FAQ key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SEO Content Block ── */}
      <section className="py-16 bg-background" aria-label="About RK Cargo Packers and Movers">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="seo-content-block"
          >
            {/* Decorative accent line */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-10 rounded-full gradient-accent" />
              <div>
                <p className="text-xs text-accent font-semibold uppercase tracking-widest">About RK Cargo</p>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  Best Packers and Movers in Ahmedabad
                </h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground leading-relaxed">
              <div className="space-y-4">
                <p>
                  <strong className="text-foreground">RK Cargo Packers and Movers</strong> is one of the most trusted relocation companies in Ahmedabad, Gujarat. With over 15 years of experience, we've completed more than 50,000 shipments across India — covering household shifting, office relocation, vehicle transport, and warehousing.
                </p>
                <p>
                  As a leading <strong className="text-foreground">packers and movers in Ahmedabad</strong>, we understand every move is unique. Our expert team uses high-quality packing materials and modern transport equipment to safeguard your belongings throughout the journey.
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  Our <strong className="text-foreground">PAN India network</strong> covers 200+ cities — Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune, Kolkata, Surat, Jaipur, and more. Competitive pricing, complete transparency, no hidden charges, and every shipment fully insured.
                </p>
                <p>
                  Looking for <strong className="text-foreground">affordable packers and movers near you</strong>? Call us at{" "}
                  <a href="tel:+919227807476" className="text-accent font-medium hover:underline">+91-92278-07476</a>{" "}
                  or fill our online form. Our team is available 7 days a week.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-foreground" aria-label="Call to action">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Get Started Today</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-background mb-4">
              Ready to Move? Get a Free Quote Today!
            </h2>
            <p className="text-background/60 mb-8 max-w-md mx-auto">
              Join 50,000+ satisfied customers who trusted RK Cargo for their relocation. Safe, reliable, and affordable packers and movers across India.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/contact">
                <Button size="lg" className="gradient-primary text-white border-0 font-semibold gap-2 shadow-lg hover:opacity-90">
                  Get Free Quotation <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="tel:+919227807476">
                <Button size="lg" className="bg-background/10 border border-background/20 text-background hover:bg-background/20 gap-2">
                  <Phone className="w-4 h-4" /> +91-92278-07476
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Index;
