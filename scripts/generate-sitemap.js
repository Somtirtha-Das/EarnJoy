const fs = require("fs");
const path = require("path");

const SITE_URL = "https://earnjoy.das105070.workers.dev";
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "courses.json"), "utf8"));

const urls = [
    { loc: "/", changefreq: "weekly", priority: "1.0" },
    { loc: "/courses.html", changefreq: "weekly", priority: "0.9" },
    { loc: "/categories.html", changefreq: "weekly", priority: "0.8" },
    { loc: "/roadmap.html", changefreq: "monthly", priority: "0.8" },
    { loc: "/resources.html", changefreq: "weekly", priority: "0.8" },
    { loc: "/faq.html", changefreq: "monthly", priority: "0.6" },
    { loc: "/about.html", changefreq: "monthly", priority: "0.5" },
    { loc: "/contact.html", changefreq: "monthly", priority: "0.4" },
    { loc: "/privacy.html", changefreq: "yearly", priority: "0.3" },
    { loc: "/terms.html", changefreq: "yearly", priority: "0.3" }
];

for (const course of data.courses || []) {
    const slug = course.slug || course.id;
    if (!slug) continue;
    urls.push({
        loc: "/courses/" + encodeURIComponent(slug) + "/",
        changefreq: "weekly",
        priority: course.featured ? "0.9" : "0.8"
    });
}

const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(item => [
        "    <url>",
        "        <loc>" + SITE_URL + item.loc + "</loc>",
        "        <changefreq>" + item.changefreq + "</changefreq>",
        "        <priority>" + item.priority + "</priority>",
        "    </url>"
    ].join("\n")),
    "</urlset>",
    ""
].join("\n");

fs.writeFileSync(path.join(__dirname, "..", "sitemap.xml"), xml, "utf8");
console.log("Generated sitemap for " + urls.length + " URLs.");
