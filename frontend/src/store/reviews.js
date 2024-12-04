import { csrfFetch } from "./csrf"

// create action creator for loading the reviews for spot detail
const LOAD_REVIEWS_SPOTS_DETAILS = 'reviews/LOAD_REVIEWS_SPOTS_DETAILS'
const load = (review) => {
    return {
        type: LOAD_REVIEWS_SPOTS_DETAILS,
        review
    }
}

// create a thunk action that fetches the review info
export const loadReviews = (id) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${id}/reviews`)

    if (response.ok) {
        const result = await response.json();
        console.log(result)
        dispatch(load(result))
    }
}

// Make the reducer
const reviewReducer = (state = {}, action) => {
    switch(action.type) {
        case LOAD_REVIEWS_SPOTS_DETAILS: {
            const newState = {}
            action.review.forEach(review => {
                newState[review.id] = review
            })
            return {
                ...state,
                ...newState
            }
        }
        default:
            return state
    }

}

export default reviewReducer