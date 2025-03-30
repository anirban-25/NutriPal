import React from "react";
import Link from "next/link";
import { Heart, Bot, UtensilsCrossed, ArrowRight, Shield, Stars, Brain, Apple } from "lucide-react";
import Image from "next/image";

const Page = () => {
  return (
    <div className="min-h-screen bg-[#171717] text-white relative overflow-hidden">
      {/* Animated Gradient Splashes */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-red-600/30 via-red-500/20 to-transparent blur-3xl " />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-red-900/30 via-red-800/20 to-transparent blur-3xl " />

      {/* Navigation with Glass Effect */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg border-b border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 group">
              <Link href="/">
            <Image 
              src="/logo.png"
              width={100}
              height={100}
              alt="Picture of the author"/>
              </Link>
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

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-red-400 text-transparent bg-clip-text pb-2">
            The Future of Health & Wellness
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover our revolutionary services designed to transform your approach to health and nutrition with cutting-edge AI technology.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* NutriPal Bot Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-[#0c0000] rounded-xl blur-md opacity-10 "></div>
            <div className="relative backdrop-blur-sm bg-black/30 p-8 rounded-xl border border-white/10 h-full flex flex-col transition-all  duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <Bot className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold">NutriPal Bot</h3>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300">Advanced RAG-powered medical assistant with up-to-date health information</p>
                </div>
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300">Personalized health recommendations based on your unique profile</p>
                </div>
                <div className="flex items-start gap-3">
                  <Stars className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300">24/7 access to evidence-based medical guidance</p>
                </div>
              </div>
              
              <div className="mt-auto">
                <Link 
                  href="/ChatWindow" 
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-red-600 to-red-800 rounded-lg font-medium hover:shadow-lg hover:shadow-red-900/50 transition-all "
                >
                  <span>Explore NutriPal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Food Delivery Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-[#0c0000] rounded-xl blur-md opacity-10 "></div>
            <div className="relative backdrop-blur-sm bg-black/30 p-8 rounded-xl border border-white/10 h-full flex flex-col transition-all ">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <UtensilsCrossed className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold">Food Delivery</h3>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Apple className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300">Customized healthy meals tailored to your medical conditions and dietary preferences</p>
                </div>
                <div className="flex items-start gap-3">
                  <Bot className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300">AI-powered recipe generator that creates nutritious meals based on your health profile</p>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300">Safe and reliable delivery of fresh ingredients with detailed cooking instructions</p>
                </div>
              </div>
              
              <div className="mt-auto">
                <Link 
                  href="/food" 
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-red-800 to-red-600 rounded-lg font-medium hover:shadow-lg hover:shadow-red-900/50 transition-all"
                >
                  <span>Explore Food Delivery</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="mt-20 text-center">
          <div className="inline-flex p-1 bg-red-900/30 backdrop-blur-sm rounded-full mb-8">
            <span className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-800 rounded-full text-sm font-medium">
              Revolutionizing Health & Wellness
            </span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Begin Your Wellness Journey Today</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Our AI-driven platform combines cutting-edge technology with personalized health science to deliver an experience that's uniquely yours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-3 bg-red-600 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/learn-more"
              className="px-8 py-3 bg-transparent border border-red-600 rounded-lg font-medium hover:bg-red-600/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Footer with Glass Effect */}
      <footer className="mt-20 border-t border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="font-bold">FitMed</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 FitMed. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;