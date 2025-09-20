// Report Submission JavaScript
// Handles the report submission form functionality

class ReportManager {
    constructor() {
        this.currentLocation = null;
        this.selectedPhotos = [];
        this.init();
    }

    init() {
        this.setupFormHandlers();
        this.setupPhotoUpload();
        this.setupLocationDetection();
        this.setupSeveritySelection();
    }

    setupFormHandlers() {
        const form = document.getElementById('reportForm');
        if (form) {
            form.addEventListener('submit', this.handleSubmit.bind(this));
        }
    }

    setupPhotoUpload() {
        const photoInput = document.getElementById('photoInput');
        if (photoInput) {
            photoInput.addEventListener('change', this.handlePhotoSelection.bind(this));
        }
    }

    setupLocationDetection() {
        const detectBtn = document.getElementById('detectLocationBtn');
        if (detectBtn) {
            detectBtn.addEventListener('click', this.detectLocation.bind(this));
        }
    }

    setupSeveritySelection() {
        const severityOptions = document.querySelectorAll('input[name="severity"]');
        severityOptions.forEach(option => {
            option.addEventListener('change', this.handleSeverityChange.bind(this));
        });
    }

    handlePhotoSelection(event) {
        const files = Array.from(event.target.files);
        
        if (files.length === 0) return;

        const photoPreview = document.getElementById('photoPreview');
        const photoGrid = document.getElementById('photoGrid');
        const photoUploadArea = document.getElementById('photoUploadArea');

        // Show preview area
        photoPreview.classList.remove('hidden');
        photoUploadArea.style.display = 'none';

        // Clear existing previews
        photoGrid.innerHTML = '';

        files.forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                this.createPhotoPreview(file, index, photoGrid);
                this.selectedPhotos.push(file);
            }
        });

        // Add upload more button
        const addMoreBtn = document.createElement('div');
        addMoreBtn.className = 'col-span-1 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400';
        addMoreBtn.innerHTML = `
            <i class="fas fa-plus text-2xl text-gray-400 mb-2"></i>
            <span class="text-sm text-gray-600">Add More</span>
        `;
        addMoreBtn.onclick = () => document.getElementById('photoInput').click();
        photoGrid.appendChild(addMoreBtn);
    }

    createPhotoPreview(file, index, container) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewDiv = document.createElement('div');
            previewDiv.className = 'relative group';
            previewDiv.innerHTML = `
                <img src="${e.target.result}" alt="Preview ${index + 1}" 
                     class="w-full h-24 object-cover rounded-lg">
                <button type="button" 
                        class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
                <div class="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    ${Math.round(file.size / 1024)}KB
                </div>
            `;
            container.appendChild(previewDiv);
        };
        reader.readAsDataURL(file);
    }

    detectLocation() {
        const detectBtn = document.getElementById('detectLocationBtn');
        const locationStatus = document.getElementById('locationStatus');
        
        detectBtn.disabled = true;
        detectBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Detecting...';
        locationStatus.textContent = 'Getting your location...';
        locationStatus.className = 'text-sm text-blue-600 location-detected';

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                this.handleLocationSuccess.bind(this),
                this.handleLocationError.bind(this),
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                }
            );
        } else {
            this.handleLocationError({ message: 'Geolocation is not supported by this browser.' });
        }
    }

    async handleLocationSuccess(position) {
        const { latitude, longitude } = position.coords;
        
        // Update form fields
        document.getElementById('latitude').value = latitude.toFixed(6);
        document.getElementById('longitude').value = longitude.toFixed(6);
        
        // Reverse geocoding (mock implementation)
        try {
            const address = await this.reverseGeocode(latitude, longitude);
            document.getElementById('address').value = address;
        } catch (error) {
            console.error('Reverse geocoding failed:', error);
            document.getElementById('address').value = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        }

        // Update UI
        const detectBtn = document.getElementById('detectLocationBtn');
        const locationStatus = document.getElementById('locationStatus');
        
        detectBtn.disabled = false;
        detectBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Location Detected';
        detectBtn.className = 'bg-green-600 text-white px-4 py-3 rounded-lg transition duration-200';
        
        locationStatus.textContent = 'Location detected successfully!';
        locationStatus.className = 'text-sm text-green-600';

        // Show map preview
        this.showMapPreview(latitude, longitude);
        
        this.currentLocation = { latitude, longitude };
    }

    handleLocationError(error) {
        const detectBtn = document.getElementById('detectLocationBtn');
        const locationStatus = document.getElementById('locationStatus');
        
        detectBtn.disabled = false;
        detectBtn.innerHTML = '<i class="fas fa-location-arrow mr-2"></i>Detect Location';
        
        locationStatus.textContent = `Location error: ${error.message}`;
        locationStatus.className = 'text-sm text-red-600';
    }

    async reverseGeocode(lat, lng) {
        // Mock reverse geocoding - in a real app, use Google Maps API or similar
        const mockAddresses = [
            'MG Road, Bangalore, Karnataka',
            'Jayanagar, Bangalore, Karnataka',
            'Indiranagar, Bangalore, Karnataka',
            'Koramangala, Bangalore, Karnataka',
            'Electronic City, Bangalore, Karnataka'
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return mockAddresses[Math.floor(Math.random() * mockAddresses.length)];
    }

    showMapPreview(lat, lng) {
        const mapPreview = document.getElementById('mapPreview');
        mapPreview.classList.remove('hidden');
        mapPreview.innerHTML = `
            <div class="h-48 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
                <div class="text-center">
                    <i class="fas fa-map-marker-alt text-4xl text-red-500 mb-2"></i>
                    <p class="text-gray-700 font-medium">Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
                    <p class="text-gray-500 text-sm mt-1">Map preview would show here</p>
                </div>
            </div>
        `;
    }

    handleSeverityChange(event) {
        const severityOptions = document.querySelectorAll('.severity-option');
        severityOptions.forEach(option => {
            option.className = 'severity-option border-2 border-gray-300 bg-gray-50 text-gray-700 p-3 rounded-lg text-center cursor-pointer';
        });

        const selectedOption = event.target.parentElement.querySelector('.severity-option');
        const severity = event.target.value;
        
        const severityStyles = {
            'low': 'border-green-300 bg-green-50 text-green-700',
            'medium': 'border-yellow-300 bg-yellow-50 text-yellow-700',
            'high': 'border-orange-300 bg-orange-50 text-orange-700',
            'critical': 'border-red-300 bg-red-50 text-red-700'
        };

        selectedOption.className = `severity-option border-2 ${severityStyles[severity]} p-3 rounded-lg text-center cursor-pointer`;

        // Update AI analysis preview
        this.updateAIAnalysisPreview(severity);
    }

    updateAIAnalysisPreview(severity) {
        const aiAnalysis = document.getElementById('aiAnalysis');
        
        const analysisContent = {
            'low': {
                color: 'from-green-50 to-blue-50',
                icon: 'fa-info-circle text-green-600',
                text: 'AI suggests: Low priority issue. Standard processing time expected.'
            },
            'medium': {
                color: 'from-yellow-50 to-orange-50',
                icon: 'fa-exclamation-triangle text-yellow-600',
                text: 'AI suggests: Medium priority. May require faster response time.'
            },
            'high': {
                color: 'from-orange-50 to-red-50',
                icon: 'fa-exclamation-triangle text-orange-600',
                text: 'AI suggests: High priority issue. Immediate attention recommended.'
            },
            'critical': {
                color: 'from-red-50 to-pink-50',
                icon: 'fa-fire text-red-600',
                text: 'AI suggests: Critical issue! Emergency response may be required.'
            }
        };

        const analysis = analysisContent[severity];
        if (analysis) {
            aiAnalysis.className = `bg-gradient-to-r ${analysis.color} p-6 rounded-xl border`;
            aiAnalysis.innerHTML = `
                <div class="flex items-center">
                    <i class="fas ${analysis.icon} text-2xl mr-4"></i>
                    <div>
                        <p class="font-medium text-gray-900">AI Analysis Preview</p>
                        <p class="text-gray-700 mt-1">${analysis.text}</p>
                    </div>
                </div>
            `;
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Submitting Report...';

        try {
            // Validate form
            if (!this.validateForm()) {
                throw new Error('Please fill in all required fields');
            }

            // Collect form data
            const formData = this.collectFormData();
            
            // Simulate API call
            await this.submitReport(formData);
            
            // Show success
            this.showSuccess();
            
        } catch (error) {
            console.error('Report submission failed:', error);
            this.showError(error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    validateForm() {
        const requiredFields = ['title', 'category', 'description'];
        
        for (const field of requiredFields) {
            const element = document.getElementById(field);
            if (!element || !element.value.trim()) {
                element?.focus();
                return false;
            }
        }

        return true;
    }

    collectFormData() {
        const formData = {
            title: document.getElementById('title').value.trim(),
            description: document.getElementById('description').value.trim(),
            category: document.getElementById('category').value,
            severity: document.querySelector('input[name="severity"]:checked')?.value || 'low',
            latitude: parseFloat(document.getElementById('latitude').value) || null,
            longitude: parseFloat(document.getElementById('longitude').value) || null,
            address: document.getElementById('address').value.trim(),
            photos: this.selectedPhotos.map(photo => photo.name), // In real app, upload photos
            created_at: new Date().toISOString(),
            reporter_id: 'user_1', // Would be from authentication
            status: 'pending',
            upvotes: 0,
            verification_votes: 0
        };

        return formData;
    }

    async submitReport(reportData) {
        // Mock AI analysis
        const aiTags = this.generateAITags(reportData);
        const aiConfidence = Math.random() * 0.3 + 0.7; // 70-100% confidence

        const fullReportData = {
            ...reportData,
            ai_tags: aiTags,
            ai_confidence: aiConfidence,
            assigned_authority: this.getAssignedAuthority(reportData.category)
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Store in tables (mock)
        console.log('Submitting report:', fullReportData);
        
        // In a real app, make actual API call
        // await window.CivicReporter.apiCall('tables/reports', {
        //     method: 'POST',
        //     body: JSON.stringify(fullReportData)
        // });

        return fullReportData;
    }

    generateAITags(reportData) {
        const categoryTags = {
            'Roads': ['road_damage', 'infrastructure', 'traffic_hazard'],
            'Water': ['water_supply', 'sanitation', 'public_health'],
            'Electricity': ['power_outage', 'electrical_hazard', 'street_lighting'],
            'Waste Management': ['waste_collection', 'sanitation', 'environmental'],
            'Environment': ['pollution', 'environmental_hazard', 'public_health'],
            'Public Safety': ['safety_concern', 'emergency', 'public_security']
        };

        const baseTags = categoryTags[reportData.category] || ['general_issue'];
        
        // Add severity-based tags
        if (reportData.severity === 'high' || reportData.severity === 'critical') {
            baseTags.push('urgent_attention');
        }

        return baseTags;
    }

    getAssignedAuthority(category) {
        const authorities = {
            'Roads': 'BBMP Road Department',
            'Water': 'Water Supply Department',
            'Electricity': 'BESCOM',
            'Waste Management': 'BBMP Waste Management',
            'Environment': 'Environmental Protection Agency',
            'Public Safety': 'Local Police Department'
        };

        return authorities[category] || 'Municipal Corporation';
    }

    showSuccess() {
        // Hide form
        document.getElementById('reportForm').style.display = 'none';
        
        // Show success message
        const successMessage = document.getElementById('successMessage');
        successMessage.classList.remove('hidden');
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth' });

        // Update user points (mock)
        if (window.CivicReporter) {
            const currentPoints = parseInt(document.getElementById('userPoints').textContent.replace(',', ''));
            const newPoints = currentPoints + 50;
            window.CivicReporter.animatePoints(document.getElementById('userPoints'), newPoints);
        }
    }

    showError(message) {
        if (window.CivicReporter) {
            window.CivicReporter.showNotification(message, 'error');
        } else {
            alert(`Error: ${message}`);
        }
    }
}

// Initialize report manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ReportManager();
});