import PropTypes from "prop-types";
import { Link } from "react-router";
import { Spinner } from "./Loader";
import { StyledWrapper } from "./Styles";

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
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={classes}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};

CustomButton.propTypes = {
  as: PropTypes.oneOf(["button", "link"]),
  to: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf([
    "primary",
    "ghost",
    "clear",
    "accent",
    "icon",
    "danger",
  ]), // Added danger
  size: PropTypes.oneOf(["sm", "base", "icon", "lg", "full"]),
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  loading: PropTypes.bool,
};

export const variantStyles = {
  primary: "bg-primary-main text-white hover:bg-primary-main/80",
  ghost:
    "bg-neutral-ghost text-text-ghost hover:bg-primary-main hover:text-white",
  clear:
    "bg-transparent text-text-main border border-neutral-border hover:border-primary-main hover:text-primary-main",
  accent: "bg-primary-purple text-white",
  link: "text-primary-main underline-offset-4 hover:underline !p-0 !justify-start",
  danger: "bg-primary-danger text-white hover:bg-primary-danger/80",
  icon: "rounded-full border border-primary-main hover:bg-primary-main",
};

export const StyleButton = ({ onClick }) => {
  return (
    <StyledWrapper>
      <button onClick={onClick} className="cssbuttons-io-button">
        Get started
        <div className="icon">
          <svg
            height={24}
            width={24}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
              fill="currentColor"
            />
          </svg>
        </div>
      </button>
    </StyledWrapper>
  );
};

export default CustomButton;
