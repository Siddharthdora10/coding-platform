import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";

const AdminDelete = () => {

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [problemToDelete, setProblemToDelete] = useState(null);

  // =========================================
  // FETCH PROBLEMS
  // =========================================

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {

    try {

      setLoading(true);
      setError(null);

      const { data } = await axiosClient.get(
        "/problem/getAllProblem"
      );

      setProblems(data);

    } catch (err) {

      setError("Failed to fetch problems");

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  // =========================================
  // DELETE PROBLEM
  // =========================================

  const handleDelete = async (id) => {

    try {

      await axiosClient.delete(
        `/problem/delete/${id}`
      );

      setProblems((currentProblems) =>
        currentProblems.filter(
          (problem) => problem._id !== id
        )
      );
      setProblemToDelete(null);

    } catch (err) {

      setError("Failed to delete problem");

      console.error(err);

    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (
      <div className="flex justify-center items-center h-64">

        <span className="loading loading-spinner loading-lg"></span>

      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {

    return (
      <div className="container mx-auto p-6">

        <div className="alert alert-error">
          <span>{error}</span>
        </div>

        <button
          onClick={fetchProblems}
          className="btn btn-primary mt-4"
        >
          Try Again
        </button>

      </div>
    );
  }

  // =========================================
  // UI
  // =========================================

  return (
    <div className="container mx-auto p-6">

      <h1 className="text-3xl font-bold mb-8">
        Delete Problems
      </h1>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-base-content/60">Remove problems carefully. This action cannot be undone.</p>
        <input value={search} onChange={(event) => setSearch(event.target.value)} className="input input-bordered w-full sm:w-80" placeholder="Search by title" />
      </div>

      {problemToDelete && (
        <div className="alert alert-warning mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>Delete <strong>{problemToDelete.title}</strong>? Existing submissions are not deleted.</span>
          <div className="flex gap-2"><button onClick={() => setProblemToDelete(null)} className="btn btn-sm">Cancel</button><button onClick={() => handleDelete(problemToDelete._id)} className="btn btn-error btn-sm">Delete permanently</button></div>
        </div>
      )}

      <div className="overflow-x-auto">

        <table className="table">

          {/* TABLE HEADER */}

          <thead>

            <tr>

              <th>#</th>

              <th>Title</th>

              <th>Difficulty</th>

              <th>Tags</th>

              <th>Actions</th>

            </tr>

          </thead>

          {/* TABLE BODY */}

          <tbody>

            {problems.filter((problem) => problem.title.toLowerCase().includes(search.toLowerCase())).map((problem, index) => (

              <tr key={problem._id}>

                {/* NUMBER */}

                <td>
                  {index + 1}
                </td>

                {/* TITLE */}

                <td>

                  <span className="font-medium">
                    {problem.title}
                  </span>

                </td>

                {/* DIFFICULTY */}

                <td>

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

                </td>

                {/* TAG */}

                <td>

                  <span className="badge badge-outline">
                    {problem.tags}
                  </span>

                </td>

                {/* ACTION */}

                <td>

                  <div className="flex space-x-2">

                    <button
                      onClick={() =>
                        setProblemToDelete(problem)
                      }
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AdminDelete;
