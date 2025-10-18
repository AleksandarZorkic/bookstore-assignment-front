import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookApi } from "../api/client";

export default function BookList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const data = await BookApi.getAll();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setErr(err?.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this book")) return;
    try {
      await BookApi.remove(id);
      await load();
    } catch (err) {
      alert(err?.response?.data?.error || "Delete failed.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div className="p-4">Thinking...</div>;
  if (err) return <div className="p-4 text-red-600">Error: {err}</div>;

  return (
    <div>
      <h1 className="text-x1 mb-4">Books</h1>
      <table>
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Title</th>
            <th className="p-2">ISBN</th>
            <th className="p-2">Author</th>
            <th className="p-2">Publisher</th>
            <th className="p-2">Years ago</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => (
            <tr key={b.id} className="border-b">
              <td className="p-2">{b.title}</td>
              <td className="p-2">{b.isbn}</td>
              <td className="p-2">{b.authorFullName}</td>
              <td className="p-2">{b.publisherName}</td>
              <td className="p-2">{b.yearsAgo}</td>
              <td className="p-2 flex gap-2">
                <Link
                  className="btn btn--edit btn-sm"
                  to={`/books/${b.id}/edit`}
                >
                  Edit
                </Link>
                <button
                  className="btn btn--danger btn-sm"
                  onClick={() => onDelete(b.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td className="p-2" colSpan={6}>
                No data.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
