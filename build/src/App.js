import React, { useState, useEffect } from 'react';
import Admin from './Admin';
import Marquee from "react-fast-marquee";
import { 
  FaUniversity, FaWhatsapp, FaBars, FaTimes, 
  FaLaptopCode, FaMicrochip, FaCogs, FaBuilding, FaFlask, FaAtom,
  FaDownload, FaTrophy, FaBookOpen, 
  FaArrowLeft, FaCalendarAlt, FaCommentDots, FaPaperPlane,
  FaGithub, FaLinkedin, FaFileUpload,
  FaSun, FaMoon, FaSearch, FaFolderOpen 
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast'; 
import './App.css';
import Contact from './Contact';
import CookieConsent from './CookieConsent'; 

function App() {
  const [subjects, setSubjects] = useState([]);
  const [syllabusList, setSyllabusList] = useState([]); 
  const [loading, setLoading] = useState(true); 
  
  const [darkMode, setDarkMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("home"); 

  const [currentBranch, setCurrentBranch] = useState("ALL");
  const [currentScheme, setCurrentScheme] = useState(null);
  const [currentSemester, setCurrentSemester] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [syllabusBranch, setSyllabusBranch] = useState(null);
  const [syllabusScheme, setSyllabusScheme] = useState(null);

  const [feedback, setFeedback] = useState({ name: "", message: "" });
  const [contribData, setContribData] = useState({ name: "", branch: "CSE", scheme: "2022 Scheme", semester: "3", subject: "", link: "" });

  const updates = [
    { text: "📢 Extension of last date for internship selection", link: "https://vtu.ac.in/en/internships" },
    { text: "📅 Revised Time Table for 7th Sem Exams", link: "https://vtu.ac.in/en/exam-timetable" },
    { text: "📝 Submission of Online Application for Revaluation", link: "https://results.vtu.ac.in" },
    { text: "🎓 Tentative Academic Calendar 2025-26", link: "https://vtu.ac.in/en/academic-calendar" }
  ];

  useEffect(() => {
    // Fetch Subjects
    fetch('https://mandeepwebs.onrender.com/api/subjects')
      .then(res => res.json())
      .then(data => { 
        setSubjects(data); 
        setLoading(false); // ⚡ Fast loading (No delay)
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

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
    setCurrentBranch("ALL"); setCurrentScheme(null); setCurrentSemester(null); 
    setSyllabusBranch(null); setSyllabusScheme(null);
    setSearchTerm(""); 
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault(); 
    const toastId = toast.loading("Sending Feedback...");
    try { 
      await fetch('https://mandeepwebs.onrender.com/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(feedback) }); 
      toast.success("Feedback Sent! Thank you.", { id: toastId });
      setFeedback({ name: "", message: "" }); 
    } catch (err) { toast.error("Failed to send.", { id: toastId }); }
  };

  const handleContribSubmit = async (e) => {
    e.preventDefault(); 
    const toastId = toast.loading("Submitting...");
    try { 
      await fetch('https://mandeepwebs.onrender.com/api/contribute', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contribData) }); 
      toast.success("Thanks! Admin will review.", { id: toastId });
      setContribData({ name: "", branch: "CSE", scheme: "2022 Scheme", semester: "3", subject: "", link: "" }); 
    } catch (err) { toast.error("Failed to send.", { id: toastId }); }
  };

  const filteredSubjects = subjects.filter((sub) => {
    if (searchTerm === "") return false; 
    const lowerTerm = searchTerm.toLowerCase();
    const code = sub.subjectCode ? sub.subjectCode.toLowerCase() : "";
    const name = sub.subject ? sub.subject.toLowerCase() : "";
    return code.includes(lowerTerm) || name.includes(lowerTerm);
  });

  const availableSchemes = [...new Set(syllabusList.filter(item => item.branch === syllabusBranch).map(item => item.scheme))].sort().reverse(); 
  const currentSyllabusLink = syllabusList.find(s => s.branch === syllabusBranch && s.scheme === syllabusScheme)?.link;

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* 🍞 TOAST CONTAINER */}
      <Toaster position="top-center" reverseOrder={false} />

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
        {isAdmin ? <div className="content-column"><Admin /></div> : activePage === "syllabus" ? (
          <div className="content-column">
             {!syllabusBranch && (<section><h3 className="section-title"><FaBookOpen /> Syllabus: Select Dept</h3><div className="dept-grid">{departments.map((dept) => (<motion.div key={dept.id} whileHover={{ scale: 1.05 }} onClick={() => setSyllabusBranch(dept.id)} className={`dept-card ${dept.color}`}><div className="dept-icon">{dept.icon}</div><h4>{dept.name}</h4><p>Select Scheme ➜</p></motion.div>))}</div></section>)}
             {syllabusBranch && !syllabusScheme && (<section><button onClick={() => setSyllabusBranch(null)} className="back-btn"><FaArrowLeft /> Back</button><h3 className="section-title">Select Scheme for {syllabusBranch}</h3><div className="dept-grid">{availableSchemes.length===0?<p>No Syllabus found.</p>:availableSchemes.map((scheme) => (<motion.div key={scheme} whileHover={{ scale: 1.05 }} onClick={() => setSyllabusScheme(scheme)} className="dept-card" style={{borderLeft:"5px solid #2563eb",padding:"30px"}}><h4>{scheme}</h4><p>View PDF ➜</p></motion.div>))}</div></section>)}
             {syllabusBranch && syllabusScheme && (<section><button onClick={() => setSyllabusScheme(null)} className="back-btn"><FaArrowLeft /> Back</button><h3 className="section-title">Download Syllabus</h3><div className="upload-card"><div className="upload-info"><h4>{syllabusBranch} - {syllabusScheme}</h4></div><button className="btn-download" onClick={() => window.open(currentSyllabusLink, '_blank')}><FaDownload /> PDF</button></div></section>)}
          </div>
        ) : activePage === "results" ? (
          <div className="content-column"><h3 className="section-title"><FaTrophy /> Check Results</h3><div className="dept-grid"><div className="dept-card card-blue" onClick={() => window.open('https://results.vtu.ac.in', '_blank')}><h4>7th & 8th Sem</h4></div><div className="dept-card card-green" onClick={() => window.open('https://results.vtu.ac.in', '_blank')}><h4>1st & 2nd Sem</h4></div></div></div>
        ) : (
          <div className="content-column">
            
            {currentBranch === "ALL" && (
              <div style={{marginBottom: "30px", padding: "0 10px"}}>
                <div style={{display: "flex", alignItems: "center", background: "white", padding: "12px 20px", borderRadius: "50px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", border: "1px solid #eee"}}>
                  <FaSearch style={{color: "#9ca3af", marginRight: "10px"}} />
                  <input type="text" placeholder="Search by Subject Code or Name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ border: "none", outline: "none", width: "100%", fontSize: "1rem", color: "#333"}} />
                </div>
              </div>
            )}

            {searchTerm.length > 0 ? (
               <section className="uploads-section">
                 <h3 className="section-title">🔍 Search Results</h3>
                 <div className="uploads-list">
                   {filteredSubjects.length === 0 ? (
                     <p style={{textAlign: "center", padding: "20px", color: "#666"}}>No notes found matching "{searchTerm}"</p>
                   ) : (
                     filteredSubjects.map((sub) => (
                      <div key={sub._id} className="upload-card">
                        <div className="upload-info"><h4>{sub.subject}</h4><small style={{color: "#3b82f6", fontWeight: "bold", marginRight: "10px"}}>{sub.subjectCode}</small><small>{sub.branch} | {sub.semester}th Sem</small></div>
                        <a href={sub.link} target="_blank" rel="noreferrer" className="btn-download"><FaDownload /></a>
                      </div>
                     ))
                   )}
                 </div>
               </section>
            ) : (
              <>
                {currentBranch === "ALL" && (
                  <section>
                    <h3 className="section-title">Departments</h3>
                    <div className="dept-grid">
                      {departments.map((dept) => (
                        <motion.div key={dept.id} whileHover={{ scale: 1.05 }} onClick={() => { setCurrentBranch(dept.id); setCurrentScheme(null); setCurrentSemester(null); }} className={`dept-card ${dept.color}`}>
                          <div className="dept-icon">{dept.icon}</div><h4>{dept.name}</h4>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* 👇 SKELETON LOADER SECTION */}
                    <section className="uploads-section">
                      <h3 className="section-title">Latest Updates</h3>
                      <div className="uploads-list">
                        {loading ? (
                          /* SHOW SKELETONS WHEN LOADING */
                          [1, 2, 3].map((n) => (
                            <div key={n} className="skeleton skeleton-card"></div>
                          ))
                        ) : (
                          /* SHOW REAL CONTENT WHEN LOADED */
                          subjects.slice(0,3).map(sub=>(
                            <div key={sub._id} className="upload-card">
                              <div className="upload-info"><h4>{sub.subject}</h4><small>{sub.branch} | {sub.scheme || "No Scheme"}</small></div>
                              <a href={sub.link} target="_blank" rel="noreferrer" className="btn-download"><FaDownload /></a>
                            </div>
                          ))
                        )}
                      </div>
                    </section>
                  </section>
                )}

                {currentBranch !== "ALL" && currentScheme === null && (<section><button onClick={() => setCurrentBranch("ALL")} className="back-btn"><FaArrowLeft /> Back</button><h3 className="section-title">Select Scheme for {currentBranch}</h3><div className="dept-grid">{["2024 Scheme", "2022 Scheme", "2021 Scheme", "2018 Scheme"].map((scheme) => (<motion.div key={scheme} whileHover={{ scale: 1.05 }} onClick={() => setCurrentScheme(scheme)} className="dept-card" style={{borderLeft: "5px solid #2563eb"}}><FaCalendarAlt style={{fontSize:"1.5rem", color:"#2563eb", marginBottom:"10px"}}/><h4>{scheme}</h4></motion.div>))}</div></section>)}

                {currentBranch !== "ALL" && currentScheme !== null && currentSemester === null && (<section><button onClick={() => setCurrentScheme(null)} className="back-btn"><FaArrowLeft /> Back</button><h3 className="section-title">Select Semester</h3><div className="dept-grid">{(currentBranch === "P-CYCLE" || currentBranch === "C-CYCLE" ? [1, 2] : [3, 4, 5, 6, 7, 8]).map((sem) => (<motion.div key={sem} whileHover={{ scale: 1.05 }} onClick={() => setCurrentSemester(sem)} className="dept-card"><h4>{sem}th Sem</h4></motion.div>))}</div></section>)}

                {currentBranch !== "ALL" && currentScheme !== null && currentSemester !== null && (
                  <section className="uploads-section">
                    <button onClick={() => setCurrentSemester(null)} className="back-btn"><FaArrowLeft /> Back</button>
                    <h3 className="section-title">{currentSemester}th Sem ({currentScheme}) - {currentBranch}</h3>
                    <div className="uploads-list">
                      {subjects.filter(sub => sub.branch === currentBranch && String(sub.semester) === String(currentSemester) && (sub.scheme && sub.scheme.trim() === currentScheme)).length === 0 ? (
                        <div style={{textAlign: "center", padding: "50px 20px", color: "#6b7280"}}>
                           <FaFolderOpen style={{fontSize: "3rem", color: "#d1d5db", marginBottom: "15px"}} />
                           <h3>No Notes Uploaded Yet</h3>
                           <p>We are updating this section. Check back soon!</p>
                        </div>
                      ) : (
                        subjects.filter(sub => sub.branch === currentBranch && String(sub.semester) === String(currentSemester) && (sub.scheme && sub.scheme.trim() === currentScheme)).map((sub) => (
                          <div key={sub._id} className="upload-card">
                            <div className="upload-info"><h4>{sub.subject}</h4><small style={{color: "#3b82f6", fontWeight: "bold"}}>{sub.subjectCode}</small></div>
                            <a href={sub.link} target="_blank" rel="noreferrer" className="btn-download"><FaDownload /></a>
                          </div>
                        ))
                      )}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        )}
        
        <div className="sidebar-column">
          <div className="sidebar-widget profile-widget">
            <div className="profile-img-container"><img src={process.env.PUBLIC_URL + '/manu.jpg'} onError={(e) => {e.target.onerror = null; e.target.src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}} alt="Manu Naik k" /></div>
            <h3>Manu Naik K</h3><p className="profile-role">Software Engineer</p><p className="profile-bio">Welcome! I help engineering students with Acurated notes and updates.</p>
            <div style={{display: "flex", justifyContent: "center", gap: "20px", marginTop: "15px"}}><a href="https://github.com/manunaik0555" target="_blank" rel="noreferrer" style={{color: "var(--text-color)", fontSize: "1.8rem"}}><FaGithub /></a><a href="https://www.linkedin.com/in/manu-naik-590364280/" target="_blank" rel="noreferrer" style={{color: "#0077b5", fontSize: "1.8rem"}}><FaLinkedin /></a></div>
          </div>
          
          {/* 👇 START OF HIRING WIDGET (NEW) 👇 */}
          <div className="sidebar-widget" style={{border: "2px dashed #e11d48", backgroundColor: "#fff1f2", padding: "15px", borderRadius: "10px", marginBottom: "20px"}}>
            <h3 style={{color: "#e11d48", display: "flex", alignItems: "center", gap: "10px", margin: "0 0 10px 0", fontSize: "1.1rem"}}>
              🔥 Urgent Requirement
            </h3>
            <p style={{fontSize: "0.9rem", color: "#374151", margin: "0 0 15px 0", lineHeight: "1.4"}}>
              We are looking for a developer to help <b>maintain the Backend & Source Code</b>.
            </p>
            <button 
              onClick={() => window.open('https://wa.me/918792837678?text=Hi%20Manu,%20I%20am%20interested%20in%20the%20Backend%20Role', '_blank')} 
              style={{
                  width: "100%", background: "#e11d48", color: "white", border: "none", padding: "10px", 
                  borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "0.9rem", transition: "background 0.2s"
              }}
              onMouseOver={(e) => e.target.style.background = "#be123c"}
              onMouseOut={(e) => e.target.style.background = "#e11d48"}
            >
              Apply / DM Me ➜
            </button>
          </div>
          {/* 👆 END OF HIRING WIDGET 👆 */}

          <div className="sidebar-widget" style={{borderTop: "4px solid #16a34a"}}>
            <h3 style={{color:"#16a34a", fontSize:"1.1rem"}}><FaFileUpload style={{marginRight:"5px"}}/> Upload Notes</h3>
            <p style={{fontSize:"0.85rem", color:"var(--text-light)", marginBottom:"10px"}}>Help your juniors! Share your PDF link.</p>
            <form onSubmit={handleContribSubmit} style={{display:"flex", flexDirection:"column", gap:"8px"}}>
              <input placeholder="Name (Optional)" value={contribData.name} onChange={e=>setContribData({...contribData, name:e.target.value})} className="input-field" />
              <div style={{display:"flex", gap:"5px"}}>
                <select value={contribData.branch} onChange={e=>setContribData({...contribData, branch:e.target.value, semester: (e.target.value==="P-CYCLE"||e.target.value==="C-CYCLE")?"1":"3"})} className="input-field" style={{flex:1}}><option value="CSE">CSE</option><option value="ECE">ECE</option><option value="CIVIL">CIVIL</option><option value="MECH">MECH</option><option value="P-CYCLE">P-CYCLE</option><option value="C-CYCLE">C-CYCLE</option></select>
                <select value={contribData.semester} onChange={e=>setContribData({...contribData, semester:e.target.value})} className="input-field" style={{width:"60px"}}>{(contribData.branch === "P-CYCLE" || contribData.branch === "C-CYCLE" ? [1, 2] : [3, 4, 5, 6, 7, 8]).map(s=><option key={s} value={s}>{s}</option>)}</select>
              </div>
              <select value={contribData.scheme} onChange={e=>setContribData({...contribData, scheme:e.target.value})} className="input-field"><option value="2024 Scheme">2024 Scheme</option><option value="2022 Scheme">2022 Scheme</option><option value="2021 Scheme">2021 Scheme</option><option value="2018 Scheme">2018 Scheme</option></select>
              <input placeholder="Subject" required value={contribData.subject} onChange={e=>setContribData({...contribData, subject:e.target.value})} className="input-field" />
              <input placeholder="Drive Link" required type="url" value={contribData.link} onChange={e=>setContribData({...contribData, link:e.target.value})} className="input-field" />
              <button type="submit" style={{background:"#16a34a", color:"white", padding:"8px", border:"none", borderRadius:"5px", cursor:"pointer", fontWeight:"bold"}}>Submit</button>
            </form>
          </div>

          {!isAdmin && (
            <>
              <div className="sidebar-widget gradient-widget"><h3>Join Community</h3><button className="btn-social whatsapp" onClick={() => window.open('https://chat.whatsapp.com/YOUR_LINK', '_blank')}><FaWhatsapp /> WhatsApp</button></div>
              <div className="sidebar-widget"><h3><FaCommentDots style={{color:"#2563eb", marginRight:"5px"}}/> Feedback</h3><form onSubmit={handleFeedbackSubmit} style={{display:"flex", flexDirection:"column", gap:"10px"}}><input placeholder="Name" value={feedback.name} onChange={e=>setFeedback({...feedback, name:e.target.value})} className="input-field"/><textarea placeholder="Message" value={feedback.message} onChange={e=>setFeedback({...feedback, message:e.target.value})} className="input-field"/><button type="submit" style={{background:"#2563eb", color:"white", padding:"8px", border:"none", borderRadius:"5px", cursor:"pointer"}}><FaPaperPlane size={12}/> Send</button></form></div>
            </>
          )}
        </div>
      </div>
      
      {!isAdmin && <Contact />}
      <footer className="footer"><p>© 2025 Designed and Developed by @ manunaik0555</p></footer>
      <CookieConsent />
    </div>
  );
}
export default App;