import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineMail } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';
import { IconContext } from 'react-icons';
import { RiLockPasswordFill } from 'react-icons/ri';
import { CgRename } from 'react-icons/cg';
import * as authService from '../services/authService';

const SignUpForm = ({ setUser, showSignup, setShowSignup }) => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        confirm: '',
        error: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setUserData({...userData,[e.target.name]: e.target.value, error: ''});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await authService.signup(userData);
            setUser(user);
        } catch {
            setError('Sign Up Failed - Try Again');
        }
    }

    const disable = userData.password !== userData.confirm;

    return (
        <IconContext.Provider value={{ color: "white", size: "2.5em" }}>
            <div className='flex justify-center items-center h-screen'>
                <div className='w-fit bg-gray-500 p-5 rounded-lg shadow text-center'>
                    <h1 className='my-4 text-5xl font-extrabold dark:text-white'>{showSignup ? 'Sign Up Page' : 'Log In Page'}</h1>
                    <form autoComplete="off" onSubmit={handleSubmit}>
                        <div className='flex border mx-auto w-48 rounded-lg mb-6'>
                            <CgRename />
                            <input className='text-black p-2 w-40 rounded-e-lg' type="text" name="name" value={userData.name} onChange={handleChange} required placeholder='Username' />
                        </div>
                        <div className='flex border mx-auto w-48 rounded-lg mb-6'>
                            <AiOutlineMail />
                            <input className='text-black p-2 w-40 rounded-e-lg' type="email" name="email" value={userData.email} onChange={handleChange} required placeholder='Email' />
                        </div>
                        <div className='flex border mx-auto w-48 rounded-lg mb-6'>
                            <RiLockPasswordLine />
                            <input className='text-black p-2 w-40 rounded-e-lg' type="password" name="password" value={userData.password} onChange={handleChange} required placeholder='Password' />
                        </div>
                        <div className='flex border mx-auto w-48 rounded-lg mb-4'>
                            <RiLockPasswordFill />
                            <input className='text-black p-2 w-40 rounded-e-lg' type="password" name="confirm" value={userData.confirm} onChange={handleChange} required placeholder='Password Confirm' />
                        </div>
                        <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800' type="submit" disabled={disable}>SIGN UP</button>
                    </form>
                    <p>Already have an account and want to login, click <Link onClick={() => setShowSignup(!showSignup)} className='hover:text-blue-500'>here</Link></p>
                </div>
                <p className="error-message">{error}</p>
            </div>
        </IconContext.Provider>
    );
}

export default SignUpForm;