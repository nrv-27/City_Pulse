// CivicReporter - Main JavaScript Functions
// Handles core functionality, data management, and UI interactions

class CivicReporter {
    constructor() {
        this.baseUrl = '';
        this.init();
    }

    init() {
        this.loadUserProfile();
        this.loadStats();
        this.setupEventListeners();
        this.loadRecentActivity();
    }

    // API Helper Functions
    async apiCall(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    }

    // Load user profile data
    async loadUserProfile() {
        try {
            // In a real app, this would be based on authenticated user
            const mockUser = {
                name: 'Priya Sharma',
                points: 2850,
                level: 'Gold',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b55c?w=150'
            };

            document.getElementById('userPoints').textContent = mockUser.points.toLocaleString();
            
            // Update any other profile elements
            const profileImages = document.querySelectorAll('img[alt="Profile"]');
            profileImages.forEach(img => img.src = mockUser.avatar);
        } catch (error) {
            console.error('Failed to load user profile:', error);
        }
    }

    // Load platform statistics
    async loadStats() {
        try {
            const mockStats = {
                totalReports: 1247,
                resolvedReports: 892,
                activeCampaigns: 24,
                totalVolunteers: 3456
            };

            // Update stats on homepage
            if (document.getElementById('totalReports')) {
                document.getElementById('totalReports').textContent = mockStats.totalReports.toLocaleString();
                document.getElementById('resolvedReports').textContent = mockStats.resolvedReports.toLocaleString();
                document.getElementById('activeCampaigns').textContent = mockStats.activeCampaigns.toLocaleString();
                document.getElementById('totalVolunteers').textContent = mockStats.totalVolunteers.toLocaleString();
            }
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    }

    // Load recent activity data
    async loadRecentActivity() {
        if (!document.getElementById('recentReports')) return;

        try {
            // Mock recent reports data
            const recentReports = [
                {
                    title: 'Dangerous Pothole on MG Road',
                    time: '2 hours ago',
                    category: 'Roads',
                    status: 'in_progress',
                    statusClass: 'bg-orange-100 text-orange-800'
                },
                {
                    title: 'Non-functional Street Lights',
                    time: '5 hours ago',
                    category: 'Electricity',
                    status: 'verified',
                    statusClass: 'bg-blue-100 text-blue-800'
                },
                {
                    title: 'Sewage Overflow Near Beach',
                    time: '1 day ago',
                    category: 'Water',
                    status: 'resolved',
                    statusClass: 'bg-green-100 text-green-800'
                }
            ];

            const reportsContainer = document.getElementById('recentReports');
            reportsContainer.innerHTML = '';

            recentReports.forEach((report, index) => {
                const reportElement = document.createElement('div');
                reportElement.className = 'flex items-center space-x-3 p-3 bg-white rounded-lg';
                reportElement.innerHTML = `
                    <div class="w-3 h-3 ${this.getStatusColor(report.status)} rounded-full"></div>
                    <div class="flex-1">
                        <p class="text-sm font-medium">${report.title}</p>
                        <p class="text-xs text-gray-500">${report.time} • ${report.category}</p>
                    </div>
                    <span class="text-xs ${report.statusClass} px-2 py-1 rounded capitalize">${report.status.replace('_', ' ')}</span>
                `;
                reportsContainer.appendChild(reportElement);
            });
        } catch (error) {
            console.error('Failed to load recent activity:', error);
        }
    }

    // Get status color for indicators
    getStatusColor(status) {
        const colors = {
            'pending': 'bg-gray-400',
            'verified': 'bg-blue-500',
            'in_progress': 'bg-orange-500',
            'resolved': 'bg-green-500',
            'critical': 'bg-red-500'
        };
        return colors[status] || 'bg-gray-400';
    }

    // Setup event listeners
    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', this.toggleMobileMenu);
        }

        // Add click animations to feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '';
            });
        });

        // Add smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Toggle mobile navigation menu
    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.classList.toggle('hidden');
        }
    }

    // Utility function to format timestamps
    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            return 'Less than an hour ago';
        } else if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays} days ago`;
        }
    }

    // Show loading state
    showLoading(element) {
        if (element) {
            element.innerHTML = '<div class="flex items-center justify-center p-4"><i class="fas fa-spinner fa-spin text-gray-400"></i><span class="ml-2 text-gray-500">Loading...</span></div>';
        }
    }

    // Show error state
    showError(element, message = 'Failed to load data') {
        if (element) {
            element.innerHTML = `<div class="flex items-center justify-center p-4 text-red-600"><i class="fas fa-exclamation-triangle mr-2"></i>${message}</div>`;
        }
    }

    // Success notification
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Points animation
    animatePoints(element, finalPoints) {
        const startPoints = 0;
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentPoints = Math.floor(startPoints + (finalPoints - startPoints) * progress);
            element.textContent = currentPoints.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new CivicReporter();
    
    // Make app globally available for other scripts
    window.CivicReporter = app;
});

// Utility functions for other pages
window.CivicUtils = {
    formatDate: (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    },

    formatRelativeTime: (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes ago`;
        } else if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)} hours ago`;
        } else {
            return `${Math.floor(diffInMinutes / 1440)} days ago`;
        }
    },

    getStatusBadge: (status) => {
        const badges = {
            'pending': 'bg-gray-100 text-gray-800',
            'verified': 'bg-blue-100 text-blue-800',
            'in_progress': 'bg-orange-100 text-orange-800',
            'resolved': 'bg-green-100 text-green-800',
            'rejected': 'bg-red-100 text-red-800'
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    },

    getSeverityBadge: (severity) => {
        const badges = {
            'low': 'bg-green-100 text-green-800',
            'medium': 'bg-yellow-100 text-yellow-800',
            'high': 'bg-orange-100 text-orange-800',
            'critical': 'bg-red-100 text-red-800'
        };
        return badges[severity] || 'bg-gray-100 text-gray-800';
    }
};