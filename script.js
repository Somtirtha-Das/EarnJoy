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


        /* Display courses */

        displayCourses(courses);

    }

    catch (error) {

        console.error(
            "EarnJoy loading error:",
            error
        );

        courseCount.textContent =
            "0 Courses";

    }

}


/* ================= DISPLAY COURSES ================= */

function displayCourses(courseList) {

    coursesContainer.innerHTML = "";


    /* Update course count */

    const count = courseList.length;

    courseCount.textContent =
        count === 1
            ? "1 Course"
            : `${count} Courses`;


    /* No courses */

    if (courseList.length === 0) {

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

    /* Make entire course card clickable */

    card.addEventListener("click", () => {

        window.location.href =
            "course.html?id=" + encodeURIComponent(course.id);

    });


    /* ================= COURSE IMAGE ================= */

    const image =
        document.createElement("img");

    image.className =
        "course-image";

    image.src =
        course.image || "Logo.png";

    image.alt =
        course.name;


    /* ================= COURSE INFO ================= */

    const courseInfo =
        document.createElement("div");

    courseInfo.className =
        "course-info";


    /* ================= PROVIDER ================= */

    const provider =
        document.createElement("div");

    provider.className =
        "course-provider";


    const providerLogo =
        document.createElement("img");

    providerLogo.src =
        "Logo.png";

    providerLogo.alt =
        "EarnJoy";

    providerLogo.className =
        "provider-logo";


    const providerName =
        document.createElement("span");

    providerName.textContent =
        "EarnJoy";


    provider.appendChild(
        providerLogo
    );

    provider.appendChild(
        providerName
    );


    /* ================= COURSE TITLE ================= */

    const title =
        document.createElement("h3");

    title.textContent =
        course.name;


    /* ================= COURSE META ================= */

    const meta =
        document.createElement("div");

    meta.className =
        "course-meta";

    meta.textContent =
        "Beginner · Course";


    /* ================= COURSE BADGE ================= */

    const badge =
        document.createElement("span");

    badge.className =
        "course-badge";

    badge.textContent =
        "30 Days Course";


    /* ================= BUILD CARD ================= */

    courseInfo.appendChild(
        provider
    );

    courseInfo.appendChild(
        title
    );

    courseInfo.appendChild(
        meta
    );

    const bottomRow =
        document.createElement("div");

    bottomRow.className =
        "course-bottom";

    bottomRow.appendChild(
        badge
    );

    courseInfo.appendChild(
        bottomRow
    );

    card.appendChild(
        image
    );

    card.appendChild(
        courseInfo
    );


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
