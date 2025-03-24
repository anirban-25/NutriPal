"use client";
import {
  Dumbbell,
  Brain,
  Bot,
  Pizza,
  Activity,
  Heart,
  Timer,
  Trophy,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

export default function Home() {
  const router = useRouter();

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
              <Heart className="h-6 w-6 text-red-500 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-xl">FitMed</span>
            </div>
            <div className="flex gap-8">
              <Link
                href="/bot"
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

      {/* Hero Section with Animation */}
      <header className="relative py-32 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center space-y-8">
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-red-500 to-red-700 animate-gradient">
              Where Fitness Meets Healthcare
            </h1>
            <p className="text-xl leading-8 text-gray-300 max-w-2xl mx-auto">
              Advanced medical support tailored for fitness enthusiasts,
              athletes, and health-conscious individuals.
            </p>
            <div className="flex items-center justify-center gap-x-6">
              <button
                onClick={() => router.push("/fill-up-form")}
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105"
              >
                Start Your Journey
              </button>
              <Link href="/explore">
                <button className="px-8 py-4 border border-red-600 rounded-lg font-semibold text-red-500 hover:bg-red-600/10 transition-all duration-300 flex items-center gap-2 group">
                  Explore Services
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid with Hover Effects */}
      <section className="relative py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Bot className="h-6 w-6 text-red-500" />}
              title="AI Medical Assistant"
              description="24/7 health guidance powered by advanced AI"
            />
            <FeatureCard
              icon={<Pizza className="h-6 w-6 text-red-500" />}
              title="Nutrition Delivery"
              description="Custom meal plans delivered to your door"
            />
            <FeatureCard
              icon={<Activity className="h-6 w-6 text-red-500" />}
              title="Performance Tracking"
              description="Monitor your fitness and health metrics"
            />
            <FeatureCard
              icon={<Brain className="h-6 w-6 text-red-500" />}
              title="Expert Insights"
              description="Access to sports medicine specialists"
            />
          </div>
        </div>
      </section>

      {/* Stats Section with Animations */}
      <section className="relative py-24 px-6 lg:px-8 bg-black/30">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <StatCard
              icon={<Dumbbell className="h-8 w-8 text-red-500" />}
              value="100,000+"
              label="Active Athletes"
            />
            <StatCard
              icon={<Timer className="h-8 w-8 text-red-500" />}
              value="24/7"
              label="AI Support"
            />
            <StatCard
              icon={<Trophy className="h-8 w-8 text-red-500" />}
              value="95%"
              label="Success Rate"
            />
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-gradient-to-r from-red-900 via-red-800 to-red-700 p-16 relative overflow-hidden group">
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 mx-auto max-w-2xl text-center">
              <h2 className="text-4xl font-bold tracking-tight text-white mb-6">
                Ready to Elevate Your Performance?
              </h2>
              <p className="mx-auto max-w-xl text-lg text-white/90 mb-10">
                Join elite athletes and fitness enthusiasts who trust our
                platform for their health and performance needs.
              </p>
              <button className="px-8 py-4 bg-black text-white rounded-lg font-semibold hover:bg-black/90 transition-all duration-300 transform hover:scale-105">
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group bg-[#141111] border border-red-900/50 hover:border-red-500/50 rounded-xl p-6 transition-all duration-300 hover:transform ">
      <div className="rounded-full bg-red-950 p-3 w-fit group-hover:bg-red-900 transition-colors">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-gray-400">{description}</p>
    </div>
  );
}

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="bg-black/50 border border-red-900/50 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300 hover:transform hover:scale-105">
      <div className="flex items-center gap-4">
        {icon}
        <div>
          <div className="text-3xl font-bold text-white">{value}</div>
          <div className="text-sm text-gray-400">{label}</div>
        </div>
      </div>
    </div>
  );
}
