"use client";

import { useActionState } from "react"; // Removed unused import `useState`
import { useState } from "react"; // Added useState for managing file type and modal state
import { ActionReturn, SelectOption, Status } from "@/interfaces/form";
import { saveStudentData } from "./formHandler/action";
import SubmitButton from "../../components/SubmitButton";
import CustomSelect from "@/components/CustomSelect";

export default function AdminPage() {
  const [actionReturn, formAction, pending] = useActionState<
    ActionReturn,
    FormData
  >(saveStudentData, null);

  const [fileType, setFileType] = useState(""); // State to manage selected file type

  // State for Error Modal
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const errorsPerPage = 20;

  // Handler for file type change
  const handleFileTypeChange = (value: string) => {
    setFileType(value);
    // Reset pagination when file type changes
    setCurrentPage(0);
  };

  // Handlers for Error Modal
  const openErrorModal = () => {
    setIsErrorModalOpen(true);
    setCurrentPage(0); // Reset to first page when opening
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  const handleNextPage = () => {
    if (
      (currentPage + 1) * errorsPerPage <
      (actionReturn?.errors?.length || 0)
    ) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Calculate total pages
  const totalErrors = actionReturn?.errors?.length || 0;
  const totalPages = Math.ceil(totalErrors / errorsPerPage);

  // Generate an array of years from the current year to 30 years before
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 31 }, (_, i) => currentYear - i);

  const fileTypeOptions = [
    { label: "bdd", value: "bdd" },
    { label: "defis", value: "defis" },
    { label: "stages", value: "stages" },
    { label: "majeure", value: "majeure" },
  ] as SelectOption[];

  const yearsOptions: SelectOption[] = years.map((yr) => ({
    label: String(yr),
    value: String(yr),
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-6 relative">
      <form
        action={formAction}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md space-y-4 relative z-10"
      >
        <h1 className="text-2xl font-bold text-gray-700 text-center">
          Charger Un Fichier
        </h1>

        {/* Section de message de succès ou d'erreur */}
        {actionReturn && (
          <div
            className={`border px-4 py-3 rounded relative ${
              actionReturn.status === Status.success
                ? actionReturn.errors && actionReturn.errors.length > 0
                  ? "text-yellow-700 bg-yellow-100 border-yellow-400"
                  : "text-green-700 bg-green-100 border-green-400"
                : "text-red-700 bg-red-100 border-red-400"
            }`}
            role="alert"
          >
            <strong className="font-bold block">
              {actionReturn.status === Status.success
                ? actionReturn.errors && actionReturn.errors.length > 0
                  ? "Traitement terminé avec quelques erreurs !"
                  : "Traitement terminé !"
                : "Échec de la soumission !"}
            </strong>
            <p className="block sm:inline">
              {actionReturn.status === Status.success
                ? actionReturn.errors && actionReturn.errors.length > 0
                  ? "Les données des étudiants ont été téléchargées avec succès, mais certaines erreurs sont survenues."
                  : "Les données des étudiants ont été téléchargées avec succès."
                : actionReturn.message || "Nous avons rencontré des erreurs."}
            </p>

            {/* Button to open Error Modal */}
            {actionReturn.errors && actionReturn.errors.length > 0 && (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={openErrorModal}
                  className="text-blue-500 hover:underline"
                >
                  Voir les erreurs
                </button>
              </div>
            )}
          </div>
        )}

        {/* Champs de saisie */}
        <div className="mb-4">
          <label
            htmlFor="type"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Entrez le type de fichier
          </label>
          <CustomSelect
            options={fileTypeOptions}
            name="type"
            placeholder="Sélectionnez un type"
            value={fileType}
            onChange={handleFileTypeChange}
            defaultValue="bdd"
          />
        </div>

        {/* Conditionally render Graduation Year if fileType is 'bdd' */}
        {fileType === "bdd" && (
          <div className="mb-4">
            <label
              htmlFor="graduationYear"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Entrez l&apos;année de diplomation
            </label>
            <CustomSelect
              options={yearsOptions}
              name="graduationYear"
              placeholder="Sélectionnez une année"
            />
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="file"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Entrez votre fichier
          </label>
          <input
            required
            type="file"
            name="file"
            id="file"
            className="block w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
          />
        </div>

        <div className="flex justify-center">
          <SubmitButton
            text="Charger le fichier"
            pendingText="Chargement du fichier"
            pending={pending}
          />
        </div>
      </form>

      {/* Error Modal */}
      {isErrorModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative">
            <h2 className="text-xl font-bold mb-4">Liste des Erreurs</h2>
            <ul className="max-h-64 space-y-3 overflow-y-auto mb-4">
              {actionReturn?.errors
                ?.slice(
                  currentPage * errorsPerPage,
                  (currentPage + 1) * errorsPerPage
                )
                .map((error, index) => (
                  <li key={index} className="text-red-700">
                    {error}
                  </li>
                ))}
            </ul>
            <div className="flex justify-between">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className={`px-4 py-2 rounded ${
                  currentPage === 0
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Précédent
              </button>
              <span>
                Page {currentPage + 1} sur {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={(currentPage + 1) * errorsPerPage >= totalErrors}
                className={`px-4 py-2 rounded ${
                  (currentPage + 1) * errorsPerPage >= totalErrors
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Suivant
              </button>
            </div>
            <button
              onClick={closeErrorModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
