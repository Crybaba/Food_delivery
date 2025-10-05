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
  options.credentials = 'include';
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
// Блюда (с CSRF)
// -----------------
export async function fetchDishes() {
  // GET запрос можно делать напрямую через fetchWithCsrf для единообразия
  return fetchWithCsrf(`${BASE_URL}/menu/dishes/`, { method: 'GET' })
    .then(data => data.results || []);
}

export async function createDish(formData) {
  await ensureCsrf();
  const res = await fetch(`${BASE_URL}/menu/dishes/`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
    headers: {
      'X-CSRFToken': getCsrfToken(),
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateDish(id, formData) {
  await ensureCsrf();
  const res = await fetch(`${BASE_URL}/menu/dishes/${id}/`, {
    method: 'PUT',
    body: formData,
    credentials: 'include',
    headers: {
      'X-CSRFToken': getCsrfToken(),
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}


export async function deleteDish(id) {
  await ensureCsrf();
  return fetchWithCsrf(`${BASE_URL}/menu/dishes/${id}/`, { method: 'DELETE' });
}

export async function toggleDishAvailability(id) {
  await ensureCsrf();
  return fetchWithCsrf(`${BASE_URL}/menu/dishes/${id}/toggle_availability/`, { method: 'POST' });
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

export async function fetchAdminOrders(courierId = "") {
  const url = new URL(`${BASE_URL}/orders/admin/`);
  if (courierId) url.searchParams.append('courier', courierId);
  return fetch(url.toString(), { credentials: 'include' }).then(res => res.json());
}

export async function fetchCouriers() {
  return fetch(`${BASE_URL}/orders/couriers/`, { credentials: 'include' }).then(res => res.json());
}

// -----------------
// Заказы (обновление)
// -----------------

/**
 * Назначение курьера на заказ
 * @param {number} orderId
 * @param {number|string} courierId
 */
export async function assignCourier(orderId, courierId) {
  await ensureCsrf();
  return fetchWithCsrf(`${BASE_URL}/orders/${orderId}/assign_courier/`, {
    method: 'POST',
    body: JSON.stringify({ courier_id: courierId })
  });
}

/**
 * Изменение статуса заказа
 * @param {number} orderId
 * @param {string} status
 */
export async function updateOrderStatus(orderId, status) {
  await ensureCsrf();
  return fetchWithCsrf(`${BASE_URL}/orders/${orderId}/update_status/`, {
    method: 'POST',
    body: JSON.stringify({ status })
  });
}

// -----------------
// Курьеры (админ)
// -----------------

/**
 * Получить всех пользователей (для проверки телефона при добавлении курьера)
 */
export async function fetchAllUsers() {
  return fetchWithCsrf(`${BASE_URL}/accounts/users/`, { method: 'GET' });
}

/**
 * Назначить пользователю роль курьера
 * @param {string} phone — номер телефона существующего пользователя
 */
export async function addCourierByPhone(phone) {
  await ensureCsrf();
  return fetchWithCsrf(`${BASE_URL}/accounts/couriers/add/`, {
    method: 'POST',
    body: JSON.stringify({ phone })
  });
}

/**
 * Удалить курьера (меняет роль обратно на обычного пользователя)
 * @param {number} courierId — ID пользователя/курьера
 */
export async function removeCourier(courierId) {
  await ensureCsrf();
  return fetchWithCsrf(`${BASE_URL}/accounts/couriers/${courierId}/remove/`, {
    method: 'POST'
  });
}

/**
 * Получить количество активных заказов у конкретного курьера
 * (для проверки занятости)
 * @param {number} courierId
 */
export async function fetchCourierActiveOrders(courierId) {
  return fetchWithCsrf(`${BASE_URL}/accounts/couriers/${courierId}/active_orders/`, {
    method: 'GET'
  });
}