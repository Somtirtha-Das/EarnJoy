# EarnJoy

EarnJoy is a static learning platform for free courses, lectures and study resources.

## Repository structure

```text
/
├── index.html                    # Homepage
├── courses.html                  # All Courses catalogue
├── categories.html               # Course categories
├── roadmap.html                  # Learning roadmaps
├── resources.html                # Learning resources
├── faq.html                      # FAQ
├── about.html                    # About page
├── contact.html                  # Contact page
├── privacy.html                  # Privacy page
├── terms.html                    # Terms page
├── course.html                   # Legacy course URL redirect
│
├── courses/                      # Public course pages
│   └── <course-slug>/index.html
├── data/                         # Structured course data
│   └── courses.json
├── content/                      # Learning content
│   └── courses/<course-slug>/materials/
├── assets/                       # Reusable frontend assets
│   ├── css/style.css
│   ├── js/script.js
│   └── images/{branding,courses}/
├── scripts/                      # Maintenance/generation scripts
│   └── generate-sitemap.js
├── sitemap.xml
└── robots.txt
```

## Content management rules

- Add course pages under `courses/<course-slug>/index.html`.
- Store metadata in `data/courses.json`.
- Store PDFs/materials under `content/courses/<course-slug>/materials/`.
- Store course thumbnails under `assets/images/courses/`.
- Store branding images under `assets/images/branding/`.
- Keep shared CSS and JavaScript in `assets/css/` and `assets/js/`.
- Keep public top-level HTML pages at the repository root so existing URLs remain stable.
- Regenerate `sitemap.xml` after adding or removing courses.
