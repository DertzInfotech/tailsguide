"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn, faKey, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Input from "@/shared/Input";
import { useState, useEffect } from "react";
import { signin } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import Notification from "@/shared/Notification";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function SignIn() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null);
  const { login } = useAuth();

  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const userData = {
        username: email,
        password: password,
      };
      const result = await signin(userData);
      if (result.response.ok) {
        localStorage.setItem("tailsToken", result.result.token);
        showNotification("Logged in successfully!", 'success');
        const token = result.result.token;
        login(token);
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
        src="/images/pet_signinn.png"
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
              Welcome back 👋
            </h1>
            <p className="mt-2 text-sm text-gray-750">
              Sign in to continue helping pets find their way home.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSignIn}>
            <Input
              id="email"
              label="Email"
              icon={<FontAwesomeIcon icon={faEnvelope} />}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />

            <Input
              id="password"
              label="Password"
              icon={<FontAwesomeIcon icon={faKey} />}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />

            {/* Forgot password */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-xs text-gray-750 hover:text-orange-primary"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl
             bg-green-500 hover:bg-green-600
             text-white font-semibold
             active:scale-[0.98]
             transition-all shadow-lg"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Secondary action */}
          <div className="text-center text-sm text-gray-650">
            New to tailsGuide?
            <Link
              href="/signup"
              className="ml-1 font-semibold text-orange-primary hover:underline"
            >
              Create an account
            </Link>
          </div>

          {/* Trust line */}
          <div className="mt-6 text-center text-xs text-gray-650">
            🔒 Secure login · Your data is always protected
          </div>
        </div>
      </div>

      {/* Notification */}
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
