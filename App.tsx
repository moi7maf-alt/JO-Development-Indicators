import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import WomensDevelopment from './components/WomensDevelopment';
import Education from './components/Education';
import Health from './components/Health';
import Livestock from './components/Livestock';
import Income from './components/Income';
import Environment from './components/Environment';
import Chatbot from './components/Chatbot';
import Reports from './components/Reports';

export type View = 'dashboard' | 'womens_development' | 'education' | 'health' | 'livestock' | 'income' | 'environment' | 'chatbot' | 'reports';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'womens_development':
        return <WomensDevelopment />;
      case 'education':
        return <Education />;
      case 'health':
        return <Health />;
      case 'livestock':
        return <Livestock />;
      case 'income':
        return <Income />;
      case 'environment':
          return <Environment />;
      case 'chatbot':
        return <Chatbot />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;