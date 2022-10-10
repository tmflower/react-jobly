import React, { useState } from "react";

// displays a form that allows user to login to an existing account
// when submitted, the login function sets this user and their token as current in state
const LoginForm = ({ login, logout, currentUser }) => {

    const initial_state = {
        username: '',
        password: ''
    }

    const [formData, setFormData] = useState(initial_state);

    const { username, password } = formData;

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormData(data => ({ ...data, [name]: value}));
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        const user = { username, password };
        login(user);
        setFormData(initial_state);
    }
    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:
                <input type="text" name="username" value={username} id="username" onChange={handleChange}></input></label>
                <label htmlFor="password">Password:
                <input type="text" name="password" value={password} id="password" onChange={handleChange}></input></label>
                <button>Submit</button>
            </form>
        </div>
    )
}

export default LoginForm;