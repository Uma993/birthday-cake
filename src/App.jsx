import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [blown, setBlown] = useState(false);
  const [micAccess, setMicAccess] = useState(false);

  useEffect(() => {
    if (!micAccess || blown) return;

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

        const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

        if (volume > 59) {
          setBlown(true);
          audioContext.close();
          return;
        }

        requestAnimationFrame(detectBlow);
      };

      detectBlow();
    }).catch(() => alert("Mic access denied"));

    return () => {
      audioContext && audioContext.close();
    };
  }, [micAccess, blown]);

  return (
    <div className="app">
      <h1 className="title">Happy Birthday Nakshu</h1>

      {!micAccess && (
        <button className="allow-mic" onClick={() => setMicAccess(true)}>
          Allow Mic Access
        </button>
      )}

      <div className="cake-wrapper">
        <img
          src={blown ? "/cake-blown.jpg" : "/cake-lit.jpg"}
          alt="Birthday Cake"
          className="cake-img"
        />

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
          : "Click 'Allow Mic Access' and blow the candles💨"}
      </p>
    </div>
  );
}


