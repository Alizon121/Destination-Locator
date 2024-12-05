import {useState} from "react"
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createSpotThunk } from "../../store/spots";
import './CreateSpotModal.css'

function CreateSpotModal({navigate}) {
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
    const [url1, setUrl1] = useState('');
    const [url2, setUrl2] = useState('');
    const [url3, setUrl3] = useState('');
    const [url4, setUrl4] = useState('');
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch();
    const {closeModal} = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault()
        const payload = {
            country,
            address,
            city,
            state,
            lat,
            lng,
            description, 
            name,
            price,
            SpotImages: [
                {url: url1},
                {url: url2},
                {url: url3},
                {url: url4}
            ]
        }
        
        setErrors({})
        // We need to create a thunk action for creating a spot
        try {
            const newSpot = await dispatch(createSpotThunk(payload))
            if (newSpot) {
                closeModal()
                navigate(`/api/spots/${newSpot.id}`)
            }
        } catch (error){
                if (error instanceof Error) {
                    setErrors({general: error.message})
                } else {
                    setErrors({general: "An error occured. Please try again."})
                }
        }
    }

    const handleCancelClick = (e) => {
        e.preventDefault();
        closeModal();
      };

    return (
        <div className="create_spot_container">
        <form className="create_spot_form" onSubmit={handleSubmit}>
            <div>
                <h1>Create A Spot</h1>
                <h2>Where's Your Spot Located</h2>
                <p>Guests will only get the exact location when booking a reservation.</p>
            </div>
            <div className="prelim_info">
                <input 
                    type="text"
                    placeholder="country"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    required
                />
                {errors.country && <p className="error">{errors.country}</p>}
                  <input 
                    type="text"
                    placeholder="address"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    required
                />
                {errors.address && <p className="error">{errors.address}</p>}
                 <input 
                    type="text"
                    placeholder="city"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    required
                />
                {errors.city && <p className="error">{errors.city}</p>}
                  <input 
                    type="text"
                    placeholder="state"
                    value={state}
                    onChange={e => setState(e.target.value)}
                    required
                />
                {errors.state && <p className="error">{errors.state}</p>}
                  <input 
                    type="text"
                    placeholder="latitude"
                    value={lat}
                    onChange={e => setLat(e.target.value)}
                />
                {errors.latitude && <p className="error">{errors.latitude}</p>}
                <input 
                    type="text"
                    placeholder="longitude"
                    value={lng}
                    onChange={e => setLng(e.target.value)}
                />
                {errors.longitude && <p className="error">{errors.longitude}</p>}
            </div>
            <div className="description_container">
                <h2>Describe Your Place to Guests</h2>
                <p>Mention the best features of your space, any special amenities, and what you love about the neighborhood.</p>
                <textarea
                    type="text"
                    placeholder="Please write at least 20 characters"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                />
                {errors.description && <p className="error">{errors.description}</p>}
            </div>
            <div>
                <h2>Create a Title for Your Spot</h2>
                <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                <input 
                    type="text"
                    placeholder="Name of Your Spot"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
                {errors.title && <p className="error">{errors.title}</p>}
            </div>
            <div>
                <h2>Set a Base Price for Your Spot</h2>
                <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                <input 
                    type="text"
                    placeholder="Price per night (USD)"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    required
                />
                {errors.price && <p className="error">{errors.price}</p>}
            </div>
            <div>
                <h2>Live Up Your Spot with Photos</h2>
                <p>Submit a link with at least one photo to submit your spot</p>
                <input
                    type="url"
                    placeholder="Photo URL"
                    value={url1}
                    onChange={e => setUrl1(e.target.value)}
                    required
                />
                {errors.url1 && <p className="error">{errors.url1}</p>}
                 <input
                    type="url"
                    placeholder="Photo URL"
                    value={url2}
                    onChange={e => setUrl2(e.target.value)}
                />
                {errors.url2 && <p className="error">{errors.url2}</p>}
                 <input
                    type="url"
                    placeholder="Photo URL"
                    value={url3}
                    onChange={e => setUrl3(e.target.value)}
                />
                {errors.url3 && <p className="error">{errors.url3}</p>}
                 <input
                    type="url"
                    placeholder="Photo URL"
                    value={url4}
                    onChange={e => setUrl4(e.target.value)}
                />
                {errors.url4 && <p className="error">{errors.url4}</p>}
            </div>
            <button type="submit">Create New Spot</button>
            <button type="button" onClick={handleCancelClick}>Cancel</button>
            </form>
        </div>
    )
}

export default CreateSpotModal