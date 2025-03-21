
// import { useState } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { signInWithGoogle, logOut } from "./firebase";
// import Home from "./Pages/Home"
// import Dashboard from "./Pages/Dashboard"
// import TaskGroupPage from "./Pages/TaskGroup/TaskGroup";

// function App() {
//     const [user, setUser] = useState(null);

//     const handleLogin = async () => {
//         const loggedInUser = await signInWithGoogle();
//         setUser(loggedInUser);
//     };

//     const handleLogout = async () => {
//         await logOut();
//         setUser(null);
//     };

//     return (
//         <Router>
//             <Routes>
//                 <Route
//                     path="/"
//                     element={
//                         user ? (
//                             <Navigate to="/dashboard" />
//                         ) : (
//                             <Home handleLogin={handleLogin} />
//                         )
//                     }
//                 />
//                 <Route
//                     path="/dashboard"
//                     element={
//                         user ? (
//                             <Dashboard user={user} handleLogout={handleLogout} />
//                         ) : (
//                             <Navigate to="/" />
//                         )
//                     }
//                 />
//             </Routes>
//         </Router>
//     );
// }

// export default App;
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { signInWithGoogle, logOut } from "./firebase";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";

function App() {
    const [user, setUser] = useState(null);

    const handleLogin = async () => {
        const loggedInUser = await signInWithGoogle();
        setUser(loggedInUser);
    };

    const handleLogout = async () => {
        await logOut();
        setUser(null);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home handleLogin={handleLogin} />} />
                <Route path="/dashboard/*" element={user ? <Dashboard user={user} handleLogout={handleLogout} /> : <Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
