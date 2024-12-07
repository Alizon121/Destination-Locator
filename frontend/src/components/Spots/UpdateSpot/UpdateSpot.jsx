import { editSpotThunk } from "../../../store/spots";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import './UpdateSpot.css'

function UpdateSpot() {
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [images, setImages] = useState([{ url: '', preview: false }])
    const [errors, setErrors] = useState({})
    const {spotId} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleUpdate = async (e) => {
        e.preventDefault();

        const newErrors = {}
        if (!country) newErrors.country = "Country is required"
        if (!address) newErrors.address = "Address is required"
        if (!city) newErrors.city = "City is required"
        if (!state) newErrors.state = "State is required"
        if (!lat) newErrors.lat = "Latitude is required"
        if (!lng) newErrors.lng = "Longitude is required"
        if (!country) newErrors.country = "Country is required"
        if (description.length < 30) newErrors.description = "Description must be at least 30 characters long"
        if (!name) newErrors.name = "Name is required"
        if (!price) newErrors.price = "Price is required"

        const urlPattern = /^(http|https):\/\/.*\.(jpg|jpeg|png)$/;
        images.forEach((image, index) => { if (image.url && !urlPattern.test(image.url)) { 
             newErrors[`image${index}`] = "URL must be a valid format (.jpg, .jpeg, .png)."; 
             } 
         });
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

        setErrors({})
        try {
            const updatedSpot = await dispatch(editSpotThunk(payload, spotId))
            if (updatedSpot) {
                navigate(`/manage-spots`)
            }  
        } catch(error) {
            if (error instanceof Error) {
                setErrors({general: error.message})
            } else {
                setErrors({general: "An error occured. Please try again."})
            }
        }
    }

    const handleAddImage = () => { 
        setImages([...images, { url: '', preview: false }]); 
    };

    const handleImageChange = (index, field, value) => { 
        const newImages = [...images]; 
        newImages[index][field] = value; 
        setImages(newImages); 
    };

    const handleCancelClick = (e) => {
        e.preventDefault();
        navigate('/manage-spots')
      };


    return (
        <div className="update_spot_container" >
            <form onSubmit={handleUpdate}>
                <div>
                    <h1>Update Spot</h1>
                </div>
                <div className="update_spot_inputs">
                <input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                />
                {errors.address && <p className="error">{errors.address}</p>}
                <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                />
                {errors.city && <p className="error">{errors.city}</p>}
                <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                />
                {errors.country && <p className="error">{errors.country}</p>}
                <input
                    type="text"
                    placeholder="State"
                    value={state}
                    onChange={e => setState(e.target.value)}
                />
                {errors.state && <p className="error">{errors.state}</p>}
                <input
                    type="text"
                    placeholder="Latitude"
                    value={lat}
                    onChange={e => setLat(e.target.value)}
                />
                {errors.lat && <p className="error">{errors.lat}</p>}
                <input
                    type="text"
                    placeholder="Longitude"
                    value={lng}
                    onChange={e => setLng(e.target.value)}
                />
                {errors.lng && <p className="error">{errors.lng}</p>}
                <input
                    type="text"
                    placeholder="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
                {errors.description && <p className="error">{errors.description}</p>}
                <input
                    type="text"
                    placeholder="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                {errors.name && <p className="error">{errors.name}</p>}
                <input
                    type="text"
                    placeholder="price"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                />
                {errors.price && <p className="error">{errors.price}</p>}
                {images.map((image, index) => ( 
                    <div key={index} className="image_input_container"> 
                        <input 
                        type="url" 
                        placeholder="Photo URL" 
                        value={image.url} 
                        onChange={(e) => handleImageChange(index, 'url', e.target.value)} 
                        /> 
                        {errors[`image${index}`] && <p className="error">{errors[`image${index}`]}</p>} 
                        <div className="update_spot_preview_image_container"> 
                            Preview
                            <input 
                            type="checkbox" 
                            checked={image.preview} 
                            onChange={(e) => handleImageChange(index, 'preview', e.target.checked)} 
                            /> 
                        <button type="button" onClick={handleAddImage}>Add Another Image</button> 
                        </div> 
                        </div> ))}
                </div>
                <div className="update_spot_buttons">
                    <button type="submit">Update</button>
                    <button onClick={handleCancelClick}>Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default UpdateSpot;