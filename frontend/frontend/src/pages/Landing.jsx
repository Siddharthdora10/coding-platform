import { Link } from "react-router";
import { ArrowRight, Braces, CheckCircle2, Code2, ShieldCheck, Sparkles, Terminal, Trophy } from "lucide-react";

function Landing() {
  const features = [
    [Terminal, "Practice with purpose", "Work through real programming problems in C++, Java, and JavaScript."],
    [ShieldCheck, "Private evaluation", "Run examples before submitting against the problem's hidden test cases."],
    [Trophy, "Track your progress", "Keep a clear record of the problems you have solved."],
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#0a0b09] font-sans text-[#f5f4ed] selection:bg-[#c8ff3d] selection:text-[#11120e]">
      <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden"><div className="absolute -left-40 -top-32 h-96 w-96 rounded-full bg-lime-400/15 blur-[110px]"/><div className="absolute -right-32 top-72 h-96 w-96 rounded-full bg-stone-400/10 blur-[120px]"/><div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:42px_42px]"/></div>
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/" className="group flex items-center gap-2.5 text-xl font-extrabold tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#c8ff3d] text-[#11120e] shadow-lg shadow-lime-400/15 transition group-hover:scale-105"><Braces size={21}/></span>CodeByte</Link>
        <div className="flex items-center gap-2 sm:gap-4"><Link to="/problems" className="hidden text-sm font-medium text-stone-400 transition hover:text-[#f5f4ed] sm:block">Problem library</Link><Link to="/login" className="btn btn-ghost btn-sm text-stone-300 hover:bg-white/5">Log in</Link><Link to="/signup" className="btn btn-sm border-0 bg-[#c8ff3d] px-4 font-bold text-[#11120e] shadow-lg shadow-lime-400/15 hover:bg-[#dcff7a]">Get started</Link></div>
      </nav>
      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-16 sm:px-8 lg:grid-cols-[1fr_.94fr] lg:pb-32 lg:pt-24">
        <div className="max-w-3xl">
          <div className="mb-6 flex items-center gap-3"><p className="flex w-fit items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/10 px-3.5 py-1.5 text-sm font-medium text-lime-200"><Sparkles size={15}/> Code with clarity. Progress with confidence.</p><span className="hidden font-mono text-[10px] font-semibold tracking-[0.18em] text-stone-600 sm:block">STATUS: READY</span></div>
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">01 — Your deliberate practice loop</p>
          <h1 className="text-5xl font-black leading-[0.96] tracking-[-0.06em] sm:text-6xl lg:text-7xl">Think deeper.<br/>Ship sharper <span className="text-[#c8ff3d]">solutions.</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-stone-400">A focused coding platform for discovering challenges, writing solutions, and validating your thinking against meaningful test cases.</p>
          <div className="mt-9 flex flex-wrap gap-3"><Link to="/problems" className="btn h-12 border-0 bg-[#c8ff3d] px-5 font-bold text-[#11120e] shadow-xl shadow-lime-400/15 hover:bg-[#dcff7a]">Start practicing <ArrowRight size={17}/></Link></div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/[0.08] pt-6 text-sm text-stone-400"><span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#c8ff3d]"/>C++, Java & JavaScript</span><span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#c8ff3d]"/>Private test cases</span></div>
        </div>
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-3 rounded-[2rem] bg-lime-400/15 blur-2xl"/>
          <div className="absolute -left-8 top-12 hidden rounded-lg border border-white/10 bg-[#111510] px-3 py-2 font-mono text-[10px] text-stone-400 shadow-xl lg:block">PROBLEM_001 <span className="text-[#c8ff3d]">EASY</span></div>
          <div className="absolute -right-7 bottom-14 hidden rounded-lg border border-lime-300/20 bg-[#111510] px-3 py-2 font-mono text-[10px] text-[#c8ff3d] shadow-xl lg:block">✓ TESTS PASSED</div>
          <div className="relative rounded-2xl border border-white/10 bg-[#171916]/90 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-5">
            <div className="mb-4 flex items-center justify-between"><div className="flex gap-2"><i className="h-3 w-3 rounded-full bg-stone-600"/><i className="h-3 w-3 rounded-full bg-stone-600"/><i className="h-3 w-3 rounded-full bg-[#c8ff3d]"/></div><span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-stone-400">two-sum.js</span></div>
            <div className="mb-3 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-slate-800 bg-slate-800 text-center font-mono text-[10px] uppercase tracking-[0.12em]"><span className="bg-[#111510] px-2 py-2 text-[#c8ff3d]">1. Problem</span><span className="bg-[#111510] px-2 py-2 text-stone-400">2. Code</span><span className="bg-[#111510] px-2 py-2 text-stone-400">3. Verify</span></div>
            <pre className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0b100d] p-5 font-mono text-sm leading-7 text-stone-300"><code><span className="mr-4 text-stone-600">01</span><span className="text-[#c8ff3d]">function</span> twoSum(nums, target) {'{'}{`\n`}<span className="mr-4 text-stone-600">02</span>  <span className="text-[#c8ff3d]">const</span> seen = <span className="text-[#f5f4ed]">new</span> Map();{`\n\n`}<span className="mr-4 text-stone-600">03</span>  <span className="text-[#c8ff3d]">for</span> (let i = 0; i &lt; nums.length; i++) {'{'}{`\n`}<span className="mr-4 text-stone-600">04</span>    <span className="text-[#c8ff3d]">if</span> (seen.has(target - nums[i])) <span className="text-[#c8ff3d]">return</span> [i];{`\n`}<span className="mr-4 text-stone-600">05</span>    seen.set(nums[i], i);{`\n`}<span className="mr-4 text-stone-600">06</span>  {'}'}{`\n`}{'}'}</code></pre>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-lime-300/15 bg-lime-300/[0.06] px-4 py-3"><div className="flex items-center gap-2 text-sm font-semibold text-[#c8ff3d]"><CheckCircle2 size={17}/> Examples passed</div><span className="font-mono text-xs text-stone-400">2 / 2 cases</span></div>
          </div>
        </div>
      </section>
      <section className="relative z-10 border-y border-white/[0.07] bg-black/20"><div className="mx-auto grid max-w-7xl gap-5 px-5 py-16 sm:px-8 md:grid-cols-[1.25fr_.875fr_.875fr]">{features.map(([Icon, title, text], index) => <article key={title} className={`group border border-white/[0.08] bg-white/[0.025] p-7 transition duration-300 hover:border-lime-300/25 hover:bg-white/[0.05] ${index === 0 ? "rounded-2xl md:row-span-1 md:p-9" : "rounded-2xl hover:-translate-y-1"}`}><span className="mb-6 grid h-11 w-11 place-items-center rounded-xl bg-lime-300/10 text-[#c8ff3d]"><Icon size={21}/></span><p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-stone-500">0{index + 1} / capability</p><h2 className={`mt-3 font-bold tracking-tight ${index === 0 ? "text-3xl" : "text-xl"}`}>{title}</h2><p className="mt-3 max-w-sm leading-7 text-stone-400">{text}</p>{index === 0 && <div className="mt-8 flex items-center gap-3 font-mono text-xs text-stone-500"><span className="h-px w-10 bg-[#c8ff3d]"/>CHOOSE → WRITE → VERIFY</div>}</article>)}</div></section>
      <section className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 py-20 sm:px-8 lg:grid-cols-[.35fr_1fr] lg:items-end"><Code2 className="text-[#c8ff3d]" size={36}/><div><p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Built for steady momentum</p><h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">Less noise. Better problem-solving habits.</h2><p className="mt-4 max-w-xl text-stone-400">Create an account from the primary action above and start building progress that compounds with every challenge.</p></div></section>
      <footer className="relative z-10 mx-auto flex max-w-7xl flex-col gap-2 border-t border-white/[0.07] px-5 py-8 text-sm text-slate-500 sm:flex-row sm:justify-between sm:px-8"><span className="font-semibold text-slate-400">CodeByte</span><span>Practice thoughtfully. Improve continuously.</span></footer>
    </main>
  );
}

export default Landing;
