import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './Components/LoginForm';
import Dashboard from './Components/Dashboard';
import PrivateRoute from './Components/PrivateRoute';
 
const App = () => {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route element={<PrivateRoute children={undefined} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          </Route> 
        </Routes>
    </Router>
  );
};
export default App;