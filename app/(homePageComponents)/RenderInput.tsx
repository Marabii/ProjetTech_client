"use client";
import useOutsideClick from "@/hooks/useOutsideClick";
import { SearchField } from "@/interfaces/form";
import { useState, useCallback, useEffect, useRef } from "react";

interface RenderInputProps extends SearchField {
  resetTrigger: number;
  onChange?: () => void;
}

const RenderInput: React.FC<RenderInputProps> = ({
  name,
  type = "text",
  label,
  resetTrigger,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isInputActive, setIsInputActive] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const inputName = name.split("/")[0];

  useOutsideClick(inputRef, () => {
    setIsInputActive(false);
    setSuggestions([]);
  });

  const debounce = (
    func: (inputName: string, query: string) => void,
    delay: number
  ) => {
    let timer: NodeJS.Timeout;
    return (inputName: string, query: string) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(inputName, query), delay);
    };
  };

  const debouncedFetchSuggestions = useCallback(
    debounce(
      (inputName: string, query: string) =>
        fetchSuggestions(inputName, query, setIsInputActive, setSuggestions),
      300
    ),
    []
  );

  const validateDate = (value: string): boolean => {
    const dateRegex =
      /^(?:(?:19|20)\d\d)-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;
    return dateRegex.test(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setInputValue(value);

    if (type === "date") {
      // Validate the date input
      if (!validateDate(value)) {
        setError("Date must be in YYYY-MM-DD format.");
      } else {
        setError(null);
      }
    } else {
      debouncedFetchSuggestions(inputName, value);
    }
  };

  const handleInputFocus = () => {
    if (type !== "date") {
      fetchSuggestions(inputName, "", setIsInputActive, setSuggestions);
    }
  };

  // Effect to reset input when resetTrigger changes
  useEffect(() => {
    setInputValue("");
    setError(null);
    setSuggestions([]);
    setIsInputActive(false);
  }, [resetTrigger]);

  return (
    <div ref={inputRef} className="mb-4 relative">
      <label className="block text-gray-700 mb-2" htmlFor={name}>
        {label || name}
      </label>
      <input
        type={"text"}
        name={name}
        id={name}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        className={`w-full px-3 py-2 border rounded ${
          error ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        autoComplete="off"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {isInputActive && suggestions && suggestions.length > 0 && (
        <div className="absolute bg-white border w-full mt-1 max-h-40 overflow-y-auto z-30 transition-opacity duration-300">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => {
                setInputValue(suggestion);
                setSuggestions([]);
                setIsInputActive(false);
              }}
              className="px-3 py-2 z-40 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

async function fetchSuggestions(
  inputName: string,
  query: string = "",
  setIsInputActive: (state: boolean) => void,
  setSuggestions: (suggestions: string[]) => void
) {
  try {
    setIsInputActive(true);
    const field = encodeURIComponent(inputName);
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND
      }/api/suggestions?field=${field}&query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    setSuggestions(data.suggestions);
  } catch (error) {
    console.error(`Error fetching suggestions for ${inputName}:`, error);
    alert("Oops! Error getting suggestions.");
  }
}

export default RenderInput;
