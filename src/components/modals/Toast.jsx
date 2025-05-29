import React, { useEffect } from "react";

const Toast = ({ open, message, onClose, severity = "info" }) => {
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                onClose?.();
            }, 3000); // 3 seconds auto-close

            return () => clearTimeout(timer);
        }
    }, [open, onClose]);

    if (!open) return null;

    const baseStyles = `fixed top-3 right-3 px-6 py-4 rounded-xl z-50 transition-all duration-300 font-semibold text-sm`;
    const glassStyles = `backdrop-blur-md bg-opacity-70 shadow-lg`;

    const severityStyles = {
        success: "bg-green-600 text-white border border-green-300",
        error: "bg-red-600 text-white border border-red-300",
        info: "bg-blue-600 text-white border border-blue-300",
        warning: "bg-yellow-500 text-black border border-yellow-300",
    };

    const toastStyle = severityStyles[severity] || severityStyles.info;

    return (
        <div className={`${baseStyles} ${glassStyles} ${toastStyle}`}>
            {message}
        </div>
    );
};

export default Toast;
