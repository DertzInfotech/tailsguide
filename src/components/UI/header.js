"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faBars } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-md sticky top-0 z-100">
      <nav className="flex items-center md:justify-around justify-between gap-4 pt-2 pb-2 pr-5 pl-5">
        <div className="flex items-center gap-1 text-[21px] font-bold text-orange-primary pt-0.5">
          <i className="text-[28px]"><FontAwesomeIcon icon={faPaw} /></i>
          <span>tailsGuide</span>
        </div>
        <div className="hidden md:flex gap-6">
          <Link href="/" className={pathname === "/" ? "nav-link active" : "nav-link"}>Dashboard</Link>
          <Link href="/report" className={pathname === "/report" ? "nav-link active" : "nav-link"}>Report</Link>
          <Link href="/search" className={pathname === "/search" ? "nav-link active" : "nav-link"}>Search</Link>
          <Link href="#shelters" className="nav-link">Shelters</Link>
          <Link href="#community" className="nav-link">Community</Link>
          <Link href="#resources" className="nav-link">Resources</Link>
          <Link href="/signin" className={pathname === "/signin" ? "nav-link active" : "nav-link"}>Sign In</Link>
          <Link href="/signup" className={pathname === "/signup" ? "nav-link active" : "nav-link"}>Sign Up</Link>
          <a id="register-pet" href="#pet-registration" className="nav-link hidden">My Profile</a>
          <a id="logout" className="nav-link hidden">Log Out</a>
        </div>
        <div className="flex md:hidden text-[21px] font-bold text-orange-primary">
          <i><FontAwesomeIcon icon={faBars} /></i>
        </div>
      </nav>
    </header>
  )
}