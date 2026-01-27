# Webmeji ৻(  •̀ ᗜ •́  ৻)
Little creatures that walk around your website =w=b <br>
Inspired by [shimeji desktop buddy](https://kilkakon.com/shimeji/),
not affiliated with any other shimeji projects <br>

Put together by: Lars de Rooij <br>
Last updated: 27 january 2026 <br>
Homepage & live demo: [webmeji.neocities.org](https://webmeji.neocities.org/) 

(Though it should all work everywhere, it's been developed on: windows & android chrome-based browsers, both mobile and desktop.)

# Webmeji can:
- Walk around on the bottom, where it randomly decides to; stand still, sit on the ground, do a little dance, or trip! 
- Jump up to the side and/or top edges of the screen, where it randomly decides to hang still, climb, or fall back down!
- Play a special animation, when a cursor hovers over it!
- Get dragged around the screen with a mouse-click or finger-touch!

## Necessary Files:
- webmeji.css
    - has the necessary .css classes
- config.js
    - has the sprites and animations parameters
- webmeji.js
    - the moving & animation logic


# Basic Setup
If you just want one custom character running around your site:

1) Add the three necessary files to wherever you host your website, and refer to them in your .html: <br>
`<link rel="stylesheet" href="webmeji.css">` <br>
`<script src="config.js"></script>` <br>
`<script src="webmeji.js"></script>` 
    - config.js must be stated before webmeji.js 
    - make sure that these pathnames are correct. This example is for when the files are in the exact same folder as the desired .html

2) Make a folder 'shimeji' in the exact same folder as the desired .html, and put shimeji images of your choice in here. They should be named `shime1.png`, `shime2.png` etc.

3) Go in config.js, and change window.SPAWNING into: <br>
`window.SPAWNING = [{id:'webmeji-0', config:'SHIMEJI_CONFIG'}];`

### thats it~!

Optionally, in config.js:
- Tweak the ALLOWANCES, removing the option to jump to other edges or the ability to get dragged around.

- Tweak the distributions of the animations chosen by changin the occurance in ORIGINAL_ACTIONS and/or EDGE_ACTIONS

- Tweak existing animations by changing the corresponding frames, or adding more!

- Change movement speed

- Change the duration and frames per second of a specific animation

- Add multiple instances with the same skin by making window.SPAWNING into: <br>
    `window.SPAWNING = [{ id: 'webmeji-0', config: 'SHIMEJI_CONFIG' }, { id: 'webmeji-1', config: 'SHIMEJI_CONFIG' }];`, etc

- Have a webmeji with a different skin, by making a second config that uses different sprites and adding that config to window.SPAWNING

- Add actions on the bottom edge that don't need horizontal movement. Give it a unique name, some frames, an interval, and loops, and then add the new action’s name to ORIGINAL_ACTIONS
    - Actions that move horizontally (like walk) or on edges, can also be added, but are more complex and require modification in webmeji.js. Below is more information on this.

# Notes: 
- Display sizes can be altered in the .css segments, simply change the width and height (keep the same ratio!)
    - sizes for mobile displays should be changed in the @media section
  
- Add the scripts lines to every .html page you want to display the shimeji on, it does not magically appear on all the pages.
  
- There are MANY many custom shimeji sprites online, if a character/source/theme is popular enough someone will have made one already!

- If I ever do a future update, it will likely contain the following:
    - momentum during dragging/falling
    - clinging to edges it has collided with
    - jumping from one edge to anothers
    - ability to spawn on a random edge/not have the bottom active
    - ability to place edges wherever, so that you can make it look to be climbing on your actual elements
    - pop-up menu that lets users set behaviour client-side

# Not working?

- Check that the .js and .css files are correctly linked in your .html, and exist wherever you host your website.

- Make sure your image filenames and paths match EXACTLY what's in the SHIMEJI_CONFIG. With even 1 file missing or wrong, the entire webmeji will not show up.

- Open the browser console (F12) to see if any errors appear.

- Remember that this is a project I'm doing in my free time as a hobby. Bugs and errors can unfortunately just exist. 

- The internet and other online tools are (usually) your friend =w=b

#  Setup+ (webmeji.js)
This project is made with the intention that the things in config.js and webmeji.css are easy to modify, as seen above. <br>
This following section goes into webmeji.js and its functions, which are likely very unoptimized and quite messy. This specific file is not build with 'easy modification' in mind, yet I will try to explain most of it. 

---

## Startup & image preloading

### `DOMContentLoaded` listener
Runs once the HTML document is fully loaded.

1. Collects all **unique config names** used in `window.SPAWNING`
2. Resolves those names to actual config objects on `window`
3. Preloads **all images used by those configs**
4. Only after all images are loaded:
   - Creates a `Creature` instance for each entry in `SPAWNING`

This prevents missing-frame flicker and broken animations.

---

### `preloadImages(config)`
Preloads every image frame referenced in a single config.

- Iterates through all values in the config object
- Extracts any `frames` arrays it finds
- Creates `<img>` objects and waits for them to load
- Returns a Promise that resolves when **all frames** are loaded

Used only during startup.

---

## The Creature class

### `constructor(containerId, spriteConfig)`
Creates a single Webmeji.

- Create and insert DOM elements
- Store configuration and state
- Choose a random starting action order
- Set initial position and facing
- Start the animation loop
- Enable interactions (petting & dragging)

Important things initialized here:
- **State flags**: `isDragging`, `isFalling`, `isPetting`, `isJumping`
- **Position**: `positionX`, `positionY`
- **Direction & facing**: controls sprite flipping
- **Timers**: frame timers, animation frames, completion timers
- **Action sequencing**: randomized action order

The creature always spawns at a **random bottom position**.

---

## Utility & helper functions

### `shuffle(array)`
Randomizes an array in-place.  
Used to shuffle the list of actions so behavior feels less repetitive.

---

### `updateImageDirection()`
Flips the sprite horizontally using CSS transforms based on `this.facing`.

---

### `setFacingFromDelta(dx)`
Automatically sets facing direction based on horizontal movement.  
Ignored while dragging.

---

### `resetAnimation()`
Stops:
- Frame animation intervals
- Action completion timers

Also resets the current frame counter.

Used **before starting any new animation**.

---

### `clearAllTimers()`
Fully stops animation playback:
- Calls `resetAnimation()`
- Cancels `requestAnimationFrame`

Mainly used during cleanup or interruption.

---

### `isSideEdge(edge)`
Returns true if the edge is `left` or `right`.

### `isNonBottomEdge(edge)`
Returns true if the edge is anything except `bottom`.

---

## Edge positioning & alignment

### `updateEdgeClass()`
Applies CSS classes based on the current edge:
- `edge-left`
- `edge-right`
- `edge-top`

These are currently unused, but might be usefull when adjusting the placement of the edge later on.

Calls `applyEdgeOffset()` to visually align the sprite.

---

### `applyEdgeOffset()`
Adjusts the creature’s position so it visually “hangs” off edges correctly. Current offset is half the sprite.

- Bottom: no offset  
- Left / right: horizontal offset  
- Top: vertical offset  

Skipped while dragging, as it needs to show the whole sprite.

---

## Jumping & edge behavior

### `jumpToEdge(targetEdge)`
Handles jumping from bottom to top/left/right

1. Validates state and allowances
2. Calculates start and end positions
3. Plays jump animation frames
4. Interpolates movement over time
5. Updates facing direction mid-jump
6. Sets the new edge and starts edge idle behavior

Uses distance-based timing so longer jumps take longer.

---

### `startEdgeIdle()`
Starts an idle animation after landing on an edge:
- Top → `hangstillTop`
- Left / right → `hangstillSide`

---

### `edgeAction()`
Randomly chooses what to do while on an edge:
- Hang still
- Climb
- Fall back to bottom

Choices are defined in `EDGE_ACTIONS`.

---

## User interaction

### `enablePetInteraction()`
Enables hover-based “petting” behavior.

Rules:
- Only works on bottom edge
- Disabled during dragging, falling, or jumping
- Saves the previous action and resumes it afterward

Triggers:
- `mouseenter` → start pet animation
- `mouseleave` → stop pet animation

---

### `enableDragInteraction()`
Enables dragging with mouse or touch.

- Clicking or touching the creature grabs it
- Plays drag animation frames
- Movement follows pointer
- Position is clamped to screen bounds
- Releasing drops the creature, triggering a fall

Drag interrupts **everything else**.

---

### `startDrag(clientX, clientY)`
- Cancels animations
- Starts drag animation
- Tracks pointer movement
- Handles release logic

---

## Falling & recovery

### `fallToBottom(fallSpeed)`
Animates falling vertically to the bottom of the screen.

- Plays falling animation frames
- Uses `requestAnimationFrame` for movement
- Interruptible by dragging
- Automatically triggers recovery afterward

---

### `playTripAfterFall()`
Plays a “fallen” or “trip” animation after landing.
Holds final frame of the animation for a random time

If no fallen animation exists, immediately resumes normal behavior

---

### `resumeAfterFallen()`
Resets state after falling:
- Clears flags
- Starts sitting
- Returns to normal action flow

---

### `playAnimation(frames, interval, loops, onComplete)`
Plays a finite animation:
- Advances frames
- Counts completed loops
- Calls `onComplete` once finished

Used for most actions.

---

## Action selection & logic

### `setNextAction()`
Core behavior selector.

Decision order:
1. If on an edge → do edge behavior
2. Random chance to jump
3. Forced walk / forced think
4. Pick next action from shuffled list

---

### `startForcedWalk()`
Forces walking for a set number of loops.  

---

### `startForceThink()`
Forces thinking animation.

---

### `startPetAnimation()`
Starts looping pet animation.

---

### `stopPetAnimation()`
Stops petting and resumes normal behavior.

---

### `startAction(action)`
Central dispatcher for starting any action.

- Direction setup
- Special cases
    - Random durations for sit/hang
    - Direction on climbing up/down
    - Jumping
- Timing logic
- Triggering forced actions

This is where **most actions begin**.

---

## Main animation loop

### `animate(time)`
Runs continuously via `requestAnimationFrame`.

- Handle horizontal movement
    - if a custom action needs horizontal movement, add it here
- Handle climbing movement
- Flip direction when hitting a wall
- Update position smoothly using delta time
- Apply edge offsets




