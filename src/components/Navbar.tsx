import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Music, Info, Piano, Clock, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  
  const isActive = (path: string) => {
    return location.pathname === path 
      ? theme === 'dark' 
        ? 'text-dark-primary' 
        : 'text-light-primary'
      : `${theme === 'dark' ? 'text-dark-muted hover:text-dark-primary' : 'text-light-muted hover:text-light-primary'}`;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsLangMenuOpen(false);
  };

  const toggleLangMenu = () => {
    setIsLangMenuOpen(!isLangMenuOpen);
  };

  const getMobileMenuItemClass = (path: string) => `
    block px-4 py-2 rounded-lg transition-colors
    ${location.pathname === path 
      ? theme === 'dark' 
        ? 'bg-dark-primary/10 text-dark-primary' 
        : 'bg-light-primary/10 text-light-primary'
      : theme === 'dark' 
        ? 'text-dark-text hover:bg-dark-muted/20' 
        : 'text-light-text hover:bg-light-muted/20'
    }
  `;

  return (
    <nav className={`${
      theme === 'dark' 
        ? 'bg-dark-surface border-dark-muted' 
        : 'bg-light-surface border-light-muted shadow-sm'
    } shadow sticky py-2 top-0 z-50`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img src='/assets/logo.png' width={50} className={`${theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'}`} />
            <span className={`text-xl font-bold ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
              WorshipPad
            </span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className={`flex items-center space-x-1 ${isActive('/')}`}>
              <Music className="w-5 h-5" />
              <span>{t('nav.home')}</span>
            </Link>
            <Link to="/ambient-pad" className={`flex items-center space-x-1 ${isActive('/ambient-pad')}`}>
              <Piano className="w-5 h-5" />
              <span>{t('nav.ambientPad')}</span>
            </Link>
            <Link to="/metronome" className={`flex items-center space-x-1 ${isActive('/metronome')}`}>
              <Clock className="w-5 h-5" />
              <span>{t('nav.metronome')}</span>
            </Link>
            <Link to="/about" className={`flex items-center space-x-1 ${isActive('/about')}`}>
              <Info className="w-5 h-5" />
              <span>{t('nav.about')}</span>
            </Link>
          </div>

          {/* Theme and Language Controls */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-dark-muted/20 text-dark-text'
                  : 'hover:bg-light-muted/20 text-light-text'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="relative">
              <button
                onClick={toggleLangMenu}
                className={`px-3 py-1.5 rounded-full transition-colors flex items-center space-x-1 ${
                  theme === 'dark'
                    ? 'hover:bg-dark-muted/20 text-dark-text'
                    : 'hover:bg-light-muted/20 text-light-text'
                }`}
              >
                <span className="font-medium">{language.toUpperCase()}</span>
              </button>

              {isLangMenuOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${
                  theme === 'dark' ? 'bg-dark-surface' : 'bg-light-surface'
                } ring-1 ring-black ring-opacity-5`}>
                  <div className="py-1">
                    <button
                      onClick={() => { setLanguage('en'); setIsLangMenuOpen(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        language === 'en'
                          ? theme === 'dark' ? 'bg-dark-primary/10 text-dark-primary' : 'bg-light-primary/10 text-light-primary'
                          : theme === 'dark' ? 'text-dark-text hover:bg-dark-muted/10' : 'text-light-text hover:bg-light-muted/10'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => { setLanguage('pt'); setIsLangMenuOpen(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        language === 'pt'
                          ? theme === 'dark' ? 'bg-dark-primary/10 text-dark-primary' : 'bg-light-primary/10 text-light-primary'
                          : theme === 'dark' ? 'text-dark-text hover:bg-dark-muted/10' : 'text-light-text hover:bg-light-muted/10'
                      }`}
                    >
                      Português
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-dark-muted/20 text-dark-text'
                : 'hover:bg-light-muted/20 text-light-text'
            }`}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? 'max-h-96 opacity-100'
              : 'max-h-0 opacity-0 pointer-events-none'
          } overflow-hidden`}
        >
          <div className="py-4 space-y-2">
            <Link
              to="/"
              className={getMobileMenuItemClass('/')}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <Music className="w-5 h-5" />
                <span>{t('nav.home')}</span>
              </div>
            </Link>

            <Link
              to="/ambient-pad"
              className={getMobileMenuItemClass('/ambient-pad')}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <Piano className="w-5 h-5" />
                <span>{t('nav.ambientPad')}</span>
              </div>
            </Link>

            <Link
              to="/metronome"
              className={getMobileMenuItemClass('/metronome')}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{t('nav.metronome')}</span>
              </div>
            </Link>

            <Link
              to="/about"
              className={getMobileMenuItemClass('/about')}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <Info className="w-5 h-5" />
                <span>{t('nav.about')}</span>
              </div>
            </Link>

            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

            <div className="flex items-center justify-between px-4 py-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-dark-muted/20 text-dark-text'
                    : 'hover:bg-light-muted/20 text-light-text'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => { setLanguage('en'); setIsMenuOpen(false); }}
                  className={`px-3 py-1.5 rounded-full transition-colors ${
                    language === 'en'
                      ? theme === 'dark' ? 'bg-dark-primary/10 text-dark-primary' : 'bg-light-primary/10 text-light-primary'
                      : theme === 'dark' ? 'text-dark-text hover:bg-dark-muted/10' : 'text-light-text hover:bg-light-muted/10'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => { setLanguage('pt'); setIsMenuOpen(false); }}
                  className={`px-3 py-1.5 rounded-full transition-colors ${
                    language === 'pt'
                      ? theme === 'dark' ? 'bg-dark-primary/10 text-dark-primary' : 'bg-light-primary/10 text-light-primary'
                      : theme === 'dark' ? 'text-dark-text hover:bg-dark-muted/10' : 'text-light-text hover:bg-light-muted/10'
                  }`}
                >
                  PT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}