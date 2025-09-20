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
        const filterButtons = document.querySelectorAll('.campaign-filter')
    }
}