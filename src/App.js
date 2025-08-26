import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/homepage";
import { LoginSignup } from "./components/login-signup";
import { Navbar } from "./components/Navbar";
import { Profile } from "./components/Profile";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Register } from "./components/register";
import { UpdateProfile } from "./components/UpdateProfile";
import { VerifyOtp } from "./components/verifyotp";

import ScrollToTop from "./components/ScrollToTop";
import ProtectedAdmin from "./components/ProtectedAdmin";

function App() {
  return (
    <Router>
      <div className="App">
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          
          <Route path="/updateprofile" element={<UpdateProfile />} />
         
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/" element={<HomePage />} />


          {/* Admin */}
          <Route element={<ProtectedAdmin />}>
            {/* <Route path="/admin" element={<AdminPanel />} /> */}
          </Route>

          <Route
            path="/updateprofile"
            element={
              <ProtectedRoute>
                <UpdateProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;