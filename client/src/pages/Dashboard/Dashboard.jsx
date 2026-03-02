// export default function Dashboard() {
//   return (
//     <div className="p-6">

//       <h2 className="text-2xl font-bold mb-6">Session Analytics</h2>
// {/* 
//       <div className="grid grid-cols-3 gap-6">

//         <div className="bg-white p-6 rounded-xl shadow">
//           <p className="text-gray-500">Total Questions</p>
//           <h3 className="text-2xl font-bold">0</h3>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow">
//           <p className="text-gray-500">Engagement</p>
//           <h3 className="text-2xl font-bold">0%</h3>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow">
//           <p className="text-gray-500">Sentiment</p>
//           <h3 className="text-2xl font-bold">Neutral</h3>
//         </div>

//       </div> */}

//       {/* HIGHLIGHT METRICS */}
//       <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        
//         {/* Sentiment Card */}
//         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm border border-blue-100 flex items-center justify-between">
//           <div>
//             <h2 className="text-blue-800 font-bold uppercase tracking-wide text-sm mb-1">Overall Sentiment</h2>
//             <p className="text-3xl font-extrabold text-blue-900">{analytics.overallSentiment}</p>
//           </div>
//           <div className="text-5xl opacity-80">📊</div>
//         </div>

//         {/* Questions Card */}
//         <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl shadow-sm border border-green-100 flex items-center justify-between">
//           <div>
//             <h2 className="text-green-800 font-bold uppercase tracking-wide text-sm mb-1">Total Questions Asked</h2>
//             <p className="text-3xl font-extrabold text-green-900">{analytics.questionsAsked}</p>
//           </div>
//           <div className="text-5xl opacity-80">🙋</div>
//         </div>

//       </div>

//     </div>
//   );
// }

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api"; // Make sure this path matches your project!

export default function Dashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 1. Setup state to hold the data
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Fetch the data from your backend when the page loads
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
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

  // 3. Show a loading screen while waiting for the database
  if (loading) {
    return <div className="p-6 text-xl font-semibold">Loading your session insights...</div>;
  }

  // 4. Handle errors if no data is found
  if (!analytics) {
    return <div className="p-6 text-xl text-red-600">Failed to load analytics data.</div>;
  }

  // 5. Your beautiful UI
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 max-w-5xl">
        <h2 className="text-2xl font-bold">Session Analytics (ID: {id})</h2>
        <button 
          onClick={() => navigate("/")} 
          className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
        >
          Exit to Home
        </button>
      </div>

      {/* HIGHLIGHT METRICS */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        
        {/* Sentiment Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm border border-blue-100 flex items-center justify-between">
          <div>
            <h2 className="text-blue-800 font-bold uppercase tracking-wide text-sm mb-1">Overall Sentiment</h2>
            <p className="text-3xl font-extrabold text-blue-900">{analytics.overallSentiment}</p>
          </div>
          <div className="text-5xl opacity-80">📊</div>
        </div>

        {/* Questions Card */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl shadow-sm border border-green-100 flex items-center justify-between">
          <div>
            <h2 className="text-green-800 font-bold uppercase tracking-wide text-sm mb-1">Total Questions Asked</h2>
            <p className="text-3xl font-extrabold text-green-900">{analytics.questionsAsked}</p>
          </div>
          <div className="text-5xl opacity-80">🙋</div>
        </div>

      </div>
      
      {/* You can add your emoji breakdown cards here next! */}
    </div>
  );
}