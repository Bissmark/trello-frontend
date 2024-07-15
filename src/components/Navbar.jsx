import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import BoardForm from './BoardForm';

const Navbar = ({ client, user,  profile, logOut }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <nav>
            <ul>
                { user ? (
                    <>  
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                        <li>Welcome, { user.email || profile.email }</li>
                        <li>
                            <button onClick={() => setModalOpen(true)}>
                                Create Board
                            </button>
                            <BoardForm user={user} client={client} isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
                        </li>
                        <li><button onClick={logOut}>Log Out</button></li>
                    </>
                ) : (
                    <li><Link to="/login">Log In</Link></li>
                )}                
            </ul>
        </nav>
    )
}

export default Navbar;