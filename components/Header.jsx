"use client";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app } from "@/firebase"
import { CiLogout, CiMedicalCase } from "react-icons/ci";
import { RxAvatar } from "react-icons/rx";

function Header() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const auth = getAuth(app);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="bg-[#c1ead7] z-50 sticky top-0 shadow-md shadow-[#99b8a9] lg:py-2 items-center py-2">
      <div className="hidden md:mx-10 md:flex md:justify-between">
        <Link href="/" className="font-extrabold text-3xl text-gray-100 flex align-center mb-5 mt-2">
          <div className="flex items-center space-x-2">
            <button>
              <img src="https://cdn-icons-png.flaticon.com/128/3845/3845868.png" alt="Logo" className="w-6 md:w-9 mx-2" />
            </button>
          </div>
          <div className="drop-shadow-md text-xl text-[#202123] md:text-3xl cursor-pointer">MedAI</div>
        </Link>
        <div className="sm:px-12 flex items-center justify-between">
          <div className="hidden md:flex">
            <div className="flex space-x-4">
              <div className="hover:bg-green-400 rounded-md text-slate-800 font-semibold hover:text-white text-lg text-bold flex p-3 border border-black bg-green-300 transition hover:shadow-lg">
                <Link href="/">Home</Link>
              </div>
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button onClick={toggleDropdown} className="flex items-center space-x-4 focus:outline-none ml-3">
                    <div className="rounded-full border-2 border-gray-500 p-1">
                      <img src={user.photoURL || <RxAvatar />} alt="User Profile" className="rounded-full w-10 h-10" />
                    </div>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-[#f0f8ff] border border-gray-300 rounded-md shadow-lg py-1 mr-1">
                      <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 w-full text-left flex items-center border-b border-gray-300 rounded-b-md">
                        <CiMedicalCase className="mr-2" /> Dashboard
                      </Link>
                      <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 w-full text-left flex items-center border-t border-gray-300 rounded-t-md">
                        <CiLogout className="mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hover:bg-green-400 rounded-md text-slate-800 font-semibold text-lg text-bold border border-black px-5 bg-green-300 flex p-3 transition duration-200 hover:text-white">
                  <Link href="/login">Login</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden flex justify-center font-bold text-3xl text-slate-800">
        <div>
          <button>
            <img src="https://cdn-icons-png.flaticon.com/128/3845/3845868.png" alt="Logo" className="w-6 md:w-9 mx-2" />
          </button>
        </div>
        MedAI
      </div>
    </div>
  );
}

export default Header;
