'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faBars } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Drawer from "./Drawer";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();

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
          sticky top-0 z-30 relative isolate
          bg-[#f6f1eb]/85 backdrop-blur-md
          border-b border-[#c8b4a0]/30 border-opacity-35
          animate-header-in
        "
      >

        <nav className="flex items-center lg:justify-around justify-between gap-4 pt-2 pb-2 pr-5 pl-5">
          {/* Logo */}
          <div className="flex items-center gap-1 text-[21px] font-bold text-orange-primary pt-0.5">
            <i className="text-[28px]">
              <FontAwesomeIcon icon={faPaw} />
            </i>
            <span>tailsGuide</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex gap-6">
            <Link href="/" className={pathname === "/" ? "nav-link active" : "nav-link"}>Dashboard</Link>
            <Link href="/report" className={pathname === "/report" ? "nav-link active" : "nav-link"}>Report</Link>
            <Link href="/search" className={pathname === "/search" ? "nav-link active" : "nav-link"}>Search</Link>
            <Link href="/shelters" className={pathname === "/shelters" ? "nav-link active" : "nav-link"}>Shelters</Link>
            <Link href="/community" className={pathname === "/community" ? "nav-link active" : "nav-link"}>Community</Link>
            <Link href="/resources" className={pathname === "/resources" ? "nav-link active" : "nav-link"}>Resources</Link>

            {isAuthenticated ? (
              <>
                <Link href="/profile" className={pathname === "/profile" ? "nav-link active" : "nav-link"}>Profile</Link>
                <button onClick={handleLogout} className="nav-link">Log Out</button>
              </>
            ) : (
              <Link href="/signin" className={pathname === "/signin" ? "nav-link active" : "nav-link"}>Sign In</Link>
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
