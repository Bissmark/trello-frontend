import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';

const AuthPage = ({ user, setUser, setProfile, login, logOut }) => {
    const [showSignup, setShowSignup] = useState(false);
    return (
        <main>
            { showSignup ? 
                <SignUpForm setUser={setUser} showSignup={showSignup} setShowSignup={setShowSignup} />
                :
                <LoginForm user={user} setUser={setUser} login={login} logOut={logOut} setProfile={setProfile} showSignup={showSignup} setShowSignup={setShowSignup} />
            }
        </main>
    )
}

export default AuthPage;