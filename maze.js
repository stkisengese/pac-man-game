window.onload = function() {
    renderDots();
};


const mazeGrid = 
    [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
        [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
        [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
        [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
        [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,1,0,0,0,2,2,0,0,0,1,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,1,0,3,3,3,3,3,3,0,1,0,0,1,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1,1,1,0,3,3,3,3,3,3,0,1,1,1,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,1,0,0,1,0,3,3,3,3,3,3,0,1,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
        [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
        [0,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0],
        [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
        [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
        [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
        [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
        [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
]

const dotContainer = document.getElementById("dot-container");

const cellSize = 18; // Adjust based on maze size
const dotSize = 4;   // Size of the dots

mazeGrid.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
        if (cell === 1) { // Only place dots on paths
            const dot = document.createElement("div");
            dot.classList.add("dot");
            dot.style.width = `${dotSize}px`;
            dot.style.height = `${dotSize}px`;
            dot.style.position = "absolute";
            dot.style.backgroundColor = "yellow";
            dot.style.borderRadius = "50%";
            dot.style.top = `${rowIndex * cellSize + cellSize / 2 - dotSize / 2}px`;
            dot.style.left = `${colIndex * cellSize + cellSize / 2 - dotSize / 2}px`;
            dotContainer.appendChild(dot);
        }
    });
});












// document.addEventListener("DOMContentLoaded", () => {
//     const dotContainer = document.getElementById("dot-container");
//     const svg = document.querySelector("#maze img"); // Assuming SVG is inside #maze as an <img>

//     if (!dotContainer || !svg) {
//         console.error("Dot container or SVG maze not found.");
//         return;
//     }

//     function placeDots() {
//         fetch(svg.src)
//             .then(response => response.text())
//             .then(svgText => {
//                 const parser = new DOMParser();
//                 const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
//                 const paths = svgDoc.querySelectorAll("path");

//                 // Get the original viewBox size from the SVG
//                 const svgElement = svgDoc.querySelector("svg");
//                 const [viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight] = svgElement
//                     .getAttribute("viewBox")
//                     .split(" ")
//                     .map(Number);

//                 function updateDots() {
//                     const { width: actualWidth, height: actualHeight } = svg.getBoundingClientRect();
//                     const scaleX = actualWidth / viewBoxWidth;
//                     const scaleY = actualHeight / viewBoxHeight;

//                     dotContainer.innerHTML = ""; // Clear old dots

//                     paths.forEach(path => {
//                         const pathLength = path.getTotalLength();
//                         const dotSpacing = 10; // Adjust density

//                         for (let i = 0; i < pathLength; i += dotSpacing) {
//                             const point = path.getPointAtLength(i);

//                             const dot = document.createElement("div");
//                             dot.style.position = "absolute";
//                             dot.style.width = `${2 * scaleX}px`;  // Scale dot size
//                             dot.style.height = `${2 * scaleY}px`;
//                             dot.style.backgroundColor = "red";
//                             dot.style.borderRadius = "50%";
//                             dot.style.border = "1px solid white";
//                             dot.style.top = `${point.y * scaleY}px`;
//                             dot.style.left = `${point.x * scaleX}px`;

//                             dotContainer.appendChild(dot);
//                         }
//                     });

//                     console.log("Dots updated for new scale:", scaleX, scaleY);
//                 }

//                 updateDots();
//                 window.addEventListener("resize", updateDots); // Adjust dots when resizing
//             })
//             .catch(error => console.error("Error loading SVG:", error));
//     }

//     placeDots();
// });
