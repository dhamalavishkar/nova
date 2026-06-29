import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  BookOpen, 
  Trophy, 
  Calendar, 
  ExternalLink,
  Search,
  Bell,
  LayoutDashboard,
  Settings,
  Archive,
  RefreshCw,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { LocalNotifications } from '@capacitor/local-notifications';
import './index.css';

// 15 Diverse Mock Items
const INITIAL_DATA = [
  // Internships
  { id: 1, title: 'Student Researcher Program 2026', company: 'Google', type: 'internship', deadline: '2026-07-31', location: 'Remote / US', description: 'Work on exploratory, real-world research projects alongside Google teams (DeepMind, Google Research, Google Cloud).', link: 'https://careers.google.com/students/', logo: '🔍' },
  { id: 2, title: 'Explore Microsoft Internship', company: 'Microsoft', type: 'internship', deadline: '2026-06-20', location: 'Redmond, WA', description: 'A 12-week summer internship program specifically for first- and second-year college students.', link: 'https://apply.careers.microsoft.com/', logo: 'Ⓜ️' },
  { id: 3, title: 'Software Engineering Intern', company: 'Apple', type: 'internship', deadline: '2026-08-15', location: 'Cupertino, CA', description: 'Join Apple\'s core OS team to build the future of mobile experiences.', link: 'https://www.apple.com/careers/us/students.html', logo: '🍎' },
  { id: 4, title: 'Data Science Intern', company: 'Meta', type: 'internship', deadline: '2026-07-05', location: 'Menlo Park, CA', description: 'Analyze massive datasets to improve user engagement on Instagram and WhatsApp.', link: 'https://www.metacareers.com/students_and_grads/', logo: '♾️' },
  { id: 5, title: 'Backend Engineering Intern', company: 'Stripe', type: 'internship', deadline: '2026-09-01', location: 'Remote', description: 'Build robust payment APIs handling millions of global transactions daily.', link: 'https://stripe.com/jobs', logo: '💳' },
  
  // Courses
  { id: 6, title: 'Google AI Essentials', company: 'Coursera', type: 'course', deadline: '2027-12-31', location: 'Online', description: 'Learn foundational Generative AI skills directly from Google experts. Free certificate included.', link: 'https://www.coursera.org/professional-certificates/google-ai-essentials', logo: '🎓' },
  { id: 7, title: 'CS50: Intro to Computer Science', company: 'Harvard', type: 'course', deadline: '2027-12-31', location: 'Online', description: 'The legendary introduction to the intellectual enterprises of computer science and the art of programming.', link: 'https://pll.harvard.edu/course/cs50-introduction-computer-science', logo: '🏛️' },
  { id: 8, title: 'Machine Learning Specialization', company: 'DeepLearning.AI', type: 'course', deadline: '2026-06-25', location: 'Online', description: 'Created by Andrew Ng, this foundational program teaches modern machine learning fundamentals.', link: 'https://www.deeplearning.ai/courses/machine-learning-specialization/', logo: '🧠' },
  { id: 9, title: 'AWS Cloud Practitioner', company: 'AWS Skill Builder', type: 'course', deadline: '2027-12-31', location: 'Online', description: 'Gain an overall understanding of the AWS Cloud, covering basic cloud concepts and security.', link: 'https://skillbuilder.aws/', logo: '☁️' },
  { id: 10, title: 'Full Stack Web Development', company: 'freeCodeCamp', type: 'course', deadline: '2027-12-31', location: 'Online', description: 'Earn free verified certifications in Responsive Web Design, JS Algorithms, and more.', link: 'https://www.freecodecamp.org/', logo: '🏕️' },

  // Events
  { id: 11, title: 'Global Hack Week 2026', company: 'MLH', type: 'event', deadline: '2026-08-15', location: 'Virtual', description: 'Major League Hacking presents a week-long coding challenge. Submit a project to earn exclusive swag!', link: 'https://mlh.io', logo: '💻' },
  { id: 12, title: 'ETHGlobal San Francisco', company: 'ETHGlobal', type: 'event', deadline: '2026-10-10', location: 'San Francisco, CA', description: 'Join hundreds of developers building the next generation of decentralized applications.', link: 'https://ethglobal.com/', logo: '⛓️' },
  { id: 13, title: 'NASA Space Apps Challenge', company: 'NASA', type: 'event', deadline: '2026-06-28', location: 'Global', description: 'The largest annual global hackathon using open data from NASA to solve real-world problems.', link: 'https://www.spaceappschallenge.org/', logo: '🚀' },
  { id: 14, title: 'HackMIT 2026', company: 'MIT', type: 'event', deadline: '2026-09-15', location: 'Cambridge, MA', description: 'A premier collegiate hackathon hosted at the Massachusetts Institute of Technology.', link: 'https://hackmit.org/', logo: '🛠️' },
  { id: 15, title: 'Kaggle AI Challenge', company: 'Kaggle', type: 'event', deadline: '2026-07-20', location: 'Virtual', description: 'Compete globally to build the best predictive models using massive datasets.', link: 'https://www.kaggle.com/competitions', logo: '📊' }
];

type Opportunity = typeof INITIAL_DATA[0];

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState<Opportunity[]>([]);
  const [lastSearchDate, setLastSearchDate] = useState<string>('');
  
  // Settings State
  const [settings, setSettings] = useState({
    notifications: true,
    autoArchive: true,
    targetRoles: 'Software Engineering, AI',
    darkMode: true
  });

  const TODAY = new Date().toISOString().split('T')[0];

  const scheduleNotifications = async (isEnabled: boolean) => {
    try {
      if (!isEnabled) {
        await LocalNotifications.cancel({ notifications: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }] });
        return;
      }
      
      let permStatus = await LocalNotifications.checkPermissions();
      if (permStatus.display === 'prompt') {
        permStatus = await LocalNotifications.requestPermissions();
      }
      if (permStatus.display !== 'granted') return;

      const randomFacts = [
        "Did you know? The first computer bug was an actual real-life moth.",
        "Reminder: Check out the new hackathons on Nova!",
        "Tip: Apply to internships early in the season to increase your chances.",
        "Fact: Over 90% of the world's data was generated in the last two years.",
        "Stay sharp: Have you completed your daily coding challenge?"
      ];

      const notifications = [];
      for(let i = 1; i <= 5; i++) {
        const time = new Date(new Date().getTime() + i * 2 * 60 * 60 * 1000);
        notifications.push({
          title: "Nova Alert",
          body: randomFacts[Math.floor(Math.random() * randomFacts.length)],
          id: i,
          schedule: { at: time }
        });
      }
      await LocalNotifications.schedule({ notifications });
    } catch (e) {
      console.log('Local notifications not supported in web view without plugin registration.');
    }
  };

  // Initialize data from LocalStorage
  useEffect(() => {
    const storedData = localStorage.getItem('nova_data');
    const storedDate = localStorage.getItem('nova_last_search');
    const storedSettings = localStorage.getItem('nova_settings');

    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }

    if (storedData) {
      setData(JSON.parse(storedData));
    } else {
      setData(INITIAL_DATA);
      localStorage.setItem('nova_data', JSON.stringify(INITIAL_DATA));
    }

    if (storedDate !== TODAY) {
      // Simulate Daily Search logic: If it's a new day, we "found" the data today.
      setLastSearchDate(TODAY);
      localStorage.setItem('nova_last_search', TODAY);
      // In a real app, this is where fetch('/api/daily-scrape') would run and prepend to `data`.
    } else {
      setLastSearchDate(storedDate);
    }
  }, [TODAY]);

  // Save settings to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem('nova_settings', JSON.stringify(settings));
    document.documentElement.style.setProperty('--bg-color', settings.darkMode ? '#0f172a' : '#f1f5f9');
    document.documentElement.style.setProperty('--card-bg', settings.darkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.7)');
    document.documentElement.style.setProperty('--text-primary', settings.darkMode ? '#f8fafc' : '#0f172a');
    
    // Update local notifications schedule when settings change
    scheduleNotifications(settings.notifications);
  }, [settings]);

  // Filter Data
  const isExpired = (deadline: string) => deadline < TODAY;

  const activeData = data.filter(item => !isExpired(item.deadline));
  const historicalData = data.filter(item => isExpired(item.deadline));

  const getFilteredData = () => {
    if (activeTab === 'history') return historicalData;
    if (activeTab === 'overview') return activeData;
    return activeData.filter(item => item.type === activeTab);
  };

  const getCategoryClass = (type: string) => {
    switch(type) {
      case 'internship': return 'category-internship';
      case 'course': return 'category-course';
      case 'event': return 'category-event';
      default: return '';
    }
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof settings] }));
  };

  // Render Settings View
  const renderSettings = () => (
    <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <h2 style={{ marginBottom: '2rem' }}>Application Settings</h2>
      
      <div className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3>Daily Notifications</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Receive browser alerts for new opportunities.</p>
          </div>
          <div style={{ cursor: 'pointer', color: settings.notifications ? 'var(--accent-neon)' : 'var(--text-secondary)' }} onClick={() => toggleSetting('notifications')}>
            {settings.notifications ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3>Auto-Archive Expired Events</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Move events to History automatically when deadlines pass.</p>
          </div>
          <div style={{ cursor: 'pointer', color: settings.autoArchive ? 'var(--accent-neon)' : 'var(--text-secondary)' }} onClick={() => toggleSetting('autoArchive')}>
            {settings.autoArchive ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3>Dark Mode Theme</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Toggle between dark and light UI aesthetics.</p>
          </div>
          <div style={{ cursor: 'pointer', color: settings.darkMode ? 'var(--accent-neon)' : 'var(--text-secondary)' }} onClick={() => toggleSetting('darkMode')}>
            {settings.darkMode ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1rem' }}>
          <h3>Search Preferences</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Keywords used during the daily automated search.</p>
          <input 
            type="text" 
            value={settings.targetRoles}
            onChange={(e) => setSettings(prev => ({ ...prev, targetRoles: e.target.value }))}
            style={{ 
              width: '100%', padding: '0.75rem', borderRadius: '8px', 
              background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'var(--text-primary)',
              fontFamily: 'inherit'
            }}
          />
        </div>

      </div>
    </div>
  );

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar glass">
        <div className="brand">
          <Search size={28} color="var(--accent-neon)" />
          Nova
        </div>
        
        <div className="nav-links" style={{ marginTop: '2rem' }}>
          <div className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </div>
          <div className={`nav-item ${activeTab === 'internship' ? 'active' : ''}`} onClick={() => setActiveTab('internship')}>
            <Briefcase size={20} />
            <span>Internships</span>
          </div>
          <div className={`nav-item ${activeTab === 'course' ? 'active' : ''}`} onClick={() => setActiveTab('course')}>
            <BookOpen size={20} />
            <span>Certifications</span>
          </div>
          <div className={`nav-item ${activeTab === 'event' ? 'active' : ''}`} onClick={() => setActiveTab('event')}>
            <Trophy size={20} />
            <span>Hackathons</span>
          </div>
        </div>

        <div className="nav-links" style={{ marginTop: 'auto' }}>
          <div className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            <Archive size={20} />
            <span>History</span>
          </div>
          <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        
        <header className="dashboard-header fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="header-title">
            <h1>
              {activeTab === 'settings' ? 'Settings' : 
               activeTab === 'history' ? 'Archived Opportunities' : 
               'Daily Findings'}
            </h1>
            <p>
              {activeTab === 'settings' ? 'Manage your application preferences' : 
               `Last simulated search: ${lastSearchDate === TODAY ? 'Today' : lastSearchDate}`}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="glass" style={{ padding: '0.75rem', borderRadius: '50%', display: 'flex', cursor: 'pointer' }}>
              <RefreshCw size={24} color="var(--accent-primary)" />
            </div>
            <div className="glass" style={{ padding: '0.75rem', borderRadius: '50%', display: 'flex', cursor: 'pointer' }}>
              <Bell size={24} color={settings.notifications ? "var(--accent-neon)" : "var(--text-secondary)"} />
            </div>
          </div>
        </header>

        {activeTab === 'settings' ? (
          renderSettings()
        ) : (
          <>
            {/* Daily Summary Alert (Only show on overview) */}
            {activeTab === 'overview' && (
              <section className="daily-alert glass fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="daily-alert-header">
                  <Trophy size={18} />
                  <span>Nova Priority Alert</span>
                </div>
                <p>
                  🌟 Active opportunities from Apple, Google, and Stripe are closing soon.<br/>
                  🎓 Expand your skillset with full-stack certifications from CS50 and freeCodeCamp.<br/>
                  💻 Gear up for ETHGlobal and upcoming HackMIT virtual participation.
                </p>
              </section>
            )}

            {/* Opportunities Feed */}
            <section className="opportunities-grid">
              {getFilteredData().length === 0 && (
                <div style={{ color: 'var(--text-secondary)', padding: '2rem' }}>No opportunities found for this category.</div>
              )}
              {getFilteredData().map((item, index) => (
                <div 
                  key={item.id} 
                  className={`opp-card glass fade-in ${activeTab === 'history' ? 'expired-card' : ''}`} 
                  style={{ animationDelay: `${0.3 + (index * 0.05)}s` }}
                >
                  <div className="card-header">
                    <div className="company-logo">
                      {item.logo}
                    </div>
                    <span className={`category-tag ${getCategoryClass(item.type)}`}>
                      {item.type}
                    </span>
                  </div>
                  
                  <div className="card-content">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>

                  <div className="card-footer">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div className="meta-info">
                        <Briefcase />
                        <span>{item.company}</span>
                      </div>
                      <div className="meta-info">
                        <Calendar />
                        <span style={{ color: isExpired(item.deadline) ? '#ef4444' : 'inherit' }}>
                          {isExpired(item.deadline) ? `Expired: ${item.deadline}` : `Deadline: ${item.deadline}`}
                        </span>
                      </div>
                    </div>
                    
                    <a href={item.link} target="_blank" rel="noreferrer" className="apply-btn">
                      {isExpired(item.deadline) ? 'View Archive' : 'Apply'} <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
