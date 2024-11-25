import { NavLink } from "react-router-dom"
import { useSelector} from 'react-redux'
import ProfileButton from './ProfileButton'
import './Navigation.css'

function Navigation({isLoaded}) {
    // Use the useSelector hook to check for user
    const sessionUser = useSelector(state => state.session.user)

    return (
            <ul>
                <li>
                    <NavLink to='/'>Home</NavLink>
                </li>
                {isLoaded && (
                    <li>
                        <ProfileButton user={sessionUser}/>
                    </li>
                )}
            </ul>
    )
}

export default Navigation;