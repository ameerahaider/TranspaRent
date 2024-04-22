import { FaSearch } from 'react-icons/fa';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import logo from '../assets/logo.png'; // Import your logo file

export default function Header() {
  const { currentUser } = useSelector(state => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, []);

  return (
    <header className='bg-white shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <div className='flex items-center'> {/* Wrap TranspaRent and logo in a div */}
            <img src={logo} alt="Logo" className="h-8 w-8 rounded-full mr-2" /> {/* Add your logo */}
            <h1 className='font-bold text-orange-500 text-sm sm:text-2xl flex flex-wrap'>
              <span>Transpa</span>
              <span className='text-black'>Rent</span>
            </h1>
          </div>
        </Link>
        <form onSubmit={handleSubmit} className='bg-white p-3 rounded-lg flex item-center'>
          <input type="text" placeholder="Search..."
            className='bg-transparent focus:outline-none w-24 sm:w-64'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className='text-orange-500' />
          </button>
        </form>
        <ul className='flex gap-4'>
          <NavLink to='/' className={({isActive}) => (isActive ? "font-bold" : '')}>
            <li className='hidden sm:inline text-orange-500 hover:text-black'>Home</li>
          </NavLink>
          <NavLink to='/about' className={({isActive}) => (isActive ? "font-bold" : '')}>
            <li className='hidden sm:inline text-orange-500 hover:text-black'>About</li>
          </NavLink>
          <NavLink to='/contracts' className={({isActive}) => (isActive ? "font-bold" : '')}>
            <li className='hidden sm:inline text-orange-500 hover:text-black'>Contracts</li>
          </NavLink>
          <Link to='/profile'>
            {currentUser ? (
              <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='profile' />
            ) : (
              <li className='text-orange-500 hover:text-black'>Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  )
}
