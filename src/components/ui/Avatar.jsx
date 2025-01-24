// import React from "react";
import PropTypes from "prop-types";

export function Avatar({ children, className }) {
  return (
    <div className={`relative inline-block rounded-full ${className}`}>
      {children}
    </div>
  );
}

Avatar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

Avatar.defaultProps = {
  className: "",
};

export function AvatarImage({ src, alt, className = "" }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full w-9 h-9 object-cover ${className}`}
    />
  );
}

AvatarImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
};

AvatarImage.defaultProps = {
  alt: "Avatar",
};

export function AvatarFallback({ children, className = "" }) {
  return (
    <div
      className={`flex items-center justify-center w-9 h-9 text-white bg-neutral-bg rounded-full ${className}`}
    >
      {children}
    </div>
  );
}

AvatarFallback.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
