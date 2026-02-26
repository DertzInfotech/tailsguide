"use client";

import Image from "next/image";
import Link from "next/link";
import Input from "@/shared/Input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerUser, loginUser, validateToken } from "@/api/authApi";
import Notification from "@/shared/Notification";
import { useAuth } from "@/context/AuthContext";

export default function SignUp() {
  const router = useRouter();
  const { login } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notification, setNotification] = useState(null);

  /* ---------- SIGN UP ---------- */
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!displayName || !email || !mobileNo || !password || !confirmPassword) {
      showNotification("All fields are mandatory", "error");
      return;
    }

    if (password.length < 8) {
      showNotification("Password must be at least 8 characters", "error");
      return;
    }

    if (password !== confirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }

    // Split Display Name → First & Last name
    const [firstName, ...rest] = displayName.trim().split(" ");
    const lastName = rest.join(" ");

    try {
      /* ---------- REGISTER ---------- */
      await registerUser({
        displayName,
        userName: email,          // 🔑 username = email
        mobileNumber: mobileNo,
        email,
        password,
      });

      /* ---------- AUTO LOGIN ---------- */
      const loginResult = await loginUser({
        username: email,
        password,
      });

      localStorage.setItem("tailsToken", loginResult.token);

      login(loginResult.token);

      // Validate token with backend (GET /auth/validate-token)
      try {
        await validateToken();
      } catch (_) {
        // Token saved; validation is best-effort
      }

      /* ---------- SAVE PROFILE DATA ---------- */
      localStorage.setItem("userEmail", email);
      localStorage.setItem("username", email);
      localStorage.setItem("userMobile", mobileNo);
      localStorage.setItem("firstName", firstName);
      localStorage.setItem("lastName", lastName);

      showNotification("Account created & logged in!", "success");

      setTimeout(() => {
        router.push("/profile");   // ✅ go directly to profile
      }, 1200);

    } catch (error) {
      console.error(error);
      showNotification("Signup failed. Please try again.", "error");
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
        src="/images/pet_signup.png"
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
            <h1 className="text-3xl font-extrabold">Create account ✨</h1>
            <p className="text-sm mt-1">
              Join tailsGuide and help pets find their way home.
            </p>
          </div>

          {/* 🔐 IMPORTANT: proper form for browser password save */}
          <form
            className="space-y-4"
            onSubmit={handleSignUp}
            autoComplete="on"
          >
            <Input
              id="displayName"
              name="name"
              label="Display Name"
              type="text"
              autoComplete="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />

            <Input
              id="email"
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              id="mobile"
              name="tel"
              label="Mobile Number"
              type="tel"
              autoComplete="tel"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
            />

            {/* Password fields — browser save depends on these */}
            <Input
              id="password"
              name="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            Already have an account?
            <Link href="/signin" className="ml-1 font-semibold text-orange-primary">
              Sign In
            </Link>
          </div>

          <div className="mt-4 text-center text-xs text-gray-650">
            🔐 Your browser can securely save your login details
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
