/*
import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import Hls from "hls.js";
import "video.js/dist/video-js.css";

function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // Initialize Video.js player
    playerRef.current = videojs(videoRef.current, {
      controls: true,
      autoplay: true,
      muted: true,
      preload: "auto",
    });

    // HLS setup
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play();
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support for Safari
      videoRef.current.src = src;
      videoRef.current.addEventListener("canplay", () => {
        videoRef.current.play();
      });
    } else {
      console.error("Video format not supported");
      // Optionally show a toast or user feedback here
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [src]);

  return (
    <div>
      <div data-vjs-player>
        <video
          ref={videoRef}
          style={{ width: "100%", height: "500px" }}
          className="video-js vjs-control-bar"
        ></video>
      </div>
    </div>
  );
}

export default VideoPlayer;
*/
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Hls from "hls.js";

function VideoPlayer() {
  const { id } = useParams();
  const videoUrl = `http://localhost:8081/api/v1/videos/${id}/master.m3u8`;

  useEffect(() => {
    const video = document.getElementById("videoPlayer");

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
    }
  }, [videoUrl]);

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-4">Playing Video ID: {id}</h2>
      <video id="videoPlayer" controls className="w-full rounded-lg"></video>
    </div>
  );
}

export default VideoPlayer;
