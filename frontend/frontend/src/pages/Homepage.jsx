import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";

function Homepage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  console.log("LOGGED USER:", user);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setError("");
        const { data } = await axiosClient.get("/problem/getAllProblem");
        setProblems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching problems:", error);
        setError("We couldn't load the problem library. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/problemSolvedByUser");

        setSolvedProblems(data);
      } catch (error) {
        console.error("Error fetching solved problems:", error);
      }
    };

    fetchProblems();

    if (user) fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());

    setSolvedProblems([]);
    navigate("/");
  };

  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch =
      filters.difficulty === "all" || problem.difficulty === filters.difficulty;

    const tagMatch = filters.tag === "all" || problem.tags === filters.tag;

    const statusMatch =
      filters.status === "all" ||
      solvedProblems.some((sp) => sp._id === problem._id);

    const searchMatch = problem.title.toLowerCase().includes(search.toLowerCase());
    return difficultyMatch && tagMatch && statusMatch && searchMatch;
  });

  const getDifficultyBadgeColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "badge-success";

      case "medium":
        return "badge-warning";

      case "hard":
        return "badge-error";

      default:
        return "badge-neutral";
    }
  };

  return (
    <div className="min-h-screen bg-[#090d0b] text-slate-100">
      {/* Navigation Bar */}
      <nav className="navbar border-b border-slate-800 bg-slate-950/90 px-4 shadow-lg backdrop-blur">
        <div className="flex-1">
          <NavLink to="/" className="btn btn-ghost text-xl font-bold tracking-tight">
            <span className="text-[#c8ff3d]">&lt;/&gt;</span> CodeByte
          </NavLink>
        </div>

        <div className="flex-none gap-4">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-circle btn-sm border border-lime-300/30 bg-[#111610] font-semibold text-[#c8ff3d] hover:border-lime-300 hover:bg-[#171c16]">
                {user?.firstName?.charAt(0).toUpperCase() || "G"}
            </div>

            {user && (
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content z-1 mt-3 w-52 rounded-xl border border-slate-700 bg-[#171c16] p-2 text-slate-200 shadow-xl shadow-black/30"
              >
                <li className="pointer-events-none px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#c8ff3d]">{user.firstName}</li>
                <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
                {user.role=='admin'&&<li><NavLink to="/admin">Admin</NavLink></li>}
              </ul>
            )}
          </div>

          <span className="hidden text-sm font-semibold text-slate-400 sm:block">{user ? `${user.firstName}'s workspace` : "Practice workspace"}</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl p-4 py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-800 pb-8 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-[.2em] text-[#c8ff3d]">Problem library</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Choose your next challenge</h1><p className="mt-2 text-slate-400">{solvedProblems.length} solved · {problems.length} available</p></div><label className="input input-bordered flex w-full items-center gap-2 bg-slate-900 sm:w-80"><span className="text-slate-400">⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title" className="grow" /></label></div>
        {/* Filters */}
        <div className="mb-7 flex flex-wrap gap-3">
          {/* Status Filter */}
          <select
            className="select select-bordered bg-[#111610] text-sm"
            value={filters.status}
            onChange={(e) =>
              setFilters({
                ...filters,
                status: e.target.value,
              })
            }
          >
            <option value="all">All Problems</option>

            <option value="solved">Solved Problems</option>
          </select>

          {/* Difficulty Filter */}
          <select
            className="select select-bordered bg-[#111610] text-sm"
            value={filters.difficulty}
            onChange={(e) =>
              setFilters({
                ...filters,
                difficulty: e.target.value,
              })
            }
          >
            <option value="all">All Difficulties</option>

            <option value="easy">Easy</option>

            <option value="medium">Medium</option>

            <option value="hard">Hard</option>
          </select>

          {/* Tag Filter */}
          <select
            className="select select-bordered bg-[#111610] text-sm"
            value={filters.tag}
            onChange={(e) =>
              setFilters({
                ...filters,
                tag: e.target.value,
              })
            }
          >
            <option value="all">All Tags</option>

            <option value="array">Array</option>

            <option value="linkedList">Linked List</option>

            <option value="graph">Graph</option>

            <option value="dp">DP</option>
          </select>
        </div>

        {/* Problems List */}
        {error && <div className="alert alert-error mb-5">{error}</div>}
        {loading ? <div className="flex h-48 items-center justify-center"><span className="loading loading-spinner loading-lg text-cyan-400"></span></div> : <div className="grid gap-4">
          {filteredProblems.map((problem) => (
            <div key={problem._id} className="card border border-slate-800 bg-slate-900/70 shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-0.5 hover:border-lime-300/35 hover:bg-slate-900">
              <div className="card-body gap-4 p-5 sm:flex-row sm:items-center">
                <h2 className="card-title text-lg tracking-tight">{problem.title}</h2>

                {/* Solved Badge */}
                {solvedProblems.some((sp) => sp._id === problem._id) && (
                  <div className="badge badge-success gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8.01 8.01a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 11.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Solved
                  </div>
                )}

                {/* Difficulty + Tags */}
                <div className="flex gap-2">
                  <div
                    className={`badge ${getDifficultyBadgeColor(
                      problem.difficulty,
                    )}`}
                  >
                    {problem.difficulty}
                  </div>

                  <div className="badge border border-lime-300/20 bg-lime-300/10 text-[#c8ff3d]">{problem.tags}</div>
                </div>

                {/* Solve Button */}
                <div className="card-actions justify-end sm:ml-auto">
                  <NavLink
                    to={`/problem/${problem._id}`}
                    className="btn border-0 bg-[#c8ff3d] text-[#11120e] hover:bg-[#dcff7a]"
                  >
                    Solve
                  </NavLink>
                </div>
              </div>
            </div>
          ))}
          {filteredProblems.length === 0 && <div className="rounded-xl border border-dashed border-slate-700 p-12 text-center text-slate-400">No problems match the selected filters.</div>}
        </div>}
      </div>
    </div>
  );
}

export default Homepage;
