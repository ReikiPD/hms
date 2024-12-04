import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import EyeOpen from '../assets/EyeOpen.png';
import EyeClose from '../assets/EyeClose.png';

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { backendUrl, token, setToken } = useContext(AppContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === 'Sign Up') {
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password });

      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      } else {
        toast.error(data.message);
      }
    } else {
      const { data } = await axios.post(backendUrl + '/api/user/login', { email, password });

      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      } else {
        toast.error(data.message);
      }
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment</p>
        {state === 'Sign Up' && (
          <div className='w-full '>
            <p>Full Name</p>
            <input 
              onChange={(e) => setName(e.target.value)} 
              value={name} 
              className='border border-[#DADADA] rounded w-full p-2 mt-1' 
              type="text" 
              required 
            />
          </div>
        )}
        <div className='w-full relative'>
          <p>Email</p>
          <input 
            onChange={(e) => setEmail(e.target.value)} 
            value={email} 
            className='border border-[#DADADA] rounded w-full p-2 mt-1' 
            type="email" 
            required 
          />
        </div>
        <div className='w-full relative'>
          <p>Password</p>
          <input 
            onChange={(e) => setPassword(e.target.value)} 
            value={password} 
            className='border border-[#DADADA] rounded w-full p-2 mt-1' 
            type={showPassword ? 'text' : 'password'} 
            required 
          />
          <img 
            src={showPassword ? EyeOpen : EyeClose} 
            alt="Toggle password visibility" 
            className="absolute top-9 right-4 w-4 h-4 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)} 
          />
        </div>
        {state === 'Sign Up' && (
          <div className='w-full relative'>
            <p>Confirm Password</p>
            <input 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              value={confirmPassword} 
              className='border border-[#DADADA] rounded w-full p-2 mt-1' 
              type={showConfirmPassword ? 'text' : 'password'} 
              required 
            />
            <img 
              src={showConfirmPassword ? EyeOpen : EyeClose} 
              alt="Toggle confirm password visibility" 
              className="absolute top-9 right-4 w-4 h-4 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
            />
          </div>
        )}
        <button className='bg-primary text-white w-full py-2 my-2 rounded-md text-base'>{state === 'Sign Up' ? 'Create account' : 'Login'}</button>
        {state === 'Sign Up'
          ? <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>Login here</span></p>
          : <p>Create an new account? <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>Click here</span></p>
        }
      </div>
    </form>
  );
};

export default Login;
