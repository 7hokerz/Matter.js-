import Matter from "matter-js";

const canvasWidth = 620;
const canvasHeight = 850;

const Bodies = Matter.Bodies;

const rightWall= Bodies.rectangle(15, 395, 30, 790, {
    isStatic: true,
    render: {fillStyle: "#e6b143"}//# 빼먹지 말자..
})
const leftWall = Bodies.rectangle(605, 395, 30, 790, {
    isStatic: true,
    render: {fillStyle: "#e6b143"}
})
const ground = Bodies.rectangle(310, 820, 620, 60, {
    isStatic: true,
    render: {fillStyle: "#e6b143"}
})
const topLine = Bodies.rectangle(310, 150, 620, 2, {
    isStatic: true,
    render: {fillStyle: "#e6b143"}
})

const MatterConfig = {
    canvasWidth, 
    canvasHeight,
    rightWall, 
    leftWall,
    ground,
    topLine
  };

  export default MatterConfig;