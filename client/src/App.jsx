import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import AssessmentPage from "./pages/AssessmentPage";
import ResultsPage from "./pages/ResultsPage";
import SkillExplorerPage from "./pages/SkillExplorerPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />

        <Route path="/assessment" element={<AssessmentPage />} />

        <Route path="/results" element={<ResultsPage />} />

        <Route path="/explore" element={<SkillExplorerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
