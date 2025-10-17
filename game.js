class ClickGame {
    constructor() {
        this.totalClicks = 0;
        this.localClicks = 0;
        this.milestones = [
            { clicks: 10, message: "First steps!", progress: 10 },
            { clicks: 50, message: "Getting momentum!", progress: 25 },
            { clicks: 100, message: "Halfway there!", progress: 50 },
            { clicks: 250, message: "Great progress!", progress: 75 },
            { clicks: 500, message: "Amazing work!", progress: 90 },
            { clicks: 1000, message: "Server is almost ready!", progress: 100 }
        ];
        this.currentMilestone = 0;
        this.apiBaseUrl = 'http://localhost:5000/api'; // Flask backend URL
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadClicks().then(() => {
            this.updateDisplay();
        });
    }

    initializeElements() {
        this.clickButton = document.getElementById('clickButton');
        this.totalClicksElement = document.getElementById('totalClicks');
        this.progressFill = document.getElementById('progressFill');
        this.milestoneElement = document.getElementById('milestone');
        this.motivationText = document.getElementById('motivationText');
        this.clickFeedback = document.getElementById('clickFeedback');
        this.serverIcon = document.getElementById('serverIcon');
    }

    setupEventListeners() {
        this.clickButton.addEventListener('click', () => this.handleClick());
        
        // Add keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                this.handleClick();
            }
        });
    }

    async loadClicks() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/clicks`);
            if (response.ok) {
                const data = await response.json();
                this.totalClicks = data.totalClicks || 0;
            } else {
                console.log('Backend not available, using local storage');
                this.loadFromLocalStorage();
            }
        } catch (error) {
            console.log('Backend not available, using local storage');
            this.loadFromLocalStorage();
        }
    }

    loadFromLocalStorage() {
        const stored = localStorage.getItem('serverClicks');
        if (stored) {
            this.totalClicks = parseInt(stored) || 0;
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('serverClicks', this.totalClicks.toString());
    }

    async handleClick() {
        this.localClicks++;
        this.totalClicks++;
        
        // Visual feedback
        this.showClickFeedback();
        this.animateClick();
        
        // Save locally
        this.saveToLocalStorage();
        
        // Try to sync with backend
        this.syncWithBackend();
        
        // Update display
        this.updateDisplay();
        this.checkMilestones();
    }

    showClickFeedback() {
        const feedbackMessages = [
            "Great click! 🔨",
            "Keep it up! 💪",
            "Awesome! 🚀",
            "You're helping! ⚡",
            "Nice work! 🎯",
            "Building! 🏗️"
        ];
        
        const message = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
        this.clickFeedback.textContent = message;
        this.clickFeedback.classList.add('show');
        
        setTimeout(() => {
            this.clickFeedback.classList.remove('show');
        }, 1000);
    }

    animateClick() {
        this.clickButton.classList.add('clicked');
        this.serverIcon.classList.add('building');
        
        setTimeout(() => {
            this.clickButton.classList.remove('clicked');
            this.serverIcon.classList.remove('building');
        }, 300);
    }

    async syncWithBackend() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/clicks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    clicks: this.localClicks,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.totalClicks = data.totalClicks;
                this.localClicks = 0; // Reset local counter after successful sync
            }
        } catch (error) {
            // Backend not available, continue with local storage
            console.log('Backend sync failed, continuing with local storage');
        }
    }

    updateDisplay() {
        this.totalClicksElement.textContent = this.formatNumber(this.totalClicks);
        this.updateProgress();
        this.updateMotivation();
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    updateProgress() {
        const nextMilestone = this.milestones[this.currentMilestone];
        if (nextMilestone) {
            const progress = Math.min((this.totalClicks / nextMilestone.clicks) * nextMilestone.progress, 100);
            this.progressFill.style.width = `${progress}%`;
        } else {
            this.progressFill.style.width = '100%';
        }
    }

    updateMotivation() {
        const motivations = [
            "Every click helps us build a better server! 🚀",
            "You're making a difference! 💪",
            "Keep clicking to reach the next milestone! 🎯",
            "Your clicks are building something amazing! ⚡",
            "Together we can do this! 🤝",
            "Every click counts! 🔨"
        ];
        
        const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
        this.motivationText.textContent = randomMotivation;
    }

    checkMilestones() {
        if (this.currentMilestone < this.milestones.length) {
            const nextMilestone = this.milestones[this.currentMilestone];
            
            if (this.totalClicks >= nextMilestone.clicks) {
                this.celebrateMilestone(nextMilestone);
                this.currentMilestone++;
            }
        }
    }

    celebrateMilestone(milestone) {
        this.milestoneElement.textContent = milestone.message;
        this.milestoneElement.classList.add('celebrate');
        
        // Update server icon based on progress
        this.updateServerIcon();
        
        setTimeout(() => {
            this.milestoneElement.classList.remove('celebrate');
        }, 2000);
    }

    updateServerIcon() {
        const progress = this.calculateOverallProgress();
        
        // Add visual indicators based on progress
        if (progress >= 50) {
            this.serverIcon.style.filter = 'brightness(1.2)';
        }
        if (progress >= 75) {
            this.serverIcon.style.boxShadow = '0 0 20px rgba(46, 204, 113, 0.5)';
        }
        if (progress >= 100) {
            this.serverIcon.style.animation = 'buildPulse 2s infinite';
        }
    }

    calculateOverallProgress() {
        const maxMilestone = this.milestones[this.milestones.length - 1];
        return Math.min((this.totalClicks / maxMilestone.clicks) * 100, 100);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ClickGame();
});

// Add some fun easter eggs
document.addEventListener('keydown', (e) => {
    // Konami code easter egg
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown' || 
        e.code === 'ArrowLeft' || e.code === 'ArrowRight' ||
        e.code === 'KeyA' || e.code === 'KeyB') {
        // Simple konami code detection could be added here
    }
});

// Add click sound effect (if audio is supported)
function playClickSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
        // Audio not supported or blocked
    }
}
