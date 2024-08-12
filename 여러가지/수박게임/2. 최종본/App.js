/*eslint-disable default-case*/
import { useEffect, useRef } from "react";
import Matter, { Bodies } from "matter-js";
import MatterConfig from "./Elements";//벽 요소 추가
import { FRUITS } from "./fruits";//과일 요소 추가

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
    let currentBody = null;//현재 과일의 세부사항
    let currentFruit = null;//현재 과일
    let disableAction = false;//topLine에 닿는 종류(단순 떨어뜨림, 쌓여서 닿음)
    let interval = null;//과일의 부드러운 움직임을 위한 변수

    const { Engine, Render, World, Runner, Body, Events } = Matter;
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

    function addFruit(){//과일 객체 추가
      const index = Math.floor(Math.random() * 4)//1~4
      const fruit = FRUITS[index];//현재 과일

      const body = Bodies.circle(300, 50, fruit.radius, {
        index: index,
        isSleeping: true,//true일 시 초기에 움직이지 않음.
        render:{//해당 그림 렌더
          sprite: {texture: `${fruit.name}.png`}
        },
        restitution: 0.2,
      })

      currentBody = body;
      currentFruit = fruit;

      World.add(engine.world, body);
    }

    //키보드로 과일 움직이기
    window.onkeydown = (event) => {
      if(disableAction) return//

      switch (event.code) {//키보드에서 눌린 키의 "물리적 위치", "명칭"을 나타냄
        case "ArrowLeft":
          if (interval) return

          //interval을 사용하여 5ms마다 currentBody를 2만큼 왼쪽으로 이동
          interval = setInterval(() => {
            if(currentBody.position.x - currentFruit.radius > 30) {
              //물체가 화면 왼쪽 끝에서 벗어나지 않도록 함
              Body.setPosition(currentBody, {
                x: currentBody.position.x - 2,
                y: currentBody.position.y
              })
            }
          }, 5)
          break

        case "ArrowRight":
          if (interval) return//
          
          //interval을 사용하여 5ms마다 currentBody를 2만큼 오른쪽으로 이동
          interval = setInterval(() => {
            if(currentBody.position.x + currentFruit.radius < 590) {
              //물체가 화면 오른쪽 끝에서 벗어나지 않도록 함
              Body.setPosition(currentBody, {
                x: currentBody.position.x + 2,
                y: currentBody.position.y
              })
            }
          }, 5)
          break

        case "Space"://과일 떨어뜨리기
          currentBody.isSleeping = false
          disableAction = true
          //그냥 물체를 떨어뜨리는 경우에는 topLine에 닿아도 상관없음.

          setTimeout(() => {//~~ms 후 아래 코드 실행
            addFruit()
            disableAction = false
          }, 500)

          break
      }
    }

    //키를 뗀 경우 setInterval을 중지하여 currentBody의 이동 멈춤.
    window.onkeyup = (event) => {
      switch (event.code) {
        case "ArrowLeft":
        case "ArrowRight":
          clearInterval(interval)
          interval = null
      }
    }

    addFruit()//초기 과일 추가
    
    //collisionStart: 두 개의 물체가 처음으로 충돌할 때 발생
    Events.on(engine, "collisionStart", (event) => {
      //event.pairs.forEach: 충돌 이벤트에서 두 물체 간의 충돌 처리를 위해 사용됨.
      event.pairs.forEach((collision) => {
        //같은 종류의 과일이 충돌한 경우
        if(collision.bodyA.index === collision.bodyB.index){
          const index = collision.bodyA.index

          //최종 과일은 처리 필요 X
          if(index === FRUITS.length - 1) return

          //새로운 과일 은 충돌한 과일의 다음 단계 과일
          const newFruit = FRUITS[index + 1]
          
          //과일이 충돌한 경우 월드에서 삭제
          World.remove(engine.world, [collision.bodyA, collision.bodyB])

          const newBody = Bodies.circle(
            //충돌 지점의 x, y 지점에서 새로운 물체 생성
            collision.collision.supports[0].x,
            collision.collision.supports[0].y,
            newFruit.radius,
            {
              index: index + 1,
              render: {
                sprite: {texture: `${newFruit.name}.png`}
              },
            }
          )

          World.add(engine.world, newBody);
        }

        //떨어뜨리는 과일이 아니면서 물체가 topLine과 충돌한 경우 게임 오버
        if(!disableAction && 
          (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine")){
            alert("Game Over");
            Render.stop(render);
            Runner.stop(runner);
            Engine.clear(engine);//게임 종료 후 멈춤 기능
        }
      })
    })

    World.add(engine.world, [ground, leftWall, rightWall, topLine]);

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // 클린업 함수
    return () => {
        console.log("cleanUp");
        Render.stop(render);
        Runner.stop(runner);
        World.clear(engine.world, false);
        Engine.clear(engine);
        render.canvas.remove();
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