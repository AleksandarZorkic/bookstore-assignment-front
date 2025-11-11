import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ComicsApi } from "../api/client";

export default function IssueCreateForm() {
  const { state } = useLocation();
  const nav = useNavigate();
  const issue = state?.issue;

  const [form, setForm] = useState(() => ({
    externalIssueId: issue?.externalId ?? 0,
    title: issue?.name ?? "",
    releaseDate: issue?.coverDate?.slice?.(0, 10) ?? "",
    issueNumber: issue?.issueNumber ?? "",
    coverImageUrl: issue?.coverImageUrl ?? "",
    description: issue?.description ?? "",
    pageCount: "",
    price: "",
    stock: 0,
  }));
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const setField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      setLoading(true);
      const payload = {
        ...form,
        pageCount: form.pageCount ? Number(form.pageCount) : null,
        price: form.price ? Number(form.price) : null,
        stock: Number(form.stock || 0),
      };
      await ComicsApi.saveIssue(payload);
      nav("/books");
    } catch (ex) {
      setErr(ex?.response?.data?.detail || ex?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  if (!issue) return <div className="p-4">No issue selected.</div>;

  return (
    <div className="p-4 max-w-xl">
      <h1 className="text-xl mb-3">Save comic issue</h1>
      {err && <div className="mb-2 text-red-600">{err}</div>}
      <form className="grid gap-3" onSubmit={onSubmit}>
        <label className="grid gap-1">
          <span>Title</span>
          <input
            className="border p-2 rounded"
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
          />
        </label>
        <label className="grid gap-1">
          <span>Release date</span>
          <input
            type="date"
            className="border p-2 rounded"
            value={form.releaseDate}
            onChange={(e) => setField("releaseDate", e.target.value)}
          />
        </label>
        <label className="grid gap-1">
          <span>Issue number</span>
          <input
            className="border p-2 rounded"
            value={form.issueNumber}
            onChange={(e) => setField("issueNumber", e.target.value)}
          />
        </label>
        <label className="grid gap-1">
          <span>Cover image URL</span>
          <input
            className="border p-2 rounded"
            value={form.coverImageUrl}
            onChange={(e) => setField("coverImageUrl", e.target.value)}
          />
        </label>
        <label className="grid gap-1">
          <span>Description</span>
          <textarea
            className="border p-2 rounded"
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
          />
        </label>
        <div className="grid md:grid-cols-3 gap-3">
          <label className="grid gap-1">
            <span>Page count</span>
            <input
              type="number"
              className="border p-2 rounded"
              value={form.pageCount}
              onChange={(e) => setField("pageCount", e.target.value)}
            />
          </label>
          <label className="grid gap-1">
            <span>Price</span>
            <input
              type="number"
              step="0.01"
              className="border p-2 rounded"
              value={form.price}
              onChange={(e) => setField("price", e.target.value)}
            />
          </label>
          <label className="grid gap-1">
            <span>Stock</span>
            <input
              type="number"
              className="border p-2 rounded"
              value={form.stock}
              onChange={(e) => setField("stock", e.target.value)}
            />
          </label>
        </div>
        <div className="flex gap-2">
          <button className="btn btn--primary" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => nav(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
