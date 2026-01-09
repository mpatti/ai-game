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

## AI Integration Note

The current version uses simulated AI responses with character-specific patterns. To integrate real AI (like Claude API):

1. Get an API key from Anthropic
2. Replace the `getAIResponse` function in `game.js` with actual API calls
3. Use the character's `personality` field as the system prompt

Example integration:

```javascript
async function getAIResponse(character, history) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'YOUR_API_KEY',
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            system: character.personality,
            messages: history
        })
    });
    const data = await response.json();
    return data.content[0].text;
}
```

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
