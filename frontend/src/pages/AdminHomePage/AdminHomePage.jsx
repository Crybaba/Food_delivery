import React from 'react';
import Layout from '../../components/Layout/Layout';
import OptionCard from '../../components/OptionCard/OptionCard';
import { ClipboardList, Truck, Utensils, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminHomePage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <h1 className="title-center title-blue">Добро пожаловать в FOODR ИС!</h1>
      <p className="text-center">Выберите опцию:</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <OptionCard title="Заказы" icon={<ClipboardList />} onClick={() => navigate('/admin/orders')} />
        <OptionCard title="Учёт курьеров" icon={<Truck />} onClick={() => navigate('/admin/couriers')} />
        <OptionCard title="Учёт блюд" icon={<Utensils />} onClick={() => navigate('/admin/dishes')} />
        <OptionCard title="Анализ заказов" icon={<BarChart2 />} onClick={() => navigate('/admin/analytics')} />
      </div>
    </Layout>
  );
}


