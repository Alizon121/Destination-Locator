import { editSpotThunk } from "../../store/spots";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function UpdateSpotModal({spotId}) {
    const [address, setAddress] = useState();
    const [city, setCity] = useState();
    const [state, setState] = useState();
    const [country, setCountry] = useState();
    const [lat, setLat] = useState();
    const [lng, setLng] = useState();
    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [price, setPrice] = useState();
    const [errors, setErrors] = useState();
    const dispatch = useDispatch();
    const {closeModal} = useModal();
    const navigate = useNavigate();

    const handleUpdate = async (e) => {
        e.preventDefault();

        const newErrors = {}
       if (!country) {
            newErrors.country = "Country is required"
       }
       if (!address) {
        newErrors.address = "Address is required"
        }
        if (!city) {
        newErrors.city = "City is required"
        }
        if (!state) {
            newErrors.state = "State is required"
       }
       if (!lat) {
        newErrors.lat = "Latitude is required"
        }
        if (!lng) {
            newErrors.lng = "Longitude is required"
       }
       if (!country) {
        newErrors.country = "Country is required"
        }
       if (description.length < 30) {
            newErrors.description = "Description must be at least 30 characters long"
        }
        if (!name) {
            newErrors.name = "Name is required"
       }
       if (!price) {
        newErrors.price = "Price is required"
        }
    //    const urlPattern = /^(http|https):\/\/.*\.(jpg|jpeg|png)$/;
    //    if (url1 && !urlPattern.test(url1)) { 
    //         newErrors.url1 = "URL must be a valid format (.jpg, .jpeg, .png)."; 
    //      }
    //    if (url2 && !urlPattern.test(url2)) { 
    //         newErrors.url2 = "URL must be a valid format (.jpg, .jpeg, .png)."; 
    //     }
    //     if (url3 && !urlPattern.test(url3)) { 
    //         newErrors.url3 = "URL must be a valid format (.jpg, .jpeg, .png)."; 
    //     }
    //     if (url4 && !urlPattern.test(url4)) { 
    //         newErrors.url4 = "URL must be a valid format (.jpg, .jpeg, .png)."; 
    //     }

        if (Object.keys(newErrors).length > 0) { 
            setErrors(newErrors); 
            return; 
        }

        const payload = {
            country,
            address,
            city,
            state,
            lat,
            lng,
            description, 
            name,
            price
        }

        const updateSpot = await dispatch(editSpotThunk(payload, spotId))
        closeModal()

        setErrors({})
        if (updateSpot) {
            closeModal();
            navigate(`/api/spots/manage-spots`)
        } 
    }

    return (
        <div>
            <form onSubmit={handleUpdate}>
                <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                />
                {errors.address && <p className="error">{errors.address}</p>}
                <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                />
                {errors.city && <p className="error">{errors.city}</p>}
                <input
                    type="text"
                    placeholder="state"
                    value={state}
                    onChange={e => setState(e.target.value)}
                />
                {errors.state && <p className="error">{errors.state}</p>}
                <input
                    type="text"
                    placeholder="country"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                />
                {errors.country && <p className="error">{errors.country}</p>}
                <input
                    type="text"
                    placeholder="lat"
                    value={lat}
                    onChange={e => setLat(e.target.value)}
                />
                {errors.lat && <p className="error">{errors.lat}</p>}
                <input
                    type="text"
                    placeholder="lng"
                    value={lng}
                    onChange={e => setLng(e.target.value)}
                />
                {errors.lng && <p className="error">{errors.lng}</p>}
                <input
                    type="text"
                    placeholder="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                {errors.name && <p className="error">{errors.name}</p>}
                <input
                    type="text"
                    placeholder="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
                {errors.description && <p className="error">{errors.description}</p>}
                <input
                    type="text"
                    placeholder="price"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                />
                {errors.price && <p className="error">{errors.price}</p>}
                <button onClick={closeModal}>Update</button>
                <button onClick={closeModal}>Cancel</button>
            </form>
        </div>
    )
}

export default UpdateSpotModal;