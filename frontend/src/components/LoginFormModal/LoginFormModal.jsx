import { useState } from "react"
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import './LoginForm.css';

function LoginFormModal() {
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch();
    // const sessionUser = useSelector((state) => state.session.user)
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})
        return dispatch(login({ credential, password })).then(closeModal).catch(
            async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
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
                type="password"
                name="password"
                className="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                />
                </label>
                {errors.credential && <p>{errors.credential}</p>}
                {/* <div className="submit_button"> */}
                <button type='submit'>Log In</button>
                {/* </div> */}
            </form>
        </>
    )
}

export default LoginFormModal