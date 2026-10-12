import React, { useEffect, useRef } from 'react';

interface VisualizerProps {
  playing: boolean;
  analyser: AnalyserNode | null;
  networkQuality?: 'GOOD' | 'MODERATE' | 'POOR' | 'RECOVERING';
}

const WEAVER_COUNT = 12; // Number of virtual "weavers" creating the pattern
const PATTERN_WIDTH = 200; // Width of the pattern canvas
const PATTERN_HEIGHT = 60; // Height of the pattern canvas

const Visualizer: React.FC<VisualizerProps> = ({ playing, analyser, networkQuality }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  
  // Adjust FPS based on network quality to reduce CPU/GPU load during poor signal
  const getFPS = (): number => {
    return networkQuality === 'POOR' ? 12 : 
           networkQuality === 'MODERATE' ? 18 : 24;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !playing || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = PATTERN_WIDTH;
    canvas.height = PATTERN_HEIGHT;
    
    // Audio data array
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    // Pattern state
    const weavers = Array.from({ length: WEAVER_COUNT }, (_, i) => ({
      offset: (i / WEAVER_COUNT) * PATTERN_WIDTH,
      phase: Math.random() * Math.PI * 2,
      height: 0,
      targetHeight: 0,
      colorIndex: i
    }));
    
    let lastTime = 0;
    const fps = getFPS();
    const frameDuration = 1000 / fps;

    const draw = (timestamp: number) => {
      if (!playing) return;
      
      // Limit frame rate based on network quality
      if (timestamp - lastTime < frameDuration) {
        animationFrameRef.current = requestAnimationFrame(draw);
        return;
      }
      
      lastTime = timestamp;
      
      // Get audio frequency data
      analyser.getByteFrequencyData(dataArray);
      
      // Clear canvas with transparent background
      ctx.clearRect(0, 0, PATTERN_WIDTH, PATTERN_HEIGHT);
      
      // Calculate audio energy levels for different frequency bands
      const bandSize = Math.floor(bufferLength / WEAVER_COUNT);
      const energyLevels = [];
      
      for (let i = 0; i < WEAVER_COUNT; i++) {
        let sum = 0;
        const start = i * bandSize;
        const end = Math.min(start + bandSize, bufferLength);
        
        for (let j = start; j < end; j++) {
          sum += dataArray[j];
        }
        
        const average = sum / (end - start);
        // Normalize to 0-1 range and apply some curve for better visual response
        const normalized = Math.pow(average / 255, 0.7);
        energyLevels.push(normalized);
      }
      
      // Update weaver heights based on audio energy
      weavers.forEach((weaver, index) => {
        const energy = energyLevels[index] || 0;
        // Smoothly animate towards target height
        weaver.targetHeight = energy * (PATTERN_HEIGHT * 0.8); // Max 80% of height
        weaver.height += (weaver.targetHeight - weaver.height) * 0.1; // Smooth damping
        weaver.phase += 0.05 + (energy * 0.2); // Phase advance based on energy
      });
      
      // Draw the woven pattern
      drawWovenPattern(ctx, weavers, energyLevels);
      
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    // Start the animation loop
    animationFrameRef.current = requestAnimationFrame(draw);
    
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [playing, analyser, networkQuality]);

  // Fallback animation when not playing or no analyser
  useEffect(() => {
    if (playing || !analyser) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = PATTERN_WIDTH;
    canvas.height = PATTERN_HEIGHT;
    
    // Draw static pattern or fallback visualization
    ctx.fillStyle = 'rgba(26, 35, 126, 0.3)'; // Dark indigo with transparency
    ctx.fillRect(0, 0, PATTERN_WIDTH, PATTERN_HEIGHT);
    
    // Draw some static woven pattern elements
    ctx.strokeStyle = 'rgba(255, 191, 36, 0.2)'; // Amber with transparency
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (i + 1) * (PATTERN_HEIGHT / 11));
      ctx.quadraticCurveTo(
        PATTERN_WIDTH / 4, 
        (i + 0.5) * (PATTERN_HEIGHT / 11),
        PATTERN_WIDTH / 2, 
        (i + 1) * (PATTERN_HEIGHT / 11)
      );
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(PATTERN_WIDTH / 2, (i + 1) * (PATTERN_HEIGHT / 11));
      ctx.quadraticCurveTo(
        PATTERN_WIDTH * 3 / 4, 
        (i + 1.5) * (PATTERN_HEIGHT / 11),
        PATTERN_WIDTH, 
        (i + 1) * (PATTERN_HEIGHT / 11)
      );
      ctx.stroke();
    }
  }, [playing, analyser]);

  const drawWovenPattern = (
    ctx: CanvasRenderingContext2D, 
    weavers: Array<{offset: number; phase: number; height: number; targetHeight: number; colorIndex: number}>,
    energyLevels: number[]
  ) => {
    // Draw horizontal weft threads (left to right)
    for (let layer = 0; layer < 3; layer++) {
      const yOffset = layer * (PATTERN_HEIGHT / 4);
      
      // Create a gradient for the weft thread based on audio energy
      const gradient = ctx.createLinearGradient(0, yOffset, PATTERN_WIDTH, yOffset + 2);
      
      // Use audio energy to determine gradient colors
      const avgEnergy = energyLevels.reduce((sum, e) => sum + e, 0) / energyLevels.length;
      
      if (avgEnergy > 0.7) {
        // High energy - vibrant colors
        gradient.addColorStop(0, `rgba(255, 99, 71, 0.7)`); // Tomato
        gradient.addColorStop(0.5, `rgba(255, 215, 0, 0.7)`); // Gold
        gradient.addColorStop(1, `rgba(50, 205, 50, 0.7)`); // Lime green
      } else if (avgEnergy > 0.4) {
        // Medium energy - warm colors
        gradient.addColorStop(0, `rgba(255, 165, 0, 0.6)`); // Orange
        gradient.addColorStop(0.5, `rgba(255, 191, 36, 0.6)`); // Amber (our primary)
        gradient.addColorStop(1, `rgba(255, 69, 0, 0.6)`); // Orange red
      } else {
        // Low energy - cool colors
        gradient.addColorStop(0, `rgba(70, 130, 180, 0.5)`); // Steel blue
        gradient.addColorStop(0.5, `rgba(100, 149, 237, 0.5)`); // Cornflower blue
        gradient.addColorStop(1, `rgba(135, 206, 250, 0.5)`); // Light sky blue
      }
      
      ctx.fillStyle = gradient;
      
      // Draw the weft thread with a wavy pattern based on weaver phases
      ctx.beginPath();
      ctx.moveTo(0, yOffset);
      
      for (let i = 0; i <= WEAVER_COUNT; i++) {
        const x = (i / WEAVER_COUNT) * PATTERN_WIDTH;
        const weaverIndex = Math.floor((i / WEAVER_COUNT) * WEAVER_COUNT) % WEAVER_COUNT;
        const weaver = weavers[weaverIndex];
        const waveOffset = Math.sin(weaver.phase + i * 0.5) * weaver.height * 0.3;
        ctx.lineTo(x, yOffset + waveOffset);
      }
      
      ctx.lineTo(PATTERN_WIDTH, yOffset + 2);
      ctx.lineTo(0, yOffset + 2);
      ctx.closePath();
      ctx.fill();
    }
    
    // Draw vertical warp threads (top to bottom) - interlaced with weft
    for (let i = 0; i < WEAVER_COUNT; i++) {
      const weaver = weavers[i];
      const x = weaver.offset;
      const threadWidth = 2 + Math.sin(weaver.phase) * 0.5; // Vary thickness slightly
      
      // Create vertical gradient based on weaver's energy
      const vGradient = ctx.createLinearGradient(x, 0, x, PATTERN_HEIGHT);
      
      // Color based on weaver's position in the spectrum (bass to treble)
      const hue = (weaver.colorIndex / WEAVER_COUNT) * 360; // 0-360 degrees
      const energy = energyLevels[weaver.colorIndex] || 0;
      
      // Adjust brightness based on energy
      const lightness = 40 + (energy * 30); // 40-70%
      const saturation = 60 + (energy * 40); // 60-100%
      
      vGradient.addColorStop(0, `hsl(${hue}, ${saturation}%, ${lightness}%)`);
      vGradient.addColorStop(1, `hsl(${hue}, ${saturation}%, ${lightness - 10}%)`);
      
      ctx.fillStyle = vGradient;
      
      // Draw the warp thread with interlacing effect
      ctx.beginPath();
      ctx.rect(x - threadWidth / 2, 0, threadWidth, PATTERN_HEIGHT);
      
      // Create cutouts where weft threads pass over (simple interlacing simulation)
      for (let layer = 0; layer < 3; layer++) {
        const yOffset = layer * (PATTERN_HEIGHT / 4);
        const weaverPhase = weavers[layer % WEAVER_COUNT].phase;
        const waveHeight = Math.abs(Math.sin(weaverPhase)) * 8;
        
        // Cutout for over-under pattern
        ctx.rect(x - threadWidth / 2, yOffset - waveHeight / 2, threadWidth, waveHeight);
      }
      
      ctx.fill('evenodd'); // Use even-odd rule for cutouts
    }
    
    // Add subtle glow effect based on overall energy
    const totalEnergy = energyLevels.reduce((sum, e) => sum + e, 0) / energyLevels.length;
    if (totalEnergy > 0.5) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.shadowColor = 'rgba(255, 191, 36, 0.5)'; // Amber glow
      ctx.shadowBlur = 10;
      ctx.fillStyle = 'rgba(255, 191, 36, 0.2)';
      ctx.fillRect(0, 0, PATTERN_WIDTH, PATTERN_HEIGHT);
      ctx.restore();
    }
  };

  return (
    <div ref={canvasRef} className={"visualizer-weaver" + (playing ? "" : " paused")}>
      <canvas 
        width={PATTERN_WIDTH} 
        height={PATTERN_HEIGHT} 
        aria-label="Audio visualization"
        role="img"
      />
    </div>
  );
};

export default Visualizer;