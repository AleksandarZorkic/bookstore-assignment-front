import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthorApi, BookApi, PublisherApi } from "../api/client";

export default function BookForm({ mode }) {
  const isEdit = mode === "edit";
  const { id } = useParams();
  const nav = useNavigate();

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);

  const [form, setForm] = useState({
    id: 0,
    title: "",
    isbn: "",
    pageCount: 0,
    publishedDate: "",
    authorId: "",
    publisherId: "",
  });

  const setField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  useEffect(() => {
    (async () => {
      try {
        const [a, p] = await Promise.all([
          AuthorApi.getAll(),
          PublisherApi.getAll(),
        ]);
        setAuthors(Array.isArray(a) ? a : []);
        setPublishers(Array.isArray(p) ? p : []);
      } catch (e) {
        setErr(
          e?.response?.data?.detail || e?.response?.data?.title || e.message
        );
      }
    })();
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        setLoading(true);
        const data = await BookApi.getOne(id);
        setForm({
          id: data.id,
          title: data.title,
          isbn: data.isbn,
          pageCount: data.pageCount,
          publishedDate: (data.publishedDate || "").slice(0, 10),
          authorId: data.authorId ?? "",
          publisherId: data.publisherId ?? "",
        });
      } catch (e) {
        setErr(
          e?.response?.data?.detail || e?.response?.data?.title || e.message
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [isEdit, id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!form.title || !form.isbn || !form.publishedDate) {
      setErr("Please fill all required fields.");
      return;
    }
    if (!form.authorId || !form.publisherId) {
      setErr("Please choose an author and a publisher.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...(isEdit ? { id: form.id } : {}),
        title: form.title.trim(),
        isbn: form.isbn.trim(),
        pageCount: Number(form.pageCount) || 0,
        publishedDate: form.publishedDate,
        authorId: Number(form.authorId),
        publisherId: Number(form.publisherId),
      };

      if (isEdit) {
        await BookApi.update(form.id, payload);
      } else {
        await BookApi.create(payload);
      }
      nav("/books");
    } catch (e) {
      setErr(
        e?.response?.data?.detail ||
          e?.response?.data?.title ||
          e?.response?.data?.error ||
          e.message
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isEdit) return <div className="p-4">Saving...</div>;

  return (
    <div className="p-4 max-w-2xl">
      <h1 className="text-xl mb-4">{isEdit ? "Edit book" : "Create book"}</h1>
      {err && <div className="mb-3 text-red-600">{err}</div>}

      <form onSubmit={onSubmit} className="grid gap-3">
        <label className="grid gap-1">
          <span>Title *</span>
          <input
            className="border p-2 rounded"
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
          />
        </label>

        <label className="grid gap-1">
          <span>ISBN *</span>
          <input
            className="border p-2 rounded"
            value={form.isbn}
            onChange={(e) => setField("isbn", e.target.value)}
          />
        </label>

        <label className="grid gap-1">
          <span>Page count</span>
          <input
            type="number"
            min="0"
            className="border p-2 rounded"
            value={form.pageCount}
            onChange={(e) => setField("pageCount", e.target.value)}
          />
        </label>

        <label className="grid gap-1">
          <span>Published date *</span>
          <input
            type="date"
            className="border p-2 rounded"
            value={form.publishedDate}
            onChange={(e) => setField("publishedDate", e.target.value)}
          />
        </label>

        <label className="grid gap-1">
          <span>Author *</span>
          <select
            className="border p-2 rounded"
            value={form.authorId}
            onChange={(e) => setField("authorId", e.target.value)}
            required
          >
            <option value="">-- choose author --</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.fullName}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1">
          <span>Publisher *</span>
          <select
            className="border p-2 rounded"
            value={form.publisherId}
            onChange={(e) => setField("publisherId", e.target.value)}
            required
          >
            <option value="">-- choose publisher --</option>
            {publishers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <div className="flex gap-2 mt-2">
          <button
            className="px-4 py-2 rounded bg-black text-white"
            disabled={loading}
          >
            {isEdit ? "Save changes" : "Create"}
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded border"
            onClick={() => nav("/books")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
