var roll_svg = Snap('#roll_svg');


var drawDoubleSuspension = function(){
    
    //ground
    roll_svg.line(-1000,0,1000,0).attr({stroke: "black", strokeWidth: 2});
    //center
    roll_svg.circle(0,0,5).attr({fill:"red"});
    
    var connect = roll_svg.line(Ss.connectLY0, -Ss.connectLZ0, 
                        Ss.Ey0 - (Ss.wheel_width/2), -Ss.connectLZ0
                    ).attr({
                        stroke: "white",
                        strokeWidth: 2
                    });
    
    var wheel = roll_svg.rect(Ss.Ey0 - (Ss.wheel_width/2), Ss.Ez0-Ss.wheel_diameter,
                        Ss.wheel_width, Ss.wheel_diameter
                    ).attr({
                        fill:"none",
                        stroke:"white",
                        strokeWidth:2
                    });
    
    var contact = roll_svg.circle(Ss.Ey0,Ss.Ez0,4).attr({fill:"white"});

    var wheelAssembly = roll_svg.g(wheel,contact,connect);

    
    //lower pivot
    var lowerPivot = roll_svg.circle(Ss.Ay0,-Ss.Az0,5);
    
    //upper pivot
    var upperPivot = roll_svg.circle(Ss.Cy0,-Ss.Cz0,5);

    //lower ball joint
    var lower_bj = roll_svg.circle(Ss.By0,-Ss.Bz0,5);
    
    //upper ball joint
    var upper_bj = roll_svg.circle(Ss.Dy0,-Ss.Dz0,5);

    //lower Arm
    var lowerArm = roll_svg.line(Ss.Ay0,-Ss.Az0, Ss.By0,-Ss.Bz0).attr({
            stroke: "white",
            strokeWidth: 3
        });

    //upper Arm 
    var upperArm = roll_svg.line(Ss.Cy0,-Ss.Cz0, Ss.Dy0,-Ss.Dz0).attr({
            stroke: "white",
            strokeWidth: 3
        });

    //knuckle
    var knuckle = roll_svg.line(Ss.By0,-Ss.Bz0, Ss.Dy0,-Ss.Dz0).attr({
            stroke: "white",
            strokeWidth: 5
        });
    
    var entireRightSide = roll_svg.g(wheelAssembly,lowerPivot,upperPivot,lower_bj,upper_bj,lowerArm,upperArm,knuckle);
    
    var entireLeftSide = entireRightSide.clone();
    
    var myMatrix = new Snap.Matrix();
    myMatrix.scale(-1,1);
    entireLeftSide.transform(myMatrix.toTransformString());
    
    var body = roll_svg.polyline([Ss.Ay0,-Ss.Az0,
                                 Ss.Cy0,-Ss.Cz0,
                                 -Ss.Cy0,-Ss.Cz0,
                                 -Ss.Ay0,-Ss.Az0]).attr({fill:'rgba( 17, 40, 156, 0.126 )'});
    
    
};


var showRoll = function(){
    
    if(typeof Ss.svg.blur_er == 'undefined'){
        Ss.svg.blur_er = roll_svg.rect(-700, -700, 1400, 1000).attr({fill:"rgba( 124, 124, 124, 0.75 )"});
    }
    
    var A_roll = Number(document.getElementById("roll_displacement").value);
    
    if(typeof Ss.track_right == "undefined"){
        var right_bumpForRoll = (Ss.track/2)*Snap.tan(A_roll);
        var left_bumpForRoll  = -1*right_bumpForRoll;
    }else{
        var right_bumpForRoll = (Ss.track_right)*Snap.tan(A_roll);
        var left_bumpForRoll  = (Ss.track_left)*Snap.tan(A_roll);
    }
        
    
    var right_calcs = calcsForBump(right_bumpForRoll);
    var left_calcs = calcsForBump(left_bumpForRoll);
    
    
    if(right_calcs === false || left_calcs === false){ 
        alert("hit max or min");
        return; 
    }
    
    //delete entire Assembly if it exists
    if(typeof Ss.svg.entireAssembly != 'undefined'){
        Ss.svg.entireAssembly.remove();
    }
    
    
    ///////// Right Side //////////////////////
    
    var By = right_calcs.By,
        Bz = right_calcs.Bz,
        Dy = right_calcs.Dy,
        Dz = right_calcs.Dz;
    
    var lowerArm = roll_svg.line(Ss.Ay0,-Ss.Az0, By,-Bz).attr({
            stroke: "black",
            strokeWidth: 4
        });
    var upperArm = roll_svg.line(Ss.Cy0,-Ss.Cz0, Dy,-Dz).attr({
            stroke: "black",
            strokeWidth: 4
        });
    
    var lbj1 = roll_svg.circle(By,-Bz,5).attr({fill:"orange"});
    var ubj1 = roll_svg.circle(Dy,-Dz,5).attr({fill:"red"});
    var knuckle1 = roll_svg.line(By,-Bz,Dy,-Dz).attr({
            stroke: "black",
            strokeWidth: 4
        });
    

    var connect1 = roll_svg.line(Ss.connectLY0,-Ss.connectLZ0, Ss.Ey0 - (Ss.wheel_width/2) ,-Ss.connectLZ0).attr({
            stroke: "black",
            strokeWidth: 2
        });
    var wheel1 = roll_svg.rect(Ss.Ey0 - (Ss.wheel_width/2),Ss.Ez0-Ss.wheel_diameter,
                        Ss.wheel_width,Ss.wheel_diameter).attr({
        fill: "none",
        stroke: "black",
        strokeWidth: 2
        });
    var contact1 = roll_svg.circle(Ss.Ey0,Ss.Ez0,4).attr({fill:"black"});
    
    
    var knuckleAssembly = roll_svg.g(lowerArm,upperArm,lbj1,ubj1,knuckle1);
    var wheelAssembly = roll_svg.g(wheel1,connect1); //contact1 was here

    var myMatrix = new Snap.Matrix();
    myMatrix.rotate(right_calcs.camber,left_calcs.connectLY,-right_calcs.connectLZ);
    myMatrix.translate(right_calcs.connectLY-Ss.connectLY0,-right_calcs.connectLZ+Ss.connectLZ0);
    wheelAssembly.transform(myMatrix.toTransformString());
    contact1.transform(myMatrix.toTransformString());
    
    var rightAssembly = roll_svg.g(knuckleAssembly,wheelAssembly,contact1);
    
    var contactRight = contact1.getBBox();
    
    
    ////////////// Left Side /////////////////////
    
    By = -1*left_calcs.By; //y's are negative on the left
    Bz = left_calcs.Bz;
    Dy = -1*left_calcs.Dy;
    Dz = left_calcs.Dz;
    
    lowerArm = roll_svg.line(-Ss.Ay0,-Ss.Az0, By,-Bz).attr({
            stroke: "black",
            strokeWidth: 4
        });
    upperArm = roll_svg.line(-Ss.Cy0,-Ss.Cz0, Dy,-Dz).attr({
            stroke: "black",
            strokeWidth: 4
        });
    
    lbj1 = roll_svg.circle(By,-Bz,5).attr({fill:"orange"});
    ubj1 = roll_svg.circle(Dy,-Dz,5).attr({fill:"red"});
    knuckle1 = roll_svg.line(By,-Bz,Dy,-Dz).attr({
            stroke: "black",
            strokeWidth: 4
        });
    

    connect1 = roll_svg.line(-Ss.connectLY0,-Ss.connectLZ0, -Ss.Ey0 + (Ss.wheel_width/2) ,-Ss.connectLZ0).attr({
            stroke: "black",
            strokeWidth: 2
        });
    wheel1 = roll_svg.rect(-Ss.Ey0 - (Ss.wheel_width/2),Ss.Ez0-Ss.wheel_diameter,
                        Ss.wheel_width,Ss.wheel_diameter).attr({
        fill: "none",
        stroke: "black",
        strokeWidth: 2
        });
    contact1 = roll_svg.circle(-Ss.Ey0,Ss.Ez0,4).attr({fill:"black"});
    
    
    knuckleAssembly = roll_svg.g(lowerArm,upperArm,lbj1,ubj1,knuckle1);
    wheelAssembly = roll_svg.g(wheel1,connect1); //contact1 was here

    myMatrix = new Snap.Matrix();
    myMatrix.rotate(-left_calcs.camber,-left_calcs.connectLY,-left_calcs.connectLZ);
    myMatrix.translate(-left_calcs.connectLY+Ss.connectLY0,-left_calcs.connectLZ+Ss.connectLZ0);
    wheelAssembly.transform(myMatrix.toTransformString());
    contact1.transform(myMatrix.toTransformString());
    
    var leftAssembly = roll_svg.g(knuckleAssembly,wheelAssembly,contact1);
    
    var body = roll_svg.polyline(-Ss.Ay0,-Ss.Az0,
                                 Ss.Ay0,-Ss.Az0,
                                 Ss.Cy0,-Ss.Cz0,
                                -Ss.Cy0,-Ss.Cz0).attr({fill:'rgba( 26, 33, 75, 0.792 )'});
    
    Ss.svg.entireAssembly = roll_svg.g(leftAssembly,rightAssembly,body);
    
    var rollMatrix = new Snap.Matrix();
    rollMatrix.rotate(A_roll,0,0);
    Ss.svg.entireAssembly.transform(rollMatrix.toTransformString());
    
    
    
    var contactLeft = contact1.getBBox();
    
    Ss.track_right = contactRight['cx'];
    Ss.track_left = contactLeft['cx'];
    
    document.getElementById("roll_camber_R").innerHTML = "Right Camber: " + right_calcs.camber.toFixed(2);
    document.getElementById("roll_camber_L").innerHTML = "Left Camber: " + left_calcs.camber.toFixed(2);
    
    
};


var clearRoll = function(){
    
    //delete wheel/knuckle assembly if it exists
    if(typeof Ss.svg.entireAssembly != 'undefined'){
        Ss.svg.entireAssembly.remove();
        
        Ss.svg.blur_er.remove();
        Ss.svg.blur_er = undefined;
        
        document.getElementById("roll_camber_R").innerHTML = "";
        document.getElementById("roll_camber_L").innerHTML = "";
    }
    
};