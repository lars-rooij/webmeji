/* web shimeji */  
window.addEventListener('DOMContentLoaded', () => {
  const SHIMEJI_CONFIG = {
    // horizontal pixel movement per frame, for walking
    speed: 50,
    // interval: time in ms between frames, loop: times the frames get repeated
    walk:  { frames: ["shimeji/shime1.png", "shimeji/shime2.png", "shimeji/shime3.png", "shimeji/shime2.png"], 
            interval: 175, loops: 6 },
    trip:  { frames: ["shimeji/shime20.png", "shimeji/shime21.png", "shimeji/shime21.png", "shimeji/shime20.png", "shimeji/shime21.png", "shimeji/shime21.png"],
            interval: 250, loops: 1 },
    sit:   { frames: ["shimeji/shime11.png"], 
            // randomize time spend in sitting frame in ms
            interval: 1000, loops: 1, randomizeDuration: true, min: 3000, max: 11000 },
    spin:  { frames: ["shimeji/shime1.png"], 
            // loops 3 times to make it stand still while turning
            interval: 150, loops: 3 },
    dance: { frames: ["shimeji/shime5.png", "shimeji/shime6.png", "shimeji/shime1.png"], 
            interval: 200, loops: 5 },
    // amount of loops to walk after doing a special action
    // falling directly after sitting down can look awkward, so force it to walk for a few loops
    forcewalk: 6, 
    // set frequency of actions
    ORIGINAL_ACTIONS: ['walk', 'walk','walk','walk','walk','walk','walk','walk','walk','walk','walk','walk','spin','spin','spin','sit','sit','dance','dance','trip']
  };

  const MIKU_CONFIG = {    
    // horizontal pixel movement per frame, for walking
    speed: 50,
    // interval: time in ms between frames, loop: times the frames get repeated
    walk:  { frames: ["miku/shime1.png", "miku/shime2.png", "miku/shime3.png", "miku/shime2.png"], 
            interval: 175, loops: 6 },
    trip:  { frames: ["miku/shime18.png", "miku/shime19.png",  "miku/shime19.png"],
            interval: 250, loops: 1 },
    sit:   { frames: ["miku/shime11.png"], 
            // randomize time spend in sitting frame in ms
            interval: 1000, loops: 1, randomizeDuration: true, min: 3000, max: 11000 },
    spin:  { frames: ["miku/shime1.png"], 
            // loops 3 times to make it stand still while turning
            interval: 150, loops: 3 },
    dance: { frames: ["miku/shime5.png", "miku/shime6.png", "miku/shime1.png"], 
            interval: 200, loops: 2 },
    // amount of loops to walk after doing a special action
    // falling directly after sitting down can look awkward, so force it to walk for a few loops
    forcewalk: 6, 
    // set frequency of actions
    ORIGINAL_ACTIONS: ['walk', 'walk','walk','walk','walk','walk','spin','spin','spin','sit','sit','dance','dance', 'dance','dance', 'dance','dance', 'dance','dance','trip']
  };
      
  class Creature {
    constructor(containerId, spriteConfig) {
      // make container div
      this.container = document.createElement('div');
      this.container.className = 'webmeji-container';
      document.body.appendChild(this.container);

      // first frame added
      this.img = document.createElement('img');
      this.img.id = containerId;
      this.img.src = spriteConfig.walk.frames[0];
      this.container.appendChild(this.img);

      this.spriteConfig = spriteConfig;
      this.actionSequence = this.shuffle([...this.spriteConfig.ORIGINAL_ACTIONS]);
      this.currentActionIndex = 0;
      this.currentAction = null;
      this.frameTimer = null;
      this.actionCompletionTimer = null;
      this.currentFrame = 0;
      this.direction = 1;

      // position container
      const containerStyle = window.getComputedStyle(this.container);
      this.containerWidth = parseFloat(containerStyle.width);
      this.containerHeight = parseFloat(containerStyle.height);

      // random start position
      this.position = Math.random() * (window.innerWidth - this.containerWidth);
      this.maxPos = window.innerWidth - this.containerWidth;
      this.forceWalkAfter = false;

      this.container.style.left = this.position + 'px';

      this.updateImageDirection();

      // start initial action & animation
      this.currentAction = this.actionSequence[this.currentActionIndex];
      this.startAction(this.currentAction);

      this.animate = this.animate.bind(this);
      this.animationFrameId = requestAnimationFrame(this.animate);

      // update size window
      this.resizeHandler = () => {
        const style = window.getComputedStyle(this.container);
        this.containerWidth = parseFloat(style.width);
        this.containerHeight = parseFloat(style.height);
        this.maxPos = window.innerWidth - this.containerWidth;
        this.position = Math.min(this.position, this.maxPos);
        this.container.style.left = this.position + 'px';
      };
      window.addEventListener('resize', this.resizeHandler);
    }

    // randomize actions
    shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    // flip image based on moving direction
    updateImageDirection() {
      this.img.style.transform = this.direction === -1 ? 'scaleX(1)' : 'scaleX(-1)';
    }

    // clear ongoing timers
    resetAnimation() {
      clearInterval(this.frameTimer);
      clearTimeout(this.actionCompletionTimer);
      this.currentFrame = 0;
      this.frameTimer = null;
      this.actionCompletionTimer = null;
    }

    clearAllTimers() {
      this.resetAnimation();
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
    }

    // next action in actionsequence, or reshuffle the actionsequence
    // set forcewalk for special actions
    setNextAction() {
      this.resetAnimation();

      if (this.forceWalkAfter) {
        this.forceWalkAfter = false;
        this.startForcedWalk();
        return;
      }

      this.currentActionIndex++;
      if (this.currentActionIndex >= this.actionSequence.length) {
        this.currentActionIndex = 0;
        this.actionSequence = this.shuffle([...this.spriteConfig.ORIGINAL_ACTIONS]);
      }

      this.currentAction = this.actionSequence[this.currentActionIndex];
      this.startAction(this.currentAction);
    }

    // force to walk for a set number of cycles
    startForcedWalk() {
      const { frames, interval } = this.spriteConfig.walk;
      const walkCycles = this.spriteConfig.forcewalk;
      this.currentAction = 'forced-walk';
      this.playAnimation(frames, interval, walkCycles, () => this.setNextAction());
    }

    // start the action
    startAction(action) {
      this.resetAnimation();
      const config = this.spriteConfig[action];
      if (!config) return;

      const { frames, interval, loops = 1 } = config;

      // sitting, with the randomized time to hold this frame
      if (action === 'sit') {
        const duration = config.randomizeDuration
          ? Math.random() * (config.max - config.min) + config.min
          : interval * loops;
        this.img.src = frames[0];
        this.actionCompletionTimer = setTimeout(() => {
          this.forceWalkAfter = true;
          this.setNextAction();
        }, duration);
        return;
      }

      // play the animation and callback
      this.playAnimation(frames, interval, loops, () => {
        // flip the frame after spinning
        if (action === 'spin') {
          this.direction *= -1;
          this.updateImageDirection();
        }
        // force walking after special action
        if (['trip', 'dance', 'spin'].includes(action)) {
          this.forceWalkAfter = true;
        }
        this.setNextAction();
      });
    }

    // play animation
    playAnimation(frames, interval, loops, onComplete) {
      let playCount = 0;
      this.currentFrame = 0;
      this.img.src = frames[0];

      if (this.frameTimer) clearInterval(this.frameTimer);

      // change frame every interval 
      this.frameTimer = setInterval(() => {
        this.currentFrame = (this.currentFrame + 1) % frames.length;
        this.img.src = frames[this.currentFrame];

        // update loop counter when at last frame
        if (this.currentFrame === frames.length - 1) {
          playCount++;
          // after completing all loops, stop animation
          if (playCount >= loops) {
            clearInterval(this.frameTimer);
            this.frameTimer = null;
            this.actionCompletionTimer = setTimeout(onComplete, 0);
          }
        }
      }, interval);
    }

    // animate function on each animation frame with requestAnimationFrame
    animate(time) {
      if (!this.lastTime) this.lastTime = time;
      const delta = (time - this.lastTime) / 1000;
      this.lastTime = time;

      if (this.currentAction === 'walk' || this.currentAction === 'forced-walk') {
        this.position += this.direction * this.spriteConfig.speed * delta;

        // flip if it reaches the border of a screen
        if (this.position >= this.maxPos) {
          this.position = this.maxPos;
          this.direction = -1;
          this.updateImageDirection();
        } else if (this.position <= 0) {
          this.position = 0;
          this.direction = 1;
          this.updateImageDirection();
        }

        this.container.style.left = this.position + 'px';
      }

      this.animationFrameId = requestAnimationFrame(this.animate);
    }
  }

  // Spawn multiple creatures with possibly different configs
  const creatures = [];
  creatures.push(new Creature('webmeji-0', SHIMEJI_CONFIG));
  creatures.push(new Creature('webmeji-1', MIKU_CONFIG));
  creatures.push(new Creature('webmeji-2', MIKU_CONFIG));

});
