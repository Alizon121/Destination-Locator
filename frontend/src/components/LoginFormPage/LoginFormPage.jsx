import { useState } from "react"
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import './LoginForm.css';

function LoginFormPage () {
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user)

    if (sessionUser) return <Navigate to='/' replace={true}/>

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})
        return dispatch(login({ credential, password })).catch(
            async (res) => {
                const data = await res.json();
                if (data?.errors) setErrors(data.errors);
            }
            );
    }

    return (
        <>
            <h1>Log In </h1>
            <form onSubmit={handleSubmit}>
                <label>Username or Email
                <input
                type="text"
                name="credential"
                className="credential"
                value={credential}
                onChange={e => setCredential(e.target.value)}
                required
                />
                </label>
                <label>
                    Password
                <input
                type="text"
                name="password"
                className="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                />
                </label>
                {errors.credential && <p>{errors.credential}</p>}
                <div className="submit_button">
                <button type='submit'>Log In</button>
                </div>
            </form>
        </>
    )
}

export default LoginFormPage