🕵️ Card Detective — Telegram Mini App
File Structure
detective-cards-tg/
├── index.html      ← main game page
├── style.css       ← styles (mobile + Telegram theme)
├── script.js       ← all game logic + Telegram WebApp SDK
├── images/         ← folder containing your icons (copy them from the original)
│   ├── background.jpg
│   ├── map.png
│   ├── magnifying-glass.png
│   ├── human.png
│   ├── alibi.png
│   ├── vision.png
│   └── lie.png
└── README.md
Step 1 — Deploy to GitHub Pages (Free)
Go to GitHub → Create a new repository
Name the repository, for example: detective-cards
Make it Public
Upload all files (index.html, style.css, script.js, and the images/ folder)
Go to Settings → Pages
Under Source, select Deploy from a branch → main → / (root)

Within a minute, your game will be available at:

https://YOUR_USERNAME.github.io/detective-cards/

Save this URL—you'll need it in Step 3.

Alternatives to GitHub Pages: Netlify or Vercel. Simply drag and drop your project folder to get an HTTPS URL in about 30 seconds.

Step 2 — Create a Bot with @BotFather
Open Telegram and search for @BotFather

Send the command:

/newbot
Choose a bot name (for example: Card Detective) and a username (for example: detective_cards_bot)
BotFather will provide a bot token. Save it and keep it secret.
Step 3 — Connect the Mini App to Your Bot

In your chat with @BotFather, send:

/newapp

BotFather will ask for:

Select your bot
Title → Card Detective
Description → Solve the crime in 30 turns
Photo → Upload any 640×360 image
GIF → Skip by sending /empty

Web App URL → Paste your GitHub Pages URL:

https://YOUR_USERNAME.github.io/detective-cards/

Your Mini App is now ready!

Step 4 — Add a Menu Button to the Bot (Optional)

To add a button that launches the game:

/setmenubutton
Select your bot
Enter the game URL

Enter the button text:

🕵️ Play
Step 5 — Launch and Test
Find your bot in Telegram.

Tap the menu button or send:

/start
Tap 🕵️ Play.

The game will open directly inside Telegram!

Telegram Features
Feature	Status
Full-screen mode	✅
Telegram theme (light/dark)	✅
Native Telegram MainButton ("Make an Accusation")	✅
Haptic feedback (iOS/Android)	✅
Confirmation before accidental exit	✅
Safe area support (notch/home indicator)	✅
Works in a regular web browser	✅
Versions
Version	Changes
beta 1.0	Witnesses, foreign names, events, map
beta 2.0	6 suspects, matching initials, SVG map, distance calculations
beta 3.0	Difficulty levels, turn limit, inventory, Telegram Mini App