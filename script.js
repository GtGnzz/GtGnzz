// Inisialisasi Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('neuronCanvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Shader untuk efek glow pada neuron
const vertexShader = await fetch('shader.vert').then(res => res.text());
const fragmentShader = await fetch('shader.frag').then(res => res.text());

// Material Glow untuk Neuron
const glowMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: { time: { value: 1.0 } },
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false
});

// Fungsi untuk membuat neuron (bola bercahaya)
function createNeuron(position) {
    const geometry = new THREE.SphereGeometry(0.2, 16, 16);
    const mesh = new THREE.Mesh(geometry, glowMaterial);
    mesh.position.copy(position);
    return mesh;
}

// Fungsi untuk membuat dendrit (garis cabang)
function createDendrite(start, end) {
    const points = [start, end];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x00ffcc });
    return new THREE.Line(geometry, material);
}

// Array menyimpan neuron & dendrit
const neurons = [];
const dendrites = [];

// Fungsi untuk pertumbuhan neuron baru
function growNeuron() {
    if (neurons.length > 50) return;  // Batasi jumlah neuron untuk performa

    const lastNeuron = neurons[neurons.length - 1];
    const randomOffset = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
    );

    const newPosition = lastNeuron.position.clone().add(randomOffset);
    const newNeuron = createNeuron(newPosition);
    const newDendrite = createDendrite(lastNeuron.position, newPosition);

    neurons.push(newNeuron);
    dendrites.push(newDendrite);

    scene.add(newNeuron);
    scene.add(newDendrite);
}

// Tambahkan neuron awal
const initialNeuron = createNeuron(new THREE.Vector3(0, 0, 0));
neurons.push(initialNeuron);
scene.add(initialNeuron);

// Loop animasi
function animate() {
    requestAnimationFrame(animate);
    
    glowMaterial.uniforms.time.value += 0.01;
    if (Math.random() < 0.05) growNeuron();  // Pertumbuhan neuron setiap frame

    renderer.render(scene, camera);
}

// Jalankan animasi
animate();

// Event listener agar tampilan responsive
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});