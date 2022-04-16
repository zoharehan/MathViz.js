// MathViz Library - math learning visualisations
"use strict";

// 1. FRACTION PIE CHARTS
// this.slices = [  [slice, angles] , [slice, angles] .... ] -> angles = [start_angle, end_angle]
(function(global, document, $) { 

class FractionVisual {
    #slices;
    #colors;
    #angle;
    #slice_rad;
    #center;
    #num;
    #den;
    #color;
    constructor(num, den, color) {
        // slices: stores slices in the visual, colors stores each slice's current color
        this.#slices = [];
        this.#colors = [];
        // the angle and radius of each slice in the visual
        this.#angle = (1 / den) * 2 * Math.PI;
        this.#slice_rad = 0;
        // center of the circular visual
        this.#center = [0, 0];

        // fraction's numerator and denominator
        this.#num = num;
        this.#den = den;

        // the developer-picked fill color
        this.#color = color;

    }
    
    #FracSlice(ctx, angles, center, rad, color){
    
        ctx.fillStyle = color
        let borderColor = '#000';
        ctx.beginPath();
        ctx.moveTo(center[0],center[1]);
        ctx.arc(center[0],center[1], rad, angles[0], angles[1]);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = borderColor;
        ctx.stroke();
    }

    #alterFracHeader(header, num, den){
        var new_header_text = num + "/" + den;
        header.innerText = new_header_text;
    
    }

    // adding interaction
    #validClick(x,y,slices,c,rad){
        // find the angle and redraw the corresponding slice 
        var s_idx = -1
        // this is all in radians
        var click_angle = Math.atan2((y-c[1]), (x-c[0]));
        if(click_angle<0){
            // make it positive again
            click_angle+= 2*Math.PI
        }

        for(let i = 0; i < slices.length; i++){
            if(slices[i][0] <= click_angle && slices[i][1] > click_angle){
                s_idx = i;
                break;
            }
        }

        // make sure no clicks outside the chart are registered
        var dist = ((x - c[0]) * (x - c[0])) + ((y - c[1]) * (y - c[1]))
        if(dist > rad * rad) {
            s_idx = -1; 
        }

        return s_idx;

    }

    makeVisual(el) {

        const fracComponent = document.createElement('div');
        fracComponent.className = 'FractionVisual';

        // header creation
        var header = document.createElement('h2');
        var header_text = this.#num + "/" + this.#den;
        header.innerText = header_text;
        header.className = 'FracValues';
        fracComponent.appendChild(header);


        // visual
        var canv = document.createElement('canvas');
        canv.className = "FracCanvas";
        var ctx = canv.getContext('2d');
        this.#center = [(canv.width - 2) / 2, (canv.height - 2) / 2];
        this.#slice_rad = Math.min((canv.width - 4) / 2, (canv.height - 4) / 2);

        var s_angle = 0;
        for (let i = 0; i < this.#num; i++) {

            this.#FracSlice(ctx, [s_angle, s_angle + this.#angle], [(canv.width - 2) / 2, (canv.height - 2) / 2], Math.min((canv.width - 4) / 2, (canv.height - 4) / 2), this.#color)

            this.#slices[i] = [s_angle, s_angle + this.#angle];
            this.#colors[i] = true;
            s_angle += this.#angle;
        }
        for (let i = this.#num; i < this.#den; i++) {
            this.#FracSlice(ctx, [s_angle, s_angle + this.#angle], [(canv.width - 2) / 2, (canv.height - 2) / 2], Math.min((canv.width - 4) / 2, (canv.height - 4) / 2), "#fff"),
            this.#slices[i] = [s_angle, s_angle + this.#angle];
            this.#colors[i] = false;
            s_angle += this.#angle;

        }
        fracComponent.appendChild(canv);

        el.appendChild(fracComponent);

        canv.addEventListener('click', (e) => {
            canv.style.cursor = "pointer";

            // identify click position
            var x = e.pageX - canv.offsetLeft;
            var y = e.pageY - canv.offsetTop;

            // check if the position requires any action
            var slice_idx = this.#validClick(x, y, this.#slices, this.#center, this.#slice_rad);

            if (slice_idx != -1) {
                // redraw this slice with new fill and update header
                if (this.#colors[slice_idx] == true) {
                    // save angles to redraw
                    var slice_angles = this.#slices[slice_idx];
                    // make a white one
                    this.#FracSlice(ctx, [slice_angles[0], slice_angles[1]], [(canv.width - 2) / 2, (canv.height - 2) / 2], Math.min((canv.width - 4) / 2, (canv.height - 4) / 2), "#fff")
                    this.#slices[slice_idx] = [slice_angles[0], slice_angles[1]];
                    this.#colors[slice_idx] = false;

                    // update numerator in the header
                    this.#num -= 1;
                    this.#alterFracHeader(canv.parentElement.firstChild, this.#num, this.#den);
                }
                else {
                    //build one with numerator+1
                    var slice_angles = this.#slices[slice_idx];
                    // make a white one
                    this.#FracSlice(ctx, [slice_angles[0], slice_angles[1]], [(canv.width - 2) / 2, (canv.height - 2) / 2], Math.min((canv.width - 4) / 2, (canv.height - 4) / 2), this.#color)
                    this.#slices[slice_idx] = [slice_angles[0], slice_angles[1]];
                    this.#colors[slice_idx] = true;

                    // update numerator in the header
                    this.#num += 1;
                    this.#alterFracHeader(canv.parentElement.firstChild, this.#num, this.#den);
                }
            }

        });

    }
}

global.FractionVisual = global.FractionVisual || FractionVisual


// 2. ADDITION/SUBTRACTION STUFF
//argument: list of numbers, add=true means addition false means subtraction
class AddSubtVisual {
    #numbers;
    #add;
    #container;
    #choice;
    #result;
    constructor(numbers, add, choice = true) {
        this.#numbers = numbers;
        this.#add = add;
        this.#container = null;
        this.#choice = choice;

        // result calculation
        this.#result = 0;
        for (let i = 0; i < this.#numbers.length; i++) {
            if (this.#add) {
                this.#result += this.#numbers[i];
            }
            else {
                if (i == 0) {
                    this.#result += this.#numbers[i];
                }
                else {
                    this.#result -= this.#numbers[i];
                }
            }
        }


    }

    #makeCat(c=true){
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

    #makeCatGroup(num, res=false, c){
        var cats = document.createElement('span');
    
        var desc = document.createElement('div')
        desc.innerText = num;
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
            cats.style.visibility = "hidden";
        }
        else{
            cats.className = "cats"
        }
        for(let i = 0; i < Math.abs(num); i++){
            var cat = this.#makeCat(c);
            cats.appendChild(cat);
        }
        return cats
    }

    makeVisual(el) {
        const addSubtVisualComponent = document.createElement('div');
        addSubtVisualComponent.className = "AddSubtVisualComponent";
        const visual = document.createElement('span');
        visual.className = "AddSubtVisual";
        //  do the last one manually bec it doesnt need a plus
        for (let i = 0; i < this.#numbers.length - 1; i++) {

            var cats = this.#makeCatGroup(this.#numbers[i], false, this.#choice);
            visual.appendChild(cats);
            var sign = document.createElement('p');
            sign.className = "AddSubtSign";
            if (this.#add) {
                sign.innerText = '+';
            }
            else {
                sign.innerText = '-';
            }
            visual.appendChild(sign);
        }
        // last number and equalsto
        var last_cats = this.#makeCatGroup(this.#numbers[this.#numbers.length - 1], false, this.#choice);
        visual.appendChild(last_cats);
        
        var equals = document.createElement('button');
        equals.innerHTML = '<p class="button-text">=</p>';
        equals.className = "button";

        var result_cats = this.#makeCatGroup(this.#result, true, this.#choice);

        equals.addEventListener('click', (e) => {

            if (result_cats.style.visibility == "hidden") {
                result_cats.style.visibility = "visible";
                result_cats.classList.add("animate");
                if (r_sign) {
                    r_sign.style.visibility = "visible";
                }

            }
            else if (result_cats.style.visibility == "visible") {
                result_cats.style.visibility = "hidden";
                result_cats.classList.remove("animate");
                if (r_sign) {
                    r_sign.style.visibility = "hidden";
                }


            }

        });
        visual.appendChild(equals);
        if (this.#result < 0) {
            var r_sign = document.createElement('p');
            r_sign.className = "addSubtResultSign";
            r_sign.innerText = '-';
            r_sign.style.visibility = "hidden";
            visual.appendChild(r_sign);

        }


        // add a cat group for result here
        visual.appendChild(result_cats);

        addSubtVisualComponent.appendChild(visual);

        this.#container = addSubtVisualComponent;

        el.appendChild(addSubtVisualComponent);

    }
    // make sure this doesn't exceed the width of the span above
    addExplanation(exp) {
        var explain = document.createElement('p');
        explain.className = "AddSubtExplanation";
        explain.innerText = exp;
        this.#container.appendChild(explain);

    }
}

global.AddSubtVisual = global.AddSubtVisual || AddSubtVisual


// 3. MATRIX-SCALAR MULTIPLICATION
class MatrixScalarMultiplicationVisual {
    #scalar;
    #rows;
    #cols;
    #vals;
    #clicks;
    #results;
    constructor(scalar, mat_rows, mat_cols, mat_vals = null) {
        this.#scalar = scalar;
        this.#rows = mat_rows;
        this.#cols = mat_cols;
        this.#vals = mat_vals;
        this.#clicks = 0;

        if (this.#vals == null) {
            this.#vals = this.#generateRandomMatrixValues(this.#rows, this.#cols);
        }

        this.#results = this.#calculateMatrixScalarResults(this.#scalar, this.#rows, this.#cols, this.#vals);

    }

    #generateRandomMatrixValues(r,c){
        var ret = []
        for(let i = 0; i<(r*c); i++){
            ret.push(i);
        }
        return ret;
    }

    //  here vals is just a list of numbers
    #generateMatrix(row,col,vals,res=false){
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
                element_text.style.visibility = "hidden";
            }
            element.appendChild(element_text);
            element.className = 'matrix-element';

            matrix.appendChild(element);
        }
        return matrix;

    }

    #calculateMatrixScalarResults(s,r,c,vals){
        var ret = []
        for(let i = 0; i<(r*c); i++){
            ret.push(vals[i]*s);
        }
        return ret;
    
    }

    #changeBackgrounds(c,el){
        for(let i = 0; i < el.length; i++){
            if(i == c){
                el[i].style.backgroundColor = "#C0EAFA";
            }
            else{
                el[i].style.backgroundColor = "white";
            }
        }
    
    }

    #updateHeader(el,scalar,num,end=false){
        if(end){
            el.innerText = "Finished Multiplying!"
    
        }
        else{
            el.innerText = scalar + " x " + num;
        }
        el.style.visibility = "visible";
    }

    makeVisual(el) {
        var mat_container = document.createElement('div');
        mat_container.className = "MatrixScalarVisual";

        var scalar = document.createElement('h3');
        scalar.innerText = this.#scalar;
        scalar.className = "MatrixScalar";

        var mult_sign = document.createElement('h3');
        mult_sign.innerText = "x";
        mult_sign.className = "ScalarMultSign";

        var eq_sign = document.createElement('h3');
        eq_sign.innerText = "=";
        eq_sign.className = "ScalarMultSign";

        var matrix_div = document.createElement('div');
        matrix_div.className = "MatrixDiv";
        var matrix = this.#generateMatrix(this.#rows, this.#cols, this.#vals);
        matrix_div.appendChild(matrix);

        var r_matrix_div = document.createElement('div');
        r_matrix_div.className = "MatrixDiv";
        var r_matrix = this.#generateMatrix(this.#rows, this.#cols, this.#results, true);
        r_matrix_div.appendChild(r_matrix);

        var next_step = document.createElement("input");
        next_step.setAttribute("type", "submit");
        next_step.setAttribute("value", "Next Step");
        next_step.className = "next-button";

        var header = document.createElement('h3');
        header.className = "MainMatrixHeader";
        header.innerText = "Placeholder";
        next_step.addEventListener('click', (e) => {
            if (this.#clicks > this.#rows * this.#cols - 1) {
                alert("Cogratulations, you reviewed all the steps!");
                this.#changeBackgrounds(this.#clicks, r_matrix_div.firstChild.children);
                this.#changeBackgrounds(this.#clicks, matrix_div.firstChild.children);

                // print finished since steps are over now!
                this.#updateHeader(header, null, null, true);
                this.#clicks = 0;
                return;
            }

            var res_mat_text = r_matrix_div.firstChild.children[this.#clicks].firstChild;

            res_mat_text.style.visibility = "visible";
            this.#changeBackgrounds(this.#clicks, r_matrix_div.firstChild.children);
            this.#changeBackgrounds(this.#clicks, matrix_div.firstChild.children);
            this.#updateHeader(header, this.#scalar, this.#vals[this.#clicks]);

            this.#clicks += 1;

        });


        // result matrix
        var matScalarContainer = document.createElement('div');
        matScalarContainer.className = "MainMatContainer";

        mat_container.appendChild(scalar);
        mat_container.appendChild(mult_sign);
        mat_container.appendChild(matrix_div);
        mat_container.appendChild(eq_sign);
        mat_container.appendChild(r_matrix_div);

        matScalarContainer.appendChild(header);
        matScalarContainer.appendChild(mat_container);
        matScalarContainer.appendChild(next_step);
        el.appendChild(matScalarContainer);
    }
}

global.MatrixScalarMultiplicationVisual = global.MatrixScalarMultiplicationVisual || MatrixScalarMultiplicationVisual


// 4. MATRIX-MATRIX MULTIPLICATION
class MatrixMatrixMultiplication {
    #dims1;
    #dims2;
    #vals1;
    #vals2;
    #clicks;
    #result;
    constructor(dims1, dims2, vals1, vals2) {
        this.#dims1 = dims1;
        this.#dims2 = dims2;
        this.#vals1 = vals1;
        this.#vals2 = vals2;
        this.#clicks = 0;

        // cols of 1st should eq. rows of 2nd
        if (this.#dims1[1] != this.#dims2[0]) {
            alert("Invalid Dimensions: the number of columns in the first matrix must be equal to the number of rows in the second matrix!");
            return;
        }

        this.#result = this.#matrixMatrixResult(this.#dims1, this.#dims2, this.#vals1, this.#vals2);

    }
    
    // this has vals as [[1,2,3], [4,5,6], ....] -> a list for each row
    #generateMatrix(row,col,vals,res=false){
        var matrix = document.createElement('div');
        matrix.className = "matrix";
        matrix.style.setProperty('--matrix-rows', row);
        matrix.style.setProperty('--matrix-cols', col);
        for(let i = 0; i<row; i++){
            for(let j = 0; j<col; j++){
                var element = document.createElement('div');
            
                var element_text = document.createElement('div');
                element_text.id = "test"
                

                element_text.innerText = vals[i][j];
                element_text.className = "matrix-text"
                if(res){
                    element_text.style.visibility = "hidden";
                }
                element.appendChild(element_text);
                element.className = 'matrix-element';

                matrix.appendChild(element);

            }
        
        }
        return matrix;

    }

    #updateMatMatHeader(el,dims1,dims2,vals1,vals2,row,col){
        var total_str = "";
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
    
        for(let i = 0; i < dims1[1]-1; i++){
            total_str += vals1[row][i];
            total_str += "x"
            total_str += vals2[i][col];
            total_str += " + "
        }
        total_str += vals1[row][dims1[1]-1];
        total_str += "x"
        total_str += vals2[dims2[0]-1][col];
    
    
        el.innerText = row_str + " . " + col_str + " = " + total_str;
        el.style.visibility = "visible";
    
    
    }

    #updateHeader(el,scalar,num,end=false){
        if(end){
            el.innerText = "Finished Multiplying!"
    
        }
        else{
            el.innerText = scalar + " x " + num;
        }
        el.style.visibility = "visible";
    }

    #matMatHighlight(row,col,dims1,dims2,mat1,mat2){
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

    #changeBackgrounds(c,el){
        for(let i = 0; i < el.length; i++){
            if(i == c){
                el[i].style.backgroundColor = "#C0EAFA";
            }
            else{
                el[i].style.backgroundColor = "white";
            }
        }
    
    }

    #matrixMatrixResult(dims1, dims2, vals1, vals2){
        // calculate the result
        var res = []
        var temp = []
        temp.fill(0,dims2[1]);
        res.fill(temp,dims1[0]);
    
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
        return res;
    }


    makeVisual(el) {

        // check for valid calculation
        if (this.#dims1[1] != this.#dims2[0]) {
            alert("Invalid Dimensions: the number of columns in the first matrix must be equal to the number of rows in the second matrix!");
            return;
        }

        var matMatContainer = document.createElement('div');
        matMatContainer.className = "MainMatContainer";

        var header = document.createElement('h3');
        header.className = "MainMatrixHeader";
        header.innerText = "Placeholder";

        var mat_container = document.createElement('div');
        mat_container.className = "MatrixMatrixVisual";

        var matrix_div_one = document.createElement('div');
        matrix_div_one.className = "MatrixDiv";
        var matrix_one = this.#generateMatrix(this.#dims1[0], this.#dims1[1], this.#vals1);
        matrix_div_one.appendChild(matrix_one);

        var mult_sign = document.createElement('h3');
        mult_sign.innerText = "x";
        mult_sign.className = "ScalarMultSign";

        var matrix_div_two = document.createElement('div');
        matrix_div_two.className = "MatrixDiv";
        var matrix_two = this.#generateMatrix(this.#dims2[0], this.#dims2[1], this.#vals2);
        matrix_div_two.appendChild(matrix_two);

        var eq_sign = document.createElement('h3');
        eq_sign.innerText = "=";
        eq_sign.className = "ScalarMultSign";

        var matrix_div_three = document.createElement('div');
        matrix_div_three.className = "MatrixDiv";
        var matrix_three = this.#generateMatrix(this.#dims1[0], this.#dims2[1], this.#result, true);
        matrix_div_three.appendChild(matrix_three);

        var next_step = document.createElement("input");
        next_step.setAttribute("type", "submit");
        next_step.setAttribute("value", "Next Step");
        next_step.className = "next-button";

        var prev_step = document.createElement("input");
        prev_step.setAttribute("type", "submit");
        prev_step.setAttribute("value", "Prev Step");
        prev_step.className = "next-button";

        mat_container.appendChild(matrix_div_one);
        mat_container.appendChild(mult_sign);
        mat_container.appendChild(matrix_div_two);
        mat_container.appendChild(eq_sign);
        mat_container.appendChild(matrix_div_three);

        matMatContainer.appendChild(header);
        matMatContainer.appendChild(mat_container);
        matMatContainer.appendChild(prev_step);
        matMatContainer.appendChild(next_step);

        el.appendChild(matMatContainer);

        var row = 0;
        var col = 0;
        

        next_step.addEventListener('click', (e) => {
            if (this.#clicks > this.#dims1[0] * this.#dims2[1] - 1) {
                alert("Cogratulations, you reviewed all the steps!");
                row += 1;
                col += 1;
                this.#changeBackgrounds(this.#clicks, matrix_div_three.firstChild.children);
                this.#matMatHighlight(row, col, this.#dims1, this.#dims2, matrix_div_one, matrix_div_two);
                this.#updateHeader(header, null, null, true);

                // reset
                row = 0;
                col = 0;
                this.#clicks = 0;

                return;
            }

            // 1. make numbers visible one by one
            var res_mat_text = matrix_div_three.firstChild.children[this.#clicks].firstChild;
            res_mat_text.style.visibility = "visible";

            // 2. update header
            if (this.#clicks != 0) {
                if (this.#clicks % this.#dims2[1] == 0) {
                    row += 1;
                    col = 0;
                }
                else {
                    col += 1;
                }
            }

            this.#updateMatMatHeader(header, this.#dims1, this.#dims2, this.#vals1, this.#vals2, row, col);

            this.#changeBackgrounds(this.#clicks, matrix_div_three.firstChild.children);

            // 3. update highlighting: highlight row of first matrix, col of second
            this.#matMatHighlight(row, col, this.#dims1, this.#dims2, matrix_div_one, matrix_div_two);

            this.#clicks += 1;

        });

        prev_step.addEventListener('click', (e) => {
            // if first step, do nothing 
            if(this.#clicks == 0){
                console.log("clicks value: ", this.#clicks);
                return;
            }

            if(this.#clicks == 1){
                alert("You are at the first step!");
                return;
            }

            if (this.#clicks != 0) {
                if (col != 0) {
                    col -= 1;
                }
                else if(col == 0){
                    col = this.#dims2[1]-1;
                    row -= 1;
                }
            }

            this.#clicks -= 1;
            console.log("clicks value: ", this.#clicks);

            this.#updateMatMatHeader(header, this.#dims1, this.#dims2, this.#vals1, this.#vals2, row, col);

            this.#changeBackgrounds(this.#clicks-1, matrix_div_three.firstChild.children);

            // 3. update highlighting: highlight row of first matrix, col of second
            this.#matMatHighlight(row, col, this.#dims1, this.#dims2, matrix_div_one, matrix_div_two);

        })


    }
}

global.MatrixMatrixMultiplication = global.MatrixMatrixMultiplication || MatrixMatrixMultiplication


// 5. DIVISION VISUAL
class DivisionVisual {
    #divisor;
    #dividend;
    #uid;
    #blocks;
    #bins;
    #counts;
    #bin_counts;
    #division_header_text;
    constructor(d1, d2, uid) {
        this.#divisor = d2;
        this.#dividend = d1;
        this.#uid = uid;
        this.#blocks = [];
        this.#bins = [];
        this.#counts = [];
        this.#bin_counts = [];
        this.#division_header_text = "Drag and drop " + this.#dividend + " candies EQUALLY into " + this.#divisor + " boxes!"
        
        // initialise the counts of all the bins
        for(var i = 0; i < this.#divisor; i++){
            this.#bin_counts.push(0)
        }
        // last element holds remainder count
        this.#bin_counts.push(this.#dividend)

    }

    customiseHeader(el, new_header){
        // get it through id and alter innertext
        var header = el.getElementsByClassName("division-visual-header")[0];
        this.#division_header_text = new_header;
        header.innerText = new_header;
    }

    makeVisual(el){

        var divisionVisualComponent = document.createElement("div");
        // drop blocks anywhere in the div
        divisionVisualComponent.setAttribute("droppable", true);
        // divisionVisualComponent.addEventListener("drop", dropOutside);
        divisionVisualComponent.addEventListener("dragenter", dragEnter)
        divisionVisualComponent.addEventListener("dragleave", dragLeave)
        divisionVisualComponent.addEventListener("dragover", dragOver)

        divisionVisualComponent.className = "division-visual-component"

        // problem description header -- note: this is customisable
        var division_header = document.createElement("h3");
        division_header.className = "division-visual-header"
        division_header.innerText = this.#division_header_text;
        divisionVisualComponent.appendChild(division_header);

        // remainder heading
        var division_remainder_header = document.createElement("h4");
        division_remainder_header.className = "division-visual-remainder"
        division_remainder_header.innerText = "Remainder: " + this.#bin_counts[this.#divisor];
        divisionVisualComponent.appendChild(division_remainder_header);



        // create dividend number of colorful blocks
        // note that each block has a unique id for dragging it
        var block_group = document.createElement('div');
        block_group.className = "division-visual-block-group"
        for(var i = 0; i < this.#dividend; i++){
            var block_id = this.#uid + "-block-" + i
            console.log("block id: ", block_id)
            var block = document.createElement('div');
            block.className = "division-visual-block";
            block.id = block_id
            block.setAttribute("draggable", true);
            
            block.addEventListener('dragstart', dragStart);

            this.#blocks.push(block)
            block_group.appendChild(block)
        }
        // note: the height of the blockgroup is set here to avoid an increment/decrement in overall size
        var block_group_height = (Math.ceil(this.#dividend/12) * 40) + "px";
        block_group.style.height = block_group_height;
        divisionVisualComponent.appendChild(block_group)

        // create divisor number of bins
        var bin_group = document.createElement("div");
        bin_group.className = "division-visual-bin-group"
        for(var i = 0; i < this.#divisor; i++){
            var bin = document.createElement('div');
            var bin_id = this.#uid + "-bin-" + i
            bin.className = "division-visual-bin";
            bin.id = bin_id;
            bin.setAttribute("droppable", true);
            this.#bins.push(bin)
            bin_group.appendChild(bin)
        }
        // avoiding bin group spillover
        var bin_group_height = (Math.ceil(this.#dividend/12) * 50) + "px";
        bin_group.style.minHeight = bin_group_height;


        divisionVisualComponent.appendChild(bin_group);

        // counter group
        var count_group = document.createElement("div");
        count_group.className = "division-visual-count-group"
        for(var i = 0; i < this.#divisor; i++){
            // count for bin
            var count_header = document.createElement("h3");
            count_header.innerText = this.#bin_counts[i];
            count_header.className = 'division-visual-bin-count'

            var count_id = this.#uid + "-count-" + i
            count_header.className = "division-visual-count";
            count_header.id = count_id;
            this.#counts.push(count_header)
            count_group.appendChild(count_header)
        }
        divisionVisualComponent.appendChild(count_group);

        // adding drop listeners to the bins
        for(var i = 0; i < this.#bins.length; i++){
            this.#bins[i].addEventListener("dragenter", dragEnter)
            this.#bins[i].addEventListener("dragleave", dragLeave)
            this.#bins[i].addEventListener("dragover", dragOver)
            this.#bins[i].addEventListener('drop', (e) => {

                // retrieve id
                var block_id = e.dataTransfer.getData('text/plain');
                var dragged_block = document.getElementById(block_id);

                // check if it's in any other bin, if so, remove it!!!
                var in_other_bin = false;
                for(var i = 0; i < this.#bins.length; i++){
                    if(this.#bins[i] != e.target){
                        // go over children 
                        var children = this.#bins[i].children
                        for(var j = 0; j < children.length; j++){

                            if(children[j] == dragged_block){
                                this.#bin_counts[i] -= 1;
                                this.#counts[i].innerText = this.#bin_counts[i];
                                this.#bins[i].removeChild(children[j]);
                                in_other_bin = true;

                                // if correct division, apply success border
                                if(this.#bin_counts[i] == Math.floor(this.#dividend/this.#divisor)){
                                    e.preventDefault();
                                    this.#bins[i].classList.add("division-success")
                                }
                                else if (this.#bins[i].classList.contains('division-success')){
                                    e.preventDefault();
                                    this.#bins[i].classList.remove("division-success")
                                }
                                break;
                            }
                        }
                    }
                }


                // check if already in the bin
                for(var i = 0; i < e.target.children.length; i++){
                    if(e.target.children[i] == dragged_block){
                        // movement within the block, do nothing
                        dragged_block.classList.remove('hide');
                        return;
                    }
                }

                // update remainder
                if(!in_other_bin){
                    this.#bin_counts[this.#divisor] -= 1;
                    division_remainder_header.innerText = "Remainder: " + this.#bin_counts[this.#divisor]
                }

                // add block into the bin div
                e.target.appendChild(dragged_block)
                // show the block again
                dragged_block.classList.remove('hide');

                // add 1 to the count
                for(var i = 0; i < this.#bins.length; i++){
                    if(this.#bins[i].id == e.target.id){
                        this.#bin_counts[i] += 1;
                        this.#counts[i].innerText = this.#bin_counts[i];
                        console.log("counts update bin drop: ", this.#bin_counts);

                        if(this.#bin_counts[i] == Math.floor(this.#dividend/this.#divisor)){
                            e.preventDefault();
                            e.target.classList.add("division-success")
                        }
                        else if (this.#bins[i].classList.contains('division-success')){
                            e.preventDefault();
                            this.#bins[i].classList.remove("division-success")
                        }

                        return;
                    }
                }

                })
        }

        // append everything to the division visual div
        // append that to el
        var count = document.createElement('div')
        count.id = "count";
        el.appendChild(divisionVisualComponent);

        // event listening functions for blocks and bins
        function dragStart(e) {
            // store the id of the block we picked up
            e.dataTransfer.setData('text/plain', e.target.id);
            // make sure the block doesnt disappear when touched
            setTimeout(() => {
                e.target.classList.add('hide');
            }, 0);
           
        }

        function dragEnter(e){
            e.preventDefault();
        }
        function dragLeave(e){
            return;
        }
        function dragOver(e){
            e.preventDefault();
            return;
        }

        divisionVisualComponent.addEventListener('drop', (e) => {
            e.preventDefault();
            console.log("event target ", e.target);
            // make sure the drop is outside and NOT inside the bins
            if(e.target.className == 'division-visual-bin' || e.target.className == 'division-visual-bin division-success'){
                return;
            }

            // if target is another block and it's already outside, do nothing
            if(e.target.className == 'division-visual-block' && e.target.parentElement.className == "division-visual-component"){
                return;
            }

            // if we inserted it on top of a block, put it in the block's parent element instead
            if(e.target.className == 'division-visual-block'){
                var parent = e.target.parentElement
                if(parent.className == 'division-visual-bin'){
                    // we're going to add the element to the parent element i.e; the bin instead
                    // retrieve id
                    var block_id = e.dataTransfer.getData('text/plain');
                    var dragged_block = document.getElementById(block_id);

                    // check if already in the bin
                    for(var i = 0; i < e.target.children.length; i++){
                        if(parent.children[i] == dragged_block){
                            // movement within the block, do nothing
                            dragged_block.classList.remove('hide');
                            return;
                        }
                    }
                    

                    // add block into the bin div
                    parent.appendChild(dragged_block)
                    // show the block again
                    dragged_block.classList.remove('hide');

                    // update remainder
                    this.#bin_counts[this.#divisor] -= 1;
                    console.log("remainder count: ", this.#bin_counts[this.#divisor])
                    division_remainder_header.innerText = "Remainder: " + this.#bin_counts[this.#divisor]

                    // add 1 to the count
                    for(var i = 0; i < this.#bins.length; i++){
                        if(this.#bins[i].id == parent.id){
                            this.#bin_counts[i] += 1;
                            this.#counts[i].innerText = this.#bin_counts[i];
                            console.log("counts update bin drop: ", this.#bin_counts);

                            if(this.#bin_counts[i] == Math.floor(this.#dividend/this.#divisor)){
                                e.preventDefault();
                                this.#bins[i].classList.add("division-success")
                            }
                            else if (this.#bins[i].classList.contains('division-success')){
                                e.preventDefault();
                                this.#bins[i].classList.remove("division-success")
                            }
                            return;
                        }
                    }
                    return;

                }

            }

            var block_id = e.dataTransfer.getData('text/plain');
            var dragged_block = document.getElementById(block_id);

            // show the block again
            dragged_block.classList.remove('hide');

            // if the block isnt outside, take it out from the bins and put it back outside
            for(var i = 0; i < this.#bins.length; i++){
                let children = this.#bins[i].children
                console.log("bin ", i, " ", children);
                for(var j=0; j < children.length; j++){
                    if(children[j] == dragged_block){
                        console.log("found block")
                        this.#bin_counts[i] -= 1;
                        this.#counts[i].innerText = this.#bin_counts[i];
                        this.#bins[i].removeChild(children[j]);

                        // update remainder
                    this.#bin_counts[this.#divisor] += 1;
                    console.log("remainder count: ", this.#bin_counts[this.#divisor])
                    division_remainder_header.innerText = "Remainder: " + this.#bin_counts[this.#divisor]

                        if(this.#bin_counts[i] == Math.floor(this.#dividend/this.#divisor)){
                            e.preventDefault();
                            this.#bins[i].classList.add("division-success")
                        }
                        else if (this.#bins[i].classList.contains('division-success')){
                            e.preventDefault();
                            this.#bins[i].classList.remove("division-success")
                        }

                        var block_grp = document.getElementsByClassName('division-visual-block-group')[0];
                        block_grp.appendChild(dragged_block);
                        return;
                    }
                }

            }


        })

    }
}

global.DivisionVisual = global.DivisionVisual || DivisionVisual

// 6. POINT PLOT VISUAL
class PointPlotVisual {
    #points;
    #ctx;
    constructor(){
        this.#points = []
        this.#ctx = null;
    }

    #initialiseGraph(ctx){
        // drawing the canvas graph
        ctx.strokeStyle = 'black';
        var padding = 20;
    
        // draw y axis
        ctx.beginPath();
        ctx.moveTo(152,0);
        ctx.lineTo(152,300);
        ctx.stroke();
        // draw x axis
        ctx.beginPath();
        ctx.moveTo(0,150);
        ctx.lineTo(300,150);
        ctx.stroke();
    
        // label graph
        ctx.font = "8pt Arial";
        ctx.fillStyle = "black";
        /* y axis labels */
        // ctx.fillText("Y-AXIS", 135, 12);
        ctx.fillText("5", 142, 28);
        ctx.fillText("4", 142, 53);
        ctx.fillText("3", 142, 78);
        ctx.fillText("2", 142, 103);
        ctx.fillText("1", 142, 128);
    
        ctx.fillText("-5", 139, 278);
        ctx.fillText("-4", 139, 253);
        ctx.fillText("-3", 139, 228);
        ctx.fillText("-2", 139, 203);
        ctx.fillText("-1", 139, 178);
    
        /* x axis labels */
        // ctx.fillText("X axis", 100, 160);
        ctx.fillText("1", 173, 147);
        ctx.fillText("2", 197, 147);
        ctx.fillText("3", 223, 147);
        ctx.fillText("4", 247, 147);
        ctx.fillText("5", 272, 147);
    
        ctx.fillText("-1", 120, 147);
        ctx.fillText("-2", 95, 147);
        ctx.fillText("-3", 70, 147);
        ctx.fillText("-4", 45, 147);
        ctx.fillText("-5", 20, 147);
    
        
    
    }

    #plotGraph(){
        // use this.#points to plot a line
        // [point1_x, point1_y, point2_x, point2_y]
        
        var ctx = this.#ctx
        ctx.clearRect(0, 0, 300, 300);
        this.#initialiseGraph(this.#ctx);

        ctx.strokeStyle = "blue";
        ctx.fillStyle = "blue";
        ctx.font = "6pt Arial";
        ctx.beginPath();
        // add rectangle for point and a label
        ctx.moveTo(this.#points[0]*25 + 150, 150 - this.#points[1]*25)
        ctx.fillRect(this.#points[0]*25 + 148,148 - this.#points[1]*25,5,5);

        ctx.lineTo(this.#points[2]*25 + 150, 150 - this.#points[3]*25)
        ctx.fillRect(this.#points[2]*25 + 148,148 - this.#points[3]*25,5,5);
        ctx.stroke();

        ctx.fillStyle = 'red'

        var p1_plotted = false;
        var p2_plotted = false;
        if(this.#points[0] == 5 || this.#points[2] == 5){
            if(this.#points[0] == 5){
                ctx.fillText("point 1", this.#points[0]*25 + 148, 146 - this.#points[1]*25);
                p1_plotted = true;
            }
            if(this.#points[2] == 5){
                ctx.fillText("point 2", this.#points[2]*25 + 148, 146 - this.#points[3]*25);
                p2_plotted = true;
            }
        }

        if(!p1_plotted){
            ctx.fillText("point 1", this.#points[0]*25 + 156, 146 - this.#points[1]*25);

        }
        
        if(!p2_plotted){
            ctx.fillText("point 2", this.#points[2]*25 + 156, 146 - this.#points[3]*25);
        }

    }

    makeVisual(el){

        var pointPlotComponent = document.createElement("div")
        pointPlotComponent.className = "point-plot-component"

        var pointSection = document.createElement("div")
        pointSection.className = "point-plot-point-section"
        var plotSection = document.createElement("div")
        plotSection.className = "point-plot-plot-section"

        // plot elements
        var plot_canv = document.createElement('canvas');
        plot_canv.className = "point-plot-plot-canvas";
        var ctx = plot_canv.getContext('2d');
        this.#ctx = ctx;

        
        plotSection.appendChild(plot_canv)

        // point elements
        var pick_points = document.createElement("h3")
        pick_points.innerText = "Pick Your Coordinates!"
        pick_points.className = "point-plot-pick-points"

        var points_form = document.createElement("form");
        points_form.className = "point-plot-points-form"
        
        // point 1 details
        var point_one_header = document.createElement("h4")
        point_one_header.innerText = "Point 1:"

        var point_one_span = document.createElement("span")
        point_one_span.className = "point-plot-point-span"

        var point_one_xlabel = document.createElement("h5")
        point_one_xlabel.innerText = "x: "

        point_one_span.appendChild(point_one_xlabel)

        var x_input = document.createElement("input")
        x_input.setAttribute("type", "text");
        x_input.setAttribute("placeholder", " -5 to 5 ");
        x_input.className = "point-plot-point-input"
        point_one_span.append(x_input);
        
        var point_one_ylabel = document.createElement("h5")
        point_one_ylabel.innerText = "y: "

        point_one_span.appendChild(point_one_ylabel)

        var y_input = document.createElement("input");
        y_input.setAttribute("type", "text");
        y_input.setAttribute("placeholder", " -5 to 5 ");
        y_input.className = "point-plot-point-input"
        point_one_span.append(y_input);

        points_form.appendChild(point_one_header)
        points_form.appendChild(point_one_span)

         // point 2 details
        var point_two_header = document.createElement("h4")
        point_two_header.innerText = "Point 2:"

        var point_two_span = document.createElement("span")
        point_two_span.className = "point-plot-point-span"

       
        var point_two_xlabel = document.createElement("h5")
        point_two_xlabel.innerText = "x: "

        point_two_span.appendChild(point_two_xlabel)

        var x_input = document.createElement("input")
        x_input.className = "point-plot-point-input"
        x_input.setAttribute("type", "text");
        x_input.setAttribute("placeholder", " -5 to 5 ");
        point_two_span.append(x_input);
        
        var point_two_ylabel = document.createElement("h5")
        point_two_ylabel.innerText = "y: "
        point_two_span.appendChild(point_two_ylabel)

        var y_input = document.createElement("input");
        y_input.setAttribute("type", "text");
        y_input.setAttribute("placeholder", " -5 to 5 ");
        y_input.className = "point-plot-point-input"
        point_two_span.append(y_input);

        points_form.appendChild(point_two_header)
        points_form.appendChild(point_two_span)

        var submit_btn = document.createElement("input");
        submit_btn.setAttribute("type", "submit");
        submit_btn.setAttribute("value", "Submit");
        submit_btn.className = "point-plot-submit-btn"

        points_form.appendChild(submit_btn)


        pointSection.appendChild(pick_points)
        pointSection.appendChild(points_form)

        // add both sections to main plot component
        pointPlotComponent.appendChild(pointSection)
        pointPlotComponent.appendChild(plotSection)

        el.appendChild(pointPlotComponent)

        // take user input and keep it 
        points_form.addEventListener('submit', (e) => {
            e.preventDefault();
            // clear state
            this.#points = [];
            // points_data and this.#points has: [point1_x, point1_y, point2_x, point2_y]
            var points_data = points_form.getElementsByClassName('point-plot-point-input');
            for(var i = 0; i < points_data.length; i++){
                if(points_data[i].value == ""){
                    alert("Please fill out all the coordinates!");
                    return;
                }
                if(parseInt(points_data[i].value) > 5 || parseInt(points_data[i].value) < -5){
                    alert("Please enter coordinates between -5 and 5!");
                    return;
                }
                this.#points.push(parseInt(points_data[i].value));
            }
            this.#plotGraph();
        })

        // ctx lines were blurry, i used this solution: https://stackoverflow.com/questions/8696631/canvas-drawings-like-lines-are-blurry
        
        // initialise graph by drawing axes
        var size = 300;
        var scale = window.devicePixelRatio; 
        plot_canv.width = size * scale;
        plot_canv.height = size * scale;

        // Normalize coordinate system to use css pixels.
        this.#ctx.scale(scale, scale);
        // initialise graph axes
        this.#initialiseGraph(this.#ctx);

    }
}

global.PointPlotVisual = global.PointPlotVisual || PointPlotVisual

// 7. MULTIPLICATION VISUAL
class MultiplicationVisual {
    #num1;
    #num2;
    #elements;
    constructor(num1, num2){
        this.#num1 = num1;
        this.#num2 = num2;
        this.#elements = [];
    }

    updateDescription(new_desc){
        var desc = document.getElementsByClassName('multiplication-visual-description')[0]
        desc.innerText = new_desc;
        
    }

    makeVisual(el){
        var multiplicationVisualComponent = document.createElement("div")
        multiplicationVisualComponent.className = "multiplication-visual-component"

        var multiplication_problem_header = document.createElement("h2");
        multiplication_problem_header.className = "multiplication-visual-problem-header"
        multiplication_problem_header.innerText = this.#num1 + " x " + this.#num2;

        var multiplication_problem_description = document.createElement("h3");
        multiplication_problem_description.className = "multiplication-visual-problem-desc"
        multiplication_problem_description.innerText = this.#num1 + " groups of " + this.#num2;

        multiplicationVisualComponent.appendChild(multiplication_problem_header)
        multiplicationVisualComponent.appendChild(multiplication_problem_description)
        

        // we'll have this.#num1 divs with this.#num2 elements inside it
        // package that entire thing into one div
        // package that inside the larger calculation div

        var multiplication_visuals = document.createElement("div")
        multiplication_visuals.className = "multiplication-visual-visuals"

        var multiplication_groups = document.createElement("div")
        multiplication_groups.className = "multiplication-visual-groups"

        // within this, we have this.#nums1 number of divs with this.#nums2 elements inside each one
        for(var i = 0; i < this.#num1; i++){
            var multiplication_group = document.createElement("div");
            multiplication_group.className = "multiplication-visual-multiplication-group"

            var group_div = document.createElement("div")
            group_div.className = "multiplication-visual-group"
            // i wanted to randomise pastel colors, used this result: https://stackoverflow.com/questions/43193341/how-to-generate-random-pastel-or-brighter-color-in-javascript
            function getColor(){ 
                return "hsl(" + 360 * Math.random() + ',' +
                           (25 + 70 * Math.random()) + '%,' + 
                           (85 + 10 * Math.random()) + '%)'
            }
            var element_color = getColor();

            for(var j = 0; j < this.#num2; j++){
                var element = document.createElement("div")
                element.className = "multiplication-visual-element"
                element.style.backgroundColor = element_color;
                group_div.appendChild(element)
                this.#elements.push(element)
            }

            var group_header = document.createElement("h4")
            group_header.innerText = this.#num2
            group_header.className = "multiplication-visual-group-header"

            multiplication_group.appendChild(group_header);
            multiplication_group.appendChild(group_div);

            multiplication_groups.appendChild(multiplication_group)
        }

        var multiplication_equals = document.createElement("button")
        multiplication_equals.innerText = "="
        multiplication_equals.className = "multiplication-visual-equals"

        var multiplication_result_parent = document.createElement("div")
        multiplication_result_parent.className = "multiplication-result-parent"

        var multiplication_result = document.createElement("div")

        var multiplication_result_header = document.createElement("h4")
        multiplication_result_header.className = "multiplication-result-header"
        multiplication_result_header.innerText = this.#num1*this.#num2


        for(var i = 0; i < this.#num1*this.#num2; i++){
            var element = document.createElement("div")
            element.className = "multiplication-visual-element"
            element.style.backgroundColor = this.#elements[i].style.backgroundColor;
            multiplication_result.appendChild(element)
        }
        multiplication_result.className = "multiplication-visuals-result"

        multiplication_result_parent.appendChild(multiplication_result_header)
        multiplication_result_parent.appendChild(multiplication_result)

        multiplication_equals.addEventListener('click', (e) => {
            if(multiplication_result.classList.contains("visible_results")){
                multiplication_result.classList.remove("visible_results")
                multiplication_result_header.classList.remove("visible_results")
                multiplication_result.classList.remove("animate")
                multiplication_result_header.classList.remove("animate")
                return;

            }
            multiplication_result.classList.add("visible_results")
            multiplication_result_header.classList.add("visible_results")
            multiplication_result.classList.add("animate")
            multiplication_result_header.classList.add("animate")
        })

        multiplication_visuals.appendChild(multiplication_groups)
        multiplication_visuals.appendChild(multiplication_equals)
        multiplication_visuals.appendChild(multiplication_result_parent)
        multiplicationVisualComponent.appendChild(multiplication_visuals)

        var multiplication_visual_description = document.createElement("h4")
        multiplication_visual_description.className = "multiplication-visual-description"
        multiplication_visual_description.innerText = "Add up all the groups together!"

        multiplicationVisualComponent.appendChild(multiplication_visual_description)


        el.appendChild(multiplicationVisualComponent)

    }
}

global.MultiplicationVisual = global.MultiplicationVisual || MultiplicationVisual

})(window, window.document, $);
