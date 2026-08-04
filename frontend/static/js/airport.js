// ===============================
// Flight Routes System
// Airport Management
// ===============================

const API_URL = "/api/airports/";

const token = localStorage.getItem("access");

// Redirect to login if token is missing
if (!token) {
    window.location.href = "/login/";
}

// Load airports when page opens
document.addEventListener("DOMContentLoaded", () => {

    loadAirports();

});

// ----------------------------
// Add Airport
// ----------------------------

document
.getElementById("airportForm")
.addEventListener("submit", async function (e) {

    e.preventDefault();

    const airport_code =
        document.getElementById("airportCode").value.trim();

    const position =
        document.getElementById("position").value;

    const duration =
        document.getElementById("duration").value;

    const response = await fetch(API_URL, {

        method: "POST",

        headers: {

            "Content-Type": "application/json",

            "Authorization":
                "Bearer " + token

        },

        body: JSON.stringify({

            airport_code,
            position,
            duration

        })

    });

    const data = await response.json();

    if (response.ok) {

        showAlert(
            "Airport added successfully.",
            "success"
        );

        document
            .getElementById("airportForm")
            .reset();

        loadAirports();

    }
    else {

        showAlert(
            JSON.stringify(data),
            "danger"
        );

    }

});


// ----------------------------
// Load Airport List
// ----------------------------

async function loadAirports() {

    const response = await fetch(API_URL);

    const airports = await response.json();

    const tbody =
        document.getElementById("airportTable");

    tbody.innerHTML = "";

    airports.forEach((airport, index) => {

        tbody.innerHTML += `

<tr>

<td>${index + 1}</td>

<td>${airport.airport_code}</td>

<td>${airport.position}</td>

<td>${airport.duration}</td>

<td>

<button
class="btn btn-warning btn-sm"
onclick="openEditModal(${airport.id})">

Edit

</button>

<button
class="btn btn-danger btn-sm"
onclick="deleteAirport(${airport.id})">

Delete

</button>

</td>

</tr>

`;

    });

}


// ----------------------------
// Open Edit Modal
// ----------------------------

async function openEditModal(id) {

    const response =
        await fetch(API_URL + id + "/");

    const airport =
        await response.json();

    document.getElementById("editId").value =
        airport.id;

    document.getElementById("editCode").value =
        airport.airport_code;

    document.getElementById("editPosition").value =
        airport.position;

    document.getElementById("editDuration").value =
        airport.duration;

    new bootstrap.Modal(
        document.getElementById("editModal")
    ).show();

}


// ----------------------------
// Update Airport
// ----------------------------

async function updateAirport() {

    const id =
        document.getElementById("editId").value;

    const response = await fetch(
        API_URL + id + "/",
        {

            method: "PUT",

            headers: {

                "Content-Type":
                    "application/json",

                "Authorization":
                    "Bearer " + token

            },

            body: JSON.stringify({

                airport_code:
                    document.getElementById("editCode").value,

                position:
                    document.getElementById("editPosition").value,

                duration:
                    document.getElementById("editDuration").value

            })

        }
    );

    const data =
        await response.json();

    if (response.ok) {

        bootstrap.Modal
            .getInstance(
                document.getElementById("editModal")
            )
            .hide();

        showAlert(
            "Airport updated successfully.",
            "success"
        );

        loadAirports();

    }
    else {

        showAlert(
            JSON.stringify(data),
            "danger"
        );

    }

}


// ----------------------------
// Delete Airport
// ----------------------------

async function deleteAirport(id) {

    if (!confirm("Delete this airport?"))
        return;

    const response = await fetch(
        API_URL + id + "/",
        {

            method: "DELETE",

            headers: {

                "Authorization":
                    "Bearer " + token

            }

        }
    );

    if (response.ok) {

        showAlert(
            "Airport deleted successfully.",
            "success"
        );

        loadAirports();

    }

}


// ----------------------------
// Alert
// ----------------------------

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