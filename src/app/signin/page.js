"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn, faKey, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Input from "@/components/UI/input";
import { useState, useEffect } from "react";
import { signin } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import Notification from "@/components/UI/notification";
import Image from "next/image";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null);

  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const userData = {
        username: email,
        password: password,
      };
      const result = await signin(userData);
      if(result.response.ok){
        localStorage.setItem("tailsToken", result.result.token);
        showNotification("Logged in successfully!", 'success');
        setTimeout(() => {
          router.push('/');
        }, 2000)
      } else {
        showNotification(result.result.error, 'error')
      }
    } catch (error) {
      console.log("error");
    }
  };

  const showNotification = ( message, type = 'info') => {
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
    <>
      <div className="relative flex-1">
        <div className="absolute inset-0 z-0">
          <Image  
            src='/images/dog_img1.jpg'
            alt="Dog_Image"
            fill
            style={{ objectFit: "cover"}}
        />
        </div>
        <div className="relative z-10 flex items-center justify-end w-full">
          <div className="flex flex-col items-center max-w-400px min-h-1/2 bg-white rounded-md m-5 mr-20 p-20 shadow-xl/20">
            {/* logo */}
            <div className="flex items-center justify-center mb-1">
              <div className="flex items-center gap-1 text-[43px] font-bold text-orange-primary pt-0.5">
                {/* <i className="text-3xl">
                  <FontAwesomeIcon icon={faSignIn} />
                </i> */}
                <span>Welcome Back!</span>
              </div>
            </div>

            <div className="w-80 mb-7">
              <p className="text-center text-gray-500 text-sm">
                Log in to register your pet. Let's continue making every paw matter.
              </p>
            </div>

            {/* Login Main Section */}
            <div className="flex flex-col gap-4">
              

              {/* Login Elements */}
              <form className="flex flex-col gap-2.5" onSubmit={handleSignIn}>
                <Input
                  id="email"
                  label="  Email"
                  icon={<FontAwesomeIcon icon={faEnvelope}/>}
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-w-80"
                />
                <Input
                  id="password"
                  label=" Password"
                  icon={<FontAwesomeIcon icon={faKey}/>}
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-80"
                />
                <button
                  type="submit"
                  className="w-full mt-4 py-2 px-4 bg-orange-primary hover:bg-orange-secondary active:bg-orange-light text-white font-semibold rounded-md shadow-md transition duration-150"
                >
                  Sign In
                </button>
              </form>

              {/* Redirection Text */}
              <div className="flex items-center justify-center mt-6">
                <span className="text-sm text-gray-500">New to tailsGuide?</span>
                <span className="text-sm text-cyan-500">
                  <Link href="/signup">&nbsp;Sign Up</Link>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Render */}
        {notification && (
          <Notification 
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </>
  );
}
