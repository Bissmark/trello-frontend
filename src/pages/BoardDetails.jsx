import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { FaPlus } from "react-icons/fa";
import ListItem from '../components/ListItem';

const BoardDetails = ({ client }) => {
    const [addingList, setAddingList] = useState(false);
    const [listName, setListName] = useState('');
    const [cards, setCards] = useState([]);

    const { id } = useParams();

    const { isFetching, error, data: board } = useQuery({
        queryKey: ['board', id],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_EXPRESS_BACKEND_URL}/boards/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });
            if (!response.ok) throw new Error('Bad Request');
            return response.json();
        },
    })

    const addListMutation = useMutation({
        mutationFn: async (newList) => {
            const payload = {
                ...newList,
                board: id,
            }

            const response = await fetch(`${import.meta.env.VITE_EXPRESS_BACKEND_URL}/lists`, {
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
            client.invalidateQueries(['lists']);
        },
    });

    const _handleSubmit = async (e) => {
        e.preventDefault();
        await addListMutation.mutateAsync({ title: listName, board: id});
        setListName('');
        setAddingList(false);
    }

    const addCardToList = (newCard) => {
        setCards([...cards, newCard]);
    }

    if (isFetching) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    const disable = listName.trim() === '';

    return (
        <div className='flex flex-col'>
            <div className='bg-blue-800 '>
                <h1 className='p-3 font-bold text-3xl'>{capitalizeFirstLetter(board.name)}</h1>
            </div>

            <div className='flex flex-col md:flex-row items-center md:items-start'>
                <div className='flex flex-col md:flex-row flex-start'>
                    { board.lists?.map(list => (
                        <div key={list._id}>
                            <ListItem list={list} onAddCard={addCardToList} client={client} />
                        </div>
                    ))}
                </div>
            <div className='m-4'>
                {!addingList ? (
                    <button 
                        className='bg-gray-100 p-2 w-48 text-left text-black rounded-lg hover:bg-gray-200' 
                        onClick={() => setAddingList(true)}
                    >
                        <div className='flex flex-row items-center'>
                            <FaPlus className='mr-2' />
                            Add List
                        </div>
                    </button>
                ) : (
                    <form className='flex flex-col bg-gray-800 p-2 rounded-xl' onSubmit={_handleSubmit}>
                        <input 
                            type="text"
                            className='p-2 rounded-lg mb-2 border border-gray-300 text-gray-500 bg-gray-700 hover:bg-gray-600'
                            placeholder='Enter list title...'
                            autoFocus
                            value={listName} 
                            onChange={(e) => setListName(e.target.value)} 
                        />
                        <div className='flex'>
                            <button className='bg-blue-300 rounded-lg p-2 mr-3' disabled={disable} type="submit">Add list</button>
                            <button onClick={() => setAddingList(false)}>X</button>
                        </div>
                    </form>
                )}
            </div>
            </div>
        </div>
    )
}

export default BoardDetails;