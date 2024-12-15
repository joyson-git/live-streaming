import { useState } from 'react'
import './App.css'
import VideoUpload from './component/videoupload'

function App() {


  return (
    <>
    <div>
    <h1 className="text-center font-extrabold text-gray-800 text-4xl">Live  Stream-video  Application</h1>

 <VideoUpload/>
    </div>

    </>
  )
}

export default App
