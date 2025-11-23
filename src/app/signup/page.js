'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Input from "@/components/UI/input";
import { useState } from "react";
import { signup } from "@/lib/api-client";

export default function SignUp(){

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [email, setEmail] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    try {
      const userData = {
        displayName: displayName,
        userName: username,
        mobileNumber: mobileNo,
        email: email,
        password: password,
      }
      const result = await signup(userData);
    } catch (error) {
      console.log("error");
    }
  }


  return (
    <>
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col items-center max-w-400px min-h-1/2 border-2 border-amber-200 m-20 p-8">
          
          {/* logo */}
          <div className="flex items-center justify-center mt-6 mb-10">
            <div className="flex items-center gap-1 text-2xl font-bold text-orange-primary pt-0.5">
              <i className="text-3xl"><FontAwesomeIcon icon={faAddressCard} /></i>
              <span>Sign Up</span>
            </div>
          </div>

          {/* Login Main Section */}
          <div className="flex flex-col gap-4">

            {/* Redirection Text */}
            <div className="flex items-center justify-center">
              <span className="text-sm text-gray-500">Already have an accound?</span>
              <span className="text-sm text-cyan-500"><Link href="/signin">&nbsp;Sign In</Link></span>
            </div>

            {/* Login Elements */}
            <form className="flex flex-col gap-2.5  md:grid md:grid-cols-2" onSubmit={handleSignUp}>
              <Input
                id="displayname"
                label="Display Name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <Input
                id="username"
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                id="password"
                label="Password"
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                id="confirmpassword"
                label="Confirm Password"
                type="text"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Input
                id="mobileno"
                label="Mobile Number"
                type="text"
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
              />
              <Input
                id="email"
                label="Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <button
                type="submit"
                className="w-full mt-4 py-2 px-4 bg-orange-primary hover:bg-orange-secondary text-white font-semibold rounded-md shadow-md transition duration-150 col-span-2"
              >Sign In</button>
            </form>

          </div>

        </div>
      </div>
    </>
  )
}