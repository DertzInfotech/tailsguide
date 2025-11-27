import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Drawer({ isDrawerOpen, onClose }) {

  const pathname = usePathname();
  
  return (
    <>
      {/* OverLay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-140 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Drawer Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-white shadow-xl transform ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out z-150 lg:hidden`}
      >
        <div className="p-6">

          {/* Header and cross icon */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-xl text-orange-primary">Menu</h2>
            <button
              className="font-semibold text-gray-600 hover:text-gray-800"
              onClick={onClose}
            >
              <FontAwesomeIcon icon={faTimes}/>
            </button>
          </div>

          <div className="flex flex-col gap-3">
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

        </div>
      </div>

    </>
  )
}