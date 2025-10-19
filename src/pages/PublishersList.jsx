import React, { useEffect, useState } from "react";
import { PublisherApi } from "../api/client";

const OPTIONS = [
  { value: "NameAsc", label: "Name ↑" },
  { value: "NameDesc", label: "Name ↓" },
  { value: "AddressAsc", label: "Address ↑" },
  { value: "AddressDesc", label: "Address ↓" },
];

export default function PublishersList() {
  const [rows, setRows] = useState([]);
  const [sort, setSort] = useState("NameAsc");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async (s = sort) => {
    try {
      setLoading(true);
      const data = await PublisherApi.getAllSorted(s);
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(
        e?.response?.data?.detail || e?.response?.data?.title || e.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load("NameAsc");
  }, []);
  useEffect(() => {
    load(sort);
  }, [sort]);

  if (loading) return <div className="p-4 loading">Loading publishers…</div>;
  if (err) return <div className="p-4 text-danger">Error: {err}</div>;

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <h1 className="text-xl heading-bar">Publishers</h1>
        <select
          className="border p-2 rounded"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          {OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <table>
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Name</th>
            <th className="p-2">Address</th>
            <th className="p-2">Website</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.address}</td>
              <td className="p-2">
                <a
                  className="underline"
                  href={p.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  {p.website}
                </a>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td className="p-2" colSpan={3}>
                No data.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
