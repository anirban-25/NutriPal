import React, { useState, useEffect } from "react";
import { db, auth } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FaSignOutAlt } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { AiOutlineEdit } from "react-icons/ai";
import { useRouter } from "next/navigation";

const UserInfo = ({ user, onLogout }) => {
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const docRef = doc(db, "users", user.uid, "medicalForms", "userdata");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No data found for this user.");
        }
      };

      fetchUserData();
    }
  }, [user]);

  const handleEditClick = () => {
    router.push("/fill-up-form");
  };

  if (!user || !userData) return null;

  const { displayName, email, photoURL } = user;
  const { weight, symptoms, gender } = userData;

  return (
    <div className="flex flex-col items-center  relative ">
      

      <div className="relative flex flex-col items-center justify-center p-10 bg-black/40 backdrop-blur-md rounded-2xl shadow-lg shadow-gray-800 border border-red-500/20">
        <button
          onClick={handleEditClick}
          className="absolute top-5 right-5 p-3 bg-black/50 text-red-500 rounded-full transition-all duration-200 hover:bg-red-500 hover:text-white hover:rotate-360 shadow-sm"
        >
          <AiOutlineEdit size={24} />
        </button>

        <div
          className="w-[140px] h-[140px] rounded-full mb-6 bg-gray-900 border-4 border-red-500 shadow-lg shadow-red-500/20 bg-cover bg-center"
          style={{ backgroundImage: photoURL ? `url(${photoURL})` : "none" }}
        />

        <h3 className="text-[28px] font-semibold text-white mb-2">
          {displayName || "User"}
        </h3>

        <p className="text-base text-gray-400 mb-8">{email}</p>

        <div className="w-full bg-black/50 rounded-xl p-5 mb-6 border border-red-500/10">
          <div className="flex justify-between items-center py-3 border-b border-red-500/10">
            <span className="text-base font-bold text-white">Weight</span>
            <span className="text-base font-medium text-gray-300">
              {weight ? `${weight} kg` : "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-base font-bold text-white">Gender</span>
            <span className="text-base font-medium text-gray-300">
              {gender || "N/A"}
            </span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center px-8 py-3 mt-5 text-base font-semibold text-red-500 bg-black/50 border-2 border-red-500 rounded-xl transition-all duration-200 hover:bg-red-500 hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/20"
        >
          <FaSignOutAlt size={20} className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserInfo;
