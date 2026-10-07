/* =====================================================
   EARNJOY - SHARED COURSE DISCOVERY JAVASCRIPT
   ===================================================== */

let courses = [];

const searchInput = document.getElementById("searchInput");
const featuredCourses = document.getElementById("featuredCourses");
const homeSearchForm = document.getElementById("homeSearchForm");
const courseGrid = document.getElementById("courseGrid");
const courseCount = document.getElementById("courseCount");
const emptyState = document.getElementById("emptyState");
const emptyStateTitle = document.getElementById("emptyStateTitle");
const emptyStateText = document.getElementById("emptyStateText");

const FALLBACK_COURSES = [
    {
        "id": "stock-market",
        "slug": "stock-market",
        "name": "Stock Market",
        "description": "Learn the fundamentals of financial markets, investing and the stock market.",
        "category": "Finance",
        "subcategory": "Stock Market",
        "level": "Beginner",
        "duration": "30 Days",
        "language": "English",
        "provider": "EarnJoy",
        "featured": true,
        "thumbnailAlt": "Stock Market learning course thumbnail",
        "tags": [
            "stock market",
            "investing",
            "financial markets",
            "finance",
            "trading",
            "wealth"
        ],
        "icon": "📈",
        "image": "assets/images/courses/stock-market.jpg",
        "materials": [
            {
                "title": "Day 1 - Introduction to Financial Markets",
                "pdf": "content/courses/stock-market/materials/day-01.pdf"
            },
            {
                "title": "Financial Markets Day 2",
                "pdf": "content/courses/stock-market/materials/day-02.pdf"
            },
            {
                "title": "Financial Markets Day 3",
                "pdf": "content/courses/stock-market/materials/day-03.pdf"
            },
            {
                "title": "Financial Markets Day 4",
                "pdf": "content/courses/stock-market/materials/day-04.pdf"
            },
            {
                "title": "Financial Markets Day 5",
                "pdf": "content/courses/stock-market/materials/day-05.pdf"
            },
            {
                "title": "Financial Markets Day 6",
                "pdf": "content/courses/stock-market/materials/day-06.pdf"
            },
            {
                "title": "Financial Markets Day 7",
                "pdf": "content/courses/stock-market/materials/day-07.pdf"
            },
            {
                "title": "Financial Markets Day 8",
                "pdf": "content/courses/stock-market/materials/day-08.pdf"
            },
            {
                "title": "Financial Markets Day 9",
                "pdf": "content/courses/stock-market/materials/day-09.pdf"
            },
            {
                "title": "Financial Markets Day 10",
                "pdf": "content/courses/stock-market/materials/day-10.pdf"
            },
            {
                "title": "Financial Markets Day 11",
                "pdf": "content/courses/stock-market/materials/day-11.pdf"
            },
            {
                "title": "Financial Markets Day 12",
                "pdf": "content/courses/stock-market/materials/day-12.pdf"
            },
            {
                "title": "Financial Markets Day 13",
                "pdf": "content/courses/stock-market/materials/day-13.pdf"
            },
            {
                "title": "Financial Markets Day 14",
                "pdf": "content/courses/stock-market/materials/day-14.pdf"
            },
            {
                "title": "Financial Markets Day 15",
                "pdf": "content/courses/stock-market/materials/day-15.pdf"
            },
            {
                "title": "Financial Markets Day 16",
                "pdf": "content/courses/stock-market/materials/day-16.pdf"
            },
            {
                "title": "Financial Markets Day 17",
                "pdf": "content/courses/stock-market/materials/day-17.pdf"
            },
            {
                "title": "Financial Markets Day 18",
                "pdf": "content/courses/stock-market/materials/day-18.pdf"
            },
            {
                "title": "Financial Markets Day 19",
                "pdf": "content/courses/stock-market/materials/day-19.pdf"
            },
            {
                "title": "Financial Markets Day 20",
                "pdf": "content/courses/stock-market/materials/day-20.pdf"
            },
            {
                "title": "Financial Markets Day 21",
                "pdf": "content/courses/stock-market/materials/day-21.pdf"
            },
            {
                "title": "Financial Markets Day 22",
                "pdf": "content/courses/stock-market/materials/day-22.pdf"
            },
            {
                "title": "Financial Markets Day 23",
                "pdf": "content/courses/stock-market/materials/day-23.pdf"
            },
            {
                "title": "Financial Markets Day 24",
                "pdf": "content/courses/stock-market/materials/day-24.pdf"
            },
            {
                "title": "Financial Markets Day 25",
                "pdf": "content/courses/stock-market/materials/day-25.pdf"
            },
            {
                "title": "Financial Markets Day 26",
                "pdf": "content/courses/stock-market/materials/day-26.pdf"
            },
            {
                "title": "Financial Markets Day 27",
                "pdf": "content/courses/stock-market/materials/day-27.pdf"
            },
            {
                "title": "Financial Markets Day 28",
                "pdf": "content/courses/stock-market/materials/day-28.pdf"
            },
            {
                "title": "Financial Markets Day 29",
                "pdf": "content/courses/stock-market/materials/day-29.pdf"
            },
            {
                "title": "Financial Markets Day 30",
                "pdf": "content/courses/stock-market/materials/day-30.pdf"
            }
        ]
    }
];

async function loadCourses() {
    try {
        const paths = [
            window.location.origin + "/data/courses.json",
            "data/courses.json"
        ];
        let loadedData = null;
        let lastError = null;

        for (const path of paths) {
            try {
                const response = await fetch(path + (path.includes("?") ? "&" : "?") + "v=" + Date.now(), { cache: "no-store" });
                if (!response.ok) throw new Error("HTTP " + response.status);
                const data = await response.json();
                if (!data || !Array.isArray(data.courses)) throw new Error("Invalid courses.json structure");
                loadedData = data;
                break;
            } catch (error) {
                lastError = error;
            }
        }

        if (!loadedData) {
            console.warn("EarnJoy course data endpoint unavailable; using built-in catalogue fallback.", lastError);
            loadedData = { courses: FALLBACK_COURSES };
        }

        courses = loadedData.courses;

        if (featuredCourses) displayFeaturedCourses(courses.filter(course => course.featured));
        if (courseGrid) initializeCoursesPage();
    } catch (error) {
        console.error("EarnJoy loading error:", error);
        if (courseGrid) {
            courseCount.textContent = "Unable to load";
            showEmptyState("Courses could not be loaded", "Please refresh the page and try again.");
        }
    }
}

function courseUrl(course) {
    return "courses/" + encodeURIComponent(course.slug || course.id) + "/";
}

function searchableCourseText(course) {
    return [
        course.name, course.description, course.category, course.subcategory,
        course.level, course.language, course.provider,
        ...(Array.isArray(course.tags) ? course.tags : []),
        ...(Array.isArray(course.materials) ? course.materials.map(material => material.title) : [])
    ].filter(Boolean).join(" ").toLowerCase();
}

function displayFeaturedCourses(courseList) {
    featuredCourses.innerHTML = "";
    const list = courseList.slice(0, 4);

    if (!list.length) {
        featuredCourses.innerHTML = '<div class="empty-state"><h3>No featured courses yet</h3><p>Featured learning options will appear here as courses are published.</p></div>';
        return;
    }

    list.forEach(course => featuredCourses.appendChild(createCourseCard(course, true)));
}

function createCourseCard(course, featured = false) {
    const card = document.createElement("a");
    card.className = "course-card" + (featured ? " featured-card" : "");
    card.href = courseUrl(course);
    card.setAttribute("aria-label", "Open " + (course.name || "course"));

    const image = document.createElement("img");
    image.className = "course-image";
    image.src = course.image || "assets/images/branding/Logo.png";
    image.alt = course.thumbnailAlt || course.name || "Course";
    image.width = 800;
    image.height = 500;
    image.loading = featured ? "eager" : "lazy";
    image.decoding = "async";

    const courseInfo = document.createElement("div");
    courseInfo.className = "course-card-content";

    const provider = document.createElement("div");
    provider.className = "course-provider";

    const providerLogo = document.createElement("img");
    providerLogo.src = "assets/images/branding/Logo.png";
    providerLogo.alt = "";
    providerLogo.width = 45;
    providerLogo.height = 45;
    providerLogo.loading = "lazy";

    const providerName = document.createElement("span");
    providerName.textContent = course.provider || "EarnJoy";

    provider.append(providerLogo, providerName);

    const title = document.createElement("h3");
    title.textContent = course.name || "Untitled Course";

    const description = document.createElement("p");
    description.className = "course-description";
    description.textContent = course.description || "";

    const meta = document.createElement("div");
    meta.className = "course-meta";
    meta.textContent = (course.level || "Beginner") + " · " +
        (course.duration || (Array.isArray(course.materials) ? course.materials.length + " lessons" : "Self-paced"));

    const bottomRow = document.createElement("div");
    bottomRow.className = "course-bottom";

    const badge = document.createElement("span");
    badge.className = "course-badge";
    badge.textContent = course.category || "Course";
    bottomRow.appendChild(badge);

    courseInfo.append(provider, title, description, meta, bottomRow);
    card.append(image, courseInfo);
    return card;
}

function initializeCoursesPage() {
    populateFilterOptions();

    const params = new URLSearchParams(window.location.search);
    const searchTerm = params.get("search") || "";
    const category = params.get("category") || "";
    const subcategory = params.get("subcategory") || "";
    const level = params.get("level") || "";
    const duration = params.get("duration") || "";
    const featured = params.get("featured") === "true";
    const sort = params.get("sort") || "recommended";

    document.getElementById("courseSearch").value = searchTerm;
    document.getElementById("categoryFilter").value = findOptionValue("categoryFilter", category);
    document.getElementById("subcategoryFilter").value = findOptionValue("subcategoryFilter", subcategory);
    document.getElementById("levelFilter").value = findOptionValue("levelFilter", level);
    document.getElementById("durationFilter").value = duration;
    document.getElementById("featuredFilter").checked = featured;
    document.getElementById("sortCourses").value = sort;

    document.getElementById("courseSearch").addEventListener("input", applyCourseFilters);
    ["categoryFilter", "subcategoryFilter", "levelFilter", "durationFilter", "sortCourses"].forEach(id => {
        document.getElementById(id).addEventListener("change", applyCourseFilters);
    });
    document.getElementById("featuredFilter").addEventListener("change", applyCourseFilters);
    document.getElementById("clearCourseFilters").addEventListener("click", clearCourseFilters);

    applyCourseFilters();
}

function uniqueSortedValues(field) {
    return [...new Set(courses.map(course => course[field]).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function populateSelect(id, values, placeholder) {
    const select = document.getElementById(id);
    select.innerHTML = "";

    const first = document.createElement("option");
    first.value = "";
    first.textContent = placeholder;
    select.appendChild(first);

    values.forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    });
}

function populateFilterOptions() {
    populateSelect("categoryFilter", uniqueSortedValues("category"), "All Categories");
    populateSelect("subcategoryFilter", uniqueSortedValues("subcategory"), "All Subcategories");
    populateSelect("levelFilter", uniqueSortedValues("level"), "All Levels");

    document.getElementById("durationFilter").innerHTML = [
        '<option value="">All Durations</option>',
        '<option value="short">Up to 7 Days</option>',
        '<option value="medium">8–15 Days</option>',
        '<option value="long">16–30 Days</option>',
        '<option value="extended">31+ Days</option>'
    ].join("");
}

function findOptionValue(id, value) {
    if (!value) return "";
    const select = document.getElementById(id);
    const option = [...select.options].find(item => item.value.toLowerCase() === value.toLowerCase());
    return option ? option.value : "";
}

function durationDays(course) {
    const match = String(course.duration || "").match(/\d+/);
    if (match) return Number(match[0]);
    if (Array.isArray(course.materials) && course.materials.length) return course.materials.length;
    return null;
}

function matchesDuration(course, filter) {
    if (!filter) return true;
    const days = durationDays(course);
    if (days === null) return false;
    if (filter === "short") return days <= 7;
    if (filter === "medium") return days >= 8 && days <= 15;
    if (filter === "long") return days >= 16 && days <= 30;
    if (filter === "extended") return days >= 31;
    return true;
}

function sortCourses(courseList, sort) {
    return [...courseList].sort((a, b) => {
        if (sort === "az") return (a.name || "").localeCompare(b.name || "");
        if (sort === "duration-short") return (durationDays(a) ?? Number.MAX_SAFE_INTEGER) - (durationDays(b) ?? Number.MAX_SAFE_INTEGER);
        if (sort === "duration-long") return (durationDays(b) ?? -1) - (durationDays(a) ?? -1);

        const featuredDifference = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
        return featuredDifference || (a.name || "").localeCompare(b.name || "");
    });
}

function applyCourseFilters() {
    const searchTerm = document.getElementById("courseSearch").value.trim().toLowerCase();
    const category = document.getElementById("categoryFilter").value;
    const subcategory = document.getElementById("subcategoryFilter").value;
    const level = document.getElementById("levelFilter").value;
    const duration = document.getElementById("durationFilter").value;
    const featuredOnly = document.getElementById("featuredFilter").checked;
    const sort = document.getElementById("sortCourses").value;

    let filtered = courses.filter(course =>
        (!searchTerm || searchableCourseText(course).includes(searchTerm)) &&
        (!category || course.category === category) &&
        (!subcategory || course.subcategory === subcategory) &&
        (!level || course.level === level) &&
        matchesDuration(course, duration) &&
        (!featuredOnly || course.featured === true)
    );

    filtered = sortCourses(filtered, sort);
    displayCourseResults(filtered, searchTerm);
    updateCourseUrl(searchTerm, category, subcategory, level, duration, featuredOnly, sort);
}

function displayCourseResults(courseList, searchTerm) {
    courseGrid.innerHTML = "";
    const count = courseList.length;
    courseCount.textContent = count === 1 ? "1 Course" : count + " Courses";

    if (!count) {
        showEmptyState(
            searchTerm ? "No courses match your search" : "No courses match these filters",
            "Try another keyword or clear one or more filters to explore the catalogue."
        );
        return;
    }

    hideEmptyState();
    courseList.forEach(course => courseGrid.appendChild(createCourseCard(course)));
}

function showEmptyState(title, text) {
    emptyState.hidden = false;
    emptyStateTitle.textContent = title;
    emptyStateText.textContent = text;
    courseGrid.hidden = true;
}

function hideEmptyState() {
    emptyState.hidden = true;
    courseGrid.hidden = false;
}

function updateCourseUrl(searchTerm, category, subcategory, level, duration, featured, sort) {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (category) params.set("category", category);
    if (subcategory) params.set("subcategory", subcategory);
    if (level) params.set("level", level);
    if (duration) params.set("duration", duration);
    if (featured) params.set("featured", "true");
    if (sort && sort !== "recommended") params.set("sort", sort);

    const query = params.toString();
    window.history.replaceState({}, "", window.location.pathname + (query ? "?" + query : ""));
}

function clearCourseFilters() {
    document.getElementById("courseSearch").value = "";
    document.getElementById("categoryFilter").value = "";
    document.getElementById("subcategoryFilter").value = "";
    document.getElementById("levelFilter").value = "";
    document.getElementById("durationFilter").value = "";
    document.getElementById("featuredFilter").checked = false;
    document.getElementById("sortCourses").value = "recommended";
    applyCourseFilters();
}

if (homeSearchForm) {
    homeSearchForm.addEventListener("submit", event => {
        event.preventDefault();
        const value = searchInput.value.trim();
        window.location.href = value ? "courses.html?search=" + encodeURIComponent(value) : "courses.html";
    });
}

const currentYear = document.getElementById("currentYear");
if (currentYear) currentYear.textContent = new Date().getFullYear();

loadCourses();

/* Basic source-code deterrence; not a security boundary. */
document.addEventListener("contextmenu", event => event.preventDefault());
document.addEventListener("keydown", event => {
    const key = event.key.toLowerCase();
    if (event.key === "F12" ||
        (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(key)) ||
        (event.ctrlKey && key === "u")) {
        event.preventDefault();
        event.stopPropagation();
    }
});