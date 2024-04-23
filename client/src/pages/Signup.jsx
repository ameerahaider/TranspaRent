import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function Signup() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if(data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in'); {/* after sign up navigate to sign in */}
    } catch (error) {
      setLoading(false);
      setError(error.message);
      
    }
    
    
  };
  return (
    <div className="bg-orange-200">
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-7 text-black'>Sign Up</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input type='text' placeholder='username' className='border p-3 rounded-lg' id='username'onChange={handleChange} />
          <input type='tel' placeholder='CNIC' className='border p-3 rounded-lg' id='cnic' />
          <div className="flex gap-4 text-slate-800">
            <label htmlFor="images" className="text-black">Upload a photo of your CNIC</label>
            <input
              className="p-3 border border-gray-800 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
            />
          </div>
          <input type='email' placeholder='email' className='border p-3 rounded-lg' id='email'onChange={handleChange} />
          <input type='password' placeholder='password' className='border p-3 rounded-lg' id='password'onChange={handleChange} />
          <button disabled={loading} className='bg-blue-700 text-black p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            {loading? 'Loading...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-slate-800 text-sm mt-6">We don't share your CNIC with anyone. It is only kept for verification purposes.</p>
        <div className="flex gap-2 mt-5 text-slate-800">
          <p>Have an account?</p>
          <Link to={"/sign-in"}>
            <span className="text-blue-700">Sign in</span>
          </Link>
        </div>
        {error && <p className="text-red-500 mt-5">{error}</p>}
      </div>
    </div>
  )
}
