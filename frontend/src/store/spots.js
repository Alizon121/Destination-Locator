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

// Create a thunk action that will fetch spots data from the db
export const loadSpotsData = () => async dispatch => {
    const response = await fetch('/api/spots/');

    if (response.ok) {
        const result = await response.json();
        dispatch(load(result))
    }
}

// Create a thunk action that will fetch spots details
export const loadSpotDetails = (spotId) => async dispatch => {
    const response = await fetch(`/api/spots/${spotId}`)

    if (response.ok) {
        const result = await response.json();
        dispatch(loadDetails(result))
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
                return {
                    ...state
                }
        }
        default: 
        return state
    }
};

export default spotsReducer