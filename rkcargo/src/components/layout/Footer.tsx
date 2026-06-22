import { Link } from "react-router-dom";
import { Truck, Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";

const services = [
  "Household Shifting",
  "Office Relocation",
  "Vehicle Transportation",
  "Warehousing & Storage",
  "Loading & Unloading",
  "PAN India Cargo",
];

const cities = [
  "Packers Movers Ahmedabad",
  "Packers Movers Mumbai",
  "Packers Movers Delhi",
  "Packers Movers Bangalore",
  "Packers Movers Surat",
  "Packers Movers Pune",
];

const Footer = () => (
  <footer className="bg-foreground text-background" aria-label="Footer">
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-background/10 border border-background/20 flex items-center justify-center">
              <Truck className="w-5 h-5 text-background/80" />
            </div>
            <div className="leading-tight">
              <span className="font-display font-bold text-sm">RK Cargo</span>
              <span className="block text-[10px] opacity-70 font-medium tracking-wider uppercase">Packers & Movers</span>
            </div>
          </div>
          <p className="text-sm opacity-70 leading-relaxed mb-4">
            India's trusted packers and movers since 2009. Safe, reliable, and on-time household shifting, office relocation, vehicle transport &amp; warehousing across 200+ cities.
          </p>
          <div className="flex flex-col gap-2 text-sm opacity-70">
            <a href="tel:+919227807476" className="flex items-center gap-2 hover:opacity-100 transition-opacity">
              <Phone className="w-4 h-4 shrink-0" /> +91 92278 07476
            </a>
            <a href="mailto:rkmove84@gmail.com" className="flex items-center gap-2 hover:opacity-100 transition-opacity">
              <Mail className="w-4 h-4 shrink-0" /> rkmove84@gmail.com
            </a>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <span>GF-12 Lovekush Co. Op. Soc., Chandkheda, Ahmedabad, Gujarat – 380019</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 shrink-0" /> Mon–Sun: 8:00 AM – 8:00 PM
            </div>
          </div>
          <a
            href="https://wa.me/919227807476"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[hsl(142,70%,40%)] text-white rounded-lg text-sm font-medium hover:bg-[hsl(142,70%,35%)] transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp Us
          </a>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display font-semibold mb-4 text-sm">Quick Links</h4>
          <nav aria-label="Footer navigation">
            <div className="flex flex-col gap-2">
              {[
                { l: "Home", p: "/" },
                { l: "About Us", p: "/about" },
                { l: "Track Parcel", p: "/tracking" },
                { l: "Contact Us", p: "/contact" },
                { l: "Get Free Quote", p: "/contact" },
              ].map((i) => (
                <Link key={i.l} to={i.p} className="text-sm opacity-70 hover:opacity-100 hover:text-accent transition-all">
                  {i.l}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-display font-semibold mb-4 text-sm">Our Services</h4>
          <div className="flex flex-col gap-2">
            {services.map((s) => (
              <Link key={s} to="/contact" className="text-sm opacity-70 hover:opacity-100 hover:text-accent transition-all">
                {s}
              </Link>
            ))}
          </div>
        </div>

        {/* Cities */}
        <div>
          <h4 className="font-display font-semibold mb-4 text-sm">Service Areas</h4>
          <div className="flex flex-col gap-2">
            {cities.map((c) => (
              <span key={c} className="text-sm opacity-70">{c}</span>
            ))}
            <span className="text-sm opacity-50 italic">+ 194 more cities</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs opacity-50">
        <p>© {new Date().getFullYear()} RK Cargo Packers and Movers. All rights reserved.</p>
        <p>Best Packers and Movers in Ahmedabad | PAN India Relocation Services</p>
      </div>
    </div>
  </footer>
);

export default Footer;
