import React, { useEffect, useState } from "react";
import { AuthorApi } from "../api/client";

export default function AuthorsList() {
  const [page, setPage] = useState({
    items: [],
    pageNumber: 1,
    pageSize: 5,
    totalPages: 1,
    totalCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async (pageNumber = 1, pageSize = 5) => {
    try {
      setLoading(true);
      const data = await AuthorApi.getPage(pageNumber, pageSize);
      setPage(data);
    } catch (e) {
      setErr(
        e?.response?.data?.detail || e?.response?.data?.title || e.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1, page.pageSize);
  }, []);

  const prev = () =>
    page.pageNumber > 1 && load(page.pageNumber - 1, page.pageSize);
  const next = () =>
    page.pageNumber < page.totalPages &&
    load(page.pageNumber + 1, page.pageSize);

  if (loading) return <div className="p-4 loading">Loading authors…</div>;
  if (err) return <div className="p-4 text-danger">Error: {err}</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl heading-bar mb-4">Authors</h1>

      <table>
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Full name</th>
            <th className="p-2">Birthday</th>
            <th className="p-2">Biography</th>
          </tr>
        </thead>
        <tbody>
          {page.items.map((a) => (
            <tr key={a.id} className="border-b">
              <td className="p-2">{a.fullName}</td>
              <td className="p-2">{a.dateOfBirth?.slice(0, 10)}</td>
              <td className="p-2">{a.biography}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center gap-3 mt-2">
        <button
          className="btn btn--ghost btn-sm"
          onClick={prev}
          disabled={!page || page.pageNumber <= 1}
        >
          Prev
        </button>
        <span>
          Page <strong>{page.pageNumber}</strong> of{" "}
          <strong>{page.totalPages}</strong>
        </span>
        <button
          className="btn btn--primary btn-sm"
          onClick={next}
          disabled={!page || page.pageNumber >= page.totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
