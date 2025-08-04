# Webmeji ৻(  •̀ ᗜ •́  ৻)
This version lets the classic [shimeji desktop buddy](https://kilkakon.com/shimeji/) be displayed as part of your personal website, so that any visitor can see your favs walking around on the bottom of your page(s)!

[view the demo here ^-^](https://webmeji.neocities.org/)

Currently, the files in this repo have three example characters that each can:
- Walk around on the bottom of your page!
- Sit down for a random period!
- Do a little silly dance!
- Turn around!
- And trip over itself!

What they can **not** (yet) do:
- Multiply itself
- Climb the sides
- Jump
- React to (mouse) interactions 


# Basic Setup
If you just want one custom character running around your site:


1) Download or copy the main.js and style.css, and put them in the same folder as your .html file(s).

2) In your HTML file, make sure you include:
```<link rel="stylesheet" href="style.css">```
```<script src="main.js"></script>```
3) Add a folder called "shimeji" (in the same folder as your HTML) and place your character sprites in it. They should be named exactly like this:
shime1.png, shime2.png, etc.

4) In main.js, scroll to the bottom and delete these last two lines:
 ```creatures.push(new Creature('webmeji-1', MIKU_CONFIG));``` & ```creatures.push(new Creature('webmeji-2', MIKU_CONFIG));```

That’s it! Open your HTML in a browser and your character should be walking around!

# Not working?

- Check that main.js and style.css are correctly linked in your HTML.

- Make sure your image filenames and paths match EXACTLY what's in the main.js SHIMEJI_CONFIG.

- Open browser console (F12) to see if any errors appear.

#  Setup+
For those with the want to customize
1) Download or copy the main.js and style.css, and put them in the same folder as your .html file(s).

2) In your HTML file, make sure you include:
```<link rel="stylesheet" href="style.css">```
```<script src="main.js"></script>```, or their equivalent filenames.

3) Place your sprite folders somewhere accessible, and make sure the CHARACTER_CONFIG in the JavaScript points to them correctly.

4) The creatures.push(...) lines at the end of main.js, given that their CHARACTER_CONFIG is set up correctly, lets you add or remove whatever character you want.

5) Customize each characters behavior!

The following should be easy to edit in the main.js using the comments:
- Horizontal pixelmovement when walking
- Time between frames
- How many times to repeat the frames per action
- How long frames with a randomized timer should hold
- Frequency that an action happens
- Adding extra actions

