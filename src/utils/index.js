const fingerJoints = {
  thumb: [0,1,2,3,4],
  indexFinger: [0,5,6,7,8],
  middleFinger: [0,9,10,11,12],
  ringFinger: [0,13,14,15,16],
  pinky: [0,17,18,19,20]
}
const fingers = [ 'thumb', 'indexFinger', 'middleFinger', 'ringFinger', 'pinky'];

//maximum close hand distance between joints start to determine as close hand with 
//formula: abs(x1-x2) + abs(y1-y2)
const maxCloseHandDistance = 10;
export const drawHand = (predictions, ctx) => {
  let closeHand = false;
  let invalidClose = false;
  for(let i = 0; i < predictions.length; i++){

    const landmarks = predictions[i].landmarks;
    

    //draw joints
    for(let j = 0; j < fingers.length; j++){
      const finger = fingers[j];
      for(let k = 0; k < fingerJoints[finger].length - 1; k++){

        const firstJoint = fingerJoints[finger][k];
        const secondJoint = fingerJoints[finger][k+1];
        ctx.beginPath();
        ctx.moveTo( landmarks[firstJoint][0], landmarks[firstJoint][1]);
        ctx.lineTo(landmarks[secondJoint][0], landmarks[secondJoint][1]);

        ctx.strokeStyle='orange';
        ctx.lineWidth=4;
        ctx.stroke();
      }
    }

    //draw circle of each joints
    for(let j = 0; j < landmarks.length; j++){
      //get x and y
      const x = landmarks[j][0];
      const y = landmarks[j][1];
      ctx.beginPath();

      ctx.arc(x, y, 4, 0, 3* Math.PI);
    
      ctx.fillStyle='red';
      ctx.fill();
    }

    //a little simple algorithm to determine close or open hands
    //looks dumb but it somehow do the job lol
    //we start from index 1 to exclude thumb
    for(let j = 1; j < fingers.length; j++){
      
      const maxAllowedDistanceToClose = 80;
      // get fingers name
      const finger = fingers[j];
      //get joints by finger name
      const targetJoint = fingerJoints[finger][1];
      //subtract finger joint number 0 (base) with target joint (1) to get distance
      const distanceXBase = Math.abs(landmarks[targetJoint][0] - landmarks[0][0]);
      const distanceYBase = Math.abs(landmarks[targetJoint][1] - landmarks[0][1]);
      const baseToFirstDist = distanceXBase + distanceYBase;

      //subtract finger joint number 0 (base) with target joint(4) to get instance
      const lastJoint = fingerJoints[finger][4];
      const distanceX = Math.abs(landmarks[lastJoint][0] - landmarks[0][0]);
      const distanceY = Math.abs(landmarks[lastJoint][1] - landmarks[0][1]);
      const baseToLastDist = distanceX + distanceY;

      //get distance base to last and base to first
      const totalDiff = Math.abs(baseToLastDist - baseToFirstDist);
      // console.log(totalDiff);
      if (totalDiff <= maxAllowedDistanceToClose){
        if (!invalidClose) closeHand = true;
      }
      else{
        invalidClose = true;
        closeHand = false;
      }
      
    }
  }
  return closeHand ? "ClOSED" : "OPENED";
}