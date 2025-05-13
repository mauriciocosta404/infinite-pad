import React from 'react';
import { Link } from 'react-router-dom';
import { Piano, Clock, Github, Linkedin, Mail } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4">
      <div className="animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          Welcome to WorshipPad
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl">
          Enhance your worship experience with our infinite piano pad and precise metronome tools.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <Link
          to="/ambient-pad"
          className="flex flex-col items-center p-8 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all transform hover:scale-105"
        >
          <Piano className="w-16 h-16 text-purple-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Ambient Pad</h2>
          <p className="text-gray-400">Create beautiful atmospheric sounds for worship</p>
        </Link>
        
        <Link
          to="/metronome"
          className="flex flex-col items-center p-8 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all transform hover:scale-105"
        >
          <Clock className="w-16 h-16 text-purple-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Metronome</h2>
          <p className="text-gray-400">Keep perfect time with our digital metronome</p>
        </Link>
      </div>

      <div className="w-full max-w-4xl bg-gray-800 rounded-lg p-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-48 h-48 rounded-full overflow-hidden flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e"
              alt="Developer Portrait"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-bold mb-4">About the Developer</h2>
            <p className="text-gray-300 mb-4">
              Hi! I'm a passionate worship leader and developer who created WorshipPad to serve the worship community. 
              With years of experience in both music ministry and software development, I understand the unique needs 
              of worship teams and aim to provide tools that enhance the worship experience.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}