import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session'
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(true)
  const { closeModal } = useModal();

  useEffect(() => {
    if (!email.trim() || !username.trim() || !firstName.trim() || !lastName.trim() || !password.trim() || !confirmPassword.trim()) {
      setDisabled(true) 
    } else if (username.length < 4) {
        setDisabled(true)
    } else if (password.length < 6) {
      setDisabled(true)
    }
      else {
      setDisabled(false)
    }
  }, [email, username, firstName, lastName, password, confirmPassword])

  const handleSubmit = async (e) => {
    e.preventDefault();

    // valdiations
    const newErrors = {}
    if (username.length < 4) newErrors.username = "Username must be greater than 4 characters."
    if (password.length < 6) newErrors.password = "Password must be greater than 6 characters."
    if (password !== confirmPassword) newErrors.confirmPassword = "Confirm password must be the same as Password field."

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const payload = {
          username,
          firstName,
          lastName,
          email,
          password
    }
    
      setErrors({});

      try {
        const newUser = await dispatch(sessionActions.signup(payload)) 
        if (newUser) {
          // const data = await newUser.json()
          await dispatch(sessionActions.login({credential: payload.email, password: payload.password}))
          closeModal()
        }
      } catch (error) {
        // if (error instanceof Error) {
        //   setErrors({general: error.message})
        // } else {
        const newErrors = {}
        const errors = await error.json()
            if (errors.errors?.email) {
              newErrors.email = errors.errors.email
            }
            if (errors.errors?.username) {
              newErrors.username = errors.errors.username
            }
            console.log(newErrors)
          setErrors(newErrors)
        }
      }

  return (
    <div className='sign_up_form'>
      <h1>Sign Up</h1>
      {/* {errors.general && <p>{errors.general}</p>} */}
      {errors.email && <p>{errors.email}</p>}
      {errors.username && <p>{errors.username}</p>}
      {errors.firstName && <p>{errors.firstName}</p>}
      {errors.lastName && <p>{errors.lastName}</p>}
      {errors.password && <p>{errors.password}</p>}
      {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
      <form className="sign_up_inputs"onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            placeholder='Email'
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Username
          <input
            type="text"
            value={username}
            placeholder='Username'
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            placeholder='First Name'
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            placeholder='Last Name'
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            placeholder='Confirm Password'
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        <button className='sign_up_button' type="submit" disabled={disabled}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;