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
const createReview = (review) => {
    return {
        type: CREATE_REVIEW,
        review
    }
}

// Make an action creator for deleting a review
const DELETE_REVIEW = 'reviews/DELETE_REVIEW'
const deleteReview = (review) => {
    return {
        type: DELETE_REVIEW,
        review
    }
}

// create a thunk action that fetches the review info
export const loadReviewsThunk = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if (response.ok) {
        const result = await response.json();
        dispatch(load({spotId, reviews: result}))
    }
}

// Create a thunk action that creates a review
export const createReviewThunk = (review, spotId) => async dispatch => {
    try {
        const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
            method: 'POST',
            body: JSON.stringify(review)
        });

        if (response.ok) {
            const result = await response.json();
            dispatch(createReview(result));
            return result
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

// Create a thunk action for updating state
export const updateReviewThunk = (payload, reviewId) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`,{
        method: 'PUT',
        headers: {"Content-Type": "appplication/json"},
        body: JSON.stringify(payload)
    })

    if (response.ok) {
        const result = await response.json()
        // We do not need a new action creator for edit
        dispatch(load(result))
        return result
    }
}

// Create a thunk action that will delete a review
export const deleteReviewThunk = (reviewId) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    })

    if (response.ok) {
        dispatch(deleteReview(reviewId))
    }
}


// Make the reducer
const reviewReducer = (state = {}, action) => {
    switch(action.type) {
        case LOAD_REVIEWS_SPOTS_DETAILS: {
            const newState = {...state};
            newState[action.reviews.spotId] = action.reviews.reviews // Use spotId as key
            return newState;
        }
        // case CREATE_REVIEW: {
        //     const newState = {...state.reviews};
        //     const newReview = newState[action.review.spotId]
        //     return {...state, ...newState, newReview}
        // }
        // case CREATE_REVIEW: {
        //     return [...state, action.reviews.reviews.Reviews]; // Append the new review
        // }
        case CREATE_REVIEW: {
            const newState = { ...state };
            const newReview = action.review; // Ensure this matches the dispatched payload
            newState[newReview.id] = newReview; // Add/update the review by its ID
            return newState;
        }
        case DELETE_REVIEW: {
            const newState = {...state}
            delete newState[action.reviewId]
            return newState
        }
        default:
            return state;
    }
}

export default reviewReducer