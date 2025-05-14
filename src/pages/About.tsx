import { Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function About() {
  const { t } = useLanguage();
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">{t('about.title')}</h1>
      
      <div className="bg-white shadow dark:bg-gray-800 rounded-lg p-8 mb-8">
        <div className="flex justify-center mb-6">
          <Heart className="w-16 h-16 text-purple-400" />
        </div>
        <p className=" text-gray-500 dark:text-gray-300 mb-6">
          {t('about.description1')}
        </p>
        <p className="text-gray-500 dark:text-gray-300">
          {t('about.description2')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-2xl font-semibold mb-4">{t('about.featuresTitle')}</h2>
          <ul className="space-y-2 text-gray-500 dark:text-gray-300">
          <li>• {t('about.features.infinitePad')}</li>
            <li>• {t('about.features.soundOptions')}</li>
            <li>• {t('about.features.metronome')}</li>
            <li>• {t('about.features.tapTempo')}</li>
            <li>• {t('about.features.darkMode')}</li>
          </ul>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-2xl font-semibold mb-4">{t('about.usageTitle')}</h2>
          <ul className="space-y-2 text-gray-500 dark:text-gray-300">
          <li>• {t('about.usage.selectSound')}</li>
            <li>• {t('about.usage.adjust')}</li>
            <li>• {t('about.usage.useMetronome')}</li>
            <li>• {t('about.usage.savePresets')}</li>
            <li>• {t('about.usage.perfectLive')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
