"use client";

import { useActionState, useState, useEffect } from "react";
import type { Etudiant } from "@/interfaces/students";
import Input from "@/components/Input";
import { searchStudentsAction } from "./(homePageComponents)/formHandler/searchStudentsAction";
import { names } from "./(homePageComponents)/formHandler/InputFields";
import RenderStudents from "./(homePageComponents)/RenderStudents";
import { ActionReturnWithData } from "@/interfaces/form";
import SubmitButton from "@/components/SubmitButton";

const StudentQueryForm: React.FC = () => {
  const [currPage, setCurrPage] = useState<number>(1);
  const [students, setStudents] = useState<Etudiant[]>([]);
  const hasMore = students?.length === 20;
  const [actionReturn, formAction, pending] = useActionState<
    ActionReturnWithData<Etudiant[]>,
    FormData
  >(searchStudentsAction, null);

  useEffect(() => {
    if (actionReturn?.data && actionReturn?.data.length > 0) {
      setStudents((prev) => [...prev, ...actionReturn?.data]);
    }
  }, [actionReturn]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <form action={formAction}>
        <h2 className="text-2xl mb-6">Search Students</h2>

        {names.map((inputName) => (
          <Input name={inputName} key={inputName} />
        ))}

        <div className="w-full flex justify-between">
          <SubmitButton pending={pending} />
        </div>

        {/* Display the search results */}
        {students && students.length > 0 && (
          <RenderStudents students={students} />
        )}

        {hasMore && (
          <>
            <input type="hidden" name="currPage" value={currPage + 1} />
            <button
              onClick={() => setCurrPage(currPage + 1)}
              type="submit"
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Show More Students
            </button>
          </>
        )}
      </form>

      {/* {isEmptySearch && (
        <div className="mt-8 text-center">
          <p className="text-xl text-red-500">
            No students found for your search criteria.
          </p>
        </div>
      )} */}
    </div>
  );
};

export default StudentQueryForm;
