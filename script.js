class FakeCasino {
    constructor() {
        console.log('🎰 Initializing Fake Casino...');
        this.balance = this.loadBalance();
        this.ownedItems = this.loadOwnedItems();
        this.activeCosmetics = this.loadActiveCosmetics();
        this.gameStats = this.loadGameStats();
        this.currentGame = null;
        
        // Game states
        this.games = {
            blackjack: { active: false, playerHand: [], dealerHand: [], deck: [], betAmount: 0 },
            plinko: { 
                dropping: false, 
                stats: { 
                    lastWin: this.gameStats.plinko ? this.gameStats.plinko.lastWin : 0, 
                    totalWon: this.gameStats.plinko ? this.gameStats.plinko.totalWon : 0 
                } 
            },
            aviator: { flying: false, betting: false, multiplier: 1.0, betAmount: 0, interval: null },
            roulette: { spinning: false, bets: [] },
            minesweeper: { active: false, mines: [], revealed: [], gemsFound: 0, betAmount: 0 }
        };

        this.initializeUI();
        this.initializeShop();
        this.updateBalance();
        
        // Apply cosmetics after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.applyActiveCosmetics();
        }, 100);
        
        console.log('✅ Fake Casino ready!');
    }

    // ============ CORE SYSTEM ============
    loadBalance() {
        return parseInt(localStorage.getItem('fake-casino-balance')) || 1000;
    }

    saveBalance() {
        localStorage.setItem('fake-casino-balance', this.balance.toString());
    }

    loadOwnedItems() {
        const saved = localStorage.getItem('fake-casino-owned');
        return saved ? JSON.parse(saved) : [];
    }

    saveOwnedItems() {
        localStorage.setItem('fake-casino-owned', JSON.stringify(this.ownedItems));
    }

    loadActiveCosmetics() {
        const saved = localStorage.getItem('fake-casino-cosmetics');
        return saved ? JSON.parse(saved) : {
            cardSleeve: null,
            background: null,
            effect: null,
            plinko: null,
            plane: null,
            trail: null,
            cursor: null,
            sound: null,
            particle: null,
            theme: null
        };
    }

    saveActiveCosmetics() {
        localStorage.setItem('fake-casino-cosmetics', JSON.stringify(this.activeCosmetics));
    }

    loadGameStats() {
        const saved = localStorage.getItem('fake-casino-stats');
        return saved ? JSON.parse(saved) : { plinko: { lastWin: 0, totalWon: 0 } };
    }

    saveGameStats() {
        this.gameStats.plinko = this.games.plinko.stats;
        localStorage.setItem('fake-casino-stats', JSON.stringify(this.gameStats));
    }

    createParticleEffect(particleType) {
        // Remove existing particle effects
        const existingParticles = document.querySelectorAll('.particle-effect');
        existingParticles.forEach(p => p.remove());
        
        if (particleType === 'particles-none') return;
        
        const particleContainer = document.createElement('div');
        particleContainer.className = `particle-effect ${particleType}`;
        document.body.appendChild(particleContainer);
        
        // Create particles based on type
        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                // Set particle appearance based on type
                switch(particleType) {
                    case 'floating-coins':
                        particle.textContent = '🪙';
                        break;
                    case 'magic-sparkles':
                        particle.textContent = '✨';
                        break;
                    case 'floating-cards':
                        particle.textContent = '🃏';
                        break;
                    case 'dice-particles':
                        particle.textContent = '🎲';
                        break;
                    case 'gem-shower':
                        particle.textContent = '💎';
                        break;
                    case 'phoenix-feathers':
                        particle.textContent = '🪶';
                        break;
                }
                
                // Random positioning
                particle.style.left = Math.random() * window.innerWidth + 'px';
                particle.style.animationDelay = Math.random() * 3 + 's';
                particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
                
                particleContainer.appendChild(particle);
            }, i * 100);
        }
    }

    updateBalance() {
        document.getElementById('balance').textContent = this.balance;
        this.saveBalance();
    }

    showMessage(text) {
        const messageEl = document.getElementById('message');
        messageEl.textContent = text;
        
        // Create toast notification
        this.showToast(text);
    }

    showToast(message) {
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 10000;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white; padding: 15px 25px; border-radius: 10px;
            font-weight: bold; box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        if (!document.head.querySelector('style[data-toast]')) {
            style.dataset.toast = 'true';
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 4000);
    }

    applyActiveCosmetics() {
        // Apply background
        if (this.activeCosmetics.background) {
            this.applyBackground(this.activeCosmetics.background);
        }
        
        // Apply effects
        if (this.activeCosmetics.effect) {
            this.applyEffect(this.activeCosmetics.effect);
        }
        
        // Apply cursor
        if (this.activeCosmetics.cursor) {
            this.applyCursor(this.activeCosmetics.cursor);
        }
        
        // Apply particle effects
        if (this.activeCosmetics.particle) {
            this.createParticleEffect(this.activeCosmetics.particle);
        }
        
        // Apply theme
        if (this.activeCosmetics.theme) {
            this.applyTheme(this.activeCosmetics.theme);
        }
    }

    applyBackground(backgroundId) {
        const backgrounds = {
            'space-bg': 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #000428 75%, #004e92 100%)',
            'ocean-bg': 'linear-gradient(135deg, #667db6 0%, #0082c8 25%, #0052d4 50%, #4fb3d9 75%, #c2e9fb 100%)',
            'fire-bg': 'linear-gradient(135deg, #ff9a56 0%, #ff6b35 25%, #f12711 50%, #f5af19 75%, #f12711 100%)',
            'neon-bg': 'linear-gradient(135deg, #ff00ff 0%, #00ffff 25%, #ff0080 50%, #8000ff 75%, #ff4080 100%)',
            'galaxy-bg': 'linear-gradient(135deg, #2c1810 0%, #8b4513 25%, #1e0a3c 50%, #4b0082 75%, #0f0f23 100%)',
            'matrix-bg': 'linear-gradient(135deg, #001100 0%, #003300 25%, #002200 50%, #004400 75%, #001100 100%)',
            'sunset-bg': 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 25%, #ff6b6b 50%, #feca57 75%, #ff9ff3 100%)',
            'aurora-bg': 'linear-gradient(135deg, #00c9ff 0%, #92fe9d 25%, #00c9ff 50%, #92fe9d 75%, #00c9ff 100%)',
            'volcanic-bg': 'linear-gradient(135deg, #8b0000 0%, #ff4500 25%, #ff6347 50%, #ffa500 75%, #ff0000 100%)',
            'cyberpunk-bg': 'linear-gradient(135deg, #0a0a0a 0%, #1a0033 25%, #330066 50%, #0a0a0a 75%, #1a0033 100%)',
            'underwater-bg': 'linear-gradient(135deg, #001f3f 0%, #003d7a 25%, #0077be 50%, #20b2aa 75%, #48d1cc 100%)',
            'crystal-bg': 'linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 25%, #a0a0a0 50%, #e0e0e0 75%, #ffffff 100%)'
        };
        
        if (backgrounds[backgroundId]) {
            document.body.style.background = backgrounds[backgroundId];
        }
    }

    applyEffect(effectId) {
        // Remove existing effects
        document.querySelectorAll('.cosmetic-effect').forEach(el => el.remove());
        
        if (effectId === 'sparkle-fx') {
            this.addSparkleEffect();
        } else if (effectId === 'rainbow-fx') {
            this.addRainbowEffect();
        } else if (effectId === 'lightning-fx') {
            this.addLightningEffect();
        } else if (effectId === 'snow-fx') {
            this.addSnowEffect();
        } else if (effectId === 'confetti-fx') {
            this.addConfettiEffect();
        } else if (effectId === 'fireworks-fx') {
            this.addFireworksEffect();
        } else if (effectId === 'magic-fx') {
            this.addMagicEffect();
        } else if (effectId === 'coins-fx') {
            this.addCoinsEffect();
        }
    }

    addSparkleEffect() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'cosmetic-effect';
                sparkle.textContent = '✨';
                sparkle.style.cssText = `
                    position: fixed;
                    top: ${Math.random() * 100}vh;
                    left: ${Math.random() * 100}vw;
                    font-size: 20px;
                    pointer-events: none;
                    z-index: 9999;
                    animation: sparkleFloat 3s ease-out forwards;
                `;
                
                document.body.appendChild(sparkle);
                
                setTimeout(() => sparkle.remove(), 3000);
            }, i * 200);
        }
        
        // Add sparkle animation CSS
        if (!document.head.querySelector('#sparkle-style')) {
            const style = document.createElement('style');
            style.id = 'sparkle-style';
            style.textContent = `
                @keyframes sparkleFloat {
                    0% { opacity: 0; transform: scale(0) rotate(0deg); }
                    50% { opacity: 1; transform: scale(1) rotate(180deg); }
                    100% { opacity: 0; transform: scale(0) rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    addRainbowEffect() {
        const rainbow = document.createElement('div');
        rainbow.className = 'cosmetic-effect';
        rainbow.textContent = '🌈';
        rainbow.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 100px;
            pointer-events: none;
            z-index: 9999;
            animation: rainbowSpin 2s ease-in-out;
        `;
        
        document.body.appendChild(rainbow);
        
        // Add rainbow animation CSS
        if (!document.head.querySelector('#rainbow-style')) {
            const style = document.createElement('style');
            style.id = 'rainbow-style';
            style.textContent = `
                @keyframes rainbowSpin {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0) rotate(0deg); }
                    50% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(180deg); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0) rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => rainbow.remove(), 2000);
    }

    addLightningEffect() {
        const lightning = document.createElement('div');
        lightning.className = 'cosmetic-effect';
        lightning.textContent = '⚡';
        lightning.style.cssText = `
            position: fixed;
            top: 10%;
            left: ${Math.random() * 80 + 10}%;
            font-size: 60px;
            pointer-events: none;
            z-index: 9999;
            animation: lightningStrike 0.5s ease-out;
        `;
        
        document.body.appendChild(lightning);
        
        // Flash effect
        document.body.style.filter = 'brightness(1.5)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 100);
        
        // Add lightning animation CSS
        if (!document.head.querySelector('#lightning-style')) {
            const style = document.createElement('style');
            style.id = 'lightning-style';
            style.textContent = `
                @keyframes lightningStrike {
                    0% { opacity: 0; transform: scale(0); }
                    20% { opacity: 1; transform: scale(1); }
                    100% { opacity: 0; transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => lightning.remove(), 500);
    }

    addSnowEffect() {
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const snow = document.createElement('div');
                snow.className = 'cosmetic-effect';
                snow.textContent = '❄️';
                snow.style.cssText = `
                    position: fixed;
                    top: -50px;
                    left: ${Math.random() * 100}vw;
                    font-size: ${15 + Math.random() * 10}px;
                    pointer-events: none;
                    z-index: 9999;
                    animation: snowFall 5s linear forwards;
                `;
                
                document.body.appendChild(snow);
                
                setTimeout(() => snow.remove(), 5000);
            }, i * 100);
        }
        
        if (!document.head.querySelector('#snow-style')) {
            const style = document.createElement('style');
            style.id = 'snow-style';
            style.textContent = `
                @keyframes snowFall {
                    0% { transform: translateY(-50px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    addConfettiEffect() {
        const confettiColors = ['🔴', '🟡', '🟢', '🔵', '🟣', '🟠'];
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'cosmetic-effect';
                confetti.textContent = confettiColors[Math.floor(Math.random() * confettiColors.length)];
                confetti.style.cssText = `
                    position: fixed;
                    top: -20px;
                    left: ${Math.random() * 100}vw;
                    font-size: 20px;
                    pointer-events: none;
                    z-index: 9999;
                    animation: confettiFall 3s ease-out forwards;
                `;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 3000);
            }, i * 50);
        }
        
        if (!document.head.querySelector('#confetti-style')) {
            const style = document.createElement('style');
            style.id = 'confetti-style';
            style.textContent = `
                @keyframes confettiFall {
                    0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    addFireworksEffect() {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.className = 'cosmetic-effect';
                firework.textContent = '🎆';
                firework.style.cssText = `
                    position: fixed;
                    top: ${20 + Math.random() * 40}%;
                    left: ${20 + Math.random() * 60}%;
                    font-size: 40px;
                    pointer-events: none;
                    z-index: 9999;
                    animation: fireworkBurst 2s ease-out forwards;
                `;
                
                document.body.appendChild(firework);
                
                setTimeout(() => firework.remove(), 2000);
            }, i * 300);
        }
        
        if (!document.head.querySelector('#firework-style')) {
            const style = document.createElement('style');
            style.id = 'firework-style';
            style.textContent = `
                @keyframes fireworkBurst {
                    0% { transform: scale(0); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 1; }
                    100% { transform: scale(3); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    addMagicEffect() {
        const magicSymbols = ['🔮', '✨', '🌟', '💫', '⭐'];
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const magic = document.createElement('div');
                magic.className = 'cosmetic-effect';
                magic.textContent = magicSymbols[Math.floor(Math.random() * magicSymbols.length)];
                magic.style.cssText = `
                    position: fixed;
                    top: ${Math.random() * 100}vh;
                    left: ${Math.random() * 100}vw;
                    font-size: 25px;
                    pointer-events: none;
                    z-index: 9999;
                    animation: magicFloat 4s ease-in-out forwards;
                `;
                
                document.body.appendChild(magic);
                
                setTimeout(() => magic.remove(), 4000);
            }, i * 150);
        }
        
        if (!document.head.querySelector('#magic-style')) {
            const style = document.createElement('style');
            style.id = 'magic-style';
            style.textContent = `
                @keyframes magicFloat {
                    0% { transform: scale(0) rotate(0deg); opacity: 0; }
                    25% { transform: scale(1) rotate(90deg); opacity: 1; }
                    75% { transform: scale(1.2) rotate(270deg); opacity: 1; }
                    100% { transform: scale(0) rotate(360deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    addCoinsEffect() {
        for (let i = 0; i < 25; i++) {
            setTimeout(() => {
                const coin = document.createElement('div');
                coin.className = 'cosmetic-effect';
                coin.textContent = '🪙';
                coin.style.cssText = `
                    position: fixed;
                    top: -20px;
                    left: ${Math.random() * 100}vw;
                    font-size: 24px;
                    pointer-events: none;
                    z-index: 9999;
                    animation: coinRain 4s ease-in forwards;
                `;
                
                document.body.appendChild(coin);
                
                setTimeout(() => coin.remove(), 4000);
            }, i * 80);
        }
        
        if (!document.head.querySelector('#coin-style')) {
            const style = document.createElement('style');
            style.id = 'coin-style';
            style.textContent = `
                @keyframes coinRain {
                    0% { transform: translateY(-20px) rotateY(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotateY(1080deg); opacity: 0.7; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    applyCursor(cursorId) {
        const cursorStyles = {
            'golden-cursor': 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'><text y=\'24\' font-size=\'24\'>�</text></svg>"), pointer',
            'fire-cursor': 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'><text y=\'24\' font-size=\'24\'>🔥</text></svg>"), pointer',
            'diamond-cursor': 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'><text y=\'24\' font-size=\'24\'>💎</text></svg>"), pointer',
            'magic-cursor': 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'><text y=\'24\' font-size=\'24\'>🪄</text></svg>"), pointer',
            'lightning-cursor': 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'><text y=\'24\' font-size=\'24\'>⚡</text></svg>"), pointer',
            'star-cursor': 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'><text y=\'24\' font-size=\'24\'>⭐</text></svg>"), pointer'
        };
        
        document.body.style.cursor = cursorStyles[cursorId] || 'default';
    }

    removeParticleEffects() {
        const existingParticles = document.querySelectorAll('.particle-effect');
        existingParticles.forEach(p => p.remove());
    }

    applyTheme(themeId) {
        // Remove existing themes
        document.body.className = document.body.className.replace(/theme-\w+/g, '').trim();
        
        // Add new theme
        if (themeId && themeId !== 'theme-default') {
            document.body.classList.add(themeId);
        }
    }

    removeTheme() {
        document.body.className = document.body.className.replace(/theme-\w+/g, '').trim();
    }

    // Animation helper functions for blackjack
    addCardAnimation(target) {
        const targetElement = target === 'player' ? 
            document.querySelector('#player-hand') : 
            document.querySelector('#dealer-hand');
        
        if (targetElement) {
            targetElement.style.transform = 'scale(1.05)';
            targetElement.style.transition = 'transform 0.2s ease';
            setTimeout(() => {
                targetElement.style.transform = 'scale(1)';
            }, 200);
        }
        
        // Create card flip animation
        const cardFlip = document.createElement('div');
        cardFlip.className = 'card-flip-animation';
        cardFlip.textContent = '🃏';
        cardFlip.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotateY(0deg);
            font-size: 3rem;
            pointer-events: none;
            z-index: 1000;
            animation: cardFlip 0.6s ease-out forwards;
        `;
        
        document.body.appendChild(cardFlip);
        setTimeout(() => cardFlip.remove(), 600);
    }

    addBustAnimation() {
        const bust = document.createElement('div');
        bust.className = 'bust-animation';
        bust.textContent = '💥 BUST!';
        bust.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 4rem;
            color: #ff0000;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            pointer-events: none;
            z-index: 1001;
            animation: bustShake 1.5s ease-out forwards;
        `;
        
        document.body.appendChild(bust);
        setTimeout(() => bust.remove(), 1500);
    }

    addPerfectAnimation() {
        const perfect = document.createElement('div');
        perfect.className = 'perfect-animation';
        perfect.textContent = '🎯 PERFECT 21!';
        perfect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            color: #00ff00;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            pointer-events: none;
            z-index: 1001;
            animation: perfectGlow 1s ease-out forwards;
        `;
        
        document.body.appendChild(perfect);
        setTimeout(() => perfect.remove(), 1000);
    }

    initializeUI() {
        // Add money button
        document.getElementById('add-money').addEventListener('click', () => {
            this.balance += 500;
            this.updateBalance();
            this.showMessage('💰 Added $500 to your balance!');
        });

        // Shop button
        document.getElementById('shop-btn').addEventListener('click', () => {
            document.getElementById('shop-modal').classList.remove('hidden');
            document.getElementById('shop-modal').style.display = 'block';
        });

        // Game selection
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', () => {
                const game = card.dataset.game;
                this.showGame(game);
            });
        });

        // Back button
        document.getElementById('back-btn').addEventListener('click', () => {
            this.showGameSelection();
        });

        // Initialize all games
        this.initializeBlackjack();
        this.initializePlinko();
        this.initializeAviator();
        this.initializeRoulette();
        this.initializeMinesweeper();
    }

    showGame(gameName) {
        // Hide game selection
        document.querySelector('.game-selection').classList.add('hidden');
        
        // Show game container
        document.getElementById('game-container').classList.remove('hidden');
        
        // Hide all games
        document.querySelectorAll('.game-area').forEach(area => {
            area.classList.add('hidden');
        });
        
        // Show selected game
        document.getElementById(`${gameName}-game`).classList.remove('hidden');
        document.getElementById('game-title').textContent = gameName.charAt(0).toUpperCase() + gameName.slice(1);
        
        this.currentGame = gameName;
        this.showMessage(`🎮 Welcome to ${gameName.charAt(0).toUpperCase() + gameName.slice(1)}!`);
        
        // Update game-specific stats
        if (gameName === 'plinko') {
            this.updatePlinkoStats();
            // Recreate plinko board when game is shown to ensure proper sizing
            setTimeout(() => {
                this.createPlinkoBoard();
            }, 100);
        }
    }

    showGameSelection() {
        document.querySelector('.game-selection').classList.remove('hidden');
        document.getElementById('game-container').classList.add('hidden');
        this.currentGame = null;
        this.showMessage('Choose your next game!');
    }

    // ============ BLACKJACK GAME ============
    initializeBlackjack() {
        document.getElementById('deal-btn').addEventListener('click', () => this.dealBlackjack());
        document.getElementById('hit-btn').addEventListener('click', () => this.hitBlackjack());
        document.getElementById('stand-btn').addEventListener('click', () => this.standBlackjack());
        
        // Add quick bet button functionality
        document.querySelectorAll('.quick-bet-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const betAmount = parseInt(btn.dataset.bet);
                document.getElementById('blackjack-bet').value = betAmount;
                
                // Add visual feedback
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = 'scale(1)';
                }, 100);
            });
        });
        
        // Add keyboard shortcuts for faster gameplay
        document.addEventListener('keydown', (e) => {
            if (!this.games.blackjack.active && document.getElementById('blackjack-game').style.display !== 'none') {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (!document.getElementById('deal-btn').disabled) {
                        this.dealBlackjack();
                    }
                }
            } else if (this.games.blackjack.active) {
                if (e.key === 'h' || e.key === 'H') {
                    e.preventDefault();
                    if (!document.getElementById('hit-btn').disabled) {
                        this.hitBlackjack();
                    }
                } else if (e.key === 's' || e.key === 'S') {
                    e.preventDefault();
                    if (!document.getElementById('stand-btn').disabled) {
                        this.standBlackjack();
                    }
                }
            }
        });
    }

    createDeck() {
        const suits = ['♠️', '♥️', '♦️', '♣️'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        this.games.blackjack.deck = [];
        
        for (let suit of suits) {
            for (let rank of ranks) {
                this.games.blackjack.deck.push({ suit, rank });
            }
        }
        
        // Shuffle deck
        for (let i = this.games.blackjack.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.games.blackjack.deck[i], this.games.blackjack.deck[j]] = 
            [this.games.blackjack.deck[j], this.games.blackjack.deck[i]];
        }
    }

    getCardValue(card) {
        if (card.rank === 'A') return 11;
        if (['J', 'Q', 'K'].includes(card.rank)) return 10;
        return parseInt(card.rank);
    }

    calculateHandValue(hand) {
        let value = 0;
        let aces = 0;
        
        for (let card of hand) {
            value += this.getCardValue(card);
            if (card.rank === 'A') aces++;
        }
        
        while (value > 21 && aces > 0) {
            value -= 10;
            aces--;
        }
        
        return value;
    }

    createCardElement(card, hidden = false) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        
        if (hidden) {
            cardDiv.classList.add('hidden');
            cardDiv.textContent = '🂠';
        } else {
            const color = (card.suit === '♥️' || card.suit === '♦️') ? '#e74c3c' : '#2c3e50';
            cardDiv.style.color = color;
            cardDiv.innerHTML = `
                <div>${card.rank}</div>
                <div style="font-size: 24px; align-self: center;">${card.suit}</div>
                <div style="transform: rotate(180deg); align-self: flex-end;">${card.rank}</div>
            `;
            
            // Apply card sleeve cosmetic
            this.applyCardCosmetic(cardDiv);
        }
        
        return cardDiv;
    }

    applyCardCosmetic(cardElement) {
        if (this.activeCosmetics.cardSleeve) {
            const cardStyles = {
                // Common Cards
                'basic-cards': 'background: linear-gradient(135deg, #f5f5f5, #e8e8e8); border: 2px solid #cccccc; box-shadow: 0 0 5px rgba(200, 200, 200, 0.3);',
                'red-cards': 'background: linear-gradient(135deg, #ffebee, #ffcdd2); border: 2px solid #f44336; box-shadow: 0 0 10px rgba(244, 67, 54, 0.4);',
                'blue-cards': 'background: linear-gradient(135deg, #e3f2fd, #bbdefb); border: 2px solid #2196f3; box-shadow: 0 0 10px rgba(33, 150, 243, 0.4);',
                
                // Uncommon Cards
                'gold-cards': 'background: linear-gradient(135deg, #FFD700, #FFA500); border: 2px solid #FF8C00; box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);',
                'silver-cards': 'background: linear-gradient(135deg, #e8e8e8, #c0c0c0); border: 2px solid #a0a0a0; box-shadow: 0 0 15px rgba(192, 192, 192, 0.5);',
                'neon-cards': 'background: linear-gradient(135deg, #ff00ff, #00ffff); border: 2px solid #ff0080; box-shadow: 0 0 20px rgba(255, 0, 255, 0.7); color: #ffffff !important; animation: neonPulse 2s ease-in-out infinite;',
                
                // Rare Cards
                'diamond-cards': 'background: linear-gradient(135deg, #E8E8E8, #B8B8B8); border: 2px solid #A0A0A0; box-shadow: 0 0 15px rgba(200, 200, 200, 0.5);',
                'ice-cards': 'background: linear-gradient(135deg, #87CEEB, #4682B4, #B0E0E6); border: 2px solid #00BFFF; box-shadow: 0 0 20px rgba(135, 206, 235, 0.7); animation: iceShimmer 3s ease-in-out infinite;',
                'fire-cards': 'background: linear-gradient(135deg, #FF4500, #FF6347, #FF8C00); border: 2px solid #FF0000; box-shadow: 0 0 25px rgba(255, 69, 0, 0.8); animation: fireFlicker 1.5s ease-in-out infinite;',
                'sunset-cards': 'background: linear-gradient(135deg, #ff7e5f, #feb47b, #ff6b6b, #feca57); border: 2px solid #ff8c42; box-shadow: 0 0 20px rgba(255, 140, 66, 0.8); animation: sunsetShift 3s ease-in-out infinite;',
                
                // Epic Cards
                'royal-cards': 'background: linear-gradient(135deg, #4B0082, #8A2BE2); border: 2px solid #9400D3; box-shadow: 0 0 15px rgba(138, 43, 226, 0.5); color: #FFD700 !important;',
                'aurora-cards': 'background: linear-gradient(135deg, #00c9ff, #92fe9d, #ff9a9e, #a8edea, #fbc2eb, #a6c1ee); border: 2px solid #ffffff; box-shadow: 0 0 25px rgba(255, 255, 255, 0.8); animation: auroraShift 3s ease-in-out infinite; color: #ffffff !important;',
                'electric-cards': 'background: linear-gradient(135deg, #00FFFF, #0080FF, #4169E1); border: 2px solid #FFFF00; box-shadow: 0 0 20px rgba(0, 255, 255, 0.8); animation: electricPulse 1s ease-in-out infinite;',
                'cosmic-cards': 'background: linear-gradient(135deg, #0c0c0c, #1a1a2e, #16213e, #000428); border: 2px solid #4169E1; box-shadow: 0 0 30px rgba(65, 105, 225, 0.6); color: #ffffff !important; animation: cosmicGlow 4s ease-in-out infinite;',
                'shadow-cards': 'background: linear-gradient(135deg, #2F2F2F, #1C1C1C, #000000); border: 2px solid #696969; box-shadow: 0 0 15px rgba(0, 0, 0, 0.9); color: #C0C0C0 !important; animation: shadowWave 3s ease-in-out infinite;',
                
                // Legendary Cards
                'dragon-cards': 'background: linear-gradient(135deg, #8B0000, #FF4500, #FF6347); border: 2px solid #FFD700; box-shadow: 0 0 20px rgba(255, 69, 0, 0.8); color: #FFD700 !important; animation: dragonFlame 2s ease-in-out infinite;',
                'rainbow-cards': 'background: linear-gradient(135deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff80, #0080ff, #8000ff, #ff0080); border: 2px solid #ffffff; box-shadow: 0 0 20px rgba(255, 255, 255, 0.8); animation: rainbowShift 2s ease-in-out infinite;',
                'ocean-cards': 'background: linear-gradient(135deg, #667db6, #0082c8, #0052d4, #4fb3d9); border: 2px solid #00bfff; box-shadow: 0 0 20px rgba(0, 191, 255, 0.8); animation: oceanShift 4s ease-in-out infinite;',
                'galaxy-cards': 'background: linear-gradient(135deg, #2c1810, #8b4513, #1e0a3c, #4b0082, #0f0f23); border: 2px solid #9370db; box-shadow: 0 0 25px rgba(147, 112, 219, 0.8); animation: galaxyShift 5s ease-in-out infinite; color: #ffffff !important;',
                
                // Exotic Cards
                'prism-cards': 'background: linear-gradient(135deg, #ff9a9e, #fecfef, #fecfef, #a8edea, #d299c2, #fed6e3); border: 2px solid #ffffff; box-shadow: 0 0 20px rgba(255, 255, 255, 0.8); animation: prismShift 2.5s ease-in-out infinite;',
                'void-cards': 'background: linear-gradient(135deg, #000000, #1a1a1a, #2d2d30, #000000); border: 2px solid #8b008b; box-shadow: 0 0 30px rgba(139, 0, 139, 0.8); color: #ffffff !important; animation: voidPulse 2s ease-in-out infinite;',
                'celestial-cards': 'background: linear-gradient(135deg, #0f3460, #16537e, #1e6091, #29648a); border: 2px solid #ffd700; box-shadow: 0 0 35px rgba(255, 215, 0, 0.8); color: #ffd700 !important; animation: celestialGlow 3s ease-in-out infinite;'
            };
            
            if (cardStyles[this.activeCosmetics.cardSleeve]) {
                cardElement.style.cssText += cardStyles[this.activeCosmetics.cardSleeve];
            }
        }
        
        // Add card animation styles if not already added
        if (!document.head.querySelector('#card-animations')) {
            const style = document.createElement('style');
            style.id = 'card-animations';
            style.textContent = `
                @keyframes neonPulse {
                    0%, 100% { box-shadow: 0 0 20px rgba(255, 0, 255, 0.7); }
                    50% { box-shadow: 0 0 30px rgba(0, 255, 255, 0.9), 0 0 40px rgba(255, 0, 255, 0.7); }
                }
                @keyframes auroraShift {
                    0% { filter: hue-rotate(0deg) brightness(1); }
                    50% { filter: hue-rotate(180deg) brightness(1.1); }
                    100% { filter: hue-rotate(360deg) brightness(1); }
                }
                @keyframes dragonFlame {
                    0%, 100% { box-shadow: 0 0 20px rgba(255, 69, 0, 0.8); }
                    50% { box-shadow: 0 0 35px rgba(255, 215, 0, 1), 0 0 45px rgba(255, 69, 0, 0.8); }
                }
                @keyframes iceShimmer {
                    0%, 100% { box-shadow: 0 0 20px rgba(135, 206, 235, 0.7); transform: scale(1); }
                    50% { box-shadow: 0 0 30px rgba(173, 216, 230, 1); transform: scale(1.02); }
                }
                @keyframes fireFlicker {
                    0%, 100% { box-shadow: 0 0 25px rgba(255, 69, 0, 0.8); }
                    25% { box-shadow: 0 0 35px rgba(255, 0, 0, 1); }
                    75% { box-shadow: 0 0 30px rgba(255, 140, 0, 0.9); }
                }
                @keyframes cosmicGlow {
                    0%, 100% { box-shadow: 0 0 30px rgba(65, 105, 225, 0.6); }
                    50% { box-shadow: 0 0 50px rgba(138, 43, 226, 0.8), 0 0 70px rgba(65, 105, 225, 0.6); }
                }
                @keyframes electricPulse {
                    0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.8); }
                    50% { box-shadow: 0 0 40px rgba(255, 255, 0, 1), 0 0 60px rgba(0, 255, 255, 0.8); }
                }
                @keyframes shadowWave {
                    0%, 100% { box-shadow: 0 0 15px rgba(0, 0, 0, 0.9); opacity: 0.8; }
                    50% { box-shadow: 0 0 25px rgba(105, 105, 105, 0.7); opacity: 1; }
                }
                @keyframes rainbowShift {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
                @keyframes sunsetShift {
                    0% { filter: hue-rotate(0deg) saturate(1); }
                    50% { filter: hue-rotate(30deg) saturate(1.2); }
                    100% { filter: hue-rotate(0deg) saturate(1); }
                }
                @keyframes oceanShift {
                    0% { filter: hue-rotate(0deg) brightness(1); }
                    33% { filter: hue-rotate(15deg) brightness(1.1); }
                    66% { filter: hue-rotate(-15deg) brightness(0.9); }
                    100% { filter: hue-rotate(0deg) brightness(1); }
                }
                @keyframes galaxyShift {
                    0% { filter: hue-rotate(0deg) contrast(1); }
                    25% { filter: hue-rotate(90deg) contrast(1.1); }
                    50% { filter: hue-rotate(180deg) contrast(1.2); }
                    75% { filter: hue-rotate(270deg) contrast(1.1); }
                    100% { filter: hue-rotate(360deg) contrast(1); }
                }
                @keyframes prismShift {
                    0% { filter: hue-rotate(0deg) saturate(1); }
                    50% { filter: hue-rotate(180deg) saturate(1.3); }
                    100% { filter: hue-rotate(360deg) saturate(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    dealBlackjack() {
        const betAmount = parseInt(document.getElementById('blackjack-bet').value);
        
        if (betAmount > this.balance) {
            this.showMessage('❌ Insufficient balance!');
            return;
        }
        
        if (betAmount < 10) {
            this.showMessage('❌ Minimum bet is $10!');
            return;
        }

        this.games.blackjack.betAmount = betAmount;
        this.balance -= betAmount;
        this.updateBalance();
        
        this.createDeck();
        this.games.blackjack.playerHand = [];
        this.games.blackjack.dealerHand = [];
        this.games.blackjack.active = true;
        
        // Deal initial cards
        this.games.blackjack.playerHand.push(this.games.blackjack.deck.pop());
        this.games.blackjack.dealerHand.push(this.games.blackjack.deck.pop());
        this.games.blackjack.playerHand.push(this.games.blackjack.deck.pop());
        this.games.blackjack.dealerHand.push(this.games.blackjack.deck.pop());
        
        this.updateBlackjackDisplay();
        
        // Enable action buttons
        document.getElementById('hit-btn').disabled = false;
        document.getElementById('stand-btn').disabled = false;
        document.getElementById('deal-btn').disabled = true;
        
        const playerValue = this.calculateHandValue(this.games.blackjack.playerHand);
        if (playerValue === 21) {
            this.showMessage('🎉 Blackjack!');
            setTimeout(() => this.endBlackjack(), 1000);
        } else {
            this.showMessage(`🃏 Your hand: ${playerValue} - Hit or Stand?`);
        }
    }

    hitBlackjack() {
        if (!this.games.blackjack.active) return;
        
        this.games.blackjack.playerHand.push(this.games.blackjack.deck.pop());
        this.updateBlackjackDisplay();
        
        const playerValue = this.calculateHandValue(this.games.blackjack.playerHand);
        if (playerValue > 21) {
            this.addBustAnimation();
            this.showMessage(`💥 Bust! You went over with ${playerValue}`);
            setTimeout(() => this.endBlackjack(), 1000);
        } else if (playerValue === 21) {
            this.addPerfectAnimation();
            this.showMessage('🎯 Perfect 21!');
            setTimeout(() => this.standBlackjack(), 800);
        } else {
            this.showMessage(`🃏 Your hand: ${playerValue} - Hit or Stand?`);
        }
    }

    standBlackjack() {
        if (!this.games.blackjack.active) return;
        
        this.showMessage('🏁 You stand - Dealer plays...');
        
        // Dealer plays
        while (this.calculateHandValue(this.games.blackjack.dealerHand) < 17) {
            this.games.blackjack.dealerHand.push(this.games.blackjack.deck.pop());
        }
        
        setTimeout(() => this.endBlackjack(), 500);
    }

    endBlackjack() {
        this.games.blackjack.active = false;
        const playerValue = this.calculateHandValue(this.games.blackjack.playerHand);
        const dealerValue = this.calculateHandValue(this.games.blackjack.dealerHand);
        
        let message = '';
        let winAmount = 0;
        
        if (playerValue > 21) {
            message = `💥 Bust! You: ${playerValue}, Dealer: ${dealerValue}`;
        } else if (dealerValue > 21) {
            message = `🎉 Dealer busts! You: ${playerValue}, Dealer: ${dealerValue}`;
            winAmount = this.games.blackjack.betAmount * 2;
        } else if (playerValue > dealerValue) {
            message = `🎉 You win! You: ${playerValue}, Dealer: ${dealerValue}`;
            winAmount = this.games.blackjack.betAmount * 2;
        } else if (playerValue < dealerValue) {
            message = `😔 Dealer wins! You: ${playerValue}, Dealer: ${dealerValue}`;
        } else {
            message = `🤝 Push! You: ${playerValue}, Dealer: ${dealerValue}`;
            winAmount = this.games.blackjack.betAmount;
        }
        
        if (winAmount > 0) {
            this.balance += winAmount;
            this.updateBalance();
            message += ` | Won $${winAmount}`;
        }
        
        this.showMessage(message);
        this.updateBlackjackDisplay(true);
        
        // Disable action buttons
        document.getElementById('hit-btn').disabled = true;
        document.getElementById('stand-btn').disabled = true;
        document.getElementById('deal-btn').disabled = false;
        
        // Add win/lose effects
        if (winAmount > 0 && playerValue <= 21) {
            this.addWinAnimation();
        } else if (playerValue > 21) {
            // Bust animation already added in hitBlackjack
        }
        
        // Auto-deal option for faster gameplay (after 3 seconds)
        setTimeout(() => {
            if (!this.games.blackjack.active && document.getElementById('blackjack-game').style.display !== 'none') {
                this.showMessage(`${message} | Press ENTER or SPACE for next round`);
            }
        }, 2000);
    }

    addWinAnimation() {
        // Create win celebration effect
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.textContent = ['🎉', '💰', '🎊', '⭐'][Math.floor(Math.random() * 4)];
                confetti.style.cssText = `
                    position: fixed;
                    top: ${Math.random() * 100}vh;
                    left: ${Math.random() * 100}vw;
                    font-size: 24px;
                    pointer-events: none;
                    z-index: 1000;
                    animation: confettiDrop 2s ease-out forwards;
                `;
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 2000);
            }, i * 50);
        }
    }

    updateBlackjackDisplay(showDealerCards = false) {
        const playerHandEl = document.getElementById('player-hand');
        const dealerHandEl = document.getElementById('dealer-hand');
        
        // Update player hand
        playerHandEl.innerHTML = '';
        this.games.blackjack.playerHand.forEach(card => {
            playerHandEl.appendChild(this.createCardElement(card));
        });
        
        // Update dealer hand
        dealerHandEl.innerHTML = '';
        this.games.blackjack.dealerHand.forEach((card, index) => {
            const isHidden = index === 1 && this.games.blackjack.active && !showDealerCards;
            dealerHandEl.appendChild(this.createCardElement(card, isHidden));
        });
        
        // Update totals
        document.getElementById('player-total').textContent = this.calculateHandValue(this.games.blackjack.playerHand);
        
        if (this.games.blackjack.active && !showDealerCards) {
            document.getElementById('dealer-total').textContent = this.getCardValue(this.games.blackjack.dealerHand[0]);
        } else {
            document.getElementById('dealer-total').textContent = this.calculateHandValue(this.games.blackjack.dealerHand);
        }
    }

    // ============ PLINKO GAME ============
    initializePlinko() {
        document.getElementById('drop-btn').addEventListener('click', () => this.dropPlinkoBall());
        
        // Delay board creation to ensure elements are rendered
        setTimeout(() => {
            this.createPlinkoBoard();
        }, 100);
    }

    createPlinkoBoard() {
        const board = document.getElementById('plinko-board');
        
        // Clear existing pegs
        board.querySelectorAll('.peg').forEach(peg => peg.remove());
        
        // Wait for the board to be properly sized and visible
        setTimeout(() => {
            if (board.offsetWidth === 0) {
                setTimeout(() => this.createPlinkoBoard(), 100);
                return;
            }
            
            const boardWidth = board.offsetWidth;
            const boardHeight = board.offsetHeight - 60; // Account for multiplier slots
            
            // Create pegs in a pyramid pattern
            const pegRows = 8;
            const maxPegs = 10; // Maximum pegs in the bottom row
            
            for (let row = 0; row < pegRows; row++) {
                const pegsInRow = 3 + row; // Start with 3 pegs, increase each row
                const actualPegs = Math.min(pegsInRow, maxPegs);
                const totalWidth = boardWidth * 0.9; // Use 90% of board width (increased from 70%)
                const startX = (boardWidth - totalWidth) / 2; // Center horizontally
                const spacing = actualPegs > 1 ? totalWidth / (actualPegs - 1) : 0;
                
                for (let col = 0; col < actualPegs; col++) {
                    const peg = document.createElement('div');
                    peg.className = 'peg';
                    peg.style.cssText = `
                        position: absolute;
                        width: 12px; height: 12px;
                        background: #FFD700;
                        border-radius: 50%;
                        box-shadow: 0 0 15px #FFD700;
                        border: 2px solid #FFA500;
                    `;
                    
                    const x = startX + (col * spacing) - 6; // Center the peg
                    const y = 60 + (row * (boardHeight - 80) / pegRows); // Start lower, end higher
                    
                    peg.style.left = Math.max(6, Math.min(boardWidth - 18, x)) + 'px';
                    peg.style.top = y + 'px';
                    peg.dataset.row = row;
                    peg.dataset.col = col;
                    
                    board.appendChild(peg);
                }
            }
        }, 50);
    }

    dropPlinkoBall() {
        if (this.games.plinko.dropping) return;
        
        const betAmount = parseInt(document.getElementById('plinko-bet').value);
        
        if (betAmount > this.balance) {
            this.showMessage('❌ Insufficient balance!');
            return;
        }
        
        if (betAmount < 10) {
            this.showMessage('❌ Minimum bet is $10!');
            return;
        }

        this.games.plinko.dropping = true;
        this.balance -= betAmount;
        this.updateBalance();
        
        const board = document.getElementById('plinko-board');
        const ball = document.createElement('div');
        
        // Apply plinko ball cosmetic
        let ballStyle = `
            position: absolute;
            width: 20px; height: 20px;
            background: radial-gradient(circle at 30% 30%, #FF8E8E, #FF6B6B, #FF5252);
            border-radius: 50%;
            top: 10px; left: 50%;
            transform: translateX(-50%);
            z-index: 10;
            box-shadow: 0 0 15px #FF6B6B, inset -2px -2px 5px rgba(0,0,0,0.3);
            border: 2px solid #FF3030;
        `;
        
        if (this.activeCosmetics.plinko) {
            const ballStyles = {
                // Common Balls
                'red-ball': 'background: radial-gradient(circle at 30% 30%, #FF6B6B, #FF5252, #E53935); box-shadow: 0 0 15px #FF5252; border: 2px solid #E53935;',
                'blue-ball': 'background: radial-gradient(circle at 30% 30%, #42A5F5, #2196F3, #1976D2); box-shadow: 0 0 15px #2196F3; border: 2px solid #1976D2;',
                'green-ball': 'background: radial-gradient(circle at 30% 30%, #66BB6A, #4CAF50, #388E3C); box-shadow: 0 0 15px #4CAF50; border: 2px solid #388E3C;',
                
                // Uncommon Balls
                'gold-ball': 'background: radial-gradient(circle at 30% 30%, #FFD700, #FFA500, #FF8C00); box-shadow: 0 0 20px #FFD700; border: 2px solid #FF8C00;',
                'silver-ball': 'background: radial-gradient(circle at 30% 30%, #E8E8E8, #C0C0C0, #A0A0A0); box-shadow: 0 0 18px #C0C0C0; border: 2px solid #A0A0A0;',
                
                // Rare Balls
                'fire-ball': 'background: radial-gradient(circle at 30% 30%, #FF6B35, #F12711, #A23400); box-shadow: 0 0 25px #F12711; border: 2px solid #A23400; animation: fireBall 0.5s ease-in-out infinite alternate;',
                'ice-ball': 'background: radial-gradient(circle at 30% 30%, #B8E6FF, #87CEEB, #4682B4); box-shadow: 0 0 25px #87CEEB; border: 2px solid #4682B4; animation: iceChill 2s ease-in-out infinite;',
                'electric-ball': 'background: radial-gradient(circle at 30% 30%, #FFFF00, #00FFFF, #8A2BE2); box-shadow: 0 0 35px #FFFF00; border: 2px solid #8A2BE2; animation: electricPulse 0.3s ease-in-out infinite alternate;',
                
                // Epic Balls
                'diamond-ball': 'background: radial-gradient(circle at 30% 30%, #E8E8E8, #B8B8B8, #A0A0A0); box-shadow: 0 0 30px #E8E8E8; border: 2px solid #A0A0A0; animation: diamondShine 1s ease-in-out infinite;',
                'rainbow-ball': 'background: conic-gradient(from 0deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080); box-shadow: 0 0 30px #ffffff; border: 2px solid #ffffff; animation: rainbowSpin 3s linear infinite;',
                
                // Legendary Balls
                'plasma-ball': 'background: radial-gradient(circle at 30% 30%, #8A2BE2, #FF1493, #00CED1); box-shadow: 0 0 40px #8A2BE2; border: 2px solid #FF1493; animation: plasmaFlow 1.5s ease-in-out infinite;',
                'dragon-ball': 'background: radial-gradient(circle at 30% 30%, #FF4500, #FF6347, #8B0000); box-shadow: 0 0 35px #FF4500; border: 2px solid #8B0000; animation: dragonPulse 1s ease-in-out infinite alternate;',
                
                // Exotic Balls
                'void-ball': 'background: radial-gradient(circle at 30% 30%, #1a1a1a, #000000, #2d2d30); box-shadow: 0 0 45px #8b008b; border: 2px solid #8b008b; animation: voidDistort 2s ease-in-out infinite;',
                'cosmic-ball': 'background: radial-gradient(circle at 30% 30%, #0f0f23, #1e0a3c, #4b0082); box-shadow: 0 0 50px #9370db; border: 2px solid #9370db; animation: cosmicSwirl 3s linear infinite;'
            };
            
            if (ballStyles[this.activeCosmetics.plinko]) {
                ballStyle = ballStyle.replace(/background: radial-gradient[^;]+;/, '');
                ballStyle = ballStyle.replace(/box-shadow: [^;]+;/, '');
                ballStyle = ballStyle.replace(/border: [^;]+;/, '');
                ballStyle += ballStyles[this.activeCosmetics.plinko];
            }
        }
        
        ball.style.cssText = ballStyle;
        
        // Add animations for special balls
        if (!document.head.querySelector('#ball-animations')) {
            const style = document.createElement('style');
            style.id = 'ball-animations';
            style.textContent = `
                @keyframes fireBall {
                    0% { box-shadow: 0 0 25px #F12711; }
                    100% { box-shadow: 0 0 35px #FF6B35, 0 0 45px #F12711; }
                }
                @keyframes diamondShine {
                    0%, 100% { box-shadow: 0 0 30px #E8E8E8; }
                    50% { box-shadow: 0 0 50px #FFFFFF, 0 0 70px #E8E8E8; }
                }
                @keyframes iceChill {
                    0%, 100% { box-shadow: 0 0 25px #87CEEB; }
                    50% { box-shadow: 0 0 35px #B8E6FF, 0 0 45px #87CEEB; }
                }
                @keyframes rainbowSpin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes electricPulse {
                    0% { box-shadow: 0 0 35px #FFFF00; }
                    100% { box-shadow: 0 0 50px #00FFFF, 0 0 60px #FFFF00; }
                }
                @keyframes plasmaFlow {
                    0%, 100% { box-shadow: 0 0 40px #8A2BE2; }
                    33% { box-shadow: 0 0 50px #FF1493, 0 0 60px #8A2BE2; }
                    66% { box-shadow: 0 0 50px #00CED1, 0 0 60px #FF1493; }
                }
            `;
            document.head.appendChild(style);
        }
        
        board.appendChild(ball);
        this.showMessage('🏀 Ball dropping...');
        
        // Enhanced physics simulation
        this.animateBallDrop(ball, board, betAmount);
    }

    animateBallDrop(ball, board, betAmount) {
        const pegs = Array.from(board.querySelectorAll('.peg'));
        const slots = Array.from(board.querySelectorAll('.slot'));
        
        let x = board.offsetWidth / 2; // Start from center
        let y = 10;
        let vx = (Math.random() - 0.5) * 2; // Increase initial horizontal velocity for better spread
        let vy = 0;
        const gravity = 0.25;
        const bounce = 0.6;
        const friction = 0.99;
        
        const animate = () => {
            // Apply gravity
            vy += gravity;
            
            // Update position
            x += vx;
            y += vy;
            
            // Check collision with pegs
            pegs.forEach(peg => {
                const pegRect = peg.getBoundingClientRect();
                const boardRect = board.getBoundingClientRect();
                const pegX = pegRect.left - boardRect.left + pegRect.width / 2;
                const pegY = pegRect.top - boardRect.top + pegRect.height / 2;
                const distance = Math.sqrt((x - pegX) ** 2 + (y - pegY) ** 2);
                
                if (distance < 18) { // Ball radius + peg radius
                    // Calculate bounce direction
                    const angle = Math.atan2(y - pegY, x - pegX);
                    const speed = Math.sqrt(vx ** 2 + vy ** 2) * bounce;
                    
                    vx = Math.cos(angle) * speed + (Math.random() - 0.5) * 2; // Increased randomness from 1 to 2
                    vy = Math.sin(angle) * speed * 0.6;
                    
                    // Separate the ball from the peg
                    const overlap = 18 - distance;
                    x += Math.cos(angle) * overlap;
                    y += Math.sin(angle) * overlap;
                    
                    // Add visual feedback
                    peg.style.transform = 'scale(1.3)';
                    peg.style.boxShadow = '0 0 25px #FFD700';
                    setTimeout(() => {
                        peg.style.transform = 'scale(1)';
                        peg.style.boxShadow = '0 0 15px #FFD700';
                    }, 200);
                }
            });
            
            // Apply friction
            vx *= friction;
            
            // Boundary collision with reduced padding
            const padding = 5; // Reduced from 15 to allow edge access
            if (x < padding) {
                x = padding;
                vx = Math.abs(vx) * 0.8;
            } else if (x > board.offsetWidth - padding) {
                x = board.offsetWidth - padding;
                vx = -Math.abs(vx) * 0.8;
            }
            
            // Update ball position
            ball.style.left = (x - 10) + 'px';
            ball.style.top = y + 'px';
            
            // Check if ball reached bottom
            if (y >= board.offsetHeight - 80) {
                ball.remove();
                this.games.plinko.dropping = false;
                this.calculatePlinkoWin(betAmount, x);
            } else if (y < board.offsetHeight - 20) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    calculatePlinkoWin(betAmount, finalX) {
        const slots = document.querySelectorAll('.slot');
        const slotWidth = document.getElementById('plinko-board').offsetWidth / slots.length;
        const selectedIndex = Math.max(0, Math.min(slots.length - 1, Math.floor(finalX / slotWidth)));
        
        const multipliers = Array.from(slots).map(slot => parseFloat(slot.dataset.multiplier));
        const multiplier = multipliers[selectedIndex];
        const winAmount = betAmount * multiplier;
        
        this.balance += winAmount;
        this.updateBalance();
        
        this.games.plinko.stats.lastWin = winAmount;
        this.games.plinko.stats.totalWon += winAmount;
        this.saveGameStats();
        
        // Highlight winning slot with animation
        const winningSlot = slots[selectedIndex];
        winningSlot.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
        winningSlot.style.animation = 'slotWin 1s ease-in-out';
        
        // Add CSS for slot win animation
        if (!document.head.querySelector('#slot-win-style')) {
            const style = document.createElement('style');
            style.id = 'slot-win-style';
            style.textContent = `
                @keyframes slotWin {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.2); box-shadow: 0 0 30px #FFD700; }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            winningSlot.style.background = '';
            winningSlot.style.animation = '';
        }, 3000);
        
        let message = `🎯 Landed on ${multiplier}x! Won $${winAmount}!`;
        if (multiplier >= 50) message = `🔥 MEGA WIN! ${multiplier}x! Won $${winAmount}!`;
        if (multiplier >= 100) message = `💎 LEGENDARY WIN! ${multiplier}x! Won $${winAmount}!`;
        
        this.showMessage(message);
        this.updatePlinkoStats();
    }

    updatePlinkoStats() {
        document.getElementById('last-win').textContent = this.games.plinko.stats.lastWin;
        document.getElementById('total-won').textContent = this.games.plinko.stats.totalWon;
        this.saveGameStats();
    }

    // ============ AVIATOR GAME ============
    initializeAviator() {
        document.getElementById('bet-btn').addEventListener('click', () => this.startAviator());
        document.getElementById('cashout-btn').addEventListener('click', () => this.cashoutAviator());
        this.setupAviatorCanvas();
    }

    setupAviatorCanvas() {
        const canvas = document.getElementById('aviator-canvas');
        const ctx = canvas.getContext('2d');
        
        // Draw background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.5, '#4682B4');
        gradient.addColorStop(1, '#1e3c72');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw clouds
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '30px Arial';
        for (let i = 0; i < 5; i++) {
            ctx.fillText('☁️', Math.random() * (canvas.width - 50), Math.random() * (canvas.height - 100) + 50);
        }
        
        // Instructions
        ctx.fillStyle = '#333';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        
        // Show cosmetic plane in instructions
        let planeEmoji = '✈️';
        if (this.activeCosmetics.plane) {
            const planes = {
                'jet-plane': '🛩️',
                'rocket-plane': '🚀',
                'ufo-plane': '🛸',
                'dragon-plane': '🐉',
                'phoenix-plane': '🔥',
                'spaceship-plane': '👽'
            };
            planeEmoji = planes[this.activeCosmetics.plane] || '✈️';
        }
        
        ctx.fillText(`${planeEmoji} Place bet to start flight!`, canvas.width/2, canvas.height/2);
    }

    startAviator() {
        if (this.games.aviator.flying || this.games.aviator.betting) return;
        
        const betAmount = parseInt(document.getElementById('aviator-bet').value);
        
        if (betAmount > this.balance) {
            this.showMessage('❌ Insufficient balance!');
            return;
        }
        
        if (betAmount < 10) {
            this.showMessage('❌ Minimum bet is $10!');
            return;
        }

        this.games.aviator.betAmount = betAmount;
        this.games.aviator.betting = true;
        this.games.aviator.flying = true;
        this.games.aviator.multiplier = 1.0;
        
        this.balance -= betAmount;
        this.updateBalance();
        
        document.getElementById('bet-btn').disabled = true;
        document.getElementById('cashout-btn').disabled = false;
        
        this.animateAviator();
    }

    animateAviator() {
        const canvas = document.getElementById('aviator-canvas');
        const ctx = canvas.getContext('2d');
        let startTime = Date.now();
        
        this.games.aviator.interval = setInterval(() => {
            if (!this.games.aviator.flying) return;
            
            this.games.aviator.multiplier += 0.01;
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Background
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#87CEEB');
            gradient.addColorStop(0.5, '#4682B4');
            gradient.addColorStop(1, '#1e3c72');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Animated plane
            const elapsed = Date.now() - startTime;
            const x = 50 + (elapsed / 50) % (canvas.width - 100);
            const y = Math.max(50, 200 - (this.games.aviator.multiplier - 1) * 25);
            
            ctx.font = '40px Arial';
            
            // Apply plane cosmetic
            let planeEmoji = '✈️';
            if (this.activeCosmetics.plane) {
                const planes = {
                    'jet-plane': '🛩️',
                    'rocket-plane': '🚀',
                    'ufo-plane': '🛸',
                    'dragon-plane': '🐉',
                    'phoenix-plane': '🔥',
                    'spaceship-plane': '👽'
                };
                planeEmoji = planes[this.activeCosmetics.plane] || '✈️';
            }
            
            ctx.fillText(planeEmoji, x, y);
            
            // Multiplier display
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 48px Arial';
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 3;
            ctx.textAlign = 'center';
            ctx.strokeText(`${this.games.aviator.multiplier.toFixed(2)}x`, canvas.width/2, 100);
            ctx.fillText(`${this.games.aviator.multiplier.toFixed(2)}x`, canvas.width/2, 100);
            
            // Update UI
            document.getElementById('current-multiplier').textContent = `${this.games.aviator.multiplier.toFixed(2)}x`;
            document.getElementById('potential-win').textContent = Math.floor(this.games.aviator.betAmount * this.games.aviator.multiplier);
            
            // Random crash
            const crashChance = Math.min(0.02, 0.001 + (this.games.aviator.multiplier - 1) * 0.002);
            if (Math.random() < crashChance) {
                this.crashAviator();
            }
        }, 100);
    }

    cashoutAviator() {
        if (!this.games.aviator.betting || !this.games.aviator.flying) return;
        
        const winAmount = Math.floor(this.games.aviator.betAmount * this.games.aviator.multiplier);
        this.balance += winAmount;
        this.updateBalance();
        
        this.showMessage(`🎉 Cashed out at ${this.games.aviator.multiplier.toFixed(2)}x! Won $${winAmount}!`);
        this.resetAviator();
    }

    crashAviator() {
        this.games.aviator.flying = false;
        
        const canvas = document.getElementById('aviator-canvas');
        const ctx = canvas.getContext('2d');
        
        // Draw crash
        ctx.fillStyle = '#FF4444';
        ctx.font = 'bold 60px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('💥 CRASHED!', canvas.width/2, canvas.height/2);
        
        this.showMessage(`💥 Plane crashed at ${this.games.aviator.multiplier.toFixed(2)}x!`);
        
        setTimeout(() => this.resetAviator(), 3000);
    }

    resetAviator() {
        if (this.games.aviator.interval) {
            clearInterval(this.games.aviator.interval);
            this.games.aviator.interval = null;
        }
        
        this.games.aviator = { flying: false, betting: false, multiplier: 1.0, betAmount: 0, interval: null };
        
        document.getElementById('bet-btn').disabled = false;
        document.getElementById('cashout-btn').disabled = true;
        document.getElementById('current-multiplier').textContent = '1.00x';
        document.getElementById('potential-win').textContent = '0';
        
        this.setupAviatorCanvas();
    }

    // ============ ROULETTE GAME ============
    initializeRoulette() {
        document.getElementById('spin-btn').addEventListener('click', () => this.spinRoulette());
        document.getElementById('clear-bets').addEventListener('click', () => this.clearRouletteBets());
        
        document.querySelectorAll('.bet-option').forEach(btn => {
            btn.addEventListener('click', () => this.placeBet(btn));
        });
    }

    placeBet(button) {
        const betAmount = parseInt(document.getElementById('roulette-bet').value);
        
        if (betAmount > this.balance) {
            this.showMessage('❌ Insufficient balance!');
            return;
        }
        
        if (betAmount < 10) {
            this.showMessage('❌ Minimum bet is $10!');
            return;
        }

        const betType = button.dataset.bet;
        const payout = parseInt(button.dataset.payout);
        
        this.games.roulette.bets.push({ type: betType, amount: betAmount, payout });
        this.balance -= betAmount;
        this.updateBalance();
        
        this.updateRouletteBets();
        this.showMessage(`💰 Placed $${betAmount} on ${betType}`);
    }

    updateRouletteBets() {
        const betsList = document.getElementById('bets-list');
        
        if (this.games.roulette.bets.length === 0) {
            betsList.innerHTML = '<p style="color: #888;">No bets placed</p>';
            document.getElementById('spin-btn').disabled = true;
        } else {
            betsList.innerHTML = this.games.roulette.bets.map(bet => 
                `<div class="bet-item">$${bet.amount} on ${bet.type} (${bet.payout}:1)</div>`
            ).join('');
            document.getElementById('spin-btn').disabled = false;
        }
    }

    spinRoulette() {
        if (this.games.roulette.spinning) return;
        
        this.games.roulette.spinning = true;
        const wheel = document.getElementById('roulette-wheel');
        
        // Random winning number (0-36)
        const winningNumber = Math.floor(Math.random() * 37);
        
        // Spin animation
        const rotations = 5 + Math.random() * 5;
        const finalAngle = (winningNumber * 10) + 360 * rotations;
        wheel.style.transform = `rotate(${finalAngle}deg)`;
        
        this.showMessage('🎡 Spinning the wheel...');
        
        setTimeout(() => {
            this.processRouletteBets(winningNumber);
            this.games.roulette.spinning = false;
        }, 4000);
    }

    processRouletteBets(winningNumber) {
        let totalWon = 0;
        const isRed = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(winningNumber);
        const isBlack = winningNumber !== 0 && !isRed;
        const isEven = winningNumber !== 0 && winningNumber % 2 === 0;
        const isOdd = winningNumber !== 0 && winningNumber % 2 === 1;
        
        this.games.roulette.bets.forEach(bet => {
            let won = false;
            
            switch(bet.type) {
                case 'red': won = isRed; break;
                case 'black': won = isBlack; break;
                case 'even': won = isEven; break;
                case 'odd': won = isOdd; break;
                case 'low': won = winningNumber >= 1 && winningNumber <= 18; break;
                case 'high': won = winningNumber >= 19 && winningNumber <= 36; break;
            }
            
            if (won) {
                totalWon += bet.amount * bet.payout;
            }
        });
        
        const color = winningNumber === 0 ? 'green' : (isRed ? 'red' : 'black');
        let message = `🎡 Number ${winningNumber} (${color})!`;
        
        if (totalWon > 0) {
            this.balance += totalWon;
            this.updateBalance();
            message += ` Won $${totalWon}!`;
        } else {
            message += ' No winning bets.';
        }
        
        this.showMessage(message);
        this.clearRouletteBets();
    }

    clearRouletteBets() {
        this.games.roulette.bets = [];
        this.updateRouletteBets();
    }

    // ============ MINESWEEPER GAME ============
    initializeMinesweeper() {
        document.getElementById('start-mines').addEventListener('click', () => this.startMinesweeper());
        document.getElementById('cashout-mines').addEventListener('click', () => this.cashoutMinesweeper());
        this.createMinesBoard();
    }

    createMinesBoard() {
        const board = document.getElementById('mines-board');
        board.innerHTML = '';
        
        for (let i = 0; i < 25; i++) {
            const tile = document.createElement('div');
            tile.className = 'mine-tile';
            tile.dataset.index = i;
            tile.addEventListener('click', () => this.revealTile(i));
            board.appendChild(tile);
        }
    }

    startMinesweeper() {
        const betAmount = parseInt(document.getElementById('mines-bet').value);
        const mineCount = parseInt(document.getElementById('mine-count').value);
        
        if (betAmount > this.balance) {
            this.showMessage('❌ Insufficient balance!');
            return;
        }
        
        if (betAmount < 10) {
            this.showMessage('❌ Minimum bet is $10!');
            return;
        }

        this.games.minesweeper.betAmount = betAmount;
        this.games.minesweeper.active = true;
        this.games.minesweeper.gemsFound = 0;
        this.games.minesweeper.revealed = new Array(25).fill(false);
        
        this.balance -= betAmount;
        this.updateBalance();
        
        // Generate mines
        this.games.minesweeper.mines = [];
        while (this.games.minesweeper.mines.length < mineCount) {
            const pos = Math.floor(Math.random() * 25);
            if (!this.games.minesweeper.mines.includes(pos)) {
                this.games.minesweeper.mines.push(pos);
            }
        }
        
        // Reset board
        document.querySelectorAll('.mine-tile').forEach(tile => {
            tile.textContent = '';
            tile.className = 'mine-tile';
        });
        
        document.getElementById('cashout-mines').disabled = false;
        this.updateMinesStats();
        this.showMessage(`💣 Game started! ${mineCount} mines hidden.`);
    }

    revealTile(index) {
        if (!this.games.minesweeper.active || this.games.minesweeper.revealed[index]) return;
        
        const tile = document.querySelector(`[data-index="${index}"]`);
        this.games.minesweeper.revealed[index] = true;
        
        if (this.games.minesweeper.mines.includes(index)) {
            // Hit mine
            tile.textContent = '💣';
            tile.classList.add('mine');
            this.endMinesweeper(false);
        } else {
            // Found gem
            tile.textContent = '💎';
            tile.classList.add('gem');
            this.games.minesweeper.gemsFound++;
            this.updateMinesStats();
            this.showMessage(`💎 Gem found! ${this.games.minesweeper.gemsFound} gems total.`);
        }
    }

    cashoutMinesweeper() {
        if (!this.games.minesweeper.active || this.games.minesweeper.gemsFound === 0) {
            this.showMessage('❌ Find at least one gem first!');
            return;
        }
        
        this.endMinesweeper(true);
    }

    endMinesweeper(won) {
        this.games.minesweeper.active = false;
        document.getElementById('cashout-mines').disabled = true;
        
        if (won) {
            const multiplier = 1 + (this.games.minesweeper.gemsFound * 0.5);
            const winAmount = Math.floor(this.games.minesweeper.betAmount * multiplier);
            
            this.balance += winAmount;
            this.updateBalance();
            this.showMessage(`🎉 Cashed out! Won $${winAmount} with ${this.games.minesweeper.gemsFound} gems!`);
        } else {
            // Show all mines
            this.games.minesweeper.mines.forEach(index => {
                if (!this.games.minesweeper.revealed[index]) {
                    const tile = document.querySelector(`[data-index="${index}"]`);
                    tile.textContent = '💣';
                    tile.classList.add('mine');
                }
            });
            this.showMessage(`💥 Hit mine! Game over with ${this.games.minesweeper.gemsFound} gems.`);
        }
    }

    updateMinesStats() {
        const multiplier = 1 + (this.games.minesweeper.gemsFound * 0.5);
        const potential = Math.floor(this.games.minesweeper.betAmount * multiplier);
        
        document.getElementById('gems-found').textContent = this.games.minesweeper.gemsFound;
        document.getElementById('mines-multiplier').textContent = `${multiplier.toFixed(2)}x`;
        document.getElementById('mines-potential').textContent = potential;
    }

    // ============ SHOP SYSTEM ============
    initializeShop() {
        // Close modal
        document.querySelector('.close').addEventListener('click', () => {
            document.getElementById('shop-modal').style.display = 'none';
        });

        // Close on outside click
        document.getElementById('shop-modal').addEventListener('click', (e) => {
            if (e.target.id === 'shop-modal') {
                document.getElementById('shop-modal').style.display = 'none';
            }
        });

        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.showShopCategory(btn.dataset.category);
            });
        });

        // Show default category
        this.showShopCategory('cards');
    }

    showShopCategory(category) {
        const items = this.getShopItems(category);
        const container = document.getElementById('shop-items');
        
        container.innerHTML = items.map(item => {
            const isOwned = this.ownedItems.includes(item.id);
            const isActive = this.isItemActive(item.id, category);
            
            return `
                <div class="shop-item rarity-${item.rarity}">
                    <div class="rarity-badge">${item.rarity.toUpperCase()}</div>
                    <div class="item-icon">${item.icon}</div>
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">$${item.price}</div>
                    <div class="item-buttons">
                        ${!isOwned ? `
                            <button class="buy-btn" data-item="${item.id}" data-price="${item.price}" data-category="${category}">
                                Buy
                            </button>
                        ` : `
                            <button class="equip-btn ${isActive ? 'active' : ''}" data-item="${item.id}" data-category="${category}">
                                ${isActive ? 'Equipped' : 'Equip'}
                            </button>
                        `}
                    </div>
                </div>
            `;
        }).join('');

        // Add buy event listeners
        container.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', () => this.buyItem(btn));
        });
        
        // Add equip event listeners
        container.querySelectorAll('.equip-btn').forEach(btn => {
            btn.addEventListener('click', () => this.equipItem(btn));
        });
    }

    isItemActive(itemId, category) {
        const categoryMap = {
            'cards': 'cardSleeve',
            'backgrounds': 'background',
            'effects': 'effect',
            'plinko': 'plinko',
            'planes': 'plane',
            'trails': 'trail',
            'cursors': 'cursor',
            'particles': 'particle',
            'themes': 'theme'
        };
        
        return this.activeCosmetics[categoryMap[category]] === itemId;
    }

    equipItem(button) {
        const itemId = button.dataset.item;
        const category = button.dataset.category;
        
        const categoryMap = {
            'cards': 'cardSleeve',
            'backgrounds': 'background',
            'effects': 'effect',
            'plinko': 'plinko',
            'planes': 'plane',
            'trails': 'trail',
            'cursors': 'cursor',
            'particles': 'particle',
            'themes': 'theme'
        };
        
        const cosmeticType = categoryMap[category];
        
        // Unequip if already equipped
        if (this.activeCosmetics[cosmeticType] === itemId) {
            this.activeCosmetics[cosmeticType] = null;
            this.showMessage(`🎨 Unequipped ${itemId.replace('-', ' ')}!`);
            
            // Remove cosmetic immediately
            if (cosmeticType === 'cursor') {
                document.body.style.cursor = 'default';
            } else if (cosmeticType === 'particle') {
                this.removeParticleEffects();
            } else if (cosmeticType === 'theme') {
                this.removeTheme();
            }
        } else {
            this.activeCosmetics[cosmeticType] = itemId;
            this.showMessage(`🎨 Equipped ${itemId.replace('-', ' ')}!`);
            
            // Apply cosmetic immediately
            if (cosmeticType === 'background') {
                this.applyBackground(itemId);
            } else if (cosmeticType === 'effect') {
                this.applyEffect(itemId);
            } else if (cosmeticType === 'cursor') {
                this.applyCursor(itemId);
            } else if (cosmeticType === 'particle') {
                this.createParticleEffect(itemId);
            } else if (cosmeticType === 'theme') {
                this.applyTheme(itemId);
            }
        }
        
        this.saveActiveCosmetics();
        this.showShopCategory(category); // Refresh the category display
    }

    getShopItems(category) {
        const items = {
            cards: [
                // Common (Gray)
                { id: 'basic-cards', name: 'Basic Cards', icon: '🃏', price: 50, rarity: 'common' },
                { id: 'red-cards', name: 'Red Cards', icon: '🔴', price: 75, rarity: 'common' },
                { id: 'blue-cards', name: 'Blue Cards', icon: '�', price: 75, rarity: 'common' },
                
                // Uncommon (Green)
                { id: 'gold-cards', name: 'Gold Cards', icon: '�', price: 150, rarity: 'uncommon' },
                { id: 'silver-cards', name: 'Silver Cards', icon: '⚪', price: 125, rarity: 'uncommon' },
                { id: 'neon-cards', name: 'Neon Cards', icon: '💫', price: 175, rarity: 'uncommon' },
                
                // Rare (Blue)
                { id: 'diamond-cards', name: 'Diamond Cards', icon: '�', price: 350, rarity: 'rare' },
                { id: 'ice-cards', name: 'Ice Crystal Cards', icon: '🧊', price: 300, rarity: 'rare' },
                { id: 'fire-cards', name: 'Flaming Cards', icon: '🔥', price: 400, rarity: 'rare' },
                { id: 'sunset-cards', name: 'Sunset Cards', icon: '🌅', price: 325, rarity: 'rare' },
                
                // Epic (Purple)
                { id: 'royal-cards', name: 'Royal Cards', icon: '👑', price: 650, rarity: 'epic' },
                { id: 'aurora-cards', name: 'Aurora Cards', icon: '�', price: 750, rarity: 'epic' },
                { id: 'electric-cards', name: 'Electric Cards', icon: '⚡', price: 700, rarity: 'epic' },
                { id: 'cosmic-cards', name: 'Cosmic Cards', icon: '🌌', price: 800, rarity: 'epic' },
                { id: 'shadow-cards', name: 'Shadow Cards', icon: '🌑', price: 725, rarity: 'epic' },
                
                // Legendary (Orange)
                { id: 'dragon-cards', name: 'Dragon Cards', icon: '🐉', price: 1200, rarity: 'legendary' },
                { id: 'rainbow-cards', name: 'Rainbow Cards', icon: '�', price: 1100, rarity: 'legendary' },
                { id: 'ocean-cards', name: 'Ocean Wave Cards', icon: '🌊', price: 1000, rarity: 'legendary' },
                { id: 'galaxy-cards', name: 'Galaxy Cards', icon: '⭐', price: 1300, rarity: 'legendary' },
                
                // Exotic (Pink/Magenta)
                { id: 'prism-cards', name: 'Prism Cards', icon: '🔮', price: 2000, rarity: 'exotic' },
                { id: 'void-cards', name: 'Void Cards', icon: '⚫', price: 2500, rarity: 'exotic' },
                { id: 'celestial-cards', name: 'Celestial Cards', icon: '🌟', price: 2200, rarity: 'exotic' }
            ],
            backgrounds: [
                // Common
                { id: 'green-felt', name: 'Green Felt', icon: '🟢', price: 50, rarity: 'common' },
                { id: 'wood-bg', name: 'Wood Pattern', icon: '🟫', price: 75, rarity: 'common' },
                { id: 'marble-bg', name: 'Marble Pattern', icon: '⚪', price: 100, rarity: 'common' },
                
                // Uncommon
                { id: 'space-bg', name: 'Space Theme', icon: '🌌', price: 200, rarity: 'uncommon' },
                { id: 'ocean-bg', name: 'Ocean Theme', icon: '🌊', price: 175, rarity: 'uncommon' },
                { id: 'sunset-bg', name: 'Sunset Valley', icon: '🌅', price: 225, rarity: 'uncommon' },
                
                // Rare
                { id: 'fire-bg', name: 'Fire Theme', icon: '🔥', price: 400, rarity: 'rare' },
                { id: 'aurora-bg', name: 'Aurora Borealis', icon: '�', price: 450, rarity: 'rare' },
                { id: 'underwater-bg', name: 'Deep Sea', icon: '🐠', price: 425, rarity: 'rare' },
                { id: 'crystal-bg', name: 'Crystal Cave', icon: '�', price: 475, rarity: 'rare' },
                
                // Epic
                { id: 'neon-bg', name: 'Neon City', icon: '�️', price: 750, rarity: 'epic' },
                { id: 'galaxy-bg', name: 'Galaxy', icon: '�', price: 800, rarity: 'epic' },
                { id: 'volcanic-bg', name: 'Volcanic Lava', icon: '🌋', price: 825, rarity: 'epic' },
                
                // Legendary
                { id: 'matrix-bg', name: 'Matrix', icon: '💚', price: 1200, rarity: 'legendary' },
                { id: 'cyberpunk-bg', name: 'Cyberpunk City', icon: '🤖', price: 1300, rarity: 'legendary' },
                
                // Exotic
                { id: 'dimension-bg', name: 'Dimensional Rift', icon: '🌀', price: 2000, rarity: 'exotic' },
                { id: 'quantum-bg', name: 'Quantum Field', icon: '⚛️', price: 2200, rarity: 'exotic' }
            ],
            effects: [
                // Common
                { id: 'sparkle-fx', name: 'Sparkle Effect', icon: '✨', price: 75, rarity: 'common' },
                { id: 'glow-fx', name: 'Soft Glow', icon: '🔆', price: 50, rarity: 'common' },
                { id: 'pulse-fx', name: 'Pulse Effect', icon: '💫', price: 100, rarity: 'common' },
                
                // Uncommon
                { id: 'rainbow-fx', name: 'Rainbow Effect', icon: '🌈', price: 175, rarity: 'uncommon' },
                { id: 'snow-fx', name: 'Snow Effect', icon: '❄️', price: 150, rarity: 'uncommon' },
                { id: 'bubble-fx', name: 'Bubble Float', icon: '💭', price: 200, rarity: 'uncommon' },
                
                // Rare
                { id: 'lightning-fx', name: 'Lightning Effect', icon: '⚡', price: 350, rarity: 'rare' },
                { id: 'confetti-fx', name: 'Confetti Blast', icon: '🎊', price: 400, rarity: 'rare' },
                { id: 'stars-fx', name: 'Shooting Stars', icon: '🌟', price: 375, rarity: 'rare' },
                { id: 'hearts-fx', name: 'Floating Hearts', icon: '💖', price: 325, rarity: 'rare' },
                
                // Epic
                { id: 'fireworks-fx', name: 'Fireworks', icon: '🎆', price: 700, rarity: 'epic' },
                { id: 'magic-fx', name: 'Magic Aura', icon: '🔮', price: 650, rarity: 'epic' },
                { id: 'thunder-fx', name: 'Thunder Storm', icon: '🌩️', price: 750, rarity: 'epic' },
                
                // Legendary
                { id: 'coins-fx', name: 'Coin Rain', icon: '🪙', price: 1000, rarity: 'legendary' },
                { id: 'phoenix-fx', name: 'Phoenix Flames', icon: '🔥', price: 1200, rarity: 'legendary' },
                
                // Exotic
                { id: 'portal-fx', name: 'Portal Vortex', icon: '🌀', price: 2000, rarity: 'exotic' },
                { id: 'cosmic-fx', name: 'Cosmic Storm', icon: '🌌', price: 2500, rarity: 'exotic' }
            ],
            plinko: [
                // Common
                { id: 'red-ball', name: 'Red Ball', icon: '�', price: 50, rarity: 'common' },
                { id: 'blue-ball', name: 'Blue Ball', icon: '🔵', price: 50, rarity: 'common' },
                { id: 'green-ball', name: 'Green Ball', icon: '🟢', price: 50, rarity: 'common' },
                
                // Uncommon
                { id: 'gold-ball', name: 'Golden Ball', icon: '🟡', price: 150, rarity: 'uncommon' },
                { id: 'silver-ball', name: 'Silver Ball', icon: '⚪', price: 125, rarity: 'uncommon' },
                
                // Rare
                { id: 'fire-ball', name: 'Fire Ball', icon: '�', price: 300, rarity: 'rare' },
                { id: 'ice-ball', name: 'Ice Ball', icon: '🧊', price: 275, rarity: 'rare' },
                { id: 'electric-ball', name: 'Electric Ball', icon: '⚡', price: 350, rarity: 'rare' },
                
                // Epic
                { id: 'diamond-ball', name: 'Diamond Ball', icon: '💎', price: 600, rarity: 'epic' },
                { id: 'rainbow-ball', name: 'Rainbow Ball', icon: '🌈', price: 700, rarity: 'epic' },
                
                // Legendary
                { id: 'plasma-ball', name: 'Plasma Ball', icon: '🟣', price: 1000, rarity: 'legendary' },
                { id: 'dragon-ball', name: 'Dragon Ball', icon: '🐉', price: 1200, rarity: 'legendary' },
                
                // Exotic
                { id: 'void-ball', name: 'Void Ball', icon: '⚫', price: 2000, rarity: 'exotic' },
                { id: 'cosmic-ball', name: 'Cosmic Ball', icon: '🌌', price: 2200, rarity: 'exotic' }
            ],
            planes: [
                // Common
                { id: 'paper-plane', name: 'Paper Plane', icon: '✈️', price: 100, rarity: 'common' },
                { id: 'glider-plane', name: 'Glider', icon: '🪂', price: 125, rarity: 'common' },
                
                // Uncommon
                { id: 'jet-plane', name: 'Fighter Jet', icon: '🛩️', price: 250, rarity: 'uncommon' },
                { id: 'helicopter', name: 'Helicopter', icon: '🚁', price: 300, rarity: 'uncommon' },
                
                // Rare
                { id: 'rocket-plane', name: 'Rocket Ship', icon: '🚀', price: 500, rarity: 'rare' },
                { id: 'stealth-jet', name: 'Stealth Fighter', icon: '🛫', price: 600, rarity: 'rare' },
                
                // Epic
                { id: 'ufo-plane', name: 'UFO', icon: '🛸', price: 900, rarity: 'epic' },
                { id: 'phoenix-plane', name: 'Phoenix', icon: '�', price: 1000, rarity: 'epic' },
                
                // Legendary
                { id: 'dragon-plane', name: 'Dragon', icon: '�', price: 1500, rarity: 'legendary' },
                { id: 'spaceship-plane', name: 'Alien Ship', icon: '👽', price: 1300, rarity: 'legendary' },
                
                // Exotic
                { id: 'void-ship', name: 'Void Ship', icon: '⚫', price: 2500, rarity: 'exotic' },
                { id: 'time-machine', name: 'Time Machine', icon: '⏰', price: 3000, rarity: 'exotic' }
            ],
            trails: [
                // Common
                { id: 'white-trail', name: 'White Trail', icon: '⚪', price: 100, rarity: 'common' },
                { id: 'smoke-trail', name: 'Smoke Trail', icon: '💨', price: 75, rarity: 'common' },
                
                // Uncommon
                { id: 'gold-trail', name: 'Golden Trail', icon: '✨', price: 200, rarity: 'uncommon' },
                { id: 'fire-trail', name: 'Fire Trail', icon: '🔥', price: 250, rarity: 'uncommon' },
                
                // Rare
                { id: 'rainbow-trail', name: 'Rainbow Trail', icon: '🌈', price: 400, rarity: 'rare' },
                { id: 'electric-trail', name: 'Electric Trail', icon: '⚡', price: 450, rarity: 'rare' },
                
                // Epic
                { id: 'stardust-trail', name: 'Stardust Trail', icon: '⭐', price: 750, rarity: 'epic' },
                { id: 'plasma-trail', name: 'Plasma Trail', icon: '🟣', price: 800, rarity: 'epic' },
                
                // Legendary
                { id: 'galaxy-trail', name: 'Galaxy Trail', icon: '🌌', price: 1200, rarity: 'legendary' },
                { id: 'phoenix-trail', name: 'Phoenix Trail', icon: '🔥', price: 1400, rarity: 'legendary' },
                
                // Exotic
                { id: 'void-trail', name: 'Void Trail', icon: '⚫', price: 2000, rarity: 'exotic' },
                { id: 'dimension-trail', name: 'Dimension Trail', icon: '🌀', price: 2500, rarity: 'exotic' }
            ],
            cursors: [
                // Common
                { id: 'basic-cursor', name: 'Basic Pointer', icon: '👆', price: 75, rarity: 'common' },
                { id: 'hand-cursor', name: 'Hand Cursor', icon: '👋', price: 50, rarity: 'common' },
                
                // Uncommon
                { id: 'golden-cursor', name: 'Golden Pointer', icon: '�', price: 150, rarity: 'uncommon' },
                { id: 'fire-cursor', name: 'Fire Cursor', icon: '🔥', price: 200, rarity: 'uncommon' },
                
                // Rare
                { id: 'diamond-cursor', name: 'Diamond Cursor', icon: '💎', price: 350, rarity: 'rare' },
                { id: 'magic-cursor', name: 'Magic Wand', icon: '🪄', price: 400, rarity: 'rare' },
                
                // Epic
                { id: 'lightning-cursor', name: 'Lightning Bolt', icon: '⚡', price: 700, rarity: 'epic' },
                { id: 'star-cursor', name: 'Star Cursor', icon: '⭐', price: 750, rarity: 'epic' },
                
                // Legendary
                { id: 'dragon-cursor', name: 'Dragon Claw', icon: '🐉', price: 1200, rarity: 'legendary' },
                { id: 'cosmic-cursor', name: 'Cosmic Cursor', icon: '🌌', price: 1300, rarity: 'legendary' },
                
                // Exotic
                { id: 'void-cursor', name: 'Void Pointer', icon: '⚫', price: 2000, rarity: 'exotic' },
                { id: 'quantum-cursor', name: 'Quantum Hand', icon: '⚛️', price: 2500, rarity: 'exotic' }
            ],
            particles: [
                // Common
                { id: 'dust-particles', name: 'Dust Motes', icon: '💨', price: 100, rarity: 'common' },
                { id: 'simple-sparkles', name: 'Simple Sparkles', icon: '✨', price: 125, rarity: 'common' },
                
                // Uncommon
                { id: 'floating-coins', name: 'Floating Coins', icon: '🪙', price: 250, rarity: 'uncommon' },
                { id: 'magic-sparkles', name: 'Magic Sparkles', icon: '⭐', price: 300, rarity: 'uncommon' },
                
                // Rare
                { id: 'floating-cards', name: 'Floating Cards', icon: '🃏', price: 450, rarity: 'rare' },
                { id: 'dice-particles', name: 'Rolling Dice', icon: '🎲', price: 500, rarity: 'rare' },
                
                // Epic
                { id: 'gem-shower', name: 'Gem Shower', icon: '💎', price: 800, rarity: 'epic' },
                { id: 'phoenix-feathers', name: 'Phoenix Feathers', icon: '🪶', price: 900, rarity: 'epic' },
                
                // Legendary
                { id: 'dragon-scales', name: 'Dragon Scales', icon: '🐉', price: 1300, rarity: 'legendary' },
                { id: 'star-fragments', name: 'Star Fragments', icon: '🌟', price: 1400, rarity: 'legendary' },
                
                // Exotic
                { id: 'void-fragments', name: 'Void Fragments', icon: '⚫', price: 2200, rarity: 'exotic' },
                { id: 'quantum-particles', name: 'Quantum Particles', icon: '⚛️', price: 2800, rarity: 'exotic' }
            ],
            themes: [
                // Common
                { id: 'classic-theme', name: 'Classic Casino', icon: '🎰', price: 200, rarity: 'common' },
                { id: 'vintage-theme', name: 'Vintage Style', icon: '🎩', price: 250, rarity: 'common' },
                
                // Uncommon
                { id: 'modern-theme', name: 'Modern Clean', icon: '🏢', price: 400, rarity: 'uncommon' },
                { id: 'underwater', name: 'Underwater', icon: '🐠', price: 500, rarity: 'uncommon' },
                
                // Rare
                { id: 'royal-theme', name: 'Royal Palace', icon: '👑', price: 750, rarity: 'rare' },
                { id: 'space-station', name: 'Space Station', icon: '🚀', price: 850, rarity: 'rare' },
                
                // Epic
                { id: 'cyberpunk-theme', name: 'Cyberpunk 2077', icon: '🤖', price: 1200, rarity: 'epic' },
                { id: 'neon-vegas', name: 'Neon Vegas', icon: '🌃', price: 1300, rarity: 'epic' },
                
                // Legendary
                { id: 'dragon-lair', name: 'Dragon\'s Lair', icon: '🐉', price: 2000, rarity: 'legendary' },
                { id: 'phoenix-temple', name: 'Phoenix Temple', icon: '🔥', price: 2200, rarity: 'legendary' },
                
                // Exotic
                { id: 'void-dimension', name: 'Void Dimension', icon: '⚫', price: 3500, rarity: 'exotic' },
                { id: 'quantum-realm', name: 'Quantum Realm', icon: '⚛️', price: 4000, rarity: 'exotic' }
            ]
        };

        return items[category] || [];
    }

    buyItem(button) {
        const itemId = button.dataset.item;
        const price = parseInt(button.dataset.price);
        const category = button.dataset.category;
        
        if (this.ownedItems.includes(itemId)) {
            this.showMessage('🛍️ You already own this item!');
            return;
        }
        
        if (this.balance < price) {
            this.showMessage('❌ Insufficient balance!');
            return;
        }
        
        this.balance -= price;
        this.updateBalance();
        this.ownedItems.push(itemId);
        this.saveOwnedItems();
        
        this.showMessage(`🎉 Purchased ${itemId.replace('-', ' ')} for $${price}!`);
        
        // Refresh the shop category to show the equip button
        this.showShopCategory(category);
    }
}

// Initialize casino when page loads
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.fakeCasino = new FakeCasino();
        console.log('🎰 Fake Casino initialized successfully!');
    } catch (error) {
        console.error('❌ Casino initialization failed:', error);
    }
});
