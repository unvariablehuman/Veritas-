import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import KepoAI from './components/KepoAI';
import Home from './pages/Home';
import Map from './pages/Map';
import Quiz from './pages/Quiz';
import Library from './pages/Library';
import Dashboard from './pages/Dashboard';
import * as KepoState from './utils/state';

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [gameState, setGameState] = useState(() => KepoState.load());

  const [lightMode, setLightMode] = useState(() => {
    return localStorage.getItem("theme") === "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("light", lightMode);
    localStorage.setItem("theme", lightMode ? "light" : "dark");
  }, [lightMode]);

  const handleNavigate = (page, arg = null) => {
    setActivePage(page);
    if (page === "quiz") {
      setSelectedLevelId(arg); // levelId
    } else if (page === "library") {
      setSelectedCategory(arg); // categoryId
    }
  };

  const handleStateChange = (newState) => {
    setGameState(newState);
  };

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <Home onNavigate={handleNavigate} />;
      case "map":
        return <Map onNavigate={handleNavigate} state={gameState} />;
      case "quiz":
        return (
          <Quiz
            levelId={selectedLevelId}
            onNavigate={handleNavigate}
            state={gameState}
            onStateChange={handleStateChange}
          />
        );
      case "library":
        return <Library initialCat={selectedCategory} />;
      case "dashboard":
        return (
          <Dashboard
            state={gameState}
            onStateChange={handleStateChange}
            onNavigate={handleNavigate}
          />
        );
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      <Navbar activePage={activePage} onNavigate={handleNavigate} xp={gameState.xp} lightMode={lightMode} setLightMode={setLightMode} />
      <main>
        {renderPage()}
      </main>
      <KepoAI />
    </>
  );
}
