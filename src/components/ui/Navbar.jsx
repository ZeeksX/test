import PropTypes from "prop-types";
import { Fragment } from "react";
import { Link } from "react-router-dom";

export function Sidebar({ children, className = "" }) {
  return (
    <div
      className={`flex flex-col w-64 border-r border-neutral-lightGray h-full ${className}`}
    >
      {children}
    </div>
  );
}

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export function SidebarHeader({ children, className = "" }) {
  return <div className={`flex p-4 ${className}`}>{children}</div>;
}

SidebarHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export function SidebarContent({ children, className = "" }) {
  return <div className={`flex-1 ${className}`}>{children}</div>;
}

SidebarContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export function SidebarMenu({ id, children, className = "" }) {
  return (
    <div id={id} className={`space-y-2 px-2 ${className}`}>
      {children}
    </div>
  );
}

SidebarMenu.propTypes = {
  children: PropTypes.node.isRequired,
};

export function SidebarMenuItem({ children }) {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      {children}
    </div>
  );
}

SidebarMenuItem.propTypes = {
  children: PropTypes.node.isRequired,
};

export function SidebarMenuButton({
  asChild,
  isActive,
  children,
  className = "",
}) {
  const Component = asChild ? Fragment : "div";

  return (
    <Component>
      <button
        className={`w-full text-left rounded-md flex items-center transition-colors ${
          isActive ? "bg-primary-vividBlueBg" : "hover:bg-primary-vividBlueBg"
        } ${className}`}
      >
        {children}
      </button>
    </Component>
  );
}

SidebarMenuButton.propTypes = {
  asChild: PropTypes.bool,
  isActive: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export function SidebarGroup({ children }) {
  return <div className="w-full mb-4">{children}</div>;
}

SidebarGroup.propTypes = {
  children: PropTypes.node.isRequired,
};

export function SidebarGroupLabel({ children, asChild, className = "" }) {
  const Wrapper = asChild ? "div" : "div";
  return (
    <Wrapper className={`text-gray-700 font-semibold mb-1 ${className}`}>
      {children}
    </Wrapper>
  );
}

SidebarGroupLabel.propTypes = {
  children: PropTypes.node.isRequired,
  asChild: PropTypes.bool,
};

export function SidebarGroupMenu({ children, id }) {
  return (
    <ul id={id} className="space-y-1">
      {children}
    </ul>
  );
}

SidebarGroupMenu.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string,
};

export function SidebarGroupContent({ children }) {
  return <div className="pl-4">{children}</div>;
}

SidebarGroupContent.propTypes = {
  children: PropTypes.node.isRequired,
};

export function SidebarFooter({ children }) {
  return <div className="p-4">{children}</div>;
}

SidebarFooter.propTypes = {
  children: PropTypes.node.isRequired,
};

export function Topbar({ children, className = "" }) {
  return (
    <header
      className={`w-full h-[64px] flex items-center justify-between border-b border-neutral-lightGray z-10 ${className}`}
    >
      {children}
    </header>
  );
}

Topbar.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export function TopbarLogo({ src, alt, className = "", link }) {
  return <a href={link}><img src={src} alt={alt} className={`${className}`} /></a>;
}

TopbarLogo.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
};

export function TopbarContent({ children, className = "" }) {
  return (
    <div className={`flex-1 flex items-center ${className}`}>{children}</div>
  );
}

TopbarContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export function TopbarLink({
  href,
  children,
  className = "",
  activeSession = false,
  onClick,
}) {
  return (
    <a
      href={href}
      className={`relative text-base text-neutral-darkCharcoal font-semibold after:w-0 after:h-[2px] after:bg-primary-vividBlue after:absolute after:left-0 after:bottom-[-4px] after:duration-500 ${
        activeSession
          ? "text-primary-vividBlueHover after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-primary-vividBlue max-[580px]:text-primary-vividBlue max-[580px]:after:hidden"
          : ""
      }  ${className}`}
      onClick={onClick}
    >
      {children}
    </a>
  );
}

TopbarLink.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
