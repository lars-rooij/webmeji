// ✰ webmeji ✰
// little creatures that walk around your website =w=b
// inspired by shimeji, originally by Lars de Rooij
// not affiliated with any other shimeji projects
// last updated: 27 january 2026
// homepage: webmeji.neocities.org
//
// this file defines:
// - which webmeji spawn
// - which actions are allowed
// - what animations they have
// - how often actions occur

// spawning setup --------------------------------------------------
// define which creatures spawn on the page. remove any unwanted ones.
// each id must be unique
// if two of them overlap and pet and dragging interactions happen, only the one stated here last will get interacted with
window.SPAWNING = [
  { id: 'webmeji-0', config: 'SHIMEJI_CONFIG' },
  { id: 'webmeji-1', config: 'MIKU_CONFIG' },
  { id: 'webmeji-2', config: 'MIKU_CONFIG' }
];

// base shimeji config ----------------------------------------------
// all configs should have same actions, but allowances can differ
window.SHIMEJI_CONFIG = {
  // pet   = hover animation (hard to see on mobile)
  // drag  = click or touch to pick up
  // top / left / right allow edge interactions
  // remove whichever you don't want, the only exceptions is that bottom must always be enabled
  ALLOWANCES: ['pet', 'drag', 'bottom', 'top', 'left', 'right'],

  // movement and physics -------------------------------------------
  // values are pixels movements per frame
  walkspeed: 50,
  fallspeed: 200,
  jumpspeed: 150,

  // time in ms before standing back up after falling
  gettingupspeed: 2000,

  // common idle and movement animations on the bottom edge ---------
  // these are the most frequently used actions
  // interval = time between frames (ms)
  // loops = how many times the frame sequence repeats
  // randomizeDuration sets random timeframe for actions, tune min and max to desired length
  walk: {
    frames: ["shimeji/shime1.png", "shimeji/shime2.png", "shimeji/shime3.png", "shimeji/shime2.png"],
    interval: 175, loops: 6},

  stand: {
    frames: ["shimeji/shime1.png"],
    interval: 200, loops: 1},

  sit: {
    frames: ["shimeji/shime11.png"],
    interval: 1000, loops: 1,
    randomizeDuration: true, min: 3000, max: 11000},

  spin: {
    frames: ["shimeji/shime1.png"],
    interval: 150, loops: 3},

  dance: {
    frames: ["shimeji/shime5.png", "shimeji/shime6.png", "shimeji/shime1.png"],
    interval: 200, loops: 5},

  trip: {
    frames: ["shimeji/shime20.png", "shimeji/shime21.png", "shimeji/shime21.png", "shimeji/shime20.png", "shimeji/shime21.png", "shimeji/shime21.png"],
    interval: 250, loops: 1},

  // behavior flow control ------------------------------------------
  // prevents awkward transitions like dancing immediately after sitting
  forcewalk: { // uses the walking frames, by default happens after tripping and spinning
    loops: 6},

  forcethink: { // by default happens after dancing
    frames: ["shimeji/shime27.png", "shimeji/shime28.png"],
    interval: 500, loops: 2},

  // user interaction animations ------------------------------------
  pet: {
    frames: ["shimeji/shime15.png", "shimeji/shime16.png", "shimeji/shime17.png"],
    interval: 75},

  drag: {
    frames: ["shimeji/shime5.png", "shimeji/shime7.png", "shimeji/shime5.png", "shimeji/shime6.png", "shimeji/shime8.png", "shimeji/shime6.png"],
    interval: 210},

  // falling and recovery animations --------------------------------
  falling: {
    frames: ["shimeji/shime4.png"],
    interval: 200, loops: 2},

  fallen: {
    frames: ["shimeji/shime19.png", "shimeji/shime18.png"],
    interval: 250, loops: 1},

  // action frequency and decision logic ----------------------------
  // anytime an action needs to be chosen, it randomly picks one of these
  // thus, having an action in here more than others, makes it happen more
  ORIGINAL_ACTIONS: [
    'walk','walk','walk','walk','walk','walk',
    'walk','walk','walk','walk','walk','walk',
    'spin','spin','spin',
    'sit','sit',
    'dance','dance',
    'trip'
  ],

  EDGE_ACTIONS: [
    'hang','hang',
    'climb','climb','climb','climb',
    'fall','fall'
  ],

  // when chosing an action on the bottom, it has this change to jump to an edge (if allowed)
  // this is standalone from the other action select
  JUMP_CHANCE: 0.05, // below 0 = never jump; above 1 = jump almost always

  // edge-specific animations ---------------------------------------
  climbSide: {
    frames: ["shimeji/shime13.png", "shimeji/shime14.png"],
    interval: 200, loops: 2},

  hangstillSide: {
    frames: ["shimeji/shime12.png"],
    interval: 200, loops: 2,
    randomizeDuration: true, min: 3000, max: 11000},

  climbTop: {
    frames: ["shimeji/shime24.png", "shimeji/shime25.png"],
    interval: 200, loops: 6},

  hangstillTop: {
    frames: ["shimeji/shime23.png"],
    interval: 200, loops: 2,
    randomizeDuration: true, min: 3000, max: 11000},

  jump: {
    frames: ["shimeji/shime22.png"],
    interval: 200}
};


// second config ----------------------------------------------------

window.MIKU_CONFIG = {
  // pet   = hover animation (hard to see on mobile)
  // drag  = click or touch to pick up
  // top / left / right allow edge interactions
  // remove whichever you don't want, the only exceptions is that bottom must always be enabled
  ALLOWANCES: ['pet', 'drag', 'bottom', 'top', 'left', 'right'],

  // movement and physics -------------------------------------------
  // values are pixels movements per frame
  walkspeed: 50,
  fallspeed: 150,
  jumpspeed: 200,

  // time in ms before standing back up after falling
  gettingupspeed: 3500,

  // common idle and movement animations on the bottom edge ---------
  // these are the most frequently used actions
  // interval = time between frames (ms)
  // loops = how many times the frame sequence repeats
  // randomizeDuration sets random timeframe for actions, tune min and max to desired length
  walk: {
    frames: ["miku/shime1.png", "miku/shime2.png", "miku/shime3.png", "miku/shime2.png"], 
    interval: 175, loops: 6},

  stand: {
    frames: ["miku/shime1.png"], 
    interval: 1000, loops: 1},

  sit: {
    frames: ["miku/shime11.png"], 
    interval: 1000, loops: 1,
    randomizeDuration: true, min: 3000, max: 11000},

  spin: {
    frames: ["miku/shime1.png"], 
    interval: 150, loops: 3},

  dance: {
    frames: ["miku/shime5.png", "miku/shime6.png", "miku/shime1.png"], 
    interval: 200, loops: 2},

  trip: {
    frames: ["miku/shime18.png", "miku/shime19.png", "miku/shime19.png"], 
    interval: 250, loops: 1},

  // behavior flow control ------------------------------------------
  // prevents awkward transitions like dancing immediately after sitting
  forcewalk: { // uses the walking frames
    loops: 6},

  forcethink: {
    frames: ["miku/shime27.png", "miku/shime28.png"], 
    interval: 500, loops: 2},

  // user interaction animations ------------------------------------
  pet: {
    frames: ["miku/shime15.png", "miku/shime16.png", "miku/shime17.png"], 
    interval: 400},

  drag: {
    frames: ["miku/shime7.png", "miku/shime5.png", "miku/shime8.png", "miku/shime6.png"], 
    interval: 210},

  // falling and recovery animations --------------------------------
  falling: {
    frames: ["miku/shime10.png", "miku/shime18.png"], 
    interval: 200, loops: 2},

  fallen: {
    frames: ["miku/shime9.png", "miku/shime4.png", "miku/shime19.png"], 
    interval: 250, loops: 1},

  // action frequency and decision logic ----------------------------
  // anytime an action needs to be chosen, it randomly picks one of these
  // thus, having an action in here more than others, makes it happen more
  ORIGINAL_ACTIONS: [
    'walk','walk','walk','walk','walk','walk',
    'spin','spin','spin',
    'sit','sit',
    'dance','dance','dance','dance','dance',
    'trip'
  ],

  EDGE_ACTIONS: [
    'hang','hang',
    'climb','climb','climb','climb','climb',
    'fall'
  ],

  // when chosing an action on the bottom, it has this change to jump to an edge (if allowed)
  // this is standalone from the other action select
  JUMP_CHANCE: 0.1, // below 0 = never jump; above 1 = jump almost always

  // edge-specific animations ---------------------------------------
  climbSide: {
    frames: ["miku/shime13.png", "miku/shime14.png"], 
    interval: 200, loops: 2},

  hangstillSide: {
    frames: ["miku/shime12.png"], 
    interval: 200, loops: 2,
    randomizeDuration: true, min: 3000, max: 11000},

  climbTop: {
    frames: ["miku/shime24.png", "miku/shime25.png"], 
    interval: 200, loops: 8},

  hangstillTop: {
    frames: ["miku/shime23.png"], 
    interval: 200, loops: 2,
    randomizeDuration: true, min: 3000, max: 11000},

  jump: {
    frames: ["miku/shime22.png"], 
    interval: 200}
};
