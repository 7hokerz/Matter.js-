/*eslint-disable default-case*/
import { Bodies, Bounds } from 'matter-js';
import objElement from "./objElement";

const { canvasWidth, canvasHeight } = objElement;

export function randomWalls(){//벽 생성
  const walls = [];
  const wallThickness = 20;

  for(let i = 0;i<8;i++){
    let wall;
    let attempts = 0;
    let validPosition = false;
    
    //벽이 겹치는 경우를 방지하기 위한 기능
    while(!validPosition && attempts < 10){ 
      attempts++;
      let randomx = Math.random() * canvasWidth / 2 + canvasWidth / 4;
      let randomy = Math.random() * canvasHeight / 2 + canvasHeight / 4;
      let wallLength = canvasHeight / 4 + Math.random() * canvasHeight / 2; 

      switch (i % 4) {
        case 0: {
          wall = Bodies.rectangle(
            randomx,
            wallThickness,
            wallThickness,
            wallLength,
            {
              isStatic : true,
              render: {fillStyle: "gray"}
            }
          );break;
        }
        case 1: {
          wall = Bodies.rectangle(
            wallThickness,
            randomy,
            wallLength,
            wallThickness,
            {
              isStatic : true,
              render: {fillStyle: "gray"}
            }
          );break;
        }
        case 2: {
          wall = Bodies.rectangle(
            randomx,
            canvasHeight,
            wallThickness,
            wallLength,
            {
              isStatic : true,
              render: {fillStyle: "gray"}
            }
          );break;
        }
        case 3: {
          wall = Bodies.rectangle(
            canvasWidth,
            randomy,
            wallLength,
            wallThickness,
            {
              isStatic : true,
              render: {fillStyle: "gray"}
            }
          );
          break;
        }
      }
      // eslint-disable-next-line no-loop-func
      validPosition = !walls.some((existingWall) => {
        return Bounds.overlaps(wall.bounds, existingWall.bounds);
      });// 벽의 경계가 겹치는지 확인
    }

    if(validPosition){
      walls.push(wall);
    } else {
      console.log(`Failed to place wall ${i} after 10 attempts`);
    }
  }
  return walls;
}

export function createRandomTank(walls) { // 탱크 생성
  let tank;
  let attempts = 0;
  let validPosition = false;
  const tankSize = 100; // 탱크 크기

  while (!validPosition && attempts < 10) {
    attempts++;
    let randomx = Math.random() * canvasWidth / 2 + canvasWidth / 4;
    let randomy = Math.random() * canvasHeight / 2 + canvasHeight / 4;

    tank = Bodies.rectangle(randomx, randomy, tankSize, tankSize, {
      isStatic: true,
      isSensor: true,
      render: {
        sprite: {
          texture: "https://img.freepik.com/premium-psd/tank-isolated-transparent-background_879541-347.jpg",
          xScale: 0.2,
          yScale: 0.2
        }
      }
    });

    // eslint-disable-next-line no-loop-func
    validPosition = !walls.some((wall) => {
      return Bounds.overlaps(tank.bounds, wall.bounds);
    });
  }

  if (validPosition) {

  } else {
    console.log("Failed to place tank after 10 attempts");
  }
  return tank;
}

export function createBall(tank){//공 생성(탱크의 위치에 같이)
  const ball = Bodies.circle(tank.position.x, tank.position.y, 20, {
    isSleeping: true,
    restitution: 0.8,
    render: {fillStyle: '#ff0000', opacity: 0}
  });
  return ball;
}

export function createTarget(walls, tank){//공 생성(탱크의 위치에 같이)
  let target;
  let attempts = 0;
  let validPosition = false;
  let otherBodys = [...walls, tank];
  const targetSize = 50; 

  while (!validPosition && attempts < 10) {
    attempts++;
    let randomx = Math.random() * canvasWidth / 2 + canvasWidth / 4;
    let randomy = Math.random() * canvasHeight / 2 + canvasHeight / 4;

    target = Bodies.rectangle(randomx, randomy, targetSize, targetSize, {
      isStatic: true,
      render: {
        render: {fillStyle: '#ff0000'}
      }
    });

    // eslint-disable-next-line no-loop-func
    validPosition = !otherBodys.some((otherBody) => {
      return Bounds.overlaps(target.bounds, otherBody.bounds);
    });
  }

  if (validPosition) {

  } else {
    console.log("Failed to place tank after 10 attempts");
  }

  return target;
}
