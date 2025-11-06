import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthorApi, BookApi } from "../api/client";
import { useAuth } from "../auth/AuthContext";

const SIMPLE_SORT = [
  { value: "title_asc", label: "Title ↑" },
  { value: "title_desc", label: "Title ↓" },
  { value: "date_asc", label: "Published date ↑" },
  { value: "date_desc", label: "Published date ↓" },
  { value: "author_asc", label: "Author ↑" },
  { value: "author_desc", label: "Author ↓" },
];

const SEARCH_SORT_BY = [
  { value: "Title", label: "Title" },
  { value: "PublishedDate", label: "Published date" },
  { value: "AuthorName", label: "Author name" },
];

const SEARCH_DIRECTION = [
  { value: "Asc", label: "↑ Asc" },
  { value: "Desc", label: "↓ Desc" },
];

export default function BookList() {
  const [rows, setRows] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const { hasRole, isAuth } = useAuth();
  const canEditDelete = isAuth && hasRole("Urednik");

  const [simpleSort, setSimpleSort] = useState("title_asc");

  const [q, setQ] = useState({
    titleContains: "",
    publishedFrom: "",
    publishedTo: "",
    authorId: "",
    authorNameContains: "",
    authorBornFrom: "",
    authorBornTo: "",
    sortBy: "Title",
    direction: "Asc",
  });

  const setField = (k, v) => setQ((s) => ({ ...s, [k]: v }));

  const loadAuthors = async () => {
    try {
      const data = await AuthorApi.getAll();
      setAuthors(Array.isArray(data) ? data : []);
    } catch (e) {
      console.warn("Authors load failed:", e?.message);
    }
  };

  const loadSorted = async (sort = simpleSort) => {
    try {
      setLoading(true);
      const data = await BookApi.getAllSorted(sort);
      setRows(Array.isArray(data) ? data : []);
      setErr("");
    } catch (e) {
      setErr(
        e?.response?.data?.detail || e?.response?.data?.title || e.message
      );
    } finally {
      setLoading(false);
    }
  };

  const cleanPayload = (x) => {
    const p = { ...x };

    if (p.authorId === "" || p.authorId === null) delete p.authorId;
    else p.authorId = Number(p.authorId);

    Object.keys(p).forEach((k) => {
      if (p[k] === "" || p[k] === undefined || p[k] === null) delete p[k];
    });
    return p;
  };

  const runSearch = async () => {
    try {
      setLoading(true);
      const payload = cleanPayload(q);
      const data = await BookApi.search(payload);
      setRows(Array.isArray(data) ? data : []);
      setErr("");
    } catch (e) {
      setErr(
        e?.response?.data?.detail || e?.response?.data?.title || e.message
      );
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = async () => {
    setQ({
      titleContains: "",
      publishedFrom: "",
      publishedTo: "",
      authorId: "",
      authorNameContains: "",
      authorBornFrom: "",
      authorBornTo: "",
      sortBy: "Title",
      direction: "Asc",
    });
    setSimpleSort("title_asc");
    await loadSorted("title_asc");
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this book")) return;
    try {
      await BookApi.remove(id);
      if (isInSearchMode()) await runSearch();
      else await loadSorted(simpleSort);
    } catch (err) {
      alert(err?.response?.data?.error || "Delete failed.");
    }
  };

  const isInSearchMode = () => {
    const {
      titleContains,
      publishedFrom,
      publishedTo,
      authorId,
      authorNameContains,
      authorBornFrom,
      authorBornTo,
    } = q;
    return !!(
      titleContains ||
      publishedFrom ||
      publishedTo ||
      authorId ||
      authorNameContains ||
      authorBornFrom ||
      authorBornTo
    );
  };

  useEffect(() => {
    loadAuthors();
    loadSorted("title_asc");
  }, []);

  useEffect(() => {
    if (!isInSearchMode()) loadSorted(simpleSort);
  }, [simpleSort]);

  if (loading && rows.length === 0)
    return <div className="p-4">Loading books…</div>;
  if (err) return <div className="p-4 text-red-600">Error: {err}</div>;

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <h1 className="text-xl">Books</h1>

        <div className="flex items-center gap-2">
          <span className="text-sm">Sort:</span>
          <select
            className="border p-2 rounded"
            value={simpleSort}
            onChange={(e) => setSimpleSort(e.target.value)}
            disabled={isInSearchMode()}
          >
            {SIMPLE_SORT.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <Link className="btn btn--primary ml-auto" to="/books/create">
          Create
        </Link>
      </div>

      <div className="mb-4 p-3 border rounded grid gap-3">
        {" "}
        <div className="font-semibold">Advanced search (optional)</div>
        <div className="grid md:grid-cols-3 gap-3">
          <label className="grid gap-1">
            <span>Title contains</span>
            <input
              className="border p-2 rounded"
              value={q.titleContains}
              onChange={(e) => setField("titleContains", e.target.value)}
            />
          </label>

          <label className="grid gap-1">
            <span>Published from</span>
            <input
              type="date"
              className="border p-2 rounded"
              value={q.publishedFrom}
              onChange={(e) => setField("publishedFrom", e.target.value)}
            />
          </label>

          <label className="grid gap-1">
            <span>Published to</span>
            <input
              type="date"
              className="border p-2 rounded"
              value={q.publishedTo}
              onChange={(e) => setField("publishedTo", e.target.value)}
            />
          </label>

          <label className="grid gap-1">
            <span>Author</span>
            <select
              className="border p-2 rounded"
              value={q.authorId}
              onChange={(e) => setField("authorId", e.target.value)}
            >
              <option value="">-- any --</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.fullName}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span>Author name contains</span>
            <input
              className="border p-2 rounded"
              value={q.authorNameContains}
              onChange={(e) => setField("authorNameContains", e.target.value)}
            />
          </label>

          <label className="grid gap-1">
            <span>Author born from</span>
            <input
              type="date"
              className="border p-2 rounded"
              value={q.authorBornFrom}
              onChange={(e) => setField("authorBornFrom", e.target.value)}
            />
          </label>

          <label className="grid gap-1">
            <span>Author born to</span>
            <input
              type="date"
              className="border p-2 rounded"
              value={q.authorBornTo}
              onChange={(e) => setField("authorBornTo", e.target.value)}
            />
          </label>

          <label className="grid gap-1">
            <span>Sort by</span>
            <select
              className="border p-2 rounded"
              value={q.sortBy}
              onChange={(e) => setField("sortBy", e.target.value)}
            >
              {SEARCH_SORT_BY.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span>Direction</span>
            <select
              className="border p-2 rounded"
              value={q.direction}
              onChange={(e) => setField("direction", e.target.value)}
            >
              {SEARCH_DIRECTION.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex gap-2">
          <button className="btn btn--primary" onClick={runSearch}>
            Search
          </button>
          <button className="btn btn--ghost" onClick={resetFilters}>
            Clear
          </button>
          {isInSearchMode() && (
            <div className="text-sm text-gray-600 ml-2">
              (Tip: dok je pretraga aktivna, gore levo "Sort" je isključen —
              koristite Sort by / Direction ovde.)
            </div>
          )}
        </div>
      </div>

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
                {canEditDelete && (
                  <>
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
                  </>
                )}
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
