'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faBars, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Drawer from "./Drawer";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!profileDropdownOpen) return;
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    // Defer so the click that opened the dropdown doesn't immediately trigger close
    const id = setTimeout(() => {
      document.addEventListener("click", close);
    }, 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener("click", close);
    };
  }, [profileDropdownOpen]);

  useEffect(() => {
    if (!profileDropdownOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setProfileDropdownOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [profileDropdownOpen]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(prev => !prev);
  };

  return (
    <>

      {/* HEADER */}
      <header
        className="
          sticky top-0 z-30 isolate
          bg-[#f8f4ee]/70 backdrop-blur-xl
          border-b border-white/50
          shadow-[0_12px_40px_-32px_rgba(17,24,39,0.45)]
          animate-header-in
        "
      >

        <nav className="flex items-center lg:justify-around justify-between gap-4 py-3 px-4 sm:py-2 sm:px-5 lg:pt-2 lg:pb-2 lg:pr-5 lg:pl-5">
          {/* Logo */}
          <div className="flex items-center gap-1 text-[21px] font-bold text-orange-primary pt-0.5">
            <i className="text-[28px]">
              <FontAwesomeIcon icon={faPaw} />
            </i>
            <span className="inline-flex items-center gap-2">
              <span>tailsGuide</span>
              <span className="inline-flex items-center rounded-full border border-orange-200 bg-white/70 px-2 py-0.5 text-[10px] font-extrabold tracking-[0.22em] text-orange-700 shadow-sm">
                BETA
              </span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex gap-6">
            <Link href="/" className={pathname === "/" ? "nav-link active" : "nav-link"}>Dashboard</Link>
            <Link href="/report" className={pathname === "/report" ? "nav-link active" : "nav-link"}>Report</Link>
            <Link href="/search" className={pathname === "/search" ? "nav-link active" : "nav-link"}>Search</Link>
            <Link href="/shelters" className={pathname === "/shelters" ? "nav-link active" : "nav-link"}>Shelters</Link>
            <Link href="/community" className={pathname === "/community" ? "nav-link active" : "nav-link"}>Community</Link>
            <Link href="/resources" className={pathname === "/resources" ? "nav-link active" : "nav-link"}>Resources</Link>
            <Link href="/contact" className={pathname === "/contact" ? "nav-link active" : "nav-link"}>Contact</Link>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((o) => !o)}
                  className={`nav-link inline-flex items-center gap-1.5 ${pathname === "/profile" || pathname === "/my-pet" ? "active" : ""}`}
                  aria-expanded={profileDropdownOpen}
                  aria-haspopup="true"
                >
                  Profile
                  <FontAwesomeIcon icon={faChevronDown} className={`text-[10px] transition-transform ${profileDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-1 min-w-[160px] rounded-xl bg-white shadow-lg border border-stone-200 py-1.5 z-50"
                    role="menu"
                  >
                    <Link
                      href="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className={`block px-4 py-2.5 text-sm font-medium transition-colors ${pathname === "/profile" ? "text-amber-600 bg-amber-50" : "text-stone-700 hover:bg-stone-50"}`}
                      role="menuitem"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/my-pet"
                      onClick={() => setProfileDropdownOpen(false)}
                      className={`block px-4 py-2.5 text-sm font-medium transition-colors ${pathname === "/my-pet" ? "text-amber-600 bg-amber-50" : "text-stone-700 hover:bg-stone-50"}`}
                      role="menuitem"
                    >
                      My Pets 🐾
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                      role="menuitem"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/signin"
                className={pathname === "/signin" ? "nav-link active" : "nav-link"}
              >
                Sign In
              </Link>
            )}

          </div>

          {/* Mobile Icon */}
          <div className="flex lg:hidden text-[21px] font-bold text-orange-primary">
            <button
              onClick={toggleDrawer}
              className="transition-transform duration-200 active:scale-95"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
        </nav>
      </header>

      {/* DRAWER — MUST BE HERE */}
      <Drawer isDrawerOpen={isDrawerOpen} onClose={toggleDrawer} />
    </>
  );
}
