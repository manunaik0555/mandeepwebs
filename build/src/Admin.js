import React, { useState, useEffect } from 'react';
import { FaTrash, FaFileUpload } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast'; // 👈 Import Toast
import './App.css'; 

const Admin = () => {
  const [formData, setFormData] = useState({
    subject: "", subjectCode: "", branch: "CSE",
    scheme: "2022 Scheme", semester: "3", link: "", module: "1"
  });
  const [subjects, setSubjects] = useState([]);

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = () => {
    fetch('https://mandeepwebs.onrender.com/api/subjects')
      .then(res => res.json()).then(data => setSubjects(data))
      .catch(() => toast.error("Failed to load notes."));
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Uploading Note..."); // ⏳ Show Spinner

    try {
      const response = await fetch('https://mandeepwebs.onrender.com/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success("Note Uploaded Successfully! 🎉"); // ✅ Success Pop-up
        setFormData({ ...formData, subject: "", link: "", subjectCode: "" });
        fetchNotes();
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Upload Failed. Check internet."); // ❌ Error Pop-up
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this note?")) return;
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

  return (
    <div className="admin-container" style={{padding: "20px", maxWidth: "800px", margin: "0 auto"}}>
      <Toaster /> {/* 👈 REQUIRED: This renders the pop-ups */}
      <h2 style={{borderBottom: "2px solid #2563eb", paddingBottom: "10px"}}>Admin Panel 🛠️</h2>

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