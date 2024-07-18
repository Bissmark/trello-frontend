import { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import BoardForm from './BoardForm';

const Navbar = ({ client, user,  profile, logOut }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [openNav, setOpenNav] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const pageClickEvent = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpenProfile(false);
            }
        };

        document.addEventListener('click', pageClickEvent);
        return () => {
            document.removeEventListener('click', pageClickEvent);
        }
    }, []);

    const handleDropDown = () => {
        setOpenNav(!openNav);
    };

    const _handleProfileDropdown = () => {
        setOpenProfile(!openProfile);
    }

    return (
        <nav className='bg-slate-900'>
            <div className='flex flex-wrap items-center justify-between p-2'>
                <p className='text-white'>{ user && `Welcome, ${ user.name || profile.name }`}</p>
                <button type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:text-blue-500 dark:focus:ring-gray-600" onClick={handleDropDown}>
                    <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                </button>
                <div className={`w-full md:flex md:items-center md:w-auto ${openNav ? 'block' : 'hidden'}`}>
                    <ul className='flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 text-white'>
                        { user ? (
                            <div className='md:flex md:flex-row md:items-center'>
                                <li className='mr-5 hover:underline hover:text-cyan-300'><Link to="/">Home</Link></li>
                                <li className='mr-5 hover:underline hover:text-cyan-300'><Link to="/about">About</Link></li>
                                <div className='relative' ref={dropdownRef}>
                                    <CgProfile className='text-blue-500 hover:text-white cursor-pointer' size={30} onClick={_handleProfileDropdown} />
                                    {openProfile && (
                                        <div className='absolute right-0 p-3 mt-2 w-48 bg-gray-800 rounded-lg shadow-2xl border border-gray-200'>
                                            <Link className='hover:text-blue-500' to='/profile'>Profile</Link>
                                            <li className=' hover:text-blue-500'>
                                                <button onClick={() => setModalOpen(true)}>
                                                    Create Board
                                                </button>
                                                <BoardForm user={user} client={client} isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
                                            </li>
                                            <li className='hover:text-blue-500'><button onClick={logOut}>Log Out</button></li>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <li><Link to="/login">Log In</Link></li>
                        )}                
                    </ul>
                </div>

            </div>
        </nav>
    )
}

export default Navbar;