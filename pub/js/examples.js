// This is where we show usecases of our library
"use strict";

// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');

const check = new FractionVisual(3,4,"#F8C8DC");
check.makeFractionVisual();

// const check3 = new FractionVisual(3,7,"#C4D8F3");
// check3.makeFractionVisual();

// makeCatGroup(5);
// makeCatGroup(5);

const check2 = new AddSubtVisualisation([2,4],false);
check2.makeVisual();
check2.addExplanation("when you have 2 and take away 4, you have negative 2 left")
// deal w negatives
// const check3 = new AddSubtVisualisation([2,4],false);
// check3.makeVisual();

const check4 = new MatrixScalarMultiplication(2,3,3,[1,2,3,4,1,2,3,4,5]);
check4.makeVisual();