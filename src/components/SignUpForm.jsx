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
        setUserData({ ...userData, [e.target.name]: e.target.value, error: '' });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await authService.signup(userData);
            setUser(user);
        } catch (error) {
            setError(error.message);
        }
    }

    const disable = userData.password !== userData.confirm;

    return (
        <IconContext.Provider value={{ color: "white", size: "2.5em" }}>
            <div className='flex justify-center items-center h-screen'>
                <div className='bg-gray-500 p-5 rounded-lg shadow-2xl text-center'>
                    <h1 className='my-4 text-5xl font-extrabold'>Sign Up Page</h1>
                    <form className='mt-6' autoComplete="off" onSubmit={handleSubmit}>
                        <div className='flex border mx-auto w-48 rounded-lg mb-4'>
                            <CgRename />
                            <input className='text-black p-2 w-40 rounded-e-lg' type="text" name="name" value={userData.name} onChange={handleChange} required placeholder='Username' />
                        </div>
                        <div className='flex border mx-auto w-48 rounded-lg mb-4'>
                            <AiOutlineMail />
                            <input className='text-black p-2 w-40 rounded-e-lg' type="email" name="email" value={userData.email} onChange={handleChange} required placeholder='Email' />
                        </div>
                        <div className='flex border mx-auto w-48 rounded-lg mb-4'>
                            <RiLockPasswordLine />
                            <input className='text-black p-2 w-40 rounded-e-lg' type="password" name="password" value={userData.password} onChange={handleChange} required placeholder='Password' />
                        </div>
                        <div className='flex border mx-auto w-48 rounded-lg mb-4'>
                            <RiLockPasswordFill />
                            <input className='text-black p-2 w-40 rounded-e-lg' type="password" name="confirm" value={userData.confirm} onChange={handleChange} required placeholder='Password Confirm' />
                        </div>
                        <button className='text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 mb-2' type="submit" disabled={disable}>SIGN UP</button>
                    </form>
                    <p>Already have an account and want to login, click <Link onClick={() => setShowSignup(!showSignup)} className='text-blue-400 hover:text-white underline'>here</Link></p>
                    <p className='text-red-500 mt-4'>{error}</p>
                </div>
            </div>
        </IconContext.Provider>
    );
}

export default SignUpForm;