import React, { useState } from "react";

export default function ReviewModal({ book, onSubmit, onClose }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      setLoading(true);
      await onSubmit({
        rating: Number(rating),
        comment: comment?.trim() || null,
      });
      onClose();
    } catch (ex) {
      setErr(ex?.response?.data?.detail || ex?.message || "Submit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-4">
        <h2 className="text-lg font-semibold mb-3">
          Ocenite: <span className="font-normal">{book.title}</span>
        </h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}

        <form className="grid gap-3" onSubmit={submit}>
          <label className="grid gap-1">
            <span>Ocena (1–5)</span>
            <select
              className="border p-2 rounded"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span>Komentar (opciono)</span>
            <textarea
              className="border p-2 rounded"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Kratak utisak o knjizi..."
            />
          </label>

          <div className="flex gap-2 justify-end">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Otkazi
            </button>
            <button className="btn btn--primary" disabled={loading}>
              {loading ? "Slanje..." : "Posalji recenziju"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
