import * as THREE from 'three';
import { characters } from './characters.js';
import { API_CONFIG, getGitHubToken, hasGitHubToken, checkPassword } from './config.js';

// Game state
const gameState = {
    isPlaying: false,
    isPaused: false,
    currentNPC: null,
    conversationHistory: [],
    nearbyNPC: null
};

// Player controls state
const controls = {
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    canJump: false,
    velocity: new THREE.Vector3(),
    direction: new THREE.Vector3()
};

// Three.js scene setup
let camera, scene, renderer;
let raycaster, clock;
let playerHeight = 2;
let moveSpeed = 8;

// NPCs
const npcObjects = [];

// Pointer lock
let isPointerLocked = false;

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1410);
    scene.fog = new THREE.Fog(0x1a1410, 0, 50);

    // Camera (first person)
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, playerHeight, 15);

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('game-canvas'),
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffa500, 0.3);
    scene.add(ambientLight);

    // Main chandelier light
    const pointLight = new THREE.PointLight(0xffaa00, 1.5, 30);
    pointLight.position.set(0, 8, 0);
    pointLight.castShadow = true;
    scene.add(pointLight);

    // Corner lights
    addLantern(-10, 5, -10);
    addLantern(10, 5, -10);
    addLantern(-10, 5, 10);
    addLantern(10, 5, 10);

    // Create the bar environment
    createBar();

    // Create NPCs
    createNPCs();

    // Raycaster for interaction detection
    raycaster = new THREE.Raycaster();
    raycaster.far = 3; // Interaction distance

    // Clock for delta time
    clock = new THREE.Clock();

    // Event listeners
    setupEventListeners();

    // Window resize
    window.addEventListener('resize', onWindowResize, false);

    // Start animation loop
    animate();
}

function addLantern(x, y, z) {
    const light = new THREE.PointLight(0xff8800, 0.8, 15);
    light.position.set(x, y, z);
    light.castShadow = true;
    scene.add(light);

    // Lantern visual
    const lanternGeometry = new THREE.BoxGeometry(0.3, 0.5, 0.3);
    const lanternMaterial = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        emissive: 0xff4400,
        emissiveIntensity: 0.5
    });
    const lantern = new THREE.Mesh(lanternGeometry, lanternMaterial);
    lantern.position.set(x, y, z);
    scene.add(lantern);
}

function createBar() {
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(30, 30);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a3520,
        roughness: 0.8,
        metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Walls
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0x5d4a3a,
        roughness: 0.9
    });

    // Back wall
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(30, 10, 0.5), wallMaterial);
    backWall.position.set(0, 5, -15);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Left wall
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 10, 30), wallMaterial);
    leftWall.position.set(-15, 5, 0);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 10, 30), wallMaterial);
    rightWall.position.set(15, 5, 0);
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    // Bar counter
    const barGeometry = new THREE.BoxGeometry(12, 1.2, 2);
    const barMaterial = new THREE.MeshStandardMaterial({
        color: 0x3d2817,
        roughness: 0.6,
        metalness: 0.1
    });
    const bar = new THREE.Mesh(barGeometry, barMaterial);
    bar.position.set(0, 1.2, 7);
    bar.castShadow = true;
    bar.receiveShadow = true;
    scene.add(bar);

    // Tables
    addTable(-8, 0);
    addTable(8, 0);
    addTable(0, -8);
    addTable(6, -6);
    addTable(-6, -6);

    // Barrels
    addBarrel(-12, -12);
    addBarrel(12, -12);
    addBarrel(-12, 10);
    addBarrel(12, 10);

    // Ceiling
    const ceilingGeometry = new THREE.PlaneGeometry(30, 30);
    const ceilingMaterial = new THREE.MeshStandardMaterial({
        color: 0x2d2416,
        roughness: 1
    });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 10;
    ceiling.receiveShadow = true;
    scene.add(ceiling);
}

function addTable(x, z) {
    const tableGroup = new THREE.Group();

    // Table top
    const topGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 8);
    const topMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a3520,
        roughness: 0.7
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = 1;
    top.castShadow = true;
    top.receiveShadow = true;
    tableGroup.add(top);

    // Table leg
    const legGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 8);
    const legMaterial = new THREE.MeshStandardMaterial({
        color: 0x3d2817,
        roughness: 0.8
    });
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.y = 0.5;
    leg.castShadow = true;
    tableGroup.add(leg);

    tableGroup.position.set(x, 0, z);
    scene.add(tableGroup);
}

function addBarrel(x, z) {
    const barrelGeometry = new THREE.CylinderGeometry(0.5, 0.6, 1.5, 8);
    const barrelMaterial = new THREE.MeshStandardMaterial({
        color: 0x5d4a3a,
        roughness: 0.8
    });
    const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
    barrel.position.set(x, 0.75, z);
    barrel.castShadow = true;
    barrel.receiveShadow = true;
    scene.add(barrel);
}

function createNPCs() {
    characters.forEach(char => {
        const npcGroup = new THREE.Group();

        // Body (cute rounded shape)
        const bodyGeometry = new THREE.CapsuleGeometry(0.4, 1, 8, 16);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: char.color,
            roughness: 0.7
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.2;
        body.castShadow = true;
        npcGroup.add(body);

        // Head
        const headGeometry = new THREE.SphereGeometry(0.35, 16, 16);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0xffdbac,
            roughness: 0.6
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2.2;
        head.castShadow = true;
        npcGroup.add(head);

        // Hat (Western style)
        const hatBrimGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.05, 16);
        const hatMaterial = new THREE.MeshStandardMaterial({
            color: char.hatColor,
            roughness: 0.8
        });
        const hatBrim = new THREE.Mesh(hatBrimGeometry, hatMaterial);
        hatBrim.position.y = 2.6;
        hatBrim.castShadow = true;
        npcGroup.add(hatBrim);

        const hatTopGeometry = new THREE.CylinderGeometry(0.3, 0.35, 0.4, 16);
        const hatTop = new THREE.Mesh(hatTopGeometry, hatMaterial);
        hatTop.position.y = 2.85;
        hatTop.castShadow = true;
        npcGroup.add(hatTop);

        // Position the NPC
        npcGroup.position.set(char.position.x, 0, char.position.z);

        // Store character data
        npcGroup.userData = {
            character: char,
            originalY: 0
        };

        scene.add(npcGroup);
        npcObjects.push(npcGroup);
    });
}

function setupEventListeners() {
    const startBtn = document.getElementById('start-btn');
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');
    const endConversationBtn = document.getElementById('end-conversation-btn');
    const passwordInput = document.getElementById('password-input');

    startBtn.addEventListener('click', startGame);
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    endConversationBtn.addEventListener('click', endConversation);

    // Allow Enter key on password field
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') startGame();
    });

    // Keyboard controls
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // Pointer lock
    document.addEventListener('click', () => {
        if (gameState.isPlaying && !gameState.isPaused) {
            document.body.requestPointerLock();
        }
    });

    document.addEventListener('pointerlockchange', () => {
        isPointerLocked = document.pointerLockElement === document.body;
    });

    // Mouse movement
    document.addEventListener('mousemove', onMouseMove);
}

function updatePasswordStatus(message, type) {
    const statusEl = document.getElementById('password-status');
    statusEl.textContent = message;
    statusEl.className = type;
}

function startGame() {
    const passwordInput = document.getElementById('password-input');
    const password = passwordInput.value.trim();

    // Check password
    if (!checkPassword(password)) {
        updatePasswordStatus('Incorrect password', 'error');
        passwordInput.value = '';
        passwordInput.focus();
        return;
    }

    // Check if token is configured
    if (!hasGitHubToken()) {
        updatePasswordStatus('Game not configured - contact admin', 'error');
        return;
    }

    // Password correct, start the game
    gameState.isPlaying = true;
    document.getElementById('instructions').classList.add('hidden');
    document.body.requestPointerLock();
}

function onKeyDown(event) {
    // Handle Escape key regardless of pause state
    if (event.code === 'Escape' && gameState.isPaused) {
        endConversation();
        return;
    }

    if (gameState.isPaused) return;

    switch (event.code) {
        case 'KeyW': controls.moveForward = true; break;
        case 'KeyS': controls.moveBackward = true; break;
        case 'KeyA': controls.moveLeft = true; break;
        case 'KeyD': controls.moveRight = true; break;
        case 'Space': if (controls.canJump) controls.velocity.y += 5; break;
        case 'KeyE':
            if (gameState.nearbyNPC && !gameState.isPaused) {
                startConversation(gameState.nearbyNPC);
            }
            break;
    }
}

function onKeyUp(event) {
    switch (event.code) {
        case 'KeyW': controls.moveForward = false; break;
        case 'KeyS': controls.moveBackward = false; break;
        case 'KeyA': controls.moveLeft = false; break;
        case 'KeyD': controls.moveRight = false; break;
    }
}

let euler = new THREE.Euler(0, 0, 0, 'YXZ');
let PI_2 = Math.PI / 2;

function onMouseMove(event) {
    if (!isPointerLocked || gameState.isPaused) return;

    const movementX = event.movementX || 0;
    const movementY = event.movementY || 0;

    euler.setFromQuaternion(camera.quaternion);
    euler.y -= movementX * 0.002;
    euler.x -= movementY * 0.002;
    euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x));
    camera.quaternion.setFromEuler(euler);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function startConversation(npc) {
    gameState.isPaused = true;
    gameState.currentNPC = npc;
    gameState.conversationHistory = [];

    const char = npc.userData.character;

    document.getElementById('npc-name').textContent = char.name;
    document.getElementById('npc-subtitle').textContent = char.subtitle;
    document.getElementById('conversation-panel').classList.remove('hidden');
    document.getElementById('interaction-prompt').classList.add('hidden');

    document.exitPointerLock();

    // Initial NPC greeting
    const greeting = char.conversationStarters[Math.floor(Math.random() * char.conversationStarters.length)];
    addMessage('npc', char.name, greeting);
    gameState.conversationHistory.push({
        role: 'assistant',
        content: greeting
    });

    // Focus chat input
    setTimeout(() => {
        document.getElementById('chat-input').focus();
    }, 100);
}

function endConversation() {
    gameState.isPaused = false;
    gameState.currentNPC = null;
    gameState.conversationHistory = [];

    document.getElementById('conversation-panel').classList.add('hidden');
    document.getElementById('chat-messages').innerHTML = '';
    document.getElementById('chat-input').value = '';

    document.body.requestPointerLock();
}

function addMessage(type, author, text) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const authorDiv = document.createElement('div');
    authorDiv.className = 'message-author';
    authorDiv.textContent = author;

    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = text;

    messageDiv.appendChild(authorDiv);
    messageDiv.appendChild(textDiv);
    messagesContainer.appendChild(messageDiv);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();

    if (!message || !gameState.currentNPC) return;

    const char = gameState.currentNPC.userData.character;

    // Add player message
    addMessage('player', 'You', message);
    gameState.conversationHistory.push({
        role: 'user',
        content: message
    });

    chatInput.value = '';

    // Get AI response
    const response = await getAIResponse(char, gameState.conversationHistory);

    addMessage('npc', char.name, response);
    gameState.conversationHistory.push({
        role: 'assistant',
        content: response
    });
}

async function getAIResponse(character, history) {
    // Try to use real AI if token is available
    if (hasGitHubToken()) {
        try {
            const response = await fetch(API_CONFIG.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getGitHubToken()}`
                },
                body: JSON.stringify({
                    model: API_CONFIG.model,
                    messages: [
                        {
                            role: 'system',
                            content: character.personality
                        },
                        ...history
                    ],
                    temperature: 0.9,
                    max_tokens: 200
                })
            });

            if (!response.ok) {
                console.error('API Error:', response.status, response.statusText);
                throw new Error(`API returned ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error calling GitHub Models API:', error);
            // Fall back to simulated responses
            return getFallbackResponse(character, history);
        }
    }

    // Use fallback responses if no token
    return getFallbackResponse(character, history);
}

function getFallbackResponse(character, history) {
    const userMessage = history[history.length - 1].content.toLowerCase();
    const responses = getCharacterResponses(character, userMessage);
    return responses[Math.floor(Math.random() * responses.length)];
}

function getCharacterResponses(character, userMessage) {
    // Default responses
    let responses = [];

    // Common topics
    if (userMessage.includes('name') || userMessage.includes('who')) {
        responses.push(`Name's ${character.name}. Been in these parts for quite a spell.`);
    }

    if (userMessage.includes('town') || userMessage.includes('place')) {
        responses.push(`This town's seen better days, but it's home.`);
    }

    if (userMessage.includes('story') || userMessage.includes('tell me')) {
        responses.push(`Well now, I've got plenty of stories. What would you like to hear about?`);
    }

    // Character-specific responses
    switch (character.id) {
        case 'sheriff':
            if (userMessage.includes('trouble') || userMessage.includes('law')) {
                responses.push(`I keep the peace around here. Been doin' it for 25 years now.`);
                responses.push(`Trouble? There's always trouble in a frontier town. But I handle it.`);
            }
            if (userMessage.includes('outlaw') || userMessage.includes('criminal')) {
                responses.push(`Dealt with my share of outlaws. Most of 'em are just scared kids playing tough.`);
            }
            if (userMessage.includes('gun') || userMessage.includes('shoot')) {
                responses.push(`I've drawn my gun more times than I care to count. Every time, I hoped I wouldn't have to use it.`);
            }
            break;

        case 'prospector':
            if (userMessage.includes('gold') || userMessage.includes('mine')) {
                responses.push(`Gold! Oh partner, I'm this close to strikin' it rich! I can feel it in my bones!`);
                responses.push(`Been pannin' and diggin' for forty years. The big one's out there, just waitin' to be found!`);
            }
            if (userMessage.includes('money') || userMessage.includes('rich')) {
                responses.push(`Rich? Not yet, but soon! Any day now, I'll find that mother lode!`);
            }
            if (userMessage.includes('give up') || userMessage.includes('quit')) {
                responses.push(`Give up? Never! A prospector who gives up ain't a prospector at all!`);
            }
            break;

        case 'saloon_girl':
            if (userMessage.includes('sing') || userMessage.includes('music')) {
                responses.push(`I sing here most evenings. It's honest work, and I have a good voice.`);
            }
            if (userMessage.includes('gossip') || userMessage.includes('secret')) {
                responses.push(`Oh honey, I know everyone's business in this town. But a lady doesn't tell tales... usually.`);
            }
            if (userMessage.includes('dream') || userMessage.includes('future')) {
                responses.push(`I'm saving every penny to open my own establishment in San Francisco. Somewhere respectable.`);
            }
            break;

        case 'gambler':
            if (userMessage.includes('card') || userMessage.includes('poker')) {
                responses.push(`Cards are like life - it's not about the hand you're dealt, but how you play it.`);
                responses.push(`I've won and lost fortunes at these tables. The secret is knowing when to fold.`);
            }
            if (userMessage.includes('luck') || userMessage.includes('chance')) {
                responses.push(`Luck is just probability wearing a fancy hat, friend.`);
            }
            if (userMessage.includes('cheat')) {
                responses.push(`I don't cheat. I don't need to. I just pay attention.`);
            }
            break;

        case 'bartender':
            if (userMessage.includes('drink') || userMessage.includes('whiskey')) {
                responses.push(`I serve the finest whiskey this side of the Mississippi. What's your poison?`);
            }
            if (userMessage.includes('fight') || userMessage.includes('trouble')) {
                responses.push(`Any trouble in my saloon gets dealt with quickly. I keep a Louisville Slugger behind the bar.`);
            }
            if (userMessage.includes('story') || userMessage.includes('people')) {
                responses.push(`Every soul in this saloon has a story. I've heard most of 'em, and they're all interesting in their own way.`);
            }
            break;

        case 'cowboy':
            if (userMessage.includes('ranch') || userMessage.includes('cattle')) {
                responses.push(`Been workin' cattle since I was sixteen! It's hard work but I love it!`);
                responses.push(`I'm gonna have my own ranch someday, just you wait and see!`);
            }
            if (userMessage.includes('gunfight') || userMessage.includes('outlaw')) {
                responses.push(`I've never been in a real gunfight, but I practice my draw every day!`);
            }
            if (userMessage.includes('advice')) {
                responses.push(`Advice? Well, I'm still learnin' myself, but I'd say always treat your horse right!`);
            }
            break;

        case 'mysterious_stranger':
            if (userMessage.includes('name') || userMessage.includes('who')) {
                responses.push(`Names aren't important. We're all just passing through.`);
            }
            if (userMessage.includes('past') || userMessage.includes('story')) {
                responses.push(`The past is a shadow we can't outrun, no matter how far we ride.`);
            }
            if (userMessage.includes('why')) {
                responses.push(`Why? Everyone's running from something or toward something. Sometimes both.`);
            }
            responses.push(`...`);
            responses.push(`Interesting question. I'll have to think on that.`);
            break;
    }

    // Fallback responses
    if (responses.length === 0) {
        responses = [
            `That's an interesting way to look at it.`,
            `Hmm, never thought about it quite that way.`,
            `You ask good questions, stranger.`,
            `Well, I suppose that's one way to see things.`,
            `Life out here teaches you all sorts of lessons.`
        ];
    }

    return responses;
}

function checkNearbyNPCs() {
    let closestNPC = null;
    let closestDistance = 3;

    npcObjects.forEach(npc => {
        const distance = camera.position.distanceTo(npc.position);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestNPC = npc;
        }
    });

    if (closestNPC !== gameState.nearbyNPC) {
        gameState.nearbyNPC = closestNPC;

        if (closestNPC && !gameState.isPaused) {
            document.getElementById('interaction-prompt').classList.remove('hidden');
        } else {
            document.getElementById('interaction-prompt').classList.add('hidden');
        }
    }
}

function animate() {
    requestAnimationFrame(animate);

    if (gameState.isPlaying && !gameState.isPaused) {
        const delta = clock.getDelta();

        // Movement
        controls.direction.z = Number(controls.moveForward) - Number(controls.moveBackward);
        controls.direction.x = Number(controls.moveRight) - Number(controls.moveLeft);
        controls.direction.normalize();

        const forward = new THREE.Vector3();
        const right = new THREE.Vector3();

        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        right.crossVectors(forward, new THREE.Vector3(0, 1, 0));

        const moveVector = new THREE.Vector3();
        moveVector.addScaledVector(forward, controls.direction.z);
        moveVector.addScaledVector(right, controls.direction.x);
        moveVector.normalize();

        if (controls.moveForward || controls.moveBackward) {
            camera.position.addScaledVector(moveVector, moveSpeed * delta * Math.abs(controls.direction.z));
        }
        if (controls.moveLeft || controls.moveRight) {
            camera.position.addScaledVector(moveVector, moveSpeed * delta * Math.abs(controls.direction.x));
        }

        // Boundary constraints
        camera.position.x = Math.max(-14, Math.min(14, camera.position.x));
        camera.position.z = Math.max(-14, Math.min(14, camera.position.z));
        camera.position.y = playerHeight;

        // Check for nearby NPCs
        checkNearbyNPCs();

        // Animate NPCs (gentle bobbing)
        const time = Date.now() * 0.001;
        npcObjects.forEach((npc, index) => {
            npc.position.y = Math.sin(time + index) * 0.05;
        });
    }

    renderer.render(scene, camera);
}

// Initialize the game
init();
