import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";
import Footer from "../../components/Footer/Footer"; // Ensure the path is correct!

export default function Home() {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /* ======================
     Core Functions
  ====================== */
  const createSession = async () => {
    setIsCreating(true);
    try {
      const res = await api.post("/sessions/create");
      navigate(`/presenter/${res.data.sessionId}`);
    } catch (error) {
      console.error("Failed to create session:", error);
      setIsCreating(false);
      alert("Failed to start server. Make sure your backend is running!");
    }
  };

  const joinSession = (e) => {
    e.preventDefault();
    if (sessionId.trim()) {
      navigate(`/audience/${sessionId.trim()}`);
    }
  };

  /* ======================
     Page Content Data
  ====================== */
  const features = [
    {
      icon: "🧠",
      title: "Context-Aware Q&A",
      description: "Our AI strictly reads your slides to answer audience questions instantly and accurately.",
    },
    {
      icon: "📊",
      title: "Emotion Analytics",
      description: "Track live audience confusion, 'aha' moments, and overall sentiment in a beautiful post-session dashboard.",
    },
    {
      icon: "💡",
      title: "Dynamic Recommendations",
      description: "Combines your live speech and slides to automatically suggest external Wikipedia and YouTube links.",
    },
    {
      icon: "🎙️",
      title: "Live Captions & Transcripts",
      description: "Real-time speech-to-text accessibility with downloadable transcripts for every attendee.",
    },
  ];

  // 👇 NEW: Data for the How It Works section
  const steps = [
    {
      number: "01",
      title: "Host & Upload",
      description: "Start a session and upload your presentation PDF. We instantly generate a unique room code.",
    },
    {
      number: "02",
      title: "Share the Link",
      description: "Your audience joins instantly via QR code or direct link—no app downloads required.",
    },
    {
      number: "03",
      title: "Present with AI",
      description: "Speak naturally while our AI handles Q&A, live captions, and interactive content suggestions.",
    }
  ];

  /* ======================
     UI Render
  ====================== */
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-blue-200">
      
      {/* HEADER / NAVIGATION */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg text-white font-bold text-xl">
              AI
            </div>
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">Present<span className="text-blue-600">Pro</span></span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 text-sm font-semibold text-gray-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            {/* 👇 Smooth scroll link to How It Works 👇 */}
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</a>
            <button className="text-blue-600 hover:text-blue-800 transition-colors">Login / Sign Up</button>
          </nav>

          {/* Mobile Burger Icon */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 focus:outline-none transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full left-0 top-20 flex flex-col py-4 px-6 space-y-4 animate-fade-in">
            <a 
              href="#features" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-gray-700 font-semibold hover:text-blue-600 transition-colors border-b border-gray-50 pb-2"
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-gray-700 font-semibold hover:text-blue-600 transition-colors border-b border-gray-50 pb-2"
            >
              How it Works
            </a>
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-blue-600 font-bold hover:text-blue-800 transition-colors text-left pt-2"
            >
              Login / Sign Up
            </button>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 mt-20">
        <section className="relative pt-24 pb-32 px-6 lg:px-8 overflow-hidden flex flex-col items-center text-center">
          
          {/* Background Decorative Blobs */}
          <div className="absolute top-0 -z-10 w-full h-full bg-white overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          <div className="max-w-4xl mx-auto transform transition-all duration-700 hover:scale-[1.01]">
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
              Elevate Your Seminars with <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Artificial Intelligence
              </span>
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Transform static slideshows into interactive experiences. Get real-time AI Q&A, live captioning, and dynamic content recommendations instantly.
            </p>

            {/* ACTION CARDS (Start & Join) */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-8 w-full max-w-3xl mx-auto">
              
              {/* START SESSION CARD */}
              <div className="w-full md:w-1/2 bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Host a Seminar</h3>
                <p className="text-gray-500 text-sm mb-6">Create a new live room, upload your slides, and start presenting with AI.</p>
                <button
                  onClick={createSession}
                  disabled={isCreating}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? "Starting Engine..." : "Start New Session"}
                </button>
              </div>

              {/* JOIN SESSION CARD */}
              <div className="w-full md:w-1/2 bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl mb-4">👋</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Join a Seminar</h3>
                <p className="text-gray-500 text-sm mb-6">Enter the unique code provided by your presenter to join the audience.</p>
                <form onSubmit={joinSession} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Session ID"
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    required
                  />
                  <button
                    type="submit"
                    className="py-3 px-6 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-md transition-all duration-200 whitespace-nowrap"
                  >
                    Join
                  </button>
                </form>
              </div>

            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Powered by Next-Gen AI</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Everything you need to keep your audience engaged, informed, and actively participating.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-blue-50 transition-colors duration-300 group cursor-default">
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 👇 NEW: HOW IT WORKS SECTION 👇 */}
        <section id="how-it-works" className="py-24 bg-blue-50/50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Get your interactive presentation up and running in less than a minute.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Optional: Connecting line behind the numbers on desktop */}
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-blue-200 -z-10"></div>
              
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-white border-4 border-blue-100 shadow-md flex items-center justify-center text-3xl font-extrabold text-blue-600 mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER COMPONENT */}
      <Footer />

      {/* Tailwind Custom Animations & Smooth Scrolling */}
      <style>{`
        /* 👇 Enables smooth scrolling when clicking anchor links 👇 */
        html {
          scroll-behavior: smooth;
        }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>

    </div>
  );
}