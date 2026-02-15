"use client";

import { useState } from "react";
import { forgotPassword } from "@/api/authApi";
import { useRouter } from "next/navigation";
import Notification from "@/shared/Notification";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      setNotification({ message: "Email is required", type: "error" });
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(email);

      setNotification({
        message: "Password reset link sent to your email!",
        type: "success",
      });

      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);

    } catch (error) {
      setNotification({
        message: "Failed to send reset email",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f3ee]">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Forgot Password
        </h1>

        <form onSubmit={handleForgotPassword} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your registered email"
            className="w-full p-3 border rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
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
