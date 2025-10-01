import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  const getBgColor = () => {
    switch (type) {
      case 'error':
        return 'bg-red-100 border-red-400 text-red-700';
      case 'warning':
        return 'bg-yellow-100 border-yellow-400 text-yellow-700';
      case 'success':
      default:
        return 'bg-green-100 border-green-400 text-green-700';
    }
  };

  return (
    <div 
      className={`fixed bottom-4 right-4 border-l-4 px-4 py-3 rounded shadow-lg ${getBgColor()}`}
      role="alert"
    >
      <div className="flex items-center">
        <div className="py-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          type="button"
          className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;