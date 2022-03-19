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
// for negative numbers, add crossed out cats
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
    for(let i = 0; i < Math.abs(num); i++){
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
    // this.canvas = document.getElementById('canvas');
    // this.ctx = canvas.getContext('2d');
    this.container = null

    // result calculation
    this.result = 0
    for(let i = 0; i<this.numbers.length; i++){
        if(this.add){
            this.result += this.numbers[i]
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
    // checking result
    // console.log("result: ", this.result);


}

AddSubtVisualisation.prototype = {
    makeVisual: function(){
        const container = document.createElement('div');
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
        equals.className = "button"


        var result_cats = makeCatGroup(this.result, true, this.numbers);

        equals.addEventListener('click', (e)=>{
            console.log(result_cats.style)
            
            if(result_cats.style.display == "none"){
                console.log("clik")
                result_cats.style.display = "inline-block"
                r_sign.style.display = "inline-block"
            }
            else if(result_cats.style.display == "inline-block"){
                console.log("clik block")
                result_cats.style.display = "none"
                r_sign.style.display = "none"

            }

        })
        visual.appendChild(equals);
        if(this.result < 0){
            var r_sign = document.createElement('p');
            r_sign.innerText = '-';
            r_sign.style.display = "none";
            visual.appendChild(r_sign);

        }
       

        // add a cat group for result here
       
        visual.appendChild(result_cats);

        container.appendChild(visual);

        this.container = container;

        document.body.appendChild(container);

    },

    // make sure this doesn't exceed the width of the span above
    addExplanation: function(exp){
        var explain = document.createElement('p');
        explain.className = "AddSubtExplanation";
        explain.innerText = exp;
        this.container.appendChild(explain);

    }
}


// make matrix mult visualisation
// make division visualisation

// 3. matrix visualisation
// add long brackets around matrix
function GenerateMatrix(row,col,vals,res=false){
    var matrix = document.createElement('div');
    matrix.className = "matrix";
    matrix.style.setProperty('--grid-rows', row);
    matrix.style.setProperty('--grid-cols', col);
    for(let i = 0; i<(row*col); i++){
        var element = document.createElement('div');
        var element_text = document.createElement('div');
        element_text.innerText = vals[i];
        element_text.className = "grid-text"
        if(res){
            element_text.style.display = "none";
        }
        element.appendChild(element_text);
        element.className = 'grid-item';
        // if(i==0){
        //     element_text.style.display = "none";
        // }
        matrix.appendChild(element);
    }
    // document.body.appendChild(matrix);
    return matrix;

}

function GenerateMatrix2(row,col,vals,res=false){
    var matrix = document.createElement('div');
    matrix.className = "matrix";
    matrix.style.setProperty('--grid-rows', row);
    matrix.style.setProperty('--grid-cols', col);
    for(let i = 0; i<row; i++){
        for(let j = 0; j<col; j++){
            var element = document.createElement('div');
            var element_text = document.createElement('div');
            element_text.innerText = vals[i][j];
            element_text.className = "grid-text"
            if(res){
                element_text.style.display = "none";
            }
            element.appendChild(element_text);
            element.className = 'grid-item';
            // if(i==0){
            //     element_text.style.display = "none";
            // }
            matrix.appendChild(element);

        }
       
    }
    // document.body.appendChild(matrix);
    return matrix;

}

function GenerateRandomMatrixValues(r,c){
    var ret = []
    for(let i = 0; i<(r*c); i++){
        ret.push(i);
    }
    return ret;
}

function CalculateMatrixScalarResults(s,r,c,vals){
    var ret = []
    for(let i = 0; i<(r*c); i++){
        ret.push(vals[i]*s);
    }
    return ret;

}

function MatrixScalarMultiplication(scalar, mat_rows, mat_cols, mat_vals=null){
    this.scalar = scalar;
    this.rows = mat_rows;
    this.cols = mat_cols;
    this.vals = mat_vals;
    this.clicks = 0;
    this.num_steps = this.rows*this.cols;

    if(this.vals == null){
        this.vals = GenerateRandomMatrixValues(this.rows,this.cols);
    }

    this.results = CalculateMatrixScalarResults(this.scalar,this.rows,this.cols,this.vals);

    //TODO: calculations 
}

function ChangeBackgrounds(c,el){
    for(let i = 0; i < el.length; i++){
        if(i == c){
            el[i].style.backgroundColor = "aliceblue";
        }
        else{
            el[i].style.backgroundColor = "white";
        }
    }

}

function updateHeader(el,scalar,num){
    el.innerText = scalar + " x " + num;
    el.style.display = "block";
}

MatrixScalarMultiplication.prototype = {
    makeVisual: function(){
        var mat_container = document.createElement('div');
        mat_container.className = "MatrixScalarVisual";

        var scalar = document.createElement('h3');
        scalar.innerText = this.scalar;
        scalar.className = "MatrixScalar";

        var mult_sign = document.createElement('h3');
        mult_sign.innerText = "x";
        mult_sign.className = "ScalarMultSign";

        var eq_sign = document.createElement('h3');
        eq_sign.innerText = "=";
        eq_sign.className = "ScalarMultSign";

        var matrix_div = document.createElement('div');
        matrix_div.className = "MatrixDiv";
        var matrix = GenerateMatrix(this.rows,this.cols,this.vals);
        matrix_div.appendChild(matrix);

        var r_matrix_div = document.createElement('div');
        r_matrix_div.className = "MatrixDiv";
        var r_matrix = GenerateMatrix(this.rows,this.cols,this.results, true);
        r_matrix_div.appendChild(r_matrix);

        var next_step = document.createElement('button');
        next_step.innerText = 'Next Step';
        next_step.className = "next-button"

        var header = document.createElement('h3');
        header.className = "MatrixScalarHeader"
        // header.style.display = "none";


        next_step.addEventListener('click', (e)=>{
            if(this.clicks > this.rows*this.cols-1){
                alert("Cogratulations, you reviewed all the steps!");
                return;
            }

            var res_mat_text = r_matrix_div.firstChild.children[this.clicks].firstChild;
            // console.log(r_matrix_div.firstChild.children[this.clicks].firstChild);
            // console.log(el_text);
            res_mat_text.style.display = "block";
            ChangeBackgrounds(this.clicks,r_matrix_div.firstChild.children);
            ChangeBackgrounds(this.clicks,matrix_div.firstChild.children);
            updateHeader(header,this.scalar,this.vals[this.clicks]);
            // scalar.style.backgroundColor = "aliceblue";
            // res_mat_text.parentElement.style.backgroundColor = "aliceblue";
            this.clicks+=1;

        })


        // result matrix
        var mat_scalar_container = document.createElement('div');
        mat_scalar_container.style.width = "40vw";
        // mat_scalar_container.style.marginTop = "5px"
        mat_scalar_container.style.textAlign = "center";
        
        mat_container.appendChild(scalar);
        mat_container.appendChild(mult_sign);
        mat_container.appendChild(matrix_div);
        mat_container.appendChild(eq_sign);
        mat_container.appendChild(r_matrix_div);
        // mat_container.appendChild(next_step);

        mat_scalar_container.appendChild(header);
        mat_scalar_container.appendChild(mat_container);
        mat_scalar_container.appendChild(next_step);
        document.body.appendChild(mat_scalar_container);
    }

}

function MatrixMatrixMultiplication(dims1, dims2, vals1=null, vals2=null){
    this.dims1 = dims1;
    this.dims2 = dims2;
    this.vals1 = vals1;
    this.vals2 = vals2;

    // cols of 1st should eq. rows of 2nd
    if(this.dims1[1] != this.dims2[0]){
        alert("Invalid Dimensions: the number of columns in the first matrix must be equal to the number of rows in the second matrix!");
        return;
    }

    // TODO: FIX

    if(this.vals1 == null){
        this.vals1 = GenerateRandomMatrixValues(this.dims1[0],this.dims1[1]);
    }
    if(this.vals2 == null){
        this.vals2 = GenerateRandomMatrixValues(this.dims1[0],this.dims1[1]);
    }

    this.result = MatrixMatrixResult(this.dims1, this.dims2, this.vals1, this.vals2);

}

// write result function 
function MatrixMatrixResult(dims1, dims2, vals1, vals2){
    // calculate the result
    var res = []
    var temp = []
    temp.fill(0,dims2[1]);
    res.fill(temp,dims1[0]);
    console.log(dims1);
    console.log(dims2);

    for(let i = 0; i<dims1[0]; i++){
        res.push([]);
        for(let k = 0; k < dims2[1]; k++){
            res[i].push(0);
        }
    }

    for(let row = 0; row<dims1[0]; row++){
        // row multiplied by every column 
        // 2x3 -> [1,2,3  
        //         4,5,6]
        // 3x2 -> [1,2  
        //         3,4  
        //         5,6]
        for(let col=0; col<dims2[1]; col++){
            for(let j = 0; j < dims2[0]; j++){
                res[row][col] += vals1[row][j] * vals2[j][col];
            }

        }
        
        
        // var temp_row = null;

    }
    console.log("res",res);
    return res;
}

MatrixMatrixMultiplication.prototype = {
    makeVisual: function(){

        // check for valid calculation
        if(this.dims1[1] != this.dims2[0]){
            alert("Invalid Dimensions: the number of columns in the first matrix must be equal to the number of rows in the second matrix!");
            return;
        }

        var mat_mat_container = document.createElement('div');
        mat_mat_container.className = "MatrixMatrixVisual";

        var matrix_div_one = document.createElement('div');
        matrix_div_one.className = "MatrixDiv";
        var matrix_one = GenerateMatrix2(this.dims1[0],this.dims1[1],this.vals1);
        matrix_div_one.appendChild(matrix_one);

        var mult_sign = document.createElement('h3');
        mult_sign.innerText = "x";
        mult_sign.className = "ScalarMultSign";

        var matrix_div_two = document.createElement('div');
        matrix_div_two.className = "MatrixDiv";
        var matrix_two = GenerateMatrix2(this.dims2[0],this.dims2[1],this.vals2);
        matrix_div_two.appendChild(matrix_two);

        var eq_sign = document.createElement('h3');
        eq_sign.innerText = "=";
        eq_sign.className = "ScalarMultSign";

        var matrix_div_three = document.createElement('div');
        matrix_div_three.className = "MatrixDiv";
        var matrix_three = GenerateMatrix2(this.dims1[0],this.dims1[1],this.result);
        matrix_div_three.appendChild(matrix_three);

        mat_mat_container.appendChild(matrix_div_one);
        mat_mat_container.appendChild(mult_sign);
        mat_mat_container.appendChild(matrix_div_two);
        mat_mat_container.appendChild(eq_sign);
        mat_mat_container.appendChild(matrix_div_three);
        document.body.appendChild(mat_mat_container);



    }
}
