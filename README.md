# Western Bar Tales - An AI-Powered 3D Adventure Game

A 3D Western saloon game where you can walk around and have AI-powered conversations with unique characters, each with their own personality and backstory.

## Features

- **3D Environment**: Walk around a Western saloon with atmospheric lighting and decorations
- **First-Person Controls**: WASD movement and mouse look
- **7 Unique Characters**: Each with distinct personalities, backstories, and conversation styles
- **AI-Powered Conversations**: Dynamic responses based on character personalities
- **Cute Modern Graphics**: Simple but charming 3D character models

## Characters

1. **Sheriff Clayton** - The weathered lawman who's seen it all
2. **Old Pete** - The optimistic gold prospector chasing his dreams
3. **Miss Rose** - The sharp-witted saloon entertainer
4. **Ace Malone** - The mysterious professional gambler
5. **Big Jim** - The friendly bartender who knows everyone's secrets
6. **Tommy "Kid" Brooks** - The eager young ranch hand
7. **The Stranger** - A mysterious figure with a dark past

## How to Run

### Option 1: Using npm (recommended)

```bash
npm install
npm run dev
```

Then open your browser to the URL shown (usually http://localhost:5173)

### Option 2: Simple HTTP Server

If you have Python installed:

```bash
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## Deployment

### Deploy to GitHub Pages

To deploy the game to GitHub Pages:

```bash
npm run deploy
```

This will build the project and deploy it to the `gh-pages` branch. After deployment, the game will be available at:
`https://[your-username].github.io/ai-game/`

Make sure GitHub Pages is enabled in your repository settings and set to use the `gh-pages` branch.

## Controls

- **WASD** - Move around the saloon
- **Mouse** - Look around (click to lock pointer)
- **E** - Start conversation with nearby character
- **ESC** - Exit conversation
- **Type and Enter** - Send messages during conversations

## How to Play

1. Click "Enter the Saloon" to start
2. Click anywhere to lock your mouse pointer for looking around
3. Use WASD to walk around the bar
4. When you get close to a character, you'll see "Press E to talk"
5. Press E to start a conversation
6. Type your messages and press Enter or click Send
7. Press ESC or click "Walk Away" to end the conversation
8. Explore and talk to all 7 characters to learn their stories!

## AI-Powered Conversations

The game features real AI-powered conversations using **GitHub Models** with GPT-4o-mini!

### Access

This game is password-protected. Enter the password on the start screen to play.

### How It Works

- Each of the 7 characters uses **GPT-4o-mini** (the cheapest GitHub Models option)
- Characters respond with their unique personalities and backstories
- The AI remembers your conversation history with each character
- Conversations feel natural and dynamic

The game uses the [GitHub Models API](https://docs.github.com/en/github-models) for all AI interactions.

### Setup (For Repository Owner)

To configure your own instance:

1. **Get a GitHub Token**:
   - Go to [github.com/settings/tokens](https://github.com/settings/tokens)
   - Click "Generate new token" → "Fine-grained personal access token"
   - Give it a name (e.g., "Western Bar Game")
   - Under "Permissions", enable **`models:read`**
   - Generate and copy your token (starts with `github_pat_...`)

2. **Configure the Game**:
   - Open `config.js`
   - Replace `YOUR_GITHUB_TOKEN_HERE` with your actual token
   - Change the `GAME_PASSWORD` if desired (default: "joplin")
   - Deploy the game

3. **Share the Password**:
   - Only share the password with people you trust
   - This prevents random users from consuming your API quota

**Cost**: GitHub Models charges $0.00001 USD per token unit. A typical conversation message costs fractions of a cent.

## Customization

### Adding New Characters

Edit `characters.js` and add new character objects with:
- `id`: Unique identifier
- `name`: Character's display name
- `subtitle`: Short description
- `position`: {x, z} coordinates in the bar
- `color`: Body color (hex)
- `hatColor`: Hat color (hex)
- `personality`: Full personality description for AI
- `conversationStarters`: Array of possible greetings

### Modifying the Environment

Edit the `createBar()` function in `game.js` to add or modify:
- Tables, barrels, and decorations
- Lighting and atmosphere
- Room size and layout

## Technologies Used

- **Three.js** - 3D graphics and rendering
- **Vite** - Build tool and dev server
- **Vanilla JavaScript** - Game logic

## Future Enhancements

- Real AI integration with Anthropic's Claude API
- More complex character models and animations
- Additional rooms and areas to explore
- Character memory of past conversations
- Quest system with character-specific stories
- Sound effects and background music
- Character emotions and reactions

## License

MIT

---

Enjoy your adventure in the Old West! 🤠
