"use client";
import React, { useState, useEffect, useRef } from "react";
import type { Etudiant } from "@/interfaces/students";

const StudentQueryForm: React.FC = () => {
  const [formData, setFormData] = useState<Partial<Etudiant>>({});
  const [isEmptySearch, setIsEmptySearch] = useState(false);
  const [suggestions, setSuggestions] = useState<{ [key: string]: string[] }>(
    {}
  );
  const [students, setStudents] = useState<
    Array<Etudiant & { showMore?: boolean }>
  >([]);
  const [activeSuggestionField, setActiveSuggestionField] = useState<
    string | null
  >(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setSuggestions({});
        setActiveSuggestionField(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isEmptySearch) {
      setStudents([]);
    }
  }, [isEmptySearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Fetch suggestions as the user types
    fetchSuggestions(name, value);
  };

  const fetchStudents = async (
    currentFormData: Partial<Etudiant>,
    currentPage: number
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/students/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...currentFormData,
            page: currentPage,
            limit: 20,
          }),
        }
      );
      const newStudents = await response.json();

      if (newStudents.length > 0) {
        if (currentPage > 1) {
          setStudents((prev) => [...prev, ...newStudents]);
        } else {
          setStudents(newStudents);
        }
        setIsEmptySearch(false);
      } else {
        if (currentPage === 1) {
          setIsEmptySearch(true);
        }
        setHasMore(false);
      }

      // Update state based on whether more students are available
      setHasMore(newStudents.length === 20);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchSuggestions = async (field: string, query: string = "") => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND
        }/api/suggestions?field=${field}&query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSuggestions((prev) => ({ ...prev, [field]: data.suggestions }));
      setActiveSuggestionField(field);
    } catch (error) {
      console.error(`Error fetching suggestions for ${field}:`, error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to page 1 on a new search
    fetchStudents(formData, 1);
  };

  const loadMoreStudents = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchStudents(formData, nextPage);
  };

  const renderInput = (label: string, name: keyof Etudiant) => (
    <div className="mb-4 relative">
      <label className="block text-gray-700 mb-2" htmlFor={name}>
        {label}
      </label>
      <input
        type="text"
        name={name}
        id={name}
        value={formData[name] || ""}
        onChange={handleInputChange}
        onFocus={() => fetchSuggestions(name)}
        className="w-full px-3 py-2 border rounded"
        autoComplete="off"
      />
      {activeSuggestionField === name &&
        suggestions[name] &&
        suggestions[name].length > 0 && (
          <div className="absolute bg-white border w-full mt-1 max-h-40 overflow-y-auto z-10 transition-opacity duration-300">
            {suggestions[name].map((suggestion, index) => (
              <div
                key={index}
                onClick={() => {
                  setFormData({ ...formData, [name]: suggestion });
                  setSuggestions({ ...suggestions, [name]: [] });
                  setActiveSuggestionField(null);
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

  return (
    <div className="max-w-7xl mx-auto p-4" ref={formRef}>
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-6">Search Students</h2>
        {renderInput("Établissement Origine", "etablissementOrigine")}
        {renderInput("Filière", "filiere")}
        {renderInput("Matricule Interne", "matriculeInterne")}
        {renderInput("Nationalité", "nationalite")}
        {renderInput("Nom", "nom")}
        {renderInput("Prénom", "prenom")}
        {renderInput("Situation Actuelle", "situationActuelle")}
        {renderInput("Défi", "defi")}
        {renderInput("A", "a")}
        {renderInput("Majeure", "majeure")}
        <div className="w-full flex justify-between">
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Search
          </button>
          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => setFormData({})}
          >
            Reset Search
          </button>
        </div>
      </form>

      {/* Display the search results */}
      {students.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl mb-4">Search Results</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {students.map((student, index) => (
              <div key={index} className="p-4 border rounded flex flex-col">
                <p>
                  <strong>Nom:</strong> {student.nom}
                </p>
                <p>
                  <strong>A:</strong> {student.a}
                </p>
                <button
                  onClick={() => {
                    // Toggle showing more info for this student
                    setStudents((prevStudents) =>
                      prevStudents.map((s, idx) =>
                        idx === index ? { ...s, showMore: !s.showMore } : s
                      )
                    );
                  }}
                  className="mt-2 text-blue-500 hover:underline self-start"
                >
                  {student.showMore ? "Show Less" : "Show More"}
                </button>
                {student.showMore && (
                  <div className="mt-2">
                    <p>
                      <strong>Prénom:</strong> {student.prenom}
                    </p>
                    <p>
                      <strong>Matricule Interne:</strong>{" "}
                      {student.matriculeInterne}
                    </p>
                    <p>
                      <strong>Nationalité:</strong> {student.nationalite}
                    </p>
                    <p>
                      <strong>Filière:</strong> {student.filiere}
                    </p>
                    <p>
                      <strong>Établissement Origine:</strong>{" "}
                      {student.etablissementOrigine}
                    </p>
                    <p>
                      <strong>Type de parcours:</strong>{" "}
                      {student.situationActuelle}
                    </p>
                    {student.defi && (
                      <p>
                        <strong>Défi:</strong> {student.defi}
                      </p>
                    )}
                    {student.majeure && (
                      <p>
                        <strong>Majeure:</strong> {student.majeure}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          {hasMore && (
            <button
              onClick={loadMoreStudents}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Show More Students
            </button>
          )}
        </div>
      )}
      {isEmptySearch && (
        <div className="mt-8 text-center">
          <p className="text-xl text-red-500">
            No students found for your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentQueryForm;
