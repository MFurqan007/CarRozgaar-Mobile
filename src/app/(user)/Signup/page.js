"use client"
import React, {useState} from 'react'
import Image from "next/image";
import Link from 'next/link';
import { useRouter} from 'next/navigation';
import Logo from '../../../assets/Logo.svg'

import { IoMdMail } from "react-icons/io";
import { IoKey } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
import { FaRegIdCard } from "react-icons/fa6";
import { FaCar } from "react-icons/fa6";

import {db} from '../../../lib/firebase-config'
import {auth} from '../../../lib/firebase-config'
import {storage} from '../../../lib/firebase-config'

import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// import { useSelector, useDispatch } from 'react-redux';
// import { userChange } from '../../../redux/Features/CurrentUser/currentUser';


export default function Page() {
    // const dispatch = useDispatch();
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [carReg, setCarReg] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [isClicked, setIsClicked] = useState(false);
    // const [errorMessage, setErrorMessage] = useState('');

    const handleChangeName = (event) => {
        setName(event.target.value);
    };

    const handleChangeCarReg = (event) => {
        setCarReg(event.target.value);
    };

    const handleChangeEmail = (event) => {
      setEmail(event.target.value);
    };
  
    const handleChangePassword = (event) => {
      setPassword(event.target.value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePic(file);
    };

    
    async function registerUser() {
      try {
        // Step 1: Register the user using Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        alert('User Created Successfully')
    
        // Step 2: Upload the profile picture to Firebase Storage
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        const uploadResult = await uploadBytes(storageRef, profilePic);
        const photoURL = await getDownloadURL(uploadResult.ref);
        alert('Profile Pic Uploaded Successfully')
    
        // Step 3: Store additional information along with the profile picture URL in Firestore
        await setDoc(doc(db, "UserDrivers", user.uid), {
          name: name,
          carRegistration: carReg,
          profilePictureUrl: photoURL,
        });
        alert('User Data Stored Successfully')
        
        // 4: Initialise Wallet
        // 5: Initialise Trips
        // 6: Tokens
        
        alert('User Logged in Successfully')


        // dispatch(userChange(user.uid));
        localStorage.setItem('uid', user.uid);
        setName('')
        setEmail('')
        setPassword('')
        setCarReg('')
        setProfilePic('')
        
        console.log("User registered, profile picture uploaded, and additional info stored successfully.");
        router.push('/Home');
      } catch (error) {
        console.error("Error registering user, uploading profile picture, and storing info:", error);
      }
    }
    
    const handleClickSignup = () => {
        setIsClicked(true);
        setTimeout(() => {
            // if (/* login successful */) {
            //   // Redirect user or perform any actions upon successful login
            // } else {
                alert(`Name: ${name} | Email: ${email} | Password: ${password} | Car Registration: ${carReg} | Profile Picture: ${profilePic ? profilePic.name : 'None'}`);


            //   setErrorMessage('Invalid Email or Password');
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
          <p className='text-[32px] font-[700]'>Sign Up</p>
          <p className='text-[21px] font-[400] text-[#8A8A8A]'>Register Your Account!</p>
        </div>

        <div className='w-full h-auto flex flex-col gap-4 px-2 py-4 '>
          
          <div className=''>
            <span className="label-text ml-2">Name *</span>
            <label className="input input-bordered flex items-center gap-2">
              <FaRegUser className="w-4 h-4 opacity-70"/>
              <input type="text" className="grow" placeholder='Name' value={name} onChange={handleChangeName}/>
            </label>
          </div>
        
          <div className=''>
            <span className="label-text ml-2">Email *</span>
            <label className="input input-bordered flex items-center gap-2">
              <IoMdMail className="w-4 h-4 opacity-70"/>
              {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg> */}
              <input type="text" className="grow" placeholder="Email" value={email} onChange={handleChangeEmail} />
            </label>
          </div>

          <div className=''>
            <span className="label-text ml-2">Password *</span>
            <label className="input input-bordered flex items-center gap-2">
              <IoKey className="w-4 h-4 opacity-70"/>
              <input type="password" className="grow" placeholder='Password' value={password} onChange={handleChangePassword}/>
            </label>
          </div>

          <div className=''>
            <span className="label-text ml-2">Car Registration *</span>
            <label className="input input-bordered flex items-center gap-2">
              <FaRegIdCard className="w-4 h-4 opacity-70"/>
              <input type="text" className="grow" placeholder='Car Registration' value={carReg} onChange={handleChangeCarReg}/>
            </label>
          </div>

          <div className=''>
            <span className="label-text ml-2">Car Model *</span>
            <label className="input input-bordered flex items-center gap-2">
              <FaCar className="w-4 h-4 opacity-70"/>
              <input type="text" className="grow" placeholder='Model' disabled/>
            </label>
          </div>

          <div className=''>
            <span className="label-text ml-2">Upload Profile Pic *</span>
            <input type="file" className="file-input w-full max-w-xs" onChange={handleFileChange}/>
          </div>
          <div className='flex gap-2 pl-2'>
                <span className="label-text font-semibold text-[14px]">Already have an Account? </span>
                <Link href={"/Login"}>
                    <span className="label-text font-bold text-[14px] text-[#F54E4E]">Login </span>
                </Link>
          </div>
        </div>

        <div className='w-full h-auto flex justify-center py-2 px-2'>
          <button 
            className="btn btn-wide bg-[#F54E4E] flex gap-4"
            onClick={registerUser}
          >
            {
              isClicked &&
                <span className="loading loading-spinner text-white"></span>
            }
            <span className="text-[16px] font-[500] text-white">Sign Up</span>
          </button>
        </div>
    
    </div>
    </>
  )
}