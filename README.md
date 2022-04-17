# MathViz.js: A Mathematics Visualisation Library
Link to the library's website: https://math-viz-js.herokuapp.com

## Getting Started

### Set Up and Load
MathViz.js depends on jQuery 3.6.0. Take a look at Google Developers' Hosted Libraries page for the recommended copy!
The first (and only!) step to loading this library is to add in the scripts for jQuery and MathViz.js and it's stylesheet to your HTML file as shown below.
Remember: Order matters!

```
<!-- jquery script -->

<script defer src = "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js" ></script>
<!-- MathViz.js library script -->

<script defer type = "text/javascript" src = "/path/to/MathViz.js" ></script>
<!-- MathViz.js stylesheet -->

<link rel = "stylesheet" href = "/path/to/mathviz-styles.css">
```

### Basic Usage

There are three simple steps to using this library:

1. Create the <div> element you want the MathViz.js visualisation to be in. We prefer giving this parent element a unique ID!

2. In your corresponding javascript file, use your preferred element-selecting method to select this parent element.

3. Instantiate a new instance of the MathViz.js visualisation of your choice and pass in the parent element as a parameter.

The example code demonstrates our Multiplication visualisation.
  
  HTML
  
  ```
<div id="multiplicationDemoVisual">
<!-- add visual here -->
</div>
  ```
  
  JS
  ```
const multiplicationDiv = document.querySelector( '#multiplicationDemoVisual')
const multVisual = new MultiplicationVisual(2,3); multVisual.makeVisual(multiplicationDiv);
  ```
  
  Head over to our [Named Link](https://math-viz-js.herokuapp.com/api.html "API") to explore more!
