import { useState } from "react";

const NAV = [
  { label: "Home", href: "#/" },
  { label: "AI", href: "#/category/ai" },
  { label: "Technology", href: "#/category/tech" },
  { label: "Physics", href: "#/category/physics" },
  { label: "About", href: "#/about" },
];

// Ultimate Member endpoints on your WordPress. Nextend Social Login integrates
// into the same UM Login form — the Google button appears there.
const UM = {
  login: "https://spacerock.club/login/",
  register: "https://spacerock.club/register/",
  account: "https://spacerock.club/account/",
};

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

          <div className="header__auth">
            <a
              className="header__link header__link--auth"
              href={UM.login}
              onClick={() => setOpen(false)}
            >
              Log in
            </a>
            <a
              className="header__link header__cta"
              href={UM.register}
              onClick={() => setOpen(false)}
            >
              Sign up
            </a>
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
