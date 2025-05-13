import React from 'react';
import { Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">About WorshipPad</h1>
      
      <div className="bg-gray-800 rounded-lg p-8 mb-8">
        <div className="flex justify-center mb-6">
          <Heart className="w-16 h-16 text-purple-400" />
        </div>
        <p className="text-gray-300 mb-6">
          WorshipPad was created with love to serve the worship community. Our goal is to provide
          high-quality tools that enhance the worship experience and help teams lead with excellence.
        </p>
        <p className="text-gray-300">
          Whether you're leading worship in a large congregation or practicing at home, our ambient pad
          and metronome tools are designed to support your ministry.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="space-y-2 text-gray-300">
            <li>• Infinite Piano Pad</li>
            <li>• Multiple Sound Options</li>
            <li>• Professional Metronome</li>
            <li>• Tempo Tap Function</li>
            <li>• Dark Mode Interface</li>
          </ul>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">How to Use</h2>
          <ul className="space-y-2 text-gray-300">
            <li>• Select your desired pad sound</li>
            <li>• Adjust volume and effects</li>
            <li>• Use metronome for timing</li>
            <li>• Save your favorite presets</li>
            <li>• Perfect for live worship</li>
          </ul>
        </div>
      </div>
    </div>
  );
}