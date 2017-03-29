var bump_svg = Snap("#bump_svg");


var drawSuspension = function(){
    
    //Uses Ss Object (suspension object)

    //////////////////////////////////////
    
    ////////// Testing Grounds ///////////////////////
    
    
    //////////////////////////////////////////////////
    
    
    //ground
    bump_svg.line(-1000,0,1000,0).attr({stroke: "black", strokeWidth: 2})
    
    var connect = bump_svg.line(Ss.connectLY0,
                        -Ss.connectLZ0, 
                        Ss.Ey0 - (Ss.wheel_width/2),
                        -Ss.connectLZ0
                        ).attr({
        fill: "#fc0",
        stroke: "#000",
        strokeWidth: 2
    });
    
    var wheel = bump_svg.rect(Ss.Ey0 - (Ss.wheel_width/2), 
                        Ss.Ez0-Ss.wheel_diameter,
                        Ss.wheel_width,
                        Ss.wheel_diameter
                      ).attr({
                                                        fill:"none",
                                                        stroke:"black",
                                                        strokeWidth:3});
    
    var contact = bump_svg.circle(Ss.Ey0,Ss.Ez0,5).attr({fill:"white"});

    var wheelAssembly = bump_svg.g(wheel,contact,connect);

    
    //lower pivot
    bump_svg.circle(Ss.Ay0,-Ss.Az0,5);
    
    //upper pivot
    bump_svg.circle(Ss.Cy0,-Ss.Cz0,5);

    //lower ball joint
    bump_svg.circle(Ss.By0,-Ss.Bz0,5);
    
    //upper ball joint
    bump_svg.circle(Ss.Dy0,-Ss.Dz0,5);

    //lower Arm
    bump_svg.line(Ss.Ay0,-Ss.Az0, Ss.By0,-Ss.Bz0).attr({
            fill: "#fc0",
            stroke: "#000",
            strokeWidth: 2
        });

    //upper Arm 
    bump_svg.line(Ss.Cy0,-Ss.Cz0, Ss.Dy0,-Ss.Dz0).attr({
            fill: "#fc0",
            stroke: "#000",
            strokeWidth: 2
        });

    //knuckle
    bump_svg.line(Ss.By0,-Ss.Bz0, Ss.Dy0,-Ss.Dz0).attr({
            fill: "#fc0",
            stroke: "black",
            strokeWidth: 5
        });
    
    //body
    bump_svg.polyline([Ss.Ay0,-Ss.Az0,
                      Ss.Cy0,-Ss.Cz0,
                      0,-Ss.Cz0,
                      0,-Ss.Az0]).attr({fill:'#13455d'});
    
    
};

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////


var showDisplacement = function(){
    
    var displacement = Number(document.getElementById("displacement").value);
    
    var calcs = displacement_calc(displacement);
    
    if(calcs === false){ return; }

//////////////////////////////////////
    
    //delete wheel/knuckle assembly if it exists
    if(typeof Ss.svg.entireRHAssembly != 'undefined'){
        Ss.svg.entireRHAssembly.remove();
    }
    
    var By = calcs.By,
        Bz = calcs.Bz,
        Dy = calcs.Dy,
        Dz = calcs.Dz;
    
    var lowerArm = bump_svg.line(Ss.Ay0,-Ss.Az0, By,-Bz).attr({
            stroke: "white",
            strokeWidth: 4
        });
    var upperArm = bump_svg.line(Ss.Cy0,-Ss.Cz0, Dy,-Dz).attr({
            stroke: "white",
            strokeWidth: 4
        });
    
    var lbj1 = bump_svg.circle(By,-Bz,5).attr({fill:"orange"});
    var ubj1 = bump_svg.circle(Dy,-Dz,5).attr({fill:"red"});
    var knuckle1 = bump_svg.line(By,-Bz,Dy,-Dz).attr({
            fill: "#fc0",
            stroke: "white",
            strokeWidth: 4
        });

    var connect1 = bump_svg.line(Ss.connectLY0,-Ss.connectLZ0, Ss.Ey0 - (Ss.wheel_width/2) ,-Ss.connectLZ0).attr({
            stroke: "white",
            strokeWidth: 3
        });
    var wheel1 = bump_svg.rect(Ss.Ey0 - (Ss.wheel_width/2),Ss.Ez0-Ss.wheel_diameter,
                        Ss.wheel_width,Ss.wheel_diameter).attr({
        fill: "none",
        stroke: "white",
        strokeWidth: 3
        });
    var contact1 = bump_svg.circle(Ss.Ey0,Ss.Ez0,5).attr({fill:"white"});
    
    
    var knuckleAssembly = bump_svg.g(lowerArm,upperArm,lbj1,ubj1,knuckle1);
    var wheelAssembly = bump_svg.g(wheel1,contact1,connect1);
    Ss.svg.entireRHAssembly = bump_svg.g(knuckleAssembly,wheelAssembly);

    var myMatrix = new Snap.Matrix();
    myMatrix.rotate(calcs.camber,calcs.connectLY,-calcs.connectLZ);
    myMatrix.translate(calcs.connectLY-Ss.connectLY0,-calcs.connectLZ+Ss.connectLZ0)
    wheelAssembly.transform(myMatrix.toTransformString());
    
    document.getElementById("bump").innerHTML = "Bump: " + Math.round(calcs.bump*100)/100;
    document.getElementById("camber").innerHTML = "Camber: " + Math.round(calcs.camber*100)/100;
    document.getElementById("scrub").innerHTML = "Scrub: " + Math.round(calcs.scrub*100)/100;
};

var clearDisplacement = function(){
    //delete wheel/knuckle assembly if it exists
    if(typeof Ss.svg.entireRHAssembly != 'undefined'){
        Ss.svg.entireRHAssembly.remove();
    }
    
    document.getElementById("bump").innerHTML = "";
    document.getElementById("camber").innerHTML = "";
    document.getElementById("scrub").innerHTML = "";
};


//////////////////////////////////////


var animateSuspension = function(){
    
    clearInterval(Ss.interval_id);

    var displacementHandle = document.getElementById("displacement");
    displacementHandle.value = 0;



    var i = "up";
    var z = 0;

    function run(){
        if(i=="up"){
           z += .5;
        }else{
            z -= .5;
        }

        if(z >= 35){
            i="down";
        }
        if(z <= -35){
            i="up";
        }

        displacementHandle.value = z;
        showDisplacement();
    }

    Ss.interval_id = setInterval(run,100);



};

var end_animateSuspension = function(){
    clearInterval(Ss.interval_id);
    clearDisplacement();
};


///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

var hideMainForm = function(t,initial,idToClose,start_value,switch_value){

    if(initial === "hidden"){
        
        //initially hidden
        if(t.value===start_value){
            document.getElementById(idToClose).setAttribute('style','');
            t.value = switch_value;
        }else{    
            document.getElementById(idToClose).setAttribute('style','display:none;');
            t.value = start_value;
        }
        
    }else{
        
        //initially shown
        if(t.value===start_value){
            document.getElementById(idToClose).setAttribute('style','display:none;');
            t.value = switch_value;
        }else{    
            document.getElementById(idToClose).setAttribute('style','');
            t.value = start_value;
        }
    }

    
};
    