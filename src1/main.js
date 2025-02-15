"use strict";

// Vertex Shader
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_TexCoord;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  varying vec2 v_TexCoord;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
    v_TexCoord = a_TexCoord;
  }
`;

// Fragment Shader
var FSHADER_SOURCE = `
#ifdef GL_ES
precision mediump float;
#endif
uniform sampler2D u_Sampler;
uniform vec4 u_BaseColor;
uniform float u_texColorWeight;
varying vec2 v_TexCoord;
void main() {
  vec4 texColor = texture2D(u_Sampler, v_TexCoord);
  gl_FragColor = mix(u_BaseColor, texColor, u_texColorWeight);
}
`;

var cubeVertices = new Float32Array([
  -0.5, -0.5,  0.5,  0.0, 0.0,  0.5, -0.5,  0.5,  1.0, 0.0, 
   0.5,  0.5,  0.5,  1.0, 1.0, -0.5,  0.5,  0.5,  0.0, 1.0,
  -0.5, -0.5, -0.5,  1.0, 0.0, -0.5,  0.5, -0.5,  1.0, 1.0,
   0.5,  0.5, -0.5,  0.0, 1.0,  0.5, -0.5, -0.5,  0.0, 0.0
]);

var cubeIndices = new Uint8Array([
  0, 1, 2,  0, 2, 3,  4, 5, 6,  4, 6, 7
]);

var map = [
  [1, 0, 1, 1, 0, 1],
  [1, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 1, 1],
  [1, 1, 1, 1, 1, 1]
];

var canvas, gl, program, cubeVBO, cubeIBO, texture, camera;
var lastMouseX, lastMouseY, dragging = false;

function initWebGL() {
  canvas = document.getElementById("glcanvas");
  gl = getWebGLContext(canvas, true);
  if (!gl) { console.log("Failed to get WebGL context."); return; }
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to initialize shaders.");
    return;
  }
  program = gl.program;
  gl.enable(gl.DEPTH_TEST);
  initBuffers();
  loadTexture("image.png");
  camera = new Camera(canvas);
  initEventHandlers();
}

function initBuffers() {
  cubeVBO = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVBO);
  gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);
  
  cubeIBO = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIBO);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cubeIndices, gl.STATIC_DRAW);
}

function loadTexture(url) {
  texture = gl.createTexture();
  var image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);
  };
  image.src = url;
}

function drawScene() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  var groundMatrix = new Matrix4();
  groundMatrix.setTranslate(0, -1, 0);
  groundMatrix.scale(32, 0.1, 32);
  drawCube(groundMatrix, [0.3, 0.8, 0.3, 1.0], 0.0);

  for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map[i].length; j++) {
      if (map[i][j] > 0) {
        var wallMatrix = new Matrix4();
        wallMatrix.setTranslate(i - map.length / 2, 0, j - map[0].length / 2);
        drawCube(wallMatrix, [0.8, 0.8, 0.8, 1.0], 1.0);
      }
    }
  }
  requestAnimationFrame(drawScene);
}

function drawCube(modelMatrix, baseColor, texColorWeight) {
  gl.uniformMatrix4fv(gl.getUniformLocation(program, "u_ModelMatrix"), false, modelMatrix.elements);
  gl.uniform4fv(gl.getUniformLocation(program, "u_BaseColor"), baseColor);
  gl.uniform1f(gl.getUniformLocation(program, "u_texColorWeight"), texColorWeight);
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVBO);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIBO);
  gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_BYTE, 0);
}

function initEventHandlers() {
  document.onkeydown = function(ev) {
    var speed = 0.2;
    if (ev.key === "w") camera.moveForward(speed);
    else if (ev.key === "s") camera.moveBackwards(speed);
    else if (ev.key === "a") camera.moveLeft(speed);
    else if (ev.key === "d") camera.moveRight(speed);
    else if (ev.key === "q") camera.panLeft(5);
    else if (ev.key === "e") camera.panRight(5);
  };

  canvas.onmousedown = function(ev) {
    dragging = true;
    lastMouseX = ev.clientX;
    lastMouseY = ev.clientY;
  };
  canvas.onmouseup = function() { dragging = false; };
  canvas.onmousemove = function(ev) {
    if (!dragging) return;
    var dx = ev.clientX - lastMouseX;
    camera.panLeft(dx * 0.1);
    lastMouseX = ev.clientX;
    lastMouseY = ev.clientY;
  };
}

window.onload = function() {
  initWebGL();
  drawScene();
};
