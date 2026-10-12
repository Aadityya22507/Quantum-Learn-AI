import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import GlassCard from "../components/GlassCard.jsx";
import { api } from "../api.js";
import { useNavigate } from "react-router-dom";

export default function IntelligenceHub() {
  const [mastery, setMastery] = useState(null);
  const [plan, setPlan] = useState(null);
  const [ml, setMl] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => { Promise.all([api.getMastery(), api.getLearningPlan(), api.getMLAnalysis()]).then(([m,p,model])=>{setMastery(m);setPlan(p);setMl(model)}).catch(e=>setError(e.message)); }, []);
  return <div className="min-h-screen bg-slate-950 text-white"><Navbar/><main className="max-w-7xl mx-auto px-6 py-10">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"><div><p className="text-cyan-400 font-semibold">QUANTUMLEARN 2.0</p><h1 className="text-4xl font-black">Learning Intelligence Center</h1><p className="text-slate-400 mt-2">Your learning model now adapts to what you actually need next.</p></div><button onClick={()=>navigate('/adaptive-quiz')} className="px-5 py-3 rounded-xl bg-cyan-400 text-slate-950 font-bold">Start Adaptive Quiz →</button></div>
    {error && <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">{error}</div>}
    <div className="grid md:grid-cols-3 gap-5 mb-8"><Metric title="Overall Mastery" value={`${mastery?.overall_mastery ?? 0}%`} sub="Performance + recency + consistency"/><Metric title="Today's Plan" value={`${plan?.total_minutes ?? 0} min`} sub={`${plan?.items?.length ?? 0} focused blocks`}/><Metric title="Intelligence Loop" value="ACTIVE" sub="Analyze → Prioritize → Adapt"/></div>
    <div className="grid lg:grid-cols-2 gap-6">
      <GlassCard className="p-6"><h2 className="text-2xl font-bold mb-5">🧠 Topic Mastery</h2><div className="space-y-4">{(mastery?.topics||[]).map(r=><div key={r.topic}><div className="flex justify-between text-sm mb-1"><span>{r.topic}</span><span className="text-cyan-300">{r.mastery}% · {r.level}</span></div><div className="h-3 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-cyan-400 rounded-full" style={{width:`${r.mastery}%`}}/></div><div className="text-xs text-slate-500 mt-1">{r.attempts} attempts · {r.days_since_revision} day(s) since revision · priority {r.priority_score}</div></div>)}{!mastery?.topics?.length&&<p className="text-slate-400">Take a quiz to build your first mastery profile.</p>}</div></GlassCard>
      <GlassCard className="p-6"><div className="flex justify-between items-center mb-5"><div><h2 className="text-2xl font-bold">🎯 Adaptive Learning Plan</h2><p className="text-slate-400 text-sm">Generated from your current learning state.</p></div></div><div className="space-y-3">{(plan?.items||[]).map((x,i)=><div key={i} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700"><div className="flex justify-between"><b>{i+1}. {x.topic}</b><span className="text-cyan-300">{x.minutes} min</span></div><p className="text-sm text-slate-400 mt-1">{x.reason}</p></div>)}</div></GlassCard>
    </div>
    <GlassCard className="p-6 mt-6"><div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4"><div><h2 className="text-2xl font-bold">🤖 Classical ML Engine</h2><p className="text-slate-400 text-sm mt-1">Random Forest + Gradient Boosting + revision-priority classification.</p></div><span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold">{ml?.status || "loading"}</span></div><div className="flex flex-wrap gap-2 mt-4">{(ml?.models||[]).map((m,i)=><span key={i} className="px-3 py-2 rounded-lg bg-slate-800 text-xs text-slate-300">{m}</span>)}</div><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">{(ml?.topics||[]).slice(0,6).map(r=><div key={r.topic} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700"><div className="flex justify-between gap-2"><b>{r.topic}</b><span className={r.revision_priority==='HIGH'?'text-amber-300':'text-emerald-300'}>{r.revision_priority}</span></div><p className="text-sm text-slate-400 mt-2">ML mastery: <span className="text-cyan-300">{r.ml_mastery}%</span></p></div>)}</div></GlassCard>
    <div className="grid md:grid-cols-3 gap-5 mt-6"><Action title="🕸️ Knowledge Graph" text="See prerequisite relationships and mastery." onClick={()=>navigate('/knowledge-graph')}/><Action title="⚛️ Quantum Lab" text="Compare quantum and classical models." onClick={()=>navigate('/quantum-lab')}/><Action title="🧑‍🏫 Teacher Intelligence" text="Open class-level early warning analytics." onClick={()=>navigate('/teacher')}/></div>
  </main></div>
}
function Metric({title,value,sub}){return <div className="rounded-2xl p-5 bg-slate-900 border border-cyan-500/20"><p className="text-slate-400 text-sm">{title}</p><p className="text-3xl font-black text-cyan-300 mt-2">{value}</p><p className="text-xs text-slate-500 mt-1">{sub}</p></div>}
function Action({title,text,onClick}){return <button onClick={onClick} className="text-left p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-400 transition"><h3 className="font-bold text-xl">{title}</h3><p className="text-slate-400 mt-2 text-sm">{text}</p></button>}
