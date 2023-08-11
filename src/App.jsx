import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Registry, RecentRemoval, CertificatePage, PurchaseScreen, Map, NotFound } from "./components/routes";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Registry />} />
        <Route path="/recent-removals" element={<RecentRemoval />} />
        <Route path="/certificate/:id" element={<CertificatePage />} />
        <Route path="/registry" element={<Registry />} />
        <Route path="/purchase" element={<PurchaseScreen />} />
        <Route path="/map" element={<Map />} />
        <Route element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
