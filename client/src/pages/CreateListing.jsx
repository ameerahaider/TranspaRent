import { useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    location: "",
    propertyType: 0,
    size: 0,
    areaType: "",
    regularPrice: 0,
    discountPrice: 0,
    bathrooms: 1,
    bedrooms: 1,
    furnished: false,
    parking: false,
    type: "rent",
    offer: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // State for storing the suggested price
  const [suggestedPrice, setSuggestedPrice] = useState(null);

  // Function to fetch suggested price from the Flask API using Axios
  const fetchSuggestedPrice = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/predict_price", {
        location: formData.location,
        property_type: formData.propertyType,
        baths: formData.bathrooms,
        bedrooms: formData.bedrooms,
        area: formData.size,
        area_type: formData.areaType,
      });

      const data = response.data;
      if (data.predicted_price) {
        setSuggestedPrice(data.predicted_price);
      } else {
        setSuggestedPrice(null);
      }
    } catch (error) {
      console.error("Error fetching suggested price:", error);
      setSuggestedPrice(null);
    }
  };

  // useEffect hook to fetch suggested price when relevant form fields change
  useEffect(() => {
    fetchSuggestedPrice();
  }, [formData.location, formData.propertyType, formData.bathrooms, formData.bedrooms, formData.size, formData.areaType]);


  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (5 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (
      e.target.id === "sale" ||
      e.target.id === "rent" ||
      e.target.id === "location" ||
      e.target.id === "propertyType" ||
      e.target.id === "bathrooms" ||
      e.target.id === "bedrooms" ||
      e.target.id === "size" ||
      e.target.id === "areaType"
    ) {
      // Update formData state
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    } else if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      // Update formData state for checkbox inputs
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    } else if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      // Update formData state for number, text, and textarea inputs
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="bg-orange-200">
      <div className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl text-black font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <input
            type="text"
            placeholder="Location"
            className="border p-3 rounded-lg"
            id="location"
            required
            onChange={handleChange}
            value={formData.location}
          />
          <select
            className="border p-3 rounded-lg"
            id="propertyType"
            onChange={handleChange}
            value={formData.propertyType}
            required
          >
            <option value="1">House</option>
            <option value="2">Flat</option>
            <option value="3">Upper Portion</option>
            <option value="4">Lower Portion</option>
            <option value="5">Penthouse</option>
            <option value="6">Room</option>
            <option value="7">Farm House</option>
          </select>

          <div className="flex items-center gap-2">
            <input
              type="number"
              id="size"
              min="1"
              max="10000" 
              required
              className="p-3 border border-gray-300 rounded-lg"
              onChange={handleChange}
              value={formData.size}
            />
            <p className="text-black">Area Size</p>
          </div>


          <select
            className="border p-3 rounded-lg"
            id="areaType"
            onChange={handleChange}
            value={formData.areaType}
            required
          >
            <option value="Marla">Marla</option>
            <option value="Kanal">Kanal</option>
          </select>

          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span className="text-black">Sell</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span className="text-black">Rent</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span className="text-black">Parking spot</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span className="text-black">Furnished</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span className="text-black">Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p className="text-black">Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p className="text-black">Baths</p>
            </div>
            
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='50'
                max='10000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className='flex flex-col items-center'>
                <p className="text-black">Regular price</p>
                {formData.type === 'rent' && (
                  <span className='text-xs text-black'>(PKR / month)</span>
                )}
              </div>
            </div>

            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p className="text-black">Discounted price</p>
                  {formData.type === "rent" && (
                    <span className="text-xs">(PKR / month)</span>
                  )}
                </div>
              </div>
            )}

            {suggestedPrice && (
              <p className="text-yellow-300 text-xl">
                AI Suggested Price: {suggestedPrice}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          {/* Images upload section */}
          <p className="text-black font-semibold">
            Images:
            <span className="font-normal text-gray-800 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4 text-black">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          {/* Submission button */}
          <button
            disabled={loading || uploading}
            className="p-3 bg-orange-600 text-black rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
      </div>
    </main>
  );
}

