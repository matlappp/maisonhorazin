const watches = [
    { id: 1, brand: 'Rolex', model: 'Submariner Date', ref: '126610LN', price: 14500, condition: 'Unworn', available: true, year: 2024, image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&h=600&fit=crop' },
    { id: 2, brand: 'Patek Philippe', model: 'Nautilus', ref: '5711/1A-010', price: 89000, condition: 'Pre-owned', available: true, year: 2021, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=600&fit=crop' },
    { id: 3, brand: 'Audemars Piguet', model: 'Royal Oak', ref: '15500ST', price: 42000, condition: 'Unworn', available: true, year: 2023, image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&h=600&fit=crop' },
    { id: 4, brand: 'Omega', model: 'Speedmaster Moonwatch', ref: '310.30.42.50.01.001', price: 7200, condition: 'Neuf', available: true, year: 2024, image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=600&fit=crop' },
    { id: 5, brand: 'Rolex', model: 'Daytona', ref: '116500LN', price: 32000, condition: 'Pre-owned', available: false, year: 2022, image: 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=600&h=600&fit=crop' },
    { id: 6, brand: 'Cartier', model: 'Santos de Cartier', ref: 'WSSA0018', price: 8900, condition: 'Neuf', available: true, year: 2024, image: 'https://images.unsplash.com/photo-1639037687665-158e5476cd09?w=600&h=600&fit=crop' },
];

const testimonials = [
    { name: 'Marc D.', location: 'Paris', text: 'Un service exceptionnel. Didier a trouvé ma Submariner en moins de deux semaines. Transaction parfaite.', rating: 5 },
    { name: 'Sophie L.', location: 'Genève', text: 'Enfin une maison qui comprend ce que veulent les collectionneurs. Transparence totale et accompagnement personnalisé.', rating: 5 },
    { name: 'Thomas R.', location: 'Montréal', text: 'Ma première Patek Philippe grâce à Maison Horazin. Une expérience inoubliable du début à la fin.', rating: 5 },
];

function formatPrice(price) {
    return new Intl.NumberFormat('fr-CA', { 
        style: 'currency', 
        currency: 'CAD', 
        minimumFractionDigits: 0 
    }).format(price);
}

function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '');
    return page || 'index';
}

function renderWatchCard(watch, showActions = false) {
    const reservedBadge = !watch.available ? '<div class="watch-badge reserved">Réservée</div>' : '';
    const conditionBadge = watch.available ? `<div class="watch-badge">${watch.condition}</div>` : '';
    
    const actions = showActions ? `
        <div class="watch-actions">
            <button class="btn btn-primary" onclick="openChat()">Demander une offre</button>
        </div>
    ` : '';

    return `
        <div class="watch-card">
            <div class="watch-image">
                <img src="${watch.image}" alt="${watch.brand} ${watch.model}" loading="lazy">
                ${reservedBadge}
                ${conditionBadge}
            </div>
            <div class="watch-info">
                <div class="watch-brand">${watch.brand}</div>
                <div class="watch-model">${watch.model}</div>
                <div class="watch-ref">Réf. ${watch.ref} · ${watch.year}</div>
                <div class="watch-footer">
                    <span class="watch-price">${formatPrice(watch.price)}</span>
                    <span class="watch-condition">${watch.condition}</span>
                </div>
                ${actions}
            </div>
        </div>
    `;
}

function renderFeaturedWatches() {
    const container = document.getElementById('featuredWatches');
    if (container) {
        container.innerHTML = watches.slice(0, 3).map(w => renderWatchCard(w)).join('');
    }
}

function renderBoutiqueWatches(filteredWatches = watches) {
    const container = document.getElementById('boutiqueWatches');
    if (container) {
        if (filteredWatches.length > 0) {
            container.innerHTML = filteredWatches.map(w => renderWatchCard(w, true)).join('');
        } else {
            container.innerHTML = '<p class="no-results">Aucune montre ne correspond à vos critères.</p>';
        }
    }
}

function filterWatches() {
    const brand = document.getElementById('filterBrand')?.value || '';
    const price = document.getElementById('filterPrice')?.value || '';
    const condition = document.getElementById('filterCondition')?.value || '';
    const available = document.getElementById('filterAvailable')?.value || '';

    const filtered = watches.filter(watch => {
        if (brand && watch.brand !== brand) return false;
        if (condition && watch.condition !== condition) return false;
        if (available === 'available' && !watch.available) return false;
        if (available === 'reserved' && watch.available) return false;
        if (price) {
            if (price === 'under10' && watch.price >= 10000) return false;
            if (price === '10to30' && (watch.price < 10000 || watch.price >= 30000)) return false;
            if (price === '30to60' && (watch.price < 30000 || watch.price >= 60000)) return false;
            if (price === 'over60' && watch.price < 60000) return false;
        }
        return true;
    });

    renderBoutiqueWatches(filtered);
}

function renderTestimonial(testimonial) {
    const stars = Array(testimonial.rating).fill('<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>').join('');
    
    return `
        <div class="testimonial-card">
            <div class="testimonial-stars">${stars}</div>
            <p class="testimonial-text">${testimonial.text}</p>
            <div class="testimonial-author">
                <div class="testimonial-avatar">${testimonial.name[0]}</div>
                <div>
                    <div class="testimonial-name">${testimonial.name}</div>
                    <div class="testimonial-location">${testimonial.location}</div>
                </div>
            </div>
        </div>
    `;
}

function renderTestimonials() {
    const container = document.getElementById('testimonials');
    if (container) {
        container.innerHTML = testimonials.map(renderTestimonial).join('');
    }
}

function setActiveNavLink() {
    const currentPage = getCurrentPage();
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('data-page');
        if (linkPage === currentPage || (currentPage === 'index' && linkPage === 'index')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function openMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.classList.remove('open');
        document.body.style.overflow = '';
    }
}

function openChat() {
    const chatWindow = document.getElementById('chatWindow');
    const chatBtn = document.getElementById('chatBtn');
    if (chatWindow && chatBtn) {
        chatWindow.classList.add('open');
        chatBtn.classList.add('hidden');
    }
}

function closeChat() {
    const chatWindow = document.getElementById('chatWindow');
    const chatBtn = document.getElementById('chatBtn');
    if (chatWindow && chatBtn) {
        chatWindow.classList.remove('open');
        chatBtn.classList.remove('hidden');
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input?.value.trim();
    
    if (message) {
        const messagesContainer = document.getElementById('chatMessages');
        
        messagesContainer.innerHTML += `<div class="chat-message from-user">${message}</div>`;
        input.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        setTimeout(() => {
            messagesContainer.innerHTML += `<div class="chat-message from-didier">Merci pour votre message. Je vous réponds dans les plus brefs délais. En attendant, n'hésitez pas à explorer notre inventaire ou à me laisser vos coordonnées.</div>`;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);
    }
}

function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function submitSourcingForm(event) {
    event.preventDefault();
    alert('Merci pour votre demande de sourcing ! Didier vous contactera dans les plus brefs délais.');
    event.target.reset();
}

function submitContactForm(event) {
    event.preventDefault();
    alert('Merci pour votre message ! Nous vous répondrons sous 24 heures.');
    event.target.reset();
}

function handleScroll() {
    const nav = document.getElementById('nav');
    if (nav) {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setActiveNavLink();
    renderFeaturedWatches();
    renderBoutiqueWatches();
    renderTestimonials();
    window.addEventListener('scroll', handleScroll);
    handleScroll();
});
