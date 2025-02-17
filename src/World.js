// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
//Assignment grader notes: Most code based off of Professor's walkthrough videos. ChatGPT sometimes helped me debug, get unstuck with my code, and learn new stuff for my code. I made comments in my code indicating where it was used. Also recieved small help from course tutor.

var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() { 
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`
//where pointsize changes the size of the squares.


// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -2){
      gl_FragColor = u_FragColor;     //use color
    }
    else if (u_whichTexture == -1){   //use UV debug color
      gl_FragColor = vec4(v_UV, 1.0, 1.0);
    }
    else if (u_whichTexture == 0){      //use texture
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    }
    else if (u_whichTexture == 1){
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    }
    else{   
      gl_FragColor = vec4(1, 0.2, 0.4, 1);
    }
  }`

//Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_whichTexture;

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.enable(gl.DEPTH_TEST); //Depth buffer will keep track of whats in front of something else.

}

function connectVariablesToGLSL(){

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // // Get the storage location of a_Position
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if(!u_ModelMatrix){
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if(!u_GlobalRotateMatrix){
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if(!u_ViewMatrix){
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if(!u_ProjectionMatrix){
    console.log('Failed to get the storage location of u_ProjectionMatrix')
    return
  }

  // Get the storage location of u_Sampler
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture){
    console.log('Failed to get the storage location of u_whichTexture');
    return false;
  }

  // Set an initial value for this matrix to identify
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

  gl.uniformMatrix4fv(u_ProjectionMatrix, false, identityM.elements); 
  gl.uniformMatrix4fv(u_ViewMatrix, false, identityM.elements);   //If professor's guides make things dissapear, probably forgot to initialize something. 
}


// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;


// Globals related to UI elements
let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize = 5;
let g_selectedType=POINT;
let g_globalAngle = 0;
let g_globalAngleY = 0;
let g_yellowAngle = 0;
let g_yellowAngleRight = 0;
let g_yellowAnimation=false;
let mouse_x = 0;
let mouse_y = 0;
let g_wattleAnimation = false;
let g_wattleAnimationrock = 0;

function addActionForHTMLUI(){
  //Button Events
  document.getElementById('animationYellowOffButton').onclick = function() {g_yellowAnimation=false;};
  document.getElementById('animationYellowOnButton').onclick = function() {g_yellowAnimation=true;};

  document.getElementById('angleSlide').addEventListener('input', function() {
    g_globalAngle = this.value; 
    renderAllShapes(); 
  });  
 
canvas.addEventListener('mousedown', function(ev) {
  canvas.addEventListener('mousemove', mouseMoveHandler);
});

function mouseMoveHandler(ev) {
  // Calculate movement delta
  let X = ev.clientX - mouse_x;
  let Y = ev.clientY - mouse_y;
  
  g_globalAngle += X * 0.3; 
  g_globalAngleY += Y * 0.3;
  
  mouse_x = ev.clientX;
  mouse_y = ev.clientY;
  
  renderAllShapes(); 
}

canvas.addEventListener('mouseup', function(ev) {
  canvas.removeEventListener('mousemove', mouseMoveHandler);
});
}

function initTextures() {
  var image = new Image();   // Create a texture object
  var image2 = new Image();
  var image3 = new Image();
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }

  if (!image2) {
    console.log('Failed to create the image2 object');
    return false;
  }

  image.onload = function(){ sendTextureToGLSL(image,0); };
  
  image.src = '../images/sky.jpg';


  image2.onload = function(){ sendTextureToGLSL(image2,1); }; 
  
  image2.src = '../images/block.png';

  image3.onload = function(){sendTextureToGLSL(image3, 2)}

  return true;

}

function sendTextureToGLSL(image, textureUnit) {
  var texture = gl.createTexture();
  if (!texture){
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0 + textureUnit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);



  if (textureUnit == 0) {
    gl.uniform1i(u_Sampler0, textureUnit);
  } else if (textureUnit == 1) {
    gl.uniform1i(u_Sampler1, textureUnit);
  }

  return texture;
}



function main() {

  setupWebGL();
  connectVariablesToGLSL();

  addActionForHTMLUI();

  canvas.onmousedown = click;
  canvas.onmousemove = function (ev) { if(ev.buttons == 1) {click(ev) } }; 

  gl.clearColor(0, 0, 0, 1); 

  //renderAllShapes();
  requestAnimationFrame(tick);

  document.onkeydown = keydown;

  initTextures();
}

var g_startTime=performance.now()/1000.0;
var g_seconds=performance.now/1000.0-g_startTime;

function tick(){
  // Save the current time
  g_seconds = performance.now()/120.0-g_startTime;
  //console.log(g_seconds);

  //Update Animation Angles
  updateAnimationAngles();

  // Draw everything
  renderAllShapes();

  requestAnimationFrame(tick);
}


function click(ev) {
  let [x, y] = convertCoordinatesEventToGL(ev); // grab the values
  
  //Create and store the new point
  let point;
  if(g_selectedType==POINT){
    point = new Point();
  }
  else if (g_selectedType==TRIANGLE){
    point = new Triangle();
  }
  else if (g_selectedType==CIRCLE){
    point = new Circle();
    point.segments = g_selectedSegment;
  }

  point.position=[x,y];
  point.color=g_selectedColor.slice();
  point.size=g_selectedSize;
  renderAllShapes();
}


function updateAnimationAngles(){ 
  let spinSpeed = 10; // Adjust for slower or faster spinning
  let slowSpin = (g_seconds * spinSpeed) % 360; // Continuous slow rotation

  if (g_yellowAnimation){                             
    g_yellowAngle = slowSpin; // Spins continuously
  }
  if(g_yellowAnimation){
    g_yellowAngleRight = -slowSpin; // Opposite direction spin
  }
  if(g_wattleAnimation){
    g_wattleAnimationrock = slowSpin; // Matches the other spins
  }
}


function keydown(ev) {
  if (ev.keyCode == 68) { // 'D' key (Move right)
    g_eye[0] += 0.2;
  } else if (ev.keyCode == 65) { // 'A' key (Move left)
    g_eye[0] -= 0.2;
  } else if (ev.keyCode == 87) { // 'W' key (Move forward)
    g_eye[2] -= 0.2;
  } else if (ev.keyCode == 83) { // 'S' key (Move backward)
    g_eye[2] += 0.2;
  } else if (ev.keyCode == 81) { // 'Q' key (Rotate left)
    g_globalAngle -= 5;
  } else if (ev.keyCode == 69) { // 'E' key (Rotate right)
    g_globalAngle += 5;
  } else if (ev.keyCode == 38) { // Up arrow key (Move up)
    g_eye[1] += 0.2;
  } else if (ev.keyCode == 40) { // Down arrow key (Move down)
    g_eye[1] -= 0.2;
  }
  renderAllShapes();
  console.log("Key pressed:", ev.keyCode, "g_eye:", g_eye, "g_globalAngle:", g_globalAngle);
}


var g_eye=[0,0,3];
var g_at=[0,0,-100];
var g_up=[0,1,0];


function renderAllShapes(){

  var startTime = performance.now();

  // Pass the projection matrix
  var projMat = new Matrix4();
  projMat.setPerspective(50, 1*canvas.width/canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // Pass the view matrix
  var viewMat=new Matrix4();
  viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2], g_at[0], g_at[1], g_at[2], g_up[0], g_up[1], g_up[2]); 
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var globalRotMat=new Matrix4().rotate(g_globalAngle,0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0).rotate(g_globalAngleY, 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

// Draw the floor
  var floor = new Cube();
  floor.color = [0.0, 1.0, 0.0, 1.0];
    floor.textureNum=-2;
  floor.matrix.translate(0, -0.75, 0.0);
  floor.matrix.scale(10, 0, 10);
  floor.matrix.translate(-0.5, 0, -0.5);
  floor.render();

  //Draw the sky
  var sky = new Cube();
  sky.color = [1, 0, 0, 1];
  sky.textureNum= 0;
  sky.matrix.scale(50,50,50);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  sky.render();


  // Draw a yellow left arm
  var fan = new Cube();
  fan.color = [1,1,0,1];
  fan.textureNum = -1
  fan.matrix.setTranslate(0,-0.2,0.0);
  fan.matrix.rotate(-g_yellowAngle, 0, 0, 1); 
  fan.matrix.scale(0.25, 0.7, 0.5);
  fan.matrix.translate(-0.5, 0, 0);
  fan.render();

  var fan = new Cube();
  fan.color = [1,1,0,1];
  fan.textureNum = -1
  fan.matrix.setTranslate(1,0.2,0.0);
  fan.matrix.rotate(-g_yellowAngle, 0, 0, 1); 
  fan.matrix.scale(0.25, 0.7, 0.5);
  fan.matrix.translate(-0.5, 0, 0);
  fan.render();

  var fan = new Cube();
  fan.color = [1,1,0,1];
  fan.textureNum = -1
  fan.matrix.setTranslate(-1,0.2,0.0);
  fan.matrix.rotate(-g_yellowAngle, 0, 0, 1); 
  fan.matrix.scale(0.25, 0.7, 0.5);
  fan.matrix.translate(-0.5, 0, 0);
  fan.render();

  //Creates two walls with the grass texture
  let startZ = -2;  // Initial Z position
  let incrementZ = 0.31;  // Increment value
  let numBlocks = 15;  // Number of blocks to create

  for (let i = 0; i < numBlocks; i++) {
    let box = new Cube();
    box.color = [1, 0, 1, 1];
    box.textureNum = 1;
    box.matrix.translate(-2.5, -0.7, startZ + (i * incrementZ));  // Increment Z
    box.matrix.rotate(0, 0, 0, 1);
    box.matrix.scale(0.3, 0.3, 0.3);
    box.matrix.translate(-0.5, 0, -0.001);
    box.render();
  }

  for (let i = 0; i < numBlocks; i++) {
    let box = new Cube();
    box.color = [1, 0, 1, 1];
    box.textureNum = 1;
    box.matrix.translate(-2.5, -0.4, startZ + (i * incrementZ));  // Increment Z
    box.matrix.rotate(0, 0, 0, 1);
    box.matrix.scale(0.3, 0.3, 0.3);
    box.matrix.translate(-0.5, 0, -0.001);
    box.render();
  }

  for (let i = 0; i < numBlocks; i++) {
    let box = new Cube();
    box.color = [1, 0, 1, 1];
    box.textureNum = 1;
    box.matrix.translate(3, -0.7, startZ + (i * incrementZ));  // Increment Z
    box.matrix.rotate(0, 0, 0, 1);
    box.matrix.scale(0.3, 0.3, 0.3);
    box.matrix.translate(-0.5, 0, -0.001);
    box.render();
  }

  for (let i = 0; i < numBlocks; i++) {
    let box = new Cube();
    box.color = [1, 0, 1, 1];
    box.textureNum = 1;
    box.matrix.translate(3, -0.4, startZ + (i * incrementZ));  // Increment Z
    box.matrix.rotate(0, 0, 0, 1);
    box.matrix.scale(0.3, 0.3, 0.3);
    box.matrix.translate(-0.5, 0, -0.001);
    box.render();
  }

  var duration = performance.now() - startTime;
  sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
}


// Set the text of a HTML element
function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}
