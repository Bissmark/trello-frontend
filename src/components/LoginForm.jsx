import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { AiOutlineMail } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';
import { useGoogleLogin } from '@react-oauth/google';
import * as authService from '../services/authService';

export default function LoginForm({ setUser, showSignup, setShowSignup, setProfile }) {
    const [credentials, setCredentials] = useState({
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
                <div className='w-fit bg-gray-500 p-5 rounded-lg shadow text-center'>
                    <h1 className='my-4 text-5xl font-extrabold dark:text-white'>{showSignup ? 'Sign Up Page' : 'Login Page'}</h1>
                    <div className='mb-5 flex justify-center'>
                        <button onClick={login}>Sign in with Google</button>
                    </div>
                    <form autoComplete="off" onSubmit={handleSubmit}>
                        <div className='flex border mx-auto w-48 rounded-lg mb-6'>
                            <AiOutlineMail />
                            <input className='text-black p-2 w-40 rounded-e-lg' type="email" name="email" value={credentials.email} onChange={handleChange} required placeholder='Email'/>
                        </div>
                        <div className='flex border mx-auto w-48 rounded-lg mb-4'>
                            <RiLockPasswordLine />
                            <input className='text-black p-2 w-40 rounded-e-lg' type="password" name="password" value={credentials.password} onChange={handleChange} required placeholder='Password' />
                        </div>
                        <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800' type="submit">LOG IN</button>
                    </form>
                    <p className='text-center'>If you actually want to sign up for the website, click <Link onClick={() => setShowSignup(!showSignup)} className='hover:text-blue-500 underline'>here</Link></p>
                </div>
                <p className="error-message">{error}</p>
            </div>
        </IconContext.Provider>
    );
}