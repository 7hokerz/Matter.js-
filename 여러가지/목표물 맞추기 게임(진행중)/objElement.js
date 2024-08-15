import Matter from "matter-js";

const canvasWidth = 620;
const canvasHeight = 850;

const Bodies = Matter.Bodies;
//중심 x,y 좌표, 너비, 높이 크기
const rightWall = Bodies.rectangle(15, canvasHeight / 2, 30, canvasHeight, {
    isStatic: true,
    render: {fillStyle: "#e6b143"}
})
const leftWall = Bodies.rectangle(canvasWidth - 15, canvasHeight / 2, 30, canvasHeight, {
    isStatic: true,
    render: {fillStyle: "#e6b143"}
})
const ground = Bodies.rectangle(canvasWidth / 2, canvasHeight - 15, canvasWidth, 30, {
    isStatic: true,
    render: {fillStyle: "#e6b143"}
})
const ceiling = Bodies.rectangle(canvasWidth / 2, 15, canvasWidth, 30, {
    isStatic: true,
    render: {fillStyle: "#e6b143"}
})

const objElement = {
    rightWall, leftWall, ground, ceiling,
    canvasWidth, canvasHeight
};

export default objElement;