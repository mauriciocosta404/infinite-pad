import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import AmbientPad from './pages/AmbientPad';
import Metronome from './pages/Metronome';
import SplashScreen from './components/SplashScreen';

function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  return (
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            {isSplashVisible ? (
              <SplashScreen onFinish={() => setIsSplashVisible(false)} />
            ) : (
              <div className="min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/ambient-pad" element={<AmbientPad />} />
                    <Route path="/metronome" element={<Metronome />} />
                  </Routes>
                </main>
              </div>
            )}
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
  );
}

export default App;