"use client";
import useOutsideClick from "@/hooks/useOutsideClick";
import { useState, useEffect, useCallback, useRef, RefObject } from "react";

const Input = ({ name }: { name: string }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const inputRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(
    async (safeFieldKey: string, query: string = "") => {
      try {
        const field = encodeURIComponent(name);
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
    },
    [name]
  );

  // Debouncing effect for API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      if (debouncedQuery.trim() !== "") {
        fetchSuggestions(name, debouncedQuery);
      }
    }, 300);

    return () => clearTimeout(handler); // Cleanup the timeout
  }, [debouncedQuery, name, fetchSuggestions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setDebouncedQuery(e.target.value);
  };

  //Clean up suggestions array when clicked outside:
  useOutsideClick(inputRef as RefObject<HTMLElement>, () => setSuggestions([]));

  return (
    <div ref={inputRef} className="mb-4 relative">
      <label className="block text-gray-700 mb-2" htmlFor={name}>
        {name}
      </label>
      <input
        type="text"
        name={name}
        id={name}
        value={inputValue}
        onFocus={() => fetchSuggestions(name)}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded"
        autoComplete="off"
      />
      {suggestions && suggestions.length > 0 && (
        <div className="absolute bg-white border w-full mt-1 max-h-40 overflow-y-auto z-10 transition-opacity duration-300">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => {
                setInputValue(suggestion);
                setSuggestions([]);
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

export default Input;
