
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './component/Header';
import HomePage from './component/HomePage';
import Category from './component/Category';
import Login from './component/Login';
import SignUp from './component/SignUp';
import AddProfessional from './component/AddProfessional';
import Professionals from './component/Professionals';
import ProfessionalPage from "./component/ProfessionalPage";
import CommentsSite from './component/CommentSite';

// function App() {
//   return <h1>שלום עולם!</h1>
// }

function App() {
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    const profileImage = localStorage.getItem("profileImage");
    if (userName) {
      setUser({ username: userName, profileImage });
    }
  }, []);

  const handleLoginSuccess = (data) => {
    const newUser = {
      username: data.userName,
      profileImage: data.profileImage || null,
    };
    setUser(newUser);
    localStorage.setItem("userName", newUser.username);
    if (newUser.profileImage) {
      localStorage.setItem("profileImage", newUser.profileImage);
    }
    setModalOpen(false);
  };

  const handleSignupSuccess = (data) => {
    handleLoginSuccess(data);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("profileImage");
    setUser(null);
    navigate("/"); // חזרה לדף הבית
  };

  return (
    <>
      <Header
        user={user}
        onLogout={handleLogout}
        onLoginClick={() => { setMode("login"); setModalOpen(true); }}
        onSignupClick={() => { setMode("signup"); setModalOpen(true); }}
      />

<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/AddProfessional" element={user ? <AddProfessional /> : <Navigate to="/" replace />} />
  <Route path="/Category" element={user ? <Category /> : <Navigate to="/" replace />} />
  <Route path="/comments" element={user ? <CommentsSite /> : <Navigate to="/" replace />} />

  <Route path="/professionals" element={user ? <Professionals /> : <Navigate to="/" replace />} />
  <Route path="/professional/:id" element={user ?<ProfessionalPage />: <Navigate to="/" replace/> } />
</Routes>

  
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setModalOpen(false)}>X</button>

            {mode === "login" ? (
              <>
                <Login onLoginSuccess={handleLoginSuccess} />
                <p>
                  עדיין אין לך חשבון?{" "}
                  <span onClick={() => setMode("signup")} style={{ color: "blue", cursor: "pointer" }}>
                    להרשמה
                  </span>
                </p>
              </>
            ) : (
              <>
                <SignUp onSignupSuccess={handleSignupSuccess} />
                <p>
                  כבר יש לך חשבון?{" "}
                  <span onClick={() => setMode("login")} style={{ color: "blue", cursor: "pointer" }}>
                    להתחברות
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;


