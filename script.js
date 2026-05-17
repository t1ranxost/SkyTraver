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

// Функция для создания карточки тура
function createTourCard(tour) {
    const card = document.createElement('div');
    card.className = 'tour-card';
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
            <button class="book-btn" onclick="contactTelegram('${tour.title}', '${tour.price}')">
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
    toursData.forEach(tour => {
        const tourCard = createTourCard(tour);
        toursGrid.appendChild(tourCard);
    });
}

// Функция для связи через Telegram
function contactTelegram(tourTitle, tourPrice) {
    const message = encodeURIComponent(
        `Здравствуйте! Меня заинтересовал тур "${tourTitle}" за ${tourPrice}. Расскажите подробнее.`
    );
    const telegramUrl = `https://t.me/Svman?text=${message}`;
    window.open(telegramUrl, '_blank');
}

// Плавная прокрутка для навигации
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

// Анимация при загрузке страницы
window.addEventListener('load', () => {
    displayTours();
    
    // Анимация появления карточек
    const cards = document.querySelectorAll('.tour-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });
});

// Анимация при скролле
window.addEventListener('scroll', () => {
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

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    displayTours();
    console.log('SkyTravel - сайт готов к работе!');
    console.log('Связь через Telegram: @Svman');
});