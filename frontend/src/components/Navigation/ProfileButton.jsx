import { FaUserCircle } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from '../../store/session'
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
        
        const closeMenu = (event) => {
            if (ulRef.current && !ulRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('click', closeMenu);
        return () => document.removeEventListener('click', closeMenu);
        
    }, [showMenu]);
    
    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");  
    
    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout())
    }

    return (
       <>
       <button onClick={toggleMenu}>
            <FaUserCircle/>
        </button>
        <ul className={ulClassName} ref={ulRef}>
            <li>{user.username}</li>
            <li>{user.firstName} {user.lastName}</li>
            <li>{user.email}</li>
            <li>
                <button onClick={logout}>Log Out</button>
            </li>
        </ul>
       </> 
    )
}

export default ProfileButton