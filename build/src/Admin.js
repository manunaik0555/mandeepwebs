import React, { useState, useEffect } from 'react';
import { 
  FaTrash, FaCheck, FaPlus, FaList, FaBell, FaCommentDots, 
  FaLock, FaKey, FaSignOutAlt, FaChartPie, FaFileAlt, FaUserGraduate, FaSync 
} from 'react-icons/fa';
import './App.css'; 

function Admin() {
  // --- AUTH STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const ADMIN_PASSWORD = "manu"; 

  // --- DATA STATE ---
  const [subjects, setSubjects] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  
  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState("dashboard"); 
  const [status, setStatus] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false); // New state for refresh spin

  // --- FORM STATE ---
  const [newSubject, setNewSubject] = useState({ 
    branch: "CSE", scheme: "2022 Scheme", semester: "3", subject: "", subjectCode: "", link: "" 
  });

  // --- FETCH DATA ---
  // 1. Fetch on Login
  useEffect(() => { 
    if(isAuthenticated) fetchData(); 
  }, [isAuthenticated]);

  // 2. AUTO-REFRESH: Check for updates every 10 seconds
  useEffect(() => {
    if(!isAuthenticated) return;
    const interval = setInterval(() => {
      fetchData(true); // true = silent refresh (don't show big loading spinner)
    }, 10000); // 10000ms = 10 seconds
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const fetchData = async (silent = false) => {
    if(!silent) setIsRefreshing(true);
    try {
        const [subRes, reqRes, feedRes] = await Promise.all([
            fetch('https://mandeepwebs.onrender.com/api/subjects'),
            fetch('https://mandeepwebs.onrender.com/api/contribute'),
            fetch('https://mandeepwebs.onrender.com/api/feedback')
        ]);
        
        const subData = await subRes.json();
        const reqData = await reqRes.json();
        const feedData = await feedRes.json();

        setSubjects(subData);
        setContributions(reqData);
        setFeedbacks(feedData);
    } catch(err) {
        console.error("Error fetching data:", err);
    }
    if(!silent) setIsRefreshing(false);
  };

  // --- LOGIN ---
  const handleLogin = (e) => {
    e.preventDefault();
    if(passwordInput === ADMIN_PASSWORD) setIsAuthenticated(true);
    else { setAuthError("❌ Wrong Password"); setPasswordInput(""); }
  };

  // --- HANDLERS ---
  const handleAddSubject = async (e) => {
    e.preventDefault(); setStatus("Adding...");
    try {
        await fetch('https://mandeepwebs.onrender.com/api/subjects', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(newSubject) });
        setStatus("✅ Note Added Successfully!"); setNewSubject({ ...newSubject, subject: "", subjectCode: "", link: "" }); fetchData();
    } catch(err) { setStatus("❌ Error Adding Note"); }
  };
  const handleDeleteSubject = async (id) => { if(!window.confirm("Delete this note permanently?")) return; await fetch(`https://mandeepwebs.onrender.com/api/subjects/${id}`, { method: 'DELETE' }); fetchData(); };

  const handleApprove = async (contrib) => {
    if (!window.confirm(`Approve ${contrib.subject}?`)) return; setStatus("Approving...");
    const subjectData = { branch: contrib.branch, scheme: contrib.scheme || "2022 Scheme", semester: contrib.semester, subject: contrib.subject, subjectCode: "CONTRIB", link: contrib.link };
    await fetch('https://mandeepwebs.onrender.com/api/subjects', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(subjectData) });
    await fetch(`https://mandeepwebs.onrender.com/api/contribute/${contrib._id}`, { method: 'DELETE' });
    setStatus("✅ Request Approved!"); fetchData();
  };
  const handleDeleteContrib = async (id) => { if(!window.confirm("Reject request?")) return; await fetch(`https://mandeepwebs.onrender.com/api/contribute/${id}`, { method: 'DELETE' }); fetchData(); };
  const handleDeleteFeedback = async (id) => { if(!window.confirm("Delete message?")) return; await fetch(`https://mandeepwebs.onrender.com/api/feedback/${id}`, { method: 'DELETE' }); fetchData(); };


  // ==========================
  // VIEW 1: LOGIN SCREEN
  // ==========================
  if (!isAuthenticated) {
    return (
      <div className="login-wrapper">
        <div className="login-box">
          <div className="login-icon"><FaLock /></div>
          <h2>Admin Portal</h2>
          <p>Restricted Access</p>
          <form onSubmit={handleLogin}>
            <input type="password" placeholder="Enter Password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} autoFocus />
            <button type="submit">Unlock Dashboard</button>
          </form>
          {authError && <p className="error-msg">{authError}</p>}
        </div>
      </div>
    );
  }

  // ==========================
  // VIEW 2: DASHBOARD UI
  // ==========================
  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h3>Admin Panel</h3>
        </div>
        <ul className="sidebar-menu">
          <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}><FaChartPie /> Dashboard</li>
          <li className={activeTab === 'requests' ? 'active' : ''} onClick={() => setActiveTab('requests')}>
            <FaBell /> Requests {contributions.length > 0 && <span className="badge">{contributions.length}</span>}
          </li>
          <li className={activeTab === 'feedback' ? 'active' : ''} onClick={() => setActiveTab('feedback')}>
            <FaCommentDots /> Feedback {feedbacks.length > 0 && <span className="badge">{feedbacks.length}</span>}
          </li>
          <li className={activeTab === 'database' ? 'active' : ''} onClick={() => setActiveTab('database')}><FaList /> Manage Notes</li>
          <li className={activeTab === 'add' ? 'active' : ''} onClick={() => setActiveTab('add')}><FaPlus /> Add Note</li>
          <li className="logout-btn" onClick={() => setIsAuthenticated(false)}><FaSignOutAlt /> Logout</li>
        </ul>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="dashboard-content">
        <div className="content-header">
          <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
          <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
             {status && <div className="status-toast">{status}</div>}
             {/* REFRESH BUTTON */}
             <button onClick={() => fetchData()} style={{background:"transparent", border:"none", cursor:"pointer", color: isRefreshing ? "#2563eb" : "#64748b", fontSize:"1.2rem", transition:"0.3s"}}>
                <FaSync className={isRefreshing ? "spin-anim" : ""} />
             </button>
          </div>
        </div>

        {/* --- TAB: DASHBOARD OVERVIEW --- */}
        {activeTab === 'dashboard' && (
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-icon"><FaFileAlt /></div>
              <div className="stat-info"><h3>{subjects.length}</h3><p>Total Notes</p></div>
            </div>
            <div className="stat-card orange">
              <div className="stat-icon"><FaBell /></div>
              <div className="stat-info"><h3>{contributions.length}</h3><p>Pending Requests</p></div>
            </div>
            <div className="stat-card green">
              <div className="stat-icon"><FaUserGraduate /></div>
              <div className="stat-info"><h3>{feedbacks.length}</h3><p>User Messages</p></div>
            </div>
          </div>
        )}

        {/* --- TAB: REQUESTS --- */}
        {activeTab === 'requests' && (
          <div className="data-panel">
            {contributions.length === 0 ? <div className="empty-state">All caught up! No pending requests.</div> : (
              contributions.map(req => (
                <div key={req._id} className="data-row request-row">
                  <div className="data-info">
                    <strong>{req.subject}</strong>
                    <span>{req.branch} • {req.semester}th Sem • {req.scheme}</span>
                    <small>By: {req.name || "Anonymous"}</small>
                  </div>
                  <div className="data-actions">
                    <a href={req.link} target="_blank" rel="noreferrer" className="btn-link">View PDF</a>
                    <button onClick={() => handleApprove(req)} className="btn-icon green"><FaCheck /></button>
                    <button onClick={() => handleDeleteContrib(req._id)} className="btn-icon red"><FaTrash /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* --- TAB: FEEDBACK --- */}
        {activeTab === 'feedback' && (
          <div className="data-panel">
            {feedbacks.length === 0 ? <div className="empty-state">No messages received.</div> : (
              feedbacks.map(msg => (
                <div key={msg._id} className="data-row">
                  <div className="data-info">
                    <strong>{msg.name || "Anonymous"}</strong>
                    <p>"{msg.message}"</p>
                    <small>{new Date(msg.date).toLocaleDateString()}</small>
                  </div>
                  <button onClick={() => handleDeleteFeedback(msg._id)} className="btn-icon red"><FaTrash /></button>
                </div>
              ))
            )}
          </div>
        )}

        {/* --- TAB: DATABASE (MANAGE NOTES) --- */}
        {activeTab === 'database' && (
          <div className="data-panel">
            {subjects.map(sub => (
              <div key={sub._id} className="data-row">
                <div className="data-info">
                  <strong>{sub.subject}</strong>
                  <span>{sub.branch} • {sub.semester}th Sem • {sub.subjectCode}</span>
                </div>
                <div className="data-actions">
                  <a href={sub.link} target="_blank" rel="noreferrer" className="btn-link">Check Link</a>
                  <button onClick={() => handleDeleteSubject(sub._id)} className="btn-icon red"><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- TAB: ADD NOTE --- */}
        {activeTab === 'add' && (
          <div className="form-card">
            <h3>Add New Subject Manually</h3>
            <form onSubmit={handleAddSubject}>
              <div className="form-group">
                <label>Branch & Semester</label>
                <div className="row">
                  <select value={newSubject.branch} onChange={e=>setNewSubject({...newSubject, branch:e.target.value})}>
                     <option value="CSE">CSE</option><option value="ECE">ECE</option><option value="CIVIL">CIVIL</option><option value="MECH">MECH</option><option value="P-CYCLE">P-CYCLE</option><option value="C-CYCLE">C-CYCLE</option>
                  </select>
                  <select value={newSubject.semester} onChange={e=>setNewSubject({...newSubject, semester:e.target.value})}>
                    {[1,2,3,4,5,6,7,8].map(n=><option key={n} value={n}>{n}th Sem</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group"><label>Subject Name</label><input value={newSubject.subject} onChange={e=>setNewSubject({...newSubject, subject:e.target.value})} required placeholder="e.g. Mathematics III" /></div>
              <div className="form-group"><label>Subject Code</label><input value={newSubject.subjectCode} onChange={e=>setNewSubject({...newSubject, subjectCode:e.target.value})} placeholder="e.g. 21MAT31" /></div>
              <div className="form-group"><label>Google Drive Link</label><input value={newSubject.link} onChange={e=>setNewSubject({...newSubject, link:e.target.value})} required placeholder="https://..." /></div>
              <button type="submit" className="btn-primary">Add Note to Database</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;