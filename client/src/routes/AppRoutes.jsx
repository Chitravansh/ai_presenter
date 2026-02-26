import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Presenter from "../pages/Presenter/Presenter";
import Audience from "../pages/Audience/Audience";
import Dashboard from "../pages/Dashboard/Dashboard";
import Navbar from "../components/Navbar";   // ✅ Correct

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/presenter/:id" element={<Presenter />} />
        <Route path="/audience/:id" element={<Audience />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}