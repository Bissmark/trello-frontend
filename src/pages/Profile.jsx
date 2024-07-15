import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const Profile = ({user}) => {
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

    if (isFetching) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    return (
        <div className="flex justify-center mx-auto">
            <div className="flex-col">
                <h1 className="mt-4 text-4xl front-bold">Profile</h1>
                <div>
                    <p>Email: {user.email}</p>
                    {user.name && <p>Name: {user.name }</p>}

                    <h2>Boards:</h2>
                    {boards?.map(board => (
                        <div key={board._id}>
                            <Link className="text-blue-600 underline" to={`/boards/${board._id}`}>{board.name}</Link>
                            {/* <BoardDetails board={board} /> */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Profile