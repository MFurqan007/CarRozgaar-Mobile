"use client"
import React, {useEffect, useState} from 'react'
import Image from "next/image";
import Link from 'next/link';
// import { useRouter} from 'next/navigation';
import Logo from '../../../assets/Logo.svg'

import {auth} from '../../../lib/firebase-config'
import { signInWithEmailAndPassword } from 'firebase/auth';

// import { useSelector, useDispatch } from 'react-redux';
// import { userChange } from '../../../redux/Features/CurrentUser/currentUser';

export default function Page() {

  // const router = useRouter();
  // const dispatch = useDispatch();

  // const reduxUid = useSelector(state => state.currentuser.uid);
  // useEffect(()=> {
  //   console.log("Login Redux Uid: ", reduxUid)
  // }, [])

  useEffect(()=> {
      const Luid = localStorage.getItem('uid')
      console.log("Login: ",Luid)
  }, [])

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const login = async () => {
    // const auth = getAuth();
    console.log("Hello")
    setIsClicked(true);
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Sign in successful.
        console.log('Logged in:', userCredential.user);
        alert("User Logged In")
        const uid = userCredential.user.uid;
        console.log('User UID:', uid);
        setIsClicked(false);
        // dispatch(userChange(uid));
        localStorage.setItem('uid', uid);
        router.push('/Home'); // Redirect to a dashboard page or another page as needed
        setEmail('')
        setPassword('')
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // Handle errors here, such as displaying a notification to the user
        console.error('Login error', errorCode, errorMessage);
    });
  };

  const handleClickLogin = (text) => {
    setIsClicked(text);
    setTimeout(() => {
        // if (/* login successful */) {
        //   // Redirect user or perform any actions upon successful login
        // } else {
          alert(`Email : ${email} | Password : ${password}`)
          setErrorMessage('Invalid Email or Password');
        // }
        setIsClicked(false);
      }, 1000);
  };
  
  return (
    <>
      <div className="sm:w-[425px] sm:h-[520px] border-2 border-[red] py-10 w-full h-auto flex flex-col justify-start items-center gap-5">
        <div className=' flex flex-col items-center gap-2'>
          <Image
            src={Logo}
            className="w-[150px] h-[150px]"
          />
          <p className='text-[32px] font-[700]'>{`Login`}</p>
          <p className='text-[21px] font-[400] text-[#8A8A8A]'>{`Welcome Back!`}</p>
        </div>
        
        <div className='w-full h-auto flex flex-col gap-4 px-2 py-4 '>
          
          {errorMessage && <div><span className='text-[red] font-[300] text-[16px]'>{errorMessage}</span></div>}

          <div className=''>
            <span className="label-text ml-2">{`Email *`}</span>
            <label className="input input-bordered flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
              <input type="text" className="grow" placeholder="Email" value={email} onChange={handleChangeEmail} />
            </label>
          </div>

          <div className=''>
            <span className="label-text ml-2">{`Password *`}</span>
            <label className="input input-bordered flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
              <input type="password" className="grow" placeholder='Password' value={password} onChange={handleChangePassword}/>
            </label>
          </div>
          
          <div className=' flex justify-between'>
            <Link href={"/Signup"}>
              <span className="label-text font-semibold text-[14px]">{`Don't Have an Account?`} </span>
            </Link>
            <span className="label-text font-semibold text-[14px]">{`Forgot Passord?`}</span>
          </div>
        </div>
        <div className='w-full h-auto flex justify-center py-2 px-2'>
          <button 
            className="btn btn-wide bg-[#F54E4E] flex gap-4"
            onClick={login}
          >
            {
              isClicked &&
                <span className="loading loading-spinner text-white"></span>
            }
            <span className="text-[16px] font-[500] text-white">{`Login`}</span>
          </button>
        </div>
        {/* <div className='border-2 border-[blue]'>
            Login
        </div> */}
      </div>
    </>
  )
}
