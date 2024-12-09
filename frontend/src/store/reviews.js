import { csrfFetch } from "./csrf"

// create action creator for loading the reviews for spot detail
const LOAD_REVIEWS_SPOTS_DETAILS = 'reviews/LOAD_REVIEWS_SPOTS_DETAILS'
const load = (reviews) => {
    return {
        type: LOAD_REVIEWS_SPOTS_DETAILS,
        reviews
    }
}

// create an action creator for making a review
const CREATE_REVIEW = 'reviews/CREATE_REVIEW'
const createReview = (payload) => {
    return {
        type: CREATE_REVIEW,
        payload
    }
}

// create a thunk action that fetches the review info
export const loadReviewsThunk = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if (response.ok) {
        const result = await response.json();
        dispatch(load({ spotId, reviews: result}))
    }
}

// Create a thunk action that creates a review
export const createReviewThunk = (payload, spotId) => async dispatch => {
    try {
        const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const result = await response.json();
            dispatch(createReview(result));
        } 
        else {
            const errorResult = await response.json();
            console.error('Server Error:', errorResult);
            throw new Error('Failed to create review');
        }
    } catch (error) {
        console.error('Network or Server Error:', error);
    }
};


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
        case CREATE_REVIEW: {
            const newState = {...state};
            const newReview = action.payload
            newState[newReview.id] = newReview
            return newState
        }
        default:
            return state;
    }
}

export default reviewReducer