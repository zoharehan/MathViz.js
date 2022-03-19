// MathViz Library - math learning visualisations
"use strict";
console.log('----------')
console.log('MathViz: Math Learning Visualisations!!')


// Core functionality we need:
// 1. Fraction Pie Charts
// 2. Addition simple circles, hover for numbers
// 3. Subtraction " "
// 4. Matrix Operations


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

    // console.log(c);
    // console.log("idx: "+ s_idx);
    return s_idx;

}

function FractionVisual(num, den, color) {
    // slices: stores slices in the visual, colors stores each slice's current color
    this.slices = []
    this.colors = []

    // the angle and radius of each slice in the visual
    this.angle = (1/den)*2*Math.PI
    this.slice_rad = 0;
    // center of the circular visual
    this.center = [0,0]

    // canvas and context for drawing
    this.canvas = null;
    this.ctx = null;

    // fraction's numerator and denominator
    this.num = num
    this.den = den
   
    // the developer-picked fill color
    this.color = color;
    
}

FractionVisual.prototype = {
    
    makeFractionVisual: function(el) {

        const frac = document.createElement('div')
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
        this.canvas = canv;
        this.ctx = ctx;
        this.center = [(this.canvas.width-2)/2,(this.canvas.height-2)/2]
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

        el.appendChild(frac);
        
        // console.log(this.slices);
        this.canvas.addEventListener('click', (e) =>{
            this.canvas.style.cursor = "pointer";
            
            // identify click position
            var x = e.pageX - this.canvas.offsetLeft;
            var y = e.pageY - this.canvas.offsetTop;

            // check if the position requires any action
            var slice_idx = validClick(x,y,this.slices,this.center,this.slice_rad);

            if(slice_idx != -1){
                // redraw this slice with new fill and update header
                if(this.colors[slice_idx] == true){
                    // save angles to redraw
                    var slice_angles = this.slices[slice_idx][1]
                    // make a white one
                    this.slices[slice_idx] = [FracSlice(ctx,[slice_angles[0],slice_angles[1]],[(this.canvas.width-2)/2,(this.canvas.height-2)/2], Math.min((this.canvas.width-4)/2,(this.canvas.height-4)/2), "#fff"), [slice_angles[0],slice_angles[1]]];
                    this.colors[slice_idx] = false

                    // update numerator in the header
                    this.num -= 1
                    alterFracHeader(this.canvas.parentElement.firstChild,this.num,this.den)
                } 
                else{
                    //build one with numerator+1
                    var slice_angles = this.slices[slice_idx][1]
                    // make a white one
                    this.slices[slice_idx] = [FracSlice(ctx,[slice_angles[0],slice_angles[1]],[(this.canvas.width-2)/2,(this.canvas.height-2)/2], Math.min((this.canvas.width-4)/2,(this.canvas.height-4)/2), this.color), [slice_angles[0],slice_angles[1]]];
                    this.colors[slice_idx] = true
                   
                    // update numerator in the header
                    this.num += 1
                    alterFracHeader(this.canvas.parentElement.firstChild,this.num,this.den)
                }
            }
    
        })
      
    },

}

// 2. ADDITION/SUBTRACTION STUFF

function makeCat(c=true){
    var cat = document.createElement('span');
    cat.className = "cat"
    if(c){
        cat.innerHTML = '<img class="catimg" src="./heeheecat.png"></img>'
    }
    else{
        cat.innerHTML = '<img class="catimg" src="./dog.png"></img>'

    }
   
    return cat;
}

function makeCatGroup(num, res=false, c){
    // console.log("value of c: ", c)
    var cats = document.createElement('span');

    var desc = document.createElement('div')
    desc.innerText = num;
    // desc.style.display = "none";
    desc.className = "AddSubtDesc"
    cats.appendChild(desc)
    cats.addEventListener("mouseover", (e) => {
        desc.style.visibility = "visible"
    })
    cats.addEventListener("mouseout", (e) => {
        desc.style.visibility = "hidden"
    })

    if(res){
        cats.className = "result-cats"
        // cats.style.display = "none"
        cats.style.visibility = "hidden";
    }
    else{
        cats.className = "cats"
    }
    for(let i = 0; i < Math.abs(num); i++){
        var cat = makeCat(c);
        cats.appendChild(cat);
    }
    return cats
}


//argument: list of numbers, add=true means addition false means subtraction
// add a button to see results and then show six cats
function AddSubtVisualisation(numbers, add, choice=true){
    this.numbers = numbers
    this.add = add
    this.container = null
    this.choice = choice

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


}

AddSubtVisualisation.prototype = {
    makeVisual: function(el){
        const container = document.createElement('div');
        const visual = document.createElement('span');
        visual.className = "AddSubtVisual"
        //  do the last one manually bec it doesnt need a plus
        for(let i = 0; i < this.numbers.length-1; i++){

            var cats = makeCatGroup(this.numbers[i],false,this.choice);
            visual.appendChild(cats);
            var sign = document.createElement('p');
            sign.className = "AddSubtSign";
            if(this.add){
                sign.innerText = '+'
            }
            else{
                sign.innerText = '-'
            }
            visual.appendChild(sign);
        }
        // last number and equalsto
        var last_cats = makeCatGroup(this.numbers[this.numbers.length-1],false,this.choice);
        visual.appendChild(last_cats);
        var equals = document.createElement('button');
        equals.innerText = '=';
        equals.className = "button"

        var result_cats = makeCatGroup(this.result, true, this.choice);

        equals.addEventListener('click', (e)=>{
            
            if(result_cats.style.visibility == "hidden"){
                result_cats.style.visibility = "visible"
                result_cats.classList.add("animate");
                if(r_sign){
                    r_sign.style.visibility = "visible"
                }
               
            }
            else if(result_cats.style.visibility == "visible"){
                result_cats.style.visibility = "hidden"
                result_cats.classList.remove("animate");
                if(r_sign){
                    r_sign.style.visibility = "hidden"
                }
               

            }

        })
        visual.appendChild(equals);
        if(this.result < 0){
            var r_sign = document.createElement('p');
            r_sign.className = "addSubtResultSign"
            r_sign.innerText = '-';
            r_sign.style.visibility = "hidden";
            visual.appendChild(r_sign);

        }
       

        // add a cat group for result here
       
        visual.appendChild(result_cats);

        container.appendChild(visual);

        this.container = container;

        el.appendChild(container);

    },

    // make sure this doesn't exceed the width of the span above
    addExplanation: function(exp){
        var explain = document.createElement('p');
        explain.className = "AddSubtExplanation";
        explain.innerText = exp;
        this.container.appendChild(explain);

    }
}

// 3. matrix visualisation

//  here vals is just a list of numbers
function GenerateMatrix(row,col,vals,res=false){
    var matrix = document.createElement('div');
    matrix.className = "matrix";
    matrix.style.setProperty('--matrix-rows', row);
    matrix.style.setProperty('--matrix-cols', col);
    for(let i = 0; i<(row*col); i++){
        var element = document.createElement('div');
        var element_text = document.createElement('div');
        element_text.innerText = vals[i];
        element_text.className = "matrix-text"
        if(res){
            element_text.style.display = "none";
        }
        element.appendChild(element_text);
        element.className = 'matrix-element';

        matrix.appendChild(element);
    }
    return matrix;

}

// this has vals as [[1,2,3], [4,5,6], ....] -> a list for each row
function GenerateMatrix2(row,col,vals,res=false){
    var matrix = document.createElement('div');
    matrix.className = "matrix";
    matrix.style.setProperty('--matrix-rows', row);
    matrix.style.setProperty('--matrix-cols', col);
    for(let i = 0; i<row; i++){
        for(let j = 0; j<col; j++){
            var element = document.createElement('div');
            var element_text = document.createElement('div');
            element_text.innerText = vals[i][j];
            element_text.className = "matrix-text"
            if(res){
                element_text.style.display = "none";
            }
            element.appendChild(element_text);
            element.className = 'matrix-element';
            // if(i==0){
            //     element_text.style.display = "none";
            // }
            matrix.appendChild(element);

        }
       
    }
    // document.body.appendChild(matrix);
    return matrix;

}

// TODO:MODIFY
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

function changeBackgrounds(c,el){
    for(let i = 0; i < el.length; i++){
        if(i == c){
            el[i].style.backgroundColor = "#C0EAFA";
        }
        else{
            el[i].style.backgroundColor = "white";
        }
    }

}

function matMatHighlight(row,col,dims1,dims2,mat1,mat2){
    var lower_bound = (row*dims1[1])-1;
    var upper_bound = (row+1)*dims1[1];

    // start from row*(num_cols) for num_cols
    for(let i = 0; i < (dims1[0]*dims1[1]); i++){
        
        if(lower_bound<i && i<upper_bound){
            mat1.firstChild.children[i].style.backgroundColor = "#C0EAFA";
        }
        else{
            mat1.firstChild.children[i].style.backgroundColor = "white";
        }

    }

    for(let i = 0; i < (dims2[0]*dims2[1]); i++){
        if(i%dims2[1] == col){
            mat2.firstChild.children[i].style.backgroundColor = "#C0EAFA";
        }
        else{
            mat2.firstChild.children[i].style.backgroundColor = "white";
        }
    }

}

function updateHeader(el,scalar,num,end=false){
    if(end){
        el.innerText = "Finished Multiplying!"

    }
    else{
        el.innerText = scalar + " x " + num;
    }
    el.style.visibility = "visible";
}

function updateMatMatHeader(el,dims1,dims2,vals1,vals2,row,col){
    var row_str = "(";

    for(let i = 0; i < dims1[1]-1; i++){
        row_str += vals1[row][i];
        row_str += " , "
    }
    // add last one
    row_str += vals1[row][dims1[1]-1];
    row_str += ")";

    var col_str = "(";

    for(let i = 0; i < dims2[0]-1; i++){
        col_str += vals2[i][col];
        col_str += " , "
    }
    // add last one
    col_str += vals2[dims2[0]-1][col];
    col_str += ")";

    el.innerText = row_str + " . " + col_str;
    el.style.visibility = "visible";


}

MatrixScalarMultiplication.prototype = {
    makeVisual: function(el){
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
        header.className = "MainMatrixHeader"
        // header.style.display = "none";


        next_step.addEventListener('click', (e)=>{
            if(this.clicks > this.rows*this.cols-1){
                alert("Cogratulations, you reviewed all the steps!");
                changeBackgrounds(this.clicks,r_matrix_div.firstChild.children);
                changeBackgrounds(this.clicks,matrix_div.firstChild.children);

                // print finished since steps are over now!
                updateHeader(header,null,null,true);
                this.clicks = 0;
                return;
            }

            var res_mat_text = r_matrix_div.firstChild.children[this.clicks].firstChild;
            
            res_mat_text.style.display = "block";
            changeBackgrounds(this.clicks,r_matrix_div.firstChild.children);
            changeBackgrounds(this.clicks,matrix_div.firstChild.children);
            updateHeader(header,this.scalar,this.vals[this.clicks]);
            
            this.clicks+=1;

        })


        // result matrix
        var mat_scalar_container = document.createElement('div');
        mat_scalar_container.className = "MainMatContainer";
        
        mat_container.appendChild(scalar);
        mat_container.appendChild(mult_sign);
        mat_container.appendChild(matrix_div);
        mat_container.appendChild(eq_sign);
        mat_container.appendChild(r_matrix_div);

        mat_scalar_container.appendChild(header);
        mat_scalar_container.appendChild(mat_container);
        mat_scalar_container.appendChild(next_step);
        el.appendChild(mat_scalar_container);
    }

}

function MatrixMatrixMultiplication(dims1, dims2, vals1, vals2){
    this.dims1 = dims1;
    this.dims2 = dims2;
    this.vals1 = vals1;
    this.vals2 = vals2;
    this.clicks = 0;

    // cols of 1st should eq. rows of 2nd
    if(this.dims1[1] != this.dims2[0]){
        alert("Invalid Dimensions: the number of columns in the first matrix must be equal to the number of rows in the second matrix!");
        return;
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
    // console.log(dims1);
    // console.log(dims2);

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

    }
    // console.log("res",res);
    return res;
}

MatrixMatrixMultiplication.prototype = {
    makeVisual: function(el){

        // check for valid calculation
        if(this.dims1[1] != this.dims2[0]){
            alert("Invalid Dimensions: the number of columns in the first matrix must be equal to the number of rows in the second matrix!");
            return;
        }

        var mat_mat_container = document.createElement('div');
        mat_mat_container.className = "MainMatContainer";

        var header = document.createElement('h3');
        header.className = "MainMatrixHeader"

        var mat_container = document.createElement('div');
        mat_container.className = "MatrixMatrixVisual";

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
        var matrix_three = GenerateMatrix2(this.dims1[0],this.dims2[1],this.result,true);
        matrix_div_three.appendChild(matrix_three);

        var next_step = document.createElement('button');
        next_step.innerText = 'Next Step';
        next_step.className = "next-button";

        mat_container.appendChild(matrix_div_one);
        mat_container.appendChild(mult_sign);
        mat_container.appendChild(matrix_div_two);
        mat_container.appendChild(eq_sign);
        mat_container.appendChild(matrix_div_three);

        mat_mat_container.appendChild(header);
        mat_mat_container.appendChild(mat_container);
        mat_mat_container.appendChild(next_step);

        el.appendChild(mat_mat_container);

        var row = 0;
        var col = 0;

        next_step.addEventListener('click', (e)=>{
            if(this.clicks > this.dims1[0]*this.dims2[1]-1){
                alert("Cogratulations, you reviewed all the steps!");
                row += 1;
                col += 1;
                changeBackgrounds(this.clicks, matrix_div_three.firstChild.children);
                matMatHighlight(row,col,this.dims1,this.dims2, matrix_div_one, matrix_div_two);
                updateHeader(header,null,null,true);

                // reset
                row = 0;
                col = 0;
                this.clicks = 0;

                return;
            }

            // 1. make numbers visible one by one
            var res_mat_text = matrix_div_three.firstChild.children[this.clicks].firstChild;
            res_mat_text.style.display = "block";

            // 2. update header
            if(this.clicks != 0){
                if(this.clicks%this.dims2[1] == 0){
                    row += 1;
                    col = 0;
                }
                else{
                    col += 1;
                }
            }

            updateMatMatHeader(header,this.dims1,this.dims2,this.vals1,this.vals2,row,col);

            changeBackgrounds(this.clicks, matrix_div_three.firstChild.children);

            // 3. update highlighting: highlight row of first matrix, col of second
            matMatHighlight(row,col,this.dims1,this.dims2, matrix_div_one, matrix_div_two);

            this.clicks+=1;

        })




    }
}
