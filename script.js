/* =====================================================
   EARNJOY - JAVASCRIPT
   ===================================================== */

let courses = [];
let activeCategory = "all";

const searchInput = document.getElementById("searchInput");
const coursesContainer = document.getElementById("coursesContainer");
const courseCount = document.getElementById("courseCount");
const categoryFilters = document.getElementById("categoryFilters");
const emptyState = document.getElementById("emptyState");
const emptyStateTitle = document.getElementById("emptyStateTitle");
const emptyStateText = document.getElementById("emptyStateText");
const clearFilters = document.getElementById("clearFilters");

async function loadCourses() {
    try {
        const response = await fetch("courses.json?v=" + Date.now(), {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Unable to load courses.json. HTTP Status: " + response.status);
        }

        const data = await response.json();

        if (!data || !Array.isArray(data.courses)) {
            throw new Error("Invalid courses.json structure.");
        }

        courses = data.courses;
        buildCategoryFilters(courses);
        displayCourses(courses);
    } catch (error) {
        console.error("EarnJoy loading error:", error);
        courseCount.textContent = "Unable to load";
        showEmptyState(
            "Courses could not be loaded",
            "Please refresh the page and try again."
        );
    }
}

function buildCategoryFilters(courseList) {
    const categories = [...new Set(
        courseList
            .map(course => course.category)
            .filter(Boolean)
    )].sort();

    categoryFilters.innerHTML = "";

    categories.forEach(category => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "category-filter";
        button.dataset.category = category;
        button.textContent = category;

        button.addEventListener("click", function() {
            setActiveCategory(category);
        });

        categoryFilters.appendChild(button);
    });
}

function setActiveCategory(category) {
    activeCategory = category;

    document.querySelectorAll(".category-filter").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.category === category
        );
    });

    applyFilters();
}

function applyFilters() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredCourses = courses.filter(course => {
        const matchesCategory =
            activeCategory === "all" ||
            (course.category || "").toLowerCase() === activeCategory.toLowerCase();

        if (!matchesCategory) {
            return false;
        }

        if (!searchTerm) {
            return true;
        }

        const searchableText = [
            course.name,
            course.description,
            course.category,
            course.subcategory,
            course.level,
            course.language,
            ...(Array.isArray(course.tags) ? course.tags : []),
            ...(Array.isArray(course.materials)
                ? course.materials.map(material => material.title)
                : [])
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return searchableText.includes(searchTerm);
    });

    displayCourses(filteredCourses, searchTerm);
}

function displayCourses(courseList, searchTerm = "") {
    coursesContainer.innerHTML = "";

    const count = courseList.length;
    courseCount.textContent = count === 1 ? "1 Course" : count + " Courses";

    if (count === 0) {
        const title = searchTerm
            ? "No courses match your search"
            : "No courses in this category";

        const text = searchTerm
            ? "Try another keyword or clear the filters."
            : "Choose another category to explore available courses.";

        showEmptyState(title, text);
        return;
    }

    hideEmptyState();

    courseList.forEach(course => {
        coursesContainer.appendChild(createCourseCard(course));
    });
}

function createCourseCard(course) {
    const card = document.createElement("a");
    card.className = "course-card";
    card.href = "course.html?id=" + encodeURIComponent(course.id);
    card.setAttribute("aria-label", "Open " + (course.name || "course"));

    const image = document.createElement("img");
    image.className = "course-image";
    image.src = course.image || "Logo.png";
    image.alt = course.name || "Course";
    image.loading = "lazy";
    image.decoding = "async";

    const courseInfo = document.createElement("div");
    courseInfo.className = "course-card-content";

    const provider = document.createElement("div");
    provider.className = "course-provider";

    const providerLogo = document.createElement("img");
    providerLogo.src = "Logo.png";
    providerLogo.alt = "EarnJoy";
    providerLogo.loading = "lazy";

    const providerName = document.createElement("span");
    providerName.textContent = course.provider || "EarnJoy";

    provider.appendChild(providerLogo);
    provider.appendChild(providerName);

    const title = document.createElement("h3");
    title.textContent = course.name || "Untitled Course";

    const description = document.createElement("p");
    description.className = "course-description";
    description.textContent = course.description || "";

    const meta = document.createElement("div");
    meta.className = "course-meta";

    const level = course.level || "Beginner";
    const duration = course.duration || (
        Array.isArray(course.materials)
            ? course.materials.length + " lessons"
            : "Self-paced"
    );

    meta.textContent = level + " · " + duration;

    const bottomRow = document.createElement("div");
    bottomRow.className = "course-bottom";

    const badge = document.createElement("span");
    badge.className = "course-badge";
    badge.textContent = course.category || "Course";

    bottomRow.appendChild(badge);

    courseInfo.appendChild(provider);
    courseInfo.appendChild(title);
    courseInfo.appendChild(description);
    courseInfo.appendChild(meta);
    courseInfo.appendChild(bottomRow);

    card.appendChild(image);
    card.appendChild(courseInfo);

    return card;
}

function showEmptyState(title, text) {
    emptyState.hidden = false;
    emptyStateTitle.textContent = title;
    emptyStateText.textContent = text;
    coursesContainer.hidden = true;
}

function hideEmptyState() {
    emptyState.hidden = true;
    coursesContainer.hidden = false;
}

function resetFilters() {
    activeCategory = "all";
    searchInput.value = "";

    document.querySelectorAll(".category-filter").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.category === "all"
        );
    });

    displayCourses(courses);
}

searchInput.addEventListener("input", applyFilters);
clearFilters.addEventListener("click", resetFilters);

const allCategoryButton = document.querySelector('.category-filter[data-category="all"]');
if (allCategoryButton) {
    allCategoryButton.addEventListener("click", resetFilters);
}

document.getElementById("currentYear").textContent =
    new Date().getFullYear();

loadCourses();

/* =====================================================
   BASIC SOURCE CODE PROTECTION
   ===================================================== */

document.addEventListener("contextmenu", function(event) {
    event.preventDefault();
});

document.addEventListener("keydown", function(event) {
    const key = event.key.toLowerCase();

    if (event.key === "F12") {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    if (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(key)) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    if (event.ctrlKey && key === "u") {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
});