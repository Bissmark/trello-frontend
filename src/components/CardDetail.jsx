import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query"
import { MdDriveFileRenameOutline, MdOutlineDescription, MdPriorityHigh } from "react-icons/md";
import { getBackendURL } from '../services/config';

const CardDetail = ({ card, onClose, isOpen, priorityLevels, client }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editCard, setEditCard] = useState({
        title: '',
        description: '',
        priority: '',
    });

    const BACKEND_URL = getBackendURL();

    useEffect(() => {
        if (card) {
            setEditCard({
                title: card.title || '',
                description: card.description || '',
                priority: card.priority || '',
            });
        }
    }, [card]);

    const _handleChange = (e) => {
        setEditCard(prevState => ({ 
            ...prevState, 
            [e.target.name]: e.target.value 
        }));
    }

    const editMyCard = useMutation({
        mutationFn: async () => {
            const response = await fetch(`${BACKEND_URL}/cards/${card._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editCard),
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        },
        onSuccess: () => {
            client.invalidateQueries(['cards']);
            setIsEditing(false);
        }
    })

    const _handleUpdate = async () => {
        await editMyCard.mutateAsync();
    }

    if (!isOpen) return null;
    if (!card) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full" id="default-modal">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800 text-gray-500">
                {isEditing ? (
                    <div>
                        <div className="flex gap-2">
                            <MdDriveFileRenameOutline className="text-blue-500 mt-1" size={30} />
                            <input 
                                type="text"
                                className="w-full p-2 rounded-md mb-3"
                                name="title"
                                value={editCard.title}
                                onChange={_handleChange}
                            />
                        </div>
                        <div className="flex gap-2">
                            <MdOutlineDescription className="text-blue-500 mt-1" size={30} />
                            <input 
                                type="text"
                                className="w-full p-2 rounded-md mb-3"
                                name="description"
                                value={editCard.description}
                                onChange={_handleChange}
                            />
                        </div>
                        <div className="flex gap-2">
                            <MdPriorityHigh className="text-blue-500 mt-1" size={30} />
                            <select 
                                name="priority"
                                className="w-full p-2 rounded-md mb-3"
                                value={editCard.priority}
                                onChange={_handleChange}
                            >
                                {Object.values(priorityLevels).map((level, index) => (
                                    <option key={index} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <MdDriveFileRenameOutline className="text-blue-500" size={30} />
                            <div className="text-base text-white">
                                {card.title}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <MdOutlineDescription className="text-blue-500" size={30} />
                            <div className="text-base text-white">
                                {card.description}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <MdPriorityHigh className="text-blue-500" size={30} />
                            <div className="text-base text-white">
                                {card.priority}
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex justify-end gap-2">
                    <button className="text-white bg-gray-500 p-2 rounded-md mr-2 w-20" onClick={onClose}>Cancel</button>
                    {isEditing ? (
                        <button className="text-white bg-gray-500 p-2 rounded-md w-20" onClick={_handleUpdate}>Update</button>
                    ) : (
                        <button className="text-white bg-gray-500 p-2 rounded-md w-20" onClick={() => setIsEditing(true)}>Edit</button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CardDetail;