import PropTypes from "prop-types";
import { Children, cloneElement, useState } from "react";

export const Tabs = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full">
      {Children.map(children, (child) => {
        return cloneElement(child, {
          activeTab,
          handleTabChange,
        });
      })}
    </div>
  );
};

Tabs.propTypes = {
  defaultValue: PropTypes.any.isRequired,
  children: PropTypes.node.isRequired,
};

export const TabList = ({ activeTab, handleTabChange, children }) => {
  return (
    <div className="flex gap-4">
      {Children.map(children, (child) => {
        return cloneElement(child, {
          activeTab,
          handleTabChange,
        });
      })}
    </div>
  );
};

TabList.propTypes = {
  activeTab: PropTypes.any,
  handleTabChange: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export const TabContent = ({ value, activeTab, children }) => {
  if (activeTab !== value) return null;

  return <div className="py-4">{children}</div>;
};

TabContent.propTypes = {
  value: PropTypes.any.isRequired,
  activeTab: PropTypes.any.isRequired,
  children: PropTypes.node.isRequired,
};

export const Tab = ({ value, activeTab, handleTabChange, children }) => {
  return (
    <button
      className={`py-2 px-4 text-sm font-medium text-gray-600 hover:text-blue-500 transition-colors duration-200 ${
        activeTab === value ? "border-b-2 border-blue-500 text-blue-500" : ""
      }`}
      onClick={() => handleTabChange(value)}
    >
      {children}
    </button>
  );
};

Tab.propTypes = {
  value: PropTypes.string.isRequired,
  activeTab: PropTypes.string.isRequired,
  handleTabChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export const TabTrigger = ({ value, activeTab, handleTabChange, children }) => {
  const handleClick = () => {
    handleTabChange(value);
  };

  return (
    <div
      className={`text-sm font-medium border transition-colors duration-200 rounded-[30px] ${
        activeTab === value ? "text-white bg-black border-black" : "text-black"
      }`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

TabTrigger.propTypes = {
  value: PropTypes.any.isRequired,
  activeTab: PropTypes.any,
  handleTabChange: PropTypes.func,
  children: PropTypes.node.isRequired,
};