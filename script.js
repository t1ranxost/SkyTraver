// Данные о турах
const toursData = [
    {
        id: 1,
        title: 'Ждите загрузку...',
        image: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect fill="#87CEEB" width="400" height="120"/><rect fill="#FFE4B5" y="120" width="400" height="80"/><circle fill="#FFD700" cx="300" cy="40" r="25"/><polygon fill="#228B22" points="150,120 180,80 210,120"/></svg>'),
        duration: '7 дней',
        hotel: '5 звезд',
        price: '150 000 ₽',
        badge: 'Хит продаж'
    },
];

// ===== СИСТЕМА ВХОДА =====

// URL вашего CloudFlare Worker
const WORKER_URL = 'https://throbbing-limit-c007.roman-gonchukov.workers.dev/';

// Элементы DOM для системы входа
const loginButton = document.getElementById('loginButton');
const loginModal = document.getElementById('loginModal');
const closeModal = document.getElementById('closeModal');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const userProfile = document.getElementById('userProfile');
const userName = document.getElementById('userName');
const logoutButton = document.getElementById('logoutButton');
const togglePassword = document.getElementById('togglePassword');

// Открытие модального окна
loginButton.addEventListener('click', () => {
    loginModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Закрытие модального окна
closeModal.addEventListener('click', () => {
    loginModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    loginError.style.display = 'none';
    loginForm.reset();
});

// Закрытие по клику вне окна
loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        loginError.style.display = 'none';
        loginForm.reset();
    }
});

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && loginModal.classList.contains('active')) {
        loginModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        loginError.style.display = 'none';
        loginForm.reset();
    }
});

// Переключение видимости пароля
togglePassword.addEventListener('click', () => {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
});

// Обработка формы входа
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    const submitBtn = loginForm.querySelector('.login-btn');
    const btnText = submitBtn.querySelector('span:first-child');
    const btnLoader = submitBtn.querySelector('.login-loader');
    
    // Показываем загрузку
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    loginError.style.display = 'none';
    
    try {
        // Отправляем запрос к CloudFlare Worker
        const response = await fetch(`${WORKER_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Успешный вход
            if (remember) {
                localStorage.setItem('skytravel_auth', JSON.stringify({
                    login: login,
                    token: data.token,
                    timestamp: Date.now()
                }));
            } else {
                sessionStorage.setItem('skytravel_auth', JSON.stringify({
                    login: login,
                    token: data.token,
                    timestamp: Date.now()
                }));
            }
            
            // Показываем успех
            showLoginSuccess(login);
            
            // Закрываем модальное окно через секунду
            setTimeout(() => {
                loginModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                loginForm.reset();
            }, 1000);
            
        } else {
            // Ошибка входа
            showError(data.message || 'Неверный логин или пароль');
        }
    } catch (error) {
        // Если Worker недоступен, проверяем локально
        if (login === 'Svmans' && password === 'Sosdateli') {
            // Локальная проверка
            if (remember) {
                localStorage.setItem('skytravel_auth', JSON.stringify({
                    login: login,
                    token: 'local_token_' + Date.now(),
                    timestamp: Date.now()
                }));
            } else {
                sessionStorage.setItem('skytravel_auth', JSON.stringify({
                    login: login,
                    token: 'local_token_' + Date.now(),
                    timestamp: Date.now()
                }));
            }
            
            showLoginSuccess(login);
            
            setTimeout(() => {
                loginModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                loginForm.reset();
            }, 1000);
        } else {
            showError('Ошибка соединения с сервером');
        }
    } finally {
        // Восстанавливаем кнопку
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
});

// Функция показа ошибки
function showError(message) {
    loginError.textContent = message;
    loginError.style.display = 'block';
    loginError.className = 'login-error';
    
    // Автоматически скрываем через 3 секунды
    setTimeout(() => {
        loginError.style.display = 'none';
    }, 3000);
}

// Функция показа успешного входа
function showLoginSuccess(login) {
    loginError.textContent = '✅ Вход выполнен успешно!';
    loginError.style.display = 'block';
    loginError.className = 'login-success';
    
    // Обновляем интерфейс
    updateUIForLoggedUser(login);
}

// Функция обновления интерфейса для вошедшего пользователя
function updateUIForLoggedUser(login) {
    loginButton.style.display = 'none';
    userProfile.style.display = 'flex';
    userName.textContent = login;
}

// Функция выхода
function logout() {
    localStorage.removeItem('skytravel_auth');
    sessionStorage.removeItem('skytravel_auth');
    
    loginButton.style.display = 'flex';
    userProfile.style.display = 'none';
    
    // Показываем сообщение
    const message = document.createElement('div');
    message.className = 'logout-message';
    message.textContent = 'Вы вышли из системы';
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 10001;
        animation: slideInRight 0.3s ease;
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => message.remove(), 300);
    }, 2000);
}

// Обработчик кнопки выхода
logoutButton.addEventListener('click', logout);

// Проверка авторизации при загрузке
function checkAuth() {
    const authData = localStorage.getItem('skytravel_auth') || 
                    sessionStorage.getItem('skytravel_auth');
    
    if (authData) {
        try {
            const data = JSON.parse(authData);
            // Проверяем, не истекла ли сессия (24 часа)
            if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
                updateUIForLoggedUser(data.login);
                
                // Если это админ, добавляем кнопку управления
                if (data.login === 'Svmans') {
                    addAdminButton();
                }
            } else {
                // Сессия истекла
                localStorage.removeItem('skytravel_auth');
                sessionStorage.removeItem('skytravel_auth');
            }
        } catch (e) {
            localStorage.removeItem('skytravel_auth');
            sessionStorage.removeItem('skytravel_auth');
        }
    }
}

// Функция добавления кнопки админа
function addAdminButton() {
    // Проверяем, есть ли уже кнопка
    if (document.querySelector('.admin-access-btn')) {
        return;
    }
    
    const userProfile = document.getElementById('userProfile');
    if (userProfile) {
        const adminBtn = document.createElement('button');
        adminBtn.className = 'admin-access-btn';
        adminBtn.textContent = '⚙️ Управление';
        adminBtn.onclick = showAdminPanel;
        userProfile.appendChild(adminBtn);
    }
}

// Обновленная функция показа успешного входа
function showLoginSuccess(login) {
    const loginError = document.getElementById('loginError');
    if (loginError) {
        loginError.textContent = '✅ Вход выполнен успешно!';
        loginError.style.display = 'block';
        loginError.className = 'login-success';
    }
    
    updateUIForLoggedUser(login);
    
    // Если это админ, показываем кнопку управления
    if (login === 'Svmans') {
        addAdminButton();
    }
}

// Обновленная функция обновления интерфейса для вошедшего пользователя
function updateUIForLoggedUser(login) {
    const loginButton = document.getElementById('loginButton');
    const userProfile = document.getElementById('userProfile');
    const userName = document.getElementById('userName');
    
    if (loginButton) loginButton.style.display = 'none';
    if (userProfile) {
        userProfile.style.display = 'flex';
        // Очищаем профиль, кроме аватара и имени
        const avatar = userProfile.querySelector('.user-avatar');
        const nameElement = userProfile.querySelector('.user-name');
        const logoutBtn = userProfile.querySelector('.logout-btn');
        
        // Сохраняем только нужные элементы
        userProfile.innerHTML = '';
        if (avatar) userProfile.appendChild(avatar.cloneNode(true));
        if (nameElement) {
            const newName = nameElement.cloneNode(true);
            newName.textContent = login;
            userProfile.appendChild(newName);
        }
        if (logoutBtn) userProfile.appendChild(logoutBtn.cloneNode(true));
        
        // Обновляем имя пользователя
        if (userName) userName.textContent = login;
    }
}

// Запускаем проверку при загрузке
checkAuth();

// Анимации для сообщений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Основная инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализация...');
    
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
                    if (loader) loader.remove();
                    const particles = document.getElementById('particles');
                    if (particles) particles.remove();
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
    
    // ===== ПРОВЕРКА АВТОРИЗАЦИИ =====
    checkAuth();
    
    // ===== ИНИЦИАЛИЗАЦИЯ АДМИН-ПАНЕЛИ =====
    setTimeout(initAdminPanel, 1000);
    
    // ===== СИСТЕМА ВХОДА =====
    initLoginSystem();
    
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

// ===== GOOGLE SHEETS ИНТЕГРАЦИЯ =====
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxzX3Jq3mKGh9lRnvixowwEmlKNjIucgqZjpNr2kC9WyRAS2JYNqSjHCLjtH8C9jfEo_w/exec';

// Переменные для админ-панели
let isAdminMode = false;

// Функция загрузки туров из Google Sheets
async function loadToursFromGoogleSheets() {
    try {
        const url = `${GOOGLE_SCRIPT_URL}?action=getTours`;
        console.log('Загрузка туров из:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            mode: 'no-cors' // Важно для обхода CORS
        });
        
        const text = await response.text();
        console.log('Ответ сервера:', text);
        
        // Из-за no-cors ответ может быть пустым, пробуем другой подход
        if (!text || text.includes('Moved Temporarily')) {
            // Пробуем через JSONP или iframe
            await loadToursViaIframe();
            return;
        }
        
        const data = JSON.parse(text);
        
        if (data.success && data.tours && data.tours.length > 0) {
            toursData.length = 0;
            data.tours.forEach(tour => toursData.push(tour));
            displayTours();
            console.log('Туры загружены:', toursData.length);
        }
    } catch (error) {
        console.error('Ошибка загрузки из Google Sheets:', error);
        // Пробуем альтернативный метод
        await loadToursViaIframe();
    }
}

// Альтернативная загрузка через iframe
async function loadToursViaIframe() {
    try {
        const url = `${GOOGLE_SCRIPT_URL}?action=getTours`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success && data.tours && data.tours.length > 0) {
            toursData.length = 0;
            data.tours.forEach(tour => toursData.push(tour));
            displayTours();
            console.log('Туры загружены альтернативным методом');
        }
    } catch (error) {
        console.error('Ошибка альтернативной загрузки:', error);
        // Используем локальные данные
        console.log('Используем локальные данные');
        displayTours();
    }
}

// Функция для отправки данных в Google Sheets
async function sendToGoogleSheets(action, data = {}) {
    try {
        let url = `${GOOGLE_SCRIPT_URL}?action=${action}`;
        
        if (action === 'addTour' || action === 'updateTour') {
            url += `&data=${encodeURIComponent(JSON.stringify(data))}`;
        } else if (action === 'deleteTour') {
            url += `&id=${data.id}`;
        }
        
        console.log('Отправка запроса:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });
        
        const result = await response.json();
        console.log('Результат:', result);
        
        if (result.success) {
            await loadToursFromGoogleSheets();
            return true;
        } else {
            console.error('Ошибка сервера:', result.error);
            return false;
        }
    } catch (error) {
        console.error('Ошибка отправки:', error);
        
        // Если запрос не удался, но данные валидны, сохраняем локально
        if (action === 'addTour' && data.title) {
            const newId = Date.now().toString();
            data.id = newId;
            toursData.push(data);
            displayTours();
            renderAdminToursList();
            console.log('Тур добавлен локально');
            return true;
        }
        
        if (action === 'updateTour' && data.id) {
            const index = toursData.findIndex(t => t.id === data.id);
            if (index !== -1) {
                toursData[index] = data;
                displayTours();
                renderAdminToursList();
                console.log('Тур обновлен локально');
                return true;
            }
        }
        
        if (action === 'deleteTour' && data.id) {
            const index = toursData.findIndex(t => t.id === data.id);
            if (index !== -1) {
                toursData.splice(index, 1);
                displayTours();
                renderAdminToursList();
                console.log('Тур удален локально');
                return true;
            }
        }
        
        return false;
    }
}

// Функция добавления тура
async function addTourToGoogleSheets(tour) {
    return await sendToGoogleSheets('addTour', tour);
}

// Функция обновления тура
async function updateTourInGoogleSheets(tour) {
    return await sendToGoogleSheets('updateTour', tour);
}

// Функция удаления тура
async function deleteTourFromGoogleSheets(id) {
    return await sendToGoogleSheets('deleteTour', { id: id });
}

// Функция открытия админ-панели
function showAdminPanel() {
    const panel = document.getElementById('adminPanel');
    if (panel) {
        panel.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        renderAdminToursList();
    }
}

// Функция скрытия админ-панели
function hideAdminPanel() {
    const panel = document.getElementById('adminPanel');
    if (panel) {
        panel.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Отрисовка списка туров в админ-панели
function renderAdminToursList() {
    const toursTable = document.getElementById('toursTable');
    if (!toursTable) return;
    
    toursTable.innerHTML = toursData.map(tour => `
        <div class="tour-admin-item">
            <div class="tour-admin-info">
                <h4>${tour.title}</h4>
                <p>⏱️ ${tour.duration} | 🏨 ${tour.hotel}</p>
                <p>💰 ${tour.price} | 🏷️ ${tour.badge}</p>
            </div>
            <div class="tour-admin-actions">
                <button class="edit-tour-btn" onclick="editTour('${tour.id}')">✏️</button>
                <button class="delete-tour-btn" onclick="deleteTour('${tour.id}')">🗑️</button>
            </div>
        </div>
    `).join('');
}

// Редактирование тура
function editTour(id) {
    const tour = toursData.find(t => t.id === id);
    if (!tour) return;
    
    document.getElementById('editTourId').value = tour.id;
    document.getElementById('editTitle').value = tour.title;
    document.getElementById('editDuration').value = tour.duration;
    document.getElementById('editHotel').value = tour.hotel;
    document.getElementById('editPrice').value = tour.price;
    document.getElementById('editBadge').value = tour.badge;
    
    // Устанавливаем изображение
    currentTourImage = tour.image || '';
    document.getElementById('editImage').value = tour.image || '';
    updateImagePreview(tour.image);
    
    document.getElementById('formTitle').textContent = 'Редактирование тура';
    document.getElementById('tourEditForm').style.display = 'block';
}

// Удаление тура
async function deleteTour(id) {
    if (confirm('Вы уверены, что хотите удалить этот тур?')) {
        const success = await deleteTourFromGoogleSheets(id);
        if (!success) {
            alert('Не удалось удалить тур на сервере, но он удален локально');
        }
    }
}

// Инициализация админ-панели после загрузки DOM
function initAdminPanel() {
    console.log('Инициализация админ-панели');
    
    // Загружаем туры из Google Sheets
    loadToursFromGoogleSheets();
    
    // Обработчик для кнопки закрытия админ-панели
    const closeBtn = document.getElementById('closeAdminPanel');
    if (closeBtn) {
        closeBtn.addEventListener('click', hideAdminPanel);
    }
    
    // Обработчик для кнопки добавления тура
const addBtn = document.getElementById('addNewTourBtn');
if (addBtn) {
    addBtn.addEventListener('click', function() {
        document.getElementById('editTourId').value = '';
        document.getElementById('editTitle').value = '';
        document.getElementById('editDuration').value = '';
        document.getElementById('editHotel').value = '';
        document.getElementById('editPrice').value = '';
        document.getElementById('editBadge').value = '';
        
        // Очищаем изображение
        clearImageForm();
        
        document.getElementById('formTitle').textContent = 'Добавление нового тура';
        document.getElementById('tourEditForm').style.display = 'block';
    });
}
    
    // Обработчик для кнопки отмены
    const cancelBtn = document.getElementById('cancelEditBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            document.getElementById('tourEditForm').style.display = 'none';
        });
    }
    
    // Обработчик для сохранения тура
    const saveBtn = document.getElementById('saveTourBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', async function() {
            const id = document.getElementById('editTourId').value;
            // В функции сохранения тура измените создание объекта tour:
const tour = {
    id: id || Date.now().toString(),
    title: title,
    image: currentTourImage || document.getElementById('editImage').value || 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect fill="#87CEEB" width="400" height="120"/><rect fill="#FFE4B5" y="120" width="400" height="80"/></svg>'),
    duration: document.getElementById('editDuration').value.trim() || '7 дней',
    hotel: document.getElementById('editHotel').value.trim() || '5 звезд',
    price: price,
    badge: document.getElementById('editBadge').value.trim() || 'Новинка'
};
            
            if (!tour.title || !tour.price) {
                alert('Заполните обязательные поля: название и цена');
                return;
            }
            
            let success;
            if (id) {
                success = await updateTourInGoogleSheets(tour);
            } else {
                success = await addTourToGoogleSheets(tour);
            }
            
            if (success) {
                document.getElementById('tourEditForm').style.display = 'none';
                renderAdminToursList();
                alert('Тур успешно сохранен!');
            } else {
                alert('Тур сохранен локально. Синхронизация с Google Sheets временно недоступна.');
            }
        });
    }
    
    // Закрытие админ-панели по клику вне её
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        adminPanel.addEventListener('click', function(e) {
            if (e.target === this) hideAdminPanel();
        });
    }
}

// Запуск инициализации
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initAdminPanel, 1000);
});

// Инициализация системы входа
function initLoginSystem() {
    const loginButton = document.getElementById('loginButton');
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeModal');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const logoutButton = document.getElementById('logoutButton');
    const togglePassword = document.getElementById('togglePassword');
    
    // Открытие модального окна
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            if (loginModal) {
                loginModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }
    
    // Закрытие модального окна
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (loginModal) {
                loginModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                if (loginError) loginError.style.display = 'none';
                if (loginForm) loginForm.reset();
            }
        });
    }
    
    // Закрытие по клику вне окна
    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                if (loginError) loginError.style.display = 'none';
                if (loginForm) loginForm.reset();
            }
        });
    }
    
    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && loginModal && loginModal.classList.contains('active')) {
            loginModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            if (loginError) loginError.style.display = 'none';
            if (loginForm) loginForm.reset();
        }
    });
    
    // Переключение видимости пароля
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const passwordInput = document.getElementById('password');
            if (passwordInput) {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                togglePassword.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
            }
        });
    }
    
    // Обработка формы входа
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const login = document.getElementById('login').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            const submitBtn = loginForm.querySelector('.login-btn');
            
            if (!submitBtn) return;
            
            const btnText = submitBtn.querySelector('span:first-child');
            const btnLoader = submitBtn.querySelector('.login-loader');
            
            // Показываем загрузку
            submitBtn.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoader) btnLoader.style.display = 'inline-block';
            if (loginError) loginError.style.display = 'none';
            
            // Имитация запроса
            setTimeout(() => {
                if (login === 'Svmans' && password === 'Sosdateli') {
                    // Успешный вход
                    if (remember) {
                        localStorage.setItem('skytravel_auth', JSON.stringify({
                            login: login,
                            timestamp: Date.now()
                        }));
                    } else {
                        sessionStorage.setItem('skytravel_auth', JSON.stringify({
                            login: login,
                            timestamp: Date.now()
                        }));
                    }
                    
                    showLoginSuccess(login);
                    
                    setTimeout(() => {
                        if (loginModal) {
                            loginModal.classList.remove('active');
                            document.body.style.overflow = 'auto';
                        }
                        if (loginForm) loginForm.reset();
                    }, 1000);
                    
                } else {
                    // Ошибка входа
                    if (loginError) {
                        loginError.textContent = '❌ Неверный логин или пароль';
                        loginError.style.display = 'block';
                        loginError.className = 'login-error';
                    }
                }
                
                // Восстанавливаем кнопку
                submitBtn.disabled = false;
                if (btnText) btnText.style.display = 'inline';
                if (btnLoader) btnLoader.style.display = 'none';
            }, 1000);
        });
    }
    
    // Обработчик выхода
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
}  

// ===== РАБОТА С ИЗОБРАЖЕНИЯМИ =====

// Текущее изображение тура
let currentTourImage = '';

// Переключение вкладок загрузки изображения
function switchImageTab(tab) {
    // Обновляем активную вкладку
    document.querySelectorAll('.image-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    // Скрываем все содержимое вкладок
    document.querySelectorAll('.image-tab-content').forEach(c => c.style.display = 'none');
    
    // Показываем нужную вкладку
    const tabMap = {
        'url': 'imageUrlTab',
        'file': 'imageFileTab',
        'preset': 'imagePresetTab'
    };
    
    const tabId = tabMap[tab];
    if (tabId) {
        document.getElementById(tabId).style.display = 'block';
    }
}

// Загрузка изображения по URL
function loadImageFromUrl() {
    const url = document.getElementById('editImageUrl').value.trim();
    if (!url) {
        alert('Введите ссылку на изображение');
        return;
    }
    
    // Проверяем, что это изображение
    const img = new Image();
    img.onload = function() {
        currentTourImage = url;
        document.getElementById('editImage').value = url;
        updateImagePreview(url);
    };
    img.onerror = function() {
        alert('Не удалось загрузить изображение. Проверьте ссылку.');
    };
    img.src = url;
}

// Загрузка изображения из файла
function loadImageFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Проверка размера (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Файл слишком большой. Максимальный размер 5MB');
        return;
    }
    
    // Проверка типа файла
    if (!file.type.match('image.*')) {
        alert('Выберите изображение (JPG, PNG, GIF)');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        // Оптимизация изображения
        optimizeImage(e.target.result, function(optimizedImage) {
            currentTourImage = optimizedImage;
            document.getElementById('editImage').value = optimizedImage;
            updateImagePreview(optimizedImage);
        });
    };
    reader.readAsDataURL(file);
}

// Оптимизация изображения (сжатие)
function optimizeImage(dataUrl, callback) {
    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Максимальные размеры
        const maxWidth = 800;
        const maxHeight = 600;
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
        }
        if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        // Сжатие JPEG с качеством 0.8
        const optimized = canvas.toDataURL('image/jpeg', 0.8);
        callback(optimized);
    };
    img.src = dataUrl;
}

// Выбор готового изображения
function selectPresetImage(type) {
    // Убираем выделение со всех
    document.querySelectorAll('.preset-image').forEach(p => p.classList.remove('selected'));
    // Добавляем выделение на выбранное
    event.target.closest('.preset-image').classList.add('selected');
    
    const presets = {
        beach: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect fill="#87CEEB" width="400" height="120"/><rect fill="#FFE4B5" y="120" width="400" height="80"/><circle fill="#FFD700" cx="300" cy="40" r="25"/><polygon fill="#228B22" points="150,120 180,80 210,120"/></svg>'),
        mountain: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect fill="#B0C4DE" width="400" height="100"/><rect fill="white" y="100" width="400" height="100"/><polygon fill="white" points="150,100 200,50 250,100"/><polygon fill="white" points="250,100 300,60 350,100"/></svg>'),
        city: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect fill="#87CEEB" width="400" height="100"/><rect fill="#90EE90" y="100" width="400" height="100"/><rect fill="#A0522D" x="100" y="70" width="80" height="80"/><polygon fill="#FF6347" points="100,70 140,30 180,70"/></svg>'),
        cruise: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect fill="#4682B4" width="400" height="100"/><rect fill="#87CEEB" y="100" width="400" height="100"/><rect fill="white" x="250" y="40" width="80" height="40" rx="5"/><rect fill="#8B4513" x="270" y="20" width="15" height="20"/></svg>')
    };
    
    const imageUrl = presets[type];
    currentTourImage = imageUrl;
    document.getElementById('editImage').value = imageUrl;
    updateImagePreview(imageUrl);
}

// Обновление предпросмотра изображения
function updateImagePreview(imageUrl) {
    const preview = document.getElementById('imagePreview');
    if (imageUrl) {
        preview.innerHTML = `<img src="${imageUrl}" alt="Предпросмотр">`;
    } else {
        preview.innerHTML = '<span class="no-image">Нет изображения</span>';
    }
}

// Функция для очистки формы изображения
function clearImageForm() {
    currentTourImage = '';
    document.getElementById('editImage').value = '';
    document.getElementById('editImageUrl').value = '';
    document.getElementById('editImageFile').value = '';
    updateImagePreview('');
    document.querySelectorAll('.preset-image').forEach(p => p.classList.remove('selected'));
}
