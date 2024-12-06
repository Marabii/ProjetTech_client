"use client";

import { useActionState, useState, useEffect } from "react";
import type { Etudiant } from "@/interfaces/students";
import { searchStudentsAction } from "./(homePageComponents)/formHandler/searchStudentsAction";
import { searchFields } from "./(homePageComponents)/formHandler/searchFields";
import RenderStudents from "./(homePageComponents)/RenderStudents";
import { ActionReturnWithData } from "@/interfaces/form";
import SubmitButton from "@/components/SubmitButton";
import RenderInput from "./(homePageComponents)/RenderInput";
import { motion, AnimatePresence } from "framer-motion";

const StudentQueryForm: React.FC = () => {
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [currPage, setCurrPage] = useState<number>(1);
  const [students, setStudents] = useState<Etudiant[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [actionReturn, formAction, pending] = useActionState<
    ActionReturnWithData<Etudiant[]>,
    FormData
  >(searchStudentsAction, null);

  const hasMore =
    (currPage * students.length) % 20 === 0 && students.length !== 0;

  const isEmptySearch = students.length === 0 && wasSubmitted && !pending;

  useEffect(() => {
    if (actionReturn?.data && actionReturn?.data.length > 0) {
      setStudents((prev) => [...prev, ...actionReturn?.data]);
    }
  }, [actionReturn]);

  // Function to handle reset
  const resetInputFields = () => {
    setResetTrigger((prev) => prev + 1);
    setStudents([]);
    setWasSubmitted(false);
    setCurrPage(1);
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
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">
        Student Search
      </h2>

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
          {showAdvanced ? "Hide Advanced Search" : "Show Advanced Search"}
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
          Reset Input Fields
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

      {/* Show More Button */}
      {hasMore && (
        <motion.div
          className="flex justify-center mt-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <input type="hidden" name="currPage" value={currPage} />
          <button
            onClick={() => setCurrPage(currPage + 1)}
            type="submit"
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Show More Students
          </button>
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
            No students found for your search criteria.
          </p>
        </motion.div>
      )}
    </motion.form>
  );
};

export default StudentQueryForm;
