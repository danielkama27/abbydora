"use client";

import { useEffect, useState } from "react";
import { Star, Trash2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  userId: string;
  createdAt: string;
  user: { name: string | null };
}

function StarRow({ rating, size = "w-4 h-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${size} ${n <= rating ? "fill-abby-gold text-abby-gold" : "text-abby-stone"}`}
        />
      ))}
    </div>
  );
}

export function ProductReviews({ productId }: { productId: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    fetch(`/api/reviews?productId=${productId}`)
      .then((r) => r.json())
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [productId]);

  const alreadyReviewed = user && reviews.some((r) => r.userId === (user as any).id);
  const average = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to leave a review.");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to submit review");
      toast.success("Thanks for your review!");
      setRating(0);
      setComment("");
      load();
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete your review?")) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete review");
      load();
    } catch {
      toast.error("Could not delete review");
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-abby-stone">
      <div className="flex items-center gap-4 mb-10">
        <h2 className="font-serif text-3xl font-medium text-abby-black">Reviews</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <StarRow rating={Math.round(average)} />
            <span className="text-sm text-abby-black/50">
              {average.toFixed(1)} ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Existing reviews */}
        <div className="lg:col-span-2 space-y-6">
          {loading && <p className="text-abby-black/40">Loading reviews...</p>}
          {!loading && reviews.length === 0 && (
            <p className="text-abby-black/40">No reviews yet — be the first to share your thoughts.</p>
          )}
          {reviews.map((r) => (
            <div key={r.id} className="border-b border-abby-stone pb-6">
              <div className="flex items-start justify-between">
                <div>
                  <StarRow rating={r.rating} />
                  <p className="text-sm font-medium text-abby-black mt-2">{r.user.name || "Anonymous"}</p>
                  <p className="text-xs text-abby-black/40">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
                {user && r.userId === (user as any).id && (
                  <button onClick={() => handleDelete(r.id)} className="text-abby-black/30 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              {r.comment && <p className="text-abby-black/70 mt-2 leading-relaxed">{r.comment}</p>}
            </div>
          ))}
        </div>

        {/* Submission form */}
        <div>
          {!user ? (
            <p className="text-sm text-abby-black/50">
              <a href="/auth/signin" className="underline">Sign in</a> to leave a review.
            </p>
          ) : alreadyReviewed ? (
            <p className="text-sm text-abby-black/50">You've already reviewed this product.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm font-medium text-abby-black">Write a review</p>
              <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onMouseEnter={() => setHoverRating(n)}
                    onClick={() => setRating(n)}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        n <= (hoverRating || rating) ? "fill-abby-gold text-abby-gold" : "text-abby-stone"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on this product (optional)"
                rows={4}
                className="w-full px-4 py-3 border border-abby-stone bg-white text-sm focus:outline-none focus:border-abby-black"
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-abby-black text-abby-off-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-abby-black-soft transition-colors disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
