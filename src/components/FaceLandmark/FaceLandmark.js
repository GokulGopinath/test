import React,{useRef} from 'react';
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import './FaceLandmark.css';

import {drawMesh} from './utilities';

const FaceLandmark =()=>{
	const webcamRef=useRef(null);
	const canvasRef=useRef(null);

	// run facemesh asynchronously so that it runs in the bg
	const runFacemesh =async () =>{
		// load the facemesh
		const net =await facemesh.load({
			inputResolution:{width:640,height:480}, //input image size grabbed from the webcam
			scale:0.8 //this is a trade off between accuracy and fastness
					  //higher the scale faster the results of the facemesh and low accuracy
					  //and lower scale means higher accuracy and slower speed	
		});
		// running the facemesh model every 100 ms
		setInterval( ()=>{
			detect(net);
		},100)
	}

	// detect fn
	const detect =async (net) =>{
		//these conditions are to check if webcam is up and running as
		//we dont want to run our detection if we are not receiving any input from the webcam
		if(typeof webcamRef.current !=="undefined" &&
			webcamRef.current !==null &&
			webcamRef.current.video.readyState===4){


			//Get video properties
			const video= webcamRef.current.video;
			const videoWidth=webcamRef.current.video.videoWidth;
			const videoHeight=webcamRef.current.video.videoHeight;

			//set video dimensions
			webcamRef.current.video.width=videoWidth;
			webcamRef.current.video.height=videoHeight;

			//set canvas dimensions
			canvasRef.current.width=videoWidth;
			canvasRef.current.height=videoHeight;

			// make detection
			const face= await net.estimateFaces(video);
			console.log(face);

			//use these detections to draw the points on the face
			//get canvas context for drawing
			const ctx=canvasRef.current.getContext("2d");
			drawMesh(face,ctx);
			

		}
	}
	runFacemesh();
	return(
		<div>
		   <header >
		   
		  
		     <Webcam ref={webcamRef} className='wcStyle'/>
			 <canvas ref={canvasRef} className='wcStyle'/>
			
		
			
		{		
		// <Webcam
	
  //         ref={webcamRef}
  //         style={{
  //           position: "absolute",
  //           marginLeft: "auto",
  //           marginRight: "auto",
  //           left: 0,
  //           right: 0,
  //           textAlign: "center",
  //           zindex: 9,
  //           width: 640,
  //           height: 480,
  //         }}
  //       />

  //       <canvas
  //         ref={canvasRef}
  //         style={{
  //           position: "absolute",
  //           marginLeft: "auto",
  //           marginRight: "auto",
  //           left: 0,
  //           right: 0,
  //           textAlign: "center",
  //           zindex: 9,
  //           width: 640,
  //           height: 480,
  //         }}
  //       />
    
    }
			</header>




		</div>



		);
}
export default FaceLandmark;