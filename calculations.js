var Ss = {svg:{}};

/*      Ss Object (suspension object)

    
    //Lengths and Angles
    Ss.L_upper,
    Ss.L_lower,     
    Ss.A_upper0,
    Ss.A_lower0,
    Ss.kpi,        //
    Ss.scrubR,       
    Ss.Zb,         //  
    Ss.knuckle;   
    
    //Coordinates
    Ss.Ay0,        //
    Ss.Az0,        //
    Ss.By0,        //
    Ss.Bz0,        //
    Ss.Cy0,        //
    Ss.Cz0,        //
    Ss.Dy0,        //
    Ss.Dz0,        //
    Ss.Ey0,        //
    Ss.Ez0;        //
    
    //Others
    Ss.yBE,        //
    Ss.L_eb,       //
    Ss.A_eb0,
    Ss.A_bd0;
    Ss.wheel_diameter
    Ss.wheel_width
    Ss.connectLY0
    Ss.connectLZ0
    
    //Added Later
    Ss.svg = {svg handles}

*/


//Sets values starting from Lengths and Angles
function toCoords(){
    
    //sets all necessary Ss properties
    
    Ss.L_upper     = Number(document.getElementById("L_upper").value);
    Ss.L_lower     = Number(document.getElementById("L_lower").value);
    Ss.A_upper0    = Number(document.getElementById("A_upper0").value);
    Ss.A_lower0    = Number(document.getElementById("A_lower0").value);
    Ss.kpi         = Number(document.getElementById("kpi").value);
    Ss.knuckle     = Number(document.getElementById("knuckle").value);
    Ss.Zb          = Number(document.getElementById("Zb").value);
    
    Ss.track       = Number(document.getElementById("track").value);
    
    Ss.scrubR      = Number(document.getElementById("scrubR").value);
    
    
    Ss.yBE = Snap.tan(Ss.kpi)*(Ss.Zb)+Ss.scrubR;
    
    //contact patch point
    Ss.Ey0 = Ss.track/2;
    Ss.Ez0 = 0;
    
    //lower ball joint
    Ss.By0 = Ss.Ey0 - Ss.yBE;
    Ss.Bz0 = Ss.Zb;
    
    //lower pivot point
    Ss.Ay0 = Ss.By0 - Snap.cos(Ss.A_lower0)*Ss.L_lower;
    Ss.Az0 = Ss.Zb-Snap.sin(Ss.A_lower0)*Ss.L_lower;
    
    //upper ball joint
    Ss.Dy0 = Ss.By0-Ss.knuckle*Snap.sin(Ss.kpi);
    Ss.Dz0 = Ss.Zb+Ss.knuckle*Snap.cos(Ss.kpi);
    
    //upper pivot point
    Ss.Cy0 = Ss.Dy0-Snap.cos(Ss.A_upper0)*Ss.L_upper;
    Ss.Cz0 = Ss.Dz0-Snap.sin(Ss.A_upper0)*Ss.L_upper;
    
    
    var addToForm = {
        'Ay0'       : Ss.Ay0, 
        'Az0'       : Ss.Az0,
        'By0'       : Ss.By0, 
        'Bz0'       : Ss.Bz0, 
        'Cy0'       : Ss.Cy0, 
        'Cz0'       : Ss.Cz0,
        'Dy0'       : Ss.Dy0, 
        'Dz0'       : Ss.Dz0 
    };
    
    setFormValues(addToForm);
    
    
    Ss.L_eb = Math.sqrt(Math.pow(Ss.yBE,2)+Math.pow(Ss.Zb,2));
    Ss.A_eb0 = Snap.atan(Ss.Zb/Ss.yBE);
    Ss.A_bd0 = 90-Ss.kpi;
    
    Ss.wheel_diameter = Number(document.getElementById("wheel_diameter").value);
    Ss.wheel_width = Number(document.getElementById("wheel_width").value);
    
    Ss.connectLY0 = (Ss.By0+Ss.Dy0)/2;
    Ss.connectLZ0 = (Ss.Bz0+Ss.Dz0)/2;

}


//Sets values starting from Coordinates
function fromCoords(){
    
    //sets all necessary Ss properties
    
    Ss.Ay0 = Number(document.getElementById("Ay0").value);
    Ss.Az0 = Number(document.getElementById("Az0").value);
    Ss.By0 = Number(document.getElementById("By0").value);
    Ss.Bz0 = Number(document.getElementById("Bz0").value);
    Ss.Cy0 = Number(document.getElementById("Cy0").value);
    Ss.Cz0 = Number(document.getElementById("Cz0").value);
    Ss.Dy0 = Number(document.getElementById("Dy0").value);
    Ss.Dz0 = Number(document.getElementById("Dz0").value);
    
    Ss.scrubR      = Number(document.getElementById("scrubR").value);
    Ss.track       = Number(document.getElementById("track").value);
    
    
    Ss.A_upper0 = Snap.atan((Ss.Dz0-Ss.Cz0)/(Ss.Dy0-Ss.Cy0));
    Ss.L_upper = (Ss.A_upper0 === 0)? (Ss.Dy0-Ss.Cy0) : (Ss.Dz0-Ss.Cz0)/Snap.sin(Ss.A_upper0);
    
    Ss.A_lower0 = Snap.atan((Ss.Bz0-Ss.Az0)/(Ss.By0-Ss.Ay0));
    Ss.L_lower = (Ss.A_lower0 === 0)? (Ss.By0 - Ss.Ay0) : (Ss.Bz0-Ss.Az0)/Snap.sin(Ss.A_lower0);
    
    Ss.kpi = Snap.atan((Ss.By0-Ss.Dy0)/(Ss.Dz0-Ss.Bz0));
    Ss.knuckle = (Ss.By0-Ss.Dy0)/Snap.sin(Ss.kpi);
    
    
    Ss.Zb = Ss.Bz0;
    Ss.yBE = Snap.tan(Ss.kpi)*(Ss.Zb)+Ss.scrubR;
    
    Ss.Ey0 = Ss.By0 + Ss.yBE;
    Ss.Ez0 = 0;
    
    
    var addToForm = {
        'L_upper'   : Ss.L_upper,
        'L_lower'   : Ss.L_lower,     
        'A_upper0'  : Ss.A_upper0,
        'A_lower0'  : Ss.A_lower0,
        'kpi'       : Ss.kpi,
        'Zb'        : Ss.Zb,           
        'knuckle'   : Ss.knuckle
    };
    
    setFormValues(addToForm);
    
    
    Ss.L_eb = Math.sqrt(Math.pow(Ss.yBE,2)+Math.pow(Ss.Zb,2));
    Ss.A_eb0 = Snap.atan(Ss.Zb/Ss.yBE);
    Ss.A_bd0 = 90-Ss.kpi;
    
    Ss.wheel_diameter = Number(document.getElementById("wheel_diameter").value);
    Ss.wheel_width = Number(document.getElementById("wheel_width").value);
    
    Ss.connectLY0 = (Ss.By0+Ss.Dy0)/2;
    Ss.connectLZ0 = (Ss.Bz0+Ss.Dz0)/2;
    
}


//sets values in mainForm 
// obj keys are same as input #ids
function setFormValues(obj){
    
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        
        document.getElementById(key).value = obj[key].toFixed(2);
          
      }
    }
    
}


//calculates camber,scrub,and bump from displacement angle of bottom arm
// returns an object of useful values
function displacement_calc(displacement){
        
        //returns {'camber':camber, 'bump':bump, 'scrub':scrub}
    
        var A_lower = Ss.A_lower0 + displacement;
        var By = Ss.Ay0 + Snap.cos(A_lower)*Ss.L_lower;
        var Bz = Ss.Az0 + Snap.sin(A_lower)*Ss.L_lower;

        var h = Ss.Cz0 - Bz;
        var w = By - Ss.Cy0;
        var L_bc = Math.sqrt(h*h + w*w);

        var A_bc = Snap.atan(h/w);
    
        var foo = (L_bc*L_bc + Math.pow(Ss.knuckle,2) - Math.pow(Ss.L_upper,2))/(2*L_bc*Ss.knuckle);
        
        //checks if this displacement is impossible
        if(foo > 1){ 
            if(displacement > 0){ Ss.displacement_flag_upper = displacement; }
            else{ Ss.displacement_flag_lower = displacement; }
            return(false); 
        }
    
        var A_cbd = Snap.acos(foo);
        var A_bd = A_bc + A_cbd;

        var camber = A_bd - Ss.A_bd0;

        var A_eb = Ss.A_eb0 + camber;

        var Ey = By + Snap.cos(A_eb)*Ss.L_eb;
        var Ez = Bz - Snap.sin(A_eb)*Ss.L_eb;

        var bump = Ez;
        var scrub = Ey-Ss.Ey0;
    
        //for showing discplacement
        var Dy = By - Snap.cos(A_bd)*Ss.knuckle;
        var Dz = Bz + Snap.sin(A_bd)*Ss.knuckle;
        var connectLY = (By+Dy)/2;
        var connectLZ = (Bz+Dz)/2;
    
        var disp_calcs = {
                        'camber'    :camber, 
                        'bump'      :bump, 
                        'scrub'     :scrub,
                        'By'        :By,
                        'Bz'        :Bz,
                        'Dy'        :Dy,
                        'Dz'        :Dz,
                        'connectLY' :connectLY,
                        'connectLZ' :connectLZ,
                    };
    
        return(disp_calcs);
    
}




//returns Camber @ specific bump value
var calcsForBump = function(bumpToUse){
    
    var tolerance = .01; //margin of error for bump
    var increments = .001;
    var n = 0; //discplacement increment
    var match = false;
        
    while(match === false){

        var disp_calcs = displacement_calc(n);
        if(disp_calcs === false){ 
            return(false); 
        }
        
        var difference = disp_calcs['bump'] - bumpToUse;

        if( Math.abs(difference) < tolerance ) {
            match = true;
        }else{
            (bumpToUse >= 0)? n += increments : n-= increments;
        }

    }       
    
    return(disp_calcs);

};
