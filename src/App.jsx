import React, { useRef, useEffect, useState } from 'react'
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import Webcam from 'react-webcam';
import { drawHand } from './utils';
import Game from './utils/game';

import './App.css'
import { webcam } from '@tensorflow/tfjs-data';

function App() {
  const webcamRef = useRef();
  const canvasRef = useRef();
  const gameCanvasRef = useRef();
  const gameRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const initializeHandpose = async () => {

    setIsLoading(true);


    const net = await handpose.load();
    setIsLoading(false);
    setInterval(() => {
      detect(net);
    }, 50)
  }
  const detect = async (net) => {
    if (webcamRef.current &&  webcamRef.current.video.readyState === 4){
      canvasRef.current.width = webcamRef.current.video.videoWidth;
      canvasRef.current.height = webcamRef.current.video.videoHeight;
      const hand = await net.estimateHands(webcamRef.current.video);
      
      //either "closed" or "opened"
      const pose = drawHand(hand, canvasRef.current.getContext('2d'));
      if (pose === "OPENED"){
        gameRef.current.moveBox(true);
      }
      else gameRef.current.moveBox(false);
    }
  }
  useEffect(() => {
    gameCanvasRef.current.width = window.innerWidth / 2;
    gameCanvasRef.current.height = window.innerHeight - 100;

    gameRef.current = new Game(gameCanvasRef.current);
    initializeHandpose();
  }, [])
  return (
    <div className="App">
      <div className="webcam-ai__container">
        {isLoading && <h1 style={{zIndex: 10, color: '#fff'}}>Initializing AI Model...</h1>}
        <Webcam ref={webcamRef} className="webcam"/>
        <canvas className="webcam-ai__canvas" ref={canvasRef}/>
      </div>
      <div className="game">
        <canvas className="game__canvas" ref={gameCanvasRef}/>
      </div>
    </div>
  )
}

export default App
