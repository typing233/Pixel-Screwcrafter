const Game = {
    currentScreen: 'main-menu',
    currentTheme: 'nature',
    currentLevel: null,
    gameState: {
        isPlaying: false,
        isPaused: false,
        startTime: 0,
        elapsedTime: 0,
        timerInterval: null,
        moveCount: 0,
        screwInventory: [],
        selectedScrew: null,
        screwsOnBoard: [],
        pixelsRevealed: [],
        history: []
    },
    canvas: null,
    ctx: null,
    cellSize: 40,
    offsetX: 0,
    offsetY: 0,

    init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.loadGameData();
        this.bindEvents();
        this.updateStats();
        AudioManager.init();
    },

    loadGameData() {
        const saved = localStorage.getItem('pixelScrewcrafter');
        if (saved) {
            const data = JSON.parse(saved);
            if (data.unlockedLevels) {
                data.unlockedLevels.forEach(levelId => {
                    const level = getLevelById(levelId);
                    if (level) {
                        level.unlocked = true;
                    }
                });
            }
            if (data.stats) {
                this.stats = data.stats;
            }
            if (data.settings) {
                if (data.settings.volume !== undefined) {
                    AudioManager.setVolume(data.settings.volume);
                    document.getElementById('volume-slider').value = data.settings.volume;
                }
                if (data.settings.bgmEnabled !== undefined) {
                    AudioManager.setBGMEnabled(data.settings.bgmEnabled);
                    document.getElementById('bgm-toggle').checked = data.settings.bgmEnabled;
                }
                if (data.settings.sfxEnabled !== undefined) {
                    AudioManager.setSFXEnabled(data.settings.sfxEnabled);
                    document.getElementById('sfx-toggle').checked = data.settings.sfxEnabled;
                }
            }
        }
    },

    saveGameData() {
        const allLevels = getAllLevels();
        const unlockedLevels = allLevels.filter(l => l.unlocked).map(l => l.id);
        
        const data = {
            unlockedLevels,
            stats: this.stats,
            settings: {
                volume: AudioManager.volume * 100,
                bgmEnabled: AudioManager.bgmEnabled,
                sfxEnabled: AudioManager.sfxEnabled
            }
        };
        
        localStorage.setItem('pixelScrewcrafter', JSON.stringify(data));
    },

    stats: {
        totalLevelsPlayed: 0,
        totalScrewsRemoved: 0,
        perfectCompletions: 0
    },

    bindEvents() {
        document.getElementById('start-btn').addEventListener('click', () => {
            AudioManager.playClick();
            this.startFirstLevel();
        });

        document.getElementById('levels-btn').addEventListener('click', () => {
            AudioManager.playClick();
            this.showScreen('level-select');
            this.renderLevelGrid();
        });

        document.getElementById('settings-btn').addEventListener('click', () => {
            AudioManager.playClick();
            this.showScreen('settings');
        });

        document.getElementById('back-to-menu-btn').addEventListener('click', () => {
            AudioManager.playClick();
            this.showScreen('main-menu');
        });

        document.getElementById('back-from-settings-btn').addEventListener('click', () => {
            AudioManager.playClick();
            this.showScreen('main-menu');
        });

        document.querySelectorAll('.theme-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                AudioManager.playClick();
                this.currentTheme = e.target.dataset.theme;
                this.updateThemeTabs();
                this.renderLevelGrid();
            });
        });

        document.getElementById('pause-btn').addEventListener('click', () => {
            AudioManager.playClick();
            this.pauseGame();
        });

        document.getElementById('hint-btn').addEventListener('click', () => {
            AudioManager.playHint();
            this.showHint();
        });

        document.getElementById('resume-btn').addEventListener('click', () => {
            AudioManager.playClick();
            this.resumeGame();
        });

        document.getElementById('restart-btn').addEventListener('click', () => {
            AudioManager.playClick();
            this.restartLevel();
        });

        document.getElementById('restart-pause-btn').addEventListener('click', () => {
            AudioManager.playClick();
            this.resumeGame();
            this.restartLevel();
        });

        document.getElementById('quit-btn').addEventListener('click', () => {
            AudioManager.playClick();
            this.quitLevel();
        });

        document.getElementById('undo-btn').addEventListener('click', () => {
            AudioManager.playClick();
            this.undoMove();
        });

        document.getElementById('next-level-btn').addEventListener('click', () => {
            AudioManager.playClick();
            this.nextLevel();
        });

        document.getElementById('replay-btn').addEventListener('click', () => {
            AudioManager.playClick();
            this.hideModal('complete-modal');
            this.restartLevel();
        });

        document.getElementById('back-to-levels-btn').addEventListener('click', () => {
            AudioManager.playClick();
            this.hideModal('complete-modal');
            this.showScreen('level-select');
            this.renderLevelGrid();
        });

        this.canvas.addEventListener('click', (e) => {
            if (!this.gameState.isPlaying || this.gameState.isPaused) return;
            AudioManager.ensureContext();
            this.handleCanvasClick(e);
        });

        document.getElementById('bgm-toggle').addEventListener('change', (e) => {
            AudioManager.setBGMEnabled(e.target.checked);
            this.saveGameData();
            if (e.target.checked) {
                AudioManager.playBGM();
            }
        });

        document.getElementById('sfx-toggle').addEventListener('change', (e) => {
            AudioManager.setSFXEnabled(e.target.checked);
            this.saveGameData();
        });

        document.getElementById('volume-slider').addEventListener('input', (e) => {
            AudioManager.setVolume(parseInt(e.target.value));
            this.saveGameData();
        });

        document.getElementById('theme-select').addEventListener('change', (e) => {
            AudioManager.playClick();
            this.applyGameTheme(e.target.value);
        });
    },

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        this.currentScreen = screenId;
    },

    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    },

    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    },

    updateThemeTabs() {
        document.querySelectorAll('.theme-tab').forEach(tab => {
            if (tab.dataset.theme === this.currentTheme) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    },

    renderLevelGrid() {
        const grid = document.getElementById('level-grid');
        grid.innerHTML = '';

        const levels = LEVELS[this.currentTheme] || [];
        
        levels.forEach(level => {
            const card = document.createElement('div');
            card.className = `level-card ${level.unlocked ? '' : 'locked'}`;
            card.innerHTML = `
                <div class="level-preview">${level.emoji}</div>
                <div class="level-name">${level.name}</div>
                <div class="level-difficulty">${level.difficulty} | ${level.screwCount}螺丝</div>
            `;

            if (level.unlocked) {
                card.addEventListener('click', () => {
                    AudioManager.playClick();
                    this.startLevel(level);
                });
            }

            grid.appendChild(card);
        });
    },

    startFirstLevel() {
        const allLevels = getAllLevels();
        const firstUnlocked = allLevels.find(l => l.unlocked);
        if (firstUnlocked) {
            this.startLevel(firstUnlocked);
        }
    },

    startLevel(level) {
        this.currentLevel = level;
        this.showScreen('game-screen');
        
        this.gameState = {
            isPlaying: true,
            isPaused: false,
            startTime: Date.now(),
            elapsedTime: 0,
            timerInterval: null,
            moveCount: 0,
            screwInventory: [],
            selectedScrew: null,
            screwsOnBoard: JSON.parse(JSON.stringify(level.screwPositions)),
            pixelsRevealed: [],
            history: []
        };

        document.getElementById('current-level-name').textContent = `${level.emoji} ${level.name}`;
        document.getElementById('move-count').textContent = '移动: 0';
        document.getElementById('game-timer').textContent = '00:00';

        this.startTimer();
        this.calculateGrid();
        this.render();
        this.updateScrewInventory();
        
        AudioManager.playBGM();
    },

    calculateGrid() {
        const level = this.currentLevel;
        const canvasSize = Math.min(this.canvas.width, this.canvas.height);
        this.cellSize = Math.floor((canvasSize - 40) / level.gridSize);
        
        const totalWidth = this.cellSize * level.gridSize;
        const totalHeight = this.cellSize * level.gridSize;
        
        this.offsetX = (this.canvas.width - totalWidth) / 2;
        this.offsetY = (this.canvas.height - totalHeight) / 2;
    },

    startTimer() {
        if (this.gameState.timerInterval) {
            clearInterval(this.gameState.timerInterval);
        }
        
        this.gameState.timerInterval = setInterval(() => {
            if (!this.gameState.isPaused) {
                this.gameState.elapsedTime = Math.floor((Date.now() - this.gameState.startTime) / 1000);
                this.updateTimerDisplay();
            }
        }, 1000);
    },

    updateTimerDisplay() {
        const minutes = Math.floor(this.gameState.elapsedTime / 60);
        const seconds = this.gameState.elapsedTime % 60;
        document.getElementById('game-timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },

    pauseGame() {
        this.gameState.isPaused = true;
        this.showModal('pause-menu');
        AudioManager.stopBGM();
    },

    resumeGame() {
        this.gameState.isPaused = false;
        this.hideModal('pause-menu');
        this.gameState.startTime = Date.now() - (this.gameState.elapsedTime * 1000);
        AudioManager.playBGM();
    },

    restartLevel() {
        if (this.gameState.timerInterval) {
            clearInterval(this.gameState.timerInterval);
        }
        AudioManager.stopBGM();
        this.startLevel(this.currentLevel);
    },

    quitLevel() {
        if (this.gameState.timerInterval) {
            clearInterval(this.gameState.timerInterval);
        }
        this.gameState.isPlaying = false;
        this.hideModal('pause-menu');
        this.showScreen('main-menu');
        AudioManager.stopBGM();
    },

    nextLevel() {
        this.hideModal('complete-modal');
        const nextLevel = getNextLevel(this.currentLevel.id);
        if (nextLevel) {
            this.startLevel(nextLevel);
        } else {
            this.showScreen('level-select');
            this.renderLevelGrid();
        }
    },

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const clickX = (e.clientX - rect.left) * scaleX;
        const clickY = (e.clientY - rect.top) * scaleY;
        
        const gridX = Math.floor((clickX - this.offsetX) / this.cellSize);
        const gridY = Math.floor((clickY - this.offsetY) / this.cellSize);
        
        const level = this.currentLevel;
        if (gridX < 0 || gridX >= level.gridSize || gridY < 0 || gridY >= level.gridSize) {
            return;
        }

        if (this.gameState.selectedScrew !== null) {
            this.tryPlaceScrew(gridX, gridY);
        } else {
            this.tryRemoveScrew(gridX, gridY);
        }
    },

    tryRemoveScrew(gridX, gridY) {
        const screwIndex = this.gameState.screwsOnBoard.findIndex(
            s => s.x === gridX && s.y === gridY
        );

        if (screwIndex !== -1) {
            this.saveState();
            
            const screw = this.gameState.screwsOnBoard[screwIndex];
            this.gameState.screwsOnBoard.splice(screwIndex, 1);
            this.gameState.screwInventory.push({
                ...screw,
                originalX: screw.x,
                originalY: screw.y
            });
            
            this.gameState.moveCount++;
            this.stats.totalScrewsRemoved++;
            
            document.getElementById('move-count').textContent = `移动: ${this.gameState.moveCount}`;
            
            AudioManager.playScrewUnscrew();
            
            this.render();
            this.updateScrewInventory();
            this.saveGameData();
        }
    },

    tryPlaceScrew(gridX, gridY) {
        const selectedIndex = this.gameState.selectedScrew;
        const screw = this.gameState.screwInventory[selectedIndex];
        
        if (!screw) return;

        const existingScrew = this.gameState.screwsOnBoard.find(
            s => s.x === gridX && s.y === gridY
        );

        if (existingScrew) {
            AudioManager.playError();
            return;
        }

        const level = this.currentLevel;
        const pixelValue = level.pixels[gridY][gridX];
        
        if (pixelValue === 0) {
            AudioManager.playError();
            return;
        }

        this.saveState();

        this.gameState.screwInventory.splice(selectedIndex, 1);
        this.gameState.screwsOnBoard.push({
            x: gridX,
            y: gridY,
            color: screw.color,
            originalX: screw.originalX,
            originalY: screw.originalY
        });

        this.gameState.selectedScrew = null;
        this.gameState.moveCount++;

        document.getElementById('move-count').textContent = `移动: ${this.gameState.moveCount}`;

        AudioManager.playScrewScrew();

        this.render();
        this.updateScrewInventory();

        this.checkLevelComplete();
    },

    saveState() {
        this.gameState.history.push({
            screwsOnBoard: JSON.parse(JSON.stringify(this.gameState.screwsOnBoard)),
            screwInventory: JSON.parse(JSON.stringify(this.gameState.screwInventory)),
            selectedScrew: this.gameState.selectedScrew,
            moveCount: this.gameState.moveCount
        });

        if (this.gameState.history.length > 50) {
            this.gameState.history.shift();
        }
    },

    undoMove() {
        if (this.gameState.history.length === 0) {
            return;
        }

        const previousState = this.gameState.history.pop();
        this.gameState.screwsOnBoard = previousState.screwsOnBoard;
        this.gameState.screwInventory = previousState.screwInventory;
        this.gameState.selectedScrew = previousState.selectedScrew;
        this.gameState.moveCount = previousState.moveCount;

        document.getElementById('move-count').textContent = `移动: ${this.gameState.moveCount}`;
        
        this.render();
        this.updateScrewInventory();
    },

    showHint() {
        const misplacedScrews = this.gameState.screwsOnBoard.filter(s => {
            return s.x !== s.originalX || s.y !== s.originalY;
        });

        if (misplacedScrews.length > 0) {
            const hintScrew = misplacedScrews[0];
            this.highlightCell(hintScrew.originalX, hintScrew.originalY);
        } else if (this.gameState.screwsOnBoard.length < this.currentLevel.screwPositions.length) {
            const level = this.currentLevel;
            for (const screw of level.screwPositions) {
                const onBoard = this.gameState.screwsOnBoard.find(s => s.x === screw.x && s.y === screw.y);
                if (!onBoard) {
                    const inInventory = this.gameState.screwInventory.find(s => s.color === screw.color);
                    if (inInventory) {
                        this.highlightCell(screw.x, screw.y);
                        break;
                    }
                }
            }
        }
    },

    highlightCell(gridX, gridY) {
        const x = this.offsetX + gridX * this.cellSize;
        const y = this.offsetY + gridY * this.cellSize;
        
        this.ctx.save();
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 4;
        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4);
        this.ctx.restore();

        setTimeout(() => {
            this.render();
        }, 2000);
    },

    updateScrewInventory() {
        const inventory = document.getElementById('screw-inventory');
        inventory.innerHTML = '';

        this.gameState.screwInventory.forEach((screw, index) => {
            const item = document.createElement('div');
            item.className = `screw-item ${index === this.gameState.selectedScrew ? 'selected' : ''}`;
            item.innerHTML = '🔩';
            item.style.backgroundColor = this.currentLevel.colorMap[screw.color] || '#888';
            
            item.addEventListener('click', () => {
                AudioManager.playClick();
                if (this.gameState.selectedScrew === index) {
                    this.gameState.selectedScrew = null;
                } else {
                    this.gameState.selectedScrew = index;
                }
                this.updateScrewInventory();
            });

            inventory.appendChild(item);
        });
    },

    checkLevelComplete() {
        const level = this.currentLevel;
        
        const allCorrect = level.screwPositions.every(target => {
            const actual = this.gameState.screwsOnBoard.find(
                s => s.x === target.x && s.y === target.y && s.color === target.color
            );
            return actual !== undefined;
        });

        if (allCorrect && this.gameState.screwsOnBoard.length === level.screwPositions.length) {
            this.completeLevel();
        }
    },

    completeLevel() {
        this.gameState.isPlaying = false;
        
        if (this.gameState.timerInterval) {
            clearInterval(this.gameState.timerInterval);
        }

        AudioManager.stopBGM();
        AudioManager.playLevelComplete();

        this.stats.totalLevelsPlayed++;
        
        const isPerfect = this.gameState.moveCount <= this.currentLevel.perfectMoves &&
                          this.gameState.elapsedTime <= this.currentLevel.targetTime;
        if (isPerfect) {
            this.stats.perfectCompletions++;
        }

        unlockLevel(this.currentLevel.id);
        this.saveGameData();
        this.updateStats();

        const minutes = Math.floor(this.gameState.elapsedTime / 60);
        const seconds = this.gameState.elapsedTime % 60;
        document.getElementById('final-time').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('final-moves').textContent = this.gameState.moveCount;

        let stars = 1;
        if (this.gameState.moveCount <= this.currentLevel.perfectMoves) stars++;
        if (this.gameState.elapsedTime <= this.currentLevel.targetTime) stars++;
        
        document.getElementById('final-rating').textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);

        const nextLevel = getNextLevel(this.currentLevel.id);
        if (!nextLevel) {
            document.getElementById('next-level-btn').style.display = 'none';
        } else {
            document.getElementById('next-level-btn').style.display = 'block';
        }

        setTimeout(() => {
            this.showModal('complete-modal');
        }, 500);
    },

    updateStats() {
        document.getElementById('total-levels-played').textContent = this.stats.totalLevelsPlayed;
        document.getElementById('total-screws-removed').textContent = this.stats.totalScrewsRemoved;
        document.getElementById('perfect-completions').textContent = this.stats.perfectCompletions;
    },

    applyGameTheme(theme) {
        document.body.className = '';
        if (theme === 'dark') {
            document.body.classList.add('theme-dark');
        } else if (theme === 'light') {
            document.body.classList.add('theme-light');
        }
    },

    render() {
        const ctx = this.ctx;
        const level = this.currentLevel;

        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let y = 0; y < level.gridSize; y++) {
            for (let x = 0; x < level.gridSize; x++) {
                const pixelValue = level.pixels[y][x];
                const xPos = this.offsetX + x * this.cellSize;
                const yPos = this.offsetY + y * this.cellSize;

                if (pixelValue === 0) {
                    ctx.fillStyle = '#0a0a1a';
                } else {
                    const hasScrew = this.gameState.screwsOnBoard.some(
                        s => s.x === x && s.y === y
                    );
                    
                    if (hasScrew) {
                        ctx.fillStyle = level.colorMap[pixelValue] || '#888';
                    } else {
                        const color = level.colorMap[pixelValue] || '#888';
                        ctx.fillStyle = this.darkenColor(color, 0.3);
                    }
                }

                ctx.fillRect(xPos, yPos, this.cellSize, this.cellSize);

                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1;
                ctx.strokeRect(xPos, yPos, this.cellSize, this.cellSize);
            }
        }

        this.gameState.screwsOnBoard.forEach(screw => {
            this.drawScrew(screw.x, screw.y, screw.color);
        });
    },

    drawScrew(gridX, gridY, colorIndex) {
        const ctx = this.ctx;
        const x = this.offsetX + gridX * this.cellSize + this.cellSize / 2;
        const y = this.offsetY + gridY * this.cellSize + this.cellSize / 2;
        const radius = this.cellSize * 0.35;

        const gradient = ctx.createRadialGradient(
            x - radius * 0.3, y - radius * 0.3, 0,
            x, y, radius
        );
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(0.5, '#DAA520');
        gradient.addColorStop(1, '#B8860B');

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, radius * 0.8, 0, Math.PI * 2);
        ctx.strokeStyle = '#8B7355';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.strokeStyle = '#555';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(x - radius * 0.5, y);
        ctx.lineTo(x + radius * 0.5, y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, y - radius * 0.5);
        ctx.lineTo(x, y + radius * 0.5);
        ctx.stroke();
    },

    darkenColor(color, amount) {
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) * (1 - amount));
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) * (1 - amount));
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) * (1 - amount));
        return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
