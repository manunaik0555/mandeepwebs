import React, { useState, useEffect } from 'react';
import { FaTrash, FaFileUpload, FaLock, FaUnlock } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import './App.css'; 

const Admin = () => {
  // 🔐 SECURITY STATE
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  // --- EXISTING STATE ---
  const [formData, setFormData] = useState({
    subject: "", subjectCode: "", branch: "CSE",
    scheme: "2022 Scheme", semester: "3", link: "", module: "1"
  });
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes();
    }
  }, [isAuthenticated]);

  const fetchNotes = () => {
    fetch('https://mandeepwebs.onrender.com/api/subjects')
      .then(res => res.json()).then(data => setSubjects(data))
      .catch(() => toast.error("Failed to load notes."));
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // 🔐 LOGIN FUNCTION
  const handleLogin = (e) => {
    e.preventDefault();
    // 👇 CHANGE YOUR PASSWORD HERE
    const MY_SECRET_PASSWORD = "manu"; 
    
    if (password === MY_SECRET_PASSWORD) {
        setIsAuthenticated(true);
        toast.success("Welcome Back, Manu!");
    } else {
        toast.error("Wrong Password! ❌");
    }
  };

  // --- UPLOAD FUNCTION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Uploading Note...");

    try {
      const response = await fetch('https://mandeepwebs.onrender.com/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success("Note Uploaded Successfully! 🎉");
        setFormData({ ...formData, subject: "", link: "", subjectCode: "" });
        fetchNotes();
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Upload Failed.");
    }
  };

  // --- DELETE FUNCTION ---
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this note?")) return;
    const loadingToast = toast.loading("Deleting...");
    try {
      await fetch(`https://mandeepwebs.onrender.com/api/subjects/${id}`, { method: 'DELETE' });
      toast.dismiss(loadingToast);
      toast.success("Note Deleted!");
      fetchNotes();
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Could not delete.");
    }
  };

  // 🛑 IF NOT LOGGED IN, SHOW LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", 
          height: "50vh", textAlign: "center", gap: "20px"
      }}>
          <Toaster />
          <div style={{background: "white", padding: "40px", borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)"}}>
              <FaLock style={{fontSize: "3rem", color: "#ef4444", marginBottom: "15px"}} />
              <h2>Admin Login</h2>
              <p>Please enter the password to manage notes.</p>
              
              <form onSubmit={handleLogin} style={{display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px"}}>
                  <input 
                    type="password" 
                    placeholder="Enter Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    style={{padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "1rem"}}
                  />
                  <button type="submit" style={{background: "#2563eb", color: "white", padding: "12px", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "1rem"}}>
                      <FaUnlock /> Unlock Panel
                  </button>
              </form>
          </div>
      </div>
    );
  }

  // ✅ IF LOGGED IN, SHOW ADMIN PANEL
  return (
    <div className="admin-container" style={{padding: "20px", maxWidth: "800px", margin: "0 auto"}}>
      <Toaster />
      <h2 style={{borderBottom: "2px solid #2563eb", paddingBottom: "10px", display: "flex", alignItems: "center", gap: "10px"}}>
        Admin Panel 🛠️ <span style={{fontSize: "0.8rem", background: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: "10px"}}>Logged In</span>
      </h2>

      {/* UPLOAD FORM */}
      <div className="upload-box" style={{background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", marginBottom: "40px"}}>
        <h3>Upload New Note</h3>
        <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: "15px"}}>
            <div style={{display: "flex", gap: "10px"}}>
                <div style={{flex: 1}}>
                    <label>Branch</label>
                    <select name="branch" value={formData.branch} onChange={handleChange} className="input-field" style={{width: "100%"}}>
                        <option value="CSE">CSE</option><option value="ECE">ECE</option><option value="CIVIL">CIVIL</option><option value="MECH">MECH</option><option value="P-CYCLE">P-CYCLE</option><option value="C-CYCLE">C-CYCLE</option>
                    </select>
                </div>
                <div style={{flex: 1}}>
                    <label>Semester</label>
                    <select name="semester" value={formData.semester} onChange={handleChange} className="input-field" style={{width: "100%"}}>
                        {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}th Sem</option>)}
                    </select>
                </div>
            </div>
            <div>
                <label>Scheme</label>
                <select name="scheme" value={formData.scheme} onChange={handleChange} className="input-field" style={{width: "100%", border: "2px solid #2563eb"}}>
                    <option value="2022 Scheme">2022 Scheme</option><option value="2021 Scheme">2021 Scheme</option><option value="2018 Scheme">2018 Scheme</option><option value="2024 Scheme">2024 Scheme</option>
                </select>
            </div>
            <input name="subject" placeholder="Subject Name" value={formData.subject} onChange={handleChange} className="input-field" required />
            <input name="subjectCode" placeholder="Subject Code" value={formData.subjectCode} onChange={handleChange} className="input-field" />
            <input name="link" placeholder="Drive Link / URL" value={formData.link} onChange={handleChange} className="input-field" required />
            <button type="submit" className="btn-primary" style={{background: "#16a34a", color: "white", padding: "12px", border: "none", borderRadius: "8px", cursor: "pointer"}}>
                <FaFileUpload /> Upload Note
            </button>
        </form>
      </div>

      {/* NOTES LIST */}
      <h3>Manage Existing Notes ({subjects.length})</h3>
      <div style={{maxHeight: "500px", overflowY: "auto", border: "1px solid #ddd", borderRadius: "8px"}}>
        {subjects.slice().reverse().map((sub) => (
            <div key={sub._id} style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", borderBottom: "1px solid #eee", background: "white"}}>
                <div>
                    <h4 style={{margin: 0}}>{sub.subject}</h4>
                    <small style={{color: "#666"}}>{sub.branch} | {sub.semester}th Sem | <b style={{color: "blue"}}>{sub.scheme || "MISSING"}</b></small>
                </div>
                <button onClick={() => handleDelete(sub._id)} style={{background: "red", color: "white", border: "none", padding: "8px", borderRadius: "5px", cursor: "pointer"}}><FaTrash /></button>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;