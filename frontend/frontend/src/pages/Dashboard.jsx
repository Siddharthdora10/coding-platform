import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight, BarChart3, BookOpen, CheckCircle2, Code2, Target } from "lucide-react";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";

const difficultyStyle = { easy: "text-emerald-300 bg-emerald-400/10", medium: "text-amber-300 bg-amber-400/10", hard: "text-rose-300 bg-rose-400/10" };

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solved, setSolved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([axiosClient.get("/problem/getAllProblem"), axiosClient.get("/problem/problemSolvedByUser")])
      .then(([problemResponse, solvedResponse]) => {
        setProblems(Array.isArray(problemResponse.data) ? problemResponse.data : []);
        setSolved(Array.isArray(solvedResponse.data) ? solvedResponse.data : []);
      })
      .catch((error) => console.error("Could not load dashboard data:", error))
      .finally(() => setLoading(false));
  }, []);

  const solvedIds = useMemo(() => new Set(solved.map((problem) => problem._id)), [solved]);
  const topicProgress = useMemo(() => ["array", "linkedList", "graph", "dp"].map((tag) => {
    const total = problems.filter((problem) => problem.tags === tag).length;
    const complete = problems.filter((problem) => problem.tags === tag && solvedIds.has(problem._id)).length;
    return { tag: tag === "linkedList" ? "Linked list" : tag === "dp" ? "Dynamic programming" : tag, total, complete };
  }), [problems, solvedIds]);
  const nextProblem = problems.find((problem) => !solvedIds.has(problem._id));
  const completion = problems.length ? Math.round((solved.length / problems.length) * 100) : 0;

  return <main className="min-h-screen bg-[#090d0b] text-slate-100">
    <nav className="border-b border-white/[0.07] bg-black/40 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"><Link to="/" className="flex items-center gap-2 font-extrabold"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#c8ff3d] text-[#11120e]"><Code2 size={18}/></span>CodeByte</Link><div className="flex items-center gap-3"><Link to="/problems" className="btn btn-ghost btn-sm text-slate-300">Problems</Link><button onClick={() => { dispatch(logoutUser()); navigate("/"); }} className="btn btn-ghost btn-sm text-slate-400">Log out</button></div></div></nav>
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <div className="flex flex-col justify-between gap-5 border-b border-slate-800 pb-8 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-[.2em] text-[#c8ff3d]">Your practice space</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Good to see you, {user?.firstName || "coder"}.</h1><p className="mt-2 text-slate-400">Your current progress, based on the problems you have actually solved.</p></div><Link to="/problems" className="btn border-0 bg-[#c8ff3d] text-[#11120e] hover:bg-[#dcff7a]">Browse problems <ArrowRight size={17}/></Link></div>
      {loading ? <div className="grid h-72 place-items-center"><span className="loading loading-spinner loading-lg text-[#c8ff3d]"/></div> : <>
        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><article className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6"><CheckCircle2 className="text-emerald-300"/><p className="mt-5 text-3xl font-bold">{solved.length}</p><p className="mt-1 text-sm text-slate-400">Problems solved</p></article><article className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6"><BookOpen className="text-[#c8ff3d]"/><p className="mt-5 text-3xl font-bold">{problems.length}</p><p className="mt-1 text-sm text-slate-400">Problems available</p></article><article className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6"><BarChart3 className="text-[#c8ff3d]"/><p className="mt-5 text-3xl font-bold">{completion}%</p><p className="mt-1 text-sm text-slate-400">Library completed</p></article></section>
        <section className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_.7fr]"><article className="rounded-2xl border border-white/[0.08] bg-slate-900/50 p-6 sm:p-7"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-lime-300/10 text-[#c8ff3d]"><Target size={20}/></span><div><h2 className="font-bold">Topic progress</h2><p className="text-sm text-slate-400">A practical map of your current coverage.</p></div></div><div className="mt-8 space-y-6">{topicProgress.map((topic) => <div key={topic.tag}><div className="mb-2 flex justify-between text-sm"><span className="capitalize text-slate-200">{topic.tag}</span><span className="text-slate-400">{topic.complete} / {topic.total || 0}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-[#c8ff3d] transition-all" style={{ width: `${topic.total ? Math.round(topic.complete / topic.total * 100) : 0}%` }}/></div></div>)}</div></article>
        <article className="rounded-2xl border border-lime-300/15 bg-lime-300/[0.06] p-6 sm:p-7"><p className="text-sm font-semibold uppercase tracking-[.18em] text-[#c8ff3d]">Up next</p>{nextProblem ? <><h2 className="mt-4 text-2xl font-bold">{nextProblem.title}</h2><div className="mt-3 flex gap-2"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${difficultyStyle[nextProblem.difficulty]}`}>{nextProblem.difficulty}</span><span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">{nextProblem.tags}</span></div><p className="mt-5 text-sm leading-6 text-slate-400">Continue your progress with an unsolved problem from your library.</p><Link to={`/problem/${nextProblem._id}`} className="btn mt-7 border-0 bg-[#c8ff3d] text-[#11120e] hover:bg-[#dcff7a]">Open challenge <ArrowRight size={17}/></Link></> : <><h2 className="mt-4 text-2xl font-bold">You are all caught up.</h2><p className="mt-4 text-sm leading-6 text-slate-400">Every available problem is marked solved. Add a new one from the admin panel when you are ready.</p></>}</article></section>
      </>}
    </div>
  </main>;
}

export default Dashboard;
