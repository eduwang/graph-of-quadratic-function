import * as THREE from 'three';

// Step 1: Set up the scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1000);
var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 초기 카메라 위치 저장
const initialCameraPosition = {
    x: 0, // 처음 카메라의 x 위치
    y: 2, // 처음 카메라의 y 위치
    z: 30 // 처음 카메라의 z 위치
};

// 카메라 초기 위치 설정
camera.position.set(initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z);


var cylinderGeometry = new THREE.CylinderGeometry(0.03, 0.03, 2000, 32);
var cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
var xAxis = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
xAxis.rotation.z = Math.PI / 2; // Rotate 90 degrees to align with the x-axis
xAxis.position.z = -0.1; // Move X-axis slightly back on the z-axis
scene.add(xAxis);

var yAxis = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
yAxis.position.z = -0.1; // Move X-axis slightly back on the z-axis
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

// Function to reset camera position
function resetCameraPosition() {
    camera.position.set(initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z);
}

//scene.add(grid);

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
const updateButton2 = document.getElementById('updateButton2');

var points = [];

// Function to update function graph
function updateFunctionGraph() {
    removeAllGraphs();

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
    removeAllGraphs();

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
let gridVisible = false;

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

// Step 3: Create points representing the function
function createFunctionGraph(a, b, c) {
    var points = [];
    for (var i = -50; i <= 50; i += 0.01) {
        var y = quadraticFunction(i, a, b, c);
        points.push(new THREE.Vector3(i, y, 0));
    }
    return points;
}

// Step 4: Render points
function renderFunctionGraph(points, color) {
    var geometry = new THREE.BufferGeometry().setFromPoints(points);
    var material = new THREE.PointsMaterial({
        size: 0.35, // Adjust the size of the points
        color: color || 0xB6D7A8 // Set color for the points
    });

    var quadraticPoints = new THREE.Points(geometry, material);
    scene.add(quadraticPoints);
    return quadraticPoints;
}

// Function to remove all existing graphs
function removeAllGraphs() {
    scene.children = scene.children.filter(child => {
        if (child instanceof THREE.Points) {
            scene.remove(child);
            return false;
        }
        return true;
    });
}


// Animation logic
// 슬라이더를 사용한 그래프 애니메이션
function animateGraph() {
    resetCameraPosition();
    const button = document.getElementById('showYTranslation');
    button.style.display = "none";
    updateButton.disabled = true;
    updateButton2.disabled = true;

    const cSlider = document.getElementById('cSlider');
    const cValue = document.getElementById('cValue');

    cSlider.style.display = "block";
    // cValue.style.display = "inline-block";

    const a = Math.random() * 3 + 0.5;
    const b = 0;

    removeAllGraphs();

    const staticPoints = createFunctionGraph(a, b, 0);
    renderFunctionGraph(staticPoints, 0xB6D7A8);

    let animatedGraph;
    let c = parseFloat(cSlider.value);

    // 기존 이벤트 리스너 제거
    const newSlider = cSlider.cloneNode(true);
    cSlider.parentNode.replaceChild(newSlider, cSlider);

    newSlider.addEventListener('input', function () {
        resetCameraPosition();
        c = parseFloat(newSlider.value);
        // cValue.textContent = `c: ${c.toFixed(2)}`;

        // 이전 그래프 제거
        if (animatedGraph) {
            scene.remove(animatedGraph);
        }
        const animatedPoints = createFunctionGraph(a, b, c);
        animatedGraph = renderFunctionGraph(animatedPoints, 0xff4f69);
    });

    button.disabled = false;
    updateButton.disabled = false;
    updateButton2.disabled = false;

    const resetScene = document.getElementById('go-back-to-controller');
    resetScene.style.display = 'inline';

    const controllerPanel = document.getElementById('controller');
    controllerPanel.style.display = 'none';
}


// Button click event listener
document.getElementById('showYTranslation').addEventListener('click', animateGraph);

document.getElementById('go-back-to-controller').addEventListener('click', resetScene);
function resetScene() {
    const observeTranslation = document.getElementById('showYTranslation');
    observeTranslation.style.display = 'inline';

    const cSlider = document.getElementById('cSlider');
    const cValue = document.getElementById('cValue');

    cSlider.style.display = "none";
    cValue.style.display = "none";

    const controllerPanel = document.getElementById('controller');
    controllerPanel.style.display = 'block'

    const resetScene = document.getElementById('go-back-to-controller');
    resetScene.style.display = 'none';
    removeAllGraphs();

    // 카메라 위치를 초기 위치로 리셋
    resetCameraPosition();
    cSlider.value = 0;


}

// Position the camera
camera.position.z = 30;
camera.position.y = 2;

// Detect if the touch is on the slider
let isTouchOnSlider = false;

// 슬라이더 요소
const cSlider = document.getElementById('cSlider');

// 슬라이더에서 터치가 시작되었는지 감지
cSlider.addEventListener('touchstart', function(event) {
    isTouchOnSlider = true; // 슬라이더에서 터치가 시작되면 플래그를 true로 설정
}, { passive: true });

cSlider.addEventListener('touchend', function(event) {
    isTouchOnSlider = false; // 터치가 끝나면 다시 플래그를 false로 설정
}, { passive: true });

// 슬라이더 외부에서의 터치 시작 감지
window.addEventListener('touchstart', function(event) {
    if (!cSlider.contains(event.target)) {
        isTouchOnSlider = false; // 슬라이더 외부에서 터치가 시작되면 플래그를 false로 설정
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    }
}, { passive: true });

// General screen touch logic
let touchStartX = 0;
let touchStartY = 0;

// Set the minimum and maximum bounds for camera movement
const minX = -20;
const maxX = 20;
const minY = -20;
const maxY = 20;


// 터치로 카메라 이동 처리
window.addEventListener('touchmove', function(event) {
    if (!isTouchOnSlider) { // 슬라이더가 아닌 경우에만 카메라 이동을 처리
        const touchEndX = event.touches[0].clientX;
        const touchEndY = event.touches[0].clientY;

        const deltaX = (touchEndX - touchStartX) * 0.03; // Sensitivity factor
        const deltaY = (touchEndY - touchStartY) * 0.03;

        let newPosX = camera.position.x - deltaX;
        let newPosY = camera.position.y + deltaY;

        if (newPosX < minX) newPosX = minX;
        if (newPosX > maxX) newPosX = maxX;
        if (newPosY < minY) newPosY = minY;
        if (newPosY > maxY) newPosY = maxY;

        camera.position.x = newPosX;
        camera.position.y = newPosY;

        touchStartX = touchEndX;
        touchStartY = touchEndY;
    }
}, { passive: true });



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
