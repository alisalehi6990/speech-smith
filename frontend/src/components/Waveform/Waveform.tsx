import { useEffect, useRef } from "react";

export const Waveform = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dataArray: Uint8Array | null = null;
    let source: MediaStreamAudioSourceNode | null = null;

    // Set up audio context and analyser
    const setupAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const audioCtx = new window.AudioContext();
        const analyser = audioCtx.createAnalyser();
        source = audioCtx.createMediaStreamSource(stream);

        source.connect(analyser);
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        const draw = () => {
          requestAnimationFrame(draw);
          analyser.getByteFrequencyData(dataArray!);

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const barWidth = canvas.width / bufferLength;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray![i] * 0.7;
            ctx.fillStyle = "#4F46E5";
            ctx.fillRect(
              x,
              canvas.height - barHeight / 2,
              barWidth,
              barHeight / 2
            );
            x += barWidth + 1;
          }
        };

        animationIdRef.current = requestAnimationFrame(draw);
        analyserRef.current = analyser;
        audioContextRef.current = audioCtx;
      } catch (err) {
        console.error("Microphone access failed", err);
      }
    };

    setupAudio();

    return () => {
      if (animationIdRef.current !== null)
        cancelAnimationFrame(animationIdRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  return (
    <div className="flex justify-center mb-4">
      <canvas ref={canvasRef} width={300} height={50} />
    </div>
  );
};
