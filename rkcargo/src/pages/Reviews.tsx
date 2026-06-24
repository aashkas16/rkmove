import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import PublicLayout from "@/components/layout/PublicLayout";
import { API_BASE_URL } from "@/config";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const Reviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [formName, setFormName] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formReview, setFormReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setReviews(data);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formReview) {
      toast.error("Please fill out all fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          rating: formRating,
          review: formReview
        })
      });
      if (res.ok) {
        toast.success("Thank you! Your review has been submitted for approval.");
        setFormName("");
        setFormRating(5);
        setFormReview("");
        setShowReviewModal(false);
        fetchReviews(); // Reload list
      } else {
        toast.error("Failed to submit review. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      {/* ── Hero ── */}
      <section className="py-20 gradient-primary relative overflow-hidden" aria-label="Customer Reviews">
        <div className="animate-orb-up-slow absolute top-8 right-12 w-52 h-52 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">Testimonials</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Customer Reviews
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-6">
              Hear directly from our verified clients about their shifting and transport experiences with RK Cargo.
            </p>
            <Button
              onClick={() => setShowReviewModal(true)}
              className="gradient-accent text-accent-foreground font-semibold border-0 px-6 py-2.5 shadow-md hover:opacity-90 animate-pulse-glow"
            >
              Write a Review
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Reviews List ── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center text-muted-foreground py-10">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">No reviews yet. Be the first to write a review!</div>
          ) : (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((r, i) => (
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
          )}
        </div>
      </section>

      {/* Write a Review Dialog Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-md w-[90vw] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold text-center">Share Your Experience</DialogTitle>
            <DialogDescription className="text-center text-xs text-muted-foreground">
              Your feedback helps us serve you better
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitReview} className="space-y-4 mt-2">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Your Name *</label>
              <Input
                type="text"
                placeholder="Enter your name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Rating *</label>
              <div className="flex gap-1.5 items-center">
                {Array.from({ length: 5 }).map((_, idx) => {
                  const starValue = idx + 1;
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setFormRating(starValue)}
                      className="p-0.5 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          starValue <= formRating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300 hover:text-amber-300"
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="text-xs font-semibold text-muted-foreground ml-2">
                  {formRating} / 5 Stars
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Review Description *</label>
              <Textarea
                placeholder="Describe your shifting or transport experience..."
                value={formReview}
                onChange={(e) => setFormReview(e.target.value)}
                className="min-h-[100px] resize-y"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full gradient-accent text-accent-foreground font-semibold border-0 py-2.5 shadow-md animate-pulse-glow"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </PublicLayout>
  );
};

export default Reviews;
