"use client";

import { useActionState, useState } from "react";
import { ActionReturn, Status } from "@/interfaces/form";
import { saveStudentData } from "./formHandler/action";
import SubmitButton from "../../components/SubmitButton";

export default function AdminPage() {
  const [actionReturn, formAction, pending] = useActionState<
    ActionReturn,
    FormData
  >(saveStudentData, null);

  const [visibleCount, setVisibleCount] = useState(20); // Initial number of errors to show

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 20); // Show 20 more errors
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-6">
      <form
        action={formAction}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-gray-700 text-center">
          Upload File
        </h1>

        {/* Success Message Section */}
        {actionReturn?.status === Status.success && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Processing complete!</strong>
            <span className="block sm:inline">
              {" "}
              Your student data has been uploaded successfully.
            </span>
            {actionReturn.message && (
              <span className="block sm:inline">{actionReturn.message}</span>
            )}
          </div>
        )}

        {/* Error Display Section */}
        {actionReturn?.status === Status.failure &&
          actionReturn.errors?.length &&
          actionReturn.errors?.length > 0 && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Submission Failed!</strong>
              <span className="block sm:inline">
                {actionReturn.message || "We encountered some errors"}
              </span>
              <ul className="mt-2 list-disc list-inside text-sm">
                {actionReturn.errors
                  .slice(0, visibleCount)
                  .map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
              </ul>
              {visibleCount < actionReturn.errors.length && (
                <button
                  type="button"
                  onClick={handleShowMore}
                  className="mt-2 text-blue-500 hover:underline"
                >
                  Show more
                </button>
              )}
            </div>
          )}

        {/* Input Fields */}
        <div className="mb-4">
          <label
            htmlFor="type"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Enter file type
          </label>
          <select
            required
            name="type"
            id="type"
            className="block w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
          >
            <option value="bdd">bdd</option>
            <option value="defis">defis</option>
            <option value="stages">stages</option>
            <option value="majeure">majeure</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="file"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Enter your file
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
          <SubmitButton pending={pending} />
        </div>
      </form>
    </div>
  );
}
