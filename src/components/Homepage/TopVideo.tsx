"use client";
import React, { useState, useEffect, useRef } from "react";
import Loader from "../MicroComponents/Loader";
import { MdOutlineArrowDropDownCircle } from "react-icons/md";

type HeroVideoType = {
  original: string;
  [key: string]: any;
};

type TopVideoProps = {
  heroVideo: HeroVideoType;
};

const TopVideo: React.FC<TopVideoProps> = ({ heroVideo }) => {
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsLoading(false);
      video.play().catch((error) => {
        // Autoplay might be blocked, handle gracefully
        console.error("Autoplay blocked:", error);
      });
    };

    const handleWaiting = () => setIsLoading(true);

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("waiting", handleWaiting);

    const triggerPlayOnTouch = () => {
      video.play().catch((error) => {
        // iOS touch autoplay fallback
        console.error("iOS touch autoplay failed:", error);
      });
    };

    window.addEventListener("touchstart", triggerPlayOnTouch, { once: true });

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("waiting", handleWaiting);
      window.removeEventListener("touchstart", triggerPlayOnTouch);
    };
  }, []);

  return (
    <div className="sm:hidden bg-red-500 h-dvh overflow-hidden w-svw md:w-[700px] md:left-1/2 md:translate-x-[-50%] fixed top-10 -z-20">
      <div className="fixed bottom-1/4 right-1/4 z-50 p-4">
        <button className="flex flex-col items-center px-4 py-2 text-white">
          <MdOutlineArrowDropDownCircle size={50} />
          <span className="uppercase text-2xl">Shop Now</span>
        </button>
      </div>
      {isLoading && <Loader />}
      <video
        ref={videoRef}
        src={heroVideo?.original || "/CrPic1.png"}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className={`w-full h-full object-cover ${isLoading ? "hidden" : ""}`}
      />
    </div>
  );
};

export default TopVideo;
