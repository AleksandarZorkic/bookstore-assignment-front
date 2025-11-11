import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Nav() {
  const nav = useNavigate();
  const { isAuth, roles, hasRole, logout } = useAuth();

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

      {hasRole("Urednik") && (
        <>
          <NavLink to="/comics/volumes" className={active}>
            Comics: Volumes
          </NavLink>
        </>
      )}

      {/* Create book: dozvoljeno svakom prijavljenom */}
      {isAuth && (
        <NavLink to="/books/create" className={active}>
          Create book
        </NavLink>
      )}

      <div className="ml-auto flex items-center gap-2">
        {isAuth ? (
          <>
            <span className="text-sm text-gray-600">
              Roles: {roles.join(", ") || "—"}
            </span>
            <button
              className="px-3 py-2 rounded border"
              onClick={() => {
                logout();
                nav("/login");
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className={active}>
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}
