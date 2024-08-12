import { useEffect, useRef } from "react";
import Matter from "matter-js";
import MatterConfig from "./Elements";

const {
  canvasWidth, 
  canvasHeight,
  ground,
  leftWall,
  rightWall,
  topLine
} = MatterConfig;

export default function App() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(()=>{
    const { Engine, Render, World, Runner } = Matter;
    const engine = Engine.create();

    const render = Render.create({
      element: containerRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options:{
        width: canvasWidth,
        height: canvasHeight,
        background: "#f7f4c8",
        wireframes: false
      }
    });
    
    World.add(engine.world, [ground, leftWall, rightWall, topLine]);

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // 클린업 함수
    return () => {
        Render.stop(render);
        Runner.stop(runner);
    };
  },[]);

  return (
    <div
      ref={containerRef}
      align="center"
    >
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
      />
  </div>
  );
}