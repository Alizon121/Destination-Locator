import { csrfFetch } from "./csrf"

// create action creator for loading the reviews for spot detail
const LOAD_REVIEWS_SPOTS_DETAILS = 'reviews/LOAD_REVIEWS_SPOTS_DETAILS'
const load = (reviews) => {
    return {
        type: LOAD_REVIEWS_SPOTS_DETAILS,
        reviews
    }
}

// create a thunk action that fetches the review info
export const loadReviews = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if (response.ok) {
        const result = await response.json();
        dispatch(load({ spotId, reviews: result}))
    }
}

// Make the reducer
const reviewReducer = (state = {}, action) => {
    switch(action.type) {
        case LOAD_REVIEWS_SPOTS_DETAILS: {
            const newState = {
                ...state,
                [action.reviews.spotId]: action.reviews.reviews // Use spotId as key
            };
            return newState;
        }
        default:
            return state;
    }
}

export default reviewReducer