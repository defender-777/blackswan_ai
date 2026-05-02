import { useEffect, useState, useRef } from "react";

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
  Loader2,
  AlertTriangle,
  TrendingUp,
  Zap,
  ArrowRight,
  Radio,
  Wifi,
} from "lucide-react";

import { executeOrchestration } from "./services/api";

import { motion, AnimatePresence } from "framer-motion";

/**
 * Generate dynamic orchestration events from AI response content
 * Extracts key phrases and converts them into live telemetry events
 */
const generateOrchestrationEvents = (orchestrationData) => {
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║     DYNAMIC ORCHESTRATION EVENT GENERATION - DEBUG        ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log("📦 FULL ORCHESTRATION RESPONSE:");
  console.log(JSON.stringify(orchestrationData, null, 2));
  console.log("");
  
  if (!orchestrationData) {
    console.error("❌ NO ORCHESTRATION DATA PROVIDED");
    return [];
  }
  
  // Check multiple possible response structures
  let responses = null;
  
  if (orchestrationData.responses) {
    responses = orchestrationData.responses;
    console.log("✓ Found responses at: orchestrationData.responses");
  } else if (orchestrationData.agent_results) {
    responses = orchestrationData.agent_results;
    console.log("✓ Found responses at: orchestrationData.agent_results");
  } else if (orchestrationData.data?.responses) {
    responses = orchestrationData.data.responses;
    console.log("✓ Found responses at: orchestrationData.data.responses");
  } else if (orchestrationData.results) {
    responses = orchestrationData.results;
    console.log("✓ Found responses at: orchestrationData.results");
  } else {
    console.error("❌ COULD NOT FIND AGENT RESPONSES IN ORCHESTRATION DATA");
    console.error("Available keys:", Object.keys(orchestrationData));
    return [];
  }
  
  console.log(`📊 Found ${responses.length} agent responses`);
  console.log("Agent responses:", responses);
  console.log("");
  
  const events = [];
  const agentColors = {
    DataAgent: "#D4AF37",
    RiskAgent: "#EF4444",
    StrategyAgent: "#60A5FA",
    ExecutiveAgent: "#4ADE80"
  };
  
  // Extract events from each agent's response
  responses.forEach((response, idx) => {
    console.log(`\n🤖 Processing Agent ${idx + 1}/${responses.length}`);
    console.log("Response structure:", JSON.stringify(response, null, 2));
    
    const agentName = response.agent_name;
    const agentData = response.data;
    const color = agentColors[agentName] || "#D4AF37";
    
    console.log(`Agent: ${agentName}`);
    console.log(`Has data: ${!!agentData}`);
    if (agentData) {
      console.log(`Data keys: ${Object.keys(agentData).join(', ')}`);
    }
    
    if (agentName === "DataAgent" && agentData) {
      // Extract key data points from DataAgent
      if (agentData.data_sources) {
        events.push({
          agent: agentName,
          message: `${agentData.data_sources.length} data sources analyzed`,
          color,
          severity: "info"
        });
      }
      if (agentData.summary) {
        // Extract first key phrase from summary
        const firstSentence = agentData.summary.split('.')[0];
        if (firstSentence.length > 10 && firstSentence.length < 80) {
          events.push({
            agent: agentName,
            message: firstSentence.trim(),
            color,
            severity: "info"
          });
        }
      }
    }
    
    if (agentName === "RiskAgent" && agentData) {
      // Extract risk events
      if (agentData.risk_profile?.risk_score) {
        const riskScore = Math.round(agentData.risk_profile.risk_score * 100);
        events.push({
          agent: agentName,
          message: `Risk exposure elevated to ${riskScore}% probability`,
          color,
          severity: riskScore > 75 ? "critical" : "warning"
        });
      }
      if (agentData.risk_profile?.risk_factors) {
        agentData.risk_profile.risk_factors.slice(0, 2).forEach(risk => {
          // Extract first 60 chars of risk
          const shortRisk = risk.length > 60 ? risk.substring(0, 60) + "..." : risk;
          events.push({
            agent: agentName,
            message: shortRisk,
            color,
            severity: "warning"
          });
        });
      }
    }
    
    if (agentName === "StrategyAgent" && agentData) {
      // Extract strategy events
      if (agentData.strategies) {
        agentData.strategies.slice(0, 2).forEach(strategy => {
          const shortStrategy = strategy.length > 60 ? strategy.substring(0, 60) + "..." : strategy;
          events.push({
            agent: agentName,
            message: shortStrategy,
            color,
            severity: "info"
          });
        });
      }
      if (agentData.summary) {
        const firstSentence = agentData.summary.split('.')[0];
        if (firstSentence.length > 10 && firstSentence.length < 80) {
          events.push({
            agent: agentName,
            message: firstSentence.trim(),
            color,
            severity: "info"
          });
        }
      }
    }
    
    if (agentName === "ExecutiveAgent" && agentData) {
      // Extract executive events from AI-generated content
      if (agentData.strategic_insights) {
        agentData.strategic_insights.slice(0, 2).forEach(insight => {
          const shortInsight = insight.length > 70 ? insight.substring(0, 70) + "..." : insight;
          events.push({
            agent: agentName,
            message: shortInsight,
            color,
            severity: "info"
          });
        });
      }
      if (agentData.risk_factors) {
        agentData.risk_factors.slice(0, 1).forEach(risk => {
          const shortRisk = risk.length > 70 ? risk.substring(0, 70) + "..." : risk;
          events.push({
            agent: agentName,
            message: shortRisk,
            color,
            severity: "critical"
          });
        });
      }
      // Add completion event
      events.push({
        agent: agentName,
        message: "Executive intelligence synthesis complete",
        color,
        severity: "success"
      });
    }
  });
  
  // Add orchestrator consensus event
  if (events.length > 0) {
    events.push({
      agent: "Orchestrator",
      message: "Cross-agent intelligence consensus achieved",
      color: "#D4AF37",
      severity: "success"
    });
  }
  
  console.log("");
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║              EVENT GENERATION RESULTS                      ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  
  if (events.length === 0) {
    console.error("❌ NO ORCHESTRATION EVENTS GENERATED");
    console.error("This means event extraction failed.");
    console.error("Check agent data structures above for issues.");
  } else {
    console.log(`✅ Generated ${events.length} dynamic orchestration events:`);
    events.forEach((event, idx) => {
      console.log(`  ${idx + 1}. [${event.severity}] ${event.agent}: ${event.message.substring(0, 60)}...`);
    });
  }
  
  console.log("╚════════════════════════════════════════════════════════════╝");
  
  return events;
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [query, setQuery] = useState("");
  const [orchestrationData, setOrchestrationData] = useState(null);
  const [error, setError] = useState(null);
  
  // Orchestration visualization states
  const [orchestrationStage, setOrchestrationStage] = useState(0);
  const [agentActivations, setAgentActivations] = useState([]);
  
  // Living system states
  const [systemPulse, setSystemPulse] = useState(0);
  const [intelligenceStream, setIntelligenceStream] = useState([]);
  const [agentStates, setAgentStates] = useState({
    DataAgent: { status: "STANDBY", activity: 0 },
    RiskAgent: { status: "STANDBY", activity: 0 },
    StrategyAgent: { status: "STANDBY", activity: 0 },
    ExecutiveAgent: { status: "STANDBY", activity: 0 }
  });
  const [activeConnections, setActiveConnections] = useState([]);
  
  const streamRef = useRef(null);

  // Global system pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemPulse(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Intelligence stream generator - DYNAMIC from orchestration response
  useEffect(() => {
    if (analyzing && orchestrationData) {
      // Generate events from actual AI response
      const dynamicEvents = generateOrchestrationEvents(orchestrationData);
      
      if (dynamicEvents.length > 0) {
        // Stream events progressively with staggered timing
        let eventIndex = 0;
        const interval = setInterval(() => {
          if (eventIndex < dynamicEvents.length) {
            const event = dynamicEvents[eventIndex];
            setIntelligenceStream(prev => {
              const newStream = [
                ...prev,
                {
                  ...event,
                  timestamp: new Date().toLocaleTimeString(),
                  id: Date.now() + Math.random()
                }
              ];
              return newStream.slice(-12); // Keep last 12 messages
            });
            eventIndex++;
          }
        }, 800); // Staggered event timing
        
        return () => clearInterval(interval);
      }
    }
  }, [analyzing, orchestrationData]);

  // Auto-scroll intelligence stream
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTop = streamRef.current.scrollHeight;
    }
  }, [intelligenceStream]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  const handleAnalyze = async () => {
    if (!query.trim()) {
      setError("Please enter a crisis scenario query");
      return;
    }

    setAnalyzing(true);
    setError(null);
    setOrchestrationData(null);
    setOrchestrationStage(0);
    setAgentActivations([]);
    setIntelligenceStream([]);
    
    // Reset agent states
    setAgentStates({
      DataAgent: { status: "STANDBY", activity: 0 },
      RiskAgent: { status: "STANDBY", activity: 0 },
      StrategyAgent: { status: "STANDBY", activity: 0 },
      ExecutiveAgent: { status: "STANDBY", activity: 0 }
    });

    // Staged orchestration visualization with live states
    const stages = [
      { agent: "DataAgent", message: "Analyzing global supply-chain dependencies...", delay: 400, state: "ANALYZING" },
      { agent: "RiskAgent", message: "Calculating geopolitical disruption exposure...", delay: 800, state: "PROCESSING" },
      { agent: "StrategyAgent", message: "Generating enterprise mitigation strategies...", delay: 1200, state: "COORDINATING" },
      { agent: "ExecutiveAgent", message: "Synthesizing executive contingency briefing...", delay: 1600, state: "SYNTHESIZING" },
    ];

    // Activate connections
    setActiveConnections([
      { from: "DataAgent", to: "RiskAgent", delay: 400 },
      { from: "RiskAgent", to: "StrategyAgent", delay: 800 },
      { from: "StrategyAgent", to: "ExecutiveAgent", delay: 1200 }
    ]);

    // Simulate staged activation with state updates
    stages.forEach((stage, index) => {
      setTimeout(() => {
        setOrchestrationStage(index + 1);
        setAgentActivations(prev => [...prev, stage]);
        setAgentStates(prev => ({
          ...prev,
          [stage.agent]: { status: stage.state, activity: 100 }
        }));
      }, stage.delay);
    });

    try {
      const result = await executeOrchestration(query);
      
      // Mark all agents as complete
      setTimeout(() => {
        setAgentStates({
          DataAgent: { status: "COMPLETE", activity: 0 },
          RiskAgent: { status: "COMPLETE", activity: 0 },
          StrategyAgent: { status: "COMPLETE", activity: 0 },
          ExecutiveAgent: { status: "COMPLETE", activity: 0 }
        });
        setActiveConnections([]);
      }, 1800);
      
      // Add slight delay to show final stage
      setTimeout(() => {
        setOrchestrationData(result);
        setOrchestrationStage(5); // Complete
        
        // COMPREHENSIVE DEBUGGING - Trace complete data flow
        console.log("╔════════════════════════════════════════════════════════════╗");
        console.log("║          ORCHESTRATION RESULT - FULL DATA TRACE           ║");
        console.log("╚════════════════════════════════════════════════════════════╝");
        console.log("");
        console.log("📦 FULL ORCHESTRATION RESPONSE:");
        console.log(JSON.stringify(result, null, 2));
        console.log("");
        
        const execAgent = result?.responses?.find(r => r.agent_name === 'ExecutiveAgent');
        console.log("🤖 EXECUTIVE AGENT RESPONSE:");
        console.log(JSON.stringify(execAgent, null, 2));
        console.log("");
        
        if (execAgent?.data) {
          console.log("📊 EXECUTIVE AGENT DATA STRUCTURE:");
          console.log("  - strategic_insights:", execAgent.data.strategic_insights);
          console.log("  - recommendations:", execAgent.data.recommendations);
          console.log("  - risk_factors:", execAgent.data.risk_factors);
          console.log("  - opportunities:", execAgent.data.opportunities);
          console.log("");
          
          console.log("📈 ARRAY LENGTHS:");
          console.log("  - Insights:", execAgent.data.strategic_insights?.length || 0);
          console.log("  - Recommendations:", execAgent.data.recommendations?.length || 0);
          console.log("  - Risks:", execAgent.data.risk_factors?.length || 0);
          console.log("  - Opportunities:", execAgent.data.opportunities?.length || 0);
          console.log("");
          
          console.log("✅ EXTRACTED CONTENT:");
          console.log("INSIGHTS:", execAgent.data.strategic_insights);
          console.log("RECOMMENDATIONS:", execAgent.data.recommendations);
          console.log("RISKS:", execAgent.data.risk_factors);
          console.log("OPPORTUNITIES:", execAgent.data.opportunities);
        } else {
          console.error("❌ NO DATA IN EXECUTIVE AGENT RESPONSE");
        }
        
        console.log("");
        console.log("╔════════════════════════════════════════════════════════════╗");
        console.log("║                    END DATA TRACE                          ║");
        console.log("╚════════════════════════════════════════════════════════════╝");
      }, 2200);
    } catch (err) {
      setError(err.message);
      console.error("Orchestration error:", err);
      setOrchestrationStage(0);
      setAgentActivations([]);
      setAgentStates({
        DataAgent: { status: "STANDBY", activity: 0 },
        RiskAgent: { status: "STANDBY", activity: 0 },
        StrategyAgent: { status: "STANDBY", activity: 0 },
        ExecutiveAgent: { status: "STANDBY", activity: 0 }
      });
      setActiveConnections([]);
    } finally {
      setTimeout(() => {
        setAnalyzing(false);
      }, 2200);
    }
  };

  // Extract data from orchestration responses
  const getAgentData = (agentName) => {
    if (!orchestrationData?.responses) return null;
    return orchestrationData.responses.find(r => r.agent_name === agentName);
  };

  const dataAgent = getAgentData('DataAgent');
  const riskAgent = getAgentData('RiskAgent');
  const strategyAgent = getAgentData('StrategyAgent');
  const executiveAgent = getAgentData('ExecutiveAgent');

  // Calculate risk score from risk agent
  const riskScore = riskAgent?.data?.risk_profile?.risk_score
    ? Math.round(riskAgent.data.risk_profile.risk_score * 10)
    : orchestrationData ? 87 : 82;

  // DYNAMIC AI INTELLIGENCE EXTRACTION
  // Extract real watsonx.ai generated intelligence from ExecutiveAgent response
  const executiveInsights = executiveAgent?.data?.strategic_insights || [];
  const executiveRecommendations = executiveAgent?.data?.recommendations || [];
  const executiveRisks = executiveAgent?.data?.risk_factors || [];
  const executiveOpportunities = executiveAgent?.data?.opportunities || [];
  
  // FRONTEND RENDERING DEBUG - Log what will be rendered
  if (orchestrationData && executiveAgent) {
    console.log("╔════════════════════════════════════════════════════════════╗");
    console.log("║           FRONTEND RENDERING - EXTRACTED DATA              ║");
    console.log("╚════════════════════════════════════════════════════════════╝");
    console.log("🎨 WHAT FRONTEND WILL RENDER:");
    console.log("  executiveInsights:", executiveInsights);
    console.log("  executiveRecommendations:", executiveRecommendations);
    console.log("  executiveRisks:", executiveRisks);
    console.log("  executiveOpportunities:", executiveOpportunities);
    console.log("");
    console.log("📊 RENDERING ARRAY LENGTHS:");
    console.log("  Insights to render:", executiveInsights.length);
    console.log("  Recommendations to render:", executiveRecommendations.length);
    console.log("  Risks to render:", executiveRisks.length);
    console.log("  Opportunities to render:", executiveOpportunities.length);
    console.log("╚════════════════════════════════════════════════════════════╝");
  }
  
  // Extract executive summary from query for context
  const executiveSummary = executiveAgent?.data?.query || query || "";
  
  // Generate dynamic Black Swan alert summary from first risk
  const generateBlackSwanAlert = () => {
    if (!executiveRisks || executiveRisks.length === 0) {
      return "Critical operational risk exposure detected. Immediate executive intervention recommended.";
    }
    
    // Use the first risk as the primary alert, or combine top risks
    const primaryRisk = executiveRisks[0];
    const secondaryContext = executiveRisks.length > 1 ? ` ${executiveRisks[1]}` : "";
    
    return `${primaryRisk}${secondaryContext} Immediate executive intervention and contingency activation recommended.`;
  };

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
            Enterprise Crisis Intelligence Command Center
          </motion.p>

          {/* SUBTEXT */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="text-slate-500 mt-4 max-w-xl text-center leading-relaxed px-6"
          >
            Multi-agent orchestration • Autonomous intelligence units •
            Operational disruption analysis • Executive decision systems
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

          {/* ENHANCED CINEMATIC BACKGROUND LIGHTING */}
          <div
            className="absolute top-[-300px] left-[-150px] w-[700px] h-[700px] bg-[#C8A75D]/10 blur-[180px] rounded-full"
            style={{
              opacity: 0.5 + Math.sin(systemPulse * 0.05) * 0.3
            }}
          />
          <div className="absolute top-[200px] right-[-200px] w-[500px] h-[500px] bg-[#D4AF37]/8 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-300px] right-[-150px] w-[700px] h-[700px] bg-white/[0.03] blur-[180px] rounded-full" />
          <div
            className="absolute bottom-[100px] left-[-100px] w-[400px] h-[400px] bg-[#C8A75D]/6 blur-[120px] rounded-full"
            style={{
              opacity: 0.3 + Math.sin((systemPulse + 50) * 0.05) * 0.2
            }}
          />
          <div className="absolute top-[50%] left-[50%] w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[200px] rounded-full" />

          {/* GRID */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px]" />
          
          {/* FLOATING PARTICLES */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#D4AF37] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}

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
                    Enterprise Crisis Intelligence Command Center
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">

                <div className="bg-[#111111]/80 border border-[#2A2A2A] backdrop-blur-2xl px-5 py-3 rounded-2xl shadow-2xl">
                  <p className="text-[#D4AF37] text-sm font-semibold tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
                    OPERATIONAL
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
                  Crisis Intelligence Query
                </h2>
              </div>

              <div className="flex flex-col lg:flex-row gap-5">

                <input
                  type="text"
                  placeholder="Analyze Taiwan semiconductor supply chain disruption risks..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                  disabled={analyzing}
                  className="flex-1 bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl px-6 py-4 outline-none text-lg text-[#E5E5E5] focus:border-[#C8A75D] transition-all disabled:opacity-50"
                />

                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="bg-gradient-to-r from-[#C8A75D] via-[#E5D3A1] to-[#F5F5F5] text-black font-black px-7 py-4 rounded-2xl hover:scale-[1.02] transition-all duration-300 shadow-[0_0_35px_rgba(200,167,93,0.25)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Executing Intelligence Analysis
                    </>
                  ) : (
                    <>
                      <Zap size={20} />
                      Execute Intelligence Analysis
                    </>
                  )}
                </button>

              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 flex items-center gap-2"
                >
                  <AlertTriangle size={18} />
                  {error}
                </motion.div>
              )}

              {orchestrationData && !analyzing && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-green-400 flex items-center gap-2"
                >
                  <Activity size={18} />
                  <span className="font-semibold">Executive Intelligence Briefing Generated</span>
                  <span className="text-green-300/70">• {orchestrationData.success_count} autonomous units executed in {orchestrationData.total_execution_time.toFixed(2)}s</span>
                </motion.div>
              )}
            </motion.div>

            {/* ORCHESTRATION VISUALIZATION */}
            {analyzing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#111111]/80 border border-[#C8A75D]/30 backdrop-blur-2xl rounded-[32px] p-6 lg:p-8 mb-8 shadow-[0_0_60px_rgba(200,167,93,0.15)]"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Workflow className="text-[#D4AF37] animate-pulse" />
                  <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
                    Autonomous Intelligence Orchestration
                  </h2>
                </div>

                <div className="space-y-4">
                  {agentActivations.map((activation, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-4 bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-4"
                    >
                      <div className="w-3 h-3 bg-[#D4AF37] rounded-full animate-pulse" />
                      <ArrowRight className="text-[#D4AF37]" size={20} />
                      <span className="font-semibold text-[#D4AF37]">{activation.agent}</span>
                      <span className="text-[#8E8E8E]">{activation.message}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* METRICS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

              {[
                {
                  title: "Enterprise Disruption Risk",
                  value: `${riskScore}%`,
                  icon: ShieldAlert,
                  color: "text-red-400",
                  status: riskScore > 70 ? "CRITICAL" : "ELEVATED"
                },
                {
                  title: "Autonomous Intelligence Units",
                  value: "4",
                  icon: Cpu,
                  color: "text-[#D4AF37]",
                  status: "ACTIVE"
                },
                {
                  title: "Threat Predictions",
                  value: "148",
                  icon: Radar,
                  color: "text-white",
                  status: "MONITORING"
                },
                {
                  title: "Active Orchestrations",
                  value: "12",
                  icon: Workflow,
                  color: "text-green-400",
                  status: "COORDINATING"
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
                      {item.status}
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

            {/* MAIN GRID - EXECUTIVE BRIEFING CENTERPIECE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* CENTER - EXECUTIVE INTELLIGENCE BRIEFING (MAIN CENTERPIECE) */}
              <div className="lg:col-span-2 space-y-6">

                {/* EXECUTIVE BRIEFING - LARGEST COMPONENT WITH CINEMATIC TREATMENT */}
                {orchestrationData && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="bg-gradient-to-br from-[#1A1408]/95 to-[#130F08]/95 border-2 border-[#C8A75D]/40 backdrop-blur-2xl rounded-[32px] p-8 lg:p-10 shadow-[0_0_80px_rgba(200,167,93,0.2)] relative overflow-hidden"
                  >
                    {/* Animated glow overlay */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 to-transparent pointer-events-none"
                      style={{
                        opacity: Math.sin(systemPulse * 0.08) * 0.2 + 0.2
                      }}
                    />
                    
                    <div className="flex items-center gap-4 mb-8 relative z-10">
                      <BrainCircuit
                        className="text-[#D4AF37]"
                        size={36}
                        style={{
                          filter: `drop-shadow(0 0 10px rgba(212, 175, 55, ${0.3 + Math.sin(systemPulse * 0.1) * 0.2}))`
                        }}
                      />
                      <div>
                        <h2 className="text-3xl lg:text-4xl font-black tracking-tight bg-gradient-to-r from-[#F5F5F5] to-[#C8A75D] bg-clip-text text-transparent">
                          Executive Intelligence Briefing
                        </h2>
                        <p className="text-[#8E8E8E] mt-1 text-sm tracking-wide">
                          AI-Generated Strategic Crisis Analysis
                        </p>
                      </div>
                    </div>

                    {/* ENHANCED BLACK SWAN EVENT ALERT */}
                    {riskScore > 75 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-2xl px-6 py-5 mb-6 flex items-start gap-4 shadow-[0_0_30px_rgba(239,68,68,0.1)] relative z-10"
                      >
                        <AlertTriangle
                          className="text-red-400 flex-shrink-0 mt-1"
                          size={28}
                          style={{
                            filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.5))'
                          }}
                        />
                        <div>
                          <p className="text-red-400 font-bold text-xl mb-2">Critical Black Swan Event Detected</p>
                          <p className="text-red-300/90 leading-relaxed">
                            {generateBlackSwanAlert()}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* STRATEGIC INSIGHTS WITH ENHANCED ANIMATIONS */}
                    {executiveInsights && executiveInsights.length > 0 && (
                      <div className="mb-8 relative z-10">
                        <h3 className="text-[#D4AF37] font-bold text-xl mb-4 flex items-center gap-2">
                          <TrendingUp size={20} style={{ filter: 'drop-shadow(0 0 5px rgba(212, 175, 55, 0.5))' }} />
                          Strategic Intelligence
                        </h3>
                        <div className="space-y-4">
                          {executiveInsights.map((insight, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.15, duration: 0.5 }}
                              className="bg-gradient-to-r from-[#0A0A0A]/80 to-[#0A0A0A]/50 border border-[#2A2A2A] rounded-xl p-5 hover:border-[#C8A75D]/30 transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                            >
                              <p className="text-[#E5E5E5] leading-relaxed text-lg">{insight}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* STRATEGIC MITIGATION ACTIONS WITH GLOWING BULLETS */}
                    {executiveRecommendations && executiveRecommendations.length > 0 && (
                      <div className="mb-8 relative z-10">
                        <h3 className="text-[#D4AF37] font-bold text-xl mb-4 flex items-center gap-2">
                          <Zap size={20} style={{ filter: 'drop-shadow(0 0 5px rgba(212, 175, 55, 0.5))' }} />
                          Strategic Mitigation Actions
                        </h3>
                        <div className="space-y-3">
                          {executiveRecommendations.map((rec, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + idx * 0.1 }}
                              className="flex items-start gap-3 bg-gradient-to-r from-[#0A0A0A]/80 to-[#0A0A0A]/50 border border-[#2A2A2A] rounded-xl p-4 hover:border-[#C8A75D]/30 transition-all"
                            >
                              <div
                                className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"
                                style={{ boxShadow: '0 0 8px rgba(212, 175, 55, 0.5)' }}
                              />
                              <p className="text-[#D0D0D0] leading-relaxed">{rec}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* OPERATIONAL RISKS WITH ENHANCED STYLING */}
                    {executiveRisks && executiveRisks.length > 0 && (
                      <div className="mb-8 relative z-10">
                        <h3 className="text-red-400 font-bold text-xl mb-4 flex items-center gap-2">
                          <ShieldAlert size={20} />
                          Operational Risk Exposure
                        </h3>
                        <div className="space-y-3">
                          {executiveRisks.map((risk, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + idx * 0.1 }}
                              className="flex items-start gap-3 bg-red-500/5 border border-red-500/20 rounded-xl p-4 hover:border-red-500/30 transition-all shadow-[0_0_15px_rgba(239,68,68,0.05)]"
                            >
                              <AlertTriangle className="text-red-400 flex-shrink-0" size={18} />
                              <p className="text-[#D0D0D0] leading-relaxed">{risk}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* STRATEGIC OPPORTUNITIES */}
                    {executiveOpportunities && executiveOpportunities.length > 0 && (
                      <div className="relative z-10">
                        <h3 className="text-green-400 font-bold text-xl mb-4 flex items-center gap-2">
                          <TrendingUp size={20} />
                          Strategic Opportunities
                        </h3>
                        <div className="space-y-3">
                          {executiveOpportunities.map((opp, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.7 + idx * 0.1 }}
                              className="flex items-start gap-3 bg-green-500/5 border border-green-500/20 rounded-xl p-4 hover:border-green-500/30 transition-all shadow-[0_0_15px_rgba(74,222,128,0.05)]"
                            >
                              <div
                                className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"
                                style={{ boxShadow: '0 0 8px rgba(74, 222, 128, 0.5)' }}
                              />
                              <p className="text-[#D0D0D0] leading-relaxed">{opp}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* EMPTY STATE - Show when no AI content available */}
                    {(!executiveInsights || executiveInsights.length === 0) &&
                     (!executiveRecommendations || executiveRecommendations.length === 0) &&
                     (!executiveRisks || executiveRisks.length === 0) &&
                     (!executiveOpportunities || executiveOpportunities.length === 0) && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 relative z-10"
                      >
                        <BrainCircuit className="mx-auto mb-4 text-[#D4AF37]/30" size={48} />
                        <p className="text-[#8E8E8E] text-lg">
                          AI intelligence generation in progress...
                        </p>
                        <p className="text-[#6E6E6E] text-sm mt-2">
                          Executive briefing will appear here once analysis is complete
                        </p>
                      </motion.div>
                    )}

                    {/* CONFIDENCE INDICATOR WITH GLOW */}
                    {executiveAgent?.data?.confidence && (
                      <div className="mt-8 pt-6 border-t border-[#2A2A2A] relative z-10">
                        <div className="flex items-center justify-between">
                          <span className="text-[#8E8E8E] text-sm">Intelligence Confidence</span>
                          <span className="text-[#D4AF37] font-bold text-lg">
                            {(executiveAgent.data.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[#0A0A0A] rounded-full mt-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${executiveAgent.data.confidence * 100}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-[#C8A75D] to-[#D4AF37]"
                            style={{ boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)' }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* LIVING AGENT CARDS */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-[#111111]/80 border border-[#2A2A2A] backdrop-blur-2xl rounded-[32px] p-6 lg:p-8 relative overflow-hidden"
                >
                  {/* Animated background pulse */}
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 to-transparent opacity-0"
                    style={{
                      opacity: analyzing ? Math.sin(systemPulse * 0.1) * 0.3 + 0.3 : 0,
                      transition: 'opacity 0.3s ease'
                    }}
                  />
                  
                  <h2 className="text-2xl lg:text-3xl font-bold mb-8 tracking-tight relative z-10">
                    Autonomous Intelligence Units
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 relative z-10">

                    {[
                      {
                        name: "DataAgent",
                        title: "Data Agent",
                        icon: Database,
                        activeDesc: "Monitoring APAC logistics signals...",
                        standbyDesc: "Collecting enterprise operational signals",
                        color: "text-[#D4AF37]",
                        borderColor: "border-[#D4AF37]",
                        glowColor: "shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                      },
                      {
                        name: "RiskAgent",
                        title: "Risk Agent",
                        icon: ShieldAlert,
                        activeDesc: "Escalating geopolitical disruption exposure...",
                        standbyDesc: "Analyzing geopolitical threat vectors",
                        color: "text-red-400",
                        borderColor: "border-red-400",
                        glowColor: "shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                      },
                      {
                        name: "StrategyAgent",
                        title: "Strategy Agent",
                        icon: Workflow,
                        activeDesc: "Generating contingency mitigation pathways...",
                        standbyDesc: "Generating crisis mitigation protocols",
                        color: "text-blue-400",
                        borderColor: "border-blue-400",
                        glowColor: "shadow-[0_0_20px_rgba(96,165,250,0.3)]"
                      },
                      {
                        name: "ExecutiveAgent",
                        title: "Executive Agent",
                        icon: BrainCircuit,
                        activeDesc: "Synthesizing executive operational briefing...",
                        standbyDesc: "Synthesizing strategic intelligence",
                        color: "text-green-400",
                        borderColor: "border-green-400",
                        glowColor: "shadow-[0_0_20px_rgba(74,222,128,0.3)]"
                      },
                    ].map((agent, index) => {
                      const state = agentStates[agent.name];
                      const isActive = state.status !== "STANDBY" && state.status !== "COMPLETE";
                      const isComplete = state.status === "COMPLETE";
                      
                      return (
                        <motion.div
                          key={index}
                          whileHover={{
                            scale: 1.03,
                            y: -4,
                          }}
                          className={`bg-[#0A0A0A] border ${isActive ? agent.borderColor : 'border-[#2A2A2A]'} rounded-[24px] p-5 transition-all relative overflow-hidden ${isActive ? agent.glowColor : ''}`}
                          style={{
                            borderWidth: isActive ? '2px' : '1px'
                          }}
                        >
                          {/* Pulsing background for active agents */}
                          {isActive && (
                            <div
                              className="absolute inset-0 bg-gradient-to-br from-transparent to-current opacity-5"
                              style={{
                                opacity: Math.sin(systemPulse * 0.15) * 0.1 + 0.05
                              }}
                            />
                          )}
                          
                          <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="relative">
                              <agent.icon
                                className={agent.color}
                                size={30}
                              />
                              {/* Pulsing indicator for active agents */}
                              {isActive && (
                                <motion.div
                                  className={`absolute -top-1 -right-1 w-3 h-3 ${agent.color.replace('text-', 'bg-')} rounded-full`}
                                  animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [1, 0.5, 1]
                                  }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Infinity
                                  }}
                                />
                              )}
                            </div>
                            <span className={`text-xs font-semibold tracking-wider ${
                              isComplete ? 'text-green-400' :
                              isActive ? agent.color :
                              'text-[#5A5A5A]'
                            }`}>
                              {state.status}
                            </span>
                          </div>

                          <h3 className="font-bold text-lg mb-3 tracking-tight relative z-10">
                            {agent.title}
                          </h3>

                          <p className="text-[#8E8E8E] text-sm leading-relaxed relative z-10">
                            {isActive ? agent.activeDesc : agent.standbyDesc}
                          </p>
                          
                          {/* Progress bar for active agents */}
                          {isActive && (
                            <div className="mt-3 flex items-center gap-2 relative z-10">
                              <Radio size={14} className={agent.color} />
                              <div className="flex-1 h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                                <motion.div
                                  className={`h-full ${agent.color.replace('text-', 'bg-')}`}
                                  animate={{ width: ["0%", "100%"] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                />
                              </div>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* AI REASONING STREAM - REPLACES GRAPH */}
                <motion.div
                  className="bg-[#111111]/80 border border-[#2A2A2A] backdrop-blur-2xl rounded-[32px] p-6 lg:p-8 relative overflow-hidden"
                >
                  {/* Scanline effect */}
                  <div className="absolute inset-0 pointer-events-none opacity-5">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent h-[2px] animate-pulse"
                         style={{ top: `${(systemPulse % 100)}%` }} />
                  </div>
                  
                  <h2 className="text-2xl lg:text-3xl font-bold mb-8 tracking-tight flex items-center gap-3 relative z-10">
                    <Wifi className="text-[#D4AF37]" />
                    AI Reasoning Stream
                  </h2>

                  <div
                    ref={streamRef}
                    className="space-y-3 font-mono text-sm h-[350px] overflow-y-auto relative z-10 scrollbar-thin scrollbar-thumb-[#2A2A2A] scrollbar-track-transparent"
                  >
                    {intelligenceStream.length > 0 ? (
                      intelligenceStream.map((item, idx) => {
                        // Severity-based styling
                        const severityStyles = {
                          critical: {
                            border: 'border-red-500/30',
                            bg: 'bg-red-500/5',
                            glow: 'shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                          },
                          warning: {
                            border: 'border-orange-500/30',
                            bg: 'bg-orange-500/5',
                            glow: 'shadow-[0_0_15px_rgba(249,115,22,0.1)]'
                          },
                          success: {
                            border: 'border-green-500/30',
                            bg: 'bg-green-500/5',
                            glow: 'shadow-[0_0_15px_rgba(74,222,128,0.1)]'
                          },
                          info: {
                            border: 'border-[#2A2A2A]',
                            bg: 'bg-[#0A0A0A]',
                            glow: ''
                          }
                        };
                        
                        const style = severityStyles[item.severity] || severityStyles.info;
                        
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex items-start gap-3 ${style.bg} border ${style.border} rounded-xl p-4 hover:border-[#C8A75D]/30 transition-all ${style.glow}`}
                          >
                            <span className="text-[#5A5A5A] text-xs mt-1 flex-shrink-0">{item.timestamp}</span>
                            <span style={{ color: item.color }}>→</span>
                            <div className="flex-1">
                              <span className="font-semibold" style={{ color: item.color }}>{item.agent}</span>
                              <p className="text-[#D0D0D0] leading-relaxed mt-1">{item.message}</p>
                            </div>
                          </motion.div>
                        );
                      })
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Radio className="mx-auto mb-4 text-[#D4AF37]/30" size={48} />
                          <p className="text-[#8E8E8E] text-lg">Orchestration telemetry stream</p>
                          <p className="text-[#6E6E6E] text-sm mt-2">Live agent events will appear here during analysis</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>

              </div>

              {/* RIGHT SIDEBAR */}
              <div className="space-y-6">

                {/* RISK CARD */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-[#1A1408] to-[#130F08] border border-[#3A2F1A] backdrop-blur-2xl rounded-[32px] p-6 lg:p-8 shadow-[0_0_60px_rgba(200,167,93,0.08)]"
                >
                  <div className="flex items-center gap-3 mb-5">

                    <Activity className="text-red-400" />

                    <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
                      Disruption Risk
                    </h2>
                  </div>

                  <h1 className="text-7xl lg:text-8xl font-black text-[#D4AF37] metric-number">
                    {riskScore}%
                  </h1>

                  <p className={`font-bold mt-5 tracking-widest text-sm ${riskScore > 70 ? 'text-red-400' : riskScore > 40 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {riskScore > 70 ? 'CRITICAL THREAT LEVEL' : riskScore > 40 ? 'ELEVATED RISK' : 'NOMINAL OPERATIONS'}
                  </p>

                  <p className="text-[#CFCFCF] mt-6 leading-relaxed">
                    {riskAgent?.data?.risk_profile?.business_impact ||
                     "Multi-agent analysis detected elevated operational disruption patterns across semiconductor supply chains and logistics infrastructure."}
                  </p>
                </motion.div>

                {/* LIVE ORCHESTRATION FEED */}
                <motion.div
                  className="bg-[#111111]/80 border border-[#2A2A2A] backdrop-blur-2xl rounded-[32px] p-6 lg:p-8"
                >
                  <h2 className="text-2xl lg:text-3xl font-bold mb-6 tracking-tight">
                    Live Orchestration Feed
                  </h2>

                  <div className="space-y-5 text-sm">
                    {orchestrationData?.responses ? (
                      orchestrationData.responses.map((response, idx) => {
                        const colors = {
                          'DataAgent': 'border-[#D4AF37]',
                          'RiskAgent': 'border-red-400',
                          'StrategyAgent': 'border-blue-400',
                          'ExecutiveAgent': 'border-green-400'
                        };
                        const icons = {
                          'DataAgent': Database,
                          'RiskAgent': ShieldAlert,
                          'StrategyAgent': Workflow,
                          'ExecutiveAgent': BrainCircuit
                        };
                        const Icon = icons[response.agent_name] || Activity;
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`border-l-2 ${colors[response.agent_name] || 'border-white'} pl-4 flex items-start gap-3`}
                          >
                            <Icon size={16} className="mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-[#E5E5E5] font-semibold">{response.agent_name}</p>
                              <p className="text-[#8E8E8E] text-xs mt-1">
                                {response.status === 'success' ? '✓ Execution complete' : '✗ Execution failed'} •
                                Confidence: {((response.confidence || 0.85) * 100).toFixed(0)}% •
                                {response.execution_time.toFixed(2)}s
                              </p>
                            </div>
                          </motion.div>
                        );
                      })
                    ) : (
                      <>
                        <div className="border-l-2 border-[#D4AF37] pl-4 text-[#D0D0D0] flex items-center gap-2">
                          <Database size={16} />
                          Data Agent collected 248 enterprise operational signals
                        </div>
                        <div className="border-l-2 border-red-400 pl-4 text-[#D0D0D0] flex items-center gap-2">
                          <ShieldAlert size={16} />
                          Risk Agent updated critical disruption threat assessment
                        </div>
                        <div className="border-l-2 border-green-400 pl-4 text-[#D0D0D0] flex items-center gap-2">
                          <BrainCircuit size={16} />
                          Executive intelligence briefing synthesized
                        </div>
                      </>
                    )}
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

// Made with Bob
