// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import api from "../../services/api";

// export default function Analytics() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [analytics, setAnalytics] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAnalytics = async () => {
//       try {
//         // Fetching from the route we just created in session.routes.js
//         const res = await api.get(`/sessions/analytics/${id}`);
//         setAnalytics(res.data);
//       } catch (error) {
//         console.error("Error fetching analytics:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnalytics();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-gray-50 text-xl font-semibold text-blue-900">
//         Loading your session insights...
//       </div>
//     );
//   }

//   if (!analytics) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
//         <p className="text-xl text-red-600 mb-4">Failed to load analytics data.</p>
//         <button onClick={() => navigate("/")} className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">
//           Go Home
//         </button>
//       </div>
//     );
//   }

//   const totalInteractions = analytics.likes + analytics.aha + analytics.confused + analytics.applause;

//   return (
//     <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      
//       {/* HEADER */}
//       <div className="w-full max-w-5xl flex justify-between items-center bg-white p-6 rounded-xl shadow-sm mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Post-Session Analytics</h1>
//           <p className="text-gray-500 mt-1 font-medium">Session ID: {id}</p>
//         </div>
//         <button 
//           onClick={() => navigate("/")} 
//           className="px-6 py-3 bg-gray-900 text-white rounded-lg shadow hover:bg-gray-800 transition font-medium"
//         >
//           Return to Dashboard
//         </button>
//       </div>

//       {/* DASHBOARD GRID */}
//       <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
//         {/* LIKES CARD */}
//         <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center transform transition hover:-translate-y-1 hover:shadow-md">
//           <div className="text-6xl mb-4">👍</div>
//           <h2 className="text-gray-500 font-bold uppercase tracking-wide text-sm">Approval</h2>
//           <p className="text-4xl font-extrabold text-gray-800 mt-2">{analytics.likes}</p>
//         </div>

//         {/* AHA MOMENTS CARD */}
//         <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center transform transition hover:-translate-y-1 hover:shadow-md">
//           <div className="text-6xl mb-4">💡</div>
//           <h2 className="text-gray-500 font-bold uppercase tracking-wide text-sm">Aha! Moments</h2>
//           <p className="text-4xl font-extrabold text-gray-800 mt-2">{analytics.aha}</p>
//         </div>

//         {/* APPLAUSE CARD */}
//         <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center transform transition hover:-translate-y-1 hover:shadow-md">
//           <div className="text-6xl mb-4">👏</div>
//           <h2 className="text-gray-500 font-bold uppercase tracking-wide text-sm">Applause</h2>
//           <p className="text-4xl font-extrabold text-gray-800 mt-2">{analytics.applause}</p>
//         </div>

//         {/* CONFUSED CARD */}
//         <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center transform transition hover:-translate-y-1 hover:shadow-md">
//           <div className="text-6xl mb-4">😕</div>
//           <h2 className="text-gray-500 font-bold uppercase tracking-wide text-sm">Confusion</h2>
//           <p className="text-4xl font-extrabold text-red-600 mt-2">{analytics.confused}</p>
//         </div>

//       </div>

//       {/* SUMMARY SECTION */}
//       <div className="w-full max-w-5xl mt-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
//         <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">Engagement Summary</h2>
//         <div className="flex flex-col md:flex-row gap-8 items-start">
//           <div className="flex-1">
//             <p className="text-gray-700 text-lg">
//               Your audience generated a total of <span className="font-bold text-blue-600 text-xl">{totalInteractions}</span> real-time interactions during this presentation.
//             </p>
            
//             {/* AI Insight logic */}
//             {totalInteractions === 0 && (
//               <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded text-gray-600">
//                 <strong>📊 Insight:</strong> No reactions were recorded during this session.
//               </div>
//             )}
//             {analytics.confused > 0 && analytics.confused > (totalInteractions * 0.3) && (
//               <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-800">
//                 <strong>⚠️ Alert:</strong> Over 30% of your audience reactions indicated confusion. Consider reviewing the Q&A transcript or simplifying the material for future sessions!
//               </div>
//             )}
//             {analytics.likes + analytics.applause + analytics.aha > (totalInteractions * 0.7) && totalInteractions > 0 && (
//               <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded text-green-800">
//                 <strong>🌟 Great Job:</strong> Your audience was highly engaged and responded very positively to your material!
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// }

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api"; // Adjust this path if your api service is located elsewhere

export default function Analytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetching from the route we created in session.routes.js
        const res = await api.get(`/sessions/analytics/${id}`);
        setAnalytics(res.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 text-xl font-semibold text-blue-900">
        Loading your session insights...
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-xl text-red-600 mb-4">Failed to load analytics data.</p>
        <button onClick={() => navigate("/")} className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">
          Go Home
        </button>
      </div>
    );
  }

  const totalInteractions = analytics.likes + analytics.aha + analytics.confused + analytics.applause;

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      
      {/* HEADER */}
      <div className="w-full max-w-5xl flex justify-between items-center bg-white p-6 rounded-xl shadow-sm mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Post-Session Analytics</h1>
          <p className="text-gray-500 mt-1 font-medium">Session ID: {id}</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate(`/dashboard/${id}`)} 
            className="px-6 py-3 bg-blue-100 text-blue-900 rounded-lg shadow-sm hover:bg-blue-200 transition font-medium"
          >
            View Dashboard
          </button>
          <button 
            onClick={() => navigate("/")} 
            className="px-6 py-3 bg-gray-900 text-white rounded-lg shadow hover:bg-gray-800 transition font-medium"
          >
            Exit to Home
          </button>
        </div>
      </div>

      {/* DASHBOARD GRID */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* LIKES CARD */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center transform transition hover:-translate-y-1 hover:shadow-md">
          <div className="text-6xl mb-4">👍</div>
          <h2 className="text-gray-500 font-bold uppercase tracking-wide text-sm">Approval</h2>
          <p className="text-4xl font-extrabold text-gray-800 mt-2">{analytics.likes}</p>
        </div>

        {/* AHA MOMENTS CARD */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center transform transition hover:-translate-y-1 hover:shadow-md">
          <div className="text-6xl mb-4">💡</div>
          <h2 className="text-gray-500 font-bold uppercase tracking-wide text-sm">Aha! Moments</h2>
          <p className="text-4xl font-extrabold text-gray-800 mt-2">{analytics.aha}</p>
        </div>

        {/* APPLAUSE CARD */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center transform transition hover:-translate-y-1 hover:shadow-md">
          <div className="text-6xl mb-4">👏</div>
          <h2 className="text-gray-500 font-bold uppercase tracking-wide text-sm">Applause</h2>
          <p className="text-4xl font-extrabold text-gray-800 mt-2">{analytics.applause}</p>
        </div>

        {/* CONFUSED CARD */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center transform transition hover:-translate-y-1 hover:shadow-md">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-gray-500 font-bold uppercase tracking-wide text-sm">Confusion</h2>
          <p className="text-4xl font-extrabold text-red-600 mt-2">{analytics.confused}</p>
        </div>

      </div>

      {/* SUMMARY SECTION */}
      <div className="w-full max-w-5xl mt-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">Engagement Summary</h2>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <p className="text-gray-700 text-lg">
              Your audience generated a total of <span className="font-bold text-blue-600 text-xl">{totalInteractions}</span> real-time interactions during this presentation.
            </p>
            
            {totalInteractions === 0 && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded text-gray-600">
                <strong>📊 Insight:</strong> No reactions were recorded during this session.
              </div>
            )}
            {analytics.confused > 0 && analytics.confused > (totalInteractions * 0.3) && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-800">
                <strong>⚠️ Alert:</strong> Over 30% of your audience reactions indicated confusion. Consider reviewing the Q&A transcript or simplifying the material for future sessions!
              </div>
            )}
            {analytics.likes + analytics.applause + analytics.aha > (totalInteractions * 0.7) && totalInteractions > 0 && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded text-green-800">
                <strong>🌟 Great Job:</strong> Your audience was highly engaged and responded very positively to your material!
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}