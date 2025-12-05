import { useState } from 'react';
import { GrAdd } from 'react-icons/gr';
import CardForm from './CardForm';
import CardDetail from './CardDetail';
import { useMutation } from '@tanstack/react-query';
import DeleteModal from './DeleteModal';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';

const PriorityLevels = {
    None: "",
    High: "High",
    Medium: "Medium",
    Low: "Low",
};

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
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

    const saveCardsPositions = useMutation({
        mutationFn: async (cards) => {
            const response = await fetch(`${import.meta.env.VITE_EXPRESS_BACKEND_URL}/lists/${list._id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cards })
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        }
    })

    const onDragEnd = (result) => {
        if (!result.destination) return;
        if (result.destination.droppableId === result.source.droppableId && result.destination.index === result.source.index) return;

        const items = reorder(
            list.cards,
            result.source.index,
            result.destination.index
        );

        list.cards = items;

        saveCardsPositions.mutateAsync(list.cards);
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
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId='list' direction='vertical'>
                    {(provided) => (
                    <div className='flex flex-col'
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {list.cards.map((card, index) => (
                            <Draggable key={card._id} draggableId={card._id} index={index}>
                                {(provided) => (
                                    <div className='w-full bg-gray-600 rounded-lg p-2 mb-2 hover:border-emerald-50 border-transparent border-2'
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <div onClick={() => handleCardClick(card)}>
                                            <div className='w-16 rounded-md text-center text-sm mb-1' style={{ backgroundColor: getPriorityColour(card.priority)}}>{PriorityLevels[card.priority]}</div>
                                            <button>{card.title}</button>
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                    )}
            </Droppable>
            </DragDropContext>
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