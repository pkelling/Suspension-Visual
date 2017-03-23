var s = Snap("#svg");

//////////////////////////////////

document.getElementById("main")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        draw();
    }
});

document.getElementById("displacement")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        showDisplacement();
    }
    if (event.keyCode == 38 || event.keyCode == 40){
        showDisplacement();
    }
});



var drawSuspension = function(L_upper = 300,
                                L_lower = 300, 
                                A_upper0 = 0,
                                A_lower0 = 0, 
                                kpi = 0, 
                                scrubR = 100, 
                                Zb = 100, 
                                knuckle = 200){

    
    //ground
    s.line(-1000,0,1000,0).attr({stroke: "black", strokeWidth: 2})

    //determined from Variables
    //Be careful with those negative z values!
    var yBE = Snap.tan(kpi)*(Zb)+scrubR;

    var By0 = Snap.cos(A_lower0)*L_lower;
    var Bz0 = Zb;

    Ey0 = By0 + yBE;
    Ez0 = 0;

    Ay0 = 0;
    Az0 = Zb-Snap.sin(A_lower0)*L_lower;

    var Dy0 = By0-knuckle*Snap.sin(kpi);
    var Dz0 = Zb+knuckle*Snap.cos(kpi);

    Cy0 = Dy0-Snap.cos(A_upper0)*L_upper;
    Cz0 = Dz0-Snap.sin(A_upper0)*L_upper;

    L_eb = Math.sqrt(Math.pow(yBE,2)+Math.pow(Zb,2));
    A_eb0 = Snap.atan(Zb/yBE);

    A_bd0 = 90-kpi;

    connectLY0 = (By0+Dy0)/2;
    connectLZ0 = (Bz0+Dz0)/2;

    //////////////////////////////////////
    
    var connect = s.line(connectLY0,-connectLZ0, Ey0 - 50 ,-connectLZ0).attr({
        fill: "#fc0",
        stroke: "#000",
        strokeWidth: 2
    });
    var wheel = s.rect(Ey0 - 50,Ez0-400,100,400).attr({fill:"none",
                                                        stroke:"black",
                                                        strokeWidth:3});
    var contact = s.circle(Ey0,Ez0,5).attr({fill:"white"});

    var wheelAssembly = s.g(wheel,contact,connect);

    //topCircle
    /*s.circle(Cy0,Cz0,L_upper).attr({
        fill:"none",
        stroke:"red",
        strokeWidth:2
    });
    */
    
    //bottomCircle
    /*
    s.circle(Ay0,Az0,L_lower).attr({
        fill:"none",
        stroke:"green",
        strokeWidth:2
    });
    */
    
    //lower pivot
    s.circle(Ay0,-Az0,5);
    
    //upper pivot
    s.circle(Cy0,-Cz0,5);

    //lower ball joint
    s.circle(By0,-Bz0,5);
    
    //upper ball joint
    s.circle(Dy0,-Dz0,5);

    //lower Arm
    s.line(Ay0,-Az0, By0,-Bz0).attr({
            fill: "#fc0",
            stroke: "#000",
            strokeWidth: 2
        });

    //upper Arm 
    s.line(Cy0,-Cz0, Dy0,-Dz0).attr({
            fill: "#fc0",
            stroke: "#000",
            strokeWidth: 2
        });

    //knuckle
    s.line(By0,-Bz0, Dy0,-Dz0).attr({
            fill: "#fc0",
            stroke: "black",
            strokeWidth: 5
        });

    
    ////////////////////////////////////////////////
    draw2dGraph(L_upper,L_lower,A_upper0,A_lower0,kpi,scrubR,Zb,knuckle);
    //////////////////////////////////////////////////
    
    
}

drawSuspension();

var draw = function(){

    s.clear();

    var a = Number(document.getElementById("a").value);
    var b = Number(document.getElementById("b").value);
    var c = Number(document.getElementById("c").value);
    var d = Number(document.getElementById("d").value);
    var e = Number(document.getElementById("e").value);
    var f = Number(document.getElementById("f").value);
    var g = Number(document.getElementById("g").value);
    var h = Number(document.getElementById("h").value);

    drawSuspension(a,b,c,d,e,f,g,h);
}


//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

var showDisplacement = function(){
    
    var displacement = Number(document.getElementById("displacement").value);
    
    //main Variables
    var L_upper = Number(document.getElementById("a").value);
    var L_lower = Number(document.getElementById("b").value);
    var A_upper0 = Number(document.getElementById("c").value);
    var A_lower0 = Number(document.getElementById("d").value);
    var kpi = Number(document.getElementById("e").value);
    var scrubR = Number(document.getElementById("f").value);
    var Zb = Number(document.getElementById("g").value);
    var knuckle = Number(document.getElementById("h").value);

    //delete wheel/knuckle assembly if it exists
    if(typeof wheelAssembly != 'undefined'){
        wheelAssembly.remove();
        knuckleAssembly.remove();
    }
    

    var A_lower = A_lower0 + displacement;
    var By = Snap.cos(A_lower)*L_lower;
    var Bz = Az0 + Snap.sin(A_lower)*L_lower;

    var h = Cz0 - Bz;
    var w = By - Cy0;
    var L_bc = Math.sqrt(h*h + w*w);

    var A_bc = Snap.atan(h/w);
    var A_cbd = Snap.acos((L_bc*L_bc + knuckle*knuckle - L_upper*L_upper)/(2*L_bc*knuckle));
    var A_bd = A_bc + A_cbd;

    var camber = A_bd - A_bd0;

    var A_eb = A_eb0 + camber;

    var Ey = By + Snap.cos(A_eb)*L_eb;
    var Ez = Bz - Snap.sin(A_eb)*L_eb;

    var bump = Ez;
    var scrub = Ey-Ey0;

    var Dy = By + Snap.cos(A_bd)*knuckle;
    var Dz = Bz + Snap.sin(A_bd)*knuckle;

    var connectLY = (By+Dy)/2;
    var connectLZ = (Bz+Dz)/2;

//////////////////////////////////////
    
    var lowerArm = s.line(Ay0,-Az0, By,-Bz).attr({
            stroke: "white",
            strokeWidth: 2
        });
    var upperArm = s.line(Cy0,-Cz0, Dy,-Dz).attr({
            stroke: "white",
            strokeWidth: 2
        });
    
    var lbj1 = s.circle(By,-Bz,5).attr({fill:"orange"});
    var ubj1 = s.circle(Dy,-Dz,5).attr({fill:"red"});
    var knuckle1 = s.line(By,-Bz,Dy,-Dz).attr({
            fill: "#fc0",
            stroke: "#000",
            strokeWidth: 2
        });

    knuckleAssembly = s.g(lowerArm,upperArm,lbj1,ubj1,knuckle1);

    var connect1 = s.line(connectLY0,-connectLZ0, Ey0 - 50 ,-connectLZ0).attr({
            stroke: "white",
            strokeWidth: 2
        });
    var wheel1 = s.rect(Ey0 - 50,Ez0-400,100,400).attr({
        fill: "none",
        stroke: "white",
        strokeWidth: 2
        });
    var contact1 = s.circle(Ey0,Ez0,5).attr({fill:"white"});

    wheelAssembly = s.g(wheel1,contact1,connect1);

    var myMatrix = new Snap.Matrix();
    myMatrix.rotate(camber,connectLY,-connectLZ);
    myMatrix.translate(connectLY-connectLY0,-connectLZ+connectLZ0)
    wheelAssembly.transform(myMatrix.toTransformString());
    
    document.getElementById("bump").innerHTML = "Bump: " + Math.round(bump*100)/100;
    document.getElementById("camber").innerHTML = "Camber: " + Math.round(camber*100)/100;
}


var clearDisplacement = function(){
    s.clear();
    draw();
    
    document.getElementById("bump").innerHTML = "";
    document.getElementById("camber").innerHTML = "";
}


//////////////////////////////////////


var animateSuspension = function(){

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

    id = setInterval(run,100);



}

var endAnimateSuspension = function(){
    clearInterval(id);
}