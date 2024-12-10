import { csrfFetch } from "./csrf"

// create an action creator for loading spots data
const LOAD_SPOTS = 'spots/LOAD_SPOTS'
const load = (spots) => {
    return {
        type: LOAD_SPOTS,
        spots
    }
}

// create an action creator for loading spot details
const LOAD_SPOT_DETAILS = 'spots/LOAD_SPOT_DETAILS'
const loadDetails = (spots) => {
    return {
        type: LOAD_SPOT_DETAILS,
        spots
    }
}

// Make an action creator for creating a spot
const CREATE_SPOT = 'spots/CREATE_SPOT'
const createSpot = (spot) => {
    return {
        type: CREATE_SPOT,
        spot
    }
}

// Make an action creator for deleting a spot
const DELETE_SPOT = 'spots/DELETE_SPOT'
const deleteSpot = (spot) => {
    return {
        type: DELETE_SPOT,
        spot
    }
}

// Create a thunk action that will fetch spots data from the db
export const loadSpotsData = () => async dispatch => {
    const response = await csrfFetch('/api/spots/');
    
    if (response.ok) {
        const result = await response.json();
        dispatch(load(result))
    }
}

// Create an action creator for getting the current user's spots
const LOAD_CURRENT_USER_SPOTS = 'spots/LOAD_CURRENT_USER_SPOTS'
const loadUsersSpots = (spots) => {
    return {
        type: LOAD_CURRENT_USER_SPOTS,
        spots
    }
}

// Create a thunk action that will fetch spots details
export const loadSpotDetails = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`)

    if (response.ok) {
        const result = await response.json();
        dispatch(loadDetails(result))
    }
}

// Create a thunk action that will create spot
export const createSpotThunk = (spotData, images) => async dispatch => {
    const response = await csrfFetch('/api/spots/', {
        method: 'POST',
        // headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(spotData)
    })
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData)
    }
    
    if (response.ok) {
        console.log(response)
        const result = await response.json()
        for (const image of images) { 
            await csrfFetch(`/api/spots/${result.id}/images`, 
                { method: 'POST', 
                //   headers: { 'Content-Type': 'application/json' }, 
                  body: JSON.stringify(image), 
                }); 
            }
            dispatch(createSpot(result))
            dispatch(loadCurrentUserSpot())
            return result
    }
}

// Create a thunk action that will load current user's spots
export const loadCurrentUserSpot = () => async dispatch => {
    const response = await csrfFetch('/api/spots/current')

    if (response.ok) {
        const result = await response.json()
        dispatch(loadUsersSpots(result))
    }
}

// Create a thunk action that will delete a spot
export const deleteSpotThunk = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'    
    })

    if (response.ok) {
        dispatch(deleteSpot(spotId))
    }
}

// Create a thunk action for updating a spot
export const editSpotThunk = (payload, spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    })

    if (response.ok) {
        const result = await response.json();
        dispatch(loadCurrentUserSpot(result))
        return result
    }
}

// create reducer for updating the store
const spotsReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_SPOTS: {
            const allSpots = {};
            action.spots.Spots.forEach(spot => {
                allSpots[spot.id] = spot;
            });
            return {
                ...state,
                ...allSpots
            };
        }
        case LOAD_SPOT_DETAILS: {
            const newState = {
                ...state,
                [action.spots.id]: {
                    ...action.spots
                }
            };
            return newState
        }
        case CREATE_SPOT: {
            const newState = {...state }
            const newSpot = action.spots
            return {newState, newSpot}
        }
        case LOAD_CURRENT_USER_SPOTS: {
            const newState = {};
            action.spots.Spots.forEach((spot) => {
                newState[spot.id] = {
                    ...spot
                }
            })
            return newState
        }
        case DELETE_SPOT: {
            const newState = {...state};
            delete newState[action.spotsId]
            return newState
        }
        default: 
        return state
    }
};

export default spotsReducer