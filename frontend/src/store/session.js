import { csrfFetch } from "./csrf";

// Make action creator for setting the user in session to action creator's input
const SET_USER = 'session/SET_USER'
const setUser = (user) => {
    return {
      type: SET_USER,
      payload: user
    };
  };

// Make action creator for removing the user
const REMOVE_USER = 'session/REMOVE_USER'
const removeUser = () => {
  return {
    type: REMOVE_USER
  };
};

// Make a thunk aciton creator for calling log in API
export const login = (user) => async dispatch => {
    const { credential, password } = user
    const response = await csrfFetch('/api/session', {
        method: "POST",
        body: JSON.stringify({
            credential, 
            password
        })
    })
        const result = await response.json()
        dispatch(setUser(result.user))
        return response
}

// Create the sessionReducer to update state
const intialState = {user: null}
const sessionReducer = (state = intialState, action) => {
    switch(action.type) {
        case SET_USER: {
            return {
                ...state,
                user: action.payload
            }
        }
        case REMOVE_USER: {
            return { ...state, user: null}
        }
        default:
            return state
    }
}

export default sessionReducer