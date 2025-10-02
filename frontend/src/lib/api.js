// api.js
const BASE_URL = process.env.REACT_APP_API || 'http://localhost:8000';

/**
 * Получаем CSRF-токен из куки
 */
function getCsrfToken() {
  const match = document.cookie.match(/csrftoken=([\w-]+)/);
  return match ? match[1] : '';
}

/**
 * Обеспечиваем наличие CSRF токена через эндпоинт /csrf/
 */
async function ensureCsrf() {
  if (!getCsrfToken()) {
    await fetch(`${BASE_URL}/csrf/`, { method: 'GET', credentials: 'include' });
  }
}

/**
 * Универсальный fetch с CSRF и сессиями
 */
async function fetchWithCsrf(url, options = {}) {
  const csrf = getCsrfToken();
  options.headers = {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrf,
    ...options.headers
  };
  options.credentials = 'include'; // 🔑 важно для сессии
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ошибка запроса ${res.status}: ${text}`);
  }
  return res.json();
}


// -----------------
// Текущий пользователь
// -----------------
export async function fetchCurrentUser() {
  return fetchWithCsrf(`${BASE_URL}/accounts/me/`, { method: 'GET' });
}

// -----------------
// Аутентификация
// -----------------
export async function loginUser({ phone, password }) {
  await ensureCsrf();
  return fetchWithCsrf(`${BASE_URL}/accounts/login/`, {
    method: 'POST',
    body: JSON.stringify({ phone, password })
  });
}

export async function registerUser({ surname, name, patronymic, phone, password, gender }) {
  await ensureCsrf();
  return fetchWithCsrf(`${BASE_URL}/accounts/register/`, {
    method: 'POST',
    body: JSON.stringify({ surname, name, patronymic, phone, password, gender })
  });
}

export async function logoutUser() {
  await ensureCsrf();
  return fetchWithCsrf(`${BASE_URL}/accounts/logout/`, { method: 'POST' });
}

// -----------------
// Корзина
// -----------------
export async function fetchCart() {
  return fetchWithCsrf(`${BASE_URL}/accounts/cart/`, { method: 'GET' });
}

export async function addToCart(dish_id, quantity = 1) {
  return fetchWithCsrf(`${BASE_URL}/accounts/cart/add/`, {
    method: 'POST',
    body: JSON.stringify({ dish_id, quantity })
  });
}

export async function removeFromCart(dish_id, quantity = 1) {
  return fetchWithCsrf(`${BASE_URL}/accounts/cart/remove/`, {
    method: 'POST',
    body: JSON.stringify({ dish_id, quantity })
  });
}

export async function clearCart() {
  return fetchWithCsrf(`${BASE_URL}/accounts/cart/clear/`, { method: 'POST' });
}

// -----------------
// Блюда
// -----------------
export async function fetchDishes(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return fetchWithCsrf(`${BASE_URL}/menu/dishes/${qs ? `?${qs}` : ''}`, { method: 'GET' });
}

// -----------------
// Заказы
// -----------------
export async function createOrder(data) {
  return fetchWithCsrf(`${BASE_URL}/orders/`, {  // <-- убрал лишнее "orders/"
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function fetchUserAddresses() {
  return fetchWithCsrf(`${BASE_URL}/orders/addresses/`, { method: 'GET' });
}

// Получение всех заказов текущего пользователя
export async function fetchUserOrders() {
  return fetch(`${BASE_URL}/orders/`, {
    method: 'GET',
    credentials: 'include', // если используется сессия
  }).then(res => res.json());
}

// Получение деталей конкретного заказа
export async function fetchOrderDetails(orderId) {
  return fetch(`${BASE_URL}/orders/${orderId}/`, {
    method: 'GET',
    credentials: 'include',
  }).then(res => res.json());
}
