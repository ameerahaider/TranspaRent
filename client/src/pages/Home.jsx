import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import styled from 'styled-components';
import Lottie from 'lottie-react';
import animationData from '../assets/blockchain-animation.json'

const FeatureBox = styled.div`
  background-color: #333;
  padding: 20px;
  border-radius: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #555;
    cursor: pointer;
  }
`;

// Styled components for reviews
const ReviewsContainer = styled.div`
  padding: 40px 20px;
`;

const Review = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const Author = styled.p`
  font-weight: bold;
  color: #333;
`;

const Location = styled.p`
  color: #666;
`;

// Then use FeatureBox component instead of div with the class name feature-box


export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
//  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  // console.log(offerListings);
  
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=6');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=6');
        const data = await res.json();
        setRentListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    // const fetchSaleListings = async () => {
    //   try {
    //     const res = await fetch('/api/listing/get?type=sale&limit=6');
    //     const data = await res.json();
    //     setSaleListings(data);
    //   } catch (error) {
    //     log(error);
    //   }
    // };
    fetchOfferListings();
  }, []);
  return (
    <div>
 <div className="bg-orange-200 text-white py-20 px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div>
              <h1 className="text-4xl text-black lg:text-5xl font-bold mb-6">
                Empowering landlords and tenants alike, we are <span className="text-orange-500">Transpa</span><span className="text-black">Rent</span>
              </h1>
              <p className="text-black text-lg lg:text-l mb-8">
                Revolutionizing the rental experience with seamless technology and unwavering commitment to transparency, security, and trust.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FeatureBox>
                  <i className="fas fa-shield-alt text-2xl text-orange-500 mb-2"></i>
                  <p className="font-semibold">Blockchain-Based Contract Management</p>
                </FeatureBox>
                <FeatureBox>
                  <i className="fas fa-balance-scale text-2xl text-orange-500 mb-2"></i>
                  <p className="font-semibold">Transparent Dispute Resolution Mechanism</p>
                </FeatureBox>
                <FeatureBox>
                  <i className="fas fa-chart-line text-2xl text-orange-500 mb-2"></i>
                  <p className="font-semibold">AI-Powered Data-Driven Pricing Suggestion</p>
                </FeatureBox>
              </div>
              <Link to={'/search'} className="bg-orange-500 text-white font-bold py-2 px-6 mt-8 inline-block hover:bg-orange-600 transition duration-300">Let's get started...</Link>
            </div>
            {/* Right part */}
            <div className="hidden sm:block">
              {/* Content for the right part */}
              <Lottie animationData={animationData} />
              {/* <img src="../assets/logo.jpg" alt="Logo"> </img> */}
              
            </div>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <ReviewsContainer className='bg-white'>
        <h2 className="text-3xl lg:text-3xl font-bold text-slate-600 text-center mb-6">What Our Users Say</h2> 
        <div className="max-w-4xl mx-auto">
          <Review>
            <p>"Exceptional platform! As a landlord, managing my rental properties has never been easier. The support team is incredibly helpful, and the secure contract management feature gives me peace of mind. Highly recommend!"</p>
            <Author>Sarah Khan</Author>
            <Location>F-10 Sector, Islamabad</Location>
          </Review>
          <Review>
            <p>"I've been using TranspaRent for a few months now, and I'm impressed by how user-friendly and efficient it is. The automated payment system saves me a lot of time, and the data-driven pricing suggestions helped me optimize my rental income. Great job!"</p>
            <Author>Ahmed Malik</Author>
            <Location>G-13 Sector, Islamabad</Location>
          </Review>
          {/* more reviews come here */}
        </div>
      </ReviewsContainer>

      
      {/* top
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-orange-500'>perfect</span>
          <br />
          place with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          TranspaRent is the best place to find your next perfect place to
          live.
          <br />
          Your contracts and data are secured with our top of the line technology!
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div> */}

{/* swiper */}
<Swiper navigation>
  {offerListings && offerListings.length > 0 && offerListings.map((listing) => (
    <SwiperSlide key={listing._id}>
      <div
        style={{
          background: `url(${listing.imageUrls[0]}) center no-repeat`,
          backgroundSize: 'cover',
          paddingTop: '45%', 
        }}
      ></div>
    </SwiperSlide>
  ))}
</Swiper>



      {/* listing results for offer, sale and rent */}
      <div className="bg-orange-200 text-white py-20 px-8 lg:px-16">
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-white'>Featured Offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-white'>Latest Properties</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      
      </div>
      </div>
    </div>
  );
}