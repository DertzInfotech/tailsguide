"use client";

import Link from "next/link";
import Input from "@/shared/Input";
import { useState, useEffect } from "react";
import { forgotPassword } from "@/api/authApi";
import Notification from "@/shared/Notification";
import Image from "next/image";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email?.trim()) {
      setNotification({ message: "Please enter your email", type: "error" });
      return;
    }
    setLoading(true);
    setNotification(null);
    try {
      await forgotPassword(email.trim());
      setSent(true);
      setNotification({
        message: "If an account exists for this email, you will receive instructions to reset your password.",
        type: "success",
      });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again.";
      setNotification({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (notification) {
      const t = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(t);
    }
  }, [notification]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#f7f3ee] overflow-hidden">
      <Image
        src="/images/pet_signinn.png"
        alt="Pets background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <div className="rounded-2xl bg-white/25 backdrop-blur-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold">Forgot password?</h1>
            <p className="text-sm mt-1">
              Enter your email and we’ll send you a link to reset your password.
            </p>
          </div>

          {!sent ? (
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <Input
                id="email"
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold transition"
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-center text-gray-700">
                Check your inbox and follow the link to set a new password.
              </p>
              <Link
                href="/signin"
                className="block w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-center transition"
              >
                Back to sign in
              </Link>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/signin"
              className="text-sm font-semibold text-orange-primary hover:underline"
            >
              ← Back to sign in
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
