/* =====================================================
   EarnJoy - Main JavaScript
   ===================================================== */


/* ================= GLOBAL VARIABLES ================= */

let courses = [];

const coursesContainer =
    document.getElementById("coursesContainer");

const searchInput =
    document.getElementById("searchInput");

const clearSearch =
    document.getElementById("clearSearch");

const noResults =
    document.getElementById("noResults");

const courseCount =
    document.getElementById("courseCount");

const currentYear =
    document.getElementById("currentYear");


/* ================= LOAD COURSE DATA ================= */

async function loadCourses() {

    try {

        const response = await fetch("courses.json");

        if (!response.ok) {
            throw new Error("Unable to load course data.");
        }

        const data = await response.json();

        courses = data.courses || [];

        displayCourses(courses);

    } catch (error) {

        console.error(error);

        coursesContainer.innerHTML = `
            <div class="loading">
                Unable to load study materials.
                Please try again later.
            </div>
        `;

    }

}


/* ================= DISPLAY COURSES ================= */

function displayCourses(courseList) {

    coursesContainer.innerHTML = "";

    courseCount.textContent =
        `${courseList.length} ${courseList.length === 1 ? "Course" : "Courses"}`;


    if (courseList.length === 0) {

        noResults.classList.remove("hidden");

        return;

    }

    noResults.classList.add("hidden");


    courseList.forEach(course => {

        const card =
            document.createElement("div");

        card.className = "course-card";


        card.innerHTML = `

            <div class="course-icon">
                ${course.icon || "📚"}
            </div>

            <h3>
                ${escapeHTML(course.name)}
            </h3>

            <p class="course-description">
                ${escapeHTML(course.description || "")}
            </p>

            <p class="material-count">
                📄 ${course.materials.length}
                ${course.materials.length === 1 ? "Material" : "Materials"}
            </p>

            <button
                class="view-course"
                onclick="toggleMaterials('${course.id}')"
            >
                View Study Materials
            </button>

            <div
                id="materials-${course.id}"
                class="materials-container"
            >

                ${createMaterialsHTML(course.materials)}

            </div>

        `;


        coursesContainer.appendChild(card);

    });

}


/* ================= CREATE MATERIALS ================= */

function createMaterialsHTML(materials) {

    if (!materials || materials.length === 0) {

        return `
            <p class="course-description">
                No study materials available yet.
            </p>
        `;

    }


    return materials.map(material => {

        const safePDF =
            encodeURI(material.pdf);

        return `

            <div class="material">

                <div class="material-title">
                    📄 ${escapeHTML(material.title)}
                </div>

                <div class="material-actions">

                    <a
                        href="${safePDF}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="material-button read-button"
                    >
                        📖 Read PDF
                    </a>

                    <a
                        href="${safePDF}"
                        download
                        class="material-button download-button"
                    >
                        ⬇ Download PDF
                    </a>

                </div>

            </div>

        `;

    }).join("");

}


/* ================= TOGGLE MATERIALS ================= */

function toggleMaterials(courseId) {

    const materials =
        document.getElementById(
            `materials-${courseId}`
        );

    if (!materials) {
        return;
    }

    materials.classList.toggle("active");

}


/* ================= SEARCH ================= */

function searchCourses() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    if (searchTerm === "") {

        displayCourses(courses);

        clearSearch.style.display = "none";

        return;

    }


    clearSearch.style.display = "block";


    const filteredCourses =
        courses.filter(course => {

            const courseName =
                course.name.toLowerCase();

            const courseDescription =
                (course.description || "").toLowerCase();

            const materialMatch =
                course.materials.some(material =>
                    material.title
                        .toLowerCase()
                        .includes(searchTerm)
                );


            return (
                courseName.includes(searchTerm) ||
                courseDescription.includes(searchTerm) ||
                materialMatch
            );

        });


    displayCourses(filteredCourses);

}


/* ================= CLEAR SEARCH ================= */

function clearSearchInput() {

    searchInput.value = "";

    clearSearch.style.display = "none";

    displayCourses(courses);

    searchInput.focus();

}


/* ================= ESCAPE HTML ================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* ================= EVENT LISTENERS ================= */

searchInput.addEventListener(
    "input",
    searchCourses
);


clearSearch.addEventListener(
    "click",
    clearSearchInput
);


/* ================= CURRENT YEAR ================= */

currentYear.textContent =
    new Date().getFullYear();


/* ================= START WEBSITE ================= */

loadCourses();