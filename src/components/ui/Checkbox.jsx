import * as React from "react";
import { cn } from "../../utils/classNames";
import { FiCheck } from "react-icons/fi";

const Checkbox = React.forwardRef((props, ref) => {
  const { className, checked, onCheckedChange, ...rest } = props;
  const [isChecked, setIsChecked] = React.useState(checked || false);

  React.useEffect(() => {
    if (checked !== undefined) {
      setIsChecked(checked);
    }
  }, [checked]);

  const handleChange = (event) => {
    const newChecked = event.target.checked;
    setIsChecked(newChecked);
    onCheckedChange?.(newChecked);
  };

  return (
    <div className="relative">
      <input
        type="checkbox"
        ref={ref}
        checked={isChecked}
        onChange={handleChange}
        className="sr-only"
        {...rest}
      />
      <div
        className={cn(
          "h-4 w-4 rounded border border-gray-300 flex items-center justify-center",
          isChecked ? "bg-blue-600 border-blue-600" : "bg-white",
          className
        )}
        onClick={() => {
          const newChecked = !isChecked;
          setIsChecked(newChecked);
          onCheckedChange?.(newChecked);
        }}
      >
        {isChecked && <FiCheck className="h-3 w-3 text-white" />}
      </div>
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox };
