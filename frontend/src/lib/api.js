const BASE_URL = process.env.REACT_APP_API || 'http://localhost:8000';

export async function fetchDishes(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/menu/api/dishes/${qs ? `?${qs}` : ''}`; 
  console.log('API URL:', url);
  console.log('BASE_URL:', BASE_URL);
  const res = await fetch(url);
  console.log('Response status:', res.status);
  if (!res.ok) throw new Error('Failed to load dishes');
  return res.json();
}
