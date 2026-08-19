/* =====================================================
   EARNJOY - JAVASCRIPT
   ===================================================== */


/* ================= GLOBAL VARIABLES ================= */

let courses = [];


/* ================= DOM ELEMENTS ================= */

const searchInput =
    document.getElementById("searchInput");

const coursesContainer =
    document.getElementById("coursesContainer");

const courseCount =
    document.getElementById("courseCount");

const loadingMessage =
    document.getElementById("loadingMessage");

const errorMessage =
    document.getElementById("errorMessage");

const noResults =
    document.getElementById("noResults");


/* ================= LOAD COURSES ================= */

async function loadCourses() {

    try {

        /*
         * cache: "no-store"
         * prevents the browser from using an old
         * courses.json file.
         *
         * The timestamp also creates a fresh URL
         * every time the page loads.
         */

        const response = await fetch(
            "courses.json?v=" + Date.now(),
            {
                cache: "no-store"
            }
        );


        /* Check HTTP response */

        if (!response.ok) {

            throw new Error(
                "Unable to load courses.json. HTTP Status: " +
                response.status
            );

        }


        /* Read JSON */

        const data = await response.json();


        /* Validate JSON structure */

        if (!data || !Array.isArray(data.courses)) {

            throw new Error(
                "Invalid courses.json structure."
            );

        }


        /* Store courses */

        courses = data.courses;


        /* Hide loading */

        loadingMessage.classList.add("hidden");


        /* Display courses */

        displayCourses(courses);

    }

    catch (error) {

        console.error(
            "EarnJoy loading error:",
            error
        );

        loadingMessage.classList.add("hidden");

        errorMessage.classList.remove("hidden");

        courseCount.textContent =
            "0 Courses";

    }

}


/* ================= DISPLAY COURSES ================= */

function displayCourses(courseList) {

    coursesContainer.innerHTML = "";

    noResults.classList.add("hidden");


    /* Update course count */

    const count = courseList.length;

    courseCount.textContent =
        count === 1
            ? "1 Course"
            : `${count} Courses`;


    /* No courses */

    if (courseList.length === 0) {

        noResults.classList.remove("hidden");

        return;

    }


    /* Create course cards */

    courseList.forEach(course => {

        const card =
            createCourseCard(course);

        coursesContainer.appendChild(card);

    });

}


/* ================= CREATE COURSE CARD ================= */

function createCourseCard(course) {

    const card =
        document.createElement("article");

    card.className =
        "course-card";


    /* Icon */

    const icon =
        document.createElement("div");

    icon.className =
        "course-icon";

    icon.textContent =
        course.icon || "📚";


    /* Course title */

    const title =
        document.createElement("h3");

    title.textContent =
        course.name;


    /* Description */

    const description =
        document.createElement("p");

    description.className =
        "course-description";

    description.textContent =
        course.description || "";


    /* Material count */

    const materialCount =
        document.createElement("div");

    materialCount.className =
        "material-count";

    const materials =
        Array.isArray(course.materials)
            ? course.materials
            : [];

    materialCount.textContent =
        materials.length === 1
            ? "📄 1 Study Material"
            : `📄 ${materials.length} Study Materials`;


    /* Materials section */

    const materialsSection =
        document.createElement("div");

    materialsSection.className =
        "materials";


    const materialsTitle =
        document.createElement("div");

    materialsTitle.className =
        "materials-title";

    materialsTitle.textContent =
        "Study Materials";


    materialsSection.appendChild(
        materialsTitle
    );


    /* Create each material */

    materials.forEach(material => {

        const materialItem =
            createMaterialItem(material);

        materialsSection.appendChild(
            materialItem
        );

    });


    /* Build card */

    card.appendChild(icon);

    card.appendChild(title);

    card.appendChild(description);

    card.appendChild(materialCount);

    card.appendChild(materialsSection);


    return card;

}


/* ================= CREATE MATERIAL ================= */

function createMaterialItem(material) {

    const item =
        document.createElement("div");

    item.className =
        "material-item";


    /* Material title */

    const title =
        document.createElement("h4");

    title.textContent =
        material.title;


    /* Buttons container */

    const actions =
        document.createElement("div");

    actions.className =
        "material-actions";


    /* ================= READ BUTTON ================= */

    const readButton =
        document.createElement("a");

    readButton.className =
        "btn btn-read";

    readButton.textContent =
        "Read PDF";

    readButton.href =
        encodeURI(material.pdf);

    readButton.target =
        "_blank";

    readButton.rel =
        "noopener noreferrer";


    /* ================= DOWNLOAD BUTTON ================= */

    const downloadButton =
        document.createElement("a");

    downloadButton.className =
        "btn btn-download";

    downloadButton.textContent =
        "Download";

    downloadButton.href =
        encodeURI(material.pdf);

    downloadButton.download = "";


    /* Add buttons */

    actions.appendChild(
        readButton
    );

    actions.appendChild(
        downloadButton
    );


    /* Add content */

    item.appendChild(title);

    item.appendChild(actions);


    return item;

}


/* ================= SEARCH ================= */

function performSearch() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    /* Empty search */

    if (searchTerm === "") {

        displayCourses(courses);

        return;

    }


    /* Filter courses */

    const filteredCourses =
        courses.filter(course => {

            const courseName =
                (course.name || "")
                    .toLowerCase();

            const description =
                (course.description || "")
                    .toLowerCase();

            const materialMatch =
                Array.isArray(course.materials)
                    &&
                course.materials.some(
                    material =>
                        (material.title || "")
                            .toLowerCase()
                            .includes(searchTerm)
                );


            return (
                courseName.includes(searchTerm)
                ||
                description.includes(searchTerm)
                ||
                materialMatch
            );

        });


    displayCourses(
        filteredCourses
    );

}


/* ================= SEARCH EVENT ================= */

searchInput.addEventListener(
    "input",
    performSearch
);


/* ================= START WEBSITE ================= */

loadCourses();
