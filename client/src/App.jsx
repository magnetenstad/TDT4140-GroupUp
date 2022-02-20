import {Route, Routes} from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import {UserProvider} from './contexts/User';
import GroupPage from './pages/GroupPage';
import MainNavigation from "./components/navigation/MainNavigation";
import MyProfilePage from './pages/MyProfilePage';

function App() {
  return (
    <UserProvider>
      <MainNavigation/>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/groups" element={<GroupPage/>}/>
        <Route path="/myprofile" element={<MyProfilePage/>}/>
      </Routes>
    </UserProvider>
  );
}
export default App;
