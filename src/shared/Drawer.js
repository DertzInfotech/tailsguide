"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/context/AuthContext";

export default function Drawer({ isDrawerOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const handleLogout = () => {
    onClose();
    logout();
    router.push("/");
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 lg:hidden
          bg-black/40
          transition-opacity duration-300
          z-40
          ${isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* Drawer panel */}
      <div
        className={`
          fixed top-0 right-0 min-h-[60vh] max-h-[85vh] h-[70vh] rounded-bl-3xl w-72 max-w-[85vw] lg:hidden
          bg-[#fff5e9] shadow-none
          transform transition-transform duration-300 ease-out
          z-50
          ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-6 sm:p-6 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-xl text-orange-primary">Menu</h2>
            <button onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Links — more gap on mobile/tablet for touch; auth-aware: Sign In/Up when signed out, Profile/My Pets + Logout when signed in */}
          <div className="flex flex-col gap-4">
            <Link href="/" onClick={onClose} className={pathname === "/" ? "nav-link active" : "nav-link"}>Dashboard</Link>
            <Link href="/report" onClick={onClose} className={pathname === "/report" ? "nav-link active" : "nav-link"}>Report</Link>
            <Link href="/search" onClick={onClose} className={pathname === "/search" ? "nav-link active" : "nav-link"}>Search</Link>
            <Link href="/shelters" onClick={onClose} className="nav-link">Shelters</Link>
            <Link href="/community" onClick={onClose} className="nav-link">Community</Link>
            <Link href="/resources" onClick={onClose} className="nav-link">Resources</Link>

            {isAuthenticated ? (
              <>
                <Link href="/profile" onClick={onClose} className={pathname === "/profile" ? "nav-link active" : "nav-link"}>My Profile</Link>
                <Link href="/my-pet" onClick={onClose} className={pathname === "/my-pet" ? "nav-link active" : "nav-link"}>My Pets 🐾</Link>
                <button type="button" onClick={handleLogout} className="nav-link text-left w-full border-0 bg-transparent cursor-pointer font-inherit">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/signin" onClick={onClose} className={pathname === "/signin" ? "nav-link active" : "nav-link"}>Sign In</Link>
                <Link href="/signup" onClick={onClose} className={pathname === "/signup" ? "nav-link active" : "nav-link"}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
