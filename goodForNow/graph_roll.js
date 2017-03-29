importScripts("../calculations.js");

////// What I need from Snap ///////

function createSnap(){
    Snap = {};
    
    const PI = Math.PI;
    function rad(deg) {
        return deg % 360 * PI / 180;
    }
    function deg(rad) {
        return rad * 180 / PI % 360;
    }

    Snap.rad = rad;
    Snap.deg = deg;
    Snap.sin = function (angle) {
        return Math.sin(Snap.rad(angle));
    };
    Snap.tan = function (angle) {
        return Math.tan(Snap.rad(angle));
    };
    Snap.cos = function (angle) {
        return Math.cos(Snap.rad(angle));
    };
    Snap.asin = function (num) {
        return Snap.deg(Math.asin(num));
    };
    Snap.acos = function (num) {
        return Snap.deg(Math.acos(num));
    };
    Snap.atan = function (num) {
        return Snap.deg(Math.atan(num));
    };
    
}

/////////////////////////////////////


//return { data:trace data, layout_roll: roll graph layout }
function plotRoll(){
    
    var rollArray_R = [];
    var camberArray_R = [];
    var rollArray_L = [];
    var camberArray_L = [];
    
    var track = Ss.track;
    var start = Ss.roll_graph_start;
    var end = Ss.roll_graph_end;
    
    for(var i = start; i<=end; i+=.25){
        var A_roll = i;

        var bumpOnRoll = (track/2)*Snap.tan(A_roll);
        var calcs = calcsForBump(bumpOnRoll);
        if(calcs == false){ 
            console.log(A_roll);
            continue; 
        }
        var camber = A_roll + calcs['camber'];

        rollArray_R.push(A_roll);
        camberArray_R.push(camber);
        
        rollArray_L.push(-A_roll);
        camberArray_L.push(camber);
    }

    var trace_camber_R = {
        x: rollArray_R,
        y: camberArray_R,
        type: 'scatter',
        name: 'Right Side'
    };
    
    var trace_camber_L = {
        x: rollArray_L,
        y: camberArray_L,
        type: 'scatter',
        name: 'Left Side'
    };

    var data = [trace_camber_R,trace_camber_L];
    
    var layout_roll = {
        title:'Roll vs Camber',
        xaxis:{ title: 'Roll' },
        yaxis:{ title: 'Camber'},
        margin:{
            l: 45,
            r: 45,
            t: 45,
            b: 45
        }
    };

    var toReturn = {
        data: data,
        layout_roll: layout_roll
    };
    return(toReturn);
    
}


onmessage = function(e){
    createSnap();
    Ss = e.data;
    var plotInfo = plotRoll();
    
    postMessage(plotInfo);
};