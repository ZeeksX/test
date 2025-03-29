import PropTypes from "prop-types";
import { cloneElement, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import ReactDOM from "react-dom";

export const ButtonDismissDialog = ({
  open,
  onOpenChange,
  maxWidth = "448px",
  height = "max-content",
  children,
}) => {
  const dispatch = useDispatch();

  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100 !m-0">
      <div
        className="bg-white rounded-lg shadow-lg w-full relative"
        style={{ maxWidth, height }}
      >
        {children}
        <button
          className="absolute top-6 right-6 text-[24px] text-gray-500 hover:text-gray-800 flex items-center justify-start"
          onClick={() => dispatch(onOpenChange(false))}
        >
          ×
        </button>
      </div>
    </div>,
    document.body
  );
};

ButtonDismissDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.string,
  height: PropTypes.string,
};

export const OutsideDismissDialog = ({
  open,
  onOpenChange,
  maxWidth = "448px",
  height = "max-content",
  children,
}) => {
  const dispatch = useDispatch();
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        // dispatch(onOpenChange(false));
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch, onOpenChange]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999] cursor-pointer" onClick={() => dispatch(onOpenChange(false))}>
      <div
        ref={ref}
        className="bg-white cursor-default rounded-lg shadow-lg w-full relative"
        style={{ maxWidth, height }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

OutsideDismissDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.string,
  height: PropTypes.string,
};

export const DialogTrigger = ({ children, onClick }) => {
  const dispatch = useDispatch();

  return cloneElement(children, {
    onClick: () => dispatch(onClick(true)),
  });
};

DialogTrigger.propTypes = {
  children: PropTypes.element.isRequired,
  onClick: PropTypes.func.isRequired,
};

export const DialogContent = ({ children, className }) => (
  <div className={`dialog-content ${className}`}>{children}</div>
);

DialogContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
};

export const DialogHeader = ({ children }) => (
  <div className="dialog-header mb-4 p-6 pb-0 flex flex-col gap-2">{children}</div>
);

DialogHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

export const DialogTitle = ({ children }) => (
  <h2 className="text-xl font-medium">{children}</h2>
);

DialogTitle.propTypes = {
  children: PropTypes.string.isRequired,
};

export const DialogSubTitle = ({ children }) => (
  <p className="text-sm text-text-placeholder">{children}</p>
);

DialogSubTitle.propTypes = {
  children: PropTypes.string.isRequired,
};
