// ==========================================
// DIRECT WEBGL SHADER (Reference Photo Copy)
// ==========================================

const canvas = document.getElementById("hero-canvas");
const gl = canvas.getContext("webgl");

if (!gl) {
    console.error("WebGL not supported.");
}

// Canvas size setup
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
}
window.addEventListener("resize", resize);
resize();

// 1. Vertex Shader (साधा पडदा)
const vertexShaderSource = `
    attribute vec2 position;
    void main() {
        gl_Position = vec4(position, 0.0, 1.0);
    }
`;

// 2. Fragment Shader (👉 हीच ती जादू जी 'R' वाल्या फोटोसारखा लूक देते)
const fragmentShaderSource = `
    precision highp float;
    uniform vec2 u_resolution;
    uniform float u_time;

    // Pattern Math (Overlapping Circles to create Stars)
    float sdCircle( vec2 p, float r ) {
        return length(p) - r;
    }

    float sdStar4( vec2 p, float r, float rf) {
        vec2 q = abs(p);
        return max(sdCircle(q, r), sdCircle(q - rf, r));
    }

    void main() {
        // Screen coordinates
        vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution) / u_resolution.y;
        
        // 👉 Tuzi Premium Color Palette (Deep Blue & Midnight)
        vec3 deepBlue = vec3(0.01, 0.03, 0.1);  // Midnight Blue
        vec3 brightCyan = vec3(0.0, 0.9, 1.0);  // Bright Cyan
        vec3 color = deepBlue;

        // Swirling Liquid Effect (बॅकग्राउंड रंग वाहताना दिसतील)
        p *= 1.5;
        vec2 q = p;
        q.x += sin(u_time * 0.4 + p.y * 3.0) * 0.2;
        q.y += cos(u_time * 0.5 + p.x * 2.0) * 0.2;
        
        // रंगांचे मिश्रण
        color = mix(color, brightCyan * 0.5, 1.0 - smoothstep(0.0, 1.2, length(q)));

        // Pattern Grid (Micro-Dots + Star in the center)
        vec2 grid_p = mod(gl_FragCoord.xy, 60.0) - 30.0;
        
        // १. नाजूक ४-पानांची चांदणी (४-pointed Star)
        float starDist = sdStar4(grid_p, 18.0, 24.0);
        float starIntensity = 1.0 - smoothstep(0.0, 1.5, starDist);
        color = mix(color, brightCyan, starIntensity * 0.04); // अतिशय सूक्ष्म

        // २. चांदणीच्या मधला चमकणारा Dot
        float dotDist = length(grid_p);
        float dotPulse = 0.5 + 0.5 * sin(u_time * 2.0); // Pulsing
        float dotIntensity = 1.0 - smoothstep(0.0, 1.8 + dotPulse * 1.0, dotDist);
        color = mix(color, brightCyan, dotIntensity * 0.2); // चमक

        // Screen Output
        gl_FragColor = vec4(color, 1.0);
    }
`;

// Shader Compile Functions
function createShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

// WebGL Program Setup
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

// Rectangle पडदा
const vertices = new Float32Array([
    -1.0, -1.0,  1.0, -1.0,  -1.0,  1.0,
    -1.0,  1.0,  1.0, -1.0,   1.0,  1.0
]);
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const positionLocation = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// Uniforms
const timeLocation = gl.getUniformLocation(program, "u_time");
const resolutionLocation = gl.getUniformLocation(program, "u_resolution");

// Render Loop (Animation)
function render(time) {
    // GPU ला वेळ आणि साईझ पाठवणे
    gl.uniform1f(timeLocation, time * 0.001); // Time
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    
    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
}

// ॲनिमेशन चालू कर!
requestAnimationFrame(render);