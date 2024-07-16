import { useState } from 'react';
import { GrAdd } from 'react-icons/gr';
import CardForm from './CardForm';
import CardDetail from './CardDetail';
import { useMutation } from '@tanstack/react-query';
import DeleteModal from './DeleteModal';

const PriorityLevels = {
  High: "High",
  Medium: "Medium",
  Low: "Low",
};

const ListItem = ({ list, client }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const deleteList = useMutation({
        mutationFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_EXPRESS_BACKEND_URL}/lists/${list._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ listId: list._id })
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        },
        onSuccess: () => {
            client.invalidateQueries(['lists']);
        }
    })

    const _handleDelete = async () => {
        await deleteList.mutateAsync();
    }

    const handleCardClick = (card) => {
        setSelectedCard(card); // Update the selected card
        setIsCardModalOpen(true); // Open the modal
    };

    const getPriorityColour = (priority) => {
    switch (priority) {
        case 'Low':
            return 'green';
        case 'Medium':
            return 'yellow';
        case 'High':
            return 'red';
        default:
            return 'black';
        }
    };


    return (
        <div className='flex flex-col w-60 bg-gray-800 m-4 rounded-xl p-2'>
            <div className='flex flex-row justify-between py-1 px-2.5 mb-4'>
                <h3 className='mr-3'>{list.title}</h3>
                <button onClick={() => setDeleteModalOpen(true)}>
                    X
                </button>
                <DeleteModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onDelete={_handleDelete} />
            </div>
            <div className='flex flex-row md:flex-col'>
                {list.cards.map(card => (
                    <div className='w-full bg-gray-600 rounded-lg p-2 mb-2' key={card._id}>
                        <button style={{ backgroundColor: getPriorityColour(card.priority)}} onClick={() => handleCardClick(card)}>{card.title}</button>
                    </div>
                ))}
            </div>
            <div>
                <button onClick={() => setIsModalOpen(true)}>
                    <div className='flex flex-row items-center'>
                        <GrAdd className='ml-2 mr-2' />
                        Add Card
                    </div>
                </button>
                <CardForm list={list} priorityLevels={PriorityLevels} isOpen={isModalOpen} client={client} onClose={() => setIsModalOpen(false)} />
            </div>
            {isCardModalOpen && (
                <CardDetail card={selectedCard} priorityLevels={PriorityLevels} client={client} isOpen={isCardModalOpen} onClose={() => setIsCardModalOpen(false)} />
            )}
        </div>
    )
}

export default ListItem;