// import  { useState } from 'react';
// import LoginForm from './Components/LoginForm' 
// import Dashboard from './Components/Dashboard'; // Your dashboard component
// const App = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const handleLoginSuccess = () => {
//     setIsAuthenticated(true);
//   };
//   return (
//     <div>
//       {isAuthenticated ? (
//         <Dashboard />
//       ) : (
//         <LoginForm onLoginSuccess={handleLoginSuccess} />
//       )}
//     </div>
//   );
// };
// export default App;








import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './Components/LoginForm';
import Dashboard from './Components/Dashboard';
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginForm onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
};
export default App;









