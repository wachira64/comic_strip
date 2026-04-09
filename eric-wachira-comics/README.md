# Eric Wachira — Comics Website

A self-contained comic reader website. No framework, no build step.
Open `index.html` in a browser and it works.

---

## Folder structure

```
eric-wachira-comics/
│
├── index.html              ← The website shell (don't need to edit this)
├── css/
│   └── styles.css          ← All visual styles
├── js/
│   ├── comics.js           ← YOUR LIBRARY DATA — edit this to add comics
│   └── app.js              ← Reader logic (don't need to edit this)
│
├── two-bag-rule/
│   ├── cover.jpg           ← Cover image shown on the library card
│   ├── panel-01.jpg
│   ├── panel-02.jpg
│   └── ...panel-15.jpg
│
└── eco-the-elephant/       ← Placeholder folder for next comic
```

---

## How to add a new comic

**Step 1 — Prepare your images**
- Export each panel as a JPG, named `panel-01.jpg`, `panel-02.jpg`, etc.
- Make a `cover.jpg` (a wide crop of your best panel, roughly 4:3 ratio)
- Recommended width: 900px. Quality: 85%

**Step 2 — Create the folder**
- Create a new folder with a short slug name, e.g. `eco-the-elephant`
- Drop all your panel images + cover.jpg inside it

**Step 3 — Add to comics.js**
Open `js/comics.js` and add a new entry to the COMICS array:

```js
{
  slug:    'eco-the-elephant',    // must match your folder name exactly
  status:  'available',          // change from 'coming-soon' to 'available'
  title:   'Meet Eco the Elephant',
  tag:     'Environment · Wildlife',
  author:  'Eric Wachira',
  desc:    'A short description of the comic.',
  panels:  12,                   // how many panels you have
  captions: [
    { title: "Scene-setting narration here.", caption: "Character dialogue or action text here." },
    { title: "...", caption: "..." },
    // one object per panel
  ]
}
```

**Step 4 — Deploy**
- Zip the entire `eric-wachira-comics` folder
- Go to netlify.com/drop
- Drag and drop the zip — you get a live URL instantly
- To update: drag the new zip again, same URL updates automatically

---

## Running locally in VS Code

1. Install the **Live Server** extension (by Ritwick Dey)
2. Right-click `index.html` → Open with Live Server
3. Your browser opens with hot-reload as you edit

---

## Keyboard shortcuts (reader)

| Key          | Action         |
|--------------|----------------|
| → Arrow      | Next panel     |
| ← Arrow      | Prev panel     |
| Space        | Next panel     |
| Escape       | Back to landing|

Swipe left/right works on mobile too.
