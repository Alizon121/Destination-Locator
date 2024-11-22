import { NavLink } from "react-router-dom"
import { logout } from "../../store/session";
import { useDispatch, useSelector} from 'react-redux'
import ProfileButton from "./ProfileButton";

export default function Navigation({isLoaded}) {
    const dispatch = useDispatch();
    // Use the useSelector hook to check for user
    const sessionUser = useSelector(state => state.session.user)

    const logout = (e) => {
        e.preventDefault()
        dispatch(logout());
    }

    const sessionLinks = sessionUser ? (
        <>
            <li>
                <Profilebuttom user={sessionUser}/>
            </li>
            <li>
                <button onClick={logout}>Log Out</button>
            </li>
        </>
    ) : (
        <>
            <li>
                <NavLink to='/login'>Log In</NavLink>
            </li>
            <li>
                <NavLink to='/signup'>Sign Up</NavLink>
            </li>
        </>
    );
    return (
        <nav>
            <ul>
                <li>
                    <NavLink to='/'>Home</NavLink>
                </li>
                {isLoaded && sessionLinks}
            </ul>
        </nav>
    )
}