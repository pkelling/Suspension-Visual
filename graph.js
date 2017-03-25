function range(start, stop, step=1){
  var a=[start], b=start;
  while(b<stop){b+=step;a.push(b)}
  return a;
}

Math.radians = function(deg){ 
    rad = deg * this.PI/180;
    return rad; 
};
Math.degrees = function(rad){ 
    deg = rad * 180/this.PI;
    return deg; 
};

function isInt(n) {
   return n % 1 === 0;
}

function copyArray(foo){
  var copyOfTheArray = [...foo]
  copyOfTheArray.shift();
  return copyOfTheArray;
}


/////////// Suspension Calculations /////////////////  


function draw2dGraph(L_upper,L_lower,A_upper0,A_lower0,kpi,scrubR,Zb,k){
    
    var bump_array = [];
    var camber_array = [];
    var scrub_array = [];
    
    var L_top_arm = L_upper;
    var L_lower_arm = L_lower;
    var A_upper0 = Math.radians(A_upper0);
    var A_lower0 = Math.radians(A_lower0);
    var kpi = Math.radians(kpi);
    var scrubR = scrubR;
    var Zb = Math.abs(Zb);
    var knuckle = k;


    var yBE = Math.tan(kpi) * Zb + scrubR;
    var lower_bj_Y0 = Math.cos(A_lower0) * L_lower_arm;
    var contact_Y0 =  lower_bj_Y0 + yBE;
    var lower_pivot_Z0 = (-1) * Math.sin(A_lower0) * L_lower_arm + Zb;
    var top_bj_Y0 =  lower_bj_Y0 - knuckle * Math.sin(kpi);
    var top_bj_Z0 = Zb + knuckle * Math.cos(kpi);
    var top_pivot_Y0 = top_bj_Y0 - Math.cos(A_upper0) * L_top_arm;
    var top_pivot_Z0 = top_bj_Z0 - Math.sin(A_upper0) * L_top_arm;
    var L_eb = Math.sqrt(yBE * yBE + Zb * Zb);
    var A_eb0 = Math.atan(Zb / yBE);
    var A_bd0 = Math.PI/2 - kpi;

    
    //-30 to 30 degrees is my standard displacement//
    for(var i=-30; i<=30; i+=.1){

            var degrees = i;
            var displacement = Math.radians(degrees);

            var A_lower = A_lower0 + displacement;
            var lower_bj_Y = Math.cos(A_lower) * L_lower_arm;
            var lower_bj_Z = lower_pivot_Z0 + Math.sin(A_lower) * L_lower_arm;
            var h = top_pivot_Z0 - lower_bj_Z;
            var w = lower_bj_Y - top_pivot_Y0;
            var L_bc = Math.sqrt(h * h + w * w);
            var A_bc = Math.atan(h / w);

            var foo = ((L_bc * L_bc) + (knuckle * knuckle) - (L_top_arm * L_top_arm)) / (2 * L_bc * knuckle);

            if(foo > 1){ continue; }

            var A_cbd = Math.acos(foo);
            var A_bd = A_bc + A_cbd;


            var cam_radian = A_bd - A_bd0;

            var A_eb = A_eb0 + cam_radian;
            var contact_Y = lower_bj_Y + Math.cos(A_eb) * L_eb;
            var Ez = lower_bj_Z - Math.sin(A_eb) * L_eb;

            var bump = Ez;
            var scrub = contact_Y - contact_Y0;
            var camber = Math.degrees(cam_radian);

            bump_array.push(bump);
            camber_array.push(parseFloat(camber.toFixed(5)));
            scrub_array.push(parseFloat(scrub.toFixed(5)));
            
    }
    
    
    ///////////// Build 2D Graph ///////////////////
    var camber_trace = {
                        x:bump_array,
                        y:camber_array,
                        type:'scatter'
                    };
    var data_camber = [camber_trace];
    var layout_camber = {
        title:'Bump vs Camber',
        xaxis:{ title: 'Bump' },
        yaxis:{ title: 'Camber' },
        margin:{
            l: 45,
            r: 45,
            t: 45,
            b: 45
        }
    };
    
    Plotly.plot('camber_graph',data_camber,layout_camber);
    
    
    var scrub_trace = {
                    x:bump_array,
                    y:scrub_array,
                    type: 'scatter'
                };
    var data_scrub = [scrub_trace];
    var layout_scrub = {
        title:'Bump vs Scrub',
        xaxis:{ title: 'Bump' },
        yaxis:{ title: 'Scrub' },
        margin:{
            l: 45,
            r: 45,
            t: 45,
            b: 45
        }
    };
    
    Plotly.plot('scrub_graph',data_scrub,layout_scrub);
}


function purgeGraph(){
        Plotly.purge('camber_graph');
        Plotly.purge('scrub_graph');
    
        draw();
}


