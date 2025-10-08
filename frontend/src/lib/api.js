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
 * Проверяем наличие CSRF-токена через эндпоинт /csrf/
 */
async function ensureCsrf() {
  if (!getCsrfToken()) {
    await fetch(`${BASE_URL}/csrf/`, { method: 'GET', credentials: 'include' });
  }
}

/**
 * Универсальный fetch с CSRF и авторизацией по сессии
 */
export async function fetchWithCsrf(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCsrfToken(),
      ...options.headers,
    },
    credentials: 'include',
  });

  let data = null;
  try {
    const text = await res.text();
    if (text) data = JSON.parse(text);
  } catch {
    data = null;
  }

  if (!res.ok) throw new Error(data?.detail || `Ошибка запроса ${res.status}`);
  return data;
}

/**
 * Утилита для загрузки всех страниц пагинации
 */
async function fetchAllPaginated(url) {
  let all = [];
  while (url) {
    const resp = await fetchWithCsrf(url, { method: 'GET' });
    if (resp.results) {
      all = all.concat(resp.results);
      url = resp.next;
    } else {
      // если пагинации нет
      return resp;
    }
  }
  return all;
}

// ----------------------
// Пользователи и аутентификация
// ----------------------

export async function fetchCurrentUser() {
  return fetchWithCsrf(`${BASE_URL}/accounts/me/`, { method: 'GET' });
}

export async function loginUser({ phone, password }) {
  await ensureCsrf();
  const res = await fetch(`${BASE_URL}/accounts/login/`, {
    method: 'POST',
    body: JSON.stringify({ phone, password }),
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCsrfToken(),
    },
    credentials: 'include',
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
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

// ----------------------
// Корзина
// ----------------------

export async function fetchCart() {
  return fetchWithCsrf(`${BASE_URL}/accounts/cart/`, { method: 'GET' });
}

export async function addToCart(dish_id, quantity = 1) {
  return fetchWithCsrf(`${BASE_URL}/accounts/cart/add/`, {
    method: 'POST',
    body: JSON.stringify({ dish_id, quantity }),
  });
}

export async function removeFromCart(dish_id, quantity = 1) {
  return fetchWithCsrf(`${BASE_URL}/accounts/cart/remove/`, {
    method: 'POST',
    body: JSON.stringify({ dish_id, quantity }),
  });
}

export async function clearCart() {
  return fetchWithCsrf(`${BASE_URL}/accounts/cart/clear/`, { method: 'POST' });
}

// ----------------------
// Блюда (учёт пагинации)
// ----------------------

export async function fetchDishes() {
  const url = `${BASE_URL}/menu/dishes/?is_available=true&ordering=name`;
  return fetchAllPaginated(url);
}

export async function createDish(formData) {
  await ensureCsrf();
  const res = await fetch(`${BASE_URL}/menu/dishes/`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
    headers: {
      'X-CSRFToken': getCsrfToken(),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteDish(id) {
  await ensureCsrf();
  return fetchWithCsrf(`${BASE_URL}/menu/dishes/${id}/`, { method: 'DELETE' });
}

export async function updateDish(id, formData) {
  await ensureCsrf();
  const res = await fetch(`${BASE_URL}/menu/dishes/${id}/`, {
    method: 'PUT',
    body: formData,
    credentials: 'include',
    headers: {
      'X-CSRFToken': getCsrfToken(),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function toggleDishAvailability(id) {
  await ensureCsrf();
  return fetchWithCsrf(`${BASE_URL}/menu/dishes/${id}/toggle_availability/`, { method: 'POST' });
}

// ----------------------
// Заказы (универсальные, без админских ручек)
// ----------------------

export async function createOrder(data) {
  return fetchWithCsrf(`${BASE_URL}/orders/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchUserAddresses() {
  return fetchWithCsrf(`${BASE_URL}/orders/addresses/`, { method: 'GET' });
}

/**
 * Получение заказов текущего пользователя (с пагинацией)
 */
export async function fetchUserOrders() {
  const url = `${BASE_URL}/orders/`;
  return fetchAllPaginated(url);
}

/**
 * Получение деталей одного заказа
 */
export async function fetchOrderDetails(orderId) {
  return fetchWithCsrf(`${BASE_URL}/orders/${orderId}/`, { method: 'GET' });
}

/**
 * Обновление статуса заказа (для курьера/админа)
 */
export async function updateOrderStatus(orderId, status) {
  await ensureCsrf();
  return fetchWithCsrf(`${BASE_URL}/orders/${orderId}/update_status/`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  });
}

/**
 * Назначение курьера (только админ)
 */
export async function assignCourier(orderId, courierId) {
  await ensureCsrf();
  return fetchWithCsrf(`${BASE_URL}/orders/${orderId}/assign_courier/`, {
    method: 'POST',
    body: JSON.stringify({ courier_id: courierId }),
  });
}

// ----------------------
// Курьеры (только админ)
// ----------------------

export async function fetchAllUsers() {
  return fetchWithCsrf(`${BASE_URL}/accounts/users/`, { method: 'GET' });
}

export async function addCourierByPhone(phone) {
  await ensureCsrf();
  return fetchWithCsrf(`${BASE_URL}/accounts/couriers/add/`, {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
}

export async function removeCourier(courierId) {
  await ensureCsrf();
  return fetchWithCsrf(`${BASE_URL}/accounts/couriers/${courierId}/remove/`, {
    method: 'POST',
  });
}

export async function fetchCourierActiveOrders(courierId) {
  return fetchWithCsrf(`${BASE_URL}/accounts/couriers/${courierId}/active_orders/`, {
    method: 'GET',
  });
}
