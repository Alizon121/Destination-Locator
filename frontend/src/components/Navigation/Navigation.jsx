import { NavLink } from "react-router-dom"
import { useSelector} from 'react-redux'
import ProfileButton from './ProfileButton'
import { LuLocateFixed } from "react-icons/lu"; // add font icon for destination locator
import OpenModalMenuItem from "./OpenModalMenuItem";
import CreateSpotModal from "../CreateSpotModal";
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
                 <li className="create_spot_profile_buttons">
                     <span id="new_spot">
                         <OpenModalMenuItem
                             itemText={'Create a New Spot'}
                             modalComponent={<CreateSpotModal />}
                         />
                     </span>
                     <span id="profile_button">
                         <ProfileButton user={sessionUser} />
                     </span>
                 </li>
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