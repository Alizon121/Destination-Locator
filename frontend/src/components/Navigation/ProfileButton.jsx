import { FaUserCircle } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from '../../store/session'
import OpenModalMenuItem from './OpenModalMenuItem'
import LoginFormModal from '../LoginFormModal'
import SignupFormModal from "../SignUpFormModal/SignUpFormModal";
import { GiHamburgerMenu } from "react-icons/gi";
import './ProfileButton.css'

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
    
    const ulClassName = "profile-dropdown" + (showMenu ? " " : " hidden");  
    // const menuClassName ="profile-dropdown-user" + (showMenu ? " " : " hidden")
    return (
       <>
       <div className="profile-menu-container" onClick={toggleMenu}>
       <button className="user-button">
            <GiHamburgerMenu/>
        </button>
        <div className="profile-icon">
            <FaUserCircle/>
        </div>
       </div>
        <ul className={ulClassName} ref={ulRef}>
            {user ? (
            <>
                <li>{user.username}</li>
                <li>{user.firstName} {user.lastName}</li>
                <li>{user.email}</li>
                <li>
                    <button onClick={logout}>Log Out</button>
                </li>
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