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



var drawSuspension = function(a = 300, b = 300, c = 0,
                                d = 0, e = 0, 
                                f = 100, g = -100, h = 200){

    s.line(-1000,0,1000,0).attr({stroke: "black", strokeWidth: 2})

    // Variables:
    L_upper = a;
    L_lower = b;
    A_upper0 = c;
    A_lower0 = d;
    kpi = e;
    scrubR = f;
    Zb = g; //negative
    k = h;

    //determined from Variables
    //Be careful with those negative z values!
    yBE = Snap.tan(kpi)*(-Zb)+scrubR;

    By0 = Snap.cos(A_lower0)*L_lower;
    Bz0 = Zb;

    Ey0 = By0 + yBE;
    Ez0 = 0;

    Ay0 = 0;
    Az0 = Snap.sin(A_lower0)*L_lower+Zb;

    Dy0 = By0-k*Snap.sin(kpi);
    Dz0 = Zb-k*Snap.cos(kpi);

    Cy0 = Dy0-Snap.cos(A_upper0)*L_upper;
    Cz0 = Dz0+Snap.sin(A_upper0)*L_upper;

    L_eb = Math.sqrt(Math.pow(yBE,2)+Math.pow(Zb,2));
    A_eb0 = -Snap.atan(Zb/yBE);

    A_bd0 = 90-kpi;

    connectLY0 = (By0+Dy0)/2;
    connectLZ0 = (Bz0+Dz0)/2;

    //////////////////////////////////////

    var topCircle = s.circle(Cy0,Cz0,L_upper).attr({
        fill:"none",stroke:"red",strokeWidth:2});
    var bottomCircle = s.circle(Ay0,Az0,L_lower).attr({
        fill:"none",stroke:"green",strokeWidth:2});

    var lpivot = s.circle(Ay0,Az0,5);
    var upivot = s.circle(Cy0,Cz0,5);

    var lbj = s.circle(By0,Bz0,5);
    var ubj = s.circle(Dy0,Dz0,5);

    var center = s.circle(0,0,5);

    var contact = s.circle(Ey0,Ez0,5).attr({fill:"white"});

    var lArm = s.line(Ay0,Az0, By0,Bz0).attr({
            fill: "#fc0",
            stroke: "#000",
            strokeWidth: 2
        });

    var uArm = s.line(Cy0,Cz0, Dy0,Dz0).attr({
            fill: "#fc0",
            stroke: "#000",
            strokeWidth: 2
        });

    var knuckle = s.line(By0,Bz0, Dy0,Dz0).attr({
            fill: "#fc0",
            stroke: "#000",
            strokeWidth: 2
        });



    var connect = s.line(connectLY0,connectLZ0, Ey0 - 50 ,connectLZ0).attr({
            fill: "#fc0",
            stroke: "#000",
            strokeWidth: 2
        });
    var wheel = s.rect(Ey0 - 50,Ez0-400,100,400);
    var contact = s.circle(Ey0,Ez0,5).attr({fill:"white"});

    var wheelAssembly = s.g(wheel,contact,connect);
    
    ////////////////////////////////////////////////
    draw2dGraph(L_upper,L_lower,A_upper0,A_lower0,kpi,scrubR,Zb,k);
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

    if(typeof wheelAssembly != 'undefined'){
        wheelAssembly.remove();
        knuckleAssembly.remove();
    }
    var displacement = Number(document.getElementById("displacement").value);

    var A_lower = A_lower0 + displacement;
    var By = Snap.cos(A_lower)*L_lower;
    var Bz = Az0 - Snap.sin(A_lower)*L_lower;

    var h = Bz-Cz0;
    var w = By - Cy0;
    var L_bc = Math.sqrt(h*h + w*w);

    var A_bc = Snap.atan(h/w);
    var A_cbd = Snap.acos((L_bc*L_bc + k*k - L_upper*L_upper)/(2*L_bc*k));
    var A_bd = A_bc + A_cbd;

    var camber = A_bd - A_bd0;

    var A_eb = A_eb0 + camber;

    var Ey = By + Snap.cos(A_eb)*L_eb;
    var Ez = -Bz - Snap.sin(A_eb)*L_eb;

    var bump = -Ez;
    var scrub = Ey-Ey0;

    var Dy = By - Snap.cos(A_bd)*k;
    var Dz = Bz - Snap.sin(A_bd)*k;

    var connectLY = (By+Dy)/2;
    var connectLZ = (Bz+Dz)/2;

//////////////////////////////////////

    var lbj1 = s.circle(By,Bz,5).attr({fill:"orange"});
    var ubj1 = s.circle(Dy,Dz,5).attr({fill:"red"});
    var knuckle1 = s.line(By,Bz,Dy,Dz).attr({
            fill: "#fc0",
            stroke: "#000",
            strokeWidth: 2
        });

    knuckleAssembly = s.g(lbj1,ubj1,knuckle1);

    var connect1 = s.line(connectLY0,connectLZ0, Ey0 - 50 ,connectLZ0).attr({
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
    myMatrix.rotate(camber,connectLY,connectLZ);
    myMatrix.translate(connectLY-connectLY0,connectLZ-connectLZ0)
    wheelAssembly.transform(myMatrix.toTransformString());
    
    document.getElementById("bump").innerHTML = "Bump: " + Math.round(bump*-100)/100;
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