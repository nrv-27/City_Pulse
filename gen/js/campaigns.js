// Campaigns JavaScript
// Handles campaign display, filtering, and participation

class CampaignManager {
    constructor() {
        this.campaigns = [];
        this.currentFilter = 'all';
        this.userParticipation = [];
        this.init();
    }

    init() {
        this.loadCampaigns();
        this.setupFilterHandlers();
        this.generateCalendar();
        this.loadUserParticipation();
    }

    async loadCampaigns() {
        try {
            // Mock campaign data
            this.campaigns = [
                {
                    id: 'campaign_1',
                    title: 'Cubbon Park Cleanup Drive',
                    description: 'Join us for a comprehensive cleanup drive at Cubbon Park to make it cleaner and greener for everyone!',
                    organizer: 'Green Bangalore Foundation',
                    category: 'Cleanup Drive',
                    start_date: '2024-12-22T07:00:00Z',
                    end_date: '2024-12-22T10:00:00Z',
                    location: 'Cubbon Park, Bangalore',
                    max_participants: 100,
                    current_participants: 78,
                    points_reward: 150,
                    status: 'upcoming',
                    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600',
                    requirements: ['Gloves', 'Water bottle', 'Comfortable shoes'],
                    created_by: 'user_2'
                },
                {
                    id: 'campaign_2',
                    title: 'Tree Plantation Drive',
                    description: 'Plant 500 saplings to increase green cover and combat climate change in our city.',
                    organizer: 'Environmental Youth Alliance',
                    category: 'Tree Plantation',
                    start_date: '2024-12-25T08:00:00Z',
                    end_date: '2024-12-25T12:00:00Z',
                    location: 'Electronic City, Bangalore',
                    max_participants: 50,
                    current_participants: 32,
                    points_reward: 200,
                    status: 'upcoming',
                    image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600',
                    requirements: ['Gardening tools', 'Hat', 'Water'],
                    created_by: 'user_5'
                },
                {
                    id: 'campaign_3',
                    title: 'Road Safety Awareness Campaign',
                    description: 'Awareness campaign about road safety and traffic rules with distribution of helmets and reflective gear.',
                    organizer: 'Mumbai Traffic Police',
                    category: 'Road Safety',
                    start_date: '2024-12-20T16:00:00Z',
                    end_date: '2024-12-20T19:00:00Z',
                    location: 'Marine Drive, Mumbai',
                    max_participants: 200,
                    current_participants: 145,
                    points_reward: 100,
                    status: 'active',
                    image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600',
                    requirements: ['Valid ID', 'Registration'],
                    created_by: 'user_3'
                },
                {
                    id: 'campaign_4',
                    title: 'Community Health Camp',
                    description: 'Community health checkup camp with free medical consultations and health awareness sessions.',
                    organizer: 'Bangalore Medical Association',
                    category: 'Community Health',
                    start_date: '2024-12-18T09:00:00Z',
                    end_date: '2024-12-18T17:00:00Z',
                    location: 'Koramangala Community Center',
                    max_participants: 75,
                    current_participants: 68,
                    points_reward: 120,
                    status: 'completed',
                    image_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600',
                    requirements: ['Health card', 'Registration'],
                    created_by: 'user_3'
                }
            ];

            this.renderCampaigns();
            this.updateStats();
        } catch (error) {
            console.error('Failed to load campaigns:', error);
        }
    }

    setupFilterHandlers() {
        const filterButtons = document.querySelectorAll('.campaign-filter');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                this.switchFilter(filter);
            });
        });
    }

    switchFilter(filter) {
        this.currentFilter = filter;
        
        // Update button styles
        const filterButtons = document.querySelectorAll('.campaign-filter');\n        filterButtons.forEach(button => {\n            if (button.dataset.filter === filter) {\n                button.className = 'campaign-filter bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold';\n            } else {\n                button.className = 'campaign-filter bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold';\n            }\n        });\n        \n        this.renderCampaigns();\n    }\n\n    renderCampaigns() {\n        const container = document.getElementById('campaignsList');\n        if (!container) return;\n\n        const filteredCampaigns = this.filterCampaigns();\n        \n        // Keep the featured campaign and render others\n        const featuredCampaign = container.querySelector('.campaign-card:first-child');\n        \n        // Remove all campaign cards except the featured one\n        const campaignCards = container.querySelectorAll('.campaign-card:not(:first-child)');\n        campaignCards.forEach(card => card.remove());\n        \n        // Render filtered campaigns\n        filteredCampaigns.slice(1).forEach(campaign => { // Skip first as it's featured\n            const campaignElement = this.createCampaignCard(campaign);\n            container.appendChild(campaignElement);\n        });\n    }\n\n    filterCampaigns() {\n        let filtered = this.campaigns;\n        \n        switch(this.currentFilter) {\n            case 'upcoming':\n                filtered = this.campaigns.filter(c => c.status === 'upcoming');\n                break;\n            case 'active':\n                filtered = this.campaigns.filter(c => c.status === 'active');\n                break;\n            case 'joined':\n                filtered = this.campaigns.filter(c => this.userParticipation.includes(c.id));\n                break;\n            default:\n                filtered = this.campaigns;\n        }\n        \n        return filtered;\n    }\n\n    createCampaignCard(campaign) {\n        const card = document.createElement('div');\n        const isUserJoined = this.userParticipation.includes(campaign.id);\n        const progressPercentage = (campaign.current_participants / campaign.max_participants) * 100;\n        \n        card.className = 'campaign-card bg-white p-6 rounded-2xl shadow-lg border border-gray-100';\n        \n        if (campaign.status === 'active') {\n            card.className += ' border-l-4 border-orange-500';\n        } else if (campaign.status === 'completed') {\n            card.className += ' opacity-75';\n        }\n        \n        card.innerHTML = `\n            <div class=\"flex items-start justify-between mb-4\">\n                <div class=\"flex items-center space-x-3\">\n                    <img src=\"${campaign.image_url}\" alt=\"${campaign.title}\" class=\"w-16 h-16 rounded-lg object-cover\">\n                    <div>\n                        <h3 class=\"text-xl font-bold text-gray-900\">${campaign.title}</h3>\n                        <p class=\"text-gray-600\">${campaign.organizer}</p>\n                        <div class=\"flex items-center space-x-4 mt-1 text-sm text-gray-500\">\n                            ${campaign.status === 'active' ? \n                                '<span class=\"text-orange-600 font-medium\"><i class=\"fas fa-broadcast-tower mr-1\"></i>Live Now</span>' :\n                                campaign.status === 'completed' ?\n                                '<span class=\"text-green-600 font-medium\"><i class=\"fas fa-check-circle mr-1\"></i>Completed</span>' :\n                                `<span><i class=\"fas fa-calendar mr-1\"></i>${this.formatDate(campaign.start_date)}</span>`\n                            }\n                            <span><i class=\"fas fa-clock mr-1\"></i>${this.formatTime(campaign.start_date)}</span>\n                            <span><i class=\"fas fa-map-marker-alt mr-1\"></i>${campaign.location.split(',')[0]}</span>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"text-right\">\n                    <div class=\"text-lg font-bold ${this.getPointsColor(campaign.status)}\">${campaign.points_reward} pts</div>\n                    <div class=\"text-sm text-gray-500\">${campaign.status === 'completed' ? 'Earned' : 'Reward'}</div>\n                </div>\n            </div>\n\n            <p class=\"text-gray-700 mb-4\">${campaign.description}</p>\n\n            <div class=\"flex items-center justify-between mb-4\">\n                <div class=\"flex items-center space-x-4\">\n                    <span class=\"inline-flex items-center px-3 py-1 ${this.getCategoryBadge(campaign.category)} rounded-full text-sm font-medium\">\n                        <i class=\"${this.getCategoryIcon(campaign.category)} mr-1\"></i>${campaign.category}\n                    </span>\n                    <span class=\"text-sm text-gray-600\">${campaign.current_participants}/${campaign.max_participants} participants</span>\n                </div>\n                <div class=\"flex space-x-2\">\n                    ${this.getCampaignButtons(campaign, isUserJoined)}\n                </div>\n            </div>\n\n            <div class=\"w-full bg-gray-200 rounded-full h-2\">\n                <div class=\"${this.getProgressColor(campaign.status)} h-2 rounded-full\" style=\"width: ${progressPercentage}%\"></div>\n            </div>\n        `;\n        \n        // Add event listeners\n        this.addCampaignEventListeners(card, campaign);\n        \n        return card;\n    }\n\n    formatDate(dateString) {\n        const date = new Date(dateString);\n        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });\n    }\n\n    formatTime(dateString) {\n        const date = new Date(dateString);\n        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });\n    }\n\n    getPointsColor(status) {\n        const colors = {\n            'upcoming': 'text-indigo-600',\n            'active': 'text-orange-600',\n            'completed': 'text-green-600'\n        };\n        return colors[status] || 'text-gray-600';\n    }\n\n    getCategoryBadge(category) {\n        const badges = {\n            'Cleanup Drive': 'bg-green-100 text-green-800',\n            'Tree Plantation': 'bg-emerald-100 text-emerald-800',\n            'Road Safety': 'bg-orange-100 text-orange-800',\n            'Community Health': 'bg-red-100 text-red-800',\n            'Water Conservation': 'bg-blue-100 text-blue-800',\n            'Environmental Awareness': 'bg-purple-100 text-purple-800'\n        };\n        return badges[category] || 'bg-gray-100 text-gray-800';\n    }\n\n    getCategoryIcon(category) {\n        const icons = {\n            'Cleanup Drive': 'fas fa-broom',\n            'Tree Plantation': 'fas fa-seedling',\n            'Road Safety': 'fas fa-shield-alt',\n            'Community Health': 'fas fa-heartbeat',\n            'Water Conservation': 'fas fa-tint',\n            'Environmental Awareness': 'fas fa-leaf'\n        };\n        return icons[category] || 'fas fa-calendar';\n    }\n\n    getCampaignButtons(campaign, isUserJoined) {\n        if (campaign.status === 'completed') {\n            return `\n                <button class=\"bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm cursor-not-allowed\">\n                    <i class=\"fas fa-trophy mr-1\"></i>Completed\n                </button>\n            `;\n        }\n        \n        if (campaign.status === 'active') {\n            return `\n                <button class=\"join-campaign bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition duration-200\" data-campaign-id=\"${campaign.id}\">\n                    <i class=\"fas fa-play mr-1\"></i>Join Live\n                </button>\n                <button class=\"view-campaign border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition duration-200\" data-campaign-id=\"${campaign.id}\">\n                    View Live\n                </button>\n            `;\n        }\n        \n        if (isUserJoined) {\n            return `\n                <button class=\"bg-green-500 text-white px-4 py-2 rounded-lg text-sm cursor-not-allowed\">\n                    <i class=\"fas fa-check mr-1\"></i>Joined\n                </button>\n                <button class=\"view-campaign border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition duration-200\" data-campaign-id=\"${campaign.id}\">\n                    Details\n                </button>\n            `;\n        }\n        \n        return `\n            <button class=\"join-campaign bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition duration-200\" data-campaign-id=\"${campaign.id}\">\n                Join Now\n            </button>\n            <button class=\"view-campaign border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition duration-200\" data-campaign-id=\"${campaign.id}\">\n                Details\n            </button>\n        `;\n    }\n\n    getProgressColor(status) {\n        const colors = {\n            'upcoming': 'bg-indigo-500',\n            'active': 'bg-orange-500',\n            'completed': 'bg-green-500'\n        };\n        return colors[status] || 'bg-gray-500';\n    }\n\n    addCampaignEventListeners(card, campaign) {\n        // Join campaign button\n        const joinBtn = card.querySelector('.join-campaign');\n        if (joinBtn) {\n            joinBtn.addEventListener('click', () => {\n                this.joinCampaign(campaign.id);\n            });\n        }\n        \n        // View campaign button\n        const viewBtn = card.querySelector('.view-campaign');\n        if (viewBtn) {\n            viewBtn.addEventListener('click', () => {\n                this.viewCampaignDetails(campaign.id);\n            });\n        }\n    }\n\n    joinCampaign(campaignId) {\n        const campaign = this.campaigns.find(c => c.id === campaignId);\n        if (!campaign) return;\n        \n        // Check if already at capacity\n        if (campaign.current_participants >= campaign.max_participants) {\n            if (window.CivicReporter) {\n                window.CivicReporter.showNotification('Campaign is at full capacity!', 'error');\n            }\n            return;\n        }\n        \n        // Add user to campaign\n        campaign.current_participants += 1;\n        this.userParticipation.push(campaignId);\n        \n        // Award points\n        const joinPoints = Math.floor(campaign.points_reward * 0.5); // 50% for joining\n        if (window.CivicReporter) {\n            const currentPoints = parseInt(document.getElementById('userPoints').textContent.replace(',', ''));\n            document.getElementById('userPoints').textContent = (currentPoints + joinPoints).toLocaleString();\n            \n            window.CivicReporter.showNotification(`Successfully joined ${campaign.title}! +${joinPoints} points earned.`, 'success');\n        }\n        \n        // Re-render campaigns to update UI\n        this.renderCampaigns();\n        this.updateUserStats();\n    }\n\n    viewCampaignDetails(campaignId) {\n        const campaign = this.campaigns.find(c => c.id === campaignId);\n        if (!campaign) return;\n        \n        // Create modal or detailed view\n        this.showCampaignModal(campaign);\n    }\n\n    showCampaignModal(campaign) {\n        // Create modal overlay\n        const modal = document.createElement('div');\n        modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';\n        modal.innerHTML = `\n            <div class=\"bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto\">\n                <div class=\"p-6\">\n                    <div class=\"flex justify-between items-start mb-6\">\n                        <h2 class=\"text-2xl font-bold text-gray-900\">${campaign.title}</h2>\n                        <button class=\"close-modal text-gray-400 hover:text-gray-600\">\n                            <i class=\"fas fa-times text-xl\"></i>\n                        </button>\n                    </div>\n                    \n                    <img src=\"${campaign.image_url}\" alt=\"${campaign.title}\" class=\"w-full h-48 object-cover rounded-lg mb-6\">\n                    \n                    <div class=\"space-y-4\">\n                        <div>\n                            <h3 class=\"font-semibold text-gray-900 mb-2\">Description</h3>\n                            <p class=\"text-gray-700\">${campaign.description}</p>\n                        </div>\n                        \n                        <div class=\"grid grid-cols-2 gap-4\">\n                            <div>\n                                <span class=\"font-medium text-gray-600\">Organizer:</span>\n                                <p class=\"text-gray-900\">${campaign.organizer}</p>\n                            </div>\n                            <div>\n                                <span class=\"font-medium text-gray-600\">Points Reward:</span>\n                                <p class=\"text-gray-900\">${campaign.points_reward} points</p>\n                            </div>\n                            <div>\n                                <span class=\"font-medium text-gray-600\">Date & Time:</span>\n                                <p class=\"text-gray-900\">${this.formatDate(campaign.start_date)} at ${this.formatTime(campaign.start_date)}</p>\n                            </div>\n                            <div>\n                                <span class=\"font-medium text-gray-600\">Location:</span>\n                                <p class=\"text-gray-900\">${campaign.location}</p>\n                            </div>\n                        </div>\n                        \n                        <div>\n                            <h3 class=\"font-semibold text-gray-900 mb-2\">Requirements</h3>\n                            <ul class=\"text-gray-700 space-y-1\">\n                                ${campaign.requirements.map(req => `<li>\u2022 ${req}</li>`).join('')}\n                            </ul>\n                        </div>\n                        \n                        <div class=\"flex items-center justify-between p-4 bg-gray-50 rounded-lg\">\n                            <div class=\"text-center\">\n                                <div class=\"font-semibold text-gray-900\">${campaign.current_participants}</div>\n                                <div class=\"text-sm text-gray-600\">Participants</div>\n                            </div>\n                            <div class=\"text-center\">\n                                <div class=\"font-semibold text-gray-900\">${campaign.max_participants}</div>\n                                <div class=\"text-sm text-gray-600\">Max Capacity</div>\n                            </div>\n                            <div class=\"text-center\">\n                                <div class=\"font-semibold text-indigo-600\">${Math.round((campaign.current_participants / campaign.max_participants) * 100)}%</div>\n                                <div class=\"text-sm text-gray-600\">Filled</div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        `;\n        \n        // Add close handler\n        modal.querySelector('.close-modal').addEventListener('click', () => {\n            document.body.removeChild(modal);\n        });\n        \n        // Close on background click\n        modal.addEventListener('click', (e) => {\n            if (e.target === modal) {\n                document.body.removeChild(modal);\n            }\n        });\n        \n        document.body.appendChild(modal);\n    }\n\n    generateCalendar() {\n        // Calendar is already pre-built in HTML with campaign indicators\n        // This could be enhanced to dynamically generate calendar based on campaign dates\n    }\n\n    loadUserParticipation() {\n        // Mock user participation data\n        this.userParticipation = ['campaign_1', 'campaign_4']; // User joined these campaigns\n        this.updateUserStats();\n    }\n\n    updateUserStats() {\n        // Update participation stats in sidebar\n        const statsContainer = document.querySelector('.bg-white.rounded-2xl.shadow-xl.p-6:has(h3:contains(\"My Participation\"))');\n        if (statsContainer) {\n            // Update stats based on user participation\n            // This is already handled in the HTML template\n        }\n    }\n\n    updateStats() {\n        // Update overall campaign statistics\n        const totalCampaigns = this.campaigns.length;\n        const activeCampaigns = this.campaigns.filter(c => c.status === 'active').length;\n        const totalParticipants = this.campaigns.reduce((sum, c) => sum + c.current_participants, 0);\n        \n        // Update stats display\n        console.log(`Total campaigns: ${totalCampaigns}, Active: ${activeCampaigns}, Total participants: ${totalParticipants}`);\n    }\n}\n\n// Initialize campaign manager when DOM is loaded\ndocument.addEventListener('DOMContentLoaded', () => {\n    const campaignManager = new CampaignManager();\n    \n    // Make globally available\n    window.CampaignManager = campaignManager;\n});