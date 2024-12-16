import {useState} from "react"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSpotThunk } from "../../../store/spots";
import './CreateSpot.css'

function CreateSpot() { // remove {navigate} from argument
    // We need to make a form for making a new spot
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
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const numberLat = parseFloat(lat);
    const numberLng = parseFloat(lng);
    const urlPattern = /^(https?:\/\/(?:www\.)?[^\s/.?#].[^\s]*)$/i;

    // console.log(images?.slice(1).map(image => image.url.length < 1))


    const handleSubmit = async (e) => {
        e.preventDefault()
        // we can check to see that images does not contain an empty url string here!
        // Handle validations here:
        const newErrors = {}
        if (!country) newErrors.country = "Country is required"
        if (!address) newErrors.address = "Address is required"
        if (!city) newErrors.city = "City is required"
        if (!state) newErrors.state = "State is required"
        if (!numberLat || isNaN(numberLat) || numberLat < -90 || numberLat > 90) newErrors.lat = "Latitude must be between -90 and 90";
        if (!numberLng || isNaN(numberLng) || numberLng < -180 || numberLng > 180) newErrors.lng = "Longitude must be between -180 and 180";
        if (!country) newErrors.country = "Country is required"
        if (description.length < 30) newErrors.description = "Description must be at least 30 characters long"
        if (!name) newErrors.name = "Name is required"
        if (!price) newErrors.price = "Price is required"
        if (images.map(arr => arr.url.length > 1)[0] === false) newErrors.images = "One preview image is required"
        
        images?.slice(1).forEach((image, index) => {
                if (image.url.length < 1) {newErrors[`image${index+1}`] = "Please provide url or remove image"}
            })
            // images.map((image) => {if (image.url.length < 1) newErrors.images = "Please provide or remove additional image."})
            
        
       images.forEach((image, index) => { if (image.url && !urlPattern.test(image.url)) { 
            newErrors[`image${index}`] = "URL must be a valid format."; 
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
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            description, 
            name,
            price,
        }

        setErrors({})

        // We need to create a thunk action for creating a spot
        try {
            const newSpot = await dispatch(createSpotThunk(payload, images))
            // make a thunk aciton for making a fetch request to spot image creation at '/api/spots/:spotId/images'
            if (newSpot) {
                navigate(`/spots/${newSpot.id}`)
            }
        } catch (error){
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

    const handleImageRemove = () => {
        const oldImages = [...images];
        // console.log(oldImages.length-1)
        // if (oldImages.length > 1) {
            oldImages.splice(oldImages.length-1, 1)
            setImages(oldImages)
        // } else {
            // return setErrors(errors.images = "Please provide at least one image.")
        // }
    }

    const handleCancelClick = (e) => {
        e.preventDefault();
        navigate('/')
      };

    return (
        <div className="create_spot_container">
        <form className="create_spot_form" onSubmit={handleSubmit} noValidate>
            <div>
                <h1>Create A Spot</h1>
                <h2>{`Where's Your Spot Located`}</h2>
                <p>Guests will only get the exact location when booking a reservation.</p>
            </div>
            <div className="prelim_info">
                <input 
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                />
                {errors.country && <p className="error">{errors.country}</p>}
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
            </div>
            <div className="description_container">
                <h2>Describe Your Place to Guests</h2>
                <p>Mention the best features of your space, any special amenities, and what you love about the neighborhood.</p>
                <textarea
                    type="text"
                    placeholder="Please write at least 30 characters"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
                {errors.description && <p className="error">{errors.description}</p>}
            </div>
            <div className="name_input_container">
                <h2>Create a Title for Your Spot</h2>
                <p>{`Catch guests' attention with a spot title that highlights what makes your place special.`}</p>
                <input 
                    type="text"
                    placeholder="Name of Your Spot"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                {errors.name && <p className="error">{errors.name}</p>}
            </div>
            <div className="price_input">
                <h2>Set a Base Price for Your Spot</h2>
                <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                <input 
                    type="number"
                    placeholder="Price per night (USD)"
                    min="0"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                />
                {errors.price && <p className="error">{errors.price}</p>}
            </div>
            <div className="url_inputs">
                <h2>Live Up Your Spot with Photos</h2>
                <p>Submit a link with at least one photo to submit your spot</p>
                {images.map((image, index) => ( 
                    <div key={index} className="image_input_container"> 
                        <input 
                        type="url" 
                        placeholder="Photo URL" 
                        value={image.url} 
                        onChange={(e) => handleImageChange(index, 'url', e.target.value)} 
                        /> 
                        {errors[`image${index}`] && <p className="error">{errors[`image${index}`]}</p>} 
                        {errors.images && <p className="error">{errors.images}</p>}
                            <label>
                                <div className="create_spot_preview_input">
                                    Set Preview Image
                                    <div>
                                        <input 
                                        type="checkbox" 
                                        checked={image.preview} 
                                        onChange={(e) => handleImageChange(index, 'preview', e.target.checked)} 
                                        /> 
                                    </div>
                                </div> 
                            </label>
                    </div> ))}
                    {images.length <=4 &&
                        <button type="button" onClick={handleAddImage}>Add Another Image</button> 
                    } 
                    {images.length > 1 &&
                        <button type="button" onClick={handleImageRemove}>Remove Image</button>     
                    }
            </div> 
            <button type="submit">Create Spot</button>
            <button type="button" onClick={handleCancelClick}>Cancel</button>
            </form>
        </div>
    )
}

export default CreateSpot