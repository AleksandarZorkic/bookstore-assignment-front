import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Nav() {
  const active = ({ isActive }) =>
    "px-3 py-2 rounded " + (isActive ? "nav-link-active" : "hover:bg-gray-100");

  return (
    <nav className="p-4 border-b flex items-center gap-4">
      <Link to="/" className="font-bold">
        Bookstore
      </Link>
      <NavLink to="/authors" className={active}>
        Authors
      </NavLink>
      <NavLink to="/publishers" className={active}>
        Publishers
      </NavLink>
      <NavLink to="/books" className={active}>
        Books
      </NavLink>
      <NavLink to="/books/create" className={active}>
        Create book
      </NavLink>
    </nav>
  );
}
