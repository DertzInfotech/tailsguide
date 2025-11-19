import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faBars } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-100">
      <nav className="flex items-center md:justify-around justify-between gap-4 pt-2 pb-2 pr-5 pl-5">
        <div className="flex items-center gap-1 text-[21px] font-bold text-orange-primary pt-0.5">
          <i className="text-[28px]"><FontAwesomeIcon icon={faPaw} /></i>
          <span>tailsGuide</span>
        </div>
        <div className="hidden md:flex gap-6">
          <a href="#dashboard" class="nav-link active">Dashboard</a>
          <a href="#report" class="nav-link">Report</a>
          <a href="#search" class="nav-link">Search</a>
          <a href="#shelters" class="nav-link">Shelters</a>
          <a href="#community" class="nav-link">Community</a>
          <a href="#resources" class="nav-link">Resources</a>
          <a id="signin" class="nav-link">Sign In</a>
          <a id="signup" class="nav-link">Sign Up</a>
          <a id="register-pet" href="#pet-registration" class="nav-link hidden">My Profile</a>
          <a id="logout" class="nav-link hidden">Log Out</a>
        </div>
        <div className="flex md:hidden text-[21px] font-bold text-orange-primary">
          <i><FontAwesomeIcon icon={faBars} /></i>
        </div>
      </nav>
    </header>
  )
}