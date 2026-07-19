import { useState } from "react";
const NAV = [
  { label: "Home", href: "#/" },
  { label: "AI", href: "#/category/ai" },
  { label: "Technology", href: "#/category/tech" },
  { label: "Physics", href: "#/category/physics" },
  { label: "About", href: "#/about" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

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
      <hr className="header__rule" />
    </header>
  );
}
