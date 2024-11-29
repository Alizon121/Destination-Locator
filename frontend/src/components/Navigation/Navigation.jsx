import { NavLink } from "react-router-dom"
import { useSelector} from 'react-redux'
import ProfileButton from './ProfileButton'
import { LuLocateFixed } from "react-icons/lu"; // add font icon for destination locator
import './Navigation.css'

function Navigation({isLoaded}) {
    // Use the useSelector hook to check for user
    const sessionUser = useSelector(state => state.session.user)

    return (
            <ul>
                <li>
                    <NavLink to='/' className="icon-home">
                    <LuLocateFixed />
                    Destination Locator
                    </NavLink>
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