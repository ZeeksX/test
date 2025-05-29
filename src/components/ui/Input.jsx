import PropTypes from "prop-types";
import { FiEye, FiEyeOff, FiUpload } from "react-icons/fi";
import { MdOutlineSearch } from "react-icons/md";
import { AiOutlineUpload } from "react-icons/ai";
import { useState } from "react";
import { Label } from "./Label";

export const Input = ({
  id,
  type = "text",
  value,
  className = "",
  topClassName = "",
  error = "",
  onChange,
  max,
  ...props
}) => (
  <div className={`w-full ${topClassName}`}>
    <input
      id={id}
      type={type}
      value={value}
      min={0}
      max={max}
      onChange={onChange}
      className={`w-full px-3 py-2 rounded-md border outline-none placeholder:text-text-placeholder placeholder:text-[15px] focus:outline-none focus:border-primary-main ${className} ${
        error ? "border-red-500" : "border-neutral-border"
      }`}
      {...props}
    />
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

Input.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  topClassName: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func,
};

export const Textarea = ({
  id,
  value,
  onChange,
  placeholder,
  rows,
  ...props
}) => {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full p-3 border-[1.5px] border-neutral-mediumGray rounded-md bg-neutral-softWhite outline-none placeholder:text-neutral-mediumGray focus:outline-none focus:border-primary-vividBlue resize-none"
      {...props}
    />
  );
};

Textarea.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  rows: PropTypes.string,
};

export function Search({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  searchClassName = "",
  ...props
}) {
  return (
    <div className={`relative ${className}`}>
      <MdOutlineSearch
        className="absolute left-2.5 top-[50%] -translate-y-1/2"
        size={24}
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full h-full pl-10 py-2 rounded-md bg-neugborder-neutral-ghost placeholder-text-platext-text-placeholder ${searchClassName}`}
        {...props}
      />
    </div>
  );
}

Search.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  searchClassName: PropTypes.string.isRequired,
};

export const Password = ({
  value,
  onChange,
  className = "",
  error = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="relative w-full h-max">
      <input
        required
        className={`w-full px-3 py-2 rounded-md outline-none border placeholder:text-text-placeholder focus:border-primary-main ${className} ${
          error ? "border-red-500" : "border-neutral-border"
        }`}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        {...props}
      />
      <div
        className={`absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer ${
          error && "translate-y-[calc(-50%_-_12px)]"
        }`}
        onClick={togglePasswordVisibility}
      >
        {!showPassword ? (
          <FiEye size={25} color="gray" />
        ) : (
          <FiEyeOff size={25} color="gray" />
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1 truncate" title={error}>
          {error}
        </p>
      )}
    </div>
  );
};

Password.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  className: PropTypes.string,
};

export const LabelInput = ({
  type = "text",
  onChange,
  value,
  label,
  inputClassName = "",
  labelClassName = "",
  ...props
}) => {
  return (
    <div className="w-full h-[50px] relative flex rounded-xl">
      <input
        className={`peer w-full bg-transparent outline-none px-4 text-base rounded-md border border-black focus:border-black valid:border-black ${inputClassName}`}
        type={type}
        value={value}
        onChange={onChange}
        {...props}
      />
      <label
        className={`absolute top-1/2 -z-10 translate-y-[-50%] bg-white left-4 px-2 peer-focus:top-0 peer-focus:left-3 font-light text-base peer-focus:text-sm peer-focus:text-black peer-valid:-top-0 peer-valid:left-3 peer-valid:z-10 peer-valid:text-sm peer-focus:z-10 peer-valid:text-black duration-150 ${labelClassName}`}
      >
        {label}
      </label>
    </div>
  );
};

LabelInput.propTypes = {
  type: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
};

export const LabelPassword = ({
  value,
  onChange,
  label,
  inputClassName = "",
  labelClassName = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="relative w-full h-[50px]">
      <input
        required
        className={`peer w-full bg-transparent outline-none px-4 pr-10 h-full text-base rounded-md border border-black focus:border-black valid:border-black ${inputClassName}`}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        {...props}
      />
      <div
        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? (
          <FiEye size={25} color="gray" />
        ) : (
          <FiEyeOff size={25} color="gray" />
        )}
      </div>
      <label
        className={`absolute -z-10 top-1/2 translate-y-[-50%] bg-white left-4 px-2 peer-focus:top-0 peer-focus:left-3 font-light text-base peer-focus:text-sm peer-focus:text-black peer-valid:-top-0 peer-valid:left-3 peer-valid:text-sm peer-focus:z-10 peer-valid:z-10 peer-valid:text-black duration-150 ${labelClassName}`}
      >
        {label}
      </label>
    </div>
  );
};

LabelPassword.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
};

export const FileSelector = ({ onFileSelect, accept }) => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="border border-dashed rounded-lg flex flex-col hover:bg-gray-50 items-center justify-center">
      <div className="flex justify-center items-center w-full">
        <Label className="flex flex-col w-full justify-center p-4 py-2 gap-2 items-center cursor-pointer">
          <FiUpload className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 mb-1">
            Drag & Drop or <span className="text-blue-600">Choose File</span> to
            upload
          </p>
          <p className="text-xs text-gray-400">
            Only PDF, PPTX & DOCX are supported
          </p>
          <input
            type="file"
            accept={accept}
            className="hidden w-full h-full"
            onChange={handleFileUpload}
          />
        </Label>
      </div>
    </div>
  );
};
