// app/page.js
'use client' // 이 줄을 추가
import Head from 'next/head';
import ImageUploader from '../components/ImageUploader';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined" && !document.getElementById("opencv-js")) {
      const script = document.createElement("script");
      script.id = "opencv-js"; // 스크립트 태그에 고유 ID 부여
      script.src = "https://docs.opencv.org/4.x/opencv.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);
  

  const handleImageUpload = (file) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    img.onload = function () {
      // 원본 이미지 표시용 캔버스
      const canvasOriginal = document.getElementById('canvasOriginal');
      const ctxOriginal = canvasOriginal.getContext('2d');
      canvasOriginal.width = img.width;
      canvasOriginal.height = img.height;
      ctxOriginal.drawImage(img, 0, 0);

      // 처리된 이미지 표시용 캔버스
      const canvasProcessed = document.getElementById('canvasProcessed');
      const ctxProcessed = canvasProcessed.getContext('2d');
      canvasProcessed.width = img.width;
      canvasProcessed.height = img.height;
      ctxProcessed.drawImage(img, 0, 0);

      const src = cv.imread(canvasProcessed);
      let gray = new cv.Mat();
      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();

      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
      cv.Canny(gray, gray, 50, 100, 3, false);
      cv.findContours(gray, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

      for (let i = 0; i < contours.size(); ++i) {
        let color = new cv.Scalar(0, 255, 0); // 녹색으로 설정
        cv.drawContours(src, contours, i, color, 5, cv.LINE_8, hierarchy, 100);
      }

      cv.imshow('canvasProcessed', src);

      src.delete(); gray.delete(); contours.delete(); hierarchy.delete();
    };
  };



  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Upload and Process an Image</h1>
        <ImageUploader onImageUpload={handleImageUpload} />
        <div>
          <h2>Original Image</h2>
          <canvas id="canvasOriginal"></canvas>
        </div>
        <div>
          <h2>Processed Image with Contours</h2>
          <canvas id="canvasProcessed"></canvas>
        </div>
      </main>
    </div>
  );
}