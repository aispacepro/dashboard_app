import { DashboardMetrics, Period } from '@/contexts/DashboardContext';

export function generateMockData(period: Period): DashboardMetrics {
  const multiplier = period === 'day' ? 1 : period === 'week' ? 7 : 30;
  const totalOrders = Math.floor(150 * multiplier + Math.random() * 50);
  const completedOrders = Math.floor(75 * multiplier + Math.random() * 20);
  
  return {
    orders: {
      total: totalOrders,
      urgent: Math.floor(3 + Math.random() * 5),
      trend: Math.floor(Math.random() * 30 - 10),
      completedOnTime: Math.floor(completedOrders * (0.85 + Math.random() * 0.1)),
      statuses: {
        new: Math.floor(10 * multiplier + Math.random() * 5),
        distributed: Math.floor(25 * multiplier + Math.random() * 10),
        distributedByAI: Math.floor(15 * multiplier + Math.random() * 8),
        distributedByDispatcher: Math.floor(18 * multiplier + Math.random() * 7),
        inProgress: Math.floor(35 * multiplier + Math.random() * 15),
        completed: completedOrders,
        cancelled: Math.floor(5 * multiplier + Math.random() * 3),
      },
    },
    revenue: {
      total: Math.floor(250000 * multiplier + Math.random() * 50000),
      trend: Math.floor(Math.random() * 40 - 15),
      averageCheck: Math.floor(3500 + Math.random() * 1500),
      checkTrend: Math.floor(Math.random() * 20 - 5),
      margin: Math.floor(35 + Math.random() * 15), // Маржинальность в %
      marginTrend: Math.floor(Math.random() * 10 - 3),
      dynamics: generateDynamics(period),
    },
    masters: {
      online: Math.floor(8 + Math.random() * 7),
      total: 25,
      avgCompletionTime: Math.floor(45 + Math.random() * 30),
      avgRating: 4.3 + Math.random() * 0.5,
      top: [
        { id: '1', name: 'Иван Петров', completedOrders: Math.floor(45 + Math.random() * 20), rating: 4.9 },
        { id: '2', name: 'Сергей Смирнов', completedOrders: Math.floor(42 + Math.random() * 18), rating: 4.8 },
        { id: '3', name: 'Михаил Иванов', completedOrders: Math.floor(38 + Math.random() * 15), rating: 4.7 },
        { id: '4', name: 'Алексей Козлов', completedOrders: Math.floor(35 + Math.random() * 12), rating: 4.6 },
        { id: '5', name: 'Дмитрий Новиков', completedOrders: Math.floor(32 + Math.random() * 10), rating: 4.5 },
      ],
      underperformers: [
        { 
          id: '6', 
          name: 'Андрей Волков', 
          completedOrders: Math.floor(15 + Math.random() * 10), 
          rating: 3.8 + Math.random() * 0.4,
          issues: ['Низкий рейтинг', 'Медленное выполнение']
        },
        { 
          id: '7', 
          name: 'Павел Морозов', 
          completedOrders: Math.floor(12 + Math.random() * 8), 
          rating: 3.5 + Math.random() * 0.5,
          issues: ['Частые жалобы', 'Опоздания']
        },
      ],
    },
    dispatchers: {
      totalDistributed: Math.floor(140 * multiplier + Math.random() * 40),
      avgResponseTime: Math.floor(30 + Math.random() * 60),
      errors: Math.floor(2 * multiplier + Math.random() * 3),
      performance: [
        {
          id: '1',
          name: 'Анна Сидорова',
          distributed: Math.floor(50 + Math.random() * 20),
          avgResponseTime: Math.floor(25 + Math.random() * 15),
          errors: Math.floor(Math.random() * 2),
        },
        {
          id: '2',
          name: 'Мария Кузнецова',
          distributed: Math.floor(45 + Math.random() * 15),
          avgResponseTime: Math.floor(35 + Math.random() * 25),
          errors: Math.floor(1 + Math.random() * 3),
        },
        {
          id: '3',
          name: 'Елена Попова',
          distributed: Math.floor(40 + Math.random() * 18),
          avgResponseTime: Math.floor(20 + Math.random() * 10),
          errors: Math.floor(Math.random() * 1),
        },
      ],
    },
    clients: {
      avgRating: 4.2 + Math.random() * 0.6,
      newClients: Math.floor(25 * multiplier + Math.random() * 15),
      returningRate: 65 + Math.random() * 20,
      complaints: Math.floor(3 * multiplier + Math.random() * 5),
      satisfactionTrend: Math.floor(Math.random() * 20 - 5),
    },
  };
}

function generateDynamics(period: Period): Array<{ date: string; value: number }> {
  const points = period === 'day' ? 6 : period === 'week' ? 7 : 12;
  const result = [];
  
  for (let i = 0; i < points; i++) {
    if (period === 'day') {
      result.push({
        date: `${i * 4}:00`,
        value: Math.floor(30000 + Math.random() * 20000),
      });
    } else if (period === 'week') {
      const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
      result.push({
        date: days[i],
        value: Math.floor(200000 + Math.random() * 100000),
      });
    } else {
      result.push({
        date: `${i + 1}`,
        value: Math.floor(80000 + Math.random() * 40000),
      });
    }
  }
  
  return result;
}