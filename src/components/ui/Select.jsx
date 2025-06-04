import { createContext, useState, useContext } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

const SelectContext = createContext();

export function Select({ value, onValueChange, children, width = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange,
        isOpen,
        setIsOpen,
      }}
    >
      <div className="relative" style={{ width }}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, id, name }) {
  const { isOpen, setIsOpen } = useContext(SelectContext);

  return (
    <button
      id={id}
      name={name}
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className="flex items-center justify-between w-full px-4 py-2 border rounded bg-white"
    >
      {children}
      {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
    </button>
  );
}

export function SelectValue({ placeholder }) {
  const { value } = useContext(SelectContext);

  return (
    <span className="text-gray-700">
      {value || <span className="text-gray-400">{placeholder}</span>}
    </span>
  );
}

export function SelectContent({ children }) {
  const { isOpen } = useContext(SelectContext);

  return (
    isOpen && (
      <div className="absolute left-0 z-50 mt-2 w-full bg-white border rounded shadow">
        {children}
      </div>
    )
  );
}

export function SelectItem({ value, children }) {
  const { onValueChange, setIsOpen } = useContext(SelectContext);

  const handleSelect = () => {
    onValueChange(value);
    setIsOpen(false);
  };

  return (
    <button
      type="button"
      onClick={handleSelect}
      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
    >
      {children}
    </button>
  );
}
