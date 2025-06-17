import React from "react";
import Button from "../components/Button";

function Home() {
  return (
    <div className="w-full lg:min-h-9/10 h-[90vh] relative flex flex-col justify-center items-center p-5 pr-10 overflow-hidden bg-white/50 backdrop-blur-sm">
      {/* 🎨 Animated Blurred Balls */}
      <div className="absolute top-[-50px] left-[-50px] w-72 h-72 bg-purple-700 opacity-40 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-60px] right-[-60px] w-72 h-72 bg-pink-700 opacity-40 rounded-full filter blur-3xl animate-bounce"></div>
      <div className="absolute top-[30%] right-[30%] w-80 h-60 bg-orange-500 opacity-30 rounded-full filter blur-2xl animate-spin-slow"></div>

      {/* 💬 Main Content */}
      <h1 className="text-center lg:text-6xl md:text-5xl text-4xl font-bold mb-4 z-10">
        ORGANIZE PRIORITIZE ACHIEVE
      </h1>
      <h3 className="text-center text-2xl font-semibold mb-5 z-10">
        WELCOME TO TASK MASTER PRO
      </h3>
      <p className="text-center lg:px-20 z-10">
        Your personal productivity assistant designed for developers, teams, and
        individuals who want to take control of their daily workflow. With
        powerful features like user authentication, secure task creation, smart
        filtering by status or priority, and seamless performance — Task Master
        Pro helps you stay organized and get things done faster.
      </p>

      <Button onClick={() => console.log("clicked")} className="z-10 mt-6">
        Create Your Task
      </Button>
    </div>
  );
}

export default Home;
