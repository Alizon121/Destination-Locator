import { useState, useEffect } from "react"
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import './LoginForm.css';

function LoginFormModal() {
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({})
    const [disabled, setDisabled] = useState(true)
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    useEffect(() => {
            if ((credential.length >= 4) && (password.length >= 6)){
                 setDisabled(false)
            } else {
                setDisabled(true)
            }
    }, [credential, password])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})
        return dispatch(login({ credential, password }))
        .then(closeModal)
        .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
                else setErrors({general: "The provided credentials were incorrect"})
            }
            );
    }

   
    return (
        <div className="login_inputs">
            <h1>Log In </h1>
            {errors.general && <p className="error">{errors.general}</p>}
            <form className="login_form" onSubmit={handleSubmit}>
                <label>
                    <input
                        type="text"
                        name="credential"
                        className="credential"
                        placeholder="Username or Email"
                        value={credential}
                        onChange={e => setCredential(e.target.value)}
                        required
                    />
                    {errors.credential && <p className="error">{errors.credential}</p>}
                </label>
                <label>
                    <input
                        type="password"
                        name="password"
                        className="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    {errors.password && <p className="error">{errors.password}</p>}
                </label>
                <button className="submit_button" type='submit' disabled={disabled}>Log In</button>
            </form>
        </div>
    )
}

export default LoginFormModal