"use client";

import { useEffect, useState } from "react";
import { Star, Trash2, Eye } from "lucide-react";
import Link from "next/link";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = () => {
    fetch("/api/admin/reviews")
      .then((r) => r.json())
      .then((data) => setReviews(data.reviews || []));
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    fetchReviews();
  };

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-abby-black mb-8">Reviews</h1>

      <div className="bg-white rounded-sm border border-abby-stone overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-abby-stone">
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-abby-black/50">Product</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-abby-black/50">User</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-abby-black/50">Rating</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-abby-black/50">Comment</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-abby-black/50">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-abby-black/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review: any) => (
                <tr key={review.id} className="border-b border-abby-stone last:border-0 hover:bg-abby-cream/50">
                  <td className="px-6 py-4">
                    <Link href={`/product/${review.product?.id}`} className="text-sm font-semibold text-abby-gold hover:underline">
                      {review.product?.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-abby-black">{review.user?.name || review.user?.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${s <= review.rating ? "text-abby-gold fill-abby-gold" : "text-abby-stone"}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-abby-black/50 max-w-xs truncate">{review.comment || "—"}</td>
                  <td className="px-6 py-4 text-sm text-abby-black/50">{new Date(review.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/product/${review.product?.id}`} className="p-2 text-abby-black/50 hover:text-abby-gold transition-colors">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button onClick={() => deleteReview(review.id)} className="p-2 text-abby-black/50 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
