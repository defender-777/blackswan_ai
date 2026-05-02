import React, { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  BrainCircuit,
  Database,
  ShieldAlert,
  Network,
  Activity,
  Zap,
  Globe,
  Radar,
  ChevronRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const orchestrationSteps = [
  {
    id: 1,
    agent: 'DataAgent',
    icon: Database,
    color: 'text-yellow-400',
    message: 'Collecting enterprise operational signals'
  },
  {
    id: 2,
    agent: 'RiskAgent',
    icon: ShieldAlert,
    color: 'text-red-400',
    message: 'Analyzing geopolitical threat vectors'
  },
  {
    id: 3,
    agent: 'StrategyAgent',
    icon: Network,
    color: 'text-blue-400',
    message: 'Generating contingency mitigation protocols'
  },
  {
    id: 4,
    agent: 'ExecutiveAgent',
    icon: BrainCircuit,
    color: 'text-emerald-400',
    message: 'Synthesizing executive intelligence briefing'
  }
]

const defaultQuery =
  'Analyze cascading operational risks caused by escalating Middle East conflict impacting LNG shipping routes and global energy infrastructure.'

export default function App() {
  const [query, setQuery] = useState(defaultQuery)
  const [loading, setLoading] = useState(false)
  const [activeStep, setActiveStep] = useState(-1)
  const [liveFeed, setLiveFeed] = useState([])
  const [orchestrationData, setOrchestrationData] = useState(null)

  const executeAnalysis = async () => {
    setLoading(true)
    setActiveStep(0)
    setLiveFeed([])

    for (let i = 0; i < orchestrationSteps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1200))

      setActiveStep(i)

      setLiveFeed((prev) => [
        ...prev,
        {
          time: new Date().toLocaleTimeString(),
          message: orchestrationSteps[i].message,
          agent: orchestrationSteps[i].agent
        }
      ])
    }

    try {
      const response = await fetch(
        'http://127.0.0.1:8007/api/v1/orchestration/sequential',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query,
            agents: [
              'DataAgent',
              'RiskAgent',
              'StrategyAgent',
              'ExecutiveAgent'
            ]
          })
        }
      )

      const data = await response.json()
      setOrchestrationData(data)
    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  useEffect(() => {
    executeAnalysis()
  }, [])

  const executiveResponse = useMemo(() => {
    if (!orchestrationData?.responses) return null

    return orchestrationData.responses.find(
      (item) => item.agent_name === 'ExecutiveAgent'
    )
  }, [orchestrationData])

  const executiveText = useMemo(() => {
    if (!executiveResponse) return ''

    return (
      executiveResponse?.data?.raw_response ||
      executiveResponse?.data?.summary ||
      JSON.stringify(executiveResponse?.data || {})
    )
  }, [executiveResponse])

  const mitigationActions = useMemo(() => {
    if (!executiveText) return []

    return executiveText
      .split('\n')
      .filter((line) =>
        line.toLowerCase().includes('mitigation') ||
        line.toLowerCase().includes('activate') ||
        line.toLowerCase().includes('deploy') ||
        line.toLowerCase().includes('establish')
      )
      .slice(0, 4)
  }, [executiveText])

  const opportunities = useMemo(() => {
    if (!executiveText) return []

    return executiveText
      .split('\n')
      .filter((line) =>
        line.toLowerCase().includes('opportunity') ||
        line.toLowerCase().includes('partnership') ||
        line.toLowerCase().includes('advantage') ||
        line.toLowerCase().includes('resilience')
      )
      .slice(0, 4)
  }, [executiveText])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,175,55,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.08) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Ambient Glow */}
      <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-yellow-500/10 blur-[140px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-[1800px] mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-6xl font-black tracking-tight bg-gradient-to-r from-white via-[#D4AF37] to-[#FFE9A8] bg-clip-text text-transparent">
              BlackSwan AI
            </h1>

            <p className="text-zinc-400 text-xl mt-2">
              Autonomous Enterprise Crisis Intelligence Operating System
            </p>
          </div>

          <div className="border border-[#2A2A2A] bg-[#0A0A0A] px-6 py-3 rounded-2xl flex items-center gap-3 shadow-[0_0_25px_rgba(212,175,55,0.08)]">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[#D4AF37] font-semibold tracking-widest">
              OPERATIONAL
            </span>
          </div>
        </div>

        {/* Query Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#070707]/90 border border-[#2A2A2A] rounded-[32px] p-8 backdrop-blur-xl shadow-[0_0_60px_rgba(212,175,55,0.08)]"
        >
          <div className="flex items-center gap-3 mb-6">
            <Radar className="text-[#D4AF37]" size={28} />
            <h2 className="text-4xl font-bold">Crisis Intelligence Query</h2>
          </div>

          <div className="flex gap-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-black border border-[#2A2A2A] rounded-2xl px-6 py-5 text-lg outline-none focus:border-[#D4AF37] transition-all"
            />

            <button
              onClick={executeAnalysis}
              className="bg-gradient-to-r from-[#D4AF37] to-[#FFE9A8] text-black font-bold px-8 rounded-2xl hover:scale-105 transition-all shadow-[0_0_35px_rgba(212,175,55,0.25)]"
            >
              Execute Analysis
            </button>
          </div>

          {/* Live Feed */}
          <div className="mt-8 border border-[#2A2A2A] rounded-2xl p-6 bg-black/50 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/5 to-transparent animate-pulse" />

            <div className="flex items-center gap-3 mb-5 relative z-10">
              <Activity className="text-emerald-400" />
              <h3 className="text-2xl font-bold">Live Orchestration Stream</h3>
            </div>

            <div className="space-y-4 relative z-10">
              <AnimatePresence>
                {liveFeed.map((feed, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-4 border-l-2 border-[#D4AF37] pl-4 py-1"
                  >
                    <span className="text-xs text-zinc-500 min-w-[90px]">
                      {feed.time}
                    </span>

                    <span className="text-[#D4AF37] font-semibold min-w-[160px]">
                      {feed.agent}
                    </span>

                    <ChevronRight className="text-zinc-500" size={18} />

                    <span className="text-zinc-300">{feed.message}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">
          {orchestrationSteps.map((step, index) => {
            const Icon = step.icon

            return (
              <motion.div
                key={step.id}
                animate={{
                  borderColor:
                    activeStep >= index
                      ? 'rgba(212,175,55,0.6)'
                      : 'rgba(42,42,42,1)',
                  boxShadow:
                    activeStep >= index
                      ? '0 0 40px rgba(212,175,55,0.15)'
                      : '0 0 0 rgba(0,0,0,0)'
                }}
                className="relative bg-[#070707]/90 border rounded-[28px] p-6 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-[#D4AF37]/10 to-transparent" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <Icon className={step.color} size={34} />

                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          activeStep >= index
                            ? 'bg-emerald-400 animate-pulse'
                            : 'bg-zinc-700'
                        }`}
                      />

                      <span className="text-xs tracking-[0.3em] text-zinc-500 uppercase">
                        {activeStep >= index ? 'Active' : 'Idle'}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-3">{step.agent}</h3>

                  <p className="text-zinc-400 leading-relaxed">
                    {step.message}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Executive Intelligence */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 bg-gradient-to-br from-[#0A0A0A] via-[#120D02] to-[#0A0A0A] border border-[#5E4710] rounded-[40px] p-10 relative overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.08)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.08),transparent_45%)]" />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <Globe className="text-[#D4AF37]" size={42} />

              <div>
                <h2 className="text-5xl font-black bg-gradient-to-r from-white to-[#D4AF37] bg-clip-text text-transparent">
                  Executive Intelligence Briefing
                </h2>

                <p className="text-zinc-400 mt-2 text-lg">
                  AI-generated strategic operational crisis analysis
                </p>
              </div>
            </div>

            {/* Black Swan Alert */}
            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-[28px] p-8 mb-10 shadow-[0_0_45px_rgba(239,68,68,0.1)]">
              <div className="flex items-start gap-5">
                <AlertTriangle
                  className="text-red-400 mt-1"
                  size={40}
                />

                <div>
                  <h3 className="text-3xl font-black text-red-400 mb-4">
                    Potential Black Swan Event Detected
                  </h3>

                  <p className="text-red-200/90 text-lg leading-relaxed">
                    {executiveText ||
                      'Critical enterprise operational instability detected across strategic infrastructure corridors.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Strategic Actions */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="text-[#D4AF37]" />
                <h3 className="text-3xl font-bold text-[#D4AF37]">
                  Strategic Mitigation Actions
                </h3>
              </div>

              <div className="space-y-4">
                {mitigationActions.map((action, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    className="bg-black/50 border border-[#2A2A2A] rounded-2xl p-5 flex items-center gap-4"
                  >
                    <div className="w-3 h-3 rounded-full bg-[#D4AF37] animate-pulse" />
                    <p className="text-zinc-200 text-lg">{action}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Opportunities */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Activity className="text-emerald-400" />
                <h3 className="text-3xl font-bold text-emerald-400">
                  Strategic Opportunities
                </h3>
              </div>

              <div className="space-y-4">
                {opportunities.map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-4"
                  >
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-zinc-200 text-lg">{item}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Raw Debug Data */}
            {orchestrationData && (
              <div className="mt-12 bg-black border border-[#2A2A2A] rounded-2xl p-6 overflow-auto max-h-[450px]">
                <h3 className="text-[#D4AF37] font-bold mb-4 text-xl">
                  Raw Orchestration Data
                </h3>

                <pre className="text-xs text-green-400 whitespace-pre-wrap">
                  {JSON.stringify(orchestrationData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
