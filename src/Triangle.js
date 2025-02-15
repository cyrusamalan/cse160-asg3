class Triangle{
  constructor(){
    this.type = 'triangle';
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 5.0;
  }

  render() {
    const xy = this.position;
    const rgba = this.color;
    const size = this.size;

    // Pass the position of a point to a_Position variable
    // gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // Pass the size of a point to u_Size variable
    gl.uniform1f(u_Size, size)
    // Draw
    const d = this.size/200.0;
    drawTriangle( [xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d])
  }
}


function drawTriangle(vertices, buffer) {
  // var vertices = new Float32Array([
  //   0, 0.5,   -0.5, -0.5,   0.5, -0.5
  // ]);
  var n = 3; // The number of vertices

  // Create a buffer object
  /*var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }*/
  var vertexBuffer = null;
  if(buffer) {
    vertexBuffer = buffer;
  } else {
    vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  //gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  // if (a_Position < 0) {
  //   console.log('Failed to get the storage location of a_Position');
  //   return -1;
  // }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n);

  return n;
}

function drawTriangle3D(vertices) {

  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n);

  return n;
}

function drawTriangle3DUV(vertices, uv) {

  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  // Create a buffer object for UV
  var uvBuffer = gl.createBuffer();
  if (!uvBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_UV);

  gl.drawArrays(gl.TRIANGLES, 0, n);

  return n;
}


let t_triangleBuffer = null;

function init_triangleBuffer(FSIZE){
  var t_triangleBuffer = gl.createBuffer();
  if (!t_triangleBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, t_triangleBuffer);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE*5, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, FSIZE*5, FSIZE*3);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_UV);
}




function drawAllTriangle3DUV(data) {

  let vertices = new Float32Array(data);
  FSIZE = vertices.BYTES_PER_ELEMENT;

  var n = 5; // The number of data in vertex

  if (t_triangleBuffer == null){
    init_triangleBuffer(FSIZE);
  }

  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / n);

  return n;
}


class triangle_superRenderer {
  constructor() {

  }
}
