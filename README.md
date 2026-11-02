# omidtarabavar.github.io

Source for my personal academic website: [omidtarabavar.github.io](https://omidtarabavar.github.io).

A static site with no build step and three pages:

| File | Page |
|---|---|
| `index.html` | Home: introduction, research interests, recent news, contact |
| `research.html` | Publications and projects |
| `cv.html` | Education, teaching, experience, honors, and skills |

Styles are in `css/styles.css` and behavior (theme toggle, mobile menu, copy buttons) is in `js/main.js`.

## Updating

- **Text:** edit the page directly. The sidebar is repeated in all three files, so change it in each one.
- **CV PDF:** replace `cv/Omid_Tarabavar_CV.pdf` and keep the same file name, so every link keeps working.
- **News:** add a new `<li>` at the top of the "Recently" list in `index.html`.
- **Footer date:** update "Last updated" at the bottom of each page.

To preview locally, open `index.html` in a browser, or run `python -m http.server` in this folder and visit `http://localhost:8000`.
