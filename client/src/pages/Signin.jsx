import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
import logo from '../assets/icon.png'; // Import your logo file

export default function Signin() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData(
      {
        ...formData,
        [e.target.id]: e.target.value,
      }
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/'); {/* after sign up navigate to sign in */ }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className="bg-orange-200 p-8 max-w-lg  mx-auto rounded-lg shadow-lg mt-10 mb-10">
      <div className="flex justify-center"> {/* Align content to center */}
        <div className='flex items-center'> {/* Wrap TranspaRent and logo in a div */}
          <img src={logo} alt="Logo" className="h-8 w-8  mr-1.5" /> {/* Add your logo */}
          <h1 className='font-bold text-orange-500 text-sm sm:text-3xl flex flex-wrap'>
            <span>Transpa</span>
            <span className='text-black'>Rent</span>
          </h1>
        </div>
      </div>
      <h1 className='text-2xl text-orange-500 font-bold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='email' placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange} />
        <input type='password' placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
        <button disabled={loading} className='bg-orange-600 text-black p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Sign In'}
        </button>
      </form>
      <div className="flex gap-2 text-slate-800 mt-5">
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>

  )

}
