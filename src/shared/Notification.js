import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle,
  faInfoCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

export default function Notification({ message, type = "info", onClose }) {
  let bgColor = "bg-blue-500";
  let Icon = faInfoCircle;

  if (type === "success") {
    bgColor = "bg-green-500";
    Icon = faCheckCircle;
  } else if (type === "error") {
    bgColor = "bg-red-500";
    Icon = faExclamationCircle;
  }

  return (
    <div
      className={`
        fixed
        top-20
        right-5
        z-[9999]
        ${bgColor}
        text-white
        p-4
        rounded-lg
        shadow-2xl
        flex
        items-center
        gap-4
        max-w-sm
        animate-slideInRight
      `}
    >
      <div className="flex items-center gap-3">
        <FontAwesomeIcon icon={Icon} className="w-5 h-5" />
        <span className="text-sm">{message}</span>
      </div>

      <button
        onClick={onClose}
        className="ml-auto text-white opacity-80 hover:opacity-100 cursor-pointer"
        aria-label="Close notification"
      >
        <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
      </button>
    </div>
  );
}
