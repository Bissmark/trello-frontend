import { useState } from "react";
import { MdDriveFileRenameOutline, MdOutlineDescription } from "react-icons/md";
import { GoImage } from "react-icons/go";
import { useQuery, useMutation } from '@tanstack/react-query';

const CardForm = ({ list, isOpen, onClose, client, priorityLevels}) => {
    const [image, setImage] = useState('');
    const [card, setCard] = useState({
        title: '',
        description: '',
        priority: priorityLevels.High,
    });

    const _handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const mutation = useMutation({
        mutationFn: async (formData) => {
            const response = await fetch(`${import.meta.env.VITE_EXPRESS_BACKEND_URL}/cards`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error('Bad Request');
            return response.json();
        },
        onSuccess: () => {
            client.invalidateQueries(['cards']);
        }
    })
        
    const _handleSubmit = async (e) => {
        e.preventDefault();
        const newCard = {
            ...card,
            listId: list._id,
        };
        console.log(newCard);
        await mutation.mutateAsync(newCard);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full" id="default-modal">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800 text-gray-500">
                <form onSubmit={_handleSubmit}>
                    <div className="flex items-center gap-2">
                        <MdDriveFileRenameOutline />
                        <input
                            type="text"
                            className="w-full p-3 rounded-md"
                            placeholder="Enter a title for this card..."
                            required
                            onChange={(e) => setCard({ ...card, title: e.target.value })}
                        />
                    </div>
                    <div className="flex items-center gap-2 my-4">
                        <MdOutlineDescription />
                        <textarea
                            placeholder="Enter a description for this card..."
                            required
                            className="w-full p-3 rounded-md"
                            onChange={(e) => setCard({ ...card, description: e.target.value })}
                        />
                    </div>
                    <div>
                        <select 
                            name="priority"
                            className="p-3 rounded-md ml-6 w-80 mb-3 text-black"
                            onChange={(e) => setCard({ ...card, priority: e.target.value })}
                        >
                            {Object.values(priorityLevels).map((level, index) => (
                                <option className="font-cagliostro" key={index} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>
                    {/* <div className="file-upload my-4">
                        <GoImage />
                        <input type="file" id="files" className="hidden" onChange={_handleImageChange} />
                        <label htmlFor="files" className="label cursor-pointer">
                            {image ? image.name : 'Select File'}
                        </label>
                    </div> */}
                    <div className="flex justify-end gap-2">
                        <button className="text-white bg-gray-500 p-2 rounded-md mr-2" onClick={onClose}>Cancel</button>
                        <button type="submit" className="text-white bg-gray-500 p-2 rounded-md">Add Card</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CardForm;