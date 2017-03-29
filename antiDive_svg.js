var antiDive_svg = Snap("#antiDive_svg");


//point-slope form y = m(x-x1)+y1
function pointSlopeForm(x1,y1,slope,x=[]){
        //returns y values
        var y = [];

        for(var i = 0; i<x.length;i++){
            var foo = slope*(x[i]-x1)+y1;
            y.push(foo);
        }
        return(y);
    }


function drawAntiDive(){
    
    antiDive_svg.clear();

    var caster = Number(document.getElementById("caster").value);
    var caster_trail = Number(document.getElementById("caster_trail").value);
    var A_topAD = Number(document.getElementById("A_topAD").value); //AD for antiDive
    var A_bottomAD = Number(document.getElementById("A_bottomAD").value);
    var center_gravityX = Number(document.getElementById("center_gravityX").value);
    var center_gravityZ = Number(document.getElementById("center_gravityZ").value);
    var wheelbase = Number(document.getElementById("wheelbase").value);
    var fr_brakePercent = Number(document.getElementById("fr_brakePercent").value);
    
    var antiDiveLine_endX = (fr_brakePercent/100)*wheelbase;
    
    var topPointZ = (Ss.Ey0-Ss.Cy0)*Snap.tan(Ss.A_upper0)+Ss.Cz0;
    var bottomPointZ = (Ss.Ey0-Ss.Ay0)*Snap.tan(Ss.A_lower0)+Ss.Az0;

    var topPointX = -1*caster_trail + topPointZ*Snap.tan(caster);
    var bottomPointX = -1*caster_trail + bottomPointZ*Snap.tan(caster);
    
    var top_xs = [topPointX-Ss.wheel_diameter/4,topPointX+Ss.wheel_diameter/4,2000];
    var top_zs = pointSlopeForm(topPointX,topPointZ,Snap.tan(A_topAD), top_xs);

    var bottom_xs = [bottomPointX-Ss.wheel_diameter/4,bottomPointX+Ss.wheel_diameter/4,2000];
    var bottom_zs = pointSlopeForm(bottomPointX,bottomPointZ,Snap.tan(A_bottomAD),bottom_xs);

    
    //ground
    antiDive_svg.line(-300,0,2500,0).attr({stroke:'black',strokeWidth: 2});
    
    //center of gravity
    antiDive_svg.circle(center_gravityX,-center_gravityZ,20).attr({
        fill: "#919191"
    });
    
    //foward Percentage
    antiDive_svg.line(0,-center_gravityZ,antiDiveLine_endX,-center_gravityZ).attr({
        strokeWidth: 3,
        stroke: "white"
    });
    antiDive_svg.line(antiDiveLine_endX,-center_gravityZ-30,antiDiveLine_endX,-center_gravityZ+30).attr({
        strokeWidth: 3,
        stroke: "white"
    });
    antiDive_svg.line(0,-center_gravityZ+30,0,-center_gravityZ-30).attr({
        strokeWidth: 3,
        stroke: "white"
    });
    antiDive_svg.text(antiDiveLine_endX/2-175,-center_gravityZ-20,'Front Braking %').attr({fontSize:50,fill:'white'});

    
    //tires
    antiDive_svg.circle(0,-1*Ss.wheel_diameter/2,Ss.wheel_diameter/2).attr({
        fill: 'none',
        stroke: 'black',
        strokeWidth: 3
    });
    antiDive_svg.circle(wheelbase,-1*Ss.wheel_diameter/2,Ss.wheel_diameter/2).attr({
        fill: 'none',
        stroke: 'black',
        strokeWidth: 3
    });

    
    //suspension arms
    antiDive_svg.circle(topPointX,-topPointZ,5);
    antiDive_svg.circle(bottomPointX,-bottomPointZ,5);
    antiDive_svg.line(top_xs[0],-top_zs[0],top_xs[1],-top_zs[1]).attr({
        stroke:"#474747",strokeWidth:3
    });
    antiDive_svg.line(bottom_xs[0],-bottom_zs[0],bottom_xs[1],-bottom_zs[1]).attr({
        stroke:"#474747",strokeWidth:3
    });

    
    //if lines converge to the right, find where and draw lines there//
    if(A_topAD < A_bottomAD){
        var path1 = antiDive_svg.path(`M${top_xs[0]},${-top_zs[0]}L${top_xs[2]}, ${-top_zs[2]}`);
        var path2 = antiDive_svg.path(`M${bottom_xs[0]},${-bottom_zs[0]}L${bottom_xs[2]},${-bottom_zs[2]}`);

        var intersect = Snap.path.intersection(path1,path2);
        
        //intersection drawings
        antiDive_svg.line(top_xs[1],-top_zs[1],intersect[0].x,intersect[0].y).attr({
            strokeDasharray: '20,10',
            strokeWidth: 3,
            stroke: "#474747"
        });
        antiDive_svg.line(bottom_xs[1],-bottom_zs[1],intersect[0].x,intersect[0].y).attr({
            strokeDasharray: '20,10',
            strokeWidth: 3,
            stroke: "#474747"
        });
        antiDive_svg.circle(intersect[0].x,intersect[0].y,10).attr({
            fill: "black"
        });
        
        
        var antiDiveLine_Y = pointSlopeForm(0,0,center_gravityZ/antiDiveLine_endX,[intersect[0].x]);
        
        //antiDive line Drawings
        antiDive_svg.circle(intersect[0].x,-antiDiveLine_Y[0],10).attr({
            fill: "white"
        });
        antiDive_svg.line(0,0,intersect[0].x,-antiDiveLine_Y[0]).attr({
            strokeWidth:3,
            stroke: 'blue',
            strokeDasharray: '20,5'
        });
        
        // initial viewbox: "-250 -700 2000 800"
        var viewbox = document.getElementById('antiDive_svg');
        
        var viewboxArray = viewbox.getAttribute('viewBox').split(" ");
        var xInit = Number(viewboxArray[0]); //negative
        var yInit = Number(viewboxArray[1]); //negative
        var width = Number(viewboxArray[2]);
        var height = Number(viewboxArray[3]);
        
        var xMax = width+xInit;
        var yMax = yInit+height;
        
        if(xMax < intersect[0].x || yInit > antiDiveLine_Y[0]){
            var newWidth = intersect[0].x - xInit + 50; //sets new border to be 50 right of intersect
            var newHeight = newWidth * (height/width); //sets newHeight based on initial ratio to keep svg same size
            var newYInit = -newHeight + yMax; //sets newYInit so yMax stays the same
            
            if(-newYInit < antiDiveLine_Y[0]){
                newYInit = -1*antiDiveLine_Y[0]-100;
                newHeight = -1*newYInit+yMax;
                newWidth = newHeight* (width/height);
            }
            
            var newViewbox = `${xInit} ${newYInit} ${newWidth} ${newHeight}`;
            viewbox.setAttribute('viewBox',newViewbox);
        }


    }

}



