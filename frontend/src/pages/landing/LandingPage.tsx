import  { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Shield,  
  BarChart2, 
  Video, 
  Users, 
  MessageSquare, 
  ChevronDown, 
  FileText, 
  Bot, 
  Sparkles, 
  Layers 
} from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'video' | 'ai' | 'kanban'>('video');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* Background Ambient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[700px] pointer-events-none opacity-20 blur-[130px] bg-gradient-to-r from-indigo-500 via-cyan-500 to-purple-500 z-0" />

      {/* Modern Navigation Header */}
      <nav className="relative z-10 border-b border-slate-800/60 backdrop-blur-md bg-slate-950/50 sticky top-0 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto rounded-full mt-4">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
          <Video className="w-6 h-6 text-indigo-400" />
          <span>IntellMeet</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-slate-100 transition-colors">Core Capabilities</a>
          <a href="#experience" className="hover:text-slate-100 transition-colors">Live Ecosystem</a>
          <a href="#metrics" className="hover:text-slate-100 transition-colors">Performance SLA</a>
          <a href="#faq" className="hover:text-slate-100 transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-4">
         <Link
  to="/login"
  className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors"
>
  Sign In
</Link>
          <Link
  to="/signup"
  className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
>
            Host Free Session
            </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-16 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-xs font-semibold text-cyan-300 mb-6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          MERN Full-Stack System with AI Intelligence
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.15] bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent max-w-4xl">
          Transform Meetings into Actionable Data
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed">
          IntellMeet drives real-time enterprise collaboration, reducing meeting follow-up times by <span className="text-white font-semibold">40-60%</span>. Turn real-time conversations into structured summaries and automated tasks instantly.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
<Link
  to="/signup"
  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 px-8 py-4 rounded-2xl font-semibold shadow-xl shadow-indigo-500/10 transition-all hover:-translate-y-0.5"
>
  Launch IntellMeet Free
  <ArrowRight className="w-5 h-5" />
</Link>
          <a href="#experience" className="w-full sm:w-auto inline-flex items-center justify-center border border-slate-800 bg-slate-900/40 hover:bg-slate-900 px-8 py-4 rounded-2xl font-semibold backdrop-blur-sm transition-colors">
            View Live Visuals
          </a>
        </div>

{/* Relative Dashboard Console Preview Engine */}
<div className="mt-16 w-full relative rounded-2xl border border-slate-800/80 bg-slate-900/40 p-3 backdrop-blur-md shadow-2xl shadow-indigo-500/10 overflow-hidden group">
  {/* Absolute backdrop neon beam effect */}
  <div className="absolute top-0 right-1/4 w-96 h-32 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
  
  {/* Console Window Header */}
  <div className="w-full bg-slate-950/80 border border-slate-800/60 rounded-xl p-4 flex flex-col gap-4 text-left">
    <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-rose-500/80" />
        <span className="w-3 h-3 rounded-full bg-amber-500/80" />
        <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
        <span className="ml-2 text-xs font-mono text-slate-500 tracking-wider">INTELLMEET_CORE_SESSION // LIVE</span>
      </div>
      <div className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-medium text-indigo-400 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-pulse" />
        Room Stream: Active
      </div>
    </div>

    {/* Console Workspace Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Main Video Stream Simulator Block */}
      <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 rounded-lg p-6 relative min-h-[260px] flex flex-col justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="bg-slate-950/80 border border-slate-800 px-2.5 py-1 rounded text-[11px] text-cyan-400 font-mono flex items-center gap-1">
            <Video className="w-3 h-3" /> WebRTC Pipeline Secure
          </div>
          <span className="text-[10px] font-mono text-slate-500">Latency: 142ms</span>
        </div>

        <div className="text-center py-6 relative z-10">
          <p className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Enterprise Cross-Team Scrum Sync
          </p>
          <p className="text-xs text-slate-500 mt-1 font-mono">Stream ID: session_usr_90422_cluster</p>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 relative z-10">
          <div className="flex -space-x-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 border border-slate-950 flex items-center justify-center text-[10px] font-bold">A1</span>
            <span className="w-6 h-6 rounded-full bg-cyan-600 border border-slate-950 flex items-center justify-center text-[10px] font-bold">B4</span>
            <span className="w-6 h-6 rounded-full bg-purple-600 border border-slate-950 flex items-center justify-center text-[10px] font-bold">C9</span>
          </div>
          <div className="flex gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500/40 animate-ping" />
            <span className="text-[11px] text-slate-400 font-medium">52 Participants Synced</span>
          </div>
        </div>
      </div>

      {/* Live AI Transcription Pipeline Panel */}
      <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/80 rounded-lg p-4 flex flex-col justify-between font-mono">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-3 flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-purple-400" /> Real-time Context Analysis
          </div>
          <div className="space-y-3 text-[11px] leading-relaxed">
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/40">
              <span className="text-indigo-400 font-semibold">[00:14] Host:</span> We need to finalize our distributed caching endpoints today.
            </div>
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/40">
              <span className="text-purple-400 font-semibold">[00:18] AI Engine:</span> 🌟 <span className="text-slate-300">Auto-extracted task item generated in column 2.</span>
            </div>
          </div>
        </div>

        <div className="bg-indigo-950/20 border border-indigo-500/20 rounded p-2.5 mt-4 text-[10px] text-indigo-300">
          <div className="font-semibold flex items-center gap-1 mb-1">
            <Sparkles className="w-3 h-3 text-indigo-400" /> Executive AI Insight Summary
          </div>
          Meeting tracking efficiency target shifted ahead by 40%. Next review sync mapped.
        </div>
      </div>
    </div>
  </div>
</div>
      </header>

      {/* Production Impact Metrics Banner */}
      <section id="metrics" className="relative z-10 max-w-6xl mx-auto px-6 py-12 mb-16 border-y border-slate-900 bg-slate-900/10 backdrop-blur-sm rounded-3xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div>
          <div className="text-3xl md:text-4xl font-extrabold text-white">40% - 60%</div>
          <div className="text-xs text-indigo-400 font-medium tracking-wide mt-1">Faster Follow-Up Execution</div>
        </div>
        <div>
          <div className="text-3xl md:text-4xl font-extrabold text-white">&lt; 200ms</div>
          <div className="text-xs text-cyan-400 font-medium tracking-wide mt-1">Real-Time WebRTC Latency</div>
        </div>
        <div>
          <div className="text-3xl md:text-4xl font-extrabold text-white">99.95%</div>
          <div className="text-xs text-purple-400 font-medium tracking-wide mt-1">Production Uptime SLA</div>
        </div>
        <div>
          <div className="text-3xl md:text-4xl font-extrabold text-white">5,000+</div>
          <div className="text-xs text-pink-400 font-medium tracking-wide mt-1">Concurrent Participants Supported</div>
        </div>
      </section>

      {/* Interactive Feature Visualizer Showcase */}
      <section id="experience" className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Explore the Production-Grade Ecosystem</h2>
          <p className="mt-4 text-slate-400">Click tabs below to see how our micro-states interact seamlessly across layers.</p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('video')}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${activeTab === 'video' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
          >
            <Video className="w-4 h-4" /> Low-Latency Video Room
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${activeTab === 'ai' ? 'bg-cyan-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
          >
            <Bot className="w-4 h-4" /> AI Intelligence Layer
          </button>
          <button 
            onClick={() => setActiveTab('kanban')}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${activeTab === 'kanban' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
          >
            <Layers className="w-4 h-4" /> Kanban Workspace Boards
          </button>
        </div>

        {/* Tab Visual Output Windows */}
        <div className="border border-slate-800 bg-slate-950 rounded-2xl p-6 min-h-[300px] flex flex-col justify-between shadow-2xl">
{activeTab === 'video' && (
  <div className="grid md:grid-cols-3 gap-4 animate-fade-in">
    {/* Host Video Stream Block */}
    <div className="bg-slate-950 border-2 border-indigo-500/80 rounded-xl aspect-video relative flex flex-col justify-between p-3 overflow-hidden shadow-lg shadow-indigo-500/5">
      {/* Background Camera-Off Dark Ambient Radial Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.12)_0%,transparent_65%)]" />
      
      {/* Top Overlay Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="text-[11px] font-medium bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-md backdrop-blur-md border border-indigo-500/30 flex items-center gap-1.5">
          <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" /> 
          Room Coordinator (Host)
        </div>
        <span className="text-[10px] font-mono text-slate-500 bg-slate-900/80 px-1.5 py-0.5 rounded">1080p • 60fps</span>
      </div>

      {/* Center Simulated Avatar Profile Presence */}
      <div className="relative z-10 self-center flex flex-col items-center justify-center -mt-2">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-lg text-white shadow-xl shadow-indigo-500/20 border border-indigo-400/30 animate-pulse">
          PS
        </div>
      </div>

      {/* Bottom Status & Equalizer Indicator */}
      <div className="relative z-10 flex items-center justify-between mt-auto">
        <div className="text-xs font-semibold text-slate-200 bg-slate-900/90 px-2 py-1 rounded border border-slate-800">
          Active Peer Transmitting...
        </div>
        {/* Animated Audio Input Bars */}
        <div className="flex items-end gap-0.5 h-3.5 px-1">
          <div className="w-0.5 bg-emerald-400 rounded-full animate-[bounce_0.8s_infinite_100ms] h-2" />
          <div className="w-0.5 bg-emerald-400 rounded-full animate-[bounce_0.8s_infinite_300ms] h-3.5" />
          <div className="w-0.5 bg-emerald-400 rounded-full animate-[bounce_0.8s_infinite_200ms] h-1.5" />
          <div className="w-0.5 bg-emerald-400 rounded-full animate-[bounce_0.8s_infinite_400ms] h-2.5" />
        </div>
      </div>
    </div>

    {/* Remote Participant Block */}
    <div className="bg-slate-950 border border-slate-850 rounded-xl aspect-video relative flex flex-col justify-between p-3 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06)_0%,transparent_65%)]" />
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="text-[11px] font-medium bg-slate-900/80 text-slate-300 px-2.5 py-1 rounded-md backdrop-blur-md border border-slate-800">
          Remote Participant A
        </div>
        <span className="text-[10px] font-mono text-slate-600">720p</span>
      </div>

      <div className="relative z-10 self-center flex flex-col items-center justify-center -mt-2">
        <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-lg text-slate-400 shadow-inner">
          JD
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between mt-auto">
        <div className="text-xs font-medium text-slate-400 bg-slate-900/90 px-2 py-1 rounded border border-slate-800">
          Audio/Video Synced
        </div>
        {/* Muted indicator template or flat track */}
        <div className="flex items-end gap-0.5 h-3.5 px-1 opacity-40">
          <div className="w-0.5 bg-slate-500 rounded-full h-1" />
          <div className="w-0.5 bg-slate-500 rounded-full h-1" />
          <div className="w-0.5 bg-slate-500 rounded-full h-1" />
        </div>
      </div>
    </div>

    {/* Scalability Optimization Stream Metric Block */}
    <div className="bg-slate-950/40 border border-dashed border-slate-800 rounded-xl aspect-video p-4 flex flex-col items-center justify-center text-center relative group">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-950/5 pointer-events-none rounded-xl" />
      <div className="p-3 bg-slate-900 rounded-full border border-slate-800/80 text-indigo-400 mb-3 group-hover:scale-105 transition-transform">
        <Users className="w-6 h-6 stroke-[1.5]" />
      </div>
      <span className="text-sm font-semibold text-slate-200">Scale Grid Active</span>
      <span className="text-xs text-slate-500 mt-1 max-w-[180px]">Optimized WebRTC pipeline for 500+ active streams[cite: 1].</span>
    </div>
  </div>
)}

          {activeTab === 'ai' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex gap-4 items-start">
                <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg"><FileText className="w-5 h-5" /></div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">Real-Time Whisper Transcript Pipeline</h4>
                  <p className="text-xs text-slate-400 mt-1">Converts high-fidelity meeting sound streams to textual representations at &gt;85% exactitude metrics map natively.</p>
                </div>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex gap-4 items-start">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg"><Bot className="w-5 h-5" /></div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">Auto-Extracted Core Task Actions</h4>
                  <p className="text-xs text-indigo-300 mt-1">✓ Action assigned to Member: "Update backend Socket cluster parameters before Monday peak deployment hours."</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kanban' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">To Do From Meeting</div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-300">Set up Redis distributed feed cache routing architectures.</div>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">In Progress</div>
                <div className="bg-slate-950 p-3 rounded-lg border border-cyan-900/50 text-xs text-slate-300">Fine-tune OpenAI context blocks to boost summarization clarity.</div>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Done</div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-500 line-through">Establish multi-stage Docker build layers.</div>
              </div>
            </div>
          )}
          <div className="text-right text-[10px] text-slate-600 mt-4">Simulated Client Server State Managed via Zustand Engine Component Blocks</div>
        </div>
      </section>

      {/* Complete Core Functional Requirements Breakdown */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Full-Stack Capability Framework</h2>
          <p className="mt-4 text-slate-400">Engineered with modern technologies optimized specifically for hybrid enterprise teams.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* F-01 */}
          <div className="p-8 rounded-2xl border border-slate-800/60 bg-slate-900/20 backdrop-blur-sm hover:border-indigo-500/30 transition-all duration-300">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure JWT Guarded Authorization</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Protects cross-organizational interactions using refresh token verification chains, bcrypt salting schemas, and structured route parameters.</p>
          </div>

          {/* F-02 */}
          <div className="p-8 rounded-2xl border border-slate-800/60 bg-slate-900/20 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-300">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold mb-2">WebRTC Fluid Video Streams</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Enforces sub-200ms latency boundaries for high-capacity group environments. Integrates clean toggle triggers for screenshare controls.</p>
          </div>

          {/* F-03 */}
          <div className="p-8 rounded-2xl border border-slate-800/60 bg-slate-900/20 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Extraction & Summaries</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Transforms spoken arguments instantly into contextually distinct target points. Reaches summary clarity validation above 85%.</p>
          </div>

          {/* F-04 */}
          <div className="p-8 rounded-2xl border border-slate-800/60 bg-slate-900/20 backdrop-blur-sm hover:border-pink-500/30 transition-all duration-300">
            <div className="w-11 h-11 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-5">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Socket-Driven Synchronous Chat</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Maintains multi-user communication rooms, typing status responses, and real-time announcements without database bottleneck delays.</p>
          </div>

          {/* F-05 */}
          <div className="p-8 rounded-2xl border border-slate-800/60 bg-slate-900/20 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Post-Meeting Asset History</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Saves historical logs, audio storage metrics links, and summary outlines in a comprehensive search-indexed user dashboard system.</p>
          </div>

          {/* F-06 / F-07 */}
          <div className="p-8 rounded-2xl border border-slate-800/60 bg-slate-900/20 backdrop-blur-sm hover:border-yellow-500/30 transition-all duration-300">
            <div className="w-11 h-11 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 mb-5">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Analytical Engagement Insights</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Tracks team organizational engagement indices, meeting frequencies, and workflow charts with direct CSV/PDF data exports.</p>
          </div>
        </div>
      </section>

      {/* Production Specification FAQ Accordion */}
      <section id="faq" className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">System Core Framework FAQs</h2>
        <div className="space-y-4">
          {[
            { 
              q: "What mechanisms keep interaction lag below 200 milliseconds?", 
              a: "We stack direct bidirectional Socket.io pipelines alongside WebRTC infrastructure channels, utilizing Redis cache segments to avoid hitting database layers for live messaging routines." 
            },
            { 
              q: "How does the AI processing engine convert meeting recordings?", 
              a: "The architecture processes meeting streams via transcription pipelines to derive textual models, converting dense runtime dialog into clear task rows and summary blocks." 
            },
            { 
              q: "How are private and public route hierarchies protected?", 
              a: "Private layout structures confirm active user session presence against global Zustand data modules, routing unverified tracking states back to authentication pages smoothly." 
            }
          ].map((faq, idx) => (
            <details key={idx} className="group border border-slate-800/60 rounded-xl bg-slate-900/10 backdrop-blur-sm p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer transition-all duration-300">
              <summary className="flex items-center justify-between font-semibold text-lg text-slate-200 group-open:text-indigo-400">
                {faq.q}
                <ChevronDown className="w-5 h-5 text-slate-500 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-4 text-slate-400 text-sm leading-relaxed border-t border-slate-800/50 pt-4">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Project Architecture Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 border-t border-slate-900 text-center text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>© 2026 IntellMeet System. Formulated with production-grade React 19, TypeScript, and Tailwind core layers.</div>
        <div className="flex gap-6 font-medium">
          <span className="text-slate-500">MERN Stack Edition 2.0</span>
        </div>
      </footer>
    </div>
  );
}