// Data produk diamond ML
const diamondProducts = [
    {
        id: 1,
        name: "86 Diamond",
        diamond: "86",
        price: 20000,
        originalPrice: 25000,
        discount: "20%",
        popular: false
    },
    {
        id: 2,
        name: "172 Diamond",
        diamond: "172",
        price: 40000,
        originalPrice: 50000,
        discount: "20%",
        popular: false
    },
    {
        id: 3,
        name: "257 Diamond",
        diamond: "257",
        price: 60000,
        originalPrice: 75000,
        discount: "20%",
        popular: false
    },
    {
        id: 4,
        name: "344 Diamond",
        diamond: "344",
        price: 80000,
        originalPrice: 100000,
        discount: "20%",
        popular: true
    },
    {
        id: 5,
        name: "429 Diamond",
        diamond: "429",
        price: 100000,
        originalPrice: 125000,
        discount: "20%",
        popular: false
    },
    {
        id: 6,
        name: "514 Diamond",
        diamond: "514",
        price: 120000,
        originalPrice: 150000,
        discount: "20%",
        popular: false
    },
    {
        id: 7,
        name: "706 Diamond",
        diamond: "706",
        price: 150000,
        originalPrice: 187500,
        discount: "20%",
        popular: true
    },
    {
        id: 8,
        name: "Twilight Pass",
        diamond: "300 + Skin",
        price: 150000,
        originalPrice: 187500,
        discount: "20%",
        popular: true
    }
];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing ML Diamond Store...');
    initApp();
});

function initApp() {
    loadProducts();
    setupEventListeners();
    setupFAQ();
    console.log('App initialized successfully');
}

function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    console.log('Loading products...', productsGrid);
    
    if (!productsGrid) {
        console.error('Products grid not found!');
        return;
    }
    
    productsGrid.innerHTML = diamondProducts.map(product => `
        <div class="product-card ${product.popular ? 'popular' : ''}">
            ${product.popular ? '<div class="product-discount">POPULAR</div>' : ''}
            <div class="product-icon">
                <i class="fas fa-gem"></i>
            </div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-diamond">${product.diamond}</div>
            <div class="product-price">Rp ${formatPrice(product.price)}</div>
            ${product.originalPrice ? `<div class="product-original-price">Rp ${formatPrice(product.originalPrice)}</div>` : ''}
            <button class="buy-button" onclick="openCheckoutModal(${product.id})">
                <i class="fas fa-shopping-cart"></i>
                Beli Sekarang
            </button>
        </div>
    `).join('');
    
    console.log('Products loaded successfully');
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Menu toggle for mobile
    const menuToggle = document.getElementById('menuToggle');
    const navbar = document.querySelector('.navbar');
    
    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', function() {
            const isVisible = navbar.style.display === 'flex';
            navbar.style.display = isVisible ? 'none' : 'flex';
            console.log('Mobile menu toggled:', !isVisible);
        });
    }

    // Close checkout modal
    const closeCheckout = document.getElementById('closeCheckout');
    const checkoutModal = document.getElementById('checkoutModal');
    
    if (closeCheckout && checkoutModal) {
        closeCheckout.addEventListener('click', function() {
            checkoutModal.classList.remove('active');
            console.log('Checkout modal closed');
        });
    }

    // Checkout form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Checkout form submitted');
            processPayment();
        });
    }

    // Payment method change
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            console.log('Payment method changed to:', this.value);
            updatePaymentDetails(this.value);
        });
    });

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Pesan berhasil dikirim! Kami akan membalas dalam 1x24 jam.', 'success');
            this.reset();
            console.log('Contact form submitted');
        });
    }

    // Navigation smooth scroll
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                console.log('Navigated to:', targetId);
            }
        });
    });

    // Success modal buttons
    const trackOrderBtn = document.getElementById('trackOrderBtn');
    const backToHomeBtn = document.getElementById('backToHomeBtn');
    
    if (trackOrderBtn) {
        trackOrderBtn.addEventListener('click', function() {
            showNotification('Fitur pelacakan pesanan akan segera hadir!', 'info');
        });
    }
    
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }

    console.log('Event listeners setup completed');
}

function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    console.log('Setting up FAQ items:', faqItems.length);
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            console.log('FAQ item toggled');
        });
    });
}

// Global function to open checkout modal
function openCheckoutModal(productId) {
    console.log('Opening checkout modal for product:', productId);
    
    const product = diamondProducts.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    const modalOrderItem = document.getElementById('modalOrderItem');
    const modalTotalPrice = document.getElementById('modalTotalPrice');
    const checkoutModal = document.getElementById('checkoutModal');

    if (!modalOrderItem || !modalTotalPrice || !checkoutModal) {
        console.error('Modal elements not found');
        return;
    }

    modalOrderItem.innerHTML = `
        <div class="order-item">
            <div>
                <strong>${product.name}</strong>
                <p>${product.diamond} Diamond</p>
            </div>
            <div>Rp ${formatPrice(product.price)}</div>
        </div>
    `;
    
    modalTotalPrice.textContent = `Rp ${formatPrice(product.price)}`;
    checkoutModal.classList.add('active');
    
    console.log('Checkout modal opened for:', product.name);
}

function updatePaymentDetails(paymentMethod) {
    const paymentDetails = document.getElementById('paymentDetails');
    if (!paymentDetails) return;
    
    console.log('Updating payment details for:', paymentMethod);
    
    switch(paymentMethod) {
        case 'transfer':
            paymentDetails.innerHTML = `
                <div class="bank-details">
                    <h4>Transfer Bank</h4>
                    <div class="bank-account">
                        <strong>BCA - 1234567890</strong>
                        <p>a.n ML Diamond Store</p>
                    </div>
                    <div class="bank-account">
                        <strong>Mandiri - 0987654321</strong>
                        <p>a.n ML Diamond Store</p>
                    </div>
                    <div class="bank-account">
                        <strong>BNI - 1122334455</strong>
                        <p>a.n ML Diamond Store</p>
                    </div>
                </div>
            `;
            break;
        case 'ewallet':
            paymentDetails.innerHTML = `
                <div class="bank-details">
                    <h4>E-Wallet</h4>
                    <div class="bank-account">
                        <strong>Gopay - 081234567890</strong>
                        <p>a.n ML Diamond Store</p>
                    </div>
                    <div class="bank-account">
                        <strong>OVO - 081234567890</strong>
                        <p>a.n ML Diamond Store</p>
                    </div>
                    <div class="bank-account">
                        <strong>Dana - 081234567890</strong>
                        <p>a.n ML Diamond Store</p>
                    </div>
                </div>
            `;
            break;
        case 'qris':
            paymentDetails.innerHTML = `
                <div class="bank-details">
                    <h4>QRIS</h4>
                    <div style="text-align: center; padding: 1rem;">
                        <div style="background: #f0f0f0; padding: 1rem; border-radius: 8px; display: inline-block;">
                            <div style="width: 150px; height: 150px; background: #ddd; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
                                <span style="color: #666;">QR Code</span>
                            </div>
                            <p style="color: #666; font-size: 0.875rem;">Scan QR code di atas untuk pembayaran</p>
                        </div>
                    </div>
                </div>
            `;
            break;
        case 'alfamart':
            paymentDetails.innerHTML = `
                <div class="bank-details">
                    <h4>Alfamart</h4>
                    <div class="bank-account">
                        <p>Tunjukkan kode berikut ke kasir Alfamart:</p>
                        <div style="background: #ff6b6b; color: white; padding: 1rem; border-radius: 8px; text-align: center; margin-top: 1rem;">
                            <strong style="font-size: 1.5rem; letter-spacing: 2px;">ALFA${Math.random().toString(36).substr(2, 8).toUpperCase()}</strong>
                        </div>
                    </div>
                </div>
            `;
            break;
    }
}

function processPayment() {
    console.log('Processing payment...');
    
    // Get form data
    const mlId = document.getElementById('mlId')?.value;
    const serverId = document.getElementById('serverId')?.value;
    const nickname = document.getElementById('nickname')?.value;
    
    if (!mlId || !serverId || !nickname) {
        showNotification('Harap lengkapi semua data akun ML', 'error');
        return;
    }

    // Show loading
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) loadingOverlay.classList.add('active');

    // Simulate payment processing
    setTimeout(() => {
        // Hide loading
        if (loadingOverlay) loadingOverlay.classList.remove('active');
        
        // Hide checkout modal
        const checkoutModal = document.getElementById('checkoutModal');
        if (checkoutModal) checkoutModal.classList.remove('active');
        
        // Show success modal
        const successModal = document.getElementById('successModal');
        if (successModal) successModal.classList.add('active');
        
        // Show success notification
        showNotification('Pembayaran berhasil! Diamond akan segera diproses.', 'success');
        
        console.log('Payment processed successfully');
    }, 2000);
}

function closeSuccessModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) successModal.classList.remove('active');
}

function trackOrder() {
    showNotification('Fitur pelacakan order akan segera hadir!', 'info');
    closeSuccessModal();
}

function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    const backgroundColor = type === 'success' ? '#34c759' : 
                           type === 'error' ? '#ff3b30' : '#007aff';
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        z-index: 4000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        min-width: 300px;
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    const checkoutModal = document.getElementById('checkoutModal');
    const successModal = document.getElementById('successModal');
    
    if (e.target === checkoutModal) {
        checkoutModal.classList.remove('active');
    }
    
    if (e.target === successModal) {
        successModal.classList.remove('active');
    }
});