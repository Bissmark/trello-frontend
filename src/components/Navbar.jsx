import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import BoardForm from './BoardForm';

const Navbar = ({ client, user,  profile, logOut }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [openNav, setOpenNav] = useState(false);

    const handleDropDown = () => {
        setOpenNav(!openNav);
    };

    return (
        <nav className='bg-slate-900'>
            <div className='flex flex-wrap items-center justify-between p-2'>
                <p className='text-white'>{ user && `Welcome, ${ user.email || profile.email }`}</p>
                <button type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:text-blue-500 dark:focus:ring-gray-600" onClick={handleDropDown}>
                    <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                </button>
                <div className={`w-full md:flex md:items-center md:w-auto ${openNav ? 'block' : 'hidden'}`}>
                    <ul className='flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 text-white'>
                        { user ? (
                            <div className='md:flex md:flex-row md:items-center'>
                                <li className='mr-5'><Link to="/">Home</Link></li>
                                <li className='mr-5'><Link to="/about">About</Link></li>
                                <li className='mr-5'>
                                    <button onClick={() => setModalOpen(true)}>
                                        Create Board
                                    </button>
                                    <BoardForm user={user} client={client} isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
                                </li>
                                <li className='mr-5'><button onClick={logOut}>Log Out</button></li>
                                <div className='relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full'>
                                    <Link to='/profile'><svg class="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg></Link>
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