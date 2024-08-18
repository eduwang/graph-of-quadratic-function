import * as THREE from 'three';

// Step 1: Set up the scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1000);
var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var cylinderGeometry = new THREE.CylinderGeometry(0.03, 0.03, 2000, 32);
var cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
var xAxis = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
xAxis.rotation.z = Math.PI / 2; // Rotate 90 degrees to align with the x-axis
scene.add(xAxis);

var yAxis = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
scene.add(yAxis);

// Add grid
var gridMaterial = new THREE.LineDashedMaterial({ linewidth: 1, color: 0xCCCCCC, dashSize: 0.2, gapSize: 0.2, opacity: 0.1 });
var gridPoints = [];

// Create X axis grid lines
for (var i = -50; i <= 50; i += 1) {
    if (i !== 0) { // Skip the main axis lines
        gridPoints.push(new THREE.Vector3(i, -1000, 0), new THREE.Vector3(i, 1000, 0));
    }
}

// Create Y axis grid lines
for (var j = -50; j <= 50; j += 1) {
    if (j !== 0) { // Skip the main axis lines
        gridPoints.push(new THREE.Vector3(-1000, j, 0), new THREE.Vector3(1000, j, 0));
    }
}

var gridGeometry = new THREE.BufferGeometry().setFromPoints(gridPoints);
var grid = new THREE.LineSegments(gridGeometry, gridMaterial);
grid.computeLineDistances(); // Required for dashed lines to appear

scene.add(grid);

// Step 2: Define quadratic function
function quadraticFunction(x, a, b, c) {
    return a * x * x + b * x + c;
}

function quadraticFunction2(x, a, b, c) {
    return a * (x - b) * (x - b) + c;
}

// Retrieve input elements
const inputA = document.getElementById('inputA');
const inputB = document.getElementById('inputB');
const inputC = document.getElementById('inputC');
const updateButton = document.getElementById('updateButton');
const updateButton2 = document.getElementById('updateButton-2');

var points = [];

// Function to update function graph
function updateFunctionGraph() {
    points = []; // Reset points array
    scene.children.forEach(child => {
        if (child instanceof THREE.Points) {
            scene.remove(child);
        }
    });

    // Get input values
    const a = parseFloat(inputA.value);
    const b = parseFloat(inputB.value);
    const c = parseFloat(inputC.value);

    // Use input values in your Three.js code to update the function graph
    // Step 3: Create points representing the function
    for (var i = -50; i <= 50; i += 0.01) {
        var y = quadraticFunction(i, a, b, c);
        points.push(new THREE.Vector3(i, y, 0));
    }
    // Step 4: Render points
    var geometry = new THREE.BufferGeometry().setFromPoints(points);
    var material = new THREE.PointsMaterial({
        size: 0.35, // Adjust the size of the points
        color: 0xB6D7A8 // Enable vertex colors
    });

    var quadraticPoints = new THREE.Points(geometry, material);
    scene.add(quadraticPoints);
}

function updateFunctionGraph2() {
    points = []; // Reset points array
    scene.children.forEach(child => {
        if (child instanceof THREE.Points) {
            scene.remove(child);
        }
    });

    // Get input values
    const a = parseFloat(inputA.value);
    const b = parseFloat(inputB.value);
    const c = parseFloat(inputC.value);

    // Use input values in your Three.js code to update the function graph
    // Step 3: Create points representing the function
    for (var i = -50; i <= 50; i += 0.01) {
        var y = quadraticFunction2(i, a, b, c);
        points.push(new THREE.Vector3(i, y, 0));
    }
    // Step 4: Render points
    var geometry = new THREE.BufferGeometry().setFromPoints(points);
    var material = new THREE.PointsMaterial({
        size: 0.35, // Adjust the size of the points
        color: 0xB6D7A8 // Enable vertex colors
    });

    var quadraticPoints = new THREE.Points(geometry, material);
    scene.add(quadraticPoints);
}

// Listen for button click to update graph
updateButton.addEventListener('click', updateFunctionGraph);
updateButton2.addEventListener('click', updateFunctionGraph2);

// Toggle grid visibility
let gridVisible = true;

toggleGridButton.addEventListener('click', function () {
    gridVisible = !gridVisible; // Toggle the visibility state
    if (gridVisible) {
        scene.add(grid); // Add the grid back to the scene
        toggleGridButton.textContent = "격자 숨기기"; // Update button text
    } else {
        scene.remove(grid); // Remove the grid from the scene
        toggleGridButton.textContent = "격자 표시"; // Update button text
    }
});

// Position the camera
camera.position.z = 30;
camera.position.y = 2;
// 설정할 x와 y의 최대 및 최소 값
const minX = -30;
const maxX = 30;
const minY = -30;
const maxY = 30;

// Touch control for camera movement
let touchStartX = 0;
let touchStartY = 0;

window.addEventListener('touchstart', function(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

window.addEventListener('touchmove', function(event) {
    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;

    const deltaX = (touchEndX - touchStartX) * 0.03; // Sensitivity factor
    const deltaY = (touchEndY - touchStartY) * 0.03;

    // 업데이트된 위치 계산
    let newPosX = camera.position.x - deltaX;
    let newPosY = camera.position.y + deltaY;

    // x와 y에 대한 제한 적용
    if (newPosX < minX) newPosX = minX;
    if (newPosX > maxX) newPosX = maxX;
    if (newPosY < minY) newPosY = minY;
    if (newPosY > maxY) newPosY = maxY;

    // 카메라의 새로운 위치 설정
    camera.position.x = newPosX;
    camera.position.y = newPosY;

    touchStartX = touchEndX;
    touchStartY = touchEndY;
});

// Access the rear camera
navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(function (stream) {
        var video = document.getElementById('videoElement');
        video.srcObject = stream;
    })
    .catch(function (error) {
        console.error('Error accessing the camera: ', error);
    });

// Render the scene
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
