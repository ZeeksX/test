import PropTypes from "prop-types";
import { Link } from "react-router";
import { Spinner } from "./Loader";

export const CustomButton = ({
  as = "button",
  to = "#",
  type = "button",
  variant = "primary",
  size = "base",
  onClick,
  children,
  className = "",
  loading = false,
  ...props
}) => {
  const baseStyles =
    "text-base font-semibold rounded-md flex items-center justify-center relative";

  const variantStyles = {
    primary: "bg-primary-main text-white hover:bg-primary-main",
    ghost:
      "bg-neutral-ghost text-text-ghost hover:bg-primary-main hover:text-white",
    clear:
      "bg-transparent text-text-main border border-neutral-border hover:border-primary-main hover:text-primary-main",
    accent: "bg-primary-purple text-white",
    danger: "bg-[#EA4335] text-white",
    icon: "rounded-full border border-primary-main hover:bg-primary-main",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 min-h-9",
    base: "px-4 py-2 text-sm min-h-9",
    icon: "p-2 min-h-8 min-w-8",
    lg: "px-6 py-3 text-base min-h-12",
  };

  const classes = `${baseStyles} ${
    variantStyles[variant] || variantStyles.primary
  } ${sizeStyles[size] || sizeStyles.base} ${className}`;

  if (as === "link") {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} {...props}>
      {loading ? <Spinner /> : children}
    </button>
  );
};

CustomButton.propTypes = {
  as: PropTypes.oneOf(["button", "link"]),
  to: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf(["primary", "ghost", "clear", "accent", "icon"]),
  size: PropTypes.oneOf(["sm", "base", "icon", "lg", "full"]),
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  loading: PropTypes.bool,
};
