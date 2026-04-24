const LEVELS = {
    nature: [
        {
            id: 'nature_1',
            name: '向日葵',
            emoji: '🌻',
            difficulty: '简单',
            difficultyLevel: 1,
            gridSize: 12,
            screwCount: 8,
            unlocked: true,
            targetTime: 120,
            perfectMoves: 10,
            pixels: [
                [0,0,0,0,1,1,1,1,0,0,0,0],
                [0,0,1,1,1,2,2,1,1,1,0,0],
                [0,1,1,2,2,2,2,2,2,1,1,0],
                [0,1,2,2,3,3,3,3,2,2,1,0],
                [1,1,2,3,3,3,3,3,3,2,1,1],
                [1,2,2,3,3,4,4,3,3,2,2,1],
                [1,2,2,3,3,4,4,3,3,2,2,1],
                [1,1,2,3,3,3,3,3,3,2,1,1],
                [0,1,2,2,3,3,3,3,2,2,1,0],
                [0,1,1,2,2,2,2,2,2,1,1,0],
                [0,0,0,0,5,5,5,5,0,0,0,0],
                [0,0,0,0,5,5,5,5,0,0,0,0]
            ],
            colorMap: {
                1: '#FFD700',
                2: '#FFA500',
                3: '#8B4513',
                4: '#4A2C2A',
                5: '#228B22'
            },
            screwPositions: [
                {x: 2, y: 2, color: 1},
                {x: 9, y: 2, color: 1},
                {x: 5, y: 5, color: 3},
                {x: 6, y: 5, color: 3},
                {x: 2, y: 9, color: 2},
                {x: 9, y: 9, color: 2},
                {x: 5, y: 11, color: 5},
                {x: 6, y: 11, color: 5}
            ]
        },
        {
            id: 'nature_2',
            name: '樱花树',
            emoji: '🌸',
            difficulty: '中等',
            difficultyLevel: 2,
            gridSize: 14,
            screwCount: 12,
            unlocked: false,
            targetTime: 180,
            perfectMoves: 15,
            pixels: [
                [0,0,0,1,1,1,1,1,1,0,0,0,0,0],
                [0,0,1,1,2,2,2,2,1,1,0,0,0,0],
                [0,1,1,2,2,3,3,2,2,1,1,0,0,0],
                [0,1,2,2,3,3,3,3,2,2,1,0,0,0],
                [1,1,2,3,3,3,3,3,3,2,1,1,0,0],
                [1,2,2,3,3,4,4,3,3,2,2,1,0,0],
                [1,2,3,3,4,4,4,4,3,3,2,1,0,0],
                [0,1,2,3,3,4,4,3,3,2,1,0,0,0],
                [0,1,1,2,3,3,3,3,2,1,1,0,0,0],
                [0,0,1,1,2,2,2,2,1,1,0,0,0,0],
                [0,0,0,0,5,5,5,5,0,0,0,0,0,0],
                [0,0,0,0,5,5,5,5,0,0,0,0,0,0],
                [0,0,0,0,5,5,5,5,0,0,0,0,0,0],
                [0,0,0,0,5,5,5,5,0,0,0,0,0,0]
            ],
            colorMap: {
                1: '#FFB6C1',
                2: '#FF69B4',
                3: '#FF1493',
                4: '#C71585',
                5: '#8B4513'
            },
            screwPositions: [
                {x: 3, y: 2, color: 2},
                {x: 8, y: 2, color: 2},
                {x: 5, y: 4, color: 3},
                {x: 8, y: 4, color: 3},
                {x: 3, y: 5, color: 2},
                {x: 10, y: 5, color: 2},
                {x: 5, y: 6, color: 4},
                {x: 6, y: 6, color: 4},
                {x: 4, y: 9, color: 2},
                {x: 7, y: 9, color: 2},
                {x: 5, y: 12, color: 5},
                {x: 6, y: 12, color: 5}
            ]
        },
        {
            id: 'nature_3',
            name: '彩虹',
            emoji: '🌈',
            difficulty: '困难',
            difficultyLevel: 3,
            gridSize: 16,
            screwCount: 15,
            unlocked: false,
            targetTime: 240,
            perfectMoves: 20,
            pixels: [
                [0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0],
                [0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0],
                [0,0,0,1,1,2,2,2,2,2,1,1,0,0,0,0],
                [0,0,1,1,2,2,3,3,3,3,2,2,1,1,0,0,0,0],
                [0,1,1,2,2,3,3,4,4,4,4,3,3,2,2,1,1],
                [0,1,2,2,3,3,4,4,5,5,5,5,4,4,3,3,2,2,1],
                [1,1,2,3,3,4,4,5,5,6,6,6,6,5,5,4,4,3,3,2,2,1,1],
                [1,2,2,3,4,4,5,5,6,6,7,7,7,7,6,6,5,5,4,4,3,2,2,1],
                [1,2,3,3,4,5,5,6,6,7,7,0,0,7,7,6,6,5,5,4,3,3,2,1],
                [0,1,2,3,4,4,5,6,6,7,0,0,0,0,7,6,6,5,4,4,3,2,1,0],
                [0,1,1,2,3,4,5,5,6,7,0,0,0,0,7,6,5,5,4,3,2,1,1,0],
                [0,0,1,1,2,3,4,5,6,6,0,0,0,0,6,6,5,4,3,2,1,1,0,0],
                [0,0,0,1,1,2,3,4,5,5,0,0,0,0,5,5,4,3,2,1,1,0,0,0],
                [0,0,0,0,1,1,2,3,4,4,0,0,0,0,4,4,3,2,1,1,0,0,0,0],
                [0,0,0,0,0,0,1,2,3,3,0,0,0,0,3,3,2,1,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,1,2,2,0,0,0,0,2,2,1,0,0,0,0,0,0,0]
            ],
            colorMap: {
                1: '#FF0000',
                2: '#FF7F00',
                3: '#FFFF00',
                4: '#00FF00',
                5: '#0000FF',
                6: '#4B0082',
                7: '#9400D3'
            },
            screwPositions: [
                {x: 6, y: 1, color: 1},
                {x: 7, y: 1, color: 1},
                {x: 5, y: 2, color: 2},
                {x: 8, y: 2, color: 2},
                {x: 6, y: 3, color: 3},
                {x: 7, y: 3, color: 3},
                {x: 7, y: 4, color: 4},
                {x: 8, y: 4, color: 4},
                {x: 8, y: 5, color: 5},
                {x: 9, y: 5, color: 5},
                {x: 10, y: 6, color: 6},
                {x: 11, y: 6, color: 6},
                {x: 11, y: 7, color: 7},
                {x: 12, y: 7, color: 7},
                {x: 4, y: 13, color: 1}
            ]
        }
    ],
    characters: [
        {
            id: 'characters_1',
            name: '像素猫咪',
            emoji: '🐱',
            difficulty: '简单',
            difficultyLevel: 1,
            gridSize: 12,
            screwCount: 10,
            unlocked: true,
            targetTime: 150,
            perfectMoves: 12,
            pixels: [
                [0,0,1,1,1,1,1,1,1,1,0,0],
                [0,1,1,1,1,1,1,1,1,1,1,0],
                [1,1,2,2,1,1,1,1,2,2,1,1],
                [1,2,3,2,1,1,1,1,2,3,2,1],
                [1,2,3,2,1,1,1,1,2,3,2,1],
                [1,1,2,2,4,4,4,4,2,2,1,1],
                [1,1,1,1,4,5,5,4,1,1,1,1],
                [0,1,1,1,4,5,5,4,1,1,1,0],
                [0,0,1,1,4,4,4,4,1,1,0,0],
                [0,1,6,6,6,6,6,6,6,6,1,0],
                [0,1,6,6,6,6,6,6,6,6,1,0],
                [0,0,1,6,6,0,0,6,6,1,0,0]
            ],
            colorMap: {
                1: '#FFA500',
                2: '#000000',
                3: '#333333',
                4: '#FFB6C1',
                5: '#FF69B4',
                6: '#FFFFFF'
            },
            screwPositions: [
                {x: 2, y: 2, color: 2},
                {x: 8, y: 2, color: 2},
                {x: 2, y: 3, color: 3},
                {x: 9, y: 3, color: 3},
                {x: 4, y: 5, color: 4},
                {x: 7, y: 5, color: 4},
                {x: 5, y: 6, color: 5},
                {x: 6, y: 6, color: 5},
                {x: 3, y: 9, color: 6},
                {x: 8, y: 9, color: 6}
            ]
        },
        {
            id: 'characters_2',
            name: '像素熊猫',
            emoji: '🐼',
            difficulty: '中等',
            difficultyLevel: 2,
            gridSize: 14,
            screwCount: 14,
            unlocked: false,
            targetTime: 200,
            perfectMoves: 18,
            pixels: [
                [0,0,0,0,1,1,1,1,1,1,0,0,0,0],
                [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
                [0,1,1,2,2,1,1,1,1,2,2,1,1,0],
                [1,1,2,2,2,2,1,1,2,2,2,2,1,1],
                [1,2,2,3,3,2,2,2,2,3,3,2,2,1],
                [1,2,2,3,4,2,2,2,2,4,3,2,2,1],
                [1,1,2,2,2,2,5,5,2,2,2,2,1,1],
                [0,1,1,2,2,5,5,5,5,2,2,1,1,0],
                [0,0,1,1,2,5,5,5,5,2,1,1,0,0],
                [0,0,0,1,1,2,2,2,2,1,1,0,0,0],
                [0,0,1,1,6,6,6,6,6,6,1,1,0,0],
                [0,1,1,6,6,6,6,6,6,6,6,1,1,0],
                [0,1,6,6,6,6,0,0,6,6,6,6,1,0],
                [0,0,6,6,0,0,0,0,0,0,6,6,0,0]
            ],
            colorMap: {
                1: '#FFFFFF',
                2: '#000000',
                3: '#333333',
                4: '#FFFFFF',
                5: '#FFB6C1',
                6: '#000000'
            },
            screwPositions: [
                {x: 3, y: 2, color: 2},
                {x: 9, y: 2, color: 2},
                {x: 3, y: 4, color: 3},
                {x: 10, y: 4, color: 3},
                {x: 4, y: 5, color: 4},
                {x: 9, y: 5, color: 4},
                {x: 6, y: 6, color: 5},
                {x: 7, y: 6, color: 5},
                {x: 6, y: 7, color: 5},
                {x: 7, y: 7, color: 5},
                {x: 4, y: 10, color: 6},
                {x: 7, y: 10, color: 6},
                {x: 5, y: 12, color: 6},
                {x: 8, y: 12, color: 6}
            ]
        }
    ],
    scifi: [
        {
            id: 'scifi_1',
            name: '宇宙飞船',
            emoji: '🚀',
            difficulty: '简单',
            difficultyLevel: 1,
            gridSize: 12,
            screwCount: 10,
            unlocked: true,
            targetTime: 130,
            perfectMoves: 12,
            pixels: [
                [0,0,0,0,0,1,1,0,0,0,0,0],
                [0,0,0,0,1,1,1,1,0,0,0,0],
                [0,0,0,1,1,2,2,1,1,0,0,0],
                [0,0,1,1,2,2,2,2,1,1,0,0],
                [0,1,1,2,2,3,3,2,2,1,1,0],
                [1,1,2,2,3,3,3,3,2,2,1,1],
                [1,1,2,2,3,3,3,3,2,2,1,1],
                [0,1,1,2,2,3,3,2,2,1,1,0],
                [0,0,1,1,2,2,2,2,1,1,0,0],
                [0,0,0,1,4,4,4,4,1,0,0,0],
                [0,0,0,0,4,5,5,4,0,0,0,0],
                [0,0,0,0,4,5,5,4,0,0,0,0]
            ],
            colorMap: {
                1: '#C0C0C0',
                2: '#808080',
                3: '#4169E1',
                4: '#FF4500',
                5: '#FFD700'
            },
            screwPositions: [
                {x: 5, y: 2, color: 2},
                {x: 6, y: 2, color: 2},
                {x: 5, y: 4, color: 3},
                {x: 6, y: 4, color: 3},
                {x: 5, y: 5, color: 3},
                {x: 6, y: 5, color: 3},
                {x: 4, y: 9, color: 4},
                {x: 7, y: 9, color: 4},
                {x: 5, y: 10, color: 5},
                {x: 6, y: 10, color: 5}
            ]
        },
        {
            id: 'scifi_2',
            name: '外星生命',
            emoji: '👽',
            difficulty: '中等',
            difficultyLevel: 2,
            gridSize: 14,
            screwCount: 12,
            unlocked: false,
            targetTime: 180,
            perfectMoves: 15,
            pixels: [
                [0,0,0,0,1,1,1,1,1,1,0,0,0,0],
                [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
                [0,1,1,2,2,1,1,1,1,2,2,1,1,0],
                [1,1,2,2,2,2,1,1,2,2,2,2,1,1],
                [1,2,2,3,3,2,2,2,2,3,3,2,2,1],
                [1,2,2,3,4,2,2,2,2,4,3,2,2,1],
                [1,1,2,2,2,2,2,2,2,2,2,2,1,1],
                [0,1,1,2,2,2,2,2,2,2,2,1,1,0],
                [0,0,1,1,2,2,5,5,2,2,1,1,0,0],
                [0,0,0,1,1,2,5,5,2,1,1,0,0,0],
                [0,0,0,0,1,1,2,2,1,1,0,0,0,0],
                [0,0,0,1,6,6,6,6,6,6,1,0,0,0],
                [0,0,1,6,6,6,0,0,6,6,6,1,0,0],
                [0,0,0,6,6,0,0,0,0,6,6,0,0,0]
            ],
            colorMap: {
                1: '#90EE90',
                2: '#32CD32',
                3: '#000000',
                4: '#FFFFFF',
                5: '#FF1493',
                6: '#32CD32'
            },
            screwPositions: [
                {x: 3, y: 2, color: 2},
                {x: 10, y: 2, color: 2},
                {x: 3, y: 4, color: 3},
                {x: 10, y: 4, color: 3},
                {x: 4, y: 5, color: 4},
                {x: 9, y: 5, color: 4},
                {x: 6, y: 8, color: 5},
                {x: 7, y: 8, color: 5},
                {x: 4, y: 11, color: 6},
                {x: 7, y: 11, color: 6},
                {x: 5, y: 12, color: 6},
                {x: 8, y: 12, color: 6}
            ]
        }
    ],
    everyday: [
        {
            id: 'everyday_1',
            name: '咖啡杯',
            emoji: '☕',
            difficulty: '简单',
            difficultyLevel: 1,
            gridSize: 12,
            screwCount: 8,
            unlocked: true,
            targetTime: 100,
            perfectMoves: 10,
            pixels: [
                [0,0,0,1,1,1,1,1,1,0,0,0],
                [0,1,1,1,2,2,2,2,1,1,1,0],
                [1,1,2,2,2,2,2,2,2,2,1,1],
                [1,2,2,2,2,2,2,2,2,2,2,1],
                [1,2,2,2,2,2,2,2,2,2,2,1],
                [1,2,2,2,2,2,2,2,2,2,2,1],
                [0,1,2,2,2,2,2,2,2,2,1,3],
                [0,1,2,2,2,2,2,2,2,2,1,3],
                [0,1,2,2,2,2,2,2,2,2,1,3],
                [0,0,1,1,2,2,2,2,1,1,0,3],
                [0,0,0,0,1,1,1,1,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0]
            ],
            colorMap: {
                1: '#FFFFFF',
                2: '#8B4513',
                3: '#FFFFFF'
            },
            screwPositions: [
                {x: 4, y: 1, color: 2},
                {x: 7, y: 1, color: 2},
                {x: 2, y: 2, color: 2},
                {x: 9, y: 2, color: 2},
                {x: 4, y: 5, color: 2},
                {x: 7, y: 5, color: 2},
                {x: 5, y: 9, color: 2},
                {x: 6, y: 9, color: 2}
            ]
        },
        {
            id: 'everyday_2',
            name: '披萨',
            emoji: '🍕',
            difficulty: '中等',
            difficultyLevel: 2,
            gridSize: 14,
            screwCount: 12,
            unlocked: false,
            targetTime: 160,
            perfectMoves: 14,
            pixels: [
                [0,0,0,0,0,0,1,1,0,0,0,0,0,0],
                [0,0,0,0,1,1,1,1,1,1,0,0,0,0],
                [0,0,0,1,1,2,2,2,2,1,1,0,0,0],
                [0,0,1,1,2,2,2,2,2,2,1,1,0,0],
                [0,1,1,2,2,3,3,3,3,2,2,1,1,0],
                [0,1,2,2,3,3,4,4,3,3,2,2,1,0],
                [1,1,2,3,3,4,4,4,4,3,3,2,1,1],
                [1,1,2,3,3,4,4,4,4,3,3,2,1,1],
                [1,2,2,3,3,4,4,4,4,3,3,2,2,1],
                [0,1,2,2,3,3,4,4,3,3,2,2,1,0],
                [0,1,1,2,2,3,3,3,3,2,2,1,1,0],
                [0,0,1,1,2,2,2,2,2,2,1,1,0,0],
                [0,0,0,1,1,2,2,2,2,1,1,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            ],
            colorMap: {
                1: '#DAA520',
                2: '#DC143C',
                3: '#FFD700',
                4: '#FF0000'
            },
            screwPositions: [
                {x: 6, y: 2, color: 2},
                {x: 7, y: 2, color: 2},
                {x: 5, y: 4, color: 3},
                {x: 8, y: 4, color: 3},
                {x: 6, y: 5, color: 4},
                {x: 7, y: 5, color: 4},
                {x: 6, y: 6, color: 4},
                {x: 7, y: 6, color: 4},
                {x: 5, y: 9, color: 3},
                {x: 8, y: 9, color: 3},
                {x: 6, y: 12, color: 2},
                {x: 7, y: 12, color: 2}
            ]
        }
    ]
};

const GAME_THEMES = {
    classic: {
        name: '经典复古',
        bgColor: '#1a1a2e',
        primaryColor: '#16213e',
        secondaryColor: '#0f3460',
        accentColor: '#e94560',
        textColor: '#f1f1f1',
        textSecondary: '#a0a0a0'
    },
    dark: {
        name: '深色模式',
        bgColor: '#0d0d0d',
        primaryColor: '#1a1a1a',
        secondaryColor: '#2d2d2d',
        accentColor: '#bb86fc',
        textColor: '#e0e0e0',
        textSecondary: '#888888'
    },
    light: {
        name: '浅色模式',
        bgColor: '#f5f5f5',
        primaryColor: '#ffffff',
        secondaryColor: '#e0e0e0',
        accentColor: '#4caf50',
        textColor: '#333333',
        textSecondary: '#666666'
    }
};

function getAllLevels() {
    let allLevels = [];
    Object.keys(LEVELS).forEach(theme => {
        LEVELS[theme].forEach(level => {
            allLevels.push({...level, theme});
        });
    });
    return allLevels;
}

function getLevelById(levelId) {
    const allLevels = getAllLevels();
    return allLevels.find(l => l.id === levelId);
}

function getNextLevel(currentLevelId) {
    const allLevels = getAllLevels();
    const currentIndex = allLevels.findIndex(l => l.id === currentLevelId);
    if (currentIndex !== -1 && currentIndex < allLevels.length - 1) {
        return allLevels[currentIndex + 1];
    }
    return null;
}

function unlockLevel(levelId) {
    const allLevels = getAllLevels();
    const nextLevel = getNextLevel(levelId);
    if (nextLevel) {
        Object.keys(LEVELS).forEach(theme => {
            LEVELS[theme].forEach(level => {
                if (level.id === nextLevel.id) {
                    level.unlocked = true;
                }
            });
        });
    }
}
