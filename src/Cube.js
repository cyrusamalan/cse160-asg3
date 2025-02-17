class Cube{
    constructor(){
        this.type='cube';
        this.color = [1.0,1.0,1.0,1.0];
        this.matrix = new Matrix4();
        this.textureNum=0;
    }
    render() {
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);        
        
    
/
    drawTriangle3DUV([0,0,0,    1,1,0,    1,0,0 ], [0,0,  1,1,  1,0]);
    drawTriangle3DUV([0,0,0,    0,1,0,    1,1,0 ], [0,0,  0,1,  1,1]);

    drawTriangle3DUV( [0,0,1,  1,1,1,  1,0,1 ], [0,0,  1,1,  1,0]);
    drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1 ], [0,0,  0,1,  1,1]);

    //Top of cube
    drawTriangle3DUV( [0,1,0,   0,1,1,  1,1,1], [0,0,  0,1,  1,1]);
    drawTriangle3DUV( [0,1,0,   1,1,1,  1,1,0], [0,0,  1,1,  1,0]);
    
    //Bottom of cube
    drawTriangle3DUV( [0,0,0,   0,0,1,  1,0,1], [0,0,  0,1,  1,1]);
    drawTriangle3DUV( [0,0,0,   1,0,1,  1,0,0], [0,0,  1,1,  1,0]);

    //Right side of cube
    drawTriangle3DUV([1,0,0,   1,1,1,  1,0,1], [0,0,  1,1,  1,0]);// right side of cube triangle 1
    drawTriangle3DUV([1,0,0,   1,1,0,  1,1,1], [0,0,  0,1,  1,1]);//right side of cube triangle 2

    //Left side of triangle
    drawTriangle3DUV([0,0,0,   0,1,1,   0,0,1], [0,0,  1,1,  1,0]); //left side of cube triangle 1
    drawTriangle3DUV([0,0,0,   0,1,0,   0,1,1], [0,0,  0,1,  1,1]); //left side of cube triangle 2



    //Front of cube
    drawTriangle3D( [0,0,0,  1,1,0,  1,0,0 ]);
    drawTriangle3D( [0,0,0,  0,1,0,  1,1,0 ]);


    drawTriangle3D( [0,0,1,  1,1,1,  1,0,1 ]);
    drawTriangle3D( [0,0,1,  0,1,1,  1,1,1 ]);
    gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

    //Top of cube
    drawTriangle3D( [0,1,0,   0,1,1,  1,1,1]);
    drawTriangle3D( [0,1,0,   1,1,1,  1,1,0]);
    
    //Bottom of cube
    drawTriangle3D( [0,0,0,   0,0,1,  1,0,1]);
    drawTriangle3D( [0,0,0,   1,0,1,  1,0,0]);

    //Right side of cube
    drawTriangle3D([1,1,1,   1,0,1,    1, 0, 0])// right side of cube triangle 1
    drawTriangle3D([1,1,1,   1,1,0,    1, 0, 0])//right side of cube triangle 2

    //Left side of triangle
    drawTriangle3D([0,0,0,   0,1,0,   0,1,1]) //left side of cube triangle 1
    drawTriangle3D([0,0,0,   0,0,1,   0,1,1]) //left side of cube triangle 2
    }

}