"use client";

import Link from "next/link";
import Input from "@/shared/Input";
import { useState, useEffect } from "react";
import { loginUser } from "@/api/authApi";
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

  /* ---------- SIGN IN ---------- */
  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showNotification("Email and password are required", "error");
      return;
    }

    try {
      const result = await loginUser({
        username: email, // 🔑 username = email
        password,
      });

      localStorage.setItem("tailsToken", result.token);
      localStorage.setItem("userEmail", email);

      login(result.token);

      showNotification("Logged in successfully!", "success");

      setTimeout(() => {
        router.push("/");
      }, 1200);

    } catch (error) {
      showNotification("Invalid credentials", "error");
      console.error(error);
    }
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#f7f3ee] overflow-hidden">

      {/* Background */}
      <Image
        src="/images/pet_signinn.png"
        alt="Pets background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <div className="rounded-2xl bg-white/25 backdrop-blur-2xl shadow-lg p-8">

          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold">Welcome back 👋</h1>
            <p className="text-sm mt-1">
              Sign in to continue helping pets find their way home.
            </p>
          </div>

          {/* 🔐 IMPORTANT: browser password save depends on THIS form */}
          <form
            method="post"               // ✅ REQUIRED
            onSubmit={handleSignIn}
            autoComplete="on"
            className="space-y-4"
          >
            <Input
              id="email"
              name="username"           // ✅ REQUIRED
              label="Email"
              type="email"
              autoComplete="username"  // ✅ REQUIRED
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              id="password"
              name="password"           // ✅ REQUIRED
              label="Password"
              type="password"
              autoComplete="current-password" // ✅ REQUIRED
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-xs text-gray-750 hover:text-orange-primary"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            New to tailsGuide?
            <Link
              href="/signup"
              className="ml-1 font-semibold text-orange-primary"
            >
              Create an account
            </Link>
          </div>

          <div className="mt-4 text-center text-xs text-gray-650">
            🔐 Your browser can securely save your login details
          </div>

        </div>
      </div>

      {/* 🔔 NOTIFICATION */}
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
