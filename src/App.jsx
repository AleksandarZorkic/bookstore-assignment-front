import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Nav from "./components/nav";
import BookList from "./pages/BooksList";
import BookForm from "./pages/BooksForm";
import { PublisherApi } from "./api/client";
import "./style/style.scss";
import AuthorsList from "./pages/AuthorsList";
import PublishersList from "./pages/PublishersList";

// Dummy komponenta dok se ne napravi prava stranica
function Publishers() {
  return <h1 className="p-4 text-x1">Publishers</h1>;
}

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Navigate to="/books" />} />
        <Route path="/authors" element={<AuthorsList />} />
        <Route path="/publishers" element={<PublishersList />} />
        <Route path="/books" element={<BookList />} />
        <Route path="/books/create" element={<BookForm mode="create" />} />
        <Route path="/books/:id/edit" element={<BookForm mode="edit" />} />
      </Routes>
    </>
  );
}
