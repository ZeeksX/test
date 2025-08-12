import React, { useEffect } from "react";

const Toast = ({ open, message, onClose, severity = "info" }) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose?.();
      }, 5000); // Increased to 5 seconds for longer messages

      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  const baseStyles = `fixed top-3 right-3 px-6 py-4 rounded-xl z-[9999] transition-all duration-300 font-semibold text-sm max-w-md`;
  const glassStyles = `backdrop-blur-md bg-opacity-70 shadow-lg`;

  const severityStyles = {
    success: "bg-green-600 text-white border border-green-300",
    error: "bg-red-600 text-white border border-red-300",
    info: "bg-blue-600 text-white border border-blue-300",
    warning: "bg-yellow-500 text-black border border-yellow-300",
  };

  const toastStyle = severityStyles[severity] || severityStyles.info;

  // Split message by \n and render each line
  const messageLines = (typeof message === "string" ? message : String(message || "")).split("\n");

  return (
    <div className={`${baseStyles} ${glassStyles} ${toastStyle}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {messageLines.map((line, index) => (
            <div key={index} className={index > 0 ? "mt-1" : ""}>
              {line}
            </div>
          ))}
        </div>
        {/* Optional close button */}
        <button
          onClick={onClose}
          className="ml-4 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
