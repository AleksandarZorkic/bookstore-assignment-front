import React, { useState } from "react";
import { ComicsApi } from "../api/client";
import { Link } from "react-router-dom";

export default function VolumesSearchPage() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const search = async (e) => {
    e?.preventDefault();
    if (!q.trim()) return;
    try {
      setLoading(true);
      setErr("");
      const data = await ComicsApi.searchVolumes(q.trim());
      setRows(Array.isArray(data) ? data : []);
    } catch (ex) {
      setErr(ex?.response?.data?.detail || ex?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-3">Comics — Search Volumes</h1>

      <form className="flex gap-2 mb-3" onSubmit={search}>
        <input
          className="border p-2 rounded"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. Spider-Man"
        />
        <button className="btn btn--primary">Search</button>
      </form>

      {err && <div className="text-red-600 mb-2">{err}</div>}
      {loading && <div>Searching…</div>}

      <table>
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Name</th>
            <th className="p-2">Publisher</th>
            <th className="p-2">Start year</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((v) => (
            <tr key={v.externalId} className="border-b">
              <td className="p-2">{v.name}</td>
              <td className="p-2">{v.publisher}</td>
              <td className="p-2">{v.startYear ?? "-"}</td>
              <td className="p-2">
                <Link
                  className="btn btn--primary btn-sm"
                  to={`/comics/volumes/${v.externalId}/issues`}
                >
                  View issues
                </Link>
              </td>
            </tr>
          ))}
          {rows.length === 0 && !loading && (
            <tr>
              <td className="p-2" colSpan={4}>
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
