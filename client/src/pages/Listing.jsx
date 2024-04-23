import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import Web3 from 'web3';
import { Link } from 'react-router-dom';
import ReviewsContract from '../contracts/Reviews.json'; // Make sure this path is correct
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  // const [loginDetails, setloginDetails] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState('');
  const [reviewer, setReviewer] = useState('');
  const [rating, setRating] = useState(0);
  

//  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const initWeb3 = async () => {
      const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ReviewsContract.networks[networkId];
      const contractInstance = new web3.eth.Contract(
        ReviewsContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const accs = await web3.eth.getAccounts();
      setAccounts(accs);
      setContract(contractInstance);
      // setCurrentUser(accs[0]); // Assuming the first account is the current user
    };

    initWeb3();
  }, []);



  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        //console.log(currentUser.username)
        const res = await fetch(`/api/listing/get-with-user/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data.listing);
        setUserDetails(data.user);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);


  // const fetchloginDetails = async (_id) => {
  //   try {
  //     const res = await fetch(`/api/user/get/${_id}`);
  //     const data = await res.json();
  //     console.log('User details response:', data); 
  //     setloginDetails(data);
  //   } catch (error) {
  //     console.error('Error fetching user details:', error.message);
  //   }
  // };

  const getAddressIndex = (address) => {
    const ind = accounts.findIndex((acc) => acc.toLowerCase() === address.toLowerCase());
    return ind; // Will return -1 if not found
  };


  // Function to submit a review
  const submitReview = async (e) => {
    e.preventDefault();
    try {
      //console.log("SUBMIT",currentUser.index)
      await contract.methods.addReview(accounts[userDetails.index], review, rating).send({ from: accounts[currentUser.index], gas: 2000000 });
      // You might want to change accounts[1] to the correct account being reviewed
      setReviewer(currentUser.username)
      setReview('');
      setRating(0);
      window.location.reload();
      // Fetch reviews again if needed
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  // Function to load reviews for the listing
  const loadReviews = async () => {
    try {
      //console.log("LOAD",userDetails.index)
      //console.log("Account:", accounts[currentUser.index]);
      const reviewData = await contract.methods.getReviews(accounts[userDetails.index]).call();
      setReviews(reviewData);
      console.log("Fetched reviews: ", reviewData);
      // Adjust the account index as per your application's logic
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  };

  useEffect(() => {
    if (contract) {
      loadReviews();
    }
  }, [contract]);

  const handleBookNowClick = () => {
    // Construct the dynamic URL for contract creation based on listingId and userId
    const contractUrl = `/contract/${params.listingId}/${currentUser.id}`;
    window.location.href = contractUrl; // Redirect to contract creation page
  };
  


  return (
    <main className='bg-orange-200'>
      {loading && <p className='text-center text-black my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-black text-center my-7 text-2xl'>Something went wrong!</p>
      )}
      {listing && userDetails && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl text-black font-semibold'>
              {listing.name} - PKR{' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center mt-6 gap-2 text-black  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  PKR{+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className='text-slate-700'>
              <span className='font-semibold text-slate-800'>Description - </span>
              {listing.description}
            </p>
            <ul className='text-green-500 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 blackspace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 blackspace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 blackspace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 blackspace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            <p className='text-slate-700 font-semibold text-center mt-6'>
              Added by: {userDetails.username}
            </p>
        
            <div className='flex justify-center'>
            {listing.rented ? (
              <button
                className='bg-blue-800 text-black rounded-lg uppercase opacity-50 cursor-not-allowed p-3'
                disabled
              >
                Book Now (Rented)
              </button>
            ) : (
              <Link to={`/contract/${params.listingId}/${currentUser._id}`}>
                <button
                  className='bg-blue-800 text-white rounded-lg uppercase hover:opacity-95 p-3'
                >
                  Book Now
                </button>
              </Link>
            )}
          </div>   
          </div>
          <div className="max-w-lg mx-auto">

  {/* Review form */}
  <div className="my-8">
    <h3 className="text-lg text-black font-semibold mb-2">Write a Review:</h3>
    <form onSubmit={submitReview} className="flex flex-col gap-4">
      <textarea
        rows="4"
        placeholder="Your review"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        className="border rounded-md p-2"
      />
      <input
        type="number"
        placeholder="Rating out of 10"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="border rounded-md p-2 w-1/3"
      />
      <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-orange-400 transition duration-300">Submit Review</button>
    </form>
  </div>
   {/* Button to load reviews */}
   <div className="flex justify-center my-4">
        <button
          onClick={loadReviews}
          className="bg-orange-600 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded"
        >
          Load Reviews
        </button>
      </div>

  {/* Reviews list */}
  <div className="my-8">
    <h3 className="text-lg text-black font-semibold mb-2">Reviews:</h3>
    {reviews.length > 0 ? (
      reviews.map((review, index) => {
        const reviewerIndex = getAddressIndex(review.reviewer);
        return (
          <div key={index} className="border rounded-md p-4 mb-4">
            <p className="text-gray-100">Reviewer: {reviewerIndex >= 0 ? `Account ${reviewerIndex + 1} - ${review.reviewer}` : review.reviewer}</p>
            <p className="text-gray-100">Rating: {review.rating.toString()}</p>
            <p className="text-gray-100 mt-2">Review: {review.review}</p>
          </div>
        );
      })
    ) : (
      <p className="text-gray-600">No reviews available.</p>
    )}
  </div>

</div>

        </div>
      )}
    </main>
  );
}