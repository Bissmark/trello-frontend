import { useState } from "react";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation } from '@tanstack/react-query';

const BoardForm = ({ client, isOpen, onClose, user }) => {
    const [board, setBoard] = useState('');

     const addBoardMutation = useMutation({
        mutationFn: async (newBoard) => {
            const payload = {
                ...newBoard,
                user: user._id,
            }

            const response = await fetch(`${import.meta.env.VITE_EXPRESS_BACKEND_URL}/boards`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        },
        onSuccess: () => {
            // Invalidate and refetch lists query to update the UI
            client.invalidateQueries(['boards']);
        },
    })

    const _handleSubmit = async (e) => {
        e.preventDefault();
        await addBoardMutation.mutateAsync({ name: board, user: user._id});
        setBoard('');
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full" id="default-modal">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800 text-gray-500">
                <form onSubmit={_handleSubmit}>
                    <div className='flex items-center gap-2'>
                        <MdDriveFileRenameOutline />
                        <input 
                            type="text" 
                            className='w-full p-3 rounded-md mb-3' 
                            placeholder='Enter a name for this board...'
                            onChange={(e) => setBoard(e.target.value)} 
                            value={board}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button className="text-white bg-gray-500 p-2 rounded-md mr-2" onClick={onClose}>Cancel</button>
                        <button className="text-white bg-gray-500 p-2 rounded-md" type='submit'>Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default BoardForm;