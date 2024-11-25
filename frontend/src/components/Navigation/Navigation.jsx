import { NavLink } from "react-router-dom"
import { useSelector} from 'react-redux'
import ProfileButton from './ProfileButton'
import OpenModalButton from "../OpenModalButton/OpenModalButton"
import LoginFormModal from "../LoginFormModal/LoginFormModal"
import SignUpFormModal from "../SignUpFormModal/SignUpFormModal"
import './Navigation.css'

function Navigation({isLoaded}) {
    // Use the useSelector hook to check for user
    const sessionUser = useSelector(state => state.session.user)

    const sessionLinks = sessionUser ? (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
    ) : (
        <>
            <li>
                <OpenModalButton 
                buttonText="Log In"
                modalComponent={<LoginFormModal/>}
                />
            </li>
            <li>
                <OpenModalButton 
                buttonText="Sign Up"
                modalComponent={<SignUpFormModal/>}/>
            </li>
        </>
    );
    return (
            <ul>
                <li>
                    <NavLink to='/'>Home</NavLink>
                </li>
                {isLoaded && sessionLinks}
            </ul>
    )
}

export default Navigation;