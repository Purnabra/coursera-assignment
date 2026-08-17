let bookings = [];

// DOM refs
const searchForm = document.getElementById('searchForm');
const destinationInput = document.getElementById('destination');
const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');
const guestsSelect = document.getElementById('guests');
const resultsGrid = document.getElementById('resultsGrid');
const resultsCount = document.getElementById('resultsCount');
const bookingsList = document.getElementById('bookingsList');
const header = document.getElementById('mainHeader');

// Mobile form refs
const mobileModal = document.getElementById('mobileFormModal');
const mobileBookBtn = document.getElementById('mobileBookBtn');
const closeMobileModal = document.getElementById('closeMobileModal');
const mobileSearchForm = document.getElementById('mobileSearchForm');
const mobileDestination = document.getElementById('mobileDestination');
const mobileCheckin = document.getElementById('mobileCheckin');
const mobileCheckout = document.getElementById('mobileCheckout');
const mobileGuests = document.getElementById('mobileGuests');

// Modal refs
const modal = document.getElementById('bookingModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalIcon = document.getElementById('modalIcon');
const modalPropertyName = document.getElementById('modalPropertyName');
const modalCheckin = document.getElementById('modalCheckin');
const modalCheckout = document.getElementById('modalCheckout');
const modalGuests = document.getElementById('modalGuests');
const modalLocation = document.getElementById('modalLocation');
const modalTotal = document.getElementById('modalTotal');
const confirmBtn = document.getElementById('confirmBookingBtn');

// Toast
const toastContainer = document.getElementById('toastContainer');

// ---------- HELPERS ----------
function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getNights(checkin, checkout) {
    if (!checkin || !checkout) return 1;
    const a = new Date(checkin + 'T00:00:00');
    const b = new Date(checkout + 'T00:00:00');
    const diff = (b - a) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 1;
}

function showToast(message, type = 'success') {
    const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    const colors = type === 'success' ? '#22c55e' : '#ef4444';
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
                    <i class="${icon}" style="color:${colors};"></i>
                    <div class="toast-content">
                        <strong>${type === 'success' ? 'Booking Confirmed!' : 'Oops!'}</strong>
                        <small>${message}</small>
                    </div>
                `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 4000);
}

// ---------- SYNC MOBILE FORM WITH DESKTOP ----------
function syncMobileForm() {
    mobileDestination.value = destinationInput.value;
    mobileCheckin.value = checkinInput.value;
    mobileCheckout.value = checkoutInput.value;
    mobileGuests.value = guestsSelect.value;
}

function syncDesktopForm() {
    destinationInput.value = mobileDestination.value;
    checkinInput.value = mobileCheckin.value;
    checkoutInput.value = mobileCheckout.value;
    guestsSelect.value = mobileGuests.value;
}

// ---------- RENDER RESULTS ----------
function renderResults(filter = '') {
    const destination = filter.toLowerCase().trim();
    let filtered = properties;
    if (destination) {
        filtered = properties.filter(p =>
            p.location.toLowerCase().includes(destination) ||
            p.name.toLowerCase().includes(destination)
        );
    }

    resultsCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'property' : 'properties'}`;

    if (filtered.length === 0) {
        resultsGrid.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-search"></i>
                            <h3>No properties found</h3>
                            <p>Try adjusting your destination or filters.</p>
                        </div>
                    `;
        return;
    }

    let html = '';
    filtered.forEach((p, idx) => {
        const isBooked = bookings.some(b => b.propertyId === p.id);
        const delay = (idx % 6) * 0.07;
        html += `
                        <div class="result-card" data-id="${p.id}" style="animation-delay: ${delay}s;">
                            <div class="card-img">
                                <img src="${p.image}" alt="${p.name}" loading="lazy" />
                                <span class="card-rating"><i class="fas fa-star"></i> ${p.rating}</span>
                                <div class="price-badge">$${p.pricePerNight} <small>/ night</small></div>
                            </div>
                            <div class="card-body">
                                <h3>${p.name}</h3>
                                <div class="location"><i class="fas fa-map-marker-alt"></i> ${p.location}</div>
                                <div class="amenities">
                                    ${p.amenities.map(a => `<span><i class="fas fa-check-circle"></i> ${a}</span>`).join('')}
                                </div>
                                <button class="btn-book ${isBooked ? 'booked' : ''}" data-id="${p.id}" ${isBooked ? 'disabled' : ''}>
                                    ${isBooked ? '<i class="fas fa-check"></i> Booked' : '<i class="fas fa-calendar-plus"></i> Book Now'}
                                </button>
                            </div>
                        </div>
                    `;
    });

    resultsGrid.innerHTML = html;

    document.querySelectorAll('.result-card .btn-book:not(.booked)').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const id = parseInt(this.dataset.id);
            const property = properties.find(p => p.id === id);
            if (property) openBookingModal(property);
        });
    });
}

// ---------- RENDER BOOKINGS ----------
function renderBookings() {
    if (bookings.length === 0) {
        bookingsList.innerHTML = `<div class="no-bookings">You have no upcoming bookings.</div>`;
        return;
    }

    let html = '';
    bookings.forEach((b, index) => {
        const prop = properties.find(p => p.id === b.propertyId);
        const name = prop ? prop.name : b.propertyName;
        html += `
                        <div class="booking-item">
                            <div class="info">
                                <strong>${name}</strong>
                                <small><i class="fas fa-calendar-alt"></i> ${formatDate(b.checkin)} — ${formatDate(b.checkout)} &nbsp;|&nbsp; ${b.guests} guest${b.guests > 1 ? 's' : ''}</small>
                            </div>
                            <div style="display:flex; align-items:center; gap:0.8rem; flex-wrap:wrap;">
                                <span class="status"><i class="fas fa-check-circle"></i> Confirmed</span>
                                <button class="cancel-btn" data-index="${index}"><i class="fas fa-times"></i> Cancel</button>
                            </div>
                        </div>
                    `;
    });
    bookingsList.innerHTML = html;

    document.querySelectorAll('.booking-item .cancel-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const idx = parseInt(this.dataset.index);
            if (confirm('Cancel this booking?')) {
                const cancelled = bookings[idx];
                bookings.splice(idx, 1);
                renderBookings();
                renderResults(destinationInput.value);
                showToast(`Cancelled booking for ${cancelled.propertyName}`, 'error');
            }
        });
    });
}

// ---------- MODAL ----------
let currentModalProperty = null;

function openBookingModal(property) {
    currentModalProperty = property;
    const checkin = checkinInput.value || new Date().toISOString().split('T')[0];
    const checkout = checkoutInput.value || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
    const guests = parseInt(guestsSelect.value) || 2;
    const nights = getNights(checkin, checkout);
    const total = property.pricePerNight * nights;

    modalIcon.textContent = '🏨';
    modalPropertyName.textContent = property.name;
    modalCheckin.textContent = formatDate(checkin);
    modalCheckout.textContent = formatDate(checkout);
    modalGuests.textContent = guests;
    modalLocation.textContent = property.location;
    modalTotal.textContent = `$${total}`;

    confirmBtn.dataset.propertyId = property.id;
    confirmBtn.dataset.checkin = checkin;
    confirmBtn.dataset.checkout = checkout;
    confirmBtn.dataset.guests = guests;
    confirmBtn.dataset.total = total;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentModalProperty = null;
}

// ---------- CONFIRM BOOKING ----------
function confirmBooking() {
    const btn = confirmBtn;
    const propertyId = parseInt(btn.dataset.propertyId);
    const checkin = btn.dataset.checkin;
    const checkout = btn.dataset.checkout;
    const guests = parseInt(btn.dataset.guests);
    const total = parseInt(btn.dataset.total);

    const property = properties.find(p => p.id === propertyId);
    if (!property) return;

    if (bookings.some(b => b.propertyId === propertyId)) {
        showToast('This property is already in your bookings.', 'error');
        closeModal();
        return;
    }

    bookings.push({
        propertyId: property.id,
        propertyName: property.name,
        checkin,
        checkout,
        guests,
        total,
        dateBooked: new Date().toISOString()
    });

    // renderBookings();
    renderResults();
    closeModal();

    const card = document.querySelector(`.result-card[data-id="${propertyId}"] .btn-book`);
    if (card) {
        card.innerHTML = '<i class="fas fa-check"></i> Booked';
        card.classList.add('booked');
        card.disabled = true;
    }

    showToast(`Successfully booked ${property.name}!`, 'success');
}

// ---------- SEARCH ----------
function handleSearch(e) {
    e.preventDefault();
    const destination = destinationInput.value;
    renderResults(destination);
    // Close mobile modal if open
    mobileModal.classList.remove('active');
    document.body.style.overflow = '';
    const btn = document.getElementById('searchBtn');
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => { btn.style.transform = ''; }, 200);
}

function handleMobileSearch(e) {
    e.preventDefault();
    syncDesktopForm();
    renderResults(mobileDestination.value);
    mobileModal.classList.remove('active');
    document.body.style.overflow = '';
    showToast('Searching for properties...', 'success');
}

// ---------- SET DEFAULT DATES ----------
function setDefaultDates() {
    const today = new Date();
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 3);
    const dateStr = today.toISOString().split('T')[0];
    const dateStrAfter = dayAfter.toISOString().split('T')[0];
    checkinInput.value = dateStr;
    checkoutInput.value = dateStrAfter;
    mobileCheckin.value = dateStr;
    mobileCheckout.value = dateStrAfter;
}

// ---------- HEADER SCROLL ----------
function handleScroll() {
    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// ============================================================
//  HERO CAROUSEL LOGIC
// ============================================================
function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('#heroIndicators .dot');
    let currentIndex = 0;
    let intervalId;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentIndex = index;
    }

    function nextSlide() {
        const next = (currentIndex + 1) % slides.length;
        showSlide(next);
    }

    function startCarousel() {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(nextSlide, 5000);
    }

    function stopCarousel() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', function () {
            stopCarousel();
            showSlide(index);
            startCarousel();
        });
    });

    const hero = document.getElementById('hero');
    hero.addEventListener('mouseenter', stopCarousel);
    hero.addEventListener('mouseleave', startCarousel);

    showSlide(0);
    startCarousel();
}

// ============================================================
//  REVIEWS CAROUSEL LOGIC
// ============================================================
const track = document.getElementById('reviewsTrack');
const dotsContainer = document.getElementById('reviewDots');
const prevBtn = document.getElementById('reviewPrev');
const nextBtn = document.getElementById('reviewNext');
let reviewIndex = 0;
let totalSlides = 0;
let autoScrollInterval = null;

function initReviewsCarousel() {
    const slides = track.querySelectorAll('.review-slide');
    totalSlides = slides.length;

    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.dataset.index = i;
        dot.addEventListener('click', () => goToReviewSlide(i));
        dotsContainer.appendChild(dot);
    }

    goToReviewSlide(0, false);
    startAutoScroll();

    prevBtn.addEventListener('click', () => {
        stopAutoScroll();
        goToReviewSlide((reviewIndex - 1 + totalSlides) % totalSlides);
        startAutoScroll();
    });
    nextBtn.addEventListener('click', () => {
        stopAutoScroll();
        goToReviewSlide((reviewIndex + 1) % totalSlides);
        startAutoScroll();
    });

    const wrapper = document.querySelector('.reviews-carousel-wrapper');
    wrapper.addEventListener('mouseenter', stopAutoScroll);
    wrapper.addEventListener('mouseleave', startAutoScroll);
}

function goToReviewSlide(index, animate = true) {
    reviewIndex = index;
    const offset = -index * 100;
    track.style.transition = animate ? 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none';
    track.style.transform = `translateX(${offset}%)`;

    document.querySelectorAll('#reviewDots .dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function startAutoScroll() {
    if (autoScrollInterval) return;
    autoScrollInterval = setInterval(() => {
        goToReviewSlide((reviewIndex + 1) % totalSlides);
    }, 5000);
}

function stopAutoScroll() {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
    }
}

// ============================================================
//  MOBILE MODAL CONTROLS
// ============================================================
function openMobileModal() {
    syncMobileForm();
    mobileModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileModalFn() {
    mobileModal.classList.remove('active');
    document.body.style.overflow = '';
}

// ---------- INIT ----------
function init() {
    setTimeout(() => {
        document.getElementById('loadingOverlay').classList.add('hide');
    }, 600);

    setDefaultDates();
    renderResults('');
    renderBookings();
    initHeroCarousel();
    initReviewsCarousel();

    // Desktop form
    searchForm.addEventListener('submit', handleSearch);

    // Mobile form
    mobileBookBtn.addEventListener('click', openMobileModal);
    closeMobileModal.addEventListener('click', closeMobileModalFn);
    mobileModal.addEventListener('click', function (e) {
        if (e.target === mobileModal) closeMobileModalFn();
    });
    mobileSearchForm.addEventListener('submit', handleMobileSearch);

    // Booking modal
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal();
            closeMobileModalFn();
        }
    });
    confirmBtn.addEventListener('click', confirmBooking);
    window.addEventListener('scroll', handleScroll);

    // Debounced search on desktop
    let debounceTimer;
    destinationInput.addEventListener('input', function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            renderResults(this.value);
        }, 300);
    });

    // Close mobile modal on escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeMobileModalFn();
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}