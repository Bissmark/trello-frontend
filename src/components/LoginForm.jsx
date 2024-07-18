import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { AiOutlineMail } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';
import { useGoogleLogin } from '@react-oauth/google';
import * as authService from '../services/authService';

export default function LoginForm({ setUser, showSignup, setShowSignup, setProfile }) {
    const [credentials, setCredentials] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value, error: '' });
        setError('');
    }

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            handleLoginSuccess(codeResponse);
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const user = await authService.login(credentials);
            setUser(user);
            navigate('/profile');
        } catch (error) {
            setError(error.message);
        }
    }

    const handleLoginSuccess = async (response) => {
        const { access_token } = response;
        try {
            const userInfo = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    Accept: 'application/json',
                }
            }).then(res => res.json());
            setUser(userInfo);
            setProfile(userInfo);
            localStorage.setItem('user', JSON.stringify(userInfo));
        } catch (error) {
            console.log('Login Failed, Try Again', error);
        }
    }

    return (
        <IconContext.Provider value={{ color: "white", size: "2.5em" }}>
            <div className='flex justify-center items-center h-screen'>
                <div className='bg-gray-500 p-5 rounded-lg shadow-2xl text-center'>
                    <h1 className='my-4 text-5xl font-extrabold mb-4'>Login Page</h1>
                    <button className='bg-white px-4 py-2.5 w-48 rounded-md text-black hover:bg-gray-200 mb-5' onClick={login}>Sign in with Google</button>
                    <form onSubmit={handleSubmit}>
                        <div className='flex border mx-auto w-48 rounded-lg mb-4'>
                            <AiOutlineMail />
                            <input className='text-black p-2 w-40 rounded-e-lg' type="email" name="email" value={credentials.email} onChange={handleChange} required placeholder='Email'/>
                        </div>
                        <div className='flex border mx-auto w-48 rounded-lg mb-4'>
                            <RiLockPasswordLine />
                            <input className='text-black p-2 w-40 rounded-e-lg' type="password" name="password" value={credentials.password} onChange={handleChange} required placeholder='Password' />
                        </div>
                        <button className='text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 mb-2' type="submit">LOG IN</button>
                    </form>
                    <p>If you actually want to sign up for the website, click <Link onClick={() => setShowSignup(!showSignup)} className='text-blue-400 hover:text-white underline'>here</Link></p>
                    <p className='text-red-500 mt-4'>{error}</p>
                </div>
            </div>
        </IconContext.Provider>
    );
}