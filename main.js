//draws svg and graphs
var draw = function(whichForm){
    
    bump_svg.clear();
    roll_svg.clear();
    
    if(whichForm === "coordinates"){
        fromCoords();
    }else{
        toCoords();
    }
    
    drawSuspension();
    draw2dGraph();
    drawDoubleSuspension();
    drawAntiDive();
    
}


var roll_worker = new Worker("goodForNow/graph_roll.js");

var plotRollWorker = function(){
    
    Ss.roll_graph_start = Number(document.getElementById("roll_graph_start").value);
    Ss.roll_graph_end = Number(document.getElementById("roll_graph_end").value);
    
    var svg_object = Ss.svg;
    delete Ss.svg; //Makes sure I'm not passing any svg links
    roll_worker.postMessage(Ss); 
    Ss.svg = svg_object;
    roll_worker.onmessage = function(e) {
        
        var plotInfo = e.data;
        var data = plotInfo.data;
        var layout_roll = plotInfo.layout_roll;
        Plotly.plot('roll_graph',data,layout_roll);
        
    };
    
};


document.getElementById("mainFormLAs")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        draw("other");
    }
});

document.getElementById("mainFormBoth")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        draw("other");
    }
});

document.getElementById("mainFormCoords")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        draw("coordinates");
    }
});

document.getElementById("displacement")
    .addEventListener("change", function(event) {
        showDisplacement();
});


document.getElementById("roll_displacement")
    .addEventListener("change", function(event) {
        showRoll();
});
document.getElementById("roll_displacement")
    .addEventListener("keydown", function(event) {
    // Create a new 'change' event
    var change = new Event('change');
    var val = Number(this.value);
    
    if(event.keyCode === 37 && val > -25){ this.value = val - .5; }
    else if(event.keyCode === 39 && val < 25){ this.value = val + .5; }
    this.dispatchEvent(change);
    
});


document.getElementById("antiDiveForm")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        drawAntiDive();
    }
});



draw("others");