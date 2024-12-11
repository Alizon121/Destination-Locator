import { csrfFetch } from "./csrf"

// create action creator for loading the reviews for spot detail
const LOAD_REVIEWS_SPOTS_DETAILS = 'reviews/LOAD_REVIEWS_SPOTS_DETAILS'
const load = (reviews) => {
    return {
        type: LOAD_REVIEWS_SPOTS_DETAILS,
        reviews
    }
}

// Create an action creator for loading the current user's reviews
const LOAD_CURRENT_USER_REVIEWS = 'reviews/LOAD_CURRENT_USER_REVIEWS'
const loadUserReviews = (reviews) => {
    return {
        type: LOAD_CURRENT_USER_REVIEWS,
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

// Make an action creator for updating the review
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW'
const updateReview = (review) => {
    return {
        type: UPDATE_REVIEW,
        review
    }
}
// create a thunk action that fetches the review info
export const loadReviewsThunk = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if (response.ok) {
        const result = await response.json();
        // console.log(result)
        dispatch(load(result))
    }
}

// create a thunk action that will load current user's reviews
export const loadCurrentUserReviews = () => async dispatch => {
    const response = await csrfFetch('/api/reviews/current')

    if (response.ok) {
        const result = await response.json();
        dispatch(loadUserReviews(result))
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
        body: JSON.stringify(payload)
    })

    if (response.ok) {
        const result = await response.json()
        // We do not need a new action creator for edit
        dispatch(updateReview(result))
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
                const allReviews = {};
                action.reviews.Reviews.forEach(review => {
                    allReviews[review.id] = review;
                });
                return {
                    // ...state,
                    ...allReviews
                };
            }
        case CREATE_REVIEW: {
            return {
                ...state,
            [action.review.id]: {
                ...action.review
            }
        }}
        case LOAD_CURRENT_USER_REVIEWS: {
            const newState = {};
            action.reviews.Reviews.forEach((spot) => {
                newState[spot.id] = {
                    ...spot
                }
            })
            return newState
        }
        case UPDATE_REVIEW: {
            const updatedReview = action.review
            return {
                ...state,
                [updatedReview.id]: updatedReview
            }
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