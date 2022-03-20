// This is where we show usecases of our library
"use strict";

const frac = new FractionVisual(3,6,"#F8C8DC");
const fracDiv = document.querySelector('#fracDemoVisual');
frac.makeFractionVisual(fracDiv);

const frac1 = new FractionVisual(3,7,"#BDB0D0");
const fracDiv1 = document.querySelector('#fracDemoVisual1');
frac1.makeFractionVisual(fracDiv1);

const frac2 = new FractionVisual(3,8,"#D7F4D2");
const fracDiv2 = document.querySelector('#fracDemoVisual2');
frac2.makeFractionVisual(fracDiv2);

const subtDiv = document.querySelector('#addSubtDemoVisual');
const subtVisual = new AddSubtVisual([4,2],false,false);
subtVisual.makeVisual(subtDiv);
subtVisual.addExplanation("when you have 4 and 2 leave, 2 are left");


const addDiv = document.querySelector('#addSubtDemoVisual2');
const addVisual = new AddSubtVisual([3,5],true,true);
addVisual.makeVisual(addDiv);
addVisual.addExplanation("Count up from 3 five times: 3..4..5..6..7..8 !")

const matScalDiv = document.querySelector('#matrixScalarDemoVisual');
const matScalVisual = new MatrixScalarMultiplicationVisual(2,3,3,[1,2,3,4,1,2,3,4,5]);
matScalVisual.makeVisual(matScalDiv);

const matMatDiv = document.querySelector('#matrixMatrixDemoVisual');
const matMatVisual = new MatrixMatrixMultiplication([2,3], [3,2], [[1,2,3],
    [4 ,5,6]], [[7,8],[9,10],[11,12]])
matMatVisual.makeVisual(matMatDiv);