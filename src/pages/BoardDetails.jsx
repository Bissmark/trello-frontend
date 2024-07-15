import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import ListItem from '../components/ListItem';

const BoardDetails = ({ client }) => {
    const [addingList, setAddingList] = useState(false);
    const [listName, setListName] = useState('');
    const [cards, setCards] = useState([]);

    const { id } = useParams();

    const { isFetching, error, data: board } = useQuery({
        queryKey: ['board', id],
        queryFn: async () => {
            const response = await fetch(`http://localhost:3001/boards/${id}`, {
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

            const response = await fetch('http://localhost:3001/lists', {
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
        console.log(cards);
    }

    if (isFetching) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    return (
        <div>
            <h1>Board {board.name}</h1>

            <div className='flex flex-row'>
                <div className='flex flex-row flex-start'>
                    { board.lists?.map(list => (
                        <div key={list._id}>
                            <ListItem list={list} onAddCard={addCardToList} client={client} />
                        </div>
                    ))}
                </div>
            <div>
                {!addingList ? (
                    <button onClick={() => setAddingList(true)}>Add List</button>
                ) : (
                    <form onSubmit={_handleSubmit}>
                        <input 
                            type="text"
                            placeholder='Enter a title for this list...'
                            value={listName} 
                            onChange={(e) => setListName(e.target.value)} 
                        />
                        <button type="submit">Add</button>
                        <button onClick={() => setAddingList(false)}>Cancel</button>
                    </form>
                )}
            </div>
            </div>
        </div>
    )
}

export default BoardDetails;