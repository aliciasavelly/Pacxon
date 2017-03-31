## Pacxon

### Background

Pacxon is a combination of two retro games: Pacman and Xonix. Game play is more similar to Xonix, but it has a look and feel closer to Pacman, because it includes the Pacman characters. Pacxon is a one player game on a rectangular grid. Blocks on the grid are toggled in and out of view, and the pacman ghosts bounce off of the blocks when they're toggled into view.

### Rules

The game follows these simple rules:

1. The pacman character moves through the grid, and if it makes it to an already formed block (start of game has blocks as the border), the spaces the pacman moves through also turn into blocks.

2. If while the pacman character is making blocks, there is an open area with no ghosts, that area also gets filled with blocks.

3. While the pacman character is moving through the grid, trying to create blocks, if a ghost runs into the pacman or the spaces with soon-to-be blocks, the pacman loses a life and the blocks aren't created. The pacman restarts at the top corner.

4. Once the blocks take up 80% or more of the grid, the user wins that level.

5. Once the lives are up, the game is lost. In my implementation, players will be able to continue at the same level, but the grid will reset with blocks only as a border.

### Functionality & MVP

With my version of Pacxon, these capabilities will be implemented:

- [ ] Users will be able to start, pause, and reset the game board.
- [ ] A top bar will hold information about number of lives left and the percentage of the game grid taken up with blocks.
- [ ] The Pacman character will be able to move and create filled in blocks.
- [ ] Three types of ghosts will have varying capabilities (e.g., different velocities, removing blocks) to create different types of challenges for users.

This project will also include:

- [ ] a production readme,
- [ ] and an instructions section describing the rules of the game.

### Wireframes

This app will include a single screen with the game board, game controls (start, pause reset), instructions section, and links to my Pacxon Github and my LinkedIn profile. Above the game grid will show the number of lives left, and the progress made (i.e., percentage of the game grid taken up).

![Pacxon wireframe](wireframes/pacxon.png)

### Architecture & Technologies

Pacxon will be implemented with the following technologies:

* Vanilla JavaScript for game logic, and overall organization/structure of page
* ```HTML5 Canvas``` for drawing graphics via scripting in Javascript
* ```Easel.js``` for better, more efficient usage of ```HTML5 Canvas```
* Webpack for bundling and serving up the scripts

There will be two scripts involved in this project:

The ```board.js``` script will handle the logic for updating and creating the ```Easel.js``` elements and rendering them to the DOM.

The ```pacxon.js``` script will handle the logic for how the various pieces are allowed to move, and when/where the blocks are created on the game grid.

### Implementation Timeline

#### Phase 1: Webpack & Easel.js Setup

**Day 1:** Finish all the necessary setup, including webpack, and ```Easel.js```. Write the basic files and set up the file structure of the project. Learn more about using ```Easel.js```. Goals for the day:

* Get webpack up and running
* Learn enough about ```Easel.js``` to render an object to the ```Canvas``` element

#### Phase 2: Grid Rendering & Block Toggling

**Day 2:** Learn more about rendering objects to the canvas. Goals for the day:

* Render the Pacxon grid to the canvas
* Be able to toggle the grid blocks between showing and not showing

#### Phase 3: Pacman & Ghost Movement

**Day 3:** Create the logic for the movement of the Pacman character and for the ghosts. Goals for the day:

* Render character objects on the grid with proper movement

#### Phase 4: Pacman Block Creation & Finishing Touches

**Day 4:** Create the logic for the block creation that the Pacman character creates. Goals for the day:

* Have a styled canvas with Pacman and ghost characters
* Have controls for Pacman movement
* Have proper buttons for start, pause, reset
* Have blocks rendering based on Pacman movement, which in turn affects where the ghosts can move

### Checklist:

- [x] Phase 1
- [x] Phase 2
- [ ] Phase 3
- [ ] Phase 4

### Bonus Features

There are a few other features that could be implemented for Pacxon. The following are some possible updates:

- [ ] Adding an increased number or levels and level complexity
- [ ] Adding power ups for Pacman character to use
- [ ] Adding Pacman music (which can be turned on and off)
