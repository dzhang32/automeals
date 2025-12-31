import { useState } from "react";
import "./App.css";
import NavigationBar from "./components/NavigationBar";
import { BrowserRouter } from "react-router-dom";
import PlanPage from "./pages/PlanPage";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <BrowserRouter>
      <NavigationBar onSearch={setSearchQuery} />
      <PlanPage searchQuery={searchQuery} />
    </BrowserRouter>
  );
}

export default App;
