import React from 'react';
import { View } from '../App';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  viewName: View;
  icon: React.ReactNode;
  text: string;
  activeView: View;
  setActiveView: (view: View) => void;
}> = ({ viewName, icon, text, activeView, setActiveView }) => (
  <button
    onClick={() => setActiveView(viewName)}
    className={`flex items-center w-full px-4 py-3 text-right transition-colors duration-200 rounded-lg ${
      activeView === viewName
        ? 'bg-blue-600 text-white'
        : 'text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'
    }`}
  >
    {icon}
    <span className="mr-4 font-medium">{text}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 p-6 flex flex-col justify-between shadow-lg no-print">
      <div>
        <div className="flex items-center mb-10">
           <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
           <h1 className="text-xl font-bold mr-3 text-gray-800 dark:text-white">مؤشرات التنمية المحلية</h1>
        </div>
        <nav className="space-y-3">
          <NavItem
            viewName="dashboard"
            icon={<DashboardIcon />}
            text="لوحة المعلومات"
            activeView={activeView}
            setActiveView={setActiveView}
          />
          <NavItem
            viewName="reports"
            icon={<ReportsIcon />}
            text="التقارير التنموية"
            activeView={activeView}
            setActiveView={setActiveView}
          />
          <NavItem
            viewName="womens_development"
            icon={<WomensDevIcon />}
            text="تنمية المرأة"
            activeView={activeView}
            setActiveView={setActiveView}
          />
           <NavItem
            viewName="education"
            icon={<EducationIcon />}
            text="التعليم"
            activeView={activeView}
            setActiveView={setActiveView}
          />
           <NavItem
            viewName="health"
            icon={<HealthIcon />}
            text="الصحة"
            activeView={activeView}
            setActiveView={setActiveView}
          />
           <NavItem
            viewName="livestock"
            icon={<LivestockIcon />}
            text="الثروة الحيوانية"
            activeView={activeView}
            setActiveView={setActiveView}
          />
           <NavItem
            viewName="income"
            icon={<IncomeIcon />}
            text="دخل الأسرة"
            activeView={activeView}
            setActiveView={setActiveView}
          />
          <NavItem
            viewName="environment"
            icon={<EnvironmentIcon />}
            text="البيئة"
            activeView={activeView}
            setActiveView={setActiveView}
          />
          <NavItem
            viewName="chatbot"
            icon={<ChatIcon />}
            text="المساعد الذكي"
            activeView={activeView}
            setActiveView={setActiveView}
          />
        </nav>
      </div>
       <div className="text-center text-xs text-gray-400 dark:text-gray-500">
        <p>&copy; 2024 تحليلات رؤية 2033</p>
      </div>
    </aside>
  );
};

const DashboardIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
);
const WomensDevIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.176-5.97M15 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
);
const EducationIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
);
const HealthIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
);
const LivestockIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12l-4-4-4 4m4 4v8m-4-4h8"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.5 10.5C6 8.5 8.5 7 12 7s6 1.5 7.5 3.5"></path></svg>
);
const IncomeIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
);
const EnvironmentIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
)
const ReportsIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
);
const ChatIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
);


export default Sidebar;