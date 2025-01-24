import PropTypes from "prop-types";

export function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white shadow-cardShadow shadow-neutral-shadow rounded-lg overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export function CardImage({ className = "", src, alt }) {
  return (
    <img src={src} alt={alt} className={`w-full object-cover ${className}`} />
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}
