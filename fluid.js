// ==========================================
// PURE WEBGL FLUID SHADER (Carl Gordon Style)
// ==========================================

const canvas = document.getElementById("hero-canvas");
const gl = canvas.getContext("webgl");

if (!gl) {
    console.error("WebGL not supported in this browser.");
}

// Canvas size setup
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
}
window.addEventListener("resize", resize);
resize();

// 1. Vertex Shader (साधा पडदा तयार करण्यासाठी)
const vertexShaderSource = `
    attribute vec2 position;
    void main() {
        gl_Position = vec4(position, 0.0, 1.0);
    }
`;

// 2. Fragment Shader (👉 हीच ती जादू जी रंग आणि पाण्याचा इफेक्ट देते)
const fragmentShaderSource = `
    precision highp float;
    uniform vec2 u_resolution;
    uniform float u_time;

    void main() {
        // Screen coordinates
        vec2 coord = gl_FragCoord.xy / u_resolution;
        vec3 color = vec3(0.0);
        
        // Fluid math (पाण्यासारख्या लाटा तयार करणे)
        vec2 q = coord;
        q.x += sin(u_time * 0.2 + coord.y * 4.0) * 0.3;
        q.y += cos(u_time * 0.3 + coord.x * 4.0) * 0.3;
        
        // रंगांची तीव्रता (Intensity)
        float intensity1 = 0.5 + 0.5 * sin(q.x * 5.0 + u_time * 0.8);
        float intensity2 = 0.5 + 0.5 * cos(q.y * 3.0 - u_time * 0.6);
        
        // 👉 Tuzi Premium Color Palette (Deep Blue & Neon Cyan)
        vec3 cyan = vec3(0.0, 0.9, 1.0);       // लख्ख सायन
        vec3 deepBlue = vec3(0.0, 0.15, 0.9);  // गडद निळा
        vec3 midnight = vec3(0.0, 0.01, 0.05); // अतिशय गडद पार्श्वभूमी

        // रंगांचं मिश्रण (Blending)
        color = mix(midnight, deepBlue, intensity1);
        color = mix(color, cyan, intensity2 * 0.6);

        // Screen Output
        gl_FragColor = vec4(color, 1.0);
    }
`;

// Shader Compile करणारी फंक्शन
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

// Rectangle पडदा बनवणे
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

// Uniforms (Time आणि Resolution पाठवणे)
const timeLocation = gl.getUniformLocation(program, "u_time");
const resolutionLocation = gl.getUniformLocation(program, "u_resolution");

// Render Loop (Animation)
function render(time) {
    // GPU ला वेळ आणि साईझ सांगणे
    gl.uniform1f(timeLocation, time * 0.001); // Animation Speed
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    
    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
}

// ॲनिमेशन चालू कर!
requestAnimationFrame(render);