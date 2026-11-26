import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4">
      <div className="bg-white dark:bg-[#17212b] rounded-2xl w-full max-w-md p-6 shadow-2xl relative border border-gray-200 dark:border-[#242f3d] animate-scale-in text-gray-900 dark:text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#242f3d] transition-colors">
            <X size={22} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
export default Modal;
