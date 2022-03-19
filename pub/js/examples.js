// This is where we show usecases of our library
"use strict";

// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');

const frac = new FractionVisual(3,6,"#F8C8DC");
const fracDiv = document.querySelector('#fracDemoVisual');
frac.makeFractionVisual(fracDiv);

const frac1 = new FractionVisual(3,7,"#BDB0D0");
const fracDiv1 = document.querySelector('#fracDemoVisual1');
frac1.makeFractionVisual(fracDiv1);

const frac2 = new FractionVisual(3,8,"#D7F4D2");
const fracDiv2 = document.querySelector('#fracDemoVisual2');
frac2.makeFractionVisual(fracDiv2);

// // const check3 = new FractionVisual(3,7,"#C4D8F3");
// // check3.makeFractionVisual();

// // makeCatGroup(5);
// // makeCatGroup(5);
const subtDiv = document.querySelector('#addSubtDemoVisual');
const check2 = new AddSubtVisualisation([4,2],false);
check2.makeVisual(subtDiv);
check2.addExplanation("when you have 4 and 2 leave, 2 are left");
// // deal w negatives
// // const check3 = new AddSubtVisualisation([2,4],false);
// // check3.makeVisual();
const addDiv = document.querySelector('#addSubtDemoVisual2');
const addVisual = new AddSubtVisualisation([2,5],true,false);
addVisual.makeVisual(addDiv);
addVisual.addExplanation("Count up from 2 five times: 2..3..4..5..6..7 !")

const matScalDiv = document.querySelector('#matrixScalarDemoVisual');
const matScalVisual = new MatrixScalarMultiplication(2,3,3,[1,2,3,4,1,2,3,4,5]);
matScalVisual.makeVisual(matScalDiv);

const matMatDiv = document.querySelector('#matrixMatrixDemoVisual');
const matMatVisual = new MatrixMatrixMultiplication([2,3], [3,2], [[1,2,3],
    [4 ,5,6]], [[7,8],[9,10],[11,12]])
matMatVisual.makeVisual(matMatDiv);
