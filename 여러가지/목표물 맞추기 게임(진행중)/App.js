/*eslint-disable default-case*/
import { useState, useEffect, useRef } from "react";
import Matter, { Mouse } from "matter-js";
import objElement from "./objElement";
import {randomWalls, createBall, createRandomTank, createTarget} from "./createElementFunc";

const {
  rightWall, leftWall, ground, ceiling,
  canvasWidth, canvasHeight
} = objElement;

export default function App() {
  const containerRef = useRef();
  const canvasRef = useRef();
  const [score, setScore] = useState(0);

  useEffect(() => {
    const { Engine, Render, Composite, Body, Runner, Events } = Matter;

    const engine = Engine.create();
    engine.gravity.x = engine.gravity.y = 0;

    const render = Render.create({
      element: containerRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        width: canvasWidth,
        height: canvasHeight,
        background: 'skyblue',
        wireframes: false,
      }
    });
    let walls = randomWalls();//랜덤한 벽 생성
    let tank = createRandomTank(walls);//랜덤 벽과 겹치지 않는 위치에 탱크 생성
    let target = createTarget(walls, tank);//랜덤 벽 및 탱크와 겹치지 않는 위치에 목표물 생성
    let ball = createBall(tank);

    Composite.add(engine.world, walls);

    window.onkeydown = (event) => {//스페이스 키로 공 발사
      if(!ball.isSleeping) return;//움직이는 공은 스페이스 제한 두기
      switch(event.code){
        case "Space":
          ball.isSleeping = false
          ball.render.opacity = 1;//render를 붙여야 한다.

          const speed = 10;
          //마우스 방향에 발사 
          const angle = Math.atan2(mouse.position.y - ball.position.y,
             mouse.position.x - ball.position.x);

          Body.setVelocity(ball, {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
          })
          break;
      }
    }

    Events.on(engine, 'afterUpdate', () => {//거의 정지하면 공 삭제
      const velocityThreshold = 0.2;//임계값 
      const isBallStopped = //속도에 따른 제거 유무
        Math.abs(ball.velocity.x) < velocityThreshold && 
        Math.abs(ball.velocity.y) < velocityThreshold;

      if(!ball.isSleeping && isBallStopped){
        //속도가 크게 줄어든 경우 삭제 및 추가
        Composite.remove(engine.world, ball);
        console.log('Ball has been removed from the world.');
        
        ball = createBall(tank); 
        Composite.add(engine.world, ball);
      }
    });

    //공이 목표물과 충돌 시 공과 목표물을 삭제
    Events.on(engine, 'collisionStart', (event) => {
      const pairs = event.pairs;

      pairs.forEach((pair) => {
        const {bodyA, bodyB} = pair;
        
        if((bodyA === ball && bodyB === target) || (bodyB === ball && bodyA === target)){
          Composite.remove(engine.world, [ball, target]);
          setScore((prevScore) => {
            //useEffect 내에선 초기 상태 값만 반영한다.
            //단 여기의 setScore는 useState 범위에 존재하므로 최신 상태 값을 확인 가능
            console.log('Ball and target has been removed from the world.', prevScore + 1);
            return prevScore + 1;
          })
          
          //랜덤한 위치에 목표물 생성
          ball = createBall(tank); 
          target = createTarget(walls, tank);
          Composite.add(engine.world, [ball, target]);
        }
      })
    })

    const mouse = Mouse.create(render.canvas);

    Composite.add(engine.world, 
      [rightWall, leftWall, ground, ceiling, tank, ball, target]);

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    return () => {
      console.log("cleanUp");
      Render.stop(render);
      Runner.stop(runner);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);//의존성 배열의 값이 변경된다면 그 때 상태가 실제로 업데이트 된다.
  //그런 특성으로 인해 score 값이 실제로 바뀌더라도 useEffect는 이전 상태의 값 만을 참조
  
  return (
    <div 
      ref={containerRef}
      align="center"
    >
      <h1>Score: {score}</h1>
      <canvas ref={canvasRef}/>
      
  </div>
  );
}
/*
const maxCollision = 5;

//충돌 횟수가 일정 이상을 넘으면 공 삭제
Events.on(engine, 'collisionStart', (event) => {
  event.pairs.forEach((pair) => {
    const otherBody = pair.bodyA === ballRef.current ? pair.bodyB : pair.bodyA
    
    if(otherBody !== tank && (pair.bodyA === ballRef.current || pair.bodyB === ballRef.current)){
      collisionCountRef.current += 1;
      
      if(collisionCountRef.current >= maxCollision){
        World.remove(engine.world, ballRef.current);
        console.log('Ball has been removed from the world.');

        let nxtball = createBall(); 
        nxtball.isSleeping = true;
        ballRef.current = nxtball;
        collisionCountRef.current = 0;
        World.add(engine.world, ballRef.current);
      }
    }
  })
})
*/