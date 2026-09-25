import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Zap, MessageSquare, Workflow, CheckCircle2, ArrowRight, Sparkles, Send, RefreshCw } from 'lucide-react';
import { fadeUpVariant, staggerContainer, cardRevealVariant, VIEWPORT_CONFIG } from '../lib/motion';

interface AiSolutionsSectionProps {
  onStartAiProject: () => void;
}

interface DemoScenario {
  id: string;
  title: string;
  badge: string;
  initialDialogue: Array<{ sender: 'user' | 'assistant'; text: string; time: string }>;
  suggestedQuestions: Array<{ prompt: string; reply: string }>;
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'customer-support',
    title: 'Customer Support Assistant',
    badge: 'Support Demo',
    initialDialogue: [
      {
        sender: 'user',
        text: 'Do you have this product available in size Medium, and what is your return policy?',
        time: '10:42 AM',
      },
      {
        sender: 'assistant',
        text: "Yes, it's currently in stock in size Medium with 4 units remaining. We offer a 30-day hassle-free return policy with complimentary exchanges. Would you like help reserving it or placing an order right now?",
        time: '10:42 AM',
      },
    ],
    suggestedQuestions: [
      {
        prompt: 'How long does express shipping usually take?',
        reply: 'Express shipping takes 2-3 business days with real-time package tracking sent directly to your phone or email.',
      },
      {
        prompt: 'Can I speak with a human support specialist?',
        reply: 'Of course! I have forwarded your inquiry to our team. A human specialist can take over this chat or call you back directly.',
      },
    ],
  },
  {
    id: 'lead-qualification',
    title: 'Lead Qualification & Booking',
    badge: 'B2B Demo',
    initialDialogue: [
      {
        sender: 'user',
        text: 'Hi, we need a complete website redesign and Google Ads strategy for our medical clinic.',
        time: '02:15 PM',
      },
      {
        sender: 'assistant',
        text: "We'd love to help! To recommend the right scope, what is your desired launch timeline and approximate monthly budget range?",
        time: '02:15 PM',
      },
      {
        sender: 'user',
        text: 'We are targeting a launch in 6 weeks with a budget around $3k–$5k.',
        time: '02:16 PM',
      },
      {
        sender: 'assistant',
        text: 'Perfect. That timeline aligns well with our Growth & Performance sprint. Would you like me to book a 20-minute strategy call with our lead technical architect?',
        time: '02:16 PM',
      },
    ],
    suggestedQuestions: [
      {
        prompt: 'What information do you need before our call?',
        reply: 'Just a brief overview of your current website URL and primary patient acquisition goals. We will prepare an initial audit prior to the session.',
      },
      {
        prompt: 'Do you provide HIPAA-compliant medical form integrations?',
        reply: 'Yes, all healthcare client implementations adhere to secure encrypted transmission and compliant database architectures.',
      },
    ],
  },
  {
    id: 'workflow-automation',
    title: 'Operational Workflow Sync',
    badge: 'Automation Demo',
    initialDialogue: [
      {
        sender: 'user',
        text: 'A new client submitted an inquiry on the website.',
        time: 'Just now',
      },
      {
        sender: 'assistant',
        text: 'Automated Pipeline Triggered:\n1. Client profile created in CRM\n2. Lead score calculated: 94/100 (High Intent)\n3. Notification dispatched to Slack & WhatsApp\n4. Tailored portfolio PDF emailed to client within 8 seconds.',
        time: 'Just now',
      },
    ],
    suggestedQuestions: [
      {
        prompt: 'Can this connect with Google Sheets and Stripe?',
        reply: 'Yes. Our automated pipelines synchronize leads, payment events, and invoices directly between Stripe, Supabase, Google Workspace, and your CRM.',
      },
    ],
  },
];

export const AiSolutionsSection: React.FC<AiSolutionsSectionProps> = ({ onStartAiProject }) => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('customer-support');
  const activeScenario = DEMO_SCENARIOS.find((s) => s.id === activeScenarioId) || DEMO_SCENARIOS[0];
  const [conversation, setConversation] = useState(activeScenario.initialDialogue);

  const handleScenarioChange = (scenarioId: string) => {
    setActiveScenarioId(scenarioId);
    const chosen = DEMO_SCENARIOS.find((s) => s.id === scenarioId) || DEMO_SCENARIOS[0];
    setConversation(chosen.initialDialogue);
  };

  const handleSendPrompt = (prompt: string, reply: string) => {
    const userMsg = { sender: 'user' as const, text: prompt, time: 'Just now' };
    const botMsg = { sender: 'assistant' as const, text: reply, time: 'Just now' };
    setConversation((prev) => [...prev, userMsg, botMsg]);
  };

  const handleResetDemo = () => {
    setConversation(activeScenario.initialDialogue);
  };

  const aiCapabilities = [
    {
      title: '24/7 AI Chatbots',
      icon: Bot,
      description: 'Intelligent web assistants grounded in your private brand docs, product catalogs, and service guidelines.',
    },
    {
      title: 'Automated Lead Qualification',
      icon: Zap,
      description: 'Filter high-intent buyers, collect essential project parameters, and schedule consultations automatically.',
    },
    {
      title: 'Customer Support Triage',
      icon: MessageSquare,
      description: 'Resolve repetitive inquiries in seconds while routing complex edge-cases seamlessly to human specialists.',
    },
    {
      title: 'Business Workflow Automation',
      icon: Workflow,
      description: 'Connect web forms, CRMs, email marketing tools, and databases without manual data entry.',
    },
  ];

  return (
    <section id="ai-solutions" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          variants={fadeUpVariant}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className="text-xs font-display uppercase tracking-[0.16em] text-[#67e8f9] font-bold">
              AI & Intelligent Systems
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight">
            Turn Repetitive Work Into Automated Systems.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#bdc8d1] font-normal leading-relaxed">
            We deploy practical, revenue-generating AI chatbots and workflow automations that engage prospective buyers, capture leads, and free up operational time.
          </p>
        </motion.div>

        {/* 2-Column Showcase: Interactive Demonstration vs. Capabilities */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Chatbot Demonstration (7 Cols) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_CONFIG}
            variants={fadeUpVariant}
            className="lg:col-span-7 glass-level-2 rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-8 border border-[#38bdf8]/35 shadow-[0_24px_64px_rgba(5,11,20,0.9)] flex flex-col justify-between relative overflow-hidden"
          >
            {/* Light Catchment */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#67e8f9]/70 to-transparent" />

            <div>
              {/* Header with Demo Disclaimer Pill */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-5 border-b border-white/[0.08]">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#38bdf8]/15 border border-[#38bdf8]/40 flex items-center justify-center text-[#38bdf8] shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-semibold text-white flex items-center space-x-2">
                      <span>AMAAS AI Assistant</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </h3>
                    <p className="text-xs text-[#8ed5ff]">Demonstration Model Preview</p>
                  </div>
                </div>

                {/* Clear Demonstration Badge */}
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono uppercase tracking-wider text-amber-300 self-start sm:self-auto">
                  <span>Interactive Demonstration</span>
                </div>
              </div>

              {/* Scenario Selector Tabs */}
              <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                {DEMO_SCENARIOS.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => handleScenarioChange(scenario.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-display font-medium transition-all cursor-pointer ${
                      activeScenarioId === scenario.id
                        ? 'bg-[#38bdf8] text-[#00283b] font-bold shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                        : 'bg-white/[0.04] text-[#bdc8d1] hover:text-white border border-white/[0.06]'
                    }`}
                  >
                    {scenario.title}
                  </button>
                ))}
              </div>

              {/* Chat Message Window */}
              <div className="mt-4 sm:mt-5 p-3.5 sm:p-5 rounded-2xl bg-[#03070E]/80 border border-white/[0.06] min-h-[240px] sm:min-h-[260px] max-h-[340px] overflow-y-auto space-y-3.5">
                <AnimatePresence initial={false}>
                  {conversation.map((msg, index) => {
                    const isBot = msg.sender === 'assistant';
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                      >
                        <div className="flex items-center space-x-1.5 text-[10px] font-mono text-[#8ed5ff]/70 mb-1">
                          <span>{isBot ? 'AMAAS AI Assistant' : 'Website Customer'}</span>
                          <span>•</span>
                          <span>{msg.time}</span>
                        </div>
                        <div
                          className={`max-w-[92%] sm:max-w-[85%] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                            isBot
                              ? 'bg-[#0b1c33] border border-[#38bdf8]/30 text-[#e0f2fe]'
                              : 'bg-gradient-to-r from-[#184b82] to-[#0284c7] text-white'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Interactive Try-it Prompts */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#bdc8d1]/80 mb-2">
                  <span>Click to simulate user questions:</span>
                  <button
                    onClick={handleResetDemo}
                    className="text-[#38bdf8] hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset dialogue</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {activeScenario.suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendPrompt(q.prompt, q.reply)}
                      className="text-left px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-[#38bdf8]/15 border border-white/[0.08] hover:border-[#38bdf8]/40 text-xs text-[#8ed5ff] transition-all cursor-pointer flex items-center space-x-1.5"
                    >
                      <Send className="w-3 h-3 text-[#38bdf8] shrink-0" />
                      <span className="line-clamp-1">{q.prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Clarification Notice */}
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-[#bdc8d1]/70">
              <span className="leading-snug">* Safe demonstration only. Actual client models are grounded on verified proprietary data.</span>
              <button
                onClick={onStartAiProject}
                className="text-xs font-display font-semibold text-[#67e8f9] hover:text-white flex items-center space-x-1 cursor-pointer shrink-0"
              >
                <span>Request AI Solution</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

          {/* Right Column: 4 Strategic Capability Blocks (5 Cols) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_CONFIG}
            variants={staggerContainer}
            className="lg:col-span-5 space-y-4"
          >
            {aiCapabilities.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  variants={cardRevealVariant}
                  whileHover={{ y: -3 }}
                  className="glass-level-1 p-5 rounded-2xl border border-white/[0.08] hover:border-[#38bdf8]/40 hover:shadow-[0_12px_28px_rgba(56,189,248,0.12)] transition-all group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-xl bg-[#050B14]/80 border border-white/[0.08] group-hover:border-[#38bdf8]/40 group-hover:scale-105 transition-all text-[#38bdf8] shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-base font-semibold text-white group-hover:text-[#8ed5ff] transition-colors">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-xs text-[#bdc8d1] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Summary Action Card */}
            <motion.div
              variants={cardRevealVariant}
              className="p-5 rounded-2xl bg-gradient-to-br from-[#0c2847] to-[#040e1c] border border-[#38bdf8]/35 text-center"
            >
              <div className="text-xs font-display font-semibold uppercase tracking-wider text-[#67e8f9] mb-1">
                Custom Workflow Integration
              </div>
              <p className="text-xs text-[#dce3f0] leading-relaxed">
                Need automated CRM routing, lead qualification, or an AI assistant trained on your specific business?
              </p>
              <button
                onClick={onStartAiProject}
                className="mt-3.5 btn-primary-luminescence w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 cursor-pointer shadow-md"
              >
                <span>Automate Your Workflows</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
