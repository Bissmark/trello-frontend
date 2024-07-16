const DeleteModal = ({ isOpen, onClose, onDelete, boardId }) => {
    const _handleDelete = () => onDelete(boardId);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full text-white" id="default-modal">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800">
                <div className="flex flex-col items-center gap-2">
                    <h1 className="my-4 text-xl font-bold">Delete Confirmation</h1>
                    <div className="mb-2">Are you sure you want to delete this record?</div>
                    <div>
                        <button className="bg-gray-500 p-2 rounded-md mr-2" type="button" onClick={onClose}>Close</button>
                        <button className="bg-gray-500 p-2 rounded-md" type="button" onClick={_handleDelete}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;