"use client";
import { useState, useCallback } from "react";
import { fieldMappings } from "./fieldMappings";

const RenderInput = ({ label, name }: { label: string; name: string }) => {
  const [inputValue, setInputValue] = useState("");
  const [isInputActive, setIsInputActive] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedFetchSuggestions = useCallback(
    debounce(
      (name: string, query: string) =>
        fetchSuggestions(name, query, setIsInputActive, setSuggestions),
      300
    ),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    debouncedFetchSuggestions(name, e.target.value);
  };

  return (
    <div className="mb-4 relative">
      <label className="block text-gray-700 mb-2" htmlFor={name}>
        {label}
      </label>
      <input
        type="text"
        name={name}
        id={name}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() =>
          fetchSuggestions(name, "", setIsInputActive, setSuggestions)
        }
        className="w-full px-3 py-2 border rounded"
        autoComplete="off"
      />
      {isInputActive && suggestions && suggestions.length > 0 && (
        <div className="absolute bg-white border w-full mt-1 max-h-40 overflow-y-auto z-10 transition-opacity duration-300">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => {
                setInputValue(suggestion);
                setSuggestions([]);
                setIsInputActive(false);
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
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
  safeFieldKey: string,
  query: string = "",
  setIsInputActive: (state: boolean) => void,
  setSuggestions: (suggestions: string[]) => void
) {
  try {
    setIsInputActive(true);
    const field = encodeURIComponent(fieldMappings[safeFieldKey]);
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND
      }/api/suggestions?field=${field}&query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    setSuggestions(data.suggestions);
  } catch (error) {
    console.error(`Error fetching suggestions for ${safeFieldKey}:`, error);
    alert("Oops! error getting suggestions");
  }
}

export default RenderInput;
