import { useEffect, useState } from "react";
import { getAuth } from "../auth.js";

const NAV = [
  { label: "Home", href: "#/" },
  { label: "AI", href: "#/category/ai" },
  { label: "Technology", href: "#/category/tech" },
  { label: "Physics", href: "#/category/physics" },
  { label: "About", href: "#/about" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [auth, setAuth] = useState(getAuth());

  useEffect(() => {
    const sync = () => setAuth(getAuth());
    window.addEventListener("sr-auth-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("sr-auth-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <header className="header">
      <div className="header__row">
        <a href="#/" aria-label="SpaceRock home">
          <span className="header__wordmark gradient-text">SPACEROCK</span>
        </a>

        <nav
          className={`header__nav ${open ? "header__nav--open" : ""}`}
          aria-label="Primary"
        >
          {NAV.map((item) => (
            <a
              key={item.label}
              className="header__link"
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}

          <div className="header__auth">
            {auth ? (
              <a
                className="header__link header__cta"
                href="#/dashboard"
                onClick={() => setOpen(false)}
              >
                ⚙ {auth.name?.split(" ")[0] || "Dashboard"}
              </a>
            ) : (
              <>
                <a
                  className="header__link header__link--auth"
                  href="#/login"
                  onClick={() => setOpen(false)}
                >
                  Log in
                </a>
                <a
                  className="header__link header__cta"
                  href="#/signup"
                  onClick={() => setOpen(false)}
                >
                  Sign up
                </a>
              </>
            )}
          </div>
        </nav>

        <button
          className="header__burger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
