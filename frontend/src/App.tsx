import { useState } from "react";
import "./App.css";
import NavigationBar from "./components/NavigationBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ExplorePage from "./pages/ExplorePage";
import PlanPage from "./pages/PlanPage";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <BrowserRouter>
      <NavigationBar onSearch={setSearchQuery} />

      <Routes>
        <Route path="/" element={<ExplorePage searchQuery={searchQuery} />} />
        <Route path="/plan" element={<PlanPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
