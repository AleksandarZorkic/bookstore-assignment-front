import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5234/",
  headers: { "Content-Type": "application/json" },
});

export const BookApi = {
  getAll: () => api.get("/api/Books").then((res) => res.data),
  getOne: (id) => api.get(`/api/Books/${id}`).then((res) => res.data),
  create: (payload) => api.post("/api/Books", payload).then((res) => res.data),
  update: (id, payload) =>
    api.put(`/api/Books/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/api/Books/${id}`).then((res) => res.data),
};

export const AuthorApi = {
  getAll: () => api.get("/api/Authors").then((r) => r.data),
  getOne: (id) => api.get(`/api/Authors/${id}`).then((r) => r.data),
  create: (payload) => api.post("/api/Authors", payload).then((r) => r.data),
};

export const PublisherApi = {
  getAll: () => api.get("/api/Publishers").then((r) => r.data),
  getOne: (id) => api.get(`/api/Publishers/${id}`).then((r) => r.data),
  create: (payload) => api.post("/api/Publishers", payload).then((r) => r.data),
};
