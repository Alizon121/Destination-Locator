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

  // Helper funciton for validating email
  // function validateEmail(email) {
  //   const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  //   return regex.test(email);
  // }

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
          await dispatch(sessionActions.login({credential: payload.email, password: payload.password}))
          closeModal()
        }
      } catch (error) {
        const errors = await error.json() //backend errors
        if (errors.errors?.email) {
              newErrors.email = errors.errors.email
            }
            if (errors.errors?.username) {
              newErrors.username = errors.errors.username
            }
          setErrors(newErrors)
        }
      }

  return (
    <div className='sign_up_form'>
      <h1>Sign Up</h1>
      {/* {errors.general && <p>{errors.general}</p>} */}
      <div className='sign_up_form_errors_container'>
        {errors.email && <p id='sign_up_errors_email'>{errors.email}</p>}
        {errors.username && <p id='sign_up_errors_username'>{errors.username}</p>}
        {errors.firstName && <p id='sign_up_errors_first_name'>{errors.firstName}</p>}
        {errors.lastName && <p id='sign_up_errors_last_name'>{errors.lastName}</p>}
        {errors.password && <p id='sign_up_errors_password'>{errors.password}</p>}
        {errors.confirmPassword && <p id='sign_up_errors_confirm_password'>{errors.confirmPassword}</p>}
      </div>
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
        <div className='sign_up_button_container'>
          <button className='sign_up_button' type="submit" disabled={disabled}>Sign Up</button>
        </div>
      </form>
    </div>
  );
}

export default SignupFormModal;