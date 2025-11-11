import React, { useEffect, useState } from "react";
import { ComicsApi } from "../api/client";
import { useNavigate, useParams } from "react-router-dom";

export default function IssuesSearchPage() {
  const { volumeId } = useParams();
  const nav = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await ComicsApi.getIssues(volumeId);
        setRows(Array.isArray(data) ? data : []);
      } catch (ex) {
        setErr(ex?.response?.data?.detail || ex?.message || "Load failed");
      } finally {
        setLoading(false);
      }
    })();
  }, [volumeId]);

  const openCreate = (issue) => {
    nav("/comics/issues/create", { state: { issue } });
  };

  if (loading) return <div className="p-4">Loading issues...</div>;
  if (err) return <div className="p-4 text-red-600">Error: {err}</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl mb-3">Issues of volume {volumeId}</h1>
      <table>
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Name</th>
            <th className="p-2">#</th>
            <th className="p-2">Cover date</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((i) => (
            <tr key={i.externalId} className="border-b">
              <td className="p-2">{i.name}</td>
              <td className="p-2">{i.issueNumber}</td>
              <td className="p-2">{i.coverDate?.slice?.(0, 10) ?? "-"}</td>
              <td className="p-2">
                <button
                  className="btn btn--primary btn-sm"
                  onClick={() => openCreate(i)}
                >
                  Save locally...
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
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
