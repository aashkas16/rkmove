import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Package, MapPin, Truck, CreditCard, CheckCircle2,
  Clock, AlertCircle, Shield, Phone, Zap, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import { API_BASE_URL } from "@/config";


const statusSteps = [
  { key: "Booked",           label: "Booked",           icon: Package },
  { key: "Packed",           label: "Packed",           icon: CheckCircle2 },
  { key: "In Transit",       label: "In Transit",       icon: Truck },
  { key: "Reached Hub",      label: "Reached Hub",      icon: MapPin },
  { key: "Out for Delivery", label: "Out for Delivery", icon: Truck },
  { key: "Delivered",        label: "Delivered",        icon: CheckCircle2 },
];

const statusColorMap: Record<string, string> = {
  Booked:            "bg-muted text-muted-foreground",
  Packed:            "bg-primary/10 text-primary",
  "In Transit":      "bg-accent/10 text-accent",
  "Reached Hub":     "bg-primary/10 text-primary",
  "Out for Delivery":"bg-accent/10 text-accent",
  Delivered:         "bg-[hsl(142,70%,45%)]/10 text-[hsl(142,70%,35%)]",
};

const trackingFeatures = [
  { icon: Zap,    title: "Real-Time Updates", desc: "Live status at every stage of the journey." },
  { icon: Shield, title: "Fully Insured",     desc: "Every parcel is 100% insured end-to-end." },
  { icon: MapPin, title: "Live Location",     desc: "Know exactly where your parcel is right now." },
  { icon: Phone,  title: "24/7 Support",      desc: "Call or WhatsApp us anytime for help." },
];

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const Tracking = () => {
  const [query,    setQuery]    = useState("");
  const [result,   setResult]   = useState<any>(null);
  const [searched, setSearched] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(false);
    const trimmed = query.trim();
    try {
      const res = await fetch(`${API_BASE_URL}/track?query=${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        setResult(null);
      }
    } catch (err) {
      console.error(err);
      setResult(null);
    }
    setSearched(true);
    setLoading(false);
  };

  const currentStepIndex = statusSteps.findIndex((s) => s.key === result?.status);

  return (
    <PublicLayout>

      {/* ── Hero ── */}
      <section className="py-20 gradient-primary relative overflow-hidden">
        {/* CSS-animated orbs — GPU composited */}
        <div className="animate-orb-up absolute top-8 right-16 w-56 h-56 rounded-full bg-accent/25 blur-3xl pointer-events-none" />
        <div className="animate-orb-down absolute bottom-4 left-12 w-40 h-40 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-xl mx-auto">
            <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Search className="w-7 h-7 text-accent-foreground" />
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-3">Track Your Parcel</h1>
            <p className="text-primary-foreground/70 mb-8">
              Enter your LR Number or registered Phone Number to get real-time shipment status from RK Cargo Packers and Movers.
            </p>
            <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
              <Input
                placeholder="LR Number or Phone..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 h-12"
                required
              />
              <Button type="submit" size="lg" className="gradient-accent text-accent-foreground border-0 px-6" disabled={loading}>
                {loading ? <Clock className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              </Button>
            </form>
            <p className="text-primary-foreground/50 text-xs mt-3">Your LR number is printed on your booking receipt</p>
          </motion.div>
        </div>
      </section>

      {/* ── Feature Strip ── */}
      <section className="py-10 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trackingFeatures.map((f, i) => (
              <motion.div key={f.title} variants={fadeUp} custom={i} whileHover={{ y: -3, scale: 1.02 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-background border border-border cursor-default">
                <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                  <f.icon className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{f.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Results ── */}
      <section className="py-16 bg-background min-h-[40vh]">
        <div className="container mx-auto px-4 max-w-3xl">
          <AnimatePresence mode="wait">

            {/* Loading */}
            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-20">
                <div className="w-16 h-16 rounded-full border-4 border-accent border-t-transparent animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Searching for your parcel...</p>
              </motion.div>
            )}

            {/* Idle */}
            {!loading && !searched && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-5 shadow-lg">
                  <Package className="w-10 h-10 text-primary-foreground" />
                </motion.div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">Enter Your Tracking Details</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">Use the search box above to track your parcel by LR number or phone number.</p>
              </motion.div>
            )}

            {/* Not found */}
            {!loading && searched && !result && (
              <motion.div key="not-found" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-20">
                <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4 animate-float">
                  <AlertCircle className="w-10 h-10 text-destructive" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">No Parcel Found</h3>
                <p className="text-muted-foreground text-sm mb-6">Please check your LR number or phone number and try again.</p>
                <Link to="/contact">
                  <Button className="gradient-primary text-white gap-2">
                    <Phone className="w-4 h-4" /> Contact Support
                  </Button>
                </Link>
              </motion.div>
            )}

            {/* Result */}
            {!loading && searched && result && (
              <motion.div key="result" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">LR Number</p>
                    <p className="font-display font-bold text-xl text-foreground">{result.lr_number}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColorMap[result.status] || ""}`}>
                    {result.status}
                  </span>
                </div>

                {/* Timeline */}
                <div className="bg-card rounded-2xl border border-border shadow-elevated p-6 mb-6">
                  <h3 className="font-display font-semibold text-foreground mb-6">Shipment Progress</h3>
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-5 left-6 right-6 h-1 bg-muted rounded-full" />
                    <motion.div className="absolute top-5 left-6 h-1 gradient-accent rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                      style={{ maxWidth: "calc(100% - 48px)" }}
                    />
                    {statusSteps.map((step, i) => {
                      const isComplete = i <= currentStepIndex;
                      const isCurrent  = i === currentStepIndex;
                      return (
                        <motion.div key={step.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + i * 0.15 }} className="flex flex-col items-center z-10 relative">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isCurrent  ? "gradient-accent text-accent-foreground shadow-lg animate-pulse-glow"
                            : isComplete ? "gradient-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"}`}>
                            <step.icon className="w-4 h-4" />
                          </div>
                          <span className={`text-[10px] mt-2 font-medium text-center max-w-[60px] ${isComplete ? "text-foreground" : "text-muted-foreground"}`}>
                            {step.label}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="glass-card-light p-5">
                    <h4 className="font-display font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-accent" /> Route Details
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">From</span><span className="font-medium text-foreground">{result.from_location}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">To</span><span className="font-medium text-foreground">{result.to_location}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Vehicle</span><span className="font-medium text-foreground">{result.vehicle_number || "N/A"}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Current Location</span><span className="font-medium text-accent">{result.current_location || "N/A"}</span></div>
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="glass-card-light p-5">
                    <h4 className="font-display font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-accent" /> Payment Details
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Total Amount</span><span className="font-medium text-foreground">₹{Number(result.total_amount).toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Advance Paid</span><span className="font-medium text-foreground">₹{Number(result.advance_paid).toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Balance</span><span className="font-bold text-accent">₹{Number(result.balance).toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Expected Delivery</span><span className="font-medium text-foreground">{result.expected_delivery || "N/A"}</span></div>
                    </div>
                  </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                  className="mt-4 bg-card rounded-2xl border border-border p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                    <div><span className="text-muted-foreground">Customer: </span><span className="font-medium text-foreground">{result.customer_name}</span></div>
                    <div><span className="text-muted-foreground">Description: </span><span className="font-medium text-foreground">{result.description || "N/A"}</span></div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── SEO Content ── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }} className="seo-content-block">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-10 rounded-full gradient-accent" />
              <div>
                <p className="text-xs text-accent font-semibold uppercase tracking-widest">Parcel Tracking</p>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Track Your RK Cargo Shipment Online</h2>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground leading-relaxed">
              <div className="space-y-4">
                <p>RK Cargo's <strong className="text-foreground">online parcel tracking system</strong> lets you monitor your shipment in real-time at every stage — from booking and packing to transit, hub arrival, and final delivery. Simply enter your LR number or registered phone number to get instant updates.</p>
                <p>Our tracking system covers all shipments across <strong className="text-foreground">200+ cities in India</strong>. Whether you've booked household shifting, office relocation, vehicle transport, or a cargo delivery, you can track it all from one place.</p>
              </div>
              <div className="space-y-4">
                <p>Every parcel handled by <strong className="text-foreground">RK Cargo Packers and Movers</strong> is assigned a unique LR (Lorry Receipt) number at the time of booking. This number is your key to real-time tracking and payment status.</p>
                <p>Can't find your parcel? Call us at{" "}
                  <a href="tel:+919227807476" className="text-accent font-medium hover:underline">+91-92278-07476</a>{" "}
                  or <Link to="/contact" className="text-accent font-medium hover:underline">send us a message</Link>. Our support team is available 7 days a week.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </PublicLayout>
  );
};

export default Tracking;
