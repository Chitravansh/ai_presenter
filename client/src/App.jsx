// import AppRoutes from "./routes/AppRoutes";

// function App() {
//   return <AppRoutes />;
// //  return (
// //     <div className="flex items-center justify-center h-screen bg-black">
// //       <h1 className="text-5xl font-bold text-red-500">
// //         Tailwind is Working 🚀
// //       </h1>
// //     </div>
// //   );
// }

// export default App;

import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <AppRoutes />
    </div>
  );
}
