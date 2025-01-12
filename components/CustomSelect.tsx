// CustomSelect.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/solid";
import { CustomSelectProps, SelectOption } from "@/interfaces/form";

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  name,
  defaultValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize internalValue with defaultValue for uncontrolled mode
  const [internalValue, setInternalValue] = useState<string | undefined>(
    defaultValue
  );

  // Determine whether the component is controlled
  const isControlled = value !== undefined && onChange !== undefined;

  // Selected value based on controlled or uncontrolled mode
  const selectedValue = isControlled ? value : internalValue;
  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (option: SelectOption) => {
    if (isControlled && onChange) {
      onChange(option.value);
    } else {
      setInternalValue(option.value);
    }
    setIsOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="inline-block text-left w-72" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex justify-between items-center w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDownIcon
          className={`w-5 h-5 ml-2 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-auto"
            role="listbox"
          >
            {options.map((option) => (
              <li
                key={option.value}
                className={`cursor-pointer select-none relative py-2 pl-4 pr-10 hover:bg-blue-100 ${
                  selectedValue === option.value ? "bg-blue-100" : ""
                }`}
                onClick={() => handleOptionClick(option)}
                role="option"
                aria-selected={selectedValue === option.value}
              >
                <span
                  className={`block truncate ${
                    selectedValue === option.value
                      ? "font-medium"
                      : "font-normal"
                  }`}
                >
                  {option.label}
                </span>
                {selectedValue === option.value && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                    <CheckIcon className="w-5 h-5" />
                  </span>
                )}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {/* Hidden Input */}
      <input type="hidden" name={name} value={selectedValue ?? ""} />
    </div>
  );
};

export default CustomSelect;
