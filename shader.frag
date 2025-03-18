uniform float time;
varying vec3 vNormal;
void main() {
    float intensity = pow(0.5 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    vec3 glowColor = vec3(0.0, 1.0, 1.0) * intensity * (sin(time) * 0.5 + 0.5);
    gl_FragColor = vec4(glowColor, 1.0);
}