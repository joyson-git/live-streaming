import React, { useState, useEffect } from "react";
import axios from "axios";
import Hls from "hls.js";
import "tailwindcss/tailwind.css";

function VideoPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const API_BASE_URL = "http://localhost:8081/api/v1/videos";

  // Fetch videos from the backend
  const fetchVideos = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle video upload
  const handleUpload = async (event) => {
    event.preventDefault();

    if (!title.trim() || !description.trim() || !selectedFile) {
      setMessage("Please provide all details and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", selectedFile);

    setUploading(true);
    setMessage("Uploading...");

    try {
      await axios.post(API_BASE_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Upload Successful!");
      fetchVideos();
      setTitle("");
      setDescription("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading video:", error);
      setMessage("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Play selected video with HLS.js
  const playVideo = (url) => {
    const video = document.getElementById("videoPlayer");
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
    }
  };

  // Handle video selection
  const handleViewDetails = (video) => {
    setSelectedVideo(video);
    playVideo(`http://localhost:8081/api/v1/videos/${video.videoId}/master.m3u8`);
  };

  return (
    <div className="flex flex-col items-center bg-black text-white min-h-screen p-6">
      <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h1 className="text-2xl font-bold text-center mb-6">Video Upload</h1>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block mb-2 text-gray-400">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-gray-200"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-400">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-gray-200"
            ></textarea>
          </div>
          <div>
            <label className="block mb-2 text-gray-400">Select File</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="text-gray-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
          {message && <p className="text-center mt-4">{message}</p>}
        </form>
      </div>

      <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Video List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.length > 0 ? (
            videos.map((video) => (
              <div
                key={video.videoId}
                className="bg-gray-700 p-4 rounded flex flex-col items-center"
              >
                <h3 className="font-bold text-sm">{video.title}</h3>
                <p className="text-gray-400 text-xs">{video.description}</p>
                <button
                  onClick={() => handleViewDetails(video)}
                  className="mt-2 py-1 px-4 bg-blue-500 rounded hover:bg-blue-600 text-xs"
                >
                  View
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">No videos available.</p>
          )}
        </div>
      </div>

      {selectedVideo && (
        <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
          <h2 className="text-2xl font-bold mb-4">Playing: {selectedVideo.title}</h2>
          <video
            id="videoPlayer"
            controls
            className="w-full rounded-lg"
          ></video>
          <button
            onClick={() => setSelectedVideo(null)}
            className="mt-4 py-1 px-4 bg-red-500 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default VideoPage;
