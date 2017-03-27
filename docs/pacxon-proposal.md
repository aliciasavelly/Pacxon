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

### Implementation Timeline

**Day 1:**

### Bonus Features
