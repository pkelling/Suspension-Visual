function draw2dGraph(){
    
    var bump_array = [];
    var camber_array = [];
    var scrub_array = [];

    
    //-30 to 30 degrees is my standard displacement//
    for(var i=-30; i<=30; i+=.1){

        var displacement = i;
        
        var calcs = displacement_calc(displacement);


        if(calcs != false){
            bump_array.push(calcs.bump);
            camber_array.push(parseFloat(calcs.camber.toFixed(5)));
            scrub_array.push(parseFloat(calcs.scrub.toFixed(5)));
        }
    }
    
    
    ///////////// Build Camber Graph ///////////////////
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
    
    
    
    ///////////// Build Scrub Graph ///////////////////
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
    
        draw2dGraph();
}

