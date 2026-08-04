// ===================================
// Flight Routes System
// Route Information
// ===================================

const token = localStorage.getItem("access");

// Redirect to login if token doesn't exist
if (!token) {
    window.location.href = "/login/";
}

// Load statistics when page opens
document.addEventListener("DOMContentLoaded", () => {

    loadAirports();

    loadLongestDuration();

    loadShortestDuration();

});

// ===============================
// Search Route
// ===============================

document
.getElementById("searchForm")
.addEventListener("submit", async function (e) {

    e.preventDefault();

    const airport_code =
        document.getElementById("airportCode").value.trim();

    const direction =
        document.getElementById("direction").value;

    const response = await fetch(
        "/api/airports/search-route/",
        {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                airport_code,
                direction

            })

        }
    );

    const data = await response.json();

   if (response.ok) {

      document.getElementById("startAirport").innerHTML =
         data.start_airport;

      document.getElementById("routeDirection").innerHTML =
         data.direction;
 
      document.getElementById("lastAirport").innerHTML =
         data.last_reachable_airport;

    // Display the complete route
       drawRoute(data.route);

    }
    else {

        showAlert(
            JSON.stringify(data),
            "danger"
        );

    }

});



// ===============================
// Load Airport Dropdown
// ===============================

async function loadAirports() {

    const response = await fetch("/api/airports/");

    const airports = await response.json();

    const select =
        document.getElementById("airportCode");

    select.innerHTML = `
        <option value="">
            Select Airport
        </option>
    `;

    airports.forEach(airport => {

        select.innerHTML += `
            <option value="${airport.airport_code}">
                ${airport.airport_code}
            </option>
        `;

    });

}

// ===============================
// Longest Duration
// ===============================

async function loadLongestDuration() {

    const response = await fetch(
        "/api/airports/longest-duration/"
    );

    const data = await response.json();

    if (response.ok) {

        document.getElementById("longAirport").innerHTML =
            data.airport;

        document.getElementById("longDuration").innerHTML =
            data.duration;

    }

}



// ===============================
// Shortest Duration
// ===============================

async function loadShortestDuration() {

    const response = await fetch(
        "/api/airports/shortest-duration/"
    );

    const data = await response.json();

    if (response.ok) {

        document.getElementById("shortAirport").innerHTML =
            data.airport;

        document.getElementById("shortDuration").innerHTML =
            data.duration;

    }

}



// ===============================
// Bootstrap Alert
// ===============================

function showAlert(message, type) {

    const alertBox =
        document.getElementById("alertBox");

    alertBox.className =
        "alert alert-" + type;

    alertBox.innerHTML =
        message;

    alertBox.classList.remove("d-none");

    setTimeout(() => {

        alertBox.classList.add("d-none");

    }, 3000);

}

// ===============================
// Route visualization (radar console)
// ===============================

// Theme colors — kept in sync with route.css
const ROUTE_COLORS = {
    line: "#2BE0A6",     // accent-radar
    start: "#FFB648",    // accent-amber
    end: "#4FC3F7",      // accent-cyan
    mid: "#2BE0A6",      // accent-radar
    text: "#EAF1F8",     // text-primary
    ring: "#0B1522"      // circle stroke, matches panel bg
};

function drawRoute(route) {

    const svg =
        document.getElementById("routeSvg");

    svg.innerHTML = "";

    const width = svg.clientWidth;

    const height = 180;

    const startX = 70;

    const endX = width - 70;

    const gap =
        (endX - startX) /
        (route.length - 1);

    const baseY = 70;
    const waveAmplitude = 16;
    const waveSegments = 4; // wave bumps per airport-to-airport gap

    // Inject animation styles once per draw
    svg.innerHTML += `
        <style>
            .route-line {
                fill: none;
                stroke: ${ROUTE_COLORS.line};
                stroke-width: 4;
                stroke-linecap: round;
                stroke-dasharray: 1;
                stroke-dashoffset: 1;
                animation: drawLine linear forwards;
            }
            .route-circle {
                stroke: ${ROUTE_COLORS.ring};
                stroke-width: 3;
                opacity: 0;
                transform-box: fill-box;
                transform-origin: center;
                animation: popIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
            .route-text {
                fill: ${ROUTE_COLORS.text};
                opacity: 0;
                animation: fadeIn 0.4s ease forwards;
            }
            .route-plane {
                opacity: 0;
                animation: fadeIn 0.3s ease forwards;
            }
            @keyframes drawLine {
                to { stroke-dashoffset: 0; }
            }
            @keyframes popIn {
                0%   { opacity: 0; transform: scale(0); }
                60%  { opacity: 1; transform: scale(1.35); }
                100% { opacity: 1; transform: scale(1); }
            }
            @keyframes fadeIn {
                to { opacity: 1; }
            }
            @media (prefers-reduced-motion: reduce) {
                .route-line, .route-circle, .route-text, .route-plane {
                    animation-duration: 0.01s !important;
                }
            }
        </style>
    `;

    // Compute airport point positions
    const points = route.map((airport, index) => ({
        x: startX + (index * gap),
        y: baseY
    }));

    // Build a wavy path 'd' string across all points
    function buildWavyPath(pts) {
        let d = `M ${pts[0].x} ${pts[0].y}`;

        for (let i = 0; i < pts.length - 1; i++) {

            const p1 = pts[i];
            const p2 = pts[i + 1];
            const segW = (p2.x - p1.x) / waveSegments;

            for (let s = 0; s < waveSegments; s++) {

                const sx = p1.x + (segW * s);
                const ex = p1.x + (segW * (s + 1));
                const mx = (sx + ex) / 2;

                const dir = (s % 2 === 0) ? -1 : 1;
                const my = p1.y + (dir * waveAmplitude);

                d += ` Q ${mx} ${my}, ${ex} ${p1.y}`;

            }

        }

        return d;
    }

    const wavyD = buildWavyPath(points);

    const totalLineDuration =
        (route.length - 1) * 0.5 + 0.4;

    // Draw the single wavy line (draws itself in using pathLength trick)
    svg.innerHTML += `

<path
id="planePath"
class="route-line"
d="${wavyD}"
pathLength="1"
style="animation-duration:${totalLineDuration.toFixed(2)}s"
/>

`;

    // Draw airport circles + labels (pop in one after another)
    route.forEach((airport, index) => {

        const x = points[index].x;
        const delay = (index * (totalLineDuration / (route.length - 1 || 1))).toFixed(2);

        const isStart = index === 0;
        const isEnd = index === route.length - 1;
        const circleFill = isStart
            ? ROUTE_COLORS.start
            : isEnd
                ? ROUTE_COLORS.end
                : ROUTE_COLORS.mid;

        svg.innerHTML += `

<circle
class="route-circle"
cx="${x}"
cy="${baseY}"
r="10"
fill="${circleFill}"
style="animation-delay:${delay}s"
/>

<text
class="route-text"
x="${x}"
y="${baseY + 35}"
font-size="14"
font-family="'IBM Plex Mono', monospace"
font-weight="600"
letter-spacing="0.5"
text-anchor="middle"
style="animation-delay:${delay}s">

${airport}

</text>

`;

    });

    // Animated plane flying along the wavy path after it's drawn
    svg.innerHTML += `

<text
class="route-plane"
font-size="22"
style="animation-delay:${totalLineDuration.toFixed(2)}s">

✈️

<animateMotion
dur="${Math.max(route.length * 0.5, 1.2)}s"
begin="${totalLineDuration.toFixed(2)}s"
fill="freeze"
rotate="auto">

<mpath href="#planePath" />

</animateMotion>

</text>

`;

}