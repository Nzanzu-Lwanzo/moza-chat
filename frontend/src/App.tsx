import "./App.scss";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Chat from "./pages/Chat";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/chat" Component={Chat} />
          <Route path="/client/auth/">
            <Route path="login" Component={LogIn} />
            <Route path="signup" Component={SignUp} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
