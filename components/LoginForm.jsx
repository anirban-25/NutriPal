"use client";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { getAuth, GoogleAuthProvider, sendSignInLinkToEmail, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app } from "@/firebase";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingG, setLoadingG] = useState(false);
  const [error, setError] = useState("");
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const router = useRouter();

  const handleSendSignInLink = async (event) => {
    event.preventDefault(); 
    setLoading(true);
    setError("");
    try {
      await sendSignInLinkToEmail(auth, email, {
        url: `${window.location.origin}/handle-email-link`,
        handleCodeInApp: true,
      });
      setIsEmailSent(true);
      window.localStorage.setItem("emailForSignIn", email);
    } catch (error) {
      setError("Error sending sign-in link. Please try again.");
      console.error("Error sending sign-in link:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoadingG(true);
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        router.push("/fill-up-form");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    } finally {
      setLoadingG(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
    <div className="flex flex-col w-full max-w-lg p-20 ">
    
    
      <div className="flex justify-center mb-4">
        <img
          src="https://cdn-icons-png.flaticon.com/128/3845/3845868.png"
          alt="Logo"
          className="w-6 md:w-9 mx-2 "
        />
        <h1 className="text-5xl font-bold text-white relative whitespace-nowrap ">
          Welcome to FitMed
        </h1>
      </div>

      
      {!isEmailSent ? (
        <form className="mb-5 mt-12" onSubmit={handleSendSignInLink}>
          <label className="block text-white mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@medai.com"
            className="w-full p-2 mb-5 bg-white text-white rounded-md"
            required
          />
          <button
            className="w-full p-2 bg-[#146EF5] text-bold text-white rounded-md"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send login link"}
          </button>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </form>
      ) : (
        <p className="text-center text-white">Please check your email for the sign-up link.</p>
      )}

      <div className="flex items-center mb-10 mt-10">
        <hr className="flex-grow border-gray-600" />
        <span className="text-sm text-white mx-4">OR</span>
        <hr className="flex-grow border-gray-600" />
      </div>

      <button
        className="w-full p-3 bg-white text-black rounded-md flex items-center justify-center"
        onClick={handleGoogleSignIn}
        disabled={loadingG}
      >
        <div className="scale-125 mr-4">
          <FcGoogle />
        </div>
        {loadingG ? "Signing in..." : "Sign in with Google"}
      </button>
      <div className="hidden md:flex absolute left-5 z-10 gradient-01 w-96 h-96" />
      <div className="absolute top-80 right-50 z-10 gradient-02 w-96 h-96" />
    </div>
    </div>
   
  );
};

export default LoginForm;
