import { useState } from "react";
import "./App.css";
import NavigationBar from "./components/NavigationBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PickPage from "./pages/PickPage";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <BrowserRouter>
      <NavigationBar onSearch={setSearchQuery} />

      <Routes>
        <Route path="/" element={<PickPage searchQuery={searchQuery} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
