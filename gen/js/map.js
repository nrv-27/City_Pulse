// Interactive Map JavaScript
// Handles the Leaflet map and issue markers

class IssueMap {
    constructor() {
        this.map = null;
        this.markers = [];
        this.issuesData = [];
        this.filters = {
            category: '',
            status: ['pending', 'verified', 'in_progress', 'resolved'],
            severity: ''
        };
        this.init();
    }

    init() {
        this.initializeMap();
        this.loadIssuesData();
        this.setupFilterHandlers();
        this.setupUI();
    }

    initializeMap() {
        // Initialize Leaflet map centered on Bangalore
        this.map = L.map('map').setView([12.9716, 77.5946], 11);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // Add zoom control
        this.map.zoomControl.setPosition('bottomright');
    }

    async loadIssuesData() {
        try {
            // Mock issues data - in real app, fetch from API
            this.issuesData = [
                {
                    id: 'report_1',
                    title: 'Dangerous Pothole on MG Road',
                    description: 'Large pothole causing traffic issues and vehicle damage. Multiple accidents reported.',
                    category: 'Roads',
                    status: 'in_progress',
                    severity: 'high',
                    latitude: 12.9716,
                    longitude: 77.1025,
                    address: 'MG Road, Bangalore, Karnataka',
                    reporter: 'Priya Sharma',
                    created_at: '2024-12-15T09:30:00Z',
                    upvotes: 15,
                    verification_votes: 8,
                    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
                    assigned_authority: 'BBMP Road Department'
                },
                {
                    id: 'report_2',
                    title: 'Non-functional Street Lights',
                    description: 'Street lights not working for past 3 weeks. Safety concern for pedestrians.',
                    category: 'Electricity',
                    status: 'verified',
                    severity: 'medium',
                    latitude: 12.9279,
                    longitude: 77.0982,
                    address: 'Jayanagar 4th Block, Bangalore',
                    reporter: 'Rajesh Kumar',
                    created_at: '2024-12-14T18:45:00Z',
                    upvotes: 12,
                    verification_votes: 6,
                    image_url: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400',
                    assigned_authority: 'BESCOM'
                },
                {
                    id: 'report_3',
                    title: 'Sewage Overflow Near Beach',
                    description: 'Sewage overflow causing health hazards and water contamination.',
                    category: 'Water',
                    status: 'resolved',
                    severity: 'critical',
                    latitude: 19.076,
                    longitude: 72.8777,
                    address: 'Marine Drive, Mumbai, Maharashtra',
                    reporter: 'Dr. Anita Patel',
                    created_at: '2024-12-10T07:20:00Z',
                    upvotes: 22,
                    verification_votes: 15,
                    image_url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400',
                    assigned_authority: 'BMC Water Department',
                    resolved_at: '2024-12-18T16:30:00Z'
                },
                {
                    id: 'report_4',
                    title: 'Garbage Collection Delay',
                    description: 'Garbage not collected for 5 days. Attracting stray animals and creating unhygienic conditions.',
                    category: 'Waste Management',
                    status: 'pending',
                    severity: 'medium',
                    latitude: 12.9784,
                    longitude: 77.209,
                    address: 'Indiranagar, Bangalore, Karnataka',
                    reporter: 'Amit Gupta',
                    created_at: '2024-12-16T12:10:00Z',
                    upvotes: 8,
                    verification_votes: 4,
                    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400',
                    assigned_authority: 'BBMP Waste Management'
                },
                {
                    id: 'report_5',
                    title: 'Severe Air Pollution in IT Hub',
                    description: 'Air pollution levels extremely high due to construction dust and vehicle emissions.',
                    category: 'Environment',
                    status: 'verified',
                    severity: 'high',
                    latitude: 17.385,
                    longitude: 78.4867,
                    address: 'Hitec City, Hyderabad, Telangana',
                    reporter: 'Sneha Reddy',
                    created_at: '2024-12-12T15:30:00Z',
                    upvotes: 18,
                    verification_votes: 12,
                    image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
                    assigned_authority: 'GHMC Environment Wing'
                }
            ];

            this.renderMarkers();
            this.updateStats();
        } catch (error) {
            console.error('Failed to load issues data:', error);
        }
    }

    renderMarkers() {
        // Clear existing markers
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];

        // Filter issues based on current filters
        const filteredIssues = this.filterIssues();

        // Create markers for filtered issues
        filteredIssues.forEach(issue => {
            const marker = this.createMarker(issue);
            this.markers.push(marker);
        });

        // Fit map to show all markers if there are any
        if (this.markers.length > 0) {
            const group = new L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    createMarker(issue) {
        const markerColor = this.getMarkerColor(issue.status, issue.severity);
        
        // Create custom icon
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `
                <div class="relative">
                    <div class="w-6 h-6 ${markerColor} rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                        <i class="fas ${this.getCategoryIcon(issue.category)} text-white text-xs"></i>
                    </div>
                    <div class="absolute -top-1 -right-1 w-3 h-3 ${this.getSeverityIndicator(issue.severity)} rounded-full border border-white"></div>
                </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        // Create marker
        const marker = L.marker([issue.latitude, issue.longitude], { icon })
            .addTo(this.map);

        // Create popup content
        const popupContent = this.createPopupContent(issue);
        marker.bindPopup(popupContent, {
            className: 'custom-popup',
            maxWidth: 350,
            minWidth: 300
        });

        // Add click handler to show issue details in panel
        marker.on('click', () => {
            this.showIssuePanel(issue);
        });

        return marker;
    }

    getMarkerColor(status, severity) {
        if (severity === 'critical') return 'bg-red-500';
        
        const colors = {
            'pending': 'bg-gray-500',
            'verified': 'bg-blue-500',
            'in_progress': 'bg-orange-500',
            'resolved': 'bg-green-500'
        };
        return colors[status] || 'bg-gray-500';
    }

    getCategoryIcon(category) {
        const icons = {
            'Roads': 'fa-road',
            'Water': 'fa-tint',
            'Electricity': 'fa-bolt',
            'Waste Management': 'fa-trash',
            'Environment': 'fa-leaf',
            'Public Safety': 'fa-shield-alt',
            'Public Transport': 'fa-bus',
            'Healthcare': 'fa-heartbeat',
            'Education': 'fa-graduation-cap'
        };
        return icons[category] || 'fa-exclamation-triangle';
    }

    getSeverityIndicator(severity) {
        const colors = {
            'low': 'bg-green-400',
            'medium': 'bg-yellow-400',
            'high': 'bg-orange-400',
            'critical': 'bg-red-500'
        };
        return colors[severity] || 'bg-gray-400';
    }

    createPopupContent(issue) {
        const statusClass = window.CivicUtils?.getStatusBadge(issue.status) || 'bg-gray-100 text-gray-800';
        const severityClass = window.CivicUtils?.getSeverityBadge(issue.severity) || 'bg-gray-100 text-gray-800';
        const timeAgo = window.CivicUtils?.formatRelativeTime(issue.created_at) || 'Recently';

        return `
            <div class="p-2">
                <div class="flex items-start justify-between mb-3">
                    <h3 class="font-bold text-gray-900 text-sm leading-tight">${issue.title}</h3>
                    <div class="flex space-x-1 ml-2">
                        <span class="px-2 py-1 text-xs font-medium rounded ${statusClass}">${issue.status.replace('_', ' ')}</span>
                    </div>
                </div>
                
                <div class="mb-3">
                    <img src="${issue.image_url}" alt="Issue photo" class="w-full h-32 object-cover rounded-lg">
                </div>
                
                <p class="text-gray-700 text-sm mb-3 line-clamp-3">${issue.description}</p>
                
                <div class="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                    <div><i class="fas fa-map-marker-alt mr-1"></i>${issue.address}</div>
                    <div><i class="fas fa-user mr-1"></i>${issue.reporter}</div>
                    <div><i class="fas fa-clock mr-1"></i>${timeAgo}</div>
                    <div><i class="fas fa-tag mr-1"></i>${issue.category}</div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3 text-xs">
                        <span class="flex items-center text-blue-600">
                            <i class="fas fa-thumbs-up mr-1"></i>${issue.upvotes}
                        </span>
                        <span class="flex items-center text-green-600">
                            <i class="fas fa-check-circle mr-1"></i>${issue.verification_votes}
                        </span>
                    </div>
                    <span class="px-2 py-1 text-xs font-medium rounded ${severityClass}">${issue.severity}</span>
                </div>
                
                <div class="flex space-x-2 mt-3">
                    <button onclick="window.mapInstance.upvoteIssue('${issue.id}')" 
                            class="flex-1 bg-blue-600 text-white text-xs py-2 px-3 rounded hover:bg-blue-700">
                        <i class="fas fa-thumbs-up mr-1"></i>Upvote
                    </button>
                    <button onclick="window.mapInstance.verifyIssue('${issue.id}')" 
                            class="flex-1 bg-green-600 text-white text-xs py-2 px-3 rounded hover:bg-green-700">
                        <i class="fas fa-check mr-1"></i>Verify
                    </button>
                </div>
            </div>
        `;
    }

    setupFilterHandlers() {
        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filters.category = e.target.value;
                this.renderMarkers();
                this.updateStats();
            });
        }

        // Status filters
        const statusCheckboxes = document.querySelectorAll('.status-checkbox');
        statusCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateStatusFilters();
                this.renderMarkers();
                this.updateStats();
            });
        });

        // Severity filter
        const severityFilter = document.getElementById('severityFilter');
        if (severityFilter) {
            severityFilter.addEventListener('change', (e) => {
                this.filters.severity = e.target.value;
                this.renderMarkers();
                this.updateStats();
            });
        }

        // Refresh button
        const refreshBtn = document.getElementById('refreshMap');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadIssuesData();
            });
        }
    }

    updateStatusFilters() {
        const statusCheckboxes = document.querySelectorAll('.status-checkbox:checked');
        this.filters.status = Array.from(statusCheckboxes).map(cb => cb.value);
    }

    filterIssues() {
        return this.issuesData.filter(issue => {
            // Category filter
            if (this.filters.category && issue.category !== this.filters.category) {
                return false;
            }

            // Status filter
            if (!this.filters.status.includes(issue.status)) {
                return false;
            }

            // Severity filter
            if (this.filters.severity) {
                const severityLevels = ['low', 'medium', 'high', 'critical'];
                const filterIndex = severityLevels.indexOf(this.filters.severity);
                const issueIndex = severityLevels.indexOf(issue.severity);
                
                if (issueIndex < filterIndex) {
                    return false;
                }
            }

            return true;
        });
    }

    updateStats() {
        const filteredIssues = this.filterIssues();
        const resolved = filteredIssues.filter(issue => issue.status === 'resolved').length;

        document.getElementById('totalIssues').textContent = filteredIssues.length;
        document.getElementById('resolvedIssues').textContent = resolved;
    }

    setupUI() {
        // Close panel handler
        const closePanel = document.getElementById('closePanel');
        if (closePanel) {
            closePanel.addEventListener('click', this.hideIssuePanel.bind(this));
        }

        // Make this instance globally available
        window.mapInstance = this;
    }

    showIssuePanel(issue) {
        const panel = document.getElementById('issuePanel');
        const title = document.getElementById('issuePanelTitle');
        const content = document.getElementById('issuePanelContent');

        title.textContent = issue.title;
        content.innerHTML = this.createDetailedIssueContent(issue);
        
        panel.classList.remove('hidden');
    }

    hideIssuePanel() {
        const panel = document.getElementById('issuePanel');
        panel.classList.add('hidden');
    }

    createDetailedIssueContent(issue) {
        const statusClass = window.CivicUtils?.getStatusBadge(issue.status) || 'bg-gray-100 text-gray-800';
        const severityClass = window.CivicUtils?.getSeverityBadge(issue.severity) || 'bg-gray-100 text-gray-800';
        const timeAgo = window.CivicUtils?.formatRelativeTime(issue.created_at) || 'Recently';

        return `
            <div class="space-y-4">
                <div>
                    <img src="${issue.image_url}" alt="Issue photo" class="w-full h-48 object-cover rounded-lg">
                </div>
                
                <div class="flex items-center space-x-2">
                    <span class="px-3 py-1 text-sm font-medium rounded ${statusClass}">${issue.status.replace('_', ' ')}</span>
                    <span class="px-3 py-1 text-sm font-medium rounded ${severityClass}">${issue.severity}</span>
                    <span class="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded">${issue.category}</span>
                </div>
                
                <div>
                    <h4 class="font-semibold text-gray-900 mb-2">Description</h4>
                    <p class="text-gray-700">${issue.description}</p>
                </div>
                
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="font-medium text-gray-600">Reporter:</span>
                        <p>${issue.reporter}</p>
                    </div>
                    <div>
                        <span class="font-medium text-gray-600">Reported:</span>
                        <p>${timeAgo}</p>
                    </div>
                    <div>
                        <span class="font-medium text-gray-600">Location:</span>
                        <p>${issue.address}</p>
                    </div>
                    <div>
                        <span class="font-medium text-gray-600">Assigned to:</span>
                        <p>${issue.assigned_authority}</p>
                    </div>
                </div>
                
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div class="flex items-center space-x-6">
                        <div class="text-center">
                            <div class="font-semibold text-blue-600">${issue.upvotes}</div>
                            <div class="text-xs text-gray-600">Upvotes</div>
                        </div>
                        <div class="text-center">
                            <div class="font-semibold text-green-600">${issue.verification_votes}</div>
                            <div class="text-xs text-gray-600">Verifications</div>
                        </div>
                    </div>
                    
                    <div class="flex space-x-2">
                        <button onclick="window.mapInstance.upvoteIssue('${issue.id}')" 
                                class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                            <i class="fas fa-thumbs-up mr-1"></i>Upvote
                        </button>
                        <button onclick="window.mapInstance.verifyIssue('${issue.id}')" 
                                class="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
                            <i class="fas fa-check mr-1"></i>Verify
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    upvoteIssue(issueId) {
        const issue = this.issuesData.find(i => i.id === issueId);
        if (issue) {
            issue.upvotes += 1;
            
            // Update popup if open
            this.renderMarkers();
            
            // Show notification
            if (window.CivicReporter) {
                window.CivicReporter.showNotification('Issue upvoted! +5 points earned.', 'success');
                
                // Update user points
                const currentPoints = parseInt(document.getElementById('userPoints').textContent.replace(',', ''));
                document.getElementById('userPoints').textContent = (currentPoints + 5).toLocaleString();
            }
        }
    }

    verifyIssue(issueId) {
        const issue = this.issuesData.find(i => i.id === issueId);
        if (issue) {
            issue.verification_votes += 1;
            
            // Update popup if open
            this.renderMarkers();
            
            // Show notification
            if (window.CivicReporter) {
                window.CivicReporter.showNotification('Issue verified! +15 points earned.', 'success');
                
                // Update user points
                const currentPoints = parseInt(document.getElementById('userPoints').textContent.replace(',', ''));
                document.getElementById('userPoints').textContent = (currentPoints + 15).toLocaleString();
            }
        }
    }
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new IssueMap();
});