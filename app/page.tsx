"use client";

import { useActionState, useState, useEffect } from "react";
import type { Etudiant } from "@/interfaces/students";
import { searchStudentsAction } from "./(homePageComponents)/formHandler/searchStudentsAction";
import { searchFields } from "./(homePageComponents)/formHandler/searchFields";
import RenderStudents from "./(homePageComponents)/RenderStudents";
import { ActionReturnWithData, SearchResult } from "@/interfaces/form";
import SubmitButton from "@/components/SubmitButton";
import RenderInput from "./(homePageComponents)/RenderInput";
import { motion, AnimatePresence } from "framer-motion";

const StudentQueryForm: React.FC = () => {
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [currPage, setCurrPage] = useState<number>(1);
  const [students, setStudents] = useState<Etudiant[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [actionReturn, formAction, pending] = useActionState<
    ActionReturnWithData<SearchResult>,
    FormData
  >(searchStudentsAction, null);

  const studentsPerPage = 20;
  const totalPages = Math.ceil(totalCount / studentsPerPage);

  const isEmptySearch = students.length === 0 && wasSubmitted && !pending;

  useEffect(() => {
    if (actionReturn?.data) {
      setTotalCount(actionReturn.data.totalCount);
      setStudents(actionReturn.data.students);
    }
  }, [actionReturn]);

  // Function to handle reset
  const resetInputFields = () => {
    setResetTrigger((prev) => prev + 1);
    setStudents([]);
    setWasSubmitted(false);
    setCurrPage(1);
    setTotalCount(0);
  };

  // Function to handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrPage(page);
    setWasSubmitted(true);
  };

  // Function to determine the pages to display in the pagination bar
  const getPagination = () => {
    const pages = [];

    // Always show the first 5 pages or all if totalPages <= 6
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currPage <= 5) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currPage > totalPages - 5) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currPage; i < currPage + 5; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  const advancedVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1 },
  };

  return (
    <motion.form
      className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg"
      action={formAction}
      autoComplete="off"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Rechercher</h2>

      {/* Common Search Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {searchFields.commonSearch.map((input) => (
          <motion.div
            key={input.name}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <RenderInput
              name={input.name}
              type={input.type as "text" | "date"}
              label={input.label}
              resetTrigger={resetTrigger}
            />
          </motion.div>
        ))}
      </div>

      {/* Toggle Advanced Search */}
      <div className="flex justify-between">
        <motion.button
          type="button"
          className="mt-4 text-blue-500 hover:underline focus:outline-none"
          onClick={() => setShowAdvanced((prev) => !prev)}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {showAdvanced
            ? "Masquer la recherche avancée"
            : "Afficher la recherche avancée"}
        </motion.button>

        <motion.button
          type="button"
          className="mt-4 text-red-500 hover:underline focus:outline-none"
          onClick={resetInputFields}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Réinitialiser les champs de saisie
        </motion.button>
      </div>

      {/* Advanced Search Fields with Animation */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={advancedVariants}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {searchFields.advancedSearch.map((input) => (
              <motion.div
                key={input.name}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <RenderInput
                  name={input.name}
                  type={input.type as "text" | "date"}
                  label={input.label}
                  resetTrigger={resetTrigger}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <div className="w-full flex justify-center mt-6">
        <SubmitButton
          pending={pending}
          callback={() => {
            setStudents([]);
            setWasSubmitted(true);
            setCurrPage(1);
          }}
        />
      </div>

      {/* Display the search results */}
      <AnimatePresence>
        {students && students.length > 0 && (
          <motion.div
            className="mt-8"
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            variants={containerVariants}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            <RenderStudents students={students} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <motion.div
          className="flex justify-center mt-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <input type="hidden" name="currPage" value={currPage} />
          <nav className="inline-flex -space-x-px" aria-label="Pagination">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currPage - 1)}
              disabled={currPage === 1}
              className={`px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 ${
                currPage === 1
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
              aria-label="Previous"
            >
              Précédent
            </button>

            {/* Page Numbers */}
            {getPagination().map((page, index) => {
              if (page === "ellipsis") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-3 py-2 text-gray-500 bg-white border border-gray-300"
                  >
                    ...
                  </span>
                );
              } else {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page as number)}
                    className={`px-3 py-2 leading-tight border border-gray-300 ${
                      currPage === page
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                );
              }
            })}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currPage + 1)}
              disabled={currPage === totalPages}
              type="submit"
              className={`px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 ${
                currPage === totalPages
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
              aria-label="Next"
            >
              Suivant
            </button>
          </nav>
        </motion.div>
      )}

      {/* No Results Message */}
      {isEmptySearch && (
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <p className="text-xl text-red-500">
            Aucun étudiant trouvé pour vos critères de recherche.
          </p>
        </motion.div>
      )}
    </motion.form>
  );
};

export default StudentQueryForm;
