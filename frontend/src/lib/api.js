const BASE_URL = process.env.REACT_APP_API || 'http://localhost:8000';

export async function fetchDishes(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/menu/api/dishes/${qs ? `?${qs}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load dishes');
  return res.json();
}


