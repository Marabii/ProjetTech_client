"use client";
import React, { useState, useEffect, useRef } from "react";
import type { Etudiant } from "@/interfaces/students";

const StudentQueryForm: React.FC = () => {
  // Mapping of safe keys to actual field names
  const fieldMappings: { [key: string]: string } = {
    identifiantOP: "Identifiant OP",
    etablissementOrigine: "Etablissement d'origine",
    filiere: "Filière",
    nationalite: "Nationalité",
    nom: "Nom",
    prenom: "Prénom",
    // Convention de Stage fields
    conventionEntiteIdentifiantOP:
      "CONVENTION DE STAGE.Entité principale - Identifiant OP",
    conventionDateDebutStage: "CONVENTION DE STAGE.Date de début du stage",
    conventionDateFinStage: "CONVENTION DE STAGE.Date de fin du stage",
    conventionFonctionOccupee: "CONVENTION DE STAGE.Stage Fonction occupée",
    conventionNomStage: "CONVENTION DE STAGE.Nom Stage",
    // Universite Visitant fields
    universiteEntiteIdentifiantOP:
      "UNIVERSITE visitant.Entité principale - Identifiant OP",
    universiteDateDebutMobilite: "UNIVERSITE visitant.Date de début mobilité",
    universiteDateFinMobilite: "UNIVERSITE visitant.Date de fin mobilité",
    universiteTypeMobilite: "UNIVERSITE visitant.Type Mobilité",
    universiteNomMobilite: "UNIVERSITE visitant.Nom mobilité",
  };

  const [formData, setFormData] = useState<{ [key: string]: string }>({});
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
    currentFormData: { [key: string]: any },
    currentPage: number
  ) => {
    try {
      // Map formData safe keys to actual field names
      const query: { [key: string]: any } = {};
      for (const key in currentFormData) {
        if (currentFormData[key] !== "") {
          const actualFieldName = fieldMappings[key];
          if (actualFieldName) {
            // Handle nested fields for arrays
            if (
              actualFieldName.includes("CONVENTION DE STAGE") ||
              actualFieldName.includes("UNIVERSITE visitant")
            ) {
              const [arrayField, subField] = actualFieldName.split(".");
              query[arrayField] = query[arrayField] || {};
              query[arrayField][subField] = currentFormData[key];
            } else {
              query[actualFieldName] = currentFormData[key];
            }
          }
        }
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/students/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...query,
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
      alert("Oops! Error fetching students");
    }
  };

  const fetchSuggestions = async (safeFieldKey: string, query: string = "") => {
    try {
      const field = encodeURIComponent(fieldMappings[safeFieldKey]);
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND
        }/api/suggestions?field=${field}&query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSuggestions((prev) => ({ ...prev, [safeFieldKey]: data.suggestions }));
      setActiveSuggestionField(safeFieldKey);
    } catch (error) {
      console.error(`Error fetching suggestions for ${safeFieldKey}:`, error);
      alert("Oops! error getting suggestions");
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

  const renderInput = (label: string, name: string) => (
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
        {renderInput("Identifiant OP", "identifiantOP")}
        {renderInput("Etablissement d'origine", "etablissementOrigine")}
        {renderInput("Filière", "filiere")}
        {renderInput("Nationalité", "nationalite")}
        {renderInput("Nom", "nom")}
        {renderInput("Prénom", "prenom")}
        {/* Convention de Stage Fields */}
        <h3 className="text-xl mt-6 mb-2">Convention de Stage</h3>
        {renderInput(
          "Entité principale - Identifiant OP",
          "conventionEntiteIdentifiantOP"
        )}
        {renderInput("Date de début du stage", "conventionDateDebutStage")}
        {renderInput("Date de fin du stage", "conventionDateFinStage")}
        {renderInput("Stage Fonction occupée", "conventionFonctionOccupee")}
        {renderInput("Nom Stage", "conventionNomStage")}
        {/* Universite Visitant Fields */}
        <h3 className="text-xl mt-6 mb-2">Université Visitant</h3>
        {renderInput(
          "Entité principale - Identifiant OP",
          "universiteEntiteIdentifiantOP"
        )}
        {renderInput("Date de début mobilité", "universiteDateDebutMobilite")}
        {renderInput("Date de fin mobilité", "universiteDateFinMobilite")}
        {renderInput("Type Mobilité", "universiteTypeMobilite")}
        {renderInput("Nom mobilité", "universiteNomMobilite")}
        <div className="w-full flex justify-between">
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Search
          </button>
          <button
            type="button"
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
                  <strong>Nom:</strong> {student["Nom"]}
                </p>
                <p>
                  <strong>Prénom:</strong> {student["Prénom"]}
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
                      <strong>Identifiant OP:</strong>{" "}
                      {student["Identifiant OP"]}
                    </p>
                    <p>
                      <strong>Nationalité:</strong> {student["Nationalité"]}
                    </p>
                    <p>
                      <strong>Filière:</strong> {student["Filière"]}
                    </p>
                    {/* Display Convention de Stage */}
                    {student["CONVENTION DE STAGE"] &&
                      student["CONVENTION DE STAGE"].map((convention, idx) => (
                        <div key={idx} className="mt-2">
                          <h4 className="font-bold">Convention de Stage:</h4>
                          <p>
                            <strong>Entité principale - Identifiant OP:</strong>{" "}
                            {convention["Entité principale - Identifiant OP"]}
                          </p>
                          <p>
                            <strong>Date de début du stage:</strong>{" "}
                            {convention["Date de début du stage"]}
                          </p>
                          <p>
                            <strong>Date de fin du stage:</strong>{" "}
                            {convention["Date de fin du stage"]}
                          </p>
                          <p>
                            <strong>Stage Fonction occupée:</strong>{" "}
                            {convention["Stage Fonction occupée"]}
                          </p>
                          <p>
                            <strong>Nom Stage:</strong>{" "}
                            {convention["Nom Stage"]}
                          </p>
                        </div>
                      ))}
                    {/* Display Universite Visitant */}
                    {student["UNIVERSITE visitant"] &&
                      student["UNIVERSITE visitant"].map((universite, idx) => (
                        <div key={idx} className="mt-2">
                          <h4 className="font-bold">Université Visitant:</h4>
                          <p>
                            <strong>Entité principale - Identifiant OP:</strong>{" "}
                            {universite["Entité principale - Identifiant OP"]}
                          </p>
                          <p>
                            <strong>Date de début mobilité:</strong>{" "}
                            {universite["Date de début mobilité"]}
                          </p>
                          <p>
                            <strong>Date de fin mobilité:</strong>{" "}
                            {universite["Date de fin mobilité"]}
                          </p>
                          <p>
                            <strong>Type Mobilité:</strong>{" "}
                            {universite["Type Mobilité"]}
                          </p>
                          <p>
                            <strong>Nom mobilité:</strong>{" "}
                            {universite["Nom mobilité"]}
                          </p>
                        </div>
                      ))}
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
