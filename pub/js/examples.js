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

const check2 = new AddSubtVisualisation([4,2],true);
check2.makeVisual();