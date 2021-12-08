
const DrawBoundingBox = async (predictionData, imageUrl, canvasRef) => {
     const ctx = canvasRef.current.getContext("2d");
     ctx.lineWidth = 1;
     ctx.strokeStyle = "red"; 
     ctx.font = "30px Arial";
     const imageSrc = new Image();
     imageSrc.src = imageUrl;
     const imgWidth = imageSrc.width;
     const imgHeight = imageSrc.height;
     console.log("WxH", imgWidth, imgHeight);

     var wd = (imgWidth / imgHeight) * 768;
     ctx.clearRect(0, 0, 1024, 768);
     ctx.drawImage(imageSrc, 1, 1, wd, 768);
     ctx.beginPath();
     //ctx.fillText("name" + " - " + 100, x * imgWidth, y * imgHeight - 10);
  await predictionData?.forEach((pt) => {
    ctx.rect(
      imgWidth * pt?.boundingBox.left,
      imgHeight * pt.boundingBox.top,
      imgWidth * pt.boundingBox.width,
      imgHeight * pt.boundingBox.height
    );
    console.log("ptp", pt);
  });
     ctx.stroke();
}

export default DrawBoundingBox;
