import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";

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

export function CardDescription({ children, className = "" }) {
  return <p className={`text-sm text-gray-600 ${className}`}>{children}</p>;
}

CardDescription.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export function CardFooter({ children, className = "" }) {
  return (
    <div className={`border-t border-gray-200 p-4 flex ${className}`}>
      {children}
    </div>
  );
}

CardFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export function CardFormattedText({ text }) {
  return (
    <div className="prose">
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
}