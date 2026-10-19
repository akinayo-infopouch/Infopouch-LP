# InfoPouch Africa website

Plain HTML/CSS/JS, no build step. Content is edited in `/data`, not in code.

## Everyday edits
| I want to... | Edit |
|---|---|
| Add a blog article | `data/posts.json`: copy an entry, change `slug` (unique, no spaces), `title`, `date` (YYYY-MM-DD), `excerpt`, `body` (list of paragraphs). Optional `image`: path like `assets/my-photo.jpg` |
| Change the logo | Put the file in `assets/` and set `"logo"` in `data/site.json`. Add extra logos the same way. |
| Change email / menu / footer text | `data/site.json` |
| Change the waitlist link | `data/site.json`: `waitlistUrl` (currently the Fillout form). Leave empty to use an email-based form instead. |
| Change brand colors | Top of `css/style.css` (taken from Figma: plum #592740, gold #efaf00, dark #161616, lavender #f8f3ff) |
| Add photos (hero, About, Vision, Mission) | Put images in `assets/`, then set `--hero-img`, `--about-img`, `--vision-img`, `--mission-img`, `--future-img`, `--blog-hero-img` at the top of `css/style.css`, e.g. `url("../assets/about.jpg")` |
| Footer links | `footerColumns` in `data/site.json` |
| Edit page wording | `index.html`, `about.html` |

## Preview locally
`python3 -m http.server` in this folder, then open http://localhost:8000

## Publish (GitHub Pages)
Repo > Settings > Pages > Deploy from branch > `main` / root. Then add your custom domain there.
