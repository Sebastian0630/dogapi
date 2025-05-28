
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DogList from "./DogList";
import DogDetail from "./DogDetail";

export default function DogApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DogList />} />
        <Route path="/dog/:breedName" element={<DogDetail />} />
      </Routes>
    </Router>
  );
}