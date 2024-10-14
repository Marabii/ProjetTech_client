"use client";
import { useEffect, useState } from "react";

interface Filters {
  Date_de_naissance_gte?: string;
  Date_de_naissance_lte?: string;
  annee_d_entree_gte?: string;
  annee_d_entree_lte?: string;
  nom?: string;
  prenom?: string;
  mail?: string;
  Genre?: string;
  type_de_bac?: string;
  filiere_d_origine?: string;
  prepa_d_origine?: string;
  mode_d_admission?: string;
  est_fusion?: string;
  "autre_parcours_diplomant.type"?: string;
  "autre_parcours_diplomant.aPartenariat"?: string;
  "autre_parcours_diplomant.etablissement"?: string;
  "autre_parcours_diplomant.duree"?: string;
  "autre_parcours_diplomant.pays"?: string;
  "stages.nom_d_entreprise"?: string;
  annee_du_stage_gte?: string;
  annee_du_stage_lte?: string;
  "stages.duree_du_stage"?: string;
  "stages.poste"?: string;
  "diplomes.nom"?: string;
  annee_d_obtention_gte?: string;
  annee_d_obtention_lte?: string;
  "electifs.type_electif"?: string;
  "electifs.etablissement_electif"?: string;
  "electifs.semestre_d_electif"?: string;
}

import type { Stage, Diplome, Electif, Etudiant } from "@/interfaces/students";
import debounce from "lodash.debounce";

const App: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({});
  const [results, setResults] = useState<Etudiant[] | null>(null);
  const [suggestions, setSuggestions] = useState<{ [key: string]: string[] }>(
    {}
  );

  // Debounced function to fetch suggestions
  const fetchSuggestions = debounce(
    async (fieldName: string, value: string) => {
      if (value.length < 2) {
        setSuggestions((prev) => ({ ...prev, [fieldName]: [] }));
        return;
      }

      try {
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND
          }/api/suggestions?field=${encodeURIComponent(
            fieldName
          )}&query=${encodeURIComponent(value)}`
        );
        const data = await res.json();
        setSuggestions((prev) => ({ ...prev, [fieldName]: data.suggestions }));
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    },
    300
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });

    fetchSuggestions(e.target.name, e.target.value);
  };

  // Function to select a suggestion
  const handleSuggestionClick = (fieldName: string, suggestion: string) => {
    setFilters({
      ...filters,
      [fieldName]: suggestion,
    });

    // Clear suggestions after selection
    setSuggestions((prev) => ({ ...prev, [fieldName]: [] }));
  };

  const resetFilters = () => {
    setFilters({});
    setResults(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Construct the query object
    let query: any = {};

    console.log(
      "filters: ",
      filters["Parcours.electifs.etablissement_electif"]
    );

    // Personal Details
    if (filters.Date_de_naissance_gte || filters.Date_de_naissance_lte) {
      query.Date_de_naissance = {};
      if (filters.Date_de_naissance_gte) {
        query.Date_de_naissance["$gte"] = new Date(
          filters.Date_de_naissance_gte
        );
      }
      if (filters.Date_de_naissance_lte) {
        query.Date_de_naissance["$lte"] = new Date(
          filters.Date_de_naissance_lte
        );
      }
    }
    if (filters.annee_d_entree_gte || filters.annee_d_entree_lte) {
      query.annee_d_entree = {};
      if (filters.annee_d_entree_gte) {
        query.annee_d_entree["$gte"] = new Date(filters.annee_d_entree_gte);
      }
      if (filters.annee_d_entree_lte) {
        query.annee_d_entree["$lte"] = new Date(filters.annee_d_entree_lte);
      }
    }
    if (filters.nom) {
      query.nom = filters.nom;
    }
    if (filters.prenom) {
      query.prenom = filters.prenom;
    }
    if (filters.mail) {
      query.mail = filters.mail;
    }
    if (filters.Genre) {
      query.Genre = filters.Genre === "Male" ? true : false;
    }

    // Academic Information
    if (filters.type_de_bac) {
      query["Parcours.type_de_bac"] = filters.type_de_bac;
    }
    if (filters.filiere_d_origine) {
      query["Parcours.filiere_d_origine"] = filters.filiere_d_origine;
    }
    if (filters.prepa_d_origine) {
      query["Parcours.prepa_d_origine"] = filters.prepa_d_origine;
    }
    if (filters.mode_d_admission) {
      query["Parcours.mode_d_admission"] = filters.mode_d_admission;
    }
    if (filters.est_fusion) {
      query["Parcours.est_fusion"] = filters.est_fusion === "true";
    }

    // Autre Parcours Diplomant
    if (filters["autre_parcours_diplomant.type"]) {
      query["Parcours.autre_parcours_diplomant.type"] =
        filters["autre_parcours_diplomant.type"];
    }
    if (filters["autre_parcours_diplomant.aPartenariat"]) {
      query["Parcours.autre_parcours_diplomant.aPartenariat"] =
        filters["autre_parcours_diplomant.aPartenariat"] === "true";
    }
    if (filters["autre_parcours_diplomant.etablissement"]) {
      query["Parcours.autre_parcours_diplomant.etablissement"] =
        filters["autre_parcours_diplomant.etablissement"];
    }
    if (filters["autre_parcours_diplomant.duree"]) {
      query["Parcours.autre_parcours_diplomant.duree"] =
        filters["autre_parcours_diplomant.duree"];
    }
    if (filters["autre_parcours_diplomant.pays"]) {
      query["Parcours.autre_parcours_diplomant.pays"] =
        filters["autre_parcours_diplomant.pays"];
    }

    // Stage (Internship) Information
    if (filters["stages.nom_d_entreprise"]) {
      query["Parcours.stages.nom_d_entreprise"] =
        filters["stages.nom_d_entreprise"];
    }
    if (filters.annee_du_stage_gte || filters.annee_du_stage_lte) {
      query["Parcours.stages.annee_du_stage"] = {};
      if (filters.annee_du_stage_gte) {
        query["Parcours.stages.annee_du_stage"]["$gte"] = new Date(
          filters.annee_du_stage_gte
        );
      }
      if (filters.annee_du_stage_lte) {
        query["Parcours.stages.annee_du_stage"]["$lte"] = new Date(
          filters.annee_du_stage_lte
        );
      }
    }
    if (filters["stages.duree_du_stage"]) {
      query["Parcours.stages.duree_du_stage"] =
        filters["stages.duree_du_stage"];
    }
    if (filters["stages.poste"]) {
      query["Parcours.stages.poste"] = filters["stages.poste"];
    }

    // Diplome Information
    if (filters["diplomes.nom"]) {
      query["Parcours.diplomes.nom"] = filters["diplomes.nom"];
    }
    if (filters.annee_d_obtention_gte || filters.annee_d_obtention_lte) {
      query["Parcours.diplomes.annee_d_obtention"] = {};
      if (filters.annee_d_obtention_gte) {
        query["Parcours.diplomes.annee_d_obtention"]["$gte"] = new Date(
          filters.annee_d_obtention_gte
        );
      }
      if (filters.annee_d_obtention_lte) {
        query["Parcours.diplomes.annee_d_obtention"]["$lte"] = new Date(
          filters.annee_d_obtention_lte
        );
      }
    }

    // Electif Information
    if (filters["Parcours.electifs.type_electif"]) {
      query["Parcours.electifs.type_electif"] =
        filters["Parcours.electifs.type_electif"];
    }
    if (filters["Parcours.electifs.etablissement_electif"]) {
      query["Parcours.electifs.etablissement_electif"] =
        filters["Parcours.electifs.etablissement_electif"];
    }
    if (filters["Parcours.electifs.semestre_d_electif"]) {
      query["Parcours.electifs.semestre_d_electif"] =
        filters["Parcours.electifs.semestre_d_electif"];
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/students`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(query),
        }
      );

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Student Search</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-lg"
        >
          {/* Personal Information */}
          <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date of Birth */}
            <div>
              <label className="block text-gray-700">
                Date_de_naissance (From):
              </label>
              <input
                type="date"
                name="Date_de_naissance_gte"
                value={filters.Date_de_naissance_gte || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700">
                Date_de_naissance (To):
              </label>
              <input
                type="date"
                name="Date_de_naissance_lte"
                value={filters.Date_de_naissance_lte || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              />
            </div>

            {/* Year of Entry */}
            <div>
              <label className="block text-gray-700">
                annee_d_entree (From):
              </label>
              <input
                type="date"
                name="annee_d_entree_gte"
                value={filters.annee_d_entree_gte || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700">
                annee_d_entree (To):
              </label>
              <input
                type="date"
                name="annee_d_entree_lte"
                value={filters.annee_d_entree_lte || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              />
            </div>

            {/* Other Personal Fields */}
            <div>
              <label className="block text-gray-700">nom:</label>
              <input
                type="text"
                name="nom"
                value={filters.nom || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              />
              {suggestions["nom"] && suggestions["nom"].length > 0 && (
                <ul className="border border-gray-300 rounded-md mt-1 max-h-40 overflow-auto">
                  {suggestions["nom"].map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick("nom", suggestion)}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label className="block text-gray-700">prenom:</label>
              <input
                type="text"
                name="prenom"
                value={filters.prenom || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              />
              {suggestions["prenom"] && suggestions["prenom"].length > 0 && (
                <ul className="border border-gray-300 rounded-md mt-1 max-h-40 overflow-auto">
                  {suggestions["prenom"].map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() =>
                        handleSuggestionClick("prenom", suggestion)
                      }
                      className="p-2 cursor-pointer hover:bg-gray-200"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label className="block text-gray-700">mail:</label>
              <input
                type="email"
                name="mail"
                value={filters.mail || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              />
              {suggestions["mail"] && suggestions["mail"].length > 0 && (
                <ul className="border border-gray-300 rounded-md mt-1 max-h-40 overflow-auto">
                  {suggestions["mail"].map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick("mail", suggestion)}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label className="block text-gray-700">Genre:</label>
              <select
                name="Genre"
                value={filters.Genre || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              >
                <option value="">Select Genre</option>
                <option value="Male">True (Male)</option>
                <option value="Female">False (Female)</option>
              </select>
            </div>
          </div>

          {/* Academic Information */}
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Academic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type of Bac */}
            <div>
              <label className="block text-gray-700">
                Parcours.type_de_bac:
              </label>
              <input
                type="text"
                name="type_de_bac"
                value={filters.type_de_bac || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              />
            </div>

            {/* Filiere d'origine */}
            <div>
              <label className="block text-gray-700">
                Parcours.filiere_d_origine:
              </label>
              <input
                type="text"
                name="filiere_d_origine"
                value={filters.filiere_d_origine || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              />
            </div>

            {/* Prepa d'origine */}
            <div>
              <label className="block text-gray-700">
                Parcours.prepa_d_origine:
              </label>
              <input
                type="text"
                name="prepa_d_origine"
                value={filters.prepa_d_origine || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              />
            </div>

            {/* Mode d'admission */}
            <div>
              <label className="block text-gray-700">
                Parcours.mode_d_admission:
              </label>
              <select
                name="mode_d_admission"
                value={filters.mode_d_admission || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              >
                <option value="">Select Mode of Admission</option>
                <option value="AST">AST</option>
                <option value="Mines-Pont">Mines-Pont</option>
                <option value="EM">EM</option>
                <option value="FAC">FAC</option>
              </select>
            </div>

            {/* est_fusion */}
            <div>
              <label className="block text-gray-700">
                Parcours.est_fusion:
              </label>
              <select
                name="est_fusion"
                value={filters.est_fusion || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              >
                <option value="">Select</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          </div>

          {/* Autre Parcours Diplomant */}
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Autre Parcours Diplomant
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type */}
            <div>
              <label className="block text-gray-700">
                Parcours.autre_parcours_diplomant.type:
              </label>
              <input
                type="text"
                name="autre_parcours_diplomant.type"
                value={filters["autre_parcours_diplomant.type"] || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              />
            </div>

            {/* aPartenariat */}
            <div>
              <label className="block text-gray-700">
                Parcours.autre_parcours_diplomant.aPartenariat:
              </label>
              <select
                name="autre_parcours_diplomant.aPartenariat"
                value={filters["autre_parcours_diplomant.aPartenariat"] || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              >
                <option value="">Select</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>

            {/* Etablissement */}
            <div>
              <label className="block text-gray-700">
                Parcours.autre_parcours_diplomant.etablissement:
              </label>
              <input
                type="text"
                name="autre_parcours_diplomant.etablissement"
                value={filters["autre_parcours_diplomant.etablissement"] || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              />
            </div>

            {/* Duree */}
            <div>
              <label className="block text-gray-700">
                Parcours.autre_parcours_diplomant.duree:
              </label>
              <input
                type="text"
                name="autre_parcours_diplomant.duree"
                value={filters["autre_parcours_diplomant.duree"] || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              />
            </div>

            {/* Pays */}
            <div>
              <label className="block text-gray-700">
                Parcours.autre_parcours_diplomant.pays:
              </label>
              <input
                type="text"
                name="autre_parcours_diplomant.pays"
                value={filters["autre_parcours_diplomant.pays"] || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Stage Information */}
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Stage Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* nom_d_entreprise */}
            <div>
              <label className="block text-gray-700">
                Parcours.stages.nom_d_entreprise:
              </label>
              <input
                type="text"
                name="stages.nom_d_entreprise"
                value={filters["stages.nom_d_entreprise"] || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              />
            </div>

            {/* annee_du_stage */}
            <div>
              <label className="block text-gray-700">
                Parcours.stages.annee_du_stage (From):
              </label>
              <input
                type="date"
                name="annee_du_stage_gte"
                value={filters.annee_du_stage_gte || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700">
                Parcours.stages.annee_du_stage (To):
              </label>
              <input
                type="date"
                name="annee_du_stage_lte"
                value={filters.annee_du_stage_lte || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              />
            </div>

            {/* duree_du_stage */}
            <div>
              <label className="block text-gray-700">
                Parcours.stages.duree_du_stage:
              </label>
              <input
                type="text"
                name="stages.duree_du_stage"
                value={filters["stages.duree_du_stage"] || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              />
            </div>

            {/* poste */}
            <div>
              <label className="block text-gray-700">
                Parcours.stages.poste:
              </label>
              <input
                type="text"
                name="stages.poste"
                value={filters["stages.poste"] || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Diplome Information */}
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Diplome Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* diplome.nom */}
            <div>
              <label className="block text-gray-700">
                Parcours.diplomes.nom:
              </label>
              <input
                type="text"
                name="Parcours.diplomes.nom"
                value={filters["Parcours.diplomes.nom"] || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              />
              {suggestions["Parcours.diplomes.nom"] &&
                suggestions["Parcours.diplomes.nom"].length > 0 && (
                  <ul className="border border-gray-300 rounded-md mt-1 max-h-40 overflow-auto">
                    {suggestions["Parcours.diplomes.nom"].map(
                      (suggestion, index) => (
                        <li
                          key={index}
                          onClick={() =>
                            handleSuggestionClick(
                              "Parcours.diplomes.nom",
                              suggestion
                            )
                          }
                          className="p-2 cursor-pointer hover:bg-gray-200"
                        >
                          {suggestion}
                        </li>
                      )
                    )}
                  </ul>
                )}
            </div>

            {/* annee_d_obtention */}
            <div>
              <label className="block text-gray-700">
                Parcours.diplomes.annee_d_obtention (From):
              </label>
              <input
                type="date"
                name="annee_d_obtention_gte"
                value={filters.annee_d_obtention_gte || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700">
                Parcours.diplomes.annee_d_obtention (To):
              </label>
              <input
                type="date"
                name="annee_d_obtention_lte"
                value={filters.annee_d_obtention_lte || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Electif Information */}
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Electif Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* type_electif */}
            <div>
              <label className="block text-gray-700">
                Parcours.electifs.type_electif:
              </label>
              <input
                type="text"
                name="electifs.type_electif"
                value={filters["electifs.type_electif"] || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              />
            </div>

            {/* etablissement_electif */}
            <div>
              <label className="block text-gray-700">
                Parcours.electifs.etablissement_electif:
              </label>
              <input
                type="text"
                name="Parcours.electifs.etablissement_electif"
                value={filters["Parcours.electifs.etablissement_electif"] || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
                autoComplete="off"
              />
              {/* Suggestions dropdown */}
              {suggestions["Parcours.electifs.etablissement_electif"] &&
                suggestions["Parcours.electifs.etablissement_electif"].length >
                  0 && (
                  <ul className="border border-gray-300 rounded-md mt-1 max-h-40 overflow-auto">
                    {suggestions["Parcours.electifs.etablissement_electif"].map(
                      (suggestion, index) => (
                        <li
                          key={index}
                          onClick={() =>
                            handleSuggestionClick(
                              "Parcours.electifs.etablissement_electif",
                              suggestion
                            )
                          }
                          className="p-2 cursor-pointer hover:bg-gray-200"
                        >
                          {suggestion}
                        </li>
                      )
                    )}
                  </ul>
                )}
            </div>

            {/* semestre_d_electif */}
            <div>
              <label className="block text-gray-700">
                Parcours.electifs.semestre_d_electif:
              </label>
              <input
                type="text"
                name="electifs.semestre_d_electif"
                value={filters["electifs.semestre_d_electif"] || ""}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Submit And Reset Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="w-full md:w-auto bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
            >
              Search
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="w-full md:w-auto bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 mt-4 md:mt-0 md:ml-4"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Results */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-6">Results</h2>
          {results ? (
            results.length !== 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((student: Etudiant, index: number) => (
                  <div
                    key={index}
                    className="bg-white shadow-md rounded-lg p-6"
                  >
                    {/* Basic Information */}
                    <h3 className="text-xl font-semibold mb-2">
                      {student.nom} {student.prenom}
                    </h3>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Email:</span> {student.mail}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Date de Naissance:</span>{" "}
                      {student.Date_de_naissance
                        ? new Date(
                            student.Date_de_naissance
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Année d'Entrée:</span>{" "}
                      {student.annee_d_entree
                        ? new Date(student.annee_d_entree).getFullYear()
                        : "N/A"}
                    </p>
                    <p className="text-gray-600 mb-4">
                      <span className="font-medium">Genre:</span>{" "}
                      {student.Genre !== undefined
                        ? student.Genre
                          ? "Masculin"
                          : "Féminin"
                        : "N/A"}
                    </p>

                    {/* Parcours Section */}
                    {student.Parcours && (
                      <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-2">Parcours</h4>
                        <p className="text-gray-600 mb-1">
                          <span className="font-medium">Type de Bac:</span>{" "}
                          {student.Parcours.type_de_bac || "N/A"}
                        </p>
                        <p className="text-gray-600 mb-1">
                          <span className="font-medium">
                            Filière d'Origine:
                          </span>{" "}
                          {student.Parcours.filiere_d_origine || "N/A"}
                        </p>
                        <p className="text-gray-600 mb-1">
                          <span className="font-medium">Prépa d'Origine:</span>{" "}
                          {student.Parcours.prepa_d_origine || "N/A"}
                        </p>
                        <p className="text-gray-600 mb-1">
                          <span className="font-medium">Mode d'Admission:</span>{" "}
                          {student.Parcours.mode_d_admission || "N/A"}
                        </p>
                        <p className="text-gray-600 mb-1">
                          <span className="font-medium">Est Fusion:</span>{" "}
                          {student.Parcours.est_fusion !== undefined
                            ? student.Parcours.est_fusion
                              ? "Oui"
                              : "Non"
                            : "N/A"}
                        </p>

                        {/* Autre Parcours Diplomant */}
                        {student.Parcours.autre_parcours_diplomant && (
                          <div className="mt-2">
                            <h5 className="text-md font-semibold mb-1">
                              Autre Parcours Diplomant
                            </h5>
                            <p className="text-gray-600 mb-1">
                              <span className="font-medium">Type:</span>{" "}
                              {student.Parcours.autre_parcours_diplomant.type ||
                                "N/A"}
                            </p>
                            <p className="text-gray-600 mb-1">
                              <span className="font-medium">
                                À Partenariat:
                              </span>{" "}
                              {student.Parcours.autre_parcours_diplomant
                                .aPartenariat !== undefined
                                ? student.Parcours.autre_parcours_diplomant
                                    .aPartenariat
                                  ? "Oui"
                                  : "Non"
                                : "N/A"}
                            </p>
                            <p className="text-gray-600 mb-1">
                              <span className="font-medium">
                                Établissement:
                              </span>{" "}
                              {student.Parcours.autre_parcours_diplomant
                                .etablissement || "N/A"}
                            </p>
                            <p className="text-gray-600 mb-1">
                              <span className="font-medium">Durée:</span>{" "}
                              {student.Parcours.autre_parcours_diplomant
                                .duree || "N/A"}
                            </p>
                            <p className="text-gray-600 mb-1">
                              <span className="font-medium">Pays:</span>{" "}
                              {student.Parcours.autre_parcours_diplomant.pays ||
                                "N/A"}
                            </p>
                          </div>
                        )}

                        {/* Stages */}
                        {student.Parcours.stages &&
                          student.Parcours.stages.length > 0 && (
                            <div className="mt-4">
                              <h5 className="text-md font-semibold mb-2">
                                Stages
                              </h5>
                              {student.Parcours.stages.map(
                                (stage: Stage, idx: number) => (
                                  <div key={idx} className="mb-2">
                                    <p className="text-gray-600 mb-1">
                                      <span className="font-medium">
                                        Entreprise:
                                      </span>{" "}
                                      {stage.nom_d_entreprise || "N/A"}
                                    </p>
                                    <p className="text-gray-600 mb-1">
                                      <span className="font-medium">
                                        Année du Stage:
                                      </span>{" "}
                                      {stage.annee_du_stage
                                        ? new Date(
                                            stage.annee_du_stage
                                          ).getFullYear()
                                        : "N/A"}
                                    </p>
                                    <p className="text-gray-600 mb-1">
                                      <span className="font-medium">
                                        Durée:
                                      </span>{" "}
                                      {stage.duree_du_stage || "N/A"}
                                    </p>
                                    <p className="text-gray-600 mb-1">
                                      <span className="font-medium">
                                        Poste:
                                      </span>{" "}
                                      {stage.poste || "N/A"}
                                    </p>
                                  </div>
                                )
                              )}
                            </div>
                          )}

                        {/* Diplômes */}
                        {student.Parcours.diplomes &&
                          student.Parcours.diplomes.length > 0 && (
                            <div className="mt-4">
                              <h5 className="text-md font-semibold mb-2">
                                Diplômes
                              </h5>
                              {student.Parcours.diplomes.map(
                                (diplome: Diplome, idx: number) => (
                                  <div key={idx} className="mb-2">
                                    <p className="text-gray-600 mb-1">
                                      <span className="font-medium">Nom:</span>{" "}
                                      {diplome.nom || "N/A"}
                                    </p>
                                    <p className="text-gray-600 mb-1">
                                      <span className="font-medium">
                                        Année d'Obtention:
                                      </span>{" "}
                                      {diplome.annee_d_obtention
                                        ? new Date(
                                            diplome.annee_d_obtention
                                          ).getFullYear()
                                        : "N/A"}
                                    </p>
                                  </div>
                                )
                              )}
                            </div>
                          )}

                        {/* Électifs */}
                        {student.Parcours.electifs &&
                          student.Parcours.electifs.length > 0 && (
                            <div className="mt-4">
                              <h5 className="text-md font-semibold mb-2">
                                Électifs
                              </h5>
                              {student.Parcours.electifs.map(
                                (electif: Electif, idx: number) => (
                                  <div key={idx} className="mb-2">
                                    <p className="text-gray-600 mb-1">
                                      <span className="font-medium">Type:</span>{" "}
                                      {electif.type_electif || "N/A"}
                                    </p>
                                    <p className="text-gray-600 mb-1">
                                      <span className="font-medium">
                                        Établissement:
                                      </span>{" "}
                                      {electif.etablissement_electif || "N/A"}
                                    </p>
                                    <p className="text-gray-600 mb-1">
                                      <span className="font-medium">
                                        Semestre:
                                      </span>{" "}
                                      {electif.semestre_d_electif || "N/A"}
                                    </p>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No student matches the filters.
              </p>
            )
          ) : (
            <p className="text-center text-gray-500">No results yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
