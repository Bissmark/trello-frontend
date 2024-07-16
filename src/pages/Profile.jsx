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
        <div className="flex justify-center mx-auto text-black">
            <div>
                <h1 className="mt-4 text-4xl front-bold">WorkSpace</h1>
                <div>
                    <p>Email: {user.email}</p>
                    {user.name && <p>Name: {user.name }</p>}

                    <h2>Your boards:</h2>
                    <div className="flex flex-row">
                        {boards?.map(board => (
                            <Link to={`/boards/${board._id}`} key={board._id} className="mr-4">
                                <div className="bg-amber-400 w-48 h-32 flex justify-start items-start p-2 rounded-md">
                                    <p className="text-white">{board.name}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile