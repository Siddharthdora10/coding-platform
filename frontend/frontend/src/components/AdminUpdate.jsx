import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../utils/axiosClient";

const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),

  description: z.string().min(1, "Description is required"),

  difficulty: z.enum(["easy", "medium", "hard"]),

  tags: z.enum(["array", "linkedList", "graph", "dp"]),

  visibleTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
        explanation: z.string().min(1, "Explanation is required"),
      })
    )
    .min(1, "At least one visible test case required"),

  // Hidden test cases are optional during update
  hiddenTestCases: z.array(
    z.object({
      input: z.string(),
      output: z.string(),
    })
  ),

  startCode: z
    .array(
      z.object({
        language: z.enum(["C++", "Java", "JavaScript"]),
        initialCode: z.string().min(1, "Initial code is required"),
      })
    )
    .length(3, "All three languages required"),

  referenceSolution: z
    .array(
      z.object({
        language: z.enum(["C++", "Java", "JavaScript"]),
        completeCode: z.string().min(1, "Complete code is required"),
      })
    )
    .length(3, "All three languages required"),
});

const AdminUpdate = () => {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProblem, setSelectedProblem] = useState(null);

  const [loadingProblems, setLoadingProblems] = useState(true);
  const [loadingProblem, setLoadingProblem] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),

    defaultValues: {
      title: "",
      description: "",
      difficulty: "easy",
      tags: "array",

      visibleTestCases: [
        {
          input: "",
          output: "",
          explanation: "",
        },
      ],

      hiddenTestCases: [],

      startCode: [
        {
          language: "C++",
          initialCode: "",
        },
        {
          language: "Java",
          initialCode: "",
        },
        {
          language: "JavaScript",
          initialCode: "",
        },
      ],

      referenceSolution: [
        {
          language: "C++",
          completeCode: "",
        },
        {
          language: "Java",
          completeCode: "",
        },
        {
          language: "JavaScript",
          completeCode: "",
        },
      ],
    },
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({
    control,
    name: "visibleTestCases",
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({
    control,
    name: "hiddenTestCases",
  });

  // Fetch all problems
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoadingProblems(true);
        setError("");

        const { data } = await axiosClient.get(
          "/problem/getAllProblem"
        );

        setProblems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch problems");
      } finally {
        setLoadingProblems(false);
      }
    };

    fetchProblems();
  }, []);

  // Search problems by title
  const filteredProblems = problems.filter((problem) =>
    problem.title
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  // Select problem
  const selectProblem = async (problem) => {
    try {
      setLoadingProblem(true);
      setError("");
      setMessage("");

      setSelectedProblem(problem);

      const { data } = await axiosClient.get(
        `/problem/problemById/${problem._id}`
      );

      reset({
        title: data.title || "",
        description: data.description || "",
        difficulty: data.difficulty || "easy",
        tags: data.tags || "array",

        visibleTestCases:
          data.visibleTestCases?.length > 0
            ? data.visibleTestCases
            : [
                {
                  input: "",
                  output: "",
                  explanation: "",
                },
              ],

        hiddenTestCases: data.hiddenTestCases || [],

        startCode:
          data.startCode?.length === 3
            ? data.startCode
            : [
                {
                  language: "C++",
                  initialCode: "",
                },
                {
                  language: "Java",
                  initialCode: "",
                },
                {
                  language: "JavaScript",
                  initialCode: "",
                },
              ],

        referenceSolution:
          data.referenceSolution?.length === 3
            ? data.referenceSolution
            : [
                {
                  language: "C++",
                  completeCode: "",
                },
                {
                  language: "Java",
                  completeCode: "",
                },
                {
                  language: "JavaScript",
                  completeCode: "",
                },
              ],
      });

      setSearch("");
    } catch (err) {
      console.error(err);
      setError("Failed to load problem");
      setSelectedProblem(null);
    } finally {
      setLoadingProblem(false);
    }
  };

  // Update problem
  const onSubmit = async (data) => {
    if (!selectedProblem) {
      setError("Please select a problem first");
      return;
    }

    try {
      setUpdating(true);
      setError("");
      setMessage("");

      await axiosClient.put(
        `/problem/update/${selectedProblem._id}`,
        data
      );

      setMessage("Problem updated successfully!");

      // Reload updated problem
      const { data: updatedProblem } =
        await axiosClient.get(
          `/problem/problemById/${selectedProblem._id}`
        );

      reset({
        title: updatedProblem.title || "",
        description: updatedProblem.description || "",
        difficulty: updatedProblem.difficulty || "easy",
        tags: updatedProblem.tags || "array",

        visibleTestCases:
          updatedProblem.visibleTestCases?.length > 0
            ? updatedProblem.visibleTestCases
            : [
                {
                  input: "",
                  output: "",
                  explanation: "",
                },
              ],

        hiddenTestCases:
          updatedProblem.hiddenTestCases || [],

        startCode:
          updatedProblem.startCode?.length === 3
            ? updatedProblem.startCode
            : [
                {
                  language: "C++",
                  initialCode: "",
                },
                {
                  language: "Java",
                  initialCode: "",
                },
                {
                  language: "JavaScript",
                  initialCode: "",
                },
              ],

        referenceSolution:
          updatedProblem.referenceSolution?.length === 3
            ? updatedProblem.referenceSolution
            : [
                {
                  language: "C++",
                  completeCode: "",
                },
                {
                  language: "Java",
                  completeCode: "",
                },
                {
                  language: "JavaScript",
                  completeCode: "",
                },
              ],
      });
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update problem"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loadingProblems) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">
            Update Problem
          </h1>

          <p className="text-base-content/60 mt-2">
            Search and update an existing problem
          </p>
        </div>

        {/* Search Problem */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">

            <h2 className="card-title mb-4">
              Search Problem
            </h2>

            <input
              type="text"
              placeholder="Search problem by title..."
              className="input input-bordered w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Search Results */}
            {search.trim() !== "" && (
              <div className="mt-3 border border-base-300 rounded-lg overflow-hidden">

                {filteredProblems.length === 0 ? (
                  <div className="p-4 text-base-content/60">
                    No problem found
                  </div>
                ) : (
                  filteredProblems.map((problem) => (
                    <button
                      key={problem._id}
                      type="button"
                      onClick={() => selectProblem(problem)}
                      className="w-full text-left p-4 hover:bg-base-200 border-b border-base-300 last:border-b-0"
                    >
                      <div className="font-semibold">
                        {problem.title}
                      </div>

                      <div className="flex gap-2 mt-2">

                        <span
                          className={`badge ${
                            problem.difficulty === "easy"
                              ? "badge-success"
                              : problem.difficulty === "medium"
                              ? "badge-warning"
                              : "badge-error"
                          }`}
                        >
                          {problem.difficulty}
                        </span>

                        <span className="badge badge-outline">
                          {problem.tags}
                        </span>

                      </div>
                    </button>
                  ))
                )}

              </div>
            )}

            {/* Selected Problem */}
            {selectedProblem && search === "" && (
              <div className="mt-4 alert alert-success">
                <span>
                  Selected: {selectedProblem.title}
                </span>
              </div>
            )}

          </div>
        </div>

        {/* Loading selected problem */}
        {loadingProblem && (
          <div className="flex justify-center mb-6">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        {/* Success */}
        {message && (
          <div className="alert alert-success mb-6">
            <span>{message}</span>
          </div>
        )}

        {/* Update Form */}
        {selectedProblem && !loadingProblem && (
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Basic Information */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">

                <h2 className="card-title mb-6">
                  Basic Information
                </h2>

                {/* Title */}
                <div className="form-control mb-5">

                  <label className="label">
                    <span className="label-text">
                      Title
                    </span>
                  </label>

                  <input
                    type="text"
                    className="input input-bordered w-full"
                    {...register("title")}
                  />

                  {errors.title && (
                    <span className="text-error text-sm mt-1">
                      {errors.title.message}
                    </span>
                  )}

                </div>

                {/* Description */}
                <div className="form-control mb-5">

                  <label className="label">
                    <span className="label-text">
                      Description
                    </span>
                  </label>

                  <textarea
                    className="textarea textarea-bordered w-full h-40"
                    {...register("description")}
                  />

                  {errors.description && (
                    <span className="text-error text-sm mt-1">
                      {errors.description.message}
                    </span>
                  )}

                </div>

                {/* Difficulty */}
                <div className="form-control mb-5">

                  <label className="label">
                    <span className="label-text">
                      Difficulty
                    </span>
                  </label>

                  <select
                    className="select select-bordered w-full"
                    {...register("difficulty")}
                  >
                    <option value="easy">
                      Easy
                    </option>

                    <option value="medium">
                      Medium
                    </option>

                    <option value="hard">
                      Hard
                    </option>
                  </select>

                </div>

                {/* Tags */}
                <div className="form-control">

                  <label className="label">
                    <span className="label-text">
                      Tag
                    </span>
                  </label>

                  <select
                    className="select select-bordered w-full"
                    {...register("tags")}
                  >
                    <option value="array">
                      Array
                    </option>

                    <option value="linkedList">
                      Linked List
                    </option>

                    <option value="graph">
                      Graph
                    </option>

                    <option value="dp">
                      DP
                    </option>
                  </select>

                </div>

              </div>
            </div>

            {/* Visible Test Cases */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">

                <div className="flex justify-between items-center mb-6">

                  <h2 className="card-title">
                    Visible Test Cases
                  </h2>

                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      appendVisible({
                        input: "",
                        output: "",
                        explanation: "",
                      })
                    }
                  >
                    Add Test Case
                  </button>

                </div>

                {visibleFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border border-base-300 rounded-lg p-5 mb-5"
                  >

                    <h3 className="font-semibold mb-4">
                      Test Case {index + 1}
                    </h3>

                    <input
                      type="text"
                      placeholder="Input"
                      className="input input-bordered w-full mb-3"
                      {...register(
                        `visibleTestCases.${index}.input`
                      )}
                    />

                    <input
                      type="text"
                      placeholder="Output"
                      className="input input-bordered w-full mb-3"
                      {...register(
                        `visibleTestCases.${index}.output`
                      )}
                    />

                    <textarea
                      placeholder="Explanation"
                      className="textarea textarea-bordered w-full mb-3"
                      {...register(
                        `visibleTestCases.${index}.explanation`
                      )}
                    />

                    {visibleFields.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-error btn-sm"
                        onClick={() =>
                          removeVisible(index)
                        }
                      >
                        Remove
                      </button>
                    )}

                  </div>
                ))}

              </div>
            </div>

            {/* Hidden Test Cases */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">

                <div className="flex justify-between items-center mb-6">

                  <div>
                    <h2 className="card-title">
                      Hidden Test Cases
                    </h2>

                    <p className="text-sm text-base-content/60 mt-1">
                      Optional while updating
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      appendHidden({
                        input: "",
                        output: "",
                      })
                    }
                  >
                    Add Test Case
                  </button>

                </div>

                {hiddenFields.length === 0 && (
                  <div className="border border-dashed border-base-300 rounded-lg p-6 text-center text-base-content/50">
                    No hidden test cases added.
                  </div>
                )}

                {hiddenFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border border-base-300 rounded-lg p-5 mb-5"
                  >

                    <h3 className="font-semibold mb-4">
                      Hidden Test Case {index + 1}
                    </h3>

                    <input
                      type="text"
                      placeholder="Input"
                      className="input input-bordered w-full mb-3"
                      {...register(
                        `hiddenTestCases.${index}.input`
                      )}
                    />

                    <input
                      type="text"
                      placeholder="Output"
                      className="input input-bordered w-full mb-3"
                      {...register(
                        `hiddenTestCases.${index}.output`
                      )}
                    />

                    <button
                      type="button"
                      className="btn btn-error btn-sm"
                      onClick={() =>
                        removeHidden(index)
                      }
                    >
                      Remove
                    </button>

                  </div>
                ))}

              </div>
            </div>

            {/* Code Templates */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">

                <h2 className="card-title mb-6">
                  Code Templates
                </h2>

                {["C++", "Java", "JavaScript"].map(
                  (language, index) => (
                    <div
                      key={language}
                      className="mb-8"
                    >

                      <h3 className="text-xl font-semibold mb-3">
                        {language}
                      </h3>

                      <textarea
                        className="textarea textarea-bordered w-full h-52 font-mono"
                        {...register(
                          `startCode.${index}.initialCode`
                        )}
                      />

                      {errors.startCode?.[index]
                        ?.initialCode && (
                        <span className="text-error text-sm mt-1">
                          {
                            errors.startCode[index]
                              .initialCode.message
                          }
                        </span>
                      )}

                    </div>
                  )
                )}

              </div>
            </div>

            {/* Reference Solutions */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">

                <h2 className="card-title mb-6">
                  Reference Solutions
                </h2>

                {["C++", "Java", "JavaScript"].map(
                  (language, index) => (
                    <div
                      key={language}
                      className="mb-8"
                    >

                      <h3 className="text-xl font-semibold mb-3">
                        {language}
                      </h3>

                      <textarea
                        className="textarea textarea-bordered w-full h-60 font-mono"
                        {...register(
                          `referenceSolution.${index}.completeCode`
                        )}
                      />

                      {errors.referenceSolution?.[index]
                        ?.completeCode && (
                        <span className="text-error text-sm mt-1">
                          {
                            errors.referenceSolution[index]
                              .completeCode.message
                          }
                        </span>
                      )}

                    </div>
                  )
                )}

              </div>
            </div>

            {/* Update Button */}
            <div className="flex justify-center pb-12">

              <button
                type="submit"
                className="btn btn-primary btn-wide"
                disabled={updating}
              >
                {updating ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Updating...
                  </>
                ) : (
                  "Update Problem"
                )}
              </button>

            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default AdminUpdate;