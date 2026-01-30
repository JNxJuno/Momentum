import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Calendar, CalendarDays, CheckSquare, Settings, Plus, 
  ChevronRight, ChevronLeft, Bell, Moon, Sun, Layout, 
  CheckCircle, Trash2, Clock, Sparkles, 
  Palette, User, LayoutTemplate, Wand2, X, ArrowRight
} from 'lucide-react';

// --- ICONS ---
const AppIcon = () => (
    <div className="w-10 h-10 rounded-xl shadow-lg shrink-0 relative overflow-hidden">
        {/* Fallback Background (Visible if image fails or loading) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-400 to-blue-400 flex items-center justify-center text-white font-bold text-xs">
            M
        </div>
        {/* App Icon Image - Hides itself on error */}
        <img 
            src="icon.png" 
            alt="App" 
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => e.currentTarget.style.display = 'none'}
        />
    </div>
);

// --- THEME DEFINITIONS ---
const themes = {
    dream: { 
        name: "Pastel Dream",
        colors: ["#FFB7CE", "#A2E4D8", "#A2D2FF"], 
        primary: "bg-[#FFB7CE]", text: "text-[#FFB7CE]", border: "border-[#FFB7CE]", 
        bgGradient: "bg-gradient-to-br from-[#FFF0F5] to-[#E0F7FA]",
        card: "from-[#FFB7CE] to-[#A2E4D8]"
    },
    ocean: { 
        name: "Ocean Breeze",
        colors: ["#7CDBC8", "#A2D2FF", "#B5EAD7"], 
        primary: "bg-[#7CDBC8]", text: "text-[#7CDBC8]", border: "border-[#7CDBC8]",
        bgGradient: "bg-gradient-to-br from-[#E0F7FA] to-[#F0F8FF]",
        card: "from-[#7CDBC8] to-[#A2D2FF]"
    },
    lavender: { 
        name: "Lavender Blush",
        colors: ["#E0BBE4", "#FFB7CE", "#D291BC"], 
        primary: "bg-[#E0BBE4]", text: "text-[#E0BBE4]", border: "border-[#E0BBE4]",
        bgGradient: "bg-gradient-to-br from-[#F3E5F5] to-[#FFF0F5]",
        card: "from-[#E0BBE4] to-[#FFB7CE]"
    },
    sunset: { 
        name: "Sunset Glow",
        colors: ["#FF9AA2", "#FFB7B2", "#FFDAC1"], 
        primary: "bg-[#FF9AA2]", text: "text-[#FF9AA2]", border: "border-[#FF9AA2]",
        bgGradient: "bg-gradient-to-br from-[#FFF0F5] to-[#FFF8E1]",
        card: "from-[#FF9AA2] to-[#FFDAC1]"
    },
    mint: { 
        name: "Mint Fresh",
        colors: ["#B5EAD7", "#7CDBC8", "#C7F9CC"], 
        primary: "bg-[#B5EAD7]", text: "text-[#88D8B0]", border: "border-[#B5EAD7]",
        bgGradient: "bg-gradient-to-br from-[#E0F2F1] to-[#F1F8E9]",
        card: "from-[#B5EAD7] to-[#C7F9CC]"
    }
};

const MomentumApp = () => {
  // --- DATA HELPER ---
  const loadData = (key, def) => {
      try {
          const saved = localStorage.getItem(key);
          if (!saved || saved === "undefined") return def;
          return JSON.parse(saved);
      } catch (e) {
          console.error("Load error for " + key, e);
          return def;
      }
  };

  // --- STATE ---
  const [activeTab, setActiveTab] = useState('home');
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('theme') || 'dream');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('mode') === 'dark');
  const [appearanceMode, setAppearanceMode] = useState(() => localStorage.getItem('appearanceMode') || 'light');
  
  // Onboarding State
  const [isSetupComplete, setIsSetupComplete] = useState(() => localStorage.getItem('setupComplete') === 'true');
  const [onboardingName, setOnboardingName] = useState("");

  // Settings
  const [appSettings, setAppSettings] = useState(() => loadData('settings', {
      userName: "User",
      greeting: "Good morning",
      focusDuration: 25,
      showStats: true,
      showQuote: true,
      designStyle: 'standard', 
      fontStyle: 'sans',
      homeOrder: ['stats', 'events', 'tasks'],
  }));

  const [tasks, setTasks] = useState(() => loadData('tasks', []));
  const [events, setEvents] = useState(() => loadData('events', []));

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // UI State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState('task'); 
  const [inputValue, setInputValue] = useState(""); 
  const [motivationalQuote, setMotivationalQuote] = useState("Your day belongs to you.");
  
  // Focus Timer
  const [focusActive, setFocusActive] = useState(false);
  const [focusTime, setFocusTime] = useState(appSettings.focusDuration * 60);

  // --- PERSISTENCE ---
  useEffect(() => { localStorage.setItem('tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('settings', JSON.stringify(appSettings)); }, [appSettings]);
  useEffect(() => { localStorage.setItem('theme', currentTheme); }, [currentTheme]);
  useEffect(() => { localStorage.setItem('mode', isDarkMode ? 'dark' : 'light'); }, [isDarkMode]);
  useEffect(() => { localStorage.setItem('appearanceMode', appearanceMode); }, [appearanceMode]);
  useEffect(() => { localStorage.setItem('setupComplete', isSetupComplete); }, [isSetupComplete]);

  // --- LOGIC ---
  
  // Dynamic Greeting
  useEffect(() => {
      const hour = new Date().getHours();
      let greet = "Good evening";
      if (hour < 12) greet = "Good morning";
      else if (hour < 18) greet = "Good afternoon";
      
      setAppSettings(prev => ({ ...prev, greeting: greet }));
  }, []);

  useEffect(() => {
    const checkMode = () => {
      if (appearanceMode === 'auto') {
        setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
      } else {
        setIsDarkMode(appearanceMode === 'dark');
      }
    };
    checkMode();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkMode);
    return () => mediaQuery.removeEventListener('change', checkMode);
  }, [appearanceMode]);

  // Timer Logic
  useEffect(() => {
    let interval = null;
    if (focusActive && focusTime > 0) interval = setInterval(() => setFocusTime(t => t - 1), 1000);
    else if (focusTime === 0) setFocusActive(false);
    return () => clearInterval(interval);
  }, [focusActive, focusTime]);

  useEffect(() => { if (!focusActive) setFocusTime(appSettings.focusDuration * 60); }, [appSettings.focusDuration]);

  const getTimeParts = (timeStr) => {
      if (!timeStr) return ["--", "--"];
      const parts = timeStr.split(':');
      return parts.length === 2 ? parts : ["--", "--"];
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Mon start if needed, but US usually starts Sun
    return { daysInMonth, firstDay: firstDay }; // US Standard: Sunday start (0)
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const goToToday = () => { const now = new Date(); setCurrentDate(now); setSelectedDate(now); };
  
  // English Date Formats
  const formatDateHeader = (date) => date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const formatDateFull = (date) => date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
  
  const hasEventOnDay = (day) => {
      const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
      return Array.isArray(events) && events.some(e => e.date === dateStr);
  };
  const getSelectedEvents = () => {
      const dateStr = selectedDate.toISOString().split('T')[0];
      return Array.isArray(events) ? events.filter(e => e.date === dateStr) : [];
  };

  const handleAddItem = () => {
      if (!inputValue.trim()) return;
      if (addType === 'task') {
          setTasks([{id: Date.now(), text: inputValue, done: false}, ...tasks]);
      } else {
          setEvents([{
              id: Date.now(), 
              title: inputValue, 
              time: "12:00", 
              date: selectedDate.toISOString().split('T')[0],
              type: 'manual'
          }, ...events]);
      }
      setInputValue(""); 
      setShowAddModal(false);
  };

  const completeSetup = () => {
      if (onboardingName.trim()) {
          setAppSettings(prev => ({ ...prev, userName: onboardingName }));
          setIsSetupComplete(true);
      }
  };

  const resetData = () => {
      if(confirm("Delete all data and reset app?")) {
          localStorage.clear();
          window.location.reload();
      }
  };

  // --- THEME STYLES ---
  const t = themes[currentTheme] || themes.dream;

  const getDesignStyles = () => {
      const mode = appSettings.designStyle || 'standard';
      const font = appSettings.fontStyle === 'serif' ? 'font-serif' : appSettings.fontStyle === 'mono' ? 'font-mono' : 'font-sans';
      
      if (mode === 'minimal') {
          return {
              bg: isDarkMode ? "bg-black" : "bg-white",
              textMain: isDarkMode ? "text-white" : "text-black",
              textSec: isDarkMode ? "text-gray-400" : "text-gray-600",
              card: isDarkMode ? "bg-black border border-white" : "bg-white border-2 border-black",
              nav: isDarkMode ? "bg-black border-t border-white" : "bg-white border-t-2 border-black",
              input: isDarkMode ? "bg-black border border-white text-white" : "bg-white border-2 border-black text-black",
              radius: "rounded-none", 
              shadow: "shadow-none",
              primaryBtn: isDarkMode ? "bg-white text-black" : "bg-black text-white",
              accent: isDarkMode ? "text-white" : "text-black",
              font: font,
              statCard: isDarkMode ? "border border-white" : "border-2 border-black",
              activeNav: isDarkMode ? "bg-white text-black" : "bg-black text-white",
          };
      }

      const isGlass = mode === 'glass';
      const baseBg = isDarkMode ? "bg-[#0a0a0a]" : t.bgGradient;
      
      return {
          bg: baseBg,
          textMain: isDarkMode ? "text-white" : "text-slate-800",
          textSec: isDarkMode ? "text-gray-400" : "text-slate-500",
          card: isDarkMode 
             ? `bg-[#121212] border ${t.border}/30 shadow-lg` 
             : (isGlass ? "bg-white/60 backdrop-blur-2xl border border-white/40 shadow-xl" : "bg-white border border-white/80 shadow-sm"),
          nav: isDarkMode 
             ? "bg-[#111]/80 backdrop-blur-xl border-t border-white/10" 
             : (isGlass ? "bg-white/70 backdrop-blur-xl border-t border-white/50 shadow-2xl" : "bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-xl"),
          input: isDarkMode ? "bg-[#1a1a1a] text-white border-white/10" : "bg-white text-gray-800 border-white shadow-inner",
          radius: "rounded-[2rem]",
          shadow: "shadow-lg",
          primaryBtn: t.primary + " text-white shadow-md hover:scale-105 transition-transform",
          accent: t.text,
          font: font,
          statCard: isDarkMode ? `bg-[#151515] border ${t.border}/30` : "bg-white/80 border border-white",
          iconBg: isDarkMode ? "bg-white/10 text-white" : t.primary + " text-white",
          activeNav: t.text
      };
  };

  const s = getDesignStyles();
  const formatTimeDisplay = (s) => `${Math.floor((s || 0)/60)}:${Math.floor((s || 0)%60).toString().padStart(2,'0')}`;

  // --- ONBOARDING SCREEN ---
  if (!isSetupComplete) {
      return (
          <div className={`w-full h-screen ${s.bg} flex flex-col items-center justify-center p-8 font-sans`}>
              <div className="w-24 h-24 rounded-3xl shadow-xl relative overflow-hidden mb-8 animate-fade-in-up">
                  <div className="absolute inset-0 bg-gradient-to-tr from-pink-400 to-blue-400 flex items-center justify-center text-white font-bold text-4xl">
                      M
                  </div>
                  <img 
                    src="icon.png" 
                    alt="App Logo" 
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => e.currentTarget.style.display = 'none'}
                  />
              </div>
              
              <h1 className={`text-3xl font-bold ${s.textMain} mb-2 text-center animate-fade-in-up`}>Welcome to Momentum</h1>
              <p className={`${s.textSec} text-center mb-8 animate-fade-in-up`}>Your new minimalist productivity companion.</p>
              
              <div className={`w-full max-w-xs space-y-4 animate-scale-in`}>
                  <div className="flex flex-col gap-2">
                      <label className={`text-xs font-bold uppercase tracking-wider ${s.textSec}`}>What should we call you?</label>
                      <input 
                        value={onboardingName}
                        onChange={(e) => setOnboardingName(e.target.value)}
                        placeholder="Your Name"
                        className={`w-full p-4 rounded-2xl outline-none text-center text-lg font-bold ${s.input}`}
                        autoFocus
                      />
                  </div>
                  <button 
                    onClick={completeSetup}
                    disabled={!onboardingName.trim()}
                    className={`w-full py-4 rounded-2xl ${t.primary} text-white font-bold shadow-lg flex items-center justify-center gap-2 ${!onboardingName.trim() ? 'opacity-50' : 'hover:scale-105'} transition-all`}
                  >
                      Get Started <ArrowRight size={20}/>
                  </button>
              </div>
          </div>
      );
  }

  // --- MAIN APP ---

  const renderHomeSection = (sectionId) => {
      if (sectionId === 'stats' && appSettings.showStats) {
          return (
              <div key="stats" className="grid grid-cols-2 gap-3 mb-6 animate-scale-in">
                  <div onClick={()=>setActiveTab('calendar')} className={`${s.radius} p-4 h-32 flex flex-col justify-between ${s.statCard} cursor-pointer hover:opacity-80 transition-all`}>
                      <div className={`${s.iconBg} p-2 rounded-full w-fit mb-1 shadow-sm`}><CalendarDays size={18} strokeWidth={2} className="text-white"/></div>
                      <div><h2 className={`text-2xl font-bold ${s.textMain}`}>{events.length}</h2><p className={`text-[10px] font-bold opacity-60 ${s.textMain} leading-tight`}>Total Events</p></div>
                  </div>
                  <div onClick={()=>setActiveTab('calendar')} className={`${s.radius} p-4 h-32 flex flex-col justify-between ${s.statCard} cursor-pointer hover:opacity-80 transition-all`}>
                      <div className={`${s.iconBg} p-2 rounded-full w-fit mb-1 shadow-sm`}><Clock size={18} strokeWidth={2} className="text-white"/></div>
                      <div><h2 className={`text-2xl font-bold ${s.textMain}`}>0</h2><p className={`text-[10px] font-bold opacity-60 ${s.textMain} leading-tight`}>Today</p></div>
                  </div>
                  <div onClick={()=>setActiveTab('tasks')} className={`${s.radius} p-4 h-32 flex flex-col justify-between ${s.statCard} cursor-pointer hover:opacity-80 transition-all`}>
                      <div className={`${s.iconBg} p-2 rounded-full w-fit mb-1 shadow-sm`}><CheckCircle size={18} strokeWidth={2} className="text-white"/></div>
                      <div><h2 className={`text-2xl font-bold ${s.textMain}`}>{tasks.filter(t=>t.done).length}</h2><p className={`text-[10px] font-bold opacity-60 ${s.textMain} leading-tight`}>Done</p></div>
                  </div>
                  <div onClick={()=>setActiveTab('tasks')} className={`${s.radius} p-4 h-32 flex flex-col justify-between ${s.statCard} cursor-pointer hover:opacity-80 transition-all`}>
                      <div className={`${s.iconBg} p-2 rounded-full w-fit mb-1 shadow-sm`}><Sparkles size={18} strokeWidth={2} className="text-white"/></div>
                      <div><h2 className={`text-2xl font-bold ${s.textMain}`}>{tasks.filter(t=>!t.done).length}</h2><p className={`text-[10px] font-bold opacity-60 ${s.textMain} leading-tight`}>Pending</p></div>
                  </div>
              </div>
          );
      }
      if (sectionId === 'events') {
          return (
              <div key="events" className={`${s.radius} p-5 ${s.card} mb-6`}>
                  <h3 className={`font-bold ${s.textMain} mb-4 flex items-center gap-2`}><Calendar size={18} className={s.accent}/> Upcoming Events</h3>
                  <div className="space-y-3">
                      {events.length === 0 ? <div className={`text-center py-4 opacity-40 text-xs ${s.textSec}`}>No upcoming events</div> : events.slice(0,3).map(e => {
                          const [hh, mm] = getTimeParts(e.time);
                          return (
                              <div key={e.id} className={`flex items-center gap-4 p-3 ${s.radius} border ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-gray-50/50'}`}>
                                  <div className={`w-12 h-12 ${s.radius} ${isDarkMode ? 'bg-white/10 text-white' : t.bgLight + ' ' + t.text} flex flex-col items-center justify-center text-xs font-bold`}>
                                      <span>{hh}</span><span className="opacity-60">{mm}</span>
                                  </div>
                                  <div><div className={`font-bold text-sm ${s.textMain}`}>{e.title}</div><div className="text-[10px] font-bold opacity-60 uppercase">{e.date} • {e.type}</div></div>
                              </div>
                          );
                      })}
                  </div>
              </div>
          );
      }
      if (sectionId === 'tasks') {
          return (
              <div key="tasks" className={`${s.radius} p-5 ${s.card} mb-6`}>
                  <div className="flex justify-between items-center mb-4">
                      <h3 className={`font-bold ${s.textMain} flex items-center gap-2`}><CheckSquare size={18} className={s.accent}/> Tasks</h3>
                      <button onClick={() => {setAddType('task'); setShowAddModal(true)}} className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10 text-white' : t.bgLight + ' ' + t.text}`}><Plus size={16}/></button>
                  </div>
                  <div className="space-y-2">
                      {tasks.length === 0 ? <div className={`text-center py-4 opacity-40 text-xs ${s.textSec}`}>No tasks yet</div> : tasks.slice(0,3).map(tk => (
                          <div key={tk.id} onClick={() => setTasks(tasks.map(x => x.id === tk.id ? {...x, done: !x.done} : x))} className={`flex items-center gap-3 p-3 ${s.radius} transition-all ${tk.done ? 'opacity-40' : ''} ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-white/40'}`}>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${tk.done ? s.accent.replace('text', 'bg') + ' border-transparent' : 'border-gray-300'}`}>{tk.done && <CheckCircle size={12} className="text-white"/>}</div>
                              <span className={`text-sm font-medium ${s.textMain} ${tk.done ? 'line-through' : ''}`}>{tk.text}</span>
                          </div>
                      ))}
                  </div>
              </div>
          );
      }
      return null;
  };

  const HomeView = () => (
      <div className={`pb-32 pt-8 px-4 animate-fade-in ${s.font}`}>
          <div className="mb-6 flex justify-between items-start">
              <div>
                  <h1 className={`text-3xl font-bold ${s.textMain} tracking-tight`}>
                      {appSettings.greeting}, <span className={`${s.accent} opacity-90`}>{appSettings.userName}</span>
                  </h1>
                  {appSettings.showQuote && <p className={`${s.textSec} text-sm mt-1 font-medium`}>{motivationalQuote}</p>}
              </div>
              <AppIcon />
          </div>
          {(appSettings.homeOrder || ['stats', 'events', 'tasks']).map(id => (
               <div key={id} className={id === 'stats' ? '' : 'inline-block w-full md:w-1/2 md:align-top md:px-2'}>
                   {renderHomeSection(id)}
               </div>
          ))}
      </div>
  );

  const CalendarView = () => {
    const { daysInMonth, firstDay } = getDaysInMonth(currentDate);
    const selectedEvents = getSelectedEvents();
    return (
        <div className={`pb-32 pt-6 px-4 animate-fade-in ${s.font}`}>
            <div className={`flex justify-between items-center mb-6`}>
                <h2 className={`text-2xl font-bold ${s.textMain}`}>Calendar</h2>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className={`p-2 rounded-full ${s.card}`}><ChevronLeft size={16} className={s.textMain}/></button>
                    <button onClick={goToToday} className={`px-4 py-1.5 rounded-full ${s.primaryBtn} text-xs font-bold`}>Today</button>
                    <button onClick={nextMonth} className={`p-2 rounded-full ${s.card}`}><ChevronRight size={16} className={s.textMain}/></button>
                </div>
            </div>
            
            <div className={`${s.radius} p-6 ${s.card} mb-6`}>
                <h3 className={`text-lg font-bold ${s.textMain} mb-4 text-center`}>{formatDateHeader(currentDate)}</h3>
                <div className="grid grid-cols-7 gap-2 text-center text-xs mb-4 opacity-60">
                    {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d=><div key={d} className={s.textMain}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-y-4 text-sm font-medium">
                    {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} />)}
                    {[...Array(daysInMonth)].map((_, i) => {
                        const day = i + 1;
                        const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
                        const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth();
                        const hasEvt = hasEventOnDay(day);
                        return (
                            <div key={i} onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))} className={`h-9 w-9 mx-auto flex flex-col items-center justify-center rounded-full cursor-pointer relative ${isSelected ? s.primaryBtn : isToday ? (isDarkMode ? 'bg-white/20' : 'bg-gray-200') + ' ' + s.textMain : s.textMain}`}>
                                {day}
                                {hasEvt && !isSelected && <div className={`w-1 h-1 rounded-full mt-0.5 ${s.primaryBtn.split(' ')[0]}`}></div>}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={`${s.radius} p-6 ${s.card}`}>
                <div className="flex justify-between items-center mb-4">
                     <h3 className={`font-bold ${s.textMain}`}>{formatDateFull(selectedDate)}</h3>
                     <button onClick={() => {setAddType('event'); setShowAddModal(true)}} className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10 text-white' : t.bgLight + ' ' + t.text}`}><Plus size={16}/></button>
                </div>
                <div className="space-y-3">
                    {selectedEvents.length === 0 ? <div className={`text-center py-6 opacity-40 text-sm ${s.textSec}`}>No events</div> : selectedEvents.map(e => {
                        const [hh, mm] = getTimeParts(e.time);
                        return (
                            <div key={e.id} className={`flex items-center gap-4 p-3 rounded-2xl border ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                                 <div className={`w-2 h-10 rounded-full ${s.primaryBtn.split(' ')[0]}`}></div>
                                 <div><div className={`font-bold text-sm ${s.textMain}`}>{e.title}</div><div className={`text-[10px] font-bold opacity-60 ${s.textMain}`}>{e.time}</div></div>
                                 <button onClick={() => setEvents(events.filter(x => x.id !== e.id))} className="ml-auto text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
  };

  const TasksView = () => (
      <div className={`pb-36 pt-6 px-4 animate-fade-in ${s.font} h-full`}>
          <div className="flex justify-between items-center mb-6">
              <h2 className={`text-3xl font-bold ${s.textMain}`}>Tasks</h2>
              <button onClick={() => {setAddType('task'); setShowAddModal(true)}} className={`p-3 rounded-full shadow-lg ${s.primaryBtn} transition-transform active:scale-90`}><Plus size={20}/></button>
          </div>
          <div className={`${s.radius} p-2 ${s.card} min-h-[70vh]`}>
              {tasks.length === 0 ? <div className={`text-center py-20 opacity-40 ${s.textSec}`}>All done!</div> : tasks.map(t => (
                  <div key={t.id} onClick={() => setTasks(tasks.map(x => x.id === t.id ? {...x, done: !x.done} : x))} className={`p-4 border-b ${isDarkMode?'border-white/5':'border-gray-100'} flex items-center gap-4 active:bg-black/5 dark:active:bg-white/5 transition-colors first:rounded-t-2xl last:border-0`}>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${t.done ? s.accent.replace('text', 'bg').replace('500','500') + ' border-transparent' : 'border-gray-300'}`}>{t.done && <CheckCircle size={14} className="text-white"/>}</div>
                      <span className={`flex-1 font-medium ${t.done ? 'line-through opacity-50' : ''} ${s.textMain}`}>{t.text}</span>
                      <button onClick={(e)=>{e.stopPropagation(); setTasks(tasks.filter(x=>x.id!==t.id))}} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18}/></button>
                  </div>
              ))}
          </div>
      </div>
  );

  const SettingsView = () => (
    <div className={`pb-32 pt-8 px-4 animate-fade-in ${s.font}`}>
         <h2 className={`text-3xl font-bold ${s.textMain} mb-6`}>Settings</h2>
         <div className="space-y-4">
            
            {/* Design Config */}
            <div className={`${s.radius} p-6 ${s.card}`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className={`${t.bgLight} ${t.text} p-2.5 rounded-xl`}><Palette size={20} strokeWidth={s.iconStroke}/></div>
                    <div><h3 className={`font-bold ${s.textMain}`}>Design</h3><p className={`text-xs ${s.textSec}`}>Look & Feel</p></div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
                    {['standard', 'glass', 'minimal'].map(style => (
                        <button key={style} onClick={() => setAppSettings({...appSettings, designStyle: style})} className={`py-2 text-xs font-bold capitalize rounded-lg ${appSettings.designStyle===style ? (isDarkMode?'bg-gray-700 text-white':'bg-white shadow text-black') : 'text-gray-500'}`}>{style}</button>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-2 mb-6 bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
                    {['sans', 'serif', 'mono'].map(font => (
                        <button key={font} onClick={() => setAppSettings({...appSettings, fontStyle: font})} className={`py-2 text-xs font-bold capitalize rounded-lg ${appSettings.fontStyle===font ? (isDarkMode?'bg-gray-700 text-white':'bg-white shadow text-black') : 'text-gray-500'}`}>{font}</button>
                    ))}
                </div>

                {/* THEME SELECTION LIST */}
                <div className="space-y-2 mb-6">
                    {Object.entries(themes).map(([key, theme]) => (
                        <button 
                            key={key}
                            onClick={() => setCurrentTheme(key)}
                            className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all ${currentTheme === key ? (isDarkMode ? 'bg-white/10 border border-white/20' : 'bg-white shadow-sm border border-gray-100') : 'hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-2">
                                    {theme.colors.map((c, i) => (
                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800" style={{backgroundColor: c}} />
                                    ))}
                                </div>
                                <span className={`font-bold text-sm ${s.textMain}`}>{theme.name}</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${currentTheme === key ? theme.border : 'border-gray-300'}`}>
                                {currentTheme === key && <div className={`w-2.5 h-2.5 rounded-full ${theme.primary}`} />}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-white/5">
                     <span className={`text-sm font-medium ${s.textMain}`}>Dark Mode</span>
                     <button onClick={() => setAppearanceMode(isDarkMode ? 'light' : 'dark')} className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${isDarkMode ? 'bg-white justify-end' : 'bg-gray-300 justify-start'}`}>
                         <div className={`w-4 h-4 rounded-full shadow-sm ${isDarkMode ? 'bg-black' : 'bg-white'}`}></div>
                     </button>
                </div>
            </div>

            {/* Content Config */}
            <div className={`${s.radius} p-6 ${s.card}`}>
                 <div className="flex items-center gap-3 mb-4">
                    <div className={`${isDarkMode ? 'bg-white/10 text-white' : t.bgLight + ' ' + t.text} p-2.5 rounded-xl`}><LayoutTemplate size={20}/></div>
                    <div><h3 className={`font-bold ${s.textMain}`}>Content</h3><p className={`text-xs ${s.textSec}`}>Customize Dashboard</p></div>
                </div>
                <div className="space-y-3">
                    {['Stats', 'Quote', 'Events Box', 'Tasks Box'].map((label, i) => {
                        const keys = ['showStats', 'showQuote', 'showEventsBox', 'showTasksBox'];
                        const key = keys[i];
                        return (
                            <div key={key} className="flex justify-between items-center">
                                <span className={`text-sm ${s.textMain}`}>{label}</span>
                                <button onClick={() => setAppSettings({...appSettings, [key]: !appSettings[key]})} className={`text-xs font-bold ${appSettings[key] ? s.accent : 'text-gray-400'}`}>{appSettings[key] ? 'On' : 'Off'}</button>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {/* Profil */}
            <div className={`${s.radius} p-6 ${s.card}`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className={`${isDarkMode ? 'bg-white/10 text-white' : t.bgLight + ' ' + t.text} p-2.5 rounded-xl`}><User size={20}/></div>
                    <h3 className={`font-bold ${s.textMain}`}>Profile</h3>
                </div>
                <div className="space-y-3">
                    <input value={appSettings.userName} onChange={(e) => setAppSettings({...appSettings, userName: e.target.value})} className={`w-full ${s.input} p-3 rounded-xl outline-none focus:border-pink-500 border text-sm`} placeholder="Your Name"/>
                </div>
            </div>

            {/* Reset */}
             <div className={`${s.radius} p-6 ${s.card}`}>
                 <button onClick={resetData} className="w-full flex items-center justify-center gap-2 text-red-500 font-bold text-sm p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"><Trash2 size={16}/> Reset Data</button>
             </div>
         </div>
    </div>
  );

  return (
    <div className={`w-full h-screen ${s.bg} overflow-hidden flex flex-col ${s.font} transition-colors duration-500`}>
      <div className="w-full h-[env(safe-area-inset-top)] shrink-0"/>

      <main className="flex-1 overflow-y-auto px-0 hide-scrollbar relative">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'calendar' && <CalendarView />} 
        {activeTab === 'tasks' && <TasksView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Nav Pill */}
      <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm ${s.nav} rounded-full shadow-2xl p-2 flex justify-between items-center z-40 transition-transform duration-300`}>
          {[{id:'home',icon:Home}, {id:'calendar',icon:CalendarDays}, {id:'tasks',icon:CheckSquare}, {id:'settings',icon:Settings}].map(item => (
              <button key={item.id} onClick={()=>setActiveTab(item.id)} className={`w-12 h-12 flex items-center justify-center rounded-full transition-all active:scale-90 ${activeTab===item.id ? s.primaryBtn : s.textSec}`}>
                  <item.icon size={22} strokeWidth={activeTab===item.id ? 2.5 : 2} />
              </button>
          ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in p-4">
            <div className={`w-full max-w-sm ${s.card} rounded-[2.5rem] p-6 shadow-2xl animate-slide-up`}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className={`text-xl font-bold ${s.textMain}`}>New Item</h3>
                    <button onClick={() => setShowAddModal(false)} className={`p-2 rounded-full ${isDarkMode?'bg-white/10':'bg-gray-100'}`}><X size={20} className={s.textMain}/></button>
                </div>
                <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-2xl mb-4">
                     <button onClick={() => setAddType('task')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${addType === 'task' ? s.card + ' shadow-sm ' + s.textMain : 'text-gray-400'}`}>Task</button>
                     <button onClick={() => setAddType('event')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${addType === 'event' ? s.card + ' shadow-sm ' + s.textMain : 'text-gray-400'}`}>Event</button>
                </div>
                <div className="relative mb-4">
                    <input 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        autoFocus 
                        placeholder={addType === 'task' ? "Add a new task..." : "Add a new event..."} 
                        className={`w-full ${s.input} p-4 rounded-2xl outline-none focus:ring-2 ring-pink-500/50 pr-12`} 
                    />
                    <button className={`absolute right-3 top-3 p-2 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl text-white shadow-lg active:scale-90 transition-transform`}>
                        <Wand2 size={16}/>
                    </button>
                </div>
                <button onClick={handleAddItem} className={`w-full py-4 rounded-2xl ${t.primary} text-white font-bold shadow-lg active:scale-95 transition-transform`}>
                    Save
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default MomentumApp;