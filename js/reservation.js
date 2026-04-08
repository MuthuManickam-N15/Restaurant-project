/* ========================================
   RESERVATION SYSTEM - OPTIMIZED
   Advanced form management with validation
======================================== */

class ReservationSystem {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        // Set minimum date to today
        this.setMinimumDate();
        
        // Set time restrictions
        this.setTimeRestrictions();
        
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        this.setupRealTimeValidation();
        
        // Guest count change
        this.handleGuestCount();
        
        // Date change
        this.handleDateChange();
    }
    
    // ========== DATE & TIME SETUP ==========
    setMinimumDate() {
        const dateInput = this.form.querySelector('#date');
        if (!dateInput) return;
        
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const year = tomorrow.getFullYear();
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const day = String(tomorrow.getDate()).padStart(2, '0');
        
        dateInput.min = `${year}-${month}-${day}`;
        
        // Set max date (3 months from now)
        const maxDate = new Date(today);
        maxDate.setMonth(maxDate.getMonth() + 3);
        
        const maxYear = maxDate.getFullYear();
        const maxMonth = String(maxDate.getMonth() + 1).padStart(2, '0');
        const maxDay = String(maxDate.getDate()).padStart(2, '0');
        
        dateInput.max = `${maxYear}-${maxMonth}-${maxDay}`;
    }
    
    setTimeRestrictions() {
        const timeInput = this.form.querySelector('#time');
        if (!timeInput) return;
        
        // Restaurant hours: 11:00 AM - 11:00 PM
        timeInput.min = '11:00';
        timeInput.max = '23:00';
        
        // Check if selected date is today
        const dateInput = this.form.querySelector('#date');
        if (dateInput) {
            dateInput.addEventListener('change', () => {
                this.validateTime(dateInput.value, timeInput);
            });
        }
    }
    
    validateTime(selectedDate, timeInput) {
        const today = new Date();
        const selected = new Date(selectedDate);
        
        if (selected.toDateString() === today.toDateString()) {
            const currentHour = today.getHours();
            const currentMinute = today.getMinutes();
            
            // Set minimum time to 1 hour from now
            const futureTime = new Date(today.getTime() + 60 * 60 * 1000);
            const minTime = `${String(futureTime.getHours()).padStart(2, '0')}:${String(futureTime.getMinutes()).padStart(2, '0')}`;
            
            timeInput.min = minTime;
        } else {
            timeInput.min = '11:00';
        }
    }
    
    // ========== FORM VALIDATION ==========
    setupRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        // Required field check
        if (field.hasAttribute('required') && value === '') {
            this.showError(field, 'This field is required');
            return false;
        }
        
        // Name validation
        if (fieldName === 'name' && value !== '') {
            if (value.length < 2) {
                this.showError(field, 'Name must be at least 2 characters');
                return false;
            }
            if (!/^[a-zA-Z\s]+$/.test(value)) {
                this.showError(field, 'Name should contain only letters');
                return false;
            }
        }
        
        // Email validation
        if (fieldName === 'email' && value !== '') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                this.showError(field, 'Please enter a valid email');
                return false;
            }
        }
        
        // Phone validation
        if (fieldName === 'phone' && value !== '') {
            const phonePattern = /^[\d\s\-\+KATEX_INLINE_OPENKATEX_INLINE_CLOSE]+$/;
            const digitsOnly = value.replace(/\D/g, '');
            
            if (!phonePattern.test(value)) {
                this.showError(field, 'Please enter a valid phone number');
                return false;
            }
            if (digitsOnly.length < 10) {
                this.showError(field, 'Phone number must be at least 10 digits');
                return false;
            }
        }
        
        // Date validation
        if (fieldName === 'date' && value !== '') {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                this.showError(field, 'Please select a future date');
                return false;
            }
        }
        
        // Time validation
        if (fieldName === 'time' && value !== '') {
            const [hours, minutes] = value.split(':').map(Number);
            
            if (hours < 11 || hours >= 23) {
                this.showError(field, 'Please select time between 11:00 AM and 11:00 PM');
                return false;
            }
        }
        
        // Guest validation
        if (fieldName === 'guests' && value === '') {
            this.showError(field, 'Please select number of guests');
            return false;
        }
        
        this.clearError(field);
        return true;
    }
    
    showError(field, message) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        // Remove existing error
        this.clearError(field);
        
        // Add error class
        field.classList.add('error');
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: 12px;
            margin-top: 5px;
            display: flex;
            align-items: center;
            gap: 5px;
        `;
        
        formGroup.appendChild(errorDiv);
    }
    
    clearError(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        field.classList.remove('error');
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) errorMessage.remove();
    }
    
    // ========== GUEST COUNT HANDLER ==========
    handleGuestCount() {
        const guestSelect = this.form.querySelector('#guests');
        if (!guestSelect) return;
        
        guestSelect.addEventListener('change', (e) => {
            const value = e.target.value;
            
            if (value === '5+') {
                this.showInfo('For parties of 5 or more, we recommend calling us directly at +91-9876543210 for the best seating arrangements.');
            }
        });
    }
    
    // ========== DATE CHANGE HANDLER ==========
    handleDateChange() {
        const dateInput = this.form.querySelector('#date');
        if (!dateInput) return;
        
        dateInput.addEventListener('change', (e) => {
            const selectedDate = new Date(e.target.value);
            const dayOfWeek = selectedDate.getDay();
            
            // Weekend notification
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                this.showInfo('🎉 Weekend reservations are in high demand. We recommend booking early!');
            }
        });
    }
    
    // ========== FORM SUBMISSION ==========
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const inputs = this.form.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showNotification('Please fill in all required fields correctly.', 'error');
            // Scroll to first error
            const firstError = this.form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Format data for display
        const reservationDetails = this.formatReservationData(data);
        
        // Show confirmation modal
        this.showConfirmationModal(reservationDetails);
    }
    
    formatReservationData(data) {
        // Format date
        const date = new Date(data.date);
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', dateOptions);
        
        // Format time
        const [hours, minutes] = data.time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        const formattedTime = `${displayHour}:${minutes} ${ampm}`;
        
        return {
            name: data.name,
            email: data.email,
            phone: data.phone,
            guests: data.guests,
            date: formattedDate,
            time: formattedTime,
            message: data.message || 'No special requests'
        };
    }
    
    showConfirmationModal(details) {
        // Create modal backdrop
        const modal = document.createElement('div');
        modal.className = 'reservation-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-icon">
                        <i class="fas fa-calendar-check"></i>
                    </div>
                    <h2>Confirm Your Reservation</h2>
                    <p>Please review your booking details</p>
                </div>
                
                <div class="modal-body">
                    <div class="reservation-summary">
                        <div class="summary-item">
                            <i class="fas fa-user"></i>
                            <div>
                                <strong>Name</strong>
                                <span>${details.name}</span>
                            </div>
                        </div>
                        
                        <div class="summary-item">
                            <i class="fas fa-envelope"></i>
                            <div>
                                <strong>Email</strong>
                                <span>${details.email}</span>
                            </div>
                        </div>
                        
                        <div class="summary-item">
                            <i class="fas fa-phone"></i>
                            <div>
                                <strong>Phone</strong>
                                <span>${details.phone}</span>
                            </div>
                        </div>
                        
                        <div class="summary-item">
                            <i class="fas fa-users"></i>
                            <div>
                                <strong>Guests</strong>
                                <span>${details.guests} ${details.guests === '1' ? 'Person' : 'People'}</span>
                            </div>
                        </div>
                        
                        <div class="summary-item">
                            <i class="fas fa-calendar"></i>
                            <div>
                                <strong>Date</strong>
                                <span>${details.date}</span>
                            </div>
                        </div>
                        
                        <div class="summary-item">
                            <i class="fas fa-clock"></i>
                            <div>
                                <strong>Time</strong>
                                <span>${details.time}</span>
                            </div>
                        </div>
                        
                        <div class="summary-item full-width">
                            <i class="fas fa-comment"></i>
                            <div>
                                <strong>Special Requests</strong>
                                <span>${details.message}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="cancelReservation">
                        <i class="fas fa-times"></i>
                        Cancel
                    </button>
                    <button class="btn btn-primary btn-glow" id="confirmReservation">
                        <i class="fas fa-check"></i>
                        Confirm Reservation
                    </button>
                </div>
            </div>
        `;
        
        // Add modal styles
        this.addModalStyles();
        
        // Append to body
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Animate modal entrance
        requestAnimationFrame(() => {
            modal.querySelector('.modal-overlay').style.opacity = '1';
            modal.querySelector('.modal-content').style.transform = 'translate(-50%, -50%) scale(1)';
            modal.querySelector('.modal-content').style.opacity = '1';
        });
        
        // Event listeners
        const overlay = modal.querySelector('.modal-overlay');
        const cancelBtn = modal.querySelector('#cancelReservation');
        const confirmBtn = modal.querySelector('#confirmReservation');
        
        overlay.addEventListener('click', () => this.closeModal(modal));
        cancelBtn.addEventListener('click', () => this.closeModal(modal));
        confirmBtn.addEventListener('click', () => this.submitReservation(details, modal));
        
        // ESC key to close
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModal(modal);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }
    
    closeModal(modal) {
        modal.querySelector('.modal-overlay').style.opacity = '0';
        modal.querySelector('.modal-content').style.transform = 'translate(-50%, -50%) scale(0.9)';
        modal.querySelector('.modal-content').style.opacity = '0';
        
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
    
    async submitReservation(details, modal) {
        const confirmBtn = modal.querySelector('#confirmReservation');
        const originalHTML = confirmBtn.innerHTML;
        
        // Show loading
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        confirmBtn.disabled = true;
        
        try {
            // Send reservation to backend
            const response = await fetch('https://your-backend-url.onrender.com/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: details.name,
                    email: details.email,
                    phone: details.phone,
                    guests: details.guests,
                    date: details.date,
                    time: details.time,
                    message: details.message
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to create reservation');
            }
            
            const result = await response.json();
            
            // Close modal
            this.closeModal(modal);
            
            // Show success notification
            this.showSuccessNotification(details);
            
            // Reset form
            this.form.reset();
            
            console.log('Reservation created:', result);
            
        } catch (error) {
            console.error('Error submitting reservation:', error);
            
            // Reset button
            confirmBtn.innerHTML = originalHTML;
            confirmBtn.disabled = false;
            
            // Show error notification
            this.showNotification('Failed to create reservation. Please try again.', 'error');
        }
    }
    
    showSuccessNotification(details) {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="success-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="success-text">
                    <h3>🎉 Reservation Confirmed!</h3>
                    <p><strong>Thank you, ${details.name}!</strong></p>
                    <p>Your table for ${details.guests} ${details.guests === '1' ? 'person' : 'people'} on <strong>${details.date}</strong> at <strong>${details.time}</strong> has been reserved.</p>
                    <p class="success-subtext">A confirmation email has been sent to <strong>${details.email}</strong></p>
                </div>
            </div>
            <button class="close-notification" aria-label="Close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Styles
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            z-index: 99999;
            max-width: 500px;
            width: 90%;
            animation: successPop 0.5s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Close button
        const closeBtn = notification.querySelector('.close-notification');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'successPop 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto close after 8 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'successPop 0.3s ease reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 8000);
    }
    
    showInfo(message) {
        const info = document.createElement('div');
        info.className = 'info-message';
        info.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>${message}</span>
        `;
        
        info.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #3498db;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 9999;
            max-width: 400px;
            animation: slideInRight 0.5s ease;
        `;
        
        document.body.appendChild(info);
        
        setTimeout(() => {
            info.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => info.remove(), 500);
        }, 5000);
    }
    
    showNotification(message, type = 'error') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'error' ? '#e74c3c' : '#10b981'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 99999;
            animation: slideInRight 0.5s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }
    
    addModalStyles() {
        if (document.getElementById('modal-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .reservation-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 99999;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .modal-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.9);
                background: white;
                border-radius: 20px;
                max-width: 600px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                opacity: 0;
                transition: all 0.3s ease;
            }
            
            .modal-header {
                text-align: center;
                padding: 40px 30px 30px;
                border-bottom: 2px solid #f0f0f0;
            }
            
            .modal-icon {
                width: 80px;
                height: 80px;
                margin: 0 auto 20px;
                background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 40px;
                color: white;
                animation: iconPulse 2s infinite;
            }
            
            @keyframes iconPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            .modal-header h2 {
                font-family: 'Playfair Display', serif;
                font-size: 28px;
                color: #1a1a2e;
                margin: 0 0 10px 0;
            }
            
            .modal-header p {
                color: #666;
                font-size: 14px;
            }
            
            .modal-body {
                padding: 30px;
            }
            
            .reservation-summary {
                display: grid;
                gap: 20px;
            }
            
            .summary-item {
                display: grid;
                grid-template-columns: 40px 1fr;
                gap: 15px;
                align-items: start;
            }
            
            .summary-item.full-width {
                grid-column: 1 / -1;
            }
            
            .summary-item i {
                width: 40px;
                height: 40px;
                background: #f8f9fa;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ff6b35;
                font-size: 16px;
            }
            
            .summary-item div {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .summary-item strong {
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #999;
            }
            
            .summary-item span {
                font-size: 16px;
                color: #1a1a2e;
            }
            
            .modal-footer {
                padding: 20px 30px;
                border-top: 2px solid #f0f0f0;
                display: flex;
                gap: 15px;
                justify-content: flex-end;
            }
            
            .modal-footer .btn {
                min-width: 150px;
            }
            
            .success-content {
                display: flex;
                gap: 20px;
                align-items: start;
            }
            
            .success-icon {
                flex-shrink: 0;
                width: 60px;
                height: 60px;
                background: #10b981;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 30px;
                color: white;
                animation: successCheck 0.5s ease;
            }
            
            @keyframes successCheck {
                0% { transform: scale(0); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
            
            .success-text h3 {
                font-family: 'Playfair Display', serif;
                font-size: 24px;
                color: #1a1a2e;
                margin: 0 0 10px 0;
            }
            
            .success-text p {
                margin: 0 0 8px 0;
                color: #666;
                line-height: 1.6;
            }
            
            .success-subtext {
                font-size: 14px !important;
                color: #999 !important;
            }
            
            .close-notification {
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                color: #999;
                font-size: 20px;
                cursor: pointer;
                transition: color 0.3s ease;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .close-notification:hover {
                color: #333;
            }
            
            @keyframes successPop {
                0% {
                    transform: translate(-50%, -50%) scale(0.5);
                    opacity: 0;
                }
                100% {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
            }
            
            @media (max-width: 768px) {
                .modal-content {
                    width: 95%;
                    max-height: 95vh;
                }
                
                .modal-header {
                    padding: 30px 20px 20px;
                }
                
                .modal-body {
                    padding: 20px;
                }
                
                .modal-footer {
                    flex-direction: column;
                    padding: 15px 20px;
                }
                
                .modal-footer .btn {
                    width: 100%;
                }
                
                .success-content {
                    flex-direction: column;
                    text-align: center;
                }
                
                .success-icon {
                    margin: 0 auto;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Initialize Reservation System
const reservationSystem = new ReservationSystem('#reservationForm');

console.log('✅ Reservation system loaded successfully!');