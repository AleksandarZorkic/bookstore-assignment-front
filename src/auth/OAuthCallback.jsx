import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const nav = useNavigate();

  useEffect(() => {
    const frag = new URLSearchParams(window.location.hash.slice(1));
    const token = frag.get("token");
    if (token) {
      localStorage.setItem("jwt", token);

      nav("/books", { replace: true });
      window.location.reload();
    } else {
      nav("/login?err=no_token", { replace: true });
    }
  }, [nav]);

  return <div className="p-4">Signing you in...</div>;
}
