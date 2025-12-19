import React, { useState, useEffect } from 'react';
import { FaTrash, FaFileUpload, FaLock, FaUnlock, FaCommentDots } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import './App.css'; 

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const [formData, setFormData] = useState({
    subject: "", subjectCode: "", branch: "CSE",
    scheme: "2022 Scheme", semester: "3", link: "", module: "1"
  });
  
  const [subjects, setSubjects] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]); // 👈 Store messages here

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes();
      fetchFeedback(); // 👈 Fetch messages when logged in
    }
  }, [isAuthenticated]);

  const fetchNotes = () => {
    fetch('https://mandeepwebs.onrender.com/api/subjects')
      .then(res => res.json()).then(data => setSubjects(data));
  };

  // 👇 NEW FUNCTION TO FETCH FEEDBACK
  const fetchFeedback = () => {
    fetch('https://mandeepwebs.onrender.com/api/feedback')
      .then(res => res.json())
      .then(data => setFeedbacks(data))
      .catch(err => console.error("Error loading feedback:", err));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const MY_SECRET_PASSWORD = "manu"; 
    if (password === MY_SECRET_PASSWORD) {
        setIsAuthenticated(true);
        toast.success("Welcome Back!");
    } else {
        toast.error("Wrong Password!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Uploading...");
    await fetch('https://mandeepwebs.onrender.com/api/subjects', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
    });
    toast.dismiss(loadingToast);
    toast.success("Uploaded!");
    setFormData({ ...formData, subject: "", link: "", subjectCode: "" });
    fetchNotes();
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete note?")) {
      await fetch(`https://mandeepwebs.onrender.com/api/subjects/${id}`, { method: 'DELETE' });
      toast.success("Deleted!");
      fetchNotes();
    }
  };

  // 👇 NEW FUNCTION TO DELETE FEEDBACK
  const handleDeleteFeedback = async (id) => {
    if(window.confirm("Delete this message?")) {
        await fetch(`https://mandeepwebs.onrender.com/api/feedback/${id}`, { method: 'DELETE' });
        toast.success("Message Deleted");
        fetchFeedback();
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  if (!isAuthenticated) {
    return (
      <div style={{height: "50vh", display: "flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
          <Toaster />
          <h2><FaLock /> Admin Login</h2>
          <form onSubmit={handleLogin} style={{display:"flex", gap:"10px", marginTop:"20px"}}>
             <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{padding:"10px"}}/>
             <button type="submit">Unlock</button>
          </form>
      </div>
    );
  }

  return (
    <div className="admin-container" style={{padding: "20px", maxWidth: "800px", margin: "0 auto"}}>
      <Toaster />
      <h2 style={{borderBottom: "2px solid #2563eb", paddingBottom: "10px"}}>Admin Panel 🛠️</h2>

      {/* UPLOAD FORM */}
      <div className="upload-box" style={{background: "white", padding: "20px", borderRadius: "10px", marginBottom: "40px"}}>
        <h3>Upload Note</h3>
        <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            <select name="branch" value={formData.branch} onChange={handleChange} className="input-field">
                <option value="CSE">CSE</option><option value="ECE">ECE</option><option value="CIVIL">CIVIL</option><option value="MECH">MECH</option><option value="P-CYCLE">P-CYCLE</option><option value="C-CYCLE">C-CYCLE</option>
            </select>
            <select name="scheme" value={formData.scheme} onChange={handleChange} className="input-field">
                <option value="2022 Scheme">2022 Scheme</option><option value="2021 Scheme">2021 Scheme</option><option value="2018 Scheme">2018 Scheme</option><option value="2024 Scheme">2024 Scheme</option>
            </select>
            <select name="semester" value={formData.semester} onChange={handleChange} className="input-field">
                 {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}th Sem</option>)}
            </select>
            <input name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} className="input-field" required />
            <input name="link" placeholder="Link" value={formData.link} onChange={handleChange} className="input-field" required />
            <button type="submit" className="btn-primary" style={{background:"#16a34a", color:"white", padding:"10px"}}>Upload</button>
        </form>
      </div>

      {/* 👇👇👇 NEW FEEDBACK SECTION 👇👇👇 */}
      <h3 style={{marginTop: "40px", color: "#2563eb"}}><FaCommentDots /> Student Feedback ({feedbacks.length})</h3>
      <div style={{maxHeight: "300px", overflowY: "auto", border: "1px solid #ddd", borderRadius: "8px", background: "#f9fafb", marginBottom: "40px"}}>
         {feedbacks.length === 0 ? <p style={{padding:"20px", textAlign:"center"}}>No messages yet.</p> : 
            feedbacks.map((msg) => (
                <div key={msg._id} style={{padding: "15px", borderBottom: "1px solid #eee", background: "white", display:"flex", justifyContent:"space-between"}}>
                    <div>
                        <h4 style={{margin: "0 0 5px 0", color: "#333"}}>{msg.name || "Anonymous"}</h4>
                        <p style={{margin: 0, color: "#555"}}>{msg.message}</p>
                        <small style={{color: "#999"}}>{new Date(msg.date).toLocaleDateString()}</small>
                    </div>
                    <button onClick={() => handleDeleteFeedback(msg._id)} style={{background: "red", color: "white", border: "none", height:"30px", borderRadius: "5px", cursor: "pointer"}}>
                        <FaTrash />
                    </button>
                </div>
            ))
         }
      </div>

      {/* NOTES LIST */}
      <h3>Manage Notes ({subjects.length})</h3>
      <div style={{maxHeight: "400px", overflowY: "auto", border: "1px solid #ddd", borderRadius: "8px"}}>
        {subjects.slice().reverse().map((sub) => (
            <div key={sub._id} style={{display: "flex", justifyContent: "space-between", padding: "15px", borderBottom: "1px solid #eee", background: "white"}}>
                <span>{sub.subject} ({sub.branch})</span>
                <button onClick={() => handleDelete(sub._id)} style={{color: "red"}}><FaTrash /></button>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;