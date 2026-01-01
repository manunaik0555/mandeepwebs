import React, { useState, useEffect } from 'react';
import Marquee from "react-fast-marquee";
import { 
  FaUniversity, FaWhatsapp, FaBars, FaTimes, 
  FaLaptopCode, FaMicrochip, FaCogs, FaBuilding, FaFlask, FaAtom,
  FaDownload, FaTrophy, FaBookOpen, 
  FaArrowLeft, FaCalendarAlt, FaCommentDots, FaPaperPlane,
  FaGithub, FaLinkedin, FaFileUpload,
  FaSun, FaMoon 
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import './App.css';

// Lazy load Admin panel
const Admin = React.lazy(() => import('./Admin'));

function App() {
  const [subjects, setSubjects] = useState([]);
  const [syllabusList, setSyllabusList] = useState([]); 
  const [loading, setLoading] = useState(true); 
  
  // --- THEME STATE ---
  const [darkMode, setDarkMode] = useState(false);

  // NAVIGATION
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("home"); 

  // FILTERS (Main Home Page)
  const [currentBranch, setCurrentBranch] = useState("ALL");
  const [currentScheme, setCurrentScheme] = useState(null);
  const [currentSemester, setCurrentSemester] = useState(null);
  
  // SYLLABUS FILTERS
  const [syllabusBranch, setSyllabusBranch] = useState(null);
  const [syllabusScheme, setSyllabusScheme] = useState(null);

  // FORMS
  const [feedback, setFeedback] = useState({ name: "", message: "" });
  const [feedbackStatus, setFeedbackStatus] = useState(""); 
  
  const [contribData, setContribData] = useState({ name: "", branch: "CSE", scheme: "2022 Scheme", semester: "3", subject: "", link: "" });
  const [contribStatus, setContribStatus] = useState("");

  const updates = [
    { text: "📢 Extension of last date for internship selection", link: "https://vtu.ac.in/en/internships" },
    { text: "📅 Revised Time Table for 7th Sem Exams", link: "https://vtu.ac.in/en/exam-timetable" },
    { text: "📝 Submission of Online Application for Revaluation", link: "https://results.vtu.ac.in" },
    { text: "🎓 Tentative Academic Calendar 2025-26", link: "https://vtu.ac.in/en/academic-calendar" }
  ];

  // --- FETCH DATA ---
  useEffect(() => {
    const cachedSubjects = localStorage.getItem('subjectsData');
    if (cachedSubjects) {
      setSubjects(JSON.parse(cachedSubjects));
      setLoading(false);
    }

    fetch('https://mandeepwebs.onrender.com/api/subjects') 
      .then(res => res.json())
      .then(data => { 
        setSubjects(data); 
        setLoading(false); 
        localStorage.setItem('subjectsData', JSON.stringify(data));
      })
      .catch(err => console.error(err));

    fetch('https://mandeepwebs.onrender.com/api/syllabus').then(res => res.json()).then(data => setSyllabusList(data)).catch(err => console.error(err));
  }, []);

  const departments = [
    { id: "CSE", name: "CSE-ISE", icon: <FaLaptopCode />, color: "card-blue" },
    { id: "ECE", name: "Electronics", icon: <FaMicrochip />, color: "card-purple" },
    { id: "MECH", name: "Mechanical", icon: <FaCogs />, color: "card-orange" },
    { id: "CIVIL", name: "Civil Engg", icon: <FaBuilding />, color: "card-green" },
    { id: "P-CYCLE", name: "Physics Cycle", icon: <FaAtom />, color: "card-pink" },   
    { id: "C-CYCLE", name: "Chemistry Cycle", icon: <FaFlask />, color: "card-teal" }, 
  ];

  const handleNavClick = (page) => {
    setActivePage(page); setIsAdmin(false); setMobileMenuOpen(false);
    // Reset all filters when switching pages
    setCurrentBranch("ALL"); setCurrentScheme(null); setCurrentSemester(null); 
    setSyllabusBranch(null); setSyllabusScheme(null);
  };

  const handleContribSubmit = async (e) => {
    e.preventDefault(); setContribStatus("Sending...");
    try { 
      const res = await fetch('https://mandeepwebs.onrender.com/api/contribute', { 
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contribData) 
      }); 
      if(!res.ok) throw new Error("Failed");
      setContribStatus("✅ Thanks! Admin will review."); 
      setContribData({ name: "", branch: "CSE", scheme: "2022 Scheme", semester: "3", subject: "", link: "" }); 
      setTimeout(() => setContribStatus(""), 3000); 
    } catch (err) { setContribStatus("❌ Error Sending."); }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault(); setFeedbackStatus("Sending...");
    try { 
      await fetch('https://mandeepwebs.onrender.com/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(feedback) }); 
      setFeedbackStatus("✅ Sent!"); 
      setFeedback({ name: "", message: "" }); 
      setTimeout(() => setFeedbackStatus(""), 3000); 
    } catch (err) { setFeedbackStatus("❌ Error."); }
  };

  const availableSchemes = [...new Set(syllabusList.filter(item => item.branch === syllabusBranch).map(item => item.scheme))].sort().reverse(); 
  const currentSyllabusLink = syllabusList.find(s => s.branch === syllabusBranch && s.scheme === syllabusScheme)?.link;

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo-section" onClick={() => handleNavClick("home")}>
            <div className="logo-icon"><FaUniversity /></div>
            <h1>Manu's Guide</h1>
          </div>
          
          <div className={`nav-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
            <span onClick={() => handleNavClick("home")}>Home</span><span onClick={() => handleNavClick("syllabus")}>Syllabus</span><span onClick={() => handleNavClick("results")}>Results</span>
            <button onClick={() => setIsAdmin(!isAdmin)} className="btn-admin">{isAdmin ? "Exit" : "Admin"}</button>
            <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle-btn">{darkMode ? <FaSun /> : <FaMoon />}</button>
          </div>
          <div className="menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <FaTimes /> : <FaBars />}</div>
        </div>
      </nav>

      <div className="ticker-section"><span className="ticker-label">LIVE</span><Marquee gradient={false} speed={50} className="ticker-text">{updates.map((u, i) => <a key={i} href={u.link} target="_blank" rel="noreferrer" style={{color:"white", marginRight:"40px"}}>• {u.text}</a>)}</Marquee></div>

      <div className="main-grid">
        {isAdmin ? (
            <div className="content-column">
                <React.Suspense fallback={<p>Loading Admin Panel...</p>}>
                    <Admin />
                </React.Suspense>
            </div>
        ) : activePage === "syllabus" ? (
          <div className="content-column">
             {!syllabusBranch && (<section><h3 className="section-title"><FaBookOpen /> Syllabus: Select Dept</h3><div className="dept-grid">{departments.map((dept) => (<motion.div key={dept.id} whileHover={{ scale: 1.05 }} onClick={() => setSyllabusBranch(dept.id)} className={`dept-card ${dept.color}`}><div className="dept-icon">{dept.icon}</div><h4>{dept.name}</h4><p>Select Scheme ➜</p></motion.div>))}</div></section>)}
             {syllabusBranch && !syllabusScheme && (<section><button onClick={() => setSyllabusBranch(null)} className="back-btn"><FaArrowLeft /> Back</button><h3 className="section-title">Select Scheme for {syllabusBranch}</h3><div className="dept-grid">{availableSchemes.length===0?<p>No Syllabus found.</p>:availableSchemes.map((scheme) => (<motion.div key={scheme} whileHover={{ scale: 1.05 }} onClick={() => setSyllabusScheme(scheme)} className="dept-card" style={{borderLeft:"5px solid #2563eb",padding:"30px"}}><h4>{scheme}</h4><p>View PDF ➜</p></motion.div>))}</div></section>)}
             {syllabusBranch && syllabusScheme && (<section><button onClick={() => setSyllabusScheme(null)} className="back-btn"><FaArrowLeft /> Back</button><h3 className="section-title">Download Syllabus</h3><div className="upload-card"><div className="upload-info"><h4>{syllabusBranch} - {syllabusScheme}</h4></div><button className="btn-download" onClick={() => window.open(currentSyllabusLink, '_blank')}><FaDownload /> PDF</button></div></section>)}
          </div>
        ) : activePage === "results" ? (
          <div className="content-column"><h3 className="section-title"><FaTrophy /> Check Results</h3><div className="dept-grid"><div className="dept-card card-blue" onClick={() => window.open('https://results.vtu.ac.in', '_blank')}><h4>7th & 8th Sem</h4></div><div className="dept-card card-green" onClick={() => window.open('https://results.vtu.ac.in', '_blank')}><h4>1st & 2nd Sem</h4></div></div></div>
        ) : (
          <div className="content-column">
            
            {/* STEP 1: SELECT DEPARTMENT */}
            {currentBranch === "ALL" && (
              <section>
                <h3 className="section-title">Departments</h3>
                <div className="dept-grid">{departments.map((dept) => (<motion.div key={dept.id} whileHover={{ scale: 1.05 }} onClick={() => { setCurrentBranch(dept.id); setCurrentScheme(null); setCurrentSemester(null); }} className={`dept-card ${dept.color}`}><div className="dept-icon">{dept.icon}</div><h4>{dept.name}</h4></motion.div>))}</div>
                <section className="uploads-section"><h3 className="section-title">Latest Updates</h3><div className="uploads-list">{subjects.slice(0,3).map(sub=>(<div key={sub._id} className="upload-card"><div className="upload-info"><h4>{sub.subject}</h4><small>{sub.branch} | {sub.scheme || "No Scheme"}</small></div><a href={sub.link} target="_blank" rel="noreferrer" className="btn-download"><FaDownload /></a></div>))}</div></section>
              </section>
            )}

            {/* STEP 2: SELECT SCHEME */}
            {currentBranch !== "ALL" && currentScheme === null && (
              <section>
                <button onClick={() => setCurrentBranch("ALL")} className="back-btn"><FaArrowLeft /> Back</button>
                <h3 className="section-title">Select Scheme for {currentBranch}</h3>
                <div className="dept-grid">
                  {["2024 Scheme", "2022 Scheme", "2021 Scheme", "2018 Scheme"].map((scheme) => (
                    <motion.div key={scheme} whileHover={{ scale: 1.05 }} 
                      onClick={() => { setCurrentScheme(scheme); setCurrentSemester(null); }} 
                      className="dept-card" style={{borderLeft: "5px solid #2563eb"}}
                    >
                      <FaCalendarAlt style={{fontSize:"1.5rem", color:"#2563eb", marginBottom:"10px"}}/>
                      <h4>{scheme}</h4>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* STEP 3: SELECT SEMESTER */}
            {currentBranch !== "ALL" && currentScheme !== null && currentSemester === null && (
              <section>
                <button onClick={() => setCurrentScheme(null)} className="back-btn"><FaArrowLeft /> Back</button>
                <h3 className="section-title">Select Semester</h3>
                <div className="dept-grid">
                  {(currentBranch === "P-CYCLE" || currentBranch === "C-CYCLE" ? [1, 2] : [3, 4, 5, 6, 7, 8]).map((sem) => (
                    <motion.div key={sem} whileHover={{ scale: 1.05 }} onClick={() => setCurrentSemester(sem)} className="dept-card">
                      <h4>{sem}th Sem</h4>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* STEP 4: VIEW NOTES */}
            {currentBranch !== "ALL" && currentScheme !== null && currentSemester !== null && (
              <section className="uploads-section">
                <button onClick={() => setCurrentSemester(null)} className="back-btn"><FaArrowLeft /> Back</button>
                <h3 className="section-title">{currentSemester}th Sem ({currentScheme}) - {currentBranch}</h3>
                <div className="uploads-list">
                  {subjects.filter(sub => sub.branch === currentBranch && String(sub.semester) === String(currentSemester) && (sub.scheme && sub.scheme.trim() === currentScheme)).length === 0 ? (
                    <div style={{background: "#fff1f2", border: "2px solid #e11d48", borderRadius: "10px", padding: "20px", color: "#881337"}}><h3>⚠️ No Notes Found</h3><p>We couldn't find notes for these filters.</p></div>
                  ) : (
                    subjects.filter(sub => sub.branch === currentBranch && String(sub.semester) === String(currentSemester) && (sub.scheme && sub.scheme.trim() === currentScheme)).map((sub) => (
                      <div key={sub._id} className="upload-card"><div className="upload-info"><h4>{sub.subject}</h4><small style={{color: "#3b82f6", fontWeight: "bold"}}>{sub.subjectCode}</small></div><a href={sub.link} target="_blank" rel="noreferrer" className="btn-download"><FaDownload /></a></div>
                    ))
                  )}
                </div>
              </section>
            )}
          </div>
        )}
        
        {/* --- SIDEBAR --- */}
        <div className="sidebar-column">
          
          <div className="sidebar-widget profile-widget">
            <div className="profile-img-container"><img src={process.env.PUBLIC_URL + '/manuu.jpg'} onError={(e) => {e.target.onerror = null; e.target.src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}} alt="Manu Naik k" /></div>
            <h3>Manu Naik K</h3>
            <p className="profile-role">Admin</p><p className="profile-bio">Welcome! I help engineering students with curated notes and updates.</p>
            <div style={{display: "flex", justifyContent: "center", gap: "20px", marginTop: "15px"}}>
                <a href="https://github.com/manunaik0555" target="_blank" rel="noreferrer" style={{color: "var(--text-color)", fontSize: "1.8rem"}}><FaGithub /></a>
                <a href="https://www.linkedin.com/in/manu-naik-590364280/" target="_blank" rel="noreferrer" style={{color: "#0077b5", fontSize: "1.8rem"}}><FaLinkedin /></a>
            </div>
          </div>
          
          {/* HIDDEN IN ADMIN */}
          {!isAdmin && (
            <>
              {/* Urgent Req - FIXED LINK WITH PRE-FILLED MESSAGE */}
              <div className="sidebar-widget" style={{border: "2px solid red", background: "#fee2e2", borderStyle: "dashed"}}>
                <h3 style={{color:"#dc2626"}}>Urgent Requirement !!</h3>
                <p style={{fontSize:"0.9rem", color:"#7f1d1d"}}>iam looking for a developer to maintain the Backend & Code maintainance.</p>
                <button 
                  onClick={()=>window.open("https://wa.me/918792837678?text=Hi%20Manu,%20I%20am%20interested%20in%20the%20Developer%20role%20for%20your%20website", "_blank")} 
                  style={{width:"100%", background:"#dc2626", color:"white", padding:"10px", border:"none", borderRadius:"5px", marginTop:"10px", cursor:"pointer", fontWeight:"bold"}}
                >
                  Apply / DM Me ➜
                </button>
              </div>

              {/* Upload Notes */}
              <div className="sidebar-widget" style={{borderTop: "4px solid #16a34a"}}>
                <h3 style={{color:"#16a34a", fontSize:"1.1rem"}}><FaFileUpload style={{marginRight:"5px"}}/> Upload Notes</h3>
                <p style={{fontSize:"0.85rem", color:"var(--text-light)", marginBottom:"10px"}}>Help your juniors! Share your PDF link.</p>
                <form onSubmit={handleContribSubmit} style={{display:"flex", flexDirection:"column", gap:"8px"}}>
                  <input placeholder="Name (Optional)" value={contribData.name} onChange={e=>setContribData({...contribData, name:e.target.value})} className="input-field" />
                  <div style={{display:"flex", gap:"5px"}}>
                    <select value={contribData.branch} onChange={e=>setContribData({...contribData, branch:e.target.value, semester: (e.target.value==="P-CYCLE"||e.target.value==="C-CYCLE")?"1":"3"})} className="input-field" style={{flex:1}}>
                      <option value="CSE">CSE</option><option value="ECE">ECE</option><option value="CIVIL">CIVIL</option><option value="MECH">MECH</option><option value="P-CYCLE">P-CYCLE</option><option value="C-CYCLE">C-CYCLE</option>
                    </select>
                    <select value={contribData.semester} onChange={e=>setContribData({...contribData, semester:e.target.value})} className="input-field" style={{width:"60px"}}>
                      {(contribData.branch === "P-CYCLE" || contribData.branch === "C-CYCLE" ? [1, 2] : [3, 4, 5, 6, 7, 8]).map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <select value={contribData.scheme} onChange={e=>setContribData({...contribData, scheme:e.target.value})} className="input-field">
                    <option value="2024 Scheme">2024 Scheme</option><option value="2022 Scheme">2022 Scheme</option><option value="2021 Scheme">2021 Scheme</option><option value="2018 Scheme">2018 Scheme</option>
                  </select>
                  <input placeholder="Subject" required value={contribData.subject} onChange={e=>setContribData({...contribData, subject:e.target.value})} className="input-field" />
                  <input placeholder="Drive Link" required type="url" value={contribData.link} onChange={e=>setContribData({...contribData, link:e.target.value})} className="input-field" />
                  <button type="submit" style={{background:"#16a34a", color:"white", padding:"8px", border:"none", borderRadius:"5px", cursor:"pointer", fontWeight:"bold"}}>Submit</button>
                </form>
                {contribStatus && <p style={{marginTop:"5px", fontSize:"0.8rem", color:"#16a34a"}}>{contribStatus}</p>}
              </div>

              {/* Join Community */}
              <div className="sidebar-widget gradient-widget">
                  <h3>Join Community</h3>
                  <button className="btn-social whatsapp" onClick={() => window.open('https://chat.whatsapp.com/LSBNjg50ugp4JMpcsd7dOG', '_blank')}><FaWhatsapp /> WhatsApp</button>
              </div>

              {/* Feedback Widget */}
              <div className="sidebar-widget">
                  <h3><FaCommentDots style={{color:"#2563eb", marginRight:"5px"}}/> Feedback</h3>
                  <form onSubmit={handleFeedbackSubmit} style={{display:"flex", flexDirection:"column", gap:"10px"}}>
                      <input placeholder="Name" value={feedback.name} onChange={e=>setFeedback({...feedback, name:e.target.value})} className="input-field"/>
                      <textarea placeholder="Message" value={feedback.message} onChange={e=>setFeedback({...feedback, message:e.target.value})} className="input-field"/>
                      <button type="submit" style={{background:"#2563eb", color:"white", padding:"8px", border:"none", borderRadius:"5px", cursor:"pointer"}}>
                          <FaPaperPlane size={12}/> Send
                      </button>
                  </form>
              </div>
            </>
          )}

        </div>
      </div>
      
      <footer className="footer"><p>© 2025 Designed and Developed by @ manunaik0555</p></footer>
    </div>
  );
}
export default App;