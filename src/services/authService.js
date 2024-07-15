const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL; // this is our Express API url

const getUser = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const user = JSON.parse(atob(token.split('.')[1]));
    return user;
};

const signup = async (formData) => {
    try {
        const res = await fetch(`${BACKEND_URL}/users/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const json = await res.json();
        
        if (json.error) {
            throw new Error(json.error);
        }
        localStorage.setItem('token', json.token); // add this line to store the JWT token in localStorage
        return json;
    } catch (err) {
        throw new Error(err);
    }
};

const login = async (user) => {
    try {
        const res = await fetch(`${BACKEND_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        })
        const json = await res.json();
        if (json.error) {
            throw new Error(json.error);
        }
        if (json.token) {
            localStorage.setItem('token', json.token); // add this line to store the JWT token in localStorage
            const user = JSON.parse(atob(json.token.split('.')[1]));
            return user;
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
};

const signout = () => {
  localStorage.removeItem('token');
};

export {
  signup,
  login,
  getUser,
  signout
};