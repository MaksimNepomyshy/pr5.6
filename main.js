const loginButton = document.querySelector('.button-login');
const authModal = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const loginInput = document.getElementById('login');
const loginError = document.getElementById('loginError');
const userName = document.querySelector('.user-name');
const buttonAuth = document.querySelector('.button-auth');
const buttonOut = document.querySelector('.button-out');
const loginForm = document.getElementById('logInForm');
const passwordInput = document.getElementById('password');
const passwordError = document.getElementById('passwordError');
const cartButton = document.getElementById('cart-button');
const searchInput = document.querySelector('.input-search'); // Отримуємо поле пошуку

let authModalIsOpen = false;

// Функція для відображення модального вікна авторизації
function showAuthModal() {
    authModal.style.display = 'block';
    authModalIsOpen = true;
    document.body.style.overflow = 'hidden'; // Приховуємо прокрутку
}

// Функція для закриття модального вікна авторизації
function closeAuthModal() {
    authModal.style.display = 'none';
    loginInput.style.borderColor = '';
    passwordInput.style.borderColor = '';
    loginError.style.display = 'none';
    passwordError.style.display = 'none';
    loginInput.value = '';
    passwordInput.value = '';
    authModalIsOpen = false;
    document.body.style.overflow = ''; // Повертаємо прокрутку
}

// Функція для авторизації користувача
function authorize(login) {
    closeAuthModal();
    localStorage.setItem('userName', login);
    userName.textContent = login;
    userName.style.display = 'inline';
    buttonAuth.style.display = 'none';
    buttonOut.style.display = 'inline';
    cartButton.style.display = 'inline'; // Відображаємо кошик після авторизації
}

// Функція для виходу з облікового запису
function logout() {
    localStorage.removeItem('userName');
    userName.textContent = '';
    userName.style.display = 'none';
    buttonAuth.style.display = 'inline';
    buttonOut.style.display = 'none';
    cartButton.style.display = 'none'; // Приховуємо кошик після виходу
}

// Функція для перевірки авторизації при завантаженні сторінки
function checkAuth() {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
        authorize(storedUserName);
    } else {
        cartButton.style.display = 'none'; // Приховуємо кошик, якщо користувач не авторизований
    }

}



// Обробник події кліку на кнопку "Війти"
loginButton.addEventListener('click', (event) => {
    event.preventDefault();

    const login = loginInput.value.trim();
    const password = passwordInput.value.trim();

    if (!login) {
        loginInput.style.borderColor = 'red';
        loginError.style.display = 'block';
    }

    if (!password) {
        passwordInput.style.borderColor = 'red';
        passwordError.style.display = 'block';
    }

    if (!login || !password) {
        return;
    }

    authorize(login);
});

// Обробники подій для кнопок "Війти", "Вийти" та закриття модального вікна
buttonAuth.addEventListener('click', showAuthModal);
buttonOut.addEventListener('click', logout);
closeAuth.addEventListener('click', closeAuthModal);

// Обробник кліків на window для закриття модального вікна
window.addEventListener('click', (event) => {
    if (authModalIsOpen && event.target === authModal) {
        closeAuthModal();
    }
});

// Функція для додавання карток ресторанів на сторінку
function renderRestaurants(restaurants) {
    const restaurantsContainer = document.querySelector('.cards-restaurants');
    restaurantsContainer.innerHTML = ''; // Очищаємо контейнер перед додаванням нових карток

    restaurants.forEach(restaurant => {
        const card = document.createElement('a');
        // Змінюємо посилання для передачі імені ресторану
        card.href = `restaurant.html?restaurant=${encodeURIComponent(restaurant.name)}`;
        card.classList.add('card', 'card-restaurant');

        card.innerHTML = `
            <img src="${restaurant.image}" alt="image" class="card-image" />
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title">${restaurant.name}</h3>
                    <span class="card-tag tag">${restaurant.time}</span>
                </div>
                <div class="card-info">
                    <div class="rating">${restaurant.rating}</div>
                    <div class="price">від ${restaurant.price} ₴</div>
                    <div class="category">${restaurant.category}</div>
                </div>
            </div>
        `;
        restaurantsContainer.appendChild(card);
    });

    // Додаємо обробник подій після створення карток
    addRestaurantCardClickHandlers();
}

function addRestaurantCardClickHandlers() {
    const restaurantCards = document.querySelectorAll('.card-restaurant');
    restaurantCards.forEach(card => {
        card.addEventListener('click', (event) => {
            const storedUserName = localStorage.getItem('userName');
            if (!storedUserName) {
                // Якщо не авторизований, показуємо модальне вікно, але не переходимо на сторінку ресторану
                event.preventDefault();
                showAuthModal();
            }
            // Якщо авторизований, перехід на сторінку ресторану відбудеться завдяки href
        });
    });
}

// Функція для запиту даних з сервера (локально з JSON файлу)
async function fetchMenu(file) {
    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Помилка при отриманні меню:', error);
        return null; // Повертаємо null у випадку помилки
    }
}

// Функція для виведення карток меню
function renderMenu(menuItems) {
    const cardsMenu = document.querySelector('.cards-menu');
    cardsMenu.innerHTML = ''; // Очищаємо попереднє меню

    if (!menuItems || menuItems.length === 0) {
        cardsMenu.innerHTML = '<p>Меню наразі недоступне.</p>';
        return;
    }

    menuItems.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <img src="${item.image}" alt="image" class="card-image" />
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title card-title-reg">${item.name}</h3>
                </div>
                <div class="card-info">
                    <div class="ingredients">${item.description}</div>
                </div>
                <div class="card-buttons">
                    <button class="button button-primary button-add-cart">
                        <span class="button-card-text">У кошик</span>
                        <span class="button-cart-svg"></span>
                    </button>
                    <strong class="card-price-bold">${item.price} ₴</strong>
                </div>
            </div>
        `;
        cardsMenu.appendChild(card);
    });
}

// Функція для виведення інформації про ресторан на сторінці меню
function renderRestaurantInfo(restaurant) {
    const restaurantTitle = document.querySelector('.restaurant-title');
    const rating = document.querySelector('.card-info .rating');
    const price = document.querySelector('.card-info .price');
    const category = document.querySelector('.card-info .category');

    if (restaurantTitle) restaurantTitle.textContent = restaurant.name;
    if (rating) rating.textContent = restaurant.stars; // Використовуємо stars з partners.json
    if (price) price.textContent = `От ${restaurant.price} ₴`; // Використовуємо price з partners.json
    if (category) category.textContent = restaurant.kitchen; // Використовуємо kitchen з partners.json
}

// Код для сторінки restaurant.html
document.addEventListener('DOMContentLoaded', async () => {
    const restaurantTitleElement = document.querySelector('.restaurant-title');
    if (restaurantTitleElement) {
        restaurantTitleElement.textContent = 'Завантаження...'; // Показуємо завантаження
    }

    // Отримуємо ім'я ресторану з URL
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantName = urlParams.get('restaurant');

    console.log('Отримано ім\'я ресторану з URL:', restaurantName);

    if (restaurantName) {
        try {
            // Знаходимо інформацію про ресторан у масиві restaurants (з db.js)
            const selectedRestaurant = restaurants.find(r => r.name === restaurantName);

            console.log('Знайдено ресторан в db.js:', selectedRestaurant);

            if (selectedRestaurant) {
                // Отримуємо дані про ресторан з partners.json для більш повної інформації
                const partnersResponse = await fetch('partners.json');
                if (!partnersResponse.ok) {
                    throw new Error(`HTTP error! status: ${partnersResponse.status}`);
                }
                const partners = await partnersResponse.json();
                const detailedRestaurantInfo = partners.find(p => p.name === restaurantName);

                console.log('Знайдено інформацію про ресторан в partners.json:', detailedRestaurantInfo);

                if (detailedRestaurantInfo) {
                    renderRestaurantInfo(detailedRestaurantInfo);

                    // Отримуємо меню ресторану
                    const menuData = await fetchMenu(detailedRestaurantInfo.products);
                    console.log('Отримано дані меню:', menuData);
                    renderMenu(menuData);
                } else {
                    console.error(`Деталі ресторану не знайдено в partners.json для: ${restaurantName}`);
                    if (restaurantTitleElement) {
                        restaurantTitleElement.textContent = 'Інформацію про ресторан не знайдено.';
                    }
                }
            } else {
                console.error(`Ресторан не знайдено в db.js: ${restaurantName}`);
                if (restaurantTitleElement) {
                    restaurantTitleElement.textContent = 'Ресторан не знайдено.';
                }
            }
        } catch (error) {
            console.error('Помилка при отриманні даних:', error);
            if (restaurantTitleElement) {
                restaurantTitleElement.textContent = 'Помилка завантаження даних.';
            }
        }
    } else {
        console.error('Ім\'я ресторану не передано в URL.');
        if (restaurantTitleElement) {
            restaurantTitleElement.textContent = 'Не вказано ресторан.';
        }
    }

    checkAuth(); // Перевіряємо авторизацію при завантаженні сторінки
});

// Код для сторінки index.html
if (document.querySelector('.cards-restaurants')) {
    document.addEventListener('DOMContentLoaded', () => {
        renderRestaurants(restaurants);
        checkAuth(); // Перевіряємо авторизацію при завантаженні сторінки
    });
}

searchInput.addEventListener('keydown', async function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();

        const searchText = this.value.trim().toLowerCase();

        if (!searchText) {
            this.style.borderColor = 'red';
            setTimeout(() => {
                this.style.borderColor = '';
            }, 1000);
            return;
        }

        // Визначаємо, на якій сторінці ми знаходимося
        const isRestaurantPage = !!document.querySelector('.restaurant-title');

        if (isRestaurantPage) {
            // Логіка для сторінки ресторану (restaurant.html)
            const restaurantName = new URLSearchParams(window.location.search).get('restaurant');
            
                try {
                    const selectedRestaurant = restaurants.find(r => r.name === restaurantName);
        
                    if (selectedRestaurant) {
                        const partners = await fetchPartners();  //функція  для отримання partners.json з обробкою помилок
                        const detailedRestaurantInfo = partners.find(p => p.name === restaurantName);
        
                        if (detailedRestaurantInfo) {
                            const menuData = await fetchMenu(detailedRestaurantInfo.products);
        
                            if (menuData) {
                                const filteredMenu = menuData.filter(item => {
                                  return item.name.toLowerCase().includes(searchText) || item.description.toLowerCase().includes(searchText);
                                });
                                renderMenu(filteredMenu);
                            } else {
                                renderMenuError("Помилка при отриманні меню.");
                            }
                        } else {
                             renderMenuError(`Ресторан ${restaurantName} не знайдений.`);
                           
                        }
                    } else {
                        renderMenuError(`Ресторан ${restaurantName} не знайдений.`);
                    }
                } catch (error) {
                    renderMenuError("Помилка при завантаженні даних.");
                    console.error('Помилка:', error);
                }

        } else {
            // Логіка для головної сторінки (index.html)
            const filteredRestaurants = restaurants.filter(restaurant => {
                return restaurant.name.toLowerCase().includes(searchText) || restaurant.category.toLowerCase().includes(searchText);
            });
            renderRestaurants(filteredRestaurants);
        }
    }
});


async function fetchPartners() {
    try {
        const response = await fetch('partners.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Помилка при отриманні partners.json:', error);
        return [];
    }
}

function renderMenuError(message) {
    const cardsMenu = document.querySelector('.cards-menu');
    cardsMenu.innerHTML = ''; // Очищаємо попереднє меню
    cardsMenu.innerHTML = `<p class="error-message">${message}</p>`;

}

function searchRestaurants(query) {
    const filteredRestaurants = restaurants.filter(restaurant => {
        return restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
               restaurant.category.toLowerCase().includes(query.toLowerCase());
    });
    renderRestaurants(filteredRestaurants);
}

// Функція для пошуку страв
async function searchDishes(query) {
    const results = [];
    for (const restaurant of restaurants) {
      const urlParams = new URLSearchParams();
      urlParams.set('restaurant', restaurant.name);

      const partnersResponse = await fetch('partners.json');
      const partners = await partnersResponse.json();
      const restaurantInfo = partners.find(p => p.name === restaurant.name);
      
      if(restaurantInfo) {
        const menu = await fetchMenu(restaurantInfo.products);
        if (menu) {
            const filteredMenu = menu.filter(dish =>
                dish.name.toLowerCase().includes(query.toLowerCase()) ||
                dish.description.toLowerCase().includes(query.toLowerCase())
            );
            filteredMenu.forEach(dish => {
                results.push({ ...dish, restaurant: restaurant.name });
            });
        }
      }
    }


    // Відображення результатів пошуку страв
    const menuContainer = document.querySelector('.cards-menu');
    if (menuContainer) { // Перевірка наявності контейнера меню
        renderMenu(results);
    }
}
searchInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query === '') {
            searchInput.style.borderColor = 'red';
            setTimeout(() => {
                searchInput.style.borderColor = '';
            }, 1000);
            return;
        }

        if(window.location.pathname.endsWith('index.html')) {
            searchRestaurants(query);
        } else if (window.location.pathname.endsWith('restaurant.html')) {
            await searchDishes(query);
        }

    }
});