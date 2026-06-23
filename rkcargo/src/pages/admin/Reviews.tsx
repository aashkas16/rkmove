import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { toast } from "sonner";
import { Search, Trash2, CheckCircle, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { API_BASE_URL } from "@/config";

interface Review {
  id: number;
  name: string;
  rating: number;
  review: string;
  admin_reply: string | null;
  status: 'pending' | 'approved';
  created_at: string;
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [replies, setReplies] = useState<{ [id: number]: string }>({});

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/reviews`);
      const data = await res.json();
      setReviews(data || []);
      
      // Initialize replies state
      const initialReplies: { [id: number]: string } = {};
      data.forEach((r: Review) => {
        initialReplies[r.id] = r.admin_reply || "";
      });
      setReplies(initialReplies);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reviews");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/${id}/approve`, {
        method: "PUT",
      });
      if (res.ok) {
        toast.success("Review approved successfully");
        fetchReviews();
      } else {
        toast.error("Failed to approve review");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error approving review");
    }
  };

  const handleSaveReply = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/${id}/reply`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ admin_reply: replies[id] }),
      });
      if (res.ok) {
        toast.success("Admin reply saved successfully");
        fetchReviews();
      } else {
        toast.error("Failed to save reply");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving reply");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Review deleted successfully");
        fetchReviews();
      } else {
        toast.error("Failed to delete review");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting review");
    }
  };

  const handleReplyChange = (id: number, val: string) => {
    setReplies((prev) => ({ ...prev, [id]: val }));
  };

  const filtered = reviews.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.review.toLowerCase().includes(search.toLowerCase())
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search reviews by name or text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="min-w-[200px]">Review</TableHead>
                <TableHead className="min-w-[250px]">Admin Reply</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    Loading reviews...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No reviews found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((rev) => (
                  <TableRow key={rev.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p>{rev.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(rev.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{renderStars(rev.rating)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground break-words max-w-[300px]">
                      {rev.review}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 items-end">
                        <Textarea
                          placeholder="Write reply..."
                          value={replies[rev.id] || ""}
                          onChange={(e) => handleReplyChange(rev.id, e.target.value)}
                          className="min-h-[60px] text-xs resize-none"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSaveReply(rev.id)}
                          className="text-xs shrink-0"
                          variant="secondary"
                        >
                          Save
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          rev.status === "approved"
                            ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10"
                            : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/10"
                        }
                      >
                        {rev.status === "approved" ? "Approved" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {rev.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleApprove(rev.id)}
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            title="Approve Review"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(rev.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/5"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;
