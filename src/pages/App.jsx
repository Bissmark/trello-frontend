import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider} from '@tanstack/react-query';
import { googleLogout} from '@react-oauth/google'
import Navbar from '../components/Navbar'
import Home from './Home'
import AuthPage from './AuthPage'
import Profile from './Profile'
import BoardDetails from './BoardDetails'
import * as authService from '../services/authService';

const queryClient = new QueryClient();

const App = () => {
    const [user, setUser] = useState(authService.getUser());
    const [profile, setProfile] = useState([]);

    const logOut = () => {
        googleLogout();
        localStorage.removeItem('user');
        setProfile([]);
        setUser(null);
    };

    return (
        <div>
            <QueryClientProvider client={queryClient}>
                { user ?
                    <>
                        <Navbar user={user} client={queryClient} logOut={logOut} profile={profile} setProfile={setProfile} />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="*" element={<Navigate to="/" />} />
                            <Route path='/profile' element={<Profile user={user} />} />
                            <Route path='/boards/:id' element={<BoardDetails client={queryClient} />} />
                        </Routes>
                    </>
                :
                <AuthPage user={user} setUser={setUser} setProfile={setProfile} logOut={logOut} />
                }
            </QueryClientProvider>
        </div>
    )
}

export default App
