// MathViz Library - math learning visualisations
"use strict";
console.log('----------')
console.log('MathViz: Math Learning Visualisations!!')


// Core functionality we need:
// 1. Fraction Pie Charts
// 2. Addition simple circles, hover for numbers
// 3. Subtraction " "
// 4. either matrix mult or bar chart for conversions 


// FRACTION PIE CHARTS
// const canvas = document.getElementById("canvas");
// canvas.width = 300;
// canvas.height = 300;
 
// const ctx = canvas.getContext("2d");

// utility functions for the fraction visual
// we know a pie chart is made of slices which are made of lines and an arc

// angles so slices don't overlap, center=[x,y] angles=[start,stop] is center of chart

// function makeArc(ctx, angles, center, rad){
//     ctx.beginPath();
//     ctx.arc(center[0],center[1],rad,angles[0],angles[1]);
//     ctx.stroke();

// }

// function makeLine(ctx, start_cords, end_cords){
//     ctx.beginPath();
//     ctx.moveTo(start_cords[0],start_cords[1]);
//     ctx.lineTo(end_cords[0],end_cords[1]);
//     ctx.stroke();

// }

function FracSlice(ctx, angles, center, rad, color){
    
    ctx.fillStyle = color;
    let borderColor = '#000';
;
    ctx.beginPath();
    ctx.moveTo(center[0],center[1]);
    ctx.arc(center[0],center[1], rad, angles[0], angles[1]);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = borderColor;
    ctx.stroke();
    console.log("hi");
}

function FracHeader(num,den){
    var header = document.createElement('h2');
    var header_text = num + "/" + den;
    header.innerText = header_text;
    header.className = 'FracValues';
    document.body.appendChild(header);
}



function FractionVisual(num,den) {
    this.slices = []
    this.angle = (1/den)*2*Math.PI
    this.canvas = document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');
    this.num = num
    this.den = den
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
        var s_angle = 0;
        for(let i = 0; i < this.num; i++){
            this.slices[i] = FracSlice(ctx,[s_angle,s_angle+this.angle],[this.canvas.width/2,this.canvas.height/2], Math.min(this.canvas.width/2,this.canvas.height/2), "#f00");
            s_angle += this.angle;
        }
        for(let i = this.num; i < this.den; i++){
            this.slices[i] = FracSlice(ctx,[s_angle,s_angle+this.angle],[this.canvas.width/2,this.canvas.height/2], Math.min(this.canvas.width/2,this.canvas.height/2), "#fff");
            s_angle += this.angle;

        }
        frac.appendChild(canv);
        document.body.appendChild(frac);
    },



}