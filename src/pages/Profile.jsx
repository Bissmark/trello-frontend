import { useState } from 'react';
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import DeleteModal from "../components/DeleteModal";
import BoardForm from '../components/BoardForm';

const Profile = ({user, client}) => {
    const [deleteModalOpen, setDeleteModalOpen] = useState({ isOpen: false, boardId: null });
    const [modalOpen, setModalOpen] = useState(false);

    const { isFetching, error, data: boards } = useQuery({
        queryKey: ['boards', user._id],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_EXPRESS_BACKEND_URL}/boards`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });
            if (!response.ok) throw new Error('Bad Request');
            return response.json();
        },
    })

    const deleteBoard = useMutation({
        mutationFn: async (boardId) => {
            console.log(boardId);
            const response = await fetch(`${import.meta.env.VITE_EXPRESS_BACKEND_URL}/boards/${boardId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ boardId })
            });
            if (!response.ok) throw new Error('Bad Request');
            return response.json();
        },
        onSuccess: () => {
            client.invalidateQueries(['boards']);
        }
    })

    const openDeleteModal = (boardId) => {
        setDeleteModalOpen({ isOpen: true, boardId });
    }

    const closeDeleteModal = () => {
        setDeleteModalOpen({ isOpen: false, boardId: null });
    }

    const _handleDelete = async (boardId) => {
        await deleteBoard.mutateAsync(boardId);
        closeDeleteModal();
    }

    if (isFetching) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    return (
        <div className="flex justify-center mx-auto text-black">
            <div>
                <h1 className="mt-4 text-4xl front-bold">WorkSpace</h1>
                <div>
                    <p>Email: {user.email}</p>
                    {user.name && <p>Name: {user.name }</p>}

                    <h2>Your boards:</h2>
                    {boards && boards.length > 0 ? (
                        <div className="flex flex-row">
                            {boards?.map(board => (
                                <div className="bg-amber-400 w-48 h-32 flex justify-between items-start p-2 rounded-md mr-4" key={board._id}>
                                    <Link to={`/boards/${board._id}`}>
                                        <p className="text-white">{board.name}</p>
                                    </Link>
                                    <button onClick={() => openDeleteModal(board._id)}>
                                        X
                                    </button>
                                    <DeleteModal isOpen={deleteModalOpen.isOpen} onClose={closeDeleteModal} onDelete={_handleDelete} boardId={board._id} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            <button className='bg-gray-500 px-2.5 py-3 rounded-lg text-white' onClick={() => setModalOpen(true)}>
                                Create Board
                            </button>
                            <BoardForm user={user} client={client} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile