// components/RenderStudents.tsx

"use client";

import { useState, memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Etudiant,
  ConventionDeStage,
  UniversiteVisitant,
} from "@/interfaces/students";
import DéfiEtMajeureCard from "./DéfiEtMajeureCard";

interface RenderStudentsProps {
  students: Etudiant[];
}

const RenderStudents: React.FC<RenderStudentsProps> = ({ students }) => {
  const [selectedStudent, setSelectedStudent] = useState<Etudiant | null>(null);

  const handleShowMore = (student: Etudiant) => {
    setSelectedStudent(student);
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="mt-8 px-4">
      <h3 className="text-2xl font-semibold mb-6 text-center">
        Search Results
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {students.map((student, index) => (
          <StudentCard
            key={index}
            student={student}
            onShowMore={() => handleShowMore(student)}
          />
        ))}
      </div>

      {/* Modal for Selected Student */}
      <AnimatePresence>
        {selectedStudent && (
          <Modal onClose={handleCloseModal}>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">
                {selectedStudent.Nom} {selectedStudent.Prénom}
              </h2>
              <div className="space-y-2">
                <p>
                  <strong>Identifiant OP:</strong>{" "}
                  {selectedStudent["Identifiant OP"]}
                </p>
                <p>
                  <strong>Nationalité:</strong> {selectedStudent.Nationalité}
                </p>
                <p>
                  <strong>Filière:</strong> {selectedStudent.Filière}
                </p>
                <p>
                  <strong>Établissement d'origine:</strong>{" "}
                  {selectedStudent["Etablissement d'origine"]}
                </p>

                {/* Display Convention de Stage */}
                {selectedStudent["CONVENTION DE STAGE"] &&
                  selectedStudent["CONVENTION DE STAGE"].length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-xl font-semibold">
                        Convention de Stage:
                      </h3>
                      {selectedStudent["CONVENTION DE STAGE"].map(
                        (convention, idx) => (
                          <ConventionStageCard
                            key={idx}
                            convention={convention}
                          />
                        )
                      )}
                    </div>
                  )}

                {/* Display Universite Visitant */}
                {selectedStudent["UNIVERSITE visitant"] &&
                  selectedStudent["UNIVERSITE visitant"].length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-xl font-semibold">
                        Université Visitant:
                      </h3>
                      {selectedStudent["UNIVERSITE visitant"].map(
                        (universite, idx) => (
                          <UniversiteVisitantCard
                            key={idx}
                            universite={universite}
                          />
                        )
                      )}
                    </div>
                  )}

                {/* Display DéfiEtMajeure */}
                {selectedStudent.DéfiEtMajeure && (
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold">Défi et Majeure:</h3>
                    <DéfiEtMajeureCard
                      defiEtMajeure={selectedStudent.DéfiEtMajeure}
                    />
                  </div>
                )}
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

interface StudentCardProps {
  student: Etudiant;
  onShowMore: () => void;
}

const StudentCard: React.FC<StudentCardProps> = memo(
  ({ student, onShowMore }) => {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300">
        <div>
          <p className="text-lg">
            <strong>Nom:</strong> {student.Nom}
          </p>
          <p className="text-lg">
            <strong>Prénom:</strong> {student.Prénom}
          </p>
        </div>
        <button
          type="button"
          onClick={onShowMore}
          className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium flex items-center group"
        >
          Show More
          <svg
            className="ml-2 w-5 h-5 transition-transform duration-300 transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    );
  }
);

interface ConventionStageCardProps {
  convention: ConventionDeStage;
}

const ConventionStageCard: React.FC<ConventionStageCardProps> = memo(
  ({ convention }) => {
    return (
      <div className="mt-2 p-4 bg-gray-50 rounded-lg shadow-inner">
        <p>
          <strong>Entité principale - Identifiant OP:</strong>{" "}
          {convention["Entité principale - Identifiant OP"]}
        </p>
        <p>
          <strong>Date de début du stage:</strong>{" "}
          {new Date(convention["Date de début du stage"]).toLocaleDateString()}
        </p>
        <p>
          <strong>Date de fin du stage:</strong>{" "}
          {new Date(convention["Date de fin du stage"]).toLocaleDateString()}
        </p>
        <p>
          <strong>Stage Fonction occupée:</strong>{" "}
          {convention["Stage Fonction occupée"]}
        </p>
        <p>
          <strong>Nom Stage:</strong> {convention["Nom Stage"]}
        </p>
      </div>
    );
  }
);

interface UniversiteVisitantCardProps {
  universite: UniversiteVisitant;
}

const UniversiteVisitantCard: React.FC<UniversiteVisitantCardProps> = memo(
  ({ universite }) => {
    return (
      <div className="mt-2 p-4 bg-gray-50 rounded-lg shadow-inner">
        <p>
          <strong>Entité principale - Identifiant OP:</strong>{" "}
          {universite["Entité principale - Identifiant OP"]}
        </p>
        <p>
          <strong>Date de début mobilité:</strong>{" "}
          {new Date(universite["Date de début mobilité"]).toLocaleDateString()}
        </p>
        <p>
          <strong>Date de fin mobilité:</strong>{" "}
          {new Date(universite["Date de fin mobilité"]).toLocaleDateString()}
        </p>
        <p>
          <strong>Type Mobilité:</strong> {universite["Type Mobilité"]}
        </p>
        <p>
          <strong>Nom mobilité:</strong> {universite["Nom mobilité"]}
        </p>
      </div>
    );
  }
);

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ onClose, children }: ModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white overflow-y-scroll max-h-[700px] rounded-lg shadow-2xl max-w-3xl w-full mx-4 p-6 relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e: React.MouseEvent<HTMLElement>) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}

export default RenderStudents;
