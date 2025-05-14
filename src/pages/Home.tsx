import { Link } from 'react-router-dom';
import { Piano, Clock, Github, Linkedin, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();  

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4">
      <div className="animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          {t('pad.welcome.title')}
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl">
        {t('pad.welcome.desc')}
        </p>
      </div>
      
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <Link
          to="/ambient-pad"
          className="flex flex-col items-center p-8 shadow bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all transform hover:scale-105"
        >
          <Piano className="w-16 h-16 text-purple-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Ambient Pad</h2>
          <p className="text-gray-400">{t('pad.ambientcard.desc')}</p>
        </Link>
        
        <Link
          to="/metronome"
          className="flex flex-col items-center p-8 shadow  bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all transform hover:scale-105"
        >
          <Clock className="w-16 h-16 text-purple-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">{t('pad.metronomecard.title')}</h2>
          <p className="text-gray-400">{t('pad.metronomecard.desc')}</p>
        </Link>
      </div>

      <div className="w-full max-w-4xl shadow bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 p-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-48 h-48 rounded-full overflow-hidden flex-shrink-0">
            <img
              src="/assets/img/eu4.png"
              alt="Developer Portrait"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-bold mb-4">{t('pad.me.title')}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
            {t('pad.me.desc')}
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/mauriciocosta404" className="text-purple-400 hover:text-purple-300 transition-colors">
                <Github className="w-6 h-6" />
              </a>
              <a href="www.linkedin.com/in/mauricio-costa-216bb1235" className="text-purple-400 hover:text-purple-300 transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="mailto:mc611641@gmail.com" className="text-purple-400 hover:text-purple-300 transition-colors">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}