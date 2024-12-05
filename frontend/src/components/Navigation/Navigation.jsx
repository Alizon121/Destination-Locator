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
            <ul>
                <li>
                    <NavLink to='/' className="icon-home">
                    <LuLocateFixed />
                    Destination Locator
                    </NavLink>
                </li>
            {isLoaded && sessionUser ? (
                <>
                    <li>
                        <OpenModalMenuItem
                            itemText={'Create a New Spot'}
                            modalComponent={<CreateSpotModal />}
                        />
                    </li>
                    <li>
                        <ProfileButton user={sessionUser} />
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