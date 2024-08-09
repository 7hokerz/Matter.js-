import { useEffect, useRef } from "react";
import Matter from "matter-js";

const canvasWidth = 600;
const canvasHeight = 600;

export default function App() {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const { Engine, Render, World, Bodies, Runner, Body } = Matter;

        const engine = Engine.create();
        engine.gravity.y = 0.5;

        const render = Render.create({
            element: containerRef.current,
            engine: engine,
            canvas: canvasRef.current,
            //bounds: 공간 제약 정의
            bounds: {
              min: {x: 0, y: 0},//최소 좌표 설정(왼쪽 상단 경계 정의)
              max: {x: canvasWidth, y: canvasHeight}
              //최대 좌표(오른쪽 하단 경계 정의)
            },
            options: {
              showSeparations: true,
              //객체 간의 충돌 분리선 표시
              width: canvasWidth,
              height: canvasHeight,
              background: "black",//캔버스의 배경 색상 설정
              wireframes: false
            }
        });


        const mouse = Matter.Mouse.create(render.canvas);
        //이 객체는 캔버스와 마우스의 상호작용 입력을 처리함.
        //사용자가 마우스를 조작할 때 캔버스에서 이벤트를 수신할 수 있게 함.
        const mouseConstraint = Matter.MouseConstraint.create(engine, {
          mouse: mouse,
          constraint: {
            stiffness: 0.2,//강도 설정
            render: {
              visible: false//선 표시 유무
            }
          }
        });
        
        const pill = Bodies.rectangle(
            300, 100, 50, 100, {
                chamfer: {
                    radius: [25, 25] // 둥근 모서리 설정
                },
                render: {
                    fillStyle: "#ffffff" // 물체의 배경 색상 설정
                },
                restitution: 0.6 // 튕기는 정도 설정
            }
        );

        const floor = Bodies.rectangle(canvasWidth / 2, canvasHeight, canvasWidth, 100, {
          isStatic: true,
          render: {
            fillStyle: "#121212",
          },
        });
        
        const floorLeft = Bodies.rectangle(0, canvasHeight / 2, 100, canvasHeight, {
          isStatic: true,
          render: {
            fillStyle: "#121212",
          },
        });
        
        const floorRight = Bodies.rectangle(canvasWidth, canvasHeight / 2, 100, canvasHeight, {
          isStatic: true,
          render: {
            fillStyle: "#121212",
          },
        });
        
        const floorTop = Bodies.rectangle(canvasWidth / 2, -10, canvasWidth, 50, {
          isStatic: true,
          render: {
            fillStyle: "#121212",
          },
        });

        World.add(engine.world, [pill, floor, floorLeft, floorRight, floorTop, mouseConstraint]);

        const runner = Runner.create();
        Runner.run(runner, engine);
        Render.run(render);
        Body.rotate(pill, Math.PI / 6);//파이 / 6 == 30도
        //물체의 회전(초기 회전 상태를 말함.)

        return () => {
            Render.stop(render);
            Runner.stop(runner);
            World.clear(engine.world, false);
            //월드에서 모든 객체를 제거. false: 이벤트를 제거하지 않음.
            Engine.clear(engine);
            render.canvas.remove();
        };
    }, []);

    return (
      <section
        ref={containerRef}
        style={{ width: canvasWidth, height: canvasHeight, position: 'relative' }}
      >
        <canvas
          ref={canvasRef}
          id="viewport"
          width={canvasWidth}
          height={canvasHeight}
        />
    </section>
    );
}