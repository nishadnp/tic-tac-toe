# tic-tac-toe

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## About 

A modular, cleanly structured implementation of Tic Tac Toe built using **HTML, CSS, and vanilla JavaScript**.
The project follows the **Module Pattern (IIFE) and Factory Functions**, making the logic encapsulated, scalable, and beginner-friendly while still following good architecture.

## Live Demo

[Tic Tac Toe](https://nishadnp.github.io/tic-tac-toe/)

## Features

### Player Input

- Two input fields to enter player names.

- Names are passed to the logic layer via `GameController.setPlayers()`.

### Start & Reset Flow (Simplified Logic)

- **Start button** initializes players and begins the game.

- **Reset button** fully resets the UI and logic.

- No auto-reset: avoids subtle state bugs and keeps UX predictable.

### Game Logic (Encapsulated)

- Separate modules handle different responsibilities:

    - **Gameboard** → board state

    - **createPlayer()** → factory for player objects

    - **GameController** → rules, turns, win-checking

    - **DisplayController** → DOM rendering and event handling

### Real-Time Status

- A live status box shows:

    - Which player's turn it is

    - “Game Ended!” when the match finishes

### Result Display

- After a win or tie, a styled `<output>` appears below the board.

- Removed automatically on reset.

### Clean UI / UX

- Gradient background

- Interactive grid hover

- Smooth button styling

- Disabled button states clearly indicated


## How the Architecture Works

### 1. Gameboard Module

Handles:

- Board array `(['','','',...])`

- Placing marks

- Resetting the board

Encapsulated using an IIFE to avoid global pollution.

### 2. Player Factory Function

Simple factory returning:

```bash 
{name: "...", mark: "X" or "O"}
```
### 3. GameController

Controls the rules:

- Creates players

- Tracks turns

- Checks win/tie

- Exposes result

- Resets game state

- Added helper: `getCurrentPlayerName()` for UI updates

### 4. DisplayController

- Handles the UI layer:

- Button events (Start, Reset)

- Updating the board visually

- Rendering win/tie messages

- Resetting the DOM

This layer never manipulates game logic directly — it only asks GameController for state/results.


## Project Structure 

```bash 
tic-tac-toe/
    ├── index.html
    ├── css/
    │   └── style.css
    └── js/
        └── script.js
```

## How to Play

- Enter names for Player 1 and Player 2

- Click START

- Click on the grid to place marks

- Game auto-stops after a win or tie

- Click RESET to start a new match