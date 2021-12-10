import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./mainView.css";
import DrawBoundingBox from "../../utils/DrawBoundingBox";

const Upload = () => {
  const CUSTOM_VISION_API = "recprocess.env.REACT_APP_CUSTOM_VISION_API"
  const CUSTOM_VISION_PREDICTION_KEY = "recprocess.env.REACT_APP_CUSTOM_VISION_PREDICTION_KEY"
  const [image, setImage] = useState("");
  const [predictionData, setPredictionData] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  // update image section
  useEffect(() => {
    async function drawImage() {
    if (image) {
        const url = await URL.createObjectURL(image);
        console.log("url", url);
        setImageUrl(url);
      }
    }
    drawImage();
    return () => {
      // URL.revokeObjectURL(image);
    };
  }, [image]);
  
  // draw image in canvas
  useEffect(() => {
    DrawBoundingBox(predictionData, imageUrl, canvasRef);
    console.log("draw");
  }, [predictionData]);

// Image File uploading for prediction
  const uploadFile = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("image", image);
    // const url = await URL.createObjectURL(image);
    // console.log("url", url);
    // setImageUrl(url);
    try {
      console.log("i", image);
      const res = await axios.post(
        CUSTOM_VISION_API,
        image, {
        headers: {
          "content-type": "application/octet-stream",
          "Prediction-Key": CUSTOM_VISION_PREDICTION_KEY,
        },
      });
      console.log('res data',res.data.predictions);
      let predcdata = await res.data.predictions.filter((data) => {
        if (data.probability > 0.60) {
          console.log(data.probability);
          return data;
        }
      })
      console.log('req prddata',predcdata);
      setPredictionData(predcdata);
      setLoading(false);

    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <form onSubmit={uploadFile}>
        <input
          className="select-file"
          type="file"
          name="file upload"
          id="fileupload"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
        />
        <button className="submit-image" type="submit">
          submit
        </button>
      </form>
      <img
        useRef={imgRef}
        className="image-preview"
        src={imageUrl}
        alt=""
        srcset=""
      />
      {loading && <h1>Loading...</h1>}
      <br />
      { 
        <canvas
          ref={canvasRef}
          width={1024}
          height={768}
          style={{
            // position: "absolute",
            // marginLeft: "auto",
            // marginRight: "auto",
            left: 10,
            right: 0,
            textAlign: "center",
            zindex: 8,
            // width: 800,
            // height: 533,
          }}
        />
      }
    </div>
  );
};

export default Upload;
