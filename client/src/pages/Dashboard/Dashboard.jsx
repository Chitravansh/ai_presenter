export default function Dashboard() {
  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">Session Analytics</h2>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Questions</p>
          <h3 className="text-2xl font-bold">0</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Engagement</p>
          <h3 className="text-2xl font-bold">0%</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Sentiment</p>
          <h3 className="text-2xl font-bold">Neutral</h3>
        </div>

      </div>

    </div>
  );
}
