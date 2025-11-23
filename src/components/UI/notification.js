import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faExclamationCircle, faInfoCircle, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Notification({ message, type, onClose }){

  let bgColor = 'bg-blue-500';
  let Icon = faInfoCircle;

  if (type === 'success'){
    bgColor = 'bg-green-500';
    Icon = faCheckCircle
  } else if (type === 'error'){
    bgColor = 'bg-red-500';
    Icon = faExclamationCircle;
  }

  return (
    <>
      <div className={`fixed top-5 right-5 ${bgColor} text-white p-4 rounded-lg shadow-xl z-200 flex items-center gap-4 max-w-sm animate-slideInRight`}>
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={Icon} className="w-5 h-5" />
          <span>{message}</span>
        </div>
        <button
          onClick={onClose}
          className="text-white opacity-80 hover:opacity-100 cursor-pointer text-xl ml-auto"
        >
          <FontAwesomeIcon icon={faTimes} className="w-4 h-4"/>
        </button>
      </div>
    </>
  )
}