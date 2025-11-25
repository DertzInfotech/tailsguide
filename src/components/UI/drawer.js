import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function Drawer({ isDrawerOpen, onClose }) {
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

        </div>
      </div>

    </>
  )
}