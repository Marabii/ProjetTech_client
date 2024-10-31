"use client";
import React, { useState, useEffect, useRef } from "react";
import type { Etudiant } from "@/interfaces/students";

const StudentQueryForm: React.FC = () => {
  const [formData, setFormData] = useState<Partial<Etudiant>>({});
  const [suggestions, setSuggestions] = useState<{ [key: string]: string[] }>(
    {}
  );
  const [students, setStudents] = useState<
    Array<Etudiant & { showMore?: boolean }>
  >([]);
  const [showMoreStudents, setShowMoreStudents] = useState(false);
  const [activeSuggestionField, setActiveSuggestionField] = useState<
    string | null
  >(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Fetch suggestions as the user types
    fetchSuggestions(name, value);
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
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/students/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const studentsData: Etudiant[] = await response.json();
      // Initialize showMore property for each student
      const studentsWithShowMore = studentsData.map((student) => ({
        ...student,
        showMore: false,
      }));
      setStudents(studentsWithShowMore);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
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

  const studentsToDisplay = showMoreStudents ? students : students.slice(0, 20);

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
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      {/* Display the search results */}
      {students.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl mb-4">Search Results</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {studentsToDisplay.map((student, index) => (
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
                      <strong>Situation Actuelle:</strong>{" "}
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
          {!showMoreStudents && students.length > 20 && (
            <button
              onClick={() => setShowMoreStudents(true)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Show More Students
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentQueryForm;
