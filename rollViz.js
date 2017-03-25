//calculate the effect of roll//

// bump on roll = (T/2)tan(A_roll);

//camber = camber@bump - roll


var A_roll = 0; // = camber from roll
var track = 500;

var bumpOnRoll = (track/2)*Snap.tan(A_roll);

