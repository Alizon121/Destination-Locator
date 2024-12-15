import { FaUserCircle } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from '../../store/session'
import { NavLink } from "react-router-dom";
import OpenModalMenuItem from './OpenModalMenuItem'
import LoginFormModal from '../LoginFormModal'
import SignupFormModal from "../SignUpFormModal/SignUpFormModal";
import { GiHamburgerMenu } from "react-icons/gi";

function ProfileButton({user}) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false)
    const ulRef = useRef();
    
    const toggleMenu = (e) => {
        e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
        setShowMenu(!showMenu);
    };
    
    // Add the useEffect to change the showMenu state
    useEffect(() => {
        if (!showMenu) return;
        
        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('click', closeMenu);
        return () => document.removeEventListener('click', closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false)
    
    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout())
        closeMenu();
    }
    
    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");  
    return (
       <>
            <div className="profile-menu-container" onClick={toggleMenu}>
                <button className="user-button">
                    <GiHamburgerMenu />
                </button>
                <div className="profile-icon">
                    <FaUserCircle />
                </div>
            </div>
        <ul className={ulClassName} ref={ulRef}>
            {user ? (
            <>
                <div className="dropdown_username_firstName_email">
                    {/* <span> Hello, {user.username}</span> */}
                    <span>Hello, {user.firstName}</span>
                    <span>{user.email}</span>
                </div>
                <div className="manage_spots_reviews_logout_container">
                    <span>
                        <NavLink to={'/manage-spots'}>Manage Spots</NavLink>
                    </span>
                    <span>
                        <NavLink to={'/manage-reviews'}>Manage Reviews</NavLink>    
                    </span>
                </div>
                <div className="dropdown_logout">
                    <button onClick={logout}><NavLink to={'/'}>Log Out</NavLink></button>
                </div>
            </>
        ): (
            <div className="base_menu">
                <div className="profile_login">
                    <OpenModalMenuItem
                        itemText="Log In"
                        onItemClick={closeMenu}
                        modalComponent={<LoginFormModal/>}
                    />
                </div>
                    <div className="profile_signup">
                        <OpenModalMenuItem
                            itemText="Sign Up"
                            onItemClick={closeMenu}
                            modalComponent={<SignupFormModal/>}
                        />
                    </div>
            </div>
            )}
        </ul>
       </> 
    )
}

export default ProfileButton