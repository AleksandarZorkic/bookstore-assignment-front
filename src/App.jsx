import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav";
import BookList from "./pages/BooksList";
import BookForm from "./pages/BooksForm";
import { PublisherApi } from "./api/client";
import "./style/style.scss";
import AuthorsList from "./pages/AuthorsList";
import PublishersList from "./pages/PublishersList";
import LoginPage from "./pages/Login";
import Forbidden from "./pages/Forbidden";
import AuthProvider from "./auth/AuthContext";
import { PrivateRoute, RoleRoute } from "./auth/RouteGuards";
import OAuthCallback from "./auth/OAuthCallback";
import VolumesSearchPage from "./pages/VolumesSearchPage";
import IssuesSearchPage from "./pages/IssuesSearchPage";
import IssueCreateForm from "./pages/IssueCreateForm";

export default function App() {
  return (
    <AuthProvider>
      <Nav />
      <Routes>
        <Route path="/" element={<Navigate to="/books" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        <Route path="/forbidden" element={<Forbidden />} />

        {/* JAVNI prikaz (GET je svima dozvoljen) */}
        <Route path="/authors" element={<AuthorsList />} />
        <Route path="/publishers" element={<PublishersList />} />
        <Route path="/books" element={<BookList />} />

        {/* KREIRANJE knjiga: dozvoljeno SVIM PRIJAVLJENIM (Bibliotekar ili Urednik) */}
        <Route
          path="/books/create"
          element={
            <PrivateRoute>
              <BookForm mode="create" />
            </PrivateRoute>
          }
        />

        {/* IZMENa/BRISANJE: samo UREDNIK */}
        <Route
          path="/books/:id/edit"
          element={
            <RoleRoute role="Urednik">
              <BookForm mode="edit" />
            </RoleRoute>
          }
        />
        <Route
          path="/comics/volumes"
          element={
            <RoleRoute role="Urednik">
              <VolumesSearchPage />
            </RoleRoute>
          }
        />
        <Route
          path="/comics/volumes/:volumeId/issues"
          element={
            <RoleRoute role="Urednik">
              <IssuesSearchPage />
            </RoleRoute>
          }
        />
        <Route
          path="/comics/issues/create"
          element={
            <RoleRoute role="Urednik">
              <IssueCreateForm />
            </RoleRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
