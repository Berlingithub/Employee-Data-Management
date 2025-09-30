import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" />;
      default:
        return null;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up w-full max-w-[calc(100%-2rem)] sm:max-w-md">
      <div className={`w-full shadow-lg rounded-lg pointer-events-auto border ${getColorClasses()}`}>
        <div className="p-4">
          <div className="flex items-start gap-3">
            {getIcon()}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 break-words">
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-2 flex-shrink-0 bg-transparent rounded-md p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;