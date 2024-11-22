import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../store/session";
import { Navigate } from "react-router-dom";
import './SignupForm.css'
// import { error } from "console";

export default function SignUpFormPage() {
const [username, setUserName] = useState('');
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [errors, setErrors] = useState({})
const dispatch = useDispatch();
const navigate = useNavigate();
const currentUser = useSelector(state => state.session.user)

    if (currentUser) return <Navigate to='/' replace={true} />

    const handleSubmit = async (e) =>  {
        e.preventDefault();
        
        if (password === confirmPassword) {
            setErrors({});
            return dispatch(
              signup({
                email,
                username,
                firstName,
                lastName,
                password
              })
            ).catch(async (res) => {
              const data = await res.json();
              if (data?.errors) {
                setErrors(data.errors);
              }
            });
          }
          return setErrors({
            confirmPassword: "Confirm Password field must be the same as the Password field"
          });
        };

    

    return (
        <>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
            <label>
                Username
                <input
                className="username"
                name='username'
                type="text"
                value={username}
                onChange={e => setUserName(e.target.value)}
                required
                />
             </label>
             {errors.username && <p>{errors.username}</p>}
            <label>
                Email
                <input 
                type="text" 
                className="email"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                />
            </label>
            {errors.email && <p>{errors.email}</p>}
            <label>
                First Name
                <input
                type="text"
                className="firstName"
                name="fistName"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                />
            </label>
            {errors.firstName && <p>{errors.firstName}</p>}
            <label>
                Last Name
                <input 
                type="text"
                className="lastName"
                name="lastName"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                />
            </label>
            {errors.lastName && <p>{errors.lastName}</p>}
            <label>
                Password
                <input
                type="text"
                className="password"
                name="password"
                value={password}
                onChange={e => setPassword(e.target.value)}/>
            </label>
            {errors.password && <p>{errors.password}</p>}
            <label>
                Confirm Password
                <input 
                type="text"
                className="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={e = setConfirmPassword(e.target.value)}
                />
            </label>
            {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
            <button type="submit">Sign Up</button>
        </form>
        
        </>
    )
}