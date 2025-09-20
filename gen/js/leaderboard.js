// Leaderboard JavaScript
// Handles leaderboard display, points charts, and user rankings

class LeaderboardManager {
    constructor() {
        this.currentTab = 'overall';
        this.leaderboardData = [];
        this.userStats = {};
        this.init();
    }

    init() {
        this.loadLeaderboardData();
        this.setupTabHandlers();
        this.createPointsChart();
        this.loadUserStats();
        this.renderLeaderboard();
    }

    async loadLeaderboardData() {
        try {
            // Mock leaderboard data - in real app, fetch from API
            this.leaderboardData = {
                overall: [
                    {
                        rank: 1,
                        name: 'Rajesh Kumar',
                        points: 4200,
                        level: 'Platinum',
                        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
                        reports_submitted: 18,
                        campaigns_joined: 12,
                        badges: ['Champion', 'Environmental Hero']
                    },
                    {
                        rank: 2,
                        name: 'Priya Sharma',
                        points: 2850,
                        level: 'Gold',
                        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b55c?w=100',
                        reports_submitted: 12,
                        campaigns_joined: 5,
                        badges: ['Active Reporter']
                    },
                    {
                        rank: 3,
                        name: 'Sneha Reddy',
                        points: 3150,
                        level: 'Gold',
                        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
                        reports_submitted: 15,
                        campaigns_joined: 8,
                        badges: ['Volunteer Star']
                    },
                    {
                        rank: 4,
                        name: 'Dr. Anita Patel',
                        points: 1800,
                        level: 'Silver',
                        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100',
                        reports_submitted: 5,
                        campaigns_joined: 3,
                        badges: ['Authority Member']
                    },
                    {
                        rank: 5,
                        name: 'Amit Gupta',
                        points: 1200,
                        level: 'Silver',
                        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
                        reports_submitted: 7,
                        campaigns_joined: 2,
                        badges: ['New Member']
                    },
                    {
                        rank: 6,
                        name: 'Vikram Singh',
                        points: 850,
                        level: 'Bronze',
                        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
                        reports_submitted: 4,
                        campaigns_joined: 1,
                        badges: ['Newcomer']
                    }
                ]
            };

            // Copy data for other tabs (simplified for demo)
            this.leaderboardData.monthly = [...this.leaderboardData.overall];
            this.leaderboardData.reporters = [...this.leaderboardData.overall].sort((a, b) => b.reports_submitted - a.reports_submitted);
            this.leaderboardData.volunteers = [...this.leaderboardData.overall].sort((a, b) => b.campaigns_joined - a.campaigns_joined);
        } catch (error) {
            console.error('Failed to load leaderboard data:', error);
        }
    }

    setupTabHandlers() {
        const tabs = document.querySelectorAll('.leaderboard-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabType = tab.dataset.tab;
                this.switchTab(tabType);
            });
        });
    }

    switchTab(tabType) {
        this.currentTab = tabType;
        
        // Update tab styles
        const tabs = document.querySelectorAll('.leaderboard-tab');
        tabs.forEach(tab => {
            if (tab.dataset.tab === tabType) {
                tab.className = 'leaderboard-tab bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold';
            } else {
                tab.className = 'leaderboard-tab bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold';
            }
        });
        
        this.renderLeaderboard();
    }

    renderLeaderboard() {
        const container = document.getElementById('leaderboardList');
        if (!container) return;

        const data = this.leaderboardData[this.currentTab] || [];
        container.innerHTML = '';

        // Skip top 3 for main list since they're shown in podium
        const remainingUsers = data.slice(3);

        remainingUsers.forEach((user, index) => {
            const userElement = document.createElement('div');
            userElement.className = 'flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200';
            
            userElement.innerHTML = `
                <div class="flex items-center space-x-4">
                    <div class="text-2xl font-bold text-gray-400 w-8 text-center">${user.rank}</div>
                    <img src="${user.avatar}" alt="${user.name}" class="w-12 h-12 rounded-full">
                    <div>
                        <h4 class="font-semibold text-gray-900">${user.name}</h4>
                        <div class="flex items-center space-x-2 text-sm text-gray-600">
                            <span class="px-2 py-1 bg-${this.getLevelColor(user.level)}-100 text-${this.getLevelColor(user.level)}-800 rounded text-xs">
                                ${user.level}
                            </span>
                            <span>•</span>
                            <span>${user.reports_submitted} reports</span>
                            <span>•</span>
                            <span>${user.campaigns_joined} campaigns</span>
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-xl font-bold text-indigo-600">${user.points.toLocaleString()}</div>
                    <div class="text-sm text-gray-600">points</div>
                </div>
            `;
            
            container.appendChild(userElement);
        });
    }

    getLevelColor(level) {
        const colors = {
            'Bronze': 'orange',
            'Silver': 'gray',
            'Gold': 'yellow',
            'Platinum': 'purple',
            'Diamond': 'blue'
        };
        return colors[level] || 'gray';
    }

    createPointsChart() {
        const ctx = document.getElementById('pointsChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Reports Submitted', 'Reports Verified', 'Campaigns Joined', 'Community Votes'],
                datasets: [{
                    data: [600, 200, 750, 150],
                    backgroundColor: [
                        '#3B82F6', // blue
                        '#10B981', // green
                        '#8B5CF6', // purple
                        '#F59E0B'  // orange
                    ],
                    borderWidth: 0,
                    cutout: '60%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + ' pts';
                            }
                        }
                    }
                }
            }
        });
    }

    loadUserStats() {
        // Mock user statistics
        this.userStats = {
            currentLevel: 'Gold',
            currentPoints: 2850,
            nextLevelPoints: 4000,
            pointsToNext: 1150,
            progressPercentage: 71.25,
            recentAchievements: [
                {
                    title: 'First Report',
                    description: 'Submitted your first civic report',
                    icon: 'fa-star',
                    color: 'yellow',
                    earned: '2024-01-20'
                },
                {
                    title: 'Community Helper',
                    description: 'Verified 5+ community reports',
                    icon: 'fa-users',
                    color: 'blue',
                    earned: '2024-02-15'
                },
                {
                    title: 'Campaign Champion',
                    description: 'Participated in 5 campaigns',
                    icon: 'fa-calendar-check',
                    color: 'green',
                    earned: '2024-03-10'
                }
            ]
        };

        this.updateUserProgress();
    }

    updateUserProgress() {
        // Update progress bar
        const progressBar = document.querySelector('.bg-gradient-to-r');
        if (progressBar) {
            progressBar.style.width = `${this.userStats.progressPercentage}%`;
        }

        // Update points display with animation
        const pointsElement = document.querySelector('.points-animation');
        if (pointsElement && window.CivicReporter) {
            window.CivicReporter.animatePoints(pointsElement, this.userStats.currentPoints);
        }
    }

    // Method to update points when user performs actions
    addPoints(points, action) {
        this.userStats.currentPoints += points;
        
        // Check for level up
        const newLevel = this.calculateLevel(this.userStats.currentPoints);
        if (newLevel !== this.userStats.currentLevel) {
            this.handleLevelUp(newLevel);
        }
        
        // Update UI
        this.updateUserProgress();
        
        // Show notification
        if (window.CivicReporter) {
            window.CivicReporter.showNotification(`+${points} points earned for ${action}!`, 'success');
        }
    }

    calculateLevel(points) {
        if (points >= 7000) return 'Diamond';
        if (points >= 4000) return 'Platinum';
        if (points >= 2000) return 'Gold';
        if (points >= 1000) return 'Silver';
        return 'Bronze';
    }

    handleLevelUp(newLevel) {
        this.userStats.currentLevel = newLevel;
        
        // Show level up notification
        if (window.CivicReporter) {
            window.CivicReporter.showNotification(`🎉 Congratulations! You've reached ${newLevel} level!`, 'success');
        }
        
        // Update level display
        const levelBadges = document.querySelectorAll('.level-badge, .bg-yellow-100');
        levelBadges.forEach(badge => {
            if (badge.textContent.includes('Level') || badge.textContent.includes(this.userStats.currentLevel)) {
                badge.textContent = `${newLevel} Level`;
            }
        });
    }
}

// Initialize leaderboard manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const leaderboard = new LeaderboardManager();
    
    // Make globally available
    window.LeaderboardManager = leaderboard;
});