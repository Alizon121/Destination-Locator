import { NavLink } from "react-router-dom"
import { useSelector} from 'react-redux'
import ProfileButton from './ProfileButton'
import { LuLocateFixed } from "react-icons/lu"; // add font icon for destination locator
// import CreateSpot from "../Spots/CreateSpot";
import './Navigation.css'


function Navigation({isLoaded}) {
    // Use the useSelector hook to check for user
    const sessionUser = useSelector(state => state.session.user)
    return (
            <ul className="nav-bar">
                <div className="right-menu">
                    <NavLink to='/' className="icon-home">
                    <LuLocateFixed />
                    Destination Locator
                    </NavLink>
                </div>
            {isLoaded && sessionUser ? (
                 <>
                 <div className="create_spot_profile_buttons">
                <NavLink to={'/create-spot'}>Create a Spot</NavLink>
                     <span id="profile_button">
                         <ProfileButton user={sessionUser} />
                     </span>
                 </div>
             </>
            ): (
                <li>
                    <ProfileButton user={sessionUser} />
                </li>
            )}
            </ul>
    )
}

export default Navigation;