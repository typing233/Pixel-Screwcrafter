const Game = {
    currentScreen: 'main-menu',
    currentTheme: 'nature',
    currentLevel: null,
    gameState: {
        isPlaying: false,
        isPaused: false,
        isShowingTarget: false,
        startTime: 0,
        elapsedTime: 0,
        timerInterval: null,
        moveCount: 0,
        screwInventory: [],
        selectedScrew: null,
        screwsOnBoard: [],
        pixelsRevealed: [],
        history: [],
        targetShown: false
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
            if (!this.gameState.isPlaying || this.gameState.isPaused || this.gameState.isShowingTarget) return;
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
            isPlaying: false,
            isPaused: false,
            isShowingTarget: true,
            startTime: Date.now(),
            elapsedTime: 0,
            timerInterval: null,
            moveCount: 0,
            screwInventory: [],
            selectedScrew: null,
            screwsOnBoard: [],
            pixelsRevealed: [],
            history: [],
            targetShown: false
        };

        document.getElementById('current-level-name').textContent = `${level.emoji} ${level.name}`;
        document.getElementById('move-count').textContent = '移动: 0';
        document.getElementById('game-timer').textContent = '记忆目标图...';

        this.calculateGrid();
        this.renderTarget();
        this.updateScrewInventory();
        
        AudioManager.playBGM();

        setTimeout(() => {
            this.startPuzzle();
        }, 3000);
    },

    startPuzzle() {
        this.gameState.isShowingTarget = false;
        this.gameState.isPlaying = true;
        this.gameState.targetShown = true;
        this.gameState.startTime = Date.now();

        const level = this.currentLevel;
        
        const screwPositions = JSON.parse(JSON.stringify(level.screwPositions));
        
        const shuffledPositions = this.shuffleScrewPositions(screwPositions);
        
        this.gameState.screwsOnBoard = shuffledPositions;
        this.gameState.screwInventory = [];

        this.startTimer();
        this.render();
        this.updateScrewInventory();
        
        document.getElementById('game-timer').textContent = '00:00';
    },

    shuffleScrewPositions(originalPositions) {
        const level = this.currentLevel;
        const validPositions = [];
        
        for (let y = 0; y < level.gridSize; y++) {
            for (let x = 0; x < level.gridSize; x++) {
                if (level.pixels[y][x] !== 0) {
                    validPositions.push({x, y});
                }
            }
        }

        const shuffled = [];
        const usedPositions = new Set();
        const originalSet = new Set(originalPositions.map(p => `${p.x},${p.y}`));

        for (const screw of originalPositions) {
            let attempts = 0;
            let newPos;
            
            do {
                newPos = validPositions[Math.floor(Math.random() * validPositions.length)];
                attempts++;
            } while (
                (usedPositions.has(`${newPos.x},${newPos.y}`) || 
                 (originalSet.has(`${newPos.x},${newPos.y}`) && attempts < 50)) &&
                attempts < 100
            );

            usedPositions.add(`${newPos.x},${newPos.y}`);
            shuffled.push({
                x: newPos.x,
                y: newPos.y,
                color: screw.color,
                targetX: screw.x,
                targetY: screw.y
            });
        }

        return shuffled;
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
            if (!this.gameState.isPaused && !this.gameState.isShowingTarget) {
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
                ...screw
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
            targetX: screw.targetX,
            targetY: screw.targetY
        });

        this.gameState.selectedScrew = null;
        this.gameState.moveCount++;

        document.getElementById('move-count').textContent = `移动: ${this.gameState.moveCount}`;

        const isCorrectPosition = (gridX === screw.targetX && gridY === screw.targetY);
        
        if (isCorrectPosition) {
            AudioManager.playScrewScrew();
            AudioManager.playPixelReveal();
        } else {
            AudioManager.playScrewScrew();
        }

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
        const level = this.currentLevel;
        
        for (const screw of this.gameState.screwsOnBoard) {
            const isCorrect = (screw.x === screw.targetX && screw.y === screw.targetY);
            if (!isCorrect) {
                this.showHintForScrew(screw);
                return;
            }
        }

        for (const screw of this.gameState.screwInventory) {
            this.showHintForScrew(screw);
            return;
        }
    },

    showHintForScrew(screw) {
        const isOnBoard = this.gameState.screwsOnBoard.some(s => s.x === screw.x && s.y === screw.y);
        
        if (isOnBoard) {
            this.highlightCellWithMessage(
                screw.x, screw.y, 
                screw.targetX, screw.targetY,
                '这个螺丝应该移动到高亮位置'
            );
        } else {
            this.highlightTargetPosition(
                screw.targetX, screw.targetY,
                screw.color
            );
        }
    },

    highlightCellWithMessage(fromX, fromY, toX, toY, message) {
        this.highlightCell(fromX, fromY, '#FF6B6B');
        this.highlightCell(toX, toY, '#4ECDC4');
        
        this.showHintMessage(message);
    },

    highlightTargetPosition(targetX, targetY, colorIndex) {
        this.highlightCell(targetX, targetY, '#4ECDC4');
        
        const colorName = this.getColorName(colorIndex);
        this.showHintMessage(`将 ${colorName} 螺丝放到高亮位置`);
    },

    getColorName(colorIndex) {
        const level = this.currentLevel;
        const color = level.colorMap[colorIndex];
        
        const colorNames = {
            '#FFD700': '金色',
            '#FFA500': '橙色',
            '#8B4513': '棕色',
            '#4A2C2A': '深棕色',
            '#228B22': '绿色',
            '#FFB6C1': '浅粉色',
            '#FF69B4': '粉色',
            '#FF1493': '深粉色',
            '#C71585': '紫红色',
            '#000000': '黑色',
            '#333333': '深灰色',
            '#FFFFFF': '白色',
            '#C0C0C0': '银色',
            '#808080': '灰色',
            '#4169E1': '蓝色',
            '#FF4500': '橙红色',
            '#90EE90': '浅绿色',
            '#32CD32': '酸橙色',
            '#DC143C': '猩红色',
            '#FFFF00': '黄色',
            '#FF0000': '红色',
            '#00FF00': '亮绿色',
            '#0000FF': '蓝色',
            '#4B0082': '靛蓝色',
            '#9400D3': '紫色'
        };
        
        return colorNames[color] || `${colorIndex}号`;
    },

    showHintMessage(message) {
        let hintElement = document.getElementById('hint-message');
        if (!hintElement) {
            hintElement = document.createElement('div');
            hintElement.id = 'hint-message';
            hintElement.style.cssText = `
                position: fixed;
                top: 100px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.9);
                color: #FFD700;
                padding: 15px 30px;
                border-radius: 10px;
                font-size: 1.2rem;
                z-index: 2000;
                border: 2px solid #FFD700;
                text-align: center;
                max-width: 80%;
            `;
            document.body.appendChild(hintElement);
        }
        
        hintElement.textContent = message;
        hintElement.style.display = 'block';
        
        setTimeout(() => {
            hintElement.style.display = 'none';
        }, 3000);
    },

    highlightCell(gridX, gridY, color = '#FFD700') {
        this.render();
        
        const x = this.offsetX + gridX * this.cellSize;
        const y = this.offsetY + gridY * this.cellSize;
        
        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 4;
        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4);
        this.ctx.restore();

        setTimeout(() => {
            this.render();
        }, 3000);
    },

    updateScrewInventory() {
        const inventory = document.getElementById('screw-inventory');
        inventory.innerHTML = '';

        this.gameState.screwInventory.forEach((screw, index) => {
            const item = document.createElement('div');
            item.className = `screw-item ${index === this.gameState.selectedScrew ? 'selected' : ''}`;
            
            const level = this.currentLevel;
            const isCorrectOnBoard = this.gameState.screwsOnBoard.some(
                s => s.x === screw.targetX && s.y === screw.targetY && 
                     s.color === screw.color
            );
            
            let statusText = '';
            if (!isCorrectOnBoard) {
                statusText = `<div style="font-size:0.6rem;color:#aaa;margin-top:2px;">目标:(${screw.targetX},${screw.targetY})</div>`;
            }
            
            item.innerHTML = `🔩${statusText}`;
            item.style.backgroundColor = level.colorMap[screw.color] || '#888';
            
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
        
        const allCorrect = this.gameState.screwsOnBoard.every(screw => {
            return screw.x === screw.targetX && screw.y === screw.targetY;
        });

        const totalScrews = level.screwPositions.length;
        const allPlaced = this.gameState.screwsOnBoard.length === totalScrews;

        if (allCorrect && allPlaced) {
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

    renderTarget() {
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
                    ctx.fillStyle = level.colorMap[pixelValue] || '#888';
                }

                ctx.fillRect(xPos, yPos, this.cellSize, this.cellSize);

                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1;
                ctx.strokeRect(xPos, yPos, this.cellSize, this.cellSize);
            }
        }

        level.screwPositions.forEach(screw => {
            this.drawScrew(screw.x, screw.y, screw.color);
        });

        this.showTargetHint();
    },

    showTargetHint() {
        const ctx = this.ctx;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(centerX - 200, centerY + 100, 400, 60);

        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('📸 记住目标图 - 3秒后开始拼图', centerX, centerY + 138);
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
                    const screwOnPosition = this.gameState.screwsOnBoard.find(
                        s => s.x === x && s.y === y
                    );

                    if (screwOnPosition) {
                        const isCorrect = (screwOnPosition.x === screwOnPosition.targetX && 
                                          screwOnPosition.y === screwOnPosition.targetY);
                        
                        if (isCorrect) {
                            ctx.fillStyle = level.colorMap[pixelValue] || '#888';
                        } else {
                            const color = level.colorMap[pixelValue] || '#888';
                            ctx.fillStyle = this.darkenColor(color, 0.5);
                        }
                    } else {
                        const targetScrew = level.screwPositions.find(
                            s => s.x === x && s.y === y
                        );
                        
                        if (targetScrew) {
                            const color = level.colorMap[pixelValue] || '#888';
                            ctx.fillStyle = this.darkenColor(color, 0.5);
                        } else {
                            ctx.fillStyle = level.colorMap[pixelValue] || '#888';
                        }
                    }
                }

                ctx.fillRect(xPos, yPos, this.cellSize, this.cellSize);

                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1;
                ctx.strokeRect(xPos, yPos, this.cellSize, this.cellSize);
            }
        }

        this.gameState.screwsOnBoard.forEach(screw => {
            const isCorrect = (screw.x === screw.targetX && screw.y === screw.targetY);
            this.drawScrew(screw.x, screw.y, screw.color, isCorrect);
        });
    },

    drawScrew(gridX, gridY, colorIndex, isCorrect = true) {
        const ctx = this.ctx;
        const x = this.offsetX + gridX * this.cellSize + this.cellSize / 2;
        const y = this.offsetY + gridY * this.cellSize + this.cellSize / 2;
        const radius = this.cellSize * 0.35;

        const gradient = ctx.createRadialGradient(
            x - radius * 0.3, y - radius * 0.3, 0,
            x, y, radius
        );
        
        if (isCorrect) {
            gradient.addColorStop(0, '#FFD700');
            gradient.addColorStop(0.5, '#DAA520');
            gradient.addColorStop(1, '#B8860B');
        } else {
            gradient.addColorStop(0, '#A0A0A0');
            gradient.addColorStop(0.5, '#808080');
            gradient.addColorStop(1, '#606060');
        }

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, radius * 0.8, 0, Math.PI * 2);
        ctx.strokeStyle = isCorrect ? '#8B7355' : '#404040';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.strokeStyle = isCorrect ? '#555' : '#404040';
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

        if (!isCorrect) {
            ctx.fillStyle = '#FF6B6B';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('?', x, y - radius - 5);
        }
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
