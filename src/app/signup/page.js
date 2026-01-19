'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";
import Input from "@/shared/Input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/lib/api-client";

export default function SignUp() {

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState(null);
  const router = useRouter();
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };


  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const userData = {
        displayName: '',
        userName: '',
        mobileNumber: mobileNo,
        email: email,
        password: password,
      }
      const result = await signup(userData);
      if (result.response.ok) {
        localStorage.setItem("tailsToken", result.result.token);
        showNotification("Logged in successfully!", 'success');
        router.push('./signin')
      } else {
        showNotification(result.result.validationErrors, 'error')
      }
    } catch (error) {
      console.log("error");
    }
  }

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  }

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);


  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#f7f3ee] overflow-hidden">

      {/* Background image */}
      <Image
        src="/images/pet_signup.png"
        alt="Pets background"
        fill
        className="object-cover"
        priority
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Centered glass card */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <div className="rounded-2xl bg-white/25 backdrop-blur-2xl
                shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                border border-white/10 p-8">

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Create account ✨
            </h1>
            <p className="mt-2 text-sm text-gray-750">
              Join tailsGuide and help pets find their way home.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSignUp}>

            <Input
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              id="mobileno"
              label="Mobile Number"
              type="text"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
            />

            <Input
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              id="confirmpassword"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* Submit */}
            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl
             bg-green-500 hover:bg-green-600
             text-white font-semibold
             active:scale-[0.98]
             transition-all shadow-lg"
            >
              Sign Up
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Google login (UI only for now) */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 rounded-xl border border-gray-300 bg-white
             flex items-center justify-center gap-3
             hover:bg-gray-50 transition shadow-sm"
          >
            <img src="/google.svg" alt="Google" className="w-5 h-5" />
            <span className="text-sm font-medium text-gray-700">
              Continue with Google
            </span>
          </button>


          {/* Redirect */}
          <div className="mt-6 text-center text-sm text-gray-650">
            Already have an account?
            <Link href="/signin" className="ml-1 font-semibold text-orange-primary hover:underline">
              Sign In
            </Link>
          </div>

        </div>
      </div>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );

}