import { useEffect, useState } from "react";

import {
  ShieldAlert,
  BrainCircuit,
  Activity,
  Database,
  Workflow,
  Radar,
  Cpu,
  BellRing,
  Sparkles,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { motion, AnimatePresence } from "framer-motion";

const data = [
  { day: "Mon", risk: 35 },
  { day: "Tue", risk: 48 },
  { day: "Wed", risk: 67 },
  { day: "Thu", risk: 58 },
  { day: "Fri", risk: 82 },
];

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading ? (
        <motion.div
          className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* GOLD GLOW */}
          <div className="absolute w-[500px] h-[500px] bg-yellow-500/10 blur-[140px] rounded-full" />

          {/* LOGO */}
          <motion.img
            src="/logo.png"
            alt="BlackSwan AI"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            transition={{
              duration: 1.5,
            }}
            className="w-[300px] mb-10 drop-shadow-[0_0_40px_rgba(255,215,0,0.25)]"
          />

          {/* TITLE */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-6xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-gray-300 to-yellow-500 bg-clip-text text-transparent"
          >
            BlackSwan AI
          </motion.h1>

          {/* CAPTION */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-slate-400 mt-6 text-xl tracking-wide"
          >
            Autonomous Enterprise Intelligence Platform
          </motion.p>

          {/* SUBTEXT */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="text-slate-500 mt-4 max-w-xl text-center leading-relaxed px-6"
          >
            Multi-agent orchestration • Predictive intelligence •
            Autonomous enterprise workflows • Executive decision systems
          </motion.p>

          {/* LOADING BAR */}
          <motion.div
            className="w-[320px] h-[4px] bg-slate-800 rounded-full overflow-hidden mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 via-white to-yellow-400"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3 }}
            />
          </motion.div>
        </motion.div>
      ) : (
        <div className="relative min-h-screen overflow-hidden bg-[#050505] text-[#F5F5F5]">

          {/* BACKGROUND LIGHTS */}
          <div className="absolute top-[-300px] left-[-150px] w-[700px] h-[700px] bg-[#C8A75D]/10 blur-[180px] rounded-full" />

          <div className="absolute bottom-[-300px] right-[-150px] w-[700px] h-[700px] bg-white/[0.03] blur-[180px] rounded-full" />

          {/* GRID */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px]" />

          <div className="relative z-10 max-w-[1600px] mx-auto px-6 py-6">

            {/* NAVBAR */}
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10"
            >
              <div className="flex items-center gap-5">

                <img
                  src="/logo.png"
                  alt="logo"
                  className="w-16 lg:w-20 drop-shadow-[0_0_25px_rgba(200,167,93,0.2)]"
                />

                <div>
                  <h1 className="text-4xl lg:text-5xl font-black tracking-tight bg-gradient-to-r from-[#F5F5F5] via-[#D6D6D6] to-[#C8A75D] bg-clip-text text-transparent">
                    BlackSwan AI
                  </h1>

                  <p className="text-[#8E8E8E] mt-1 text-base lg:text-lg tracking-wide">
                    Autonomous Enterprise Intelligence Command Center
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">

                <div className="bg-[#111111]/80 border border-[#2A2A2A] backdrop-blur-2xl px-5 py-3 rounded-2xl shadow-2xl">
                  <p className="text-[#D4AF37] text-sm font-semibold tracking-widest">
                    ● SYSTEM ACTIVE
                  </p>
                </div>

                <div className="bg-[#111111]/80 border border-[#2A2A2A] p-3 rounded-2xl">
                  <BellRing className="text-[#D4AF37]" />
                </div>

              </div>
            </motion.div>

            {/* QUERY PANEL */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#111111]/80 border border-[#2A2A2A] backdrop-blur-2xl rounded-[32px] p-6 lg:p-8 mb-8 shadow-[0_0_50px_rgba(200,167,93,0.05)]"
            >
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="text-[#D4AF37]" />

                <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
                  Enterprise Intelligence Query
                </h2>
              </div>

              <div className="flex flex-col lg:flex-row gap-5">

                <input
                  type="text"
                  placeholder="Analyze semiconductor supply chain instability..."
                  className="flex-1 bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl px-6 py-4 outline-none text-lg text-[#E5E5E5] focus:border-[#C8A75D] transition-all"
                />

                <button className="bg-gradient-to-r from-[#C8A75D] via-[#E5D3A1] to-[#F5F5F5] text-black font-black px-7 py-4 rounded-2xl hover:scale-[1.02] transition-all duration-300 shadow-[0_0_35px_rgba(200,167,93,0.25)]">
                  Analyze
                </button>

              </div>
            </motion.div>

            {/* METRICS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

              {[
                {
                  title: "Threat Level",
                  value: "82%",
                  icon: ShieldAlert,
                  color: "text-red-400",
                },
                {
                  title: "AI Agents",
                  value: "12",
                  icon: Cpu,
                  color: "text-[#D4AF37]",
                },
                {
                  title: "Predictions",
                  value: "148",
                  icon: Radar,
                  color: "text-white",
                },
                {
                  title: "Workflows",
                  value: "34",
                  icon: Workflow,
                  color: "text-green-400",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{
                    y: -4,
                    scale: 1.02,
                  }}
                  className="bg-[#111111]/80 border border-[#2A2A2A] backdrop-blur-2xl rounded-[28px] p-6 shadow-[0_0_30px_rgba(255,255,255,0.02)]"
                >
                  <div className="flex items-center justify-between mb-6">

                    <item.icon className={item.color} size={30} />

                    <p className="text-[#5A5A5A] text-xs tracking-[0.3em]">
                      LIVE
                    </p>
                  </div>

                  <h2 className="text-[#8E8E8E] text-sm mb-2 tracking-wide">
                    {item.title}
                  </h2>

                  <h1 className="text-4xl font-black metric-number tracking-tight">
                    {item.value}
                  </h1>
                </motion.div>
              ))}
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* LEFT */}
              <div className="lg:col-span-2 space-y-6">

                {/* AGENT WORKFLOW */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-[#111111]/80 border border-[#2A2A2A] backdrop-blur-2xl rounded-[32px] p-6 lg:p-8"
                >
                  <h2 className="text-2xl lg:text-3xl font-bold mb-8 tracking-tight">
                    Autonomous Agent Workflow
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                    {[
                      {
                        title: "Data Agent",
                        icon: Database,
                        desc: "Collecting enterprise signals",
                        color: "text-[#D4AF37]",
                      },
                      {
                        title: "Risk Agent",
                        icon: ShieldAlert,
                        desc: "Analyzing operational threats",
                        color: "text-red-400",
                      },
                      {
                        title: "Orchestrator",
                        icon: Workflow,
                        desc: "Coordinating AI workflows",
                        color: "text-white",
                      },
                      {
                        title: "Executive AI",
                        icon: BrainCircuit,
                        desc: "Generating strategic intelligence",
                        color: "text-green-400",
                      },
                    ].map((agent, index) => (
                      <motion.div
                        key={index}
                        whileHover={{
                          scale: 1.03,
                          y: -4,
                        }}
                        className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-[24px] p-5"
                      >
                        <agent.icon
                          className={`${agent.color} mb-5`}
                          size={30}
                        />

                        <h3 className="font-bold text-lg mb-3 tracking-tight">
                          {agent.title}
                        </h3>

                        <p className="text-[#8E8E8E] text-sm leading-relaxed">
                          {agent.desc}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* CHART */}
                <motion.div
                  className="bg-[#111111]/80 border border-[#2A2A2A] backdrop-blur-2xl rounded-[32px] p-6 lg:p-8"
                >
                  <h2 className="text-2xl lg:text-3xl font-bold mb-8 tracking-tight">
                    Enterprise Risk Analytics
                  </h2>

                  <div className="h-[350px]">

                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data}>
                        <XAxis dataKey="day" stroke="#666666" />
                        <YAxis stroke="#666666" />
                        <Tooltip />

                        <Line
                          type="monotone"
                          dataKey="risk"
                          stroke="#C8A75D"
                          strokeWidth={4}
                        />
                      </LineChart>
                    </ResponsiveContainer>

                  </div>
                </motion.div>

              </div>

              {/* RIGHT */}
              <div className="space-y-6">

                {/* RISK CARD */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-[#1A1408] to-[#130F08] border border-[#3A2F1A] backdrop-blur-2xl rounded-[32px] p-6 lg:p-8 shadow-[0_0_60px_rgba(200,167,93,0.08)]"
                >
                  <div className="flex items-center gap-3 mb-5">

                    <Activity className="text-red-400" />

                    <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
                      Critical Risk
                    </h2>
                  </div>

                  <h1 className="text-7xl lg:text-8xl font-black text-[#D4AF37] metric-number">
                    82%
                  </h1>

                  <p className="text-red-400 font-bold mt-5 tracking-widest text-sm">
                    HIGH THREAT DETECTED
                  </p>

                  <p className="text-[#CFCFCF] mt-6 leading-relaxed">
                    BlackSwan AI identified elevated disruption
                    patterns across semiconductor procurement and
                    logistics systems.
                  </p>
                </motion.div>

                {/* EXEC REPORT */}
                <motion.div
                  className="bg-[#111111]/80 border border-[#2A2A2A] backdrop-blur-2xl rounded-[32px] p-6 lg:p-8"
                >
                  <h2 className="text-2xl lg:text-3xl font-bold mb-6 tracking-tight">
                    Executive Intelligence Briefing
                  </h2>

                  <p className="text-[#D0D0D0] leading-relaxed">
                    Autonomous multi-agent analysis identified
                    geopolitical instability, supplier volatility,
                    and operational bottlenecks as primary risk
                    drivers. Immediate supplier diversification and
                    contingency planning are strongly recommended.
                  </p>
                </motion.div>

                {/* LIVE FEED */}
                <motion.div
                  className="bg-[#111111]/80 border border-[#2A2A2A] backdrop-blur-2xl rounded-[32px] p-6 lg:p-8"
                >
                  <h2 className="text-2xl lg:text-3xl font-bold mb-6 tracking-tight">
                    Live System Feed
                  </h2>

                  <div className="space-y-5 text-sm">

                    <div className="border-l-2 border-[#D4AF37] pl-4 text-[#D0D0D0]">
                      Data Agent collected 248 enterprise signals
                    </div>

                    <div className="border-l-2 border-red-400 pl-4 text-[#D0D0D0]">
                      Risk Agent updated critical threat score
                    </div>

                    <div className="border-l-2 border-green-400 pl-4 text-[#D0D0D0]">
                      Executive intelligence report generated
                    </div>

                  </div>
                </motion.div>

              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}