import React, { useState } from 'react';
import { 
  FaUserShield, FaTrash, FaLock, FaUser, FaExclamationCircle, 
  FaCheck, FaTimes, FaCloudUploadAlt 
} from 'react-icons/fa';

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  const [feedbacks, setFeedbacks] = useState([]); 
  const [allNotes, setAllNotes] = useState([]); 
  const [contributions, setContributions] = useState([]); 
  const [activeTab, setActiveTab] = useState("upload"); 

  const [noteData, setNoteData] = useState({ branch: 'CSE', scheme: '2022 Scheme', semester: 3, subject: '', subjectCode: '', link: '' });
  const [syllabusData, setSyllabusData] = useState({ branch: 'CSE', semester: '3', scheme: '2022 Scheme', link: '' });
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setLoginError("");
    try {
      const res = await fetch('https://mandeepwebs.onrender.com/api/login', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ username, password }) 
      });
      const data = await res.json();
      if (data.success) { 
        setIsLoggedIn(true); setCurrentUser(data.username); fetchFeedback(); fetchNotes(); fetchContributions(); 
      } else { 
        setLoginError("Invalid Credentials"); 
      }
    } catch (err) { 
      setLoginError("Server Error"); 
    }
  };

  const fetchFeedback = async () => { try { const res = await fetch('https://mandeepwebs.onrender.com/api/feedback'); setFeedbacks(await res.json()); } catch (err) {} };
  const fetchNotes = async () => { try { const res = await fetch('https://mandeepwebs.onrender.com/api/subjects'); setAllNotes(await res.json()); } catch (err) {} };
  const fetchContributions = async () => { try { const res = await fetch('https://mandeepwebs.onrender.com/api/contribute'); setContributions(await res.json()); } catch (err) {} };
  const handleDeleteFeedback = async (id) => { if (window.confirm("Delete?")) { await fetch(`https://mandeepwebs.onrender.com/api/feedback/${id}`, { method: 'DELETE' }); setFeedbacks(feedbacks.filter(msg => msg._id !== id)); }};
  const handleDeleteNote = async (id) => { if (window.confirm("Delete?")) { await fetch(`https://mandeepwebs.onrender.com/api/subjects/${id}`, { method: 'DELETE' }); setAllNotes(allNotes.filter(n => n._id !== id)); }};

  const handleApprove = async (item) => {
    if(!window.confirm("Approve?")) return;
    await fetch('https://mandeepwebs.onrender.com/api/subjects', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ branch: item.branch, scheme: item.scheme || "2022 Scheme", semester: item.semester, subject: item.subject, subjectCode: "USER", link: item.link }) });
    await fetch(`https://mandeepwebs.onrender.com/api/contribute/${item._id}`, { method: 'DELETE' });
    setContributions(contributions.filter(c => c._id !== item._id)); fetchNotes(); alert("✅ Approved!");
  };
  const handleReject = async (id) => { if(window.confirm("Reject?")) { await fetch(`https://mandeepwebs.onrender.com/api/contribute/${id}`, { method: 'DELETE' }); setContributions(contributions.filter(c => c._id !== id)); }};

  const handleNoteUpload = async (e) => { e.preventDefault(); await fetch('https://mandeepwebs.onrender.com/api/subjects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(noteData) }); setMessage("✅ Note Uploaded!"); fetchNotes(); };
  const handleSyllabusUpload = async (e) => { e.preventDefault(); await fetch('https://mandeepwebs.onrender.com/api/syllabus', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(syllabusData) }); setMessage("✅ Syllabus Uploaded!"); };

  if (!isLoggedIn) {
    return (
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-icon-container"><FaUserShield /></div>
          <h2 className="login-title">Admin Portal</h2>
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group"><FaUser className="input-icon" /><input type="text" className="login-input" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} /></div>
            <div className="input-group"><FaLock className="input-icon" /><input type="password" className="login-input" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
            <button type="submit" className="login-btn">Login</button>
          </form>
          {loginError && <div className="error-msg"><FaExclamationCircle /> {loginError}</div>}
        </div>
      </div>
    );
  }

  return (
    <div style={{padding:"20px", maxWidth:"1000px", margin:"0 auto"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"30px"}}><h3>👋 {currentUser}</h3><button onClick={()=>setIsLoggedIn(false)} style={{background:"#fee2e2", color:"#dc2626", border:"none", padding:"8px 15px", borderRadius:"5px", cursor:"pointer"}}>Logout</button></div>
      <div style={{display:"flex", gap:"10px", marginBottom:"20px", flexWrap:"wrap"}}>
        <button onClick={()=>setActiveTab("upload")} style={{padding:"10px 20px", borderRadius:"8px", border:"none", background: activeTab==="upload"?"#2563eb":"#e2e8f0", color: activeTab==="upload"?"white":"black", cursor:"pointer"}}>Upload</button>
        <button onClick={()=>setActiveTab("manage")} style={{padding:"10px 20px", borderRadius:"8px", border:"none", background: activeTab==="manage"?"#2563eb":"#e2e8f0", color: activeTab==="manage"?"white":"black", cursor:"pointer"}}>Manage</button>
        <button onClick={()=>setActiveTab("syllabus")} style={{padding:"10px 20px", borderRadius:"8px", border:"none", background: activeTab==="syllabus"?"#9333ea":"#e2e8f0", color: activeTab==="syllabus"?"white":"black", cursor:"pointer"}}>Syllabus</button>
        <button onClick={()=>setActiveTab("contrib")} style={{padding:"10px 20px", borderRadius:"8px", border:"none", background: activeTab==="contrib"?"#f59e0b":"#e2e8f0", color: activeTab==="contrib"?"white":"black", cursor:"pointer"}}>Reviews ({contributions.length})</button>
      </div>

      {activeTab === "upload" && (
         <div style={{background:"white", padding:"30px", borderRadius:"15px", border:"1px solid #e5e7eb"}}>
            <form onSubmit={handleNoteUpload} style={{display:"flex", flexDirection:"column", gap:"15px"}}>
              <h3 style={{color:"#2563eb"}}><FaCloudUploadAlt/> Upload Note</h3>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px"}}>
                 <select value={noteData.branch} onChange={e=>setNoteData({...noteData, branch:e.target.value, semester: (e.target.value==="P-CYCLE"||e.target.value==="C-CYCLE")?1:3})} className="input-field"><option value="CSE">CSE</option><option value="ECE">ECE</option><option value="MECH">MECH</option><option value="CIVIL">CIVIL</option><option value="P-CYCLE">P-CYCLE</option><option value="C-CYCLE">C-CYCLE</option></select>
                 <select value={noteData.semester} onChange={e=>setNoteData({...noteData,semester:e.target.value})} className="input-field">{(noteData.branch==="P-CYCLE"||noteData.branch==="C-CYCLE" ? [1,2] : [3,4,5,6,7,8]).map(s=><option key={s} value={s}>{s}th Sem</option>)}</select>
              </div>
              <select value={noteData.scheme} onChange={e=>setNoteData({...noteData,scheme:e.target.value})} className="input-field"><option value="2024 Scheme">2024 Scheme</option><option value="2022 Scheme">2022 Scheme</option><option value="2021 Scheme">2021 Scheme</option><option value="2018 Scheme">2018 Scheme</option></select>
              <input placeholder="Subject" value={noteData.subject} onChange={e=>setNoteData({...noteData,subject:e.target.value})} className="input-field" required/>
              <input placeholder="Code" value={noteData.subjectCode} onChange={e=>setNoteData({...noteData,subjectCode:e.target.value})} className="input-field" required/>
              <input placeholder="Link" value={noteData.link} onChange={e=>setNoteData({...noteData,link:e.target.value})} className="input-field" required/>
              <button type="submit" style={{padding:"10px", background:"#16a34a", color:"white", border:"none", borderRadius:"5px"}}>Upload</button>
            </form>
            {message && <p style={{marginTop:"15px", fontWeight:"bold", color:"green"}}>{message}</p>}
         </div>
      )}

      {activeTab === "manage" && (
        <div style={{background:"white", padding:"20px", borderRadius:"15px", border:"1px solid #e5e7eb", maxHeight:"600px", overflowY:"auto"}}>
           <h3>Manage Files</h3>{allNotes.map(n => (<div key={n._id} style={{display:"flex",justifyContent:"space-between",padding:"10px",borderBottom:"1px solid #eee"}}><div><strong>{n.subject}</strong> <small>({n.branch} - {n.scheme})</small></div><button onClick={()=>handleDeleteNote(n._id)} style={{background:"#fee2e2",color:"red",border:"none",padding:"5px 10px",borderRadius:"5px"}}><FaTrash/></button></div>))}
        </div>
      )}

      {activeTab === "contrib" && (
        <div style={{background:"white", padding:"20px", borderRadius:"15px", border:"1px solid #e5e7eb"}}><h3>Contributions</h3>{contributions.map(c=>(<div key={c._id} style={{background:"#fff7ed",padding:"10px",marginBottom:"10px",borderRadius:"5px",display:"flex",justifyContent:"space-between"}}><div><strong>{c.subject}</strong> <small>({c.branch}, {c.semester}th)</small></div><div><button onClick={()=>handleApprove(c)} style={{background:"green",color:"white",border:"none",padding:"5px"}}><FaCheck/></button><button onClick={()=>handleReject(c._id)} style={{background:"red",color:"white",border:"none",padding:"5px"}}><FaTimes/></button></div></div>))}</div>
      )}

      {activeTab === "syllabus" && (
        <div style={{background:"white", padding:"30px", borderRadius:"15px", border:"1px solid #e5e7eb"}}>
           <form onSubmit={handleSyllabusUpload} style={{display:"flex", flexDirection:"column", gap:"15px"}}><h3 style={{color:"#9333ea"}}>Upload Syllabus</h3><div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px"}}><select value={syllabusData.branch} onChange={e=>setSyllabusData({...syllabusData, branch:e.target.value})} className="input-field"><option value="CSE">CSE</option><option value="ECE">ECE</option><option value="MECH">MECH</option><option value="CIVIL">CIVIL</option></select><select value={syllabusData.semester} onChange={e=>setSyllabusData({...syllabusData, semester:e.target.value})} className="input-field"><option value="ALL">All Semesters</option>{[1,2,3,4,5,6,7,8].map(s=><option key={s} value={s}>{s}</option>)}</select></div><select value={syllabusData.scheme} onChange={e=>setSyllabusData({...syllabusData, scheme:e.target.value})} className="input-field"><option value="2024 Scheme">2024 Scheme</option><option value="2022 Scheme">2022 Scheme</option></select><input placeholder="PDF Link" value={syllabusData.link} onChange={e=>setSyllabusData({...syllabusData, link:e.target.value})} className="input-field" /><button type="submit" style={{padding:"10px", background:"#9333ea", color:"white", border:"none", borderRadius:"5px"}}>Upload</button></form>
           {message && <p>{message}</p>}
        </div>
      )}
      
      {/* Feedback Section with proper variable use */}
      <div style={{marginTop:"30px",padding:"20px",background:"#fdf2f8", borderRadius:"10px"}}>
        <h3>Feedback from Students</h3>
        {feedbacks.map(f=><div key={f._id} style={{display:"flex",justifyContent:"space-between",marginBottom:"10px", padding:"10px", background:"white", borderRadius:"5px"}}><span><strong>{f.name}:</strong> {f.message}</span><FaTrash onClick={()=>handleDeleteFeedback(f._id)} style={{color:"red",cursor:"pointer"}}/></div>)}
      </div>
    </div>
  );
}
export default Admin;