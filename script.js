// Данные о турах
const toursData = [
    {
        id: 1,
        title: 'Райский отдых на Мальдивах',
        image: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect fill="#87CEEB" width="400" height="120"/><rect fill="#FFE4B5" y="120" width="400" height="80"/><circle fill="#FFD700" cx="300" cy="40" r="25"/><polygon fill="#228B22" points="150,120 180,80 210,120"/></svg>'),
        duration: '7 дней',
        hotel: '5 звезд',
        price: '150 000 ₽',
        badge: 'Хит продаж'
    },
    {
        id: 2,
        title: 'Европейские каникулы',
        image: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect fill="#87CEEB" width="400" height="100"/><rect fill="#90EE90" y="100" width="400" height="100"/><rect fill="#A0522D" x="100" y="70" width="80" height="80"/><polygon fill="#FF6347" points="100,70 140,30 180,70"/></svg>'),
        duration: '10 дней',
        hotel: '4 звезды',
        price: '85 000 ₽',
        badge: 'Популярное'
    },
    {
        id: 3,
        title: 'Экзотика Таиланда',
        image: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect fill="#FF8C00" width="400" height="80"/><rect fill="#87CEEB" y="80" width="400" height="120"/><polygon fill="#228B22" points="50,80 80,40 110,80"/><circle fill="#FFD700" cx="250" cy="50" r="30"/></svg>'),
        duration: '12 дней',
        hotel: '4 звезды',
        price: '120 000 ₽',
        badge: 'Новинка'
    },
    {
        id: 4,
        title: 'Горнолыжный Сочи',
        image: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect fill="#B0C4DE" width="400" height="100"/><rect fill="white" y="100" width="400" height="100"/><polygon fill="white" points="150,100 200,50 250,100"/><polygon fill="white" points="250,100 300,60 350,100"/></svg>'),
        duration: '7 дней',
        hotel: '5 звезд',
        price: '95 000 ₽',
        badge: 'Скидка 20%'
    },
    {
        id: 5,
        title: 'Отдых в Турции',
        image: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect fill="#1E90FF" width="400" height="120"/><rect fill="#FFE4B5" y="120" width="400" height="80"/><circle fill="#FFD700" cx="300" cy="50" r="35"/><polygon fill="#32CD32" points="120,120 150,90 180,120"/></svg>'),
        duration: '8 дней',
        hotel: '4 звезды',
        price: '65 000 ₽',
        badge: 'Доступный'
    },
    {
        id: 6,
        title: 'Круиз по Средиземному морю',
        image: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect fill="#4682B4" width="400" height="100"/><rect fill="#87CEEB" y="100" width="400" height="100"/><rect fill="white" x="250" y="40" width="80" height="40" rx="5"/><rect fill="#8B4513" x="270" y="20" width="15" height="20"/></svg>'),
        duration: '14 дней',
        hotel: '5 звезд',
        price: '200 000 ₽',
        badge: 'Премиум'
    }
];

// Основная инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== АНИМАЦИЯ ЗАГРУЗКИ =====
    const loader = document.querySelector('.loader-wrapper');
    const body = document.body;
    
    // Создаем частицы для фона
    createParticles();
    
    // Имитация загрузки
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 100) progress = 100;
        
        const progressBar = document.querySelector('.loading-progress');
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            
            // Скрываем загрузчик
            setTimeout(() => {
                if (loader) {
                    loader.classList.add('hidden');
                    body.classList.add('loaded');
                }
                
                // Удаляем загрузчик и частицы после анимации
                setTimeout(() => {
                    if (loader) {
                        loader.remove();
                    }
                    const particles = document.getElementById('particles');
                    if (particles) {
                        particles.remove();
                    }
                }, 1000);
            }, 500);
        }
    }, 400);
    
    // ===== ОТОБРАЖЕНИЕ ТУРОВ =====
    displayTours();
    
    // ===== НАСТРОЙКА АНИМАЦИЙ =====
    setupTourCardAnimations();
    setupButtonAnimations();
    setupSmoothScroll();
    
    console.log('SkyTravel - сайт готов к работе!');
    console.log('Связь через Telegram: @Svman');
});

// Функция создания частиц
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const colors = ['#0077be', '#00a8ff', '#005f99', '#b3e0ff'];
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 8 + 3;
        const startX = Math.random() * 100;
        const delay = Math.random() * 3;
        const duration = Math.random() * 3 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${startX}%;
            bottom: -10px;
            background: ${color};
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
            box-shadow: 0 0 ${size * 2}px ${color};
        `;
        
        particlesContainer.appendChild(particle);
    }
}

// Функция для создания карточки тура
function createTourCard(tour) {
    const card = document.createElement('div');
    card.className = 'tour-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease';
    
    card.innerHTML = `
        <div class="tour-image" style="background-image: url('${tour.image}')">
            <span class="tour-badge">${tour.badge}</span>
        </div>
        <div class="tour-info">
            <h3>${tour.title}</h3>
            <div class="tour-details">
                <span>⏱️ ${tour.duration}</span>
                <span>🏨 ${tour.hotel}</span>
            </div>
            <div class="tour-price">
                ${tour.price} <span>/чел.</span>
            </div>
            <button class="book-btn" data-tour="${tour.title}" data-price="${tour.price}">
                Забронировать
            </button>
        </div>
    `;
    return card;
}

// Функция для отображения всех туров
function displayTours() {
    const toursGrid = document.getElementById('toursGrid');
    if (!toursGrid) return;
    
    toursGrid.innerHTML = '';
    toursData.forEach((tour, index) => {
        const tourCard = createTourCard(tour);
        toursGrid.appendChild(tourCard);
        
        // Анимация появления карточек
        setTimeout(() => {
            tourCard.style.opacity = '1';
            tourCard.style.transform = 'translateY(0)';
        }, 100 * index);
    });
    
    // Назначаем обработчики для кнопок "Забронировать"
    setTimeout(() => {
        document.querySelectorAll('.book-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tourTitle = this.getAttribute('data-tour');
                const tourPrice = this.getAttribute('data-price');
                contactTelegram(tourTitle, tourPrice);
            });
        });
    }, 500);
}

// Функция для связи через Telegram
function contactTelegram(tourTitle, tourPrice) {
    const message = encodeURIComponent(
        `Здравствуйте! Меня заинтересовал тур "${tourTitle}" за ${tourPrice}. Расскажите подробнее.`
    );
    const telegramUrl = `https://t.me/Svman?text=${message}`;
    window.open(telegramUrl, '_blank');
}

// Настройка анимаций для карточек туров
function setupTourCardAnimations() {
    // Используем делегирование событий
    document.addEventListener('mouseover', function(e) {
        const card = e.target.closest('.tour-card');
        if (card) {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.transition = 'all 0.3s ease';
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        const card = e.target.closest('.tour-card');
        if (card) {
            card.style.transform = 'translateY(0) scale(1)';
        }
    });
}

// Настройка анимаций для кнопок
function setupButtonAnimations() {
    document.addEventListener('mouseover', function(e) {
        const btn = e.target.closest('.btn-primary, .telegram-btn, .telegram-contact-btn, .book-btn');
        if (btn) {
            btn.style.transform = 'translateY(-3px)';
            btn.style.boxShadow = '0 8px 25px rgba(0, 119, 190, 0.3)';
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        const btn = e.target.closest('.btn-primary, .telegram-btn, .telegram-contact-btn, .book-btn');
        if (btn) {
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = '';
        }
    });
    
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn-primary, .telegram-btn, .telegram-contact-btn');
        if (btn && !btn.classList.contains('book-btn')) {
            e.preventDefault();
            
            // Создаем волновой эффект
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            btn.appendChild(ripple);
            
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.style.width = ripple.style.height = `${Math.max(rect.width, rect.height)}px`;
            
            setTimeout(() => {
                ripple.remove();
                // Если это ссылка, переходим по ней
                if (btn.tagName === 'A' && btn.getAttribute('href')) {
                    window.open(btn.getAttribute('href'), btn.getAttribute('target') || '_self');
                }
            }, 600);
        }
    });
}

// Настройка плавной прокрутки
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Анимация при скролле для feature-карточек
window.addEventListener('scroll', function() {
    const features = document.querySelectorAll('.feature-card');
    features.forEach(feature => {
        const featureTop = feature.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (featureTop < windowHeight * 0.8) {
            feature.style.opacity = '1';
            feature.style.transform = 'translateY(0)';
        }
    });
});
