import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [blown, setBlown] = useState(false);

  useEffect(() => {
    if (blown) return;

    let audioContext;
    let analyser;
    let mic;
    let dataArray;

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      audioContext = new AudioContext();
      analyser = audioContext.createAnalyser();
      mic = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 256;
      dataArray = new Uint8Array(analyser.frequencyBinCount);

      mic.connect(analyser);

      const detectBlow = () => {
        analyser.getByteFrequencyData(dataArray);

        // Average volume
        const volume =
          dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

        // 🔥 Adjust threshold if needed
        if (volume > 65) {
          setBlown(true);
          audioContext.close();
          return;
        }

        requestAnimationFrame(detectBlow);
      };

      detectBlow();
    });

    return () => {
      audioContext && audioContext.close();
    };
  }, [blown]);

  return (
    <div className="app">
      <h1 className="title">Happy Birthday Nakshu</h1>

      <div className="cake-wrapper">
        <img
          src={blown ? "/cake-blown.jpg" : "/cake-lit.jpg"}
          alt="Birthday Cake"
          className="cake-img"
        />

        {/* Smoke overlay */}
        {blown && (
          <>
            <div className="smoke f1" />
            <div className="smoke f2" />
            <div className="smoke f3" />
            <div className="smoke f4" />
          </>
        )}
      </div>

      <p className="hint">
        {blown
          ? "Make a wish ✨"
          : "Blow into the mic to blow the candles 💨"}
      </p>
    </div>
  );
}


