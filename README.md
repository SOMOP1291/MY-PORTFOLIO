# Som Singh — Developer Portfolio

A fast, responsive, single-page portfolio built with plain HTML, CSS and JavaScript (no build step), with a dark/light theme, an animated background, direct Email and WhatsApp contact, and an optional AI assistant powered by Claude.

## Features

- **Sections:** Home, About, Skills, Projects, Experience, Services, Testimonials, Contact
- **Design:** Glass-style cards, dark/light theme (remembered between visits), constellation background, scroll-reveal animations, mobile menu, reduced-motion support
- **Contact:**
  - Clickable email, phone and WhatsApp links, plus copy buttons
  - Contact form with two send options: **Send by Email** (opens the visitor's mail app, with a Gmail fallback link) and **Send on WhatsApp** (opens a chat with the message pre-filled)
  - Optional direct-to-inbox delivery through Formspree
  - Spam trap and clear validation messages
- **AI (optional):**
  - Portfolio chat assistant that answers questions about you
  - "Improve with AI" button that polishes a visitor's draft message
  - Built-in answers take over automatically if AI is not set up or is offline
- **Quality:** Skip-to-content link, keyboard focus styles, lazy-loaded images, SEO meta tags and structured data

## Project structure

```
portfolio/
├── index.html                  # Page markup
├── css/
│   └── style.css               # All styles
├── js/
│   └── script.js               # All behaviour + the SITE config at the top
├── api/
│   ├── _core.js                # AI logic shared by both hosts (edit your facts here)
│   └── chat.js                 # Vercel serverless function  → /api/chat
├── netlify/
│   └── functions/
│       └── chat.js             # Netlify function            → /api/chat
├── netlify.toml                # Maps /api/* to Netlify functions
└── README.md
```

Put these files next to `index.html` (they are referenced by relative path):

| File | Used for |
|------|----------|
| `img.png` | About section photo |
| `college.png`, `E-commerce.png`, `HireNova.png`, `pathfinder.png` | Project thumbnails |
| `Som_Singh_Resume_Revised.docx` | Resume button |

## Run locally

No install needed for the basic site:

1. Open `index.html` in your browser (or use a local server such as the VS Code "Live Server" extension).
2. Everything works except the live AI, which falls back to built-in answers.

To test the AI locally, use your host's dev tool (requires Node.js 18 or newer):

```bash
# Netlify
npm i -g netlify-cli
ANTHROPIC_API_KEY=your_key netlify dev

# or Vercel
npm i -g vercel
vercel dev        # add ANTHROPIC_API_KEY to a local .env file first
```

## Customize

### 1. Your contact details

Open `js/script.js` and edit the `SITE` block at the top:

```js
var SITE = {
  name: "Som Singh",
  email: "you@example.com",
  phone: "+91 0000000000",
  whatsapp: "910000000000",   // country code + number, digits only (no + or spaces)
  formEndpoint: "",           // optional Formspree URL
  aiEndpoint: "/api/chat"
};
```

The WhatsApp number must be a number that has WhatsApp. If your email or phone also appears in the HTML as plain text, the script overwrites it from `SITE` when the page loads, so you only need to change it here (the HTML values are just a no-JavaScript fallback; update them too if you want them to match).

### 2. Content

Edit text directly in `index.html`: hero, about, skills, projects, experience, services and testimonials. Replace placeholder items (see the checklist below).

### 3. Colours and fonts

All colours, fonts and spacing are variables at the top of `css/style.css` (`:root` for dark, `html[data-theme="light"]` for light).

### 4. What the AI knows about you

Edit the `FACTS` text in `api/_core.js`, and the built-in fallback answers (`KB`) in `js/script.js`. Keep both consistent.

## Contact form setup

**No setup (default):** the email button opens the visitor's mail app addressed to you, and the WhatsApp button opens a chat with the message ready to send.

**Get messages directly in your inbox (optional):**

1. Create a free form at [formspree.io](https://formspree.io) and copy its endpoint URL.
2. Paste it into `SITE.formEndpoint` in `js/script.js`.
3. The "Send by Email" button will now submit in the background and show a success message.

## Turn on the AI

The browser never holds your API key. A small serverless function on your host calls the Anthropic API.

1. Get an API key from the [Anthropic Console](https://console.anthropic.com).
2. Deploy this folder to **Netlify** or **Vercel** (see below).
3. In the host dashboard, add environment variables:

   | Variable | Required | Description |
   |----------|----------|-------------|
   | `ANTHROPIC_API_KEY` | Yes | Your API key |
   | `ANTHROPIC_MODEL` | No | Model to use (default `claude-haiku-5-5`) |

4. Redeploy. When AI is live, the chat header changes from "Portfolio assistant" to **"AI assistant"** and the "Improve with AI" button appears in the contact form.

**Check it works:** open `https://your-site/api/chat` in a browser. You should see `{"ok":true,"ai":true}`. If `ai` is `false`, the key is missing or the site has not been redeployed since you added it.

## Deploy

**Netlify:** drag the folder into Netlify Drop, or connect a Git repo. `netlify.toml` already sets the functions folder and the `/api/*` redirect. Note that the drag-and-drop route does not run functions; use Git-based deploys or the Netlify CLI (`netlify deploy --prod`) for AI.

**Vercel:** import the repo or run `vercel --prod`. Files in `api/` become functions automatically.

**Any static host (GitHub Pages, etc.):** the site works fully, but without server functions the AI stays off and the built-in answers are used.

## Security and cost

- Never put your API key in `script.js` or any file served to the browser.
- The AI endpoint is public, so anyone could call it. Set a **monthly spend limit** on your Anthropic account. Requests are already capped in length, and replies are kept short.
- The contact form includes a hidden spam-trap field; add Formspree's spam protection if you receive junk.

## Before you launch (checklist)

- [ ] Replace placeholder testimonials, or remove the section if you do not have real ones
- [ ] Check the hero stats (years, projects, clients) and timeline dates match your real experience
- [ ] Replace the Atlas and Pathfinder projects, or add real links; fix the `#` links for **Source**, GitHub and Twitter
- [ ] Set your real domain in `<link rel="canonical">`, `og:url` and the JSON-LD block (currently `somsingh.dev`)
- [ ] Optionally add an `og:image` (a 1200×630 preview image) for nicer link previews on WhatsApp, LinkedIn and X
- [ ] Confirm the resume file name matches the link in the hero button
- [ ] Test the email and WhatsApp buttons on a phone

## Troubleshooting

| Problem | Fix |
|---------|-----|
| WhatsApp opens with a "number not on WhatsApp" message | Check `SITE.whatsapp`: digits only, with country code, and the number must have WhatsApp |
| Email button does nothing | The visitor has no mail app set up; they can use the "Compose in Gmail instead" link or the WhatsApp button |
| "Improve with AI" button is missing | AI is not live yet. Check `/api/chat` returns `"ai":true` |
| Chat still gives basic answers | Same as above, or the function failed; check your host's function logs |
| Images missing | Make sure the image files sit next to `index.html` with the exact names (names are case-sensitive on most hosts) |
| Theme resets on reload | The browser is blocking local storage (private mode); the site still works |

## Tech

HTML5, CSS3 (custom properties, grid, flexbox), vanilla JavaScript, Google Fonts (Space Grotesk, Inter, JetBrains Mono), Node.js serverless functions, Anthropic Messages API.
