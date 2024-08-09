import Matter from "matter-js";

 const canvasWidth = 1000;
 const canvasHeight = 800;

 const Bodies = Matter.Bodies;

 const pill = Bodies.rectangle(
    500, 100, 50, 100, {
        chamfer: {
            radius: [25, 25] // 둥근 모서리 설정
        },
        render: {
            fillStyle: "#ffffff" // 물체의 배경 색상 설정
        },
        restitution: 1 // 튕기는 정도 설정
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
  
  const MatterConfig = {
    canvasWidth, 
    canvasHeight, 
    pill, 
    floor, 
    floorLeft,
    floorRight,
    floorTop
  };

  export default MatterConfig;