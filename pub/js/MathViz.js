// MathViz Library - math learning visualisations
"use strict";
console.log('----------')
console.log('MathViz: Math Learning Visualisations!!')


// Core functionality we need:
// 1. Fraction Pie Charts
// 2. Addition simple circles, hover for numbers
// 3. Subtraction " "
// 4. either matrix mult or bar chart for conversions 


// 1. FRACTION PIE CHARTS
// TODO: Mixed Numbers

// this.slices = [  [slice, angles] , [slice, angles] .... ] -> angles = [start_angle, end_angle]

function FracSlice(ctx, angles, center, rad, color){
    
    ctx.fillStyle = color
    let borderColor = '#000';
;
    ctx.beginPath();
    ctx.moveTo(center[0],center[1]);
    ctx.arc(center[0],center[1], rad, angles[0], angles[1]);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = borderColor;
    ctx.stroke();
}

function FracHeader(num,den){
    var header = document.createElement('h2');
    var header_text = num + "/" + den;
    header.innerText = header_text;
    header.className = 'FracValues';
    document.body.appendChild(header);
}

function alterFracHeader(header, num, den){
    var new_header_text = num + "/" + den;
    header.innerText = new_header_text;

}

// function degreeToRadianHelper(num){
//     var ans = num * (Math.PI / 180);
//     return ans
// }

// function radianToDegreeHelper(num){
//     var ans = num * (180 / Math.PI);
//     return ans
// }

// adding interaction
function validClick(x,y,slices,c,rad){
    // find the angle and redraw the corresponding slice 
    var s_idx = -1
    // this is all in radians
    var click_angle = Math.atan2((y-c[1]), (x-c[0]));
    if(click_angle<0){
        // make it positive again
        click_angle+= 2*Math.PI
    }
    console.log("clickangle: ", click_angle)

    for(let i = 0; i < slices.length; i++){
        if(slices[i][1][0] <= click_angle && slices[i][1][1] > click_angle){
            s_idx = i;
            break;
        }
    }

    // make sure no clicks outside the chart are registered
    var dist = ((x - c[0]) * (x - c[0])) + ((y - c[1]) * (y - c[1]))
    if(dist > rad * rad) {
        s_idx = -1; 
    }

    console.log(c);
    console.log("idx: "+ s_idx);
    return s_idx;

}


// can add color here 
// color can be true or false

function FractionVisual(num,den, color) {
    this.slices = []
    this.colors = []
    this.angle = (1/den)*2*Math.PI
    this.canvas = document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');
    this.num = num
    this.den = den
    this.center = [(this.canvas.width-2)/2,(this.canvas.height-2)/2]
    this.color = color;
    this.slice_rad = 0;
}

FractionVisual.prototype = {
    
    makeFractionVisual: function() {
        // TODO: UPDATE THIS TO WORK
        const frac = document.createElement('div')
        // // maybe add style?
        const body = $('body')
        frac.className = 'FractionVisual'

        // header creation
        var header = document.createElement('h2');
        var header_text = this.num + "/" + this.den;
        header.innerText = header_text;
        header.className = 'FracValues';
        frac.appendChild(header);


        // visual
        var canv = document.createElement('canvas');
        canv.className = "FracCanvas";
        var ctx = canv.getContext('2d');
        this.slice_rad = Math.min((this.canvas.width-4)/2,(this.canvas.height-4)/2);

        var s_angle = 0;
        for(let i = 0; i < this.num; i++){
            this.slices[i] = [FracSlice(ctx,[s_angle,s_angle+this.angle],[(this.canvas.width-2)/2,(this.canvas.height-2)/2], Math.min((this.canvas.width-4)/2,(this.canvas.height-4)/2), this.color),[s_angle,s_angle+this.angle]];
            this.colors[i] = true;
            s_angle += this.angle;
        }
        for(let i = this.num; i < this.den; i++){
            this.slices[i] = [FracSlice(ctx,[s_angle,s_angle+this.angle],[(this.canvas.width-2)/2,(this.canvas.height-2)/2], Math.min((this.canvas.width-4)/2,(this.canvas.height-4)/2), "#fff"), [s_angle,s_angle+this.angle]];
            this.colors[i] = false;
            s_angle += this.angle;

        }
        this.canvas = canv;
        frac.appendChild(canv);
        document.body.appendChild(frac);
        
        console.log(this.slices);
        this.canvas.addEventListener('click', (e) =>{
            this.canvas.style.cursor = "pointer";
            console.log(e);
            var x = e.pageX - this.canvas.offsetLeft;
            var y = e.pageY - this.canvas.offsetTop;
            var slice_idx = validClick(x,y,this.slices,this.center,this.slice_rad);
            if(slice_idx != -1){
                // redraw this slice with new fill and update header
                if(this.colors[slice_idx] == true){
                    //build one with numerator-1
                    // this.ctx.clearRect(0,0,300,150);
                    // save angles to redraw
                    var slice_angles = this.slices[slice_idx][1]
                    // make a white one, dont know if this works..
                    this.slices[slice_idx] = [FracSlice(ctx,[slice_angles[0],slice_angles[1]],[(this.canvas.width-2)/2,(this.canvas.height-2)/2], Math.min((this.canvas.width-4)/2,(this.canvas.height-4)/2), "#fff"), [slice_angles[0],slice_angles[1]]];
                    this.colors[slice_idx] = false
                    console.log("that's blue")
                    this.num -= 1
                    alterFracHeader(this.canvas.parentElement.firstChild,this.num,this.den)
                } 
                else{
                    //build one with numerator+1
                    var slice_angles = this.slices[slice_idx][1]
                    // make a white one, dont know if this works..
                    this.slices[slice_idx] = [FracSlice(ctx,[slice_angles[0],slice_angles[1]],[(this.canvas.width-2)/2,(this.canvas.height-2)/2], Math.min((this.canvas.width-4)/2,(this.canvas.height-4)/2), this.color), [slice_angles[0],slice_angles[1]]];
                    this.colors[slice_idx] = true
                    console.log("that's white")
                    this.num += 1
                    alterFracHeader(this.canvas.parentElement.firstChild,this.num,this.den)
                }
            }
    
        })
      
    },

    // onclick: function(e) {
    //     var x = e.pageX - document.getElementById('canvas').offsetLeft;
    //     var y = e.pageY - document.getElementById('canvas').offsetTop;
    //     // check if the click is in the circle
    //     // var clicked = (x - this.center[0]) * (x - this.center[0]) + (y - this.center[1]) * (y - this.center[1]);
    //     // if (clicked <= this.radius * this.radius)
    //     var slice_idx = validClick(x,y,this.slices,this.center);
    //     console.log("slice idx = ", slice_idx);
    //     if(slice_idx != -1){
    //         // redraw this slice with new fill and update header
    //         if(this.colors[i] == true){
    //             //build one with numerator-1
    //             // this.ctx.clearRect(0,0,w=300,h=150);
    //             console.log("that's blue")
    //         } 
    //         else{
    //             //build one with numerator+1
    //             console.log("that's white")
    //         }
    //     }

    // }

}

// 2. ADDITION/SUBTRACTION STUFF
// maybe a custom choice b/w cats,dogs,stars etc?
// deal with negative numbers, do results
// what if some addition some subtraction? maybe add a list of signs?

function makeCat(){
    var cat = document.createElement('span');
    cat.className = "cat"
    cat.innerHTML = '<img class="catimg" src="./heeheecat.png"></img>'
    return cat;
}

function makeCatGroup(num, res=false){
    var cats = document.createElement('span');

    var desc = document.createElement('div')
    desc.innerText = num;
    desc.style.display = "none";
    desc.className = "AddSubtDesc"
    cats.appendChild(desc)
    cats.addEventListener("mouseover", (e) => {
        desc.style.display = "flex"
    })
    cats.addEventListener("mouseout", (e) => {
        desc.style.display = "none"
    })

    if(res){
        cats.className = "result-cats"
        cats.style.display = "none"
        // var desc = document.createElement('div')
        // desc.innerText = "4 + 2 = 6";
        // desc.style.display = "none";
        // desc.className = "AddSubtDesc"
        // cats.appendChild(desc)
        // cats.addEventListener("mouseover", (e) => {
        //     desc.style.display = "flex"
        // })
        // cats.addEventListener("mouseout", (e) => {
        //     desc.style.display = "none"
        // })
    }
    else{
        cats.className = "cats"
    }
    for(let i = 0; i < num; i++){
        var cat = makeCat();
        cats.appendChild(cat);
    }
    // document.body.appendChild(cats);
    return cats
}
// group of objects needs a max width !!!

//argument: list of numbers, add=true means addition false means subtraction
// add a button to see results and then show six cats
function AddSubtVisualisation(numbers, add){
    this.numbers = numbers
    this.add = add
    // might need might not?
    this.canvas = document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');

    // result calculation
    this.result = 0
    for(let i = 0; i<this.numbers.length; i++){
        if(this.add){
            this.result+= this.numbers[i]
        }
        else{
            if(i == 0){
                this.result += this.numbers[i]
            }
            else{
                this.result -= this.numbers[i]
            }
        }
    }


}

AddSubtVisualisation.prototype = {
    makeVisual: function(){
        const visual = document.createElement('span');
        visual.className = "AddSubtVisual"
        //  do the last one manually bec it doesnt need a plus
        console.log(this.numbers.length)
        for(let i = 0; i < this.numbers.length-1; i++){
            console.log(i);
            var cats = makeCatGroup(this.numbers[i]);
            visual.appendChild(cats);
            var sign = document.createElement('p');
            if(this.add){
                sign.innerText = '+'
            }
            else{
                sign.innerText = '-'
            }
            visual.appendChild(sign);
        }
        // last number and equalsto
        var last_cats = makeCatGroup(this.numbers[this.numbers.length-1]);
        visual.appendChild(last_cats);
        var equals = document.createElement('button');
        equals.innerText = '=';
        equals.className = "equals-button"

        var result_cats = makeCatGroup(this.result, true, this.numbers);

        equals.addEventListener('click', (e)=>{
            console.log(result_cats.style)
            
            if(result_cats.style.display == "none"){
                console.log("clik")
                result_cats.style.display = "inline-block"
            }
            else if(result_cats.style.display == "inline-block"){
                console.log("clik block")
                result_cats.style.display = "none"

            }

        })
        visual.appendChild(equals);

        // add a cat group for result here
       
        visual.appendChild(result_cats);

        document.body.appendChild(visual);

    }
}