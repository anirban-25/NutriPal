"use client";
import Header from "@/components/Header";
import React from "react";
import FillForm from "@/components/FillForm";
import { Heart } from "lucide-react";
import Link from "next/link";

const Page = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 -z-20 bg-black" />
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-red-600/30 via-red-500/20 to-transparent blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-red-900/30 via-red-800/20 to-transparent blur-3xl" />
      <nav className="sticky top-0 z-50 backdrop-blur-lg border-b border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 group">
              <Heart className="h-6 w-6 text-red-500 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-xl">FitMed</span>
            </div>
            <div className="flex gap-8">
              <Link
                href="/ChatWindow"
                className="hover:text-red-500 transition-colors relative group"
              >
                AI Bot
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/food"
                className="hover:text-red-500 transition-colors relative group"
              >
                Food Delivery
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main>
        <FillForm />
      </main>
    </div>
  );
};

export default Page;
