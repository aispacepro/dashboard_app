import React, { useState, useEffect, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateMockData } from '@/utils/mockData';

export type Period = 'day' | 'week' | 'month';
export type AlertType = 'critical' | 'warning' | 'info';

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  timestamp: Date;
  timer?: number;
}

export interface DashboardMetrics {
  orders: {
    total: number;
    urgent: number;
    trend: number;
    completedOnTime: number;
    statuses: {
      new: number;
      distributed: number;
      distributedByAI: number;
      distributedByDispatcher: number;
      inProgress: number;
      completed: number;
      cancelled: number;
    };
  };
  revenue: {
    total: number;
    trend: number;
    averageCheck: number;
    checkTrend: number;
    margin: number;
    marginTrend: number;
    dynamics: Array<{ date: string; value: number }>;
  };
  masters: {
    online: number;
    total: number;
    avgCompletionTime: number;
    avgRating: number;
    top: Array<{
      id: string;
      name: string;
      completedOrders: number;
      rating: number;
    }>;
    underperformers: Array<{
      id: string;
      name: string;
      completedOrders: number;
      rating: number;
      issues: string[];
    }>;
  };
  dispatchers: {
    totalDistributed: number;
    avgResponseTime: number;
    errors: number;
    performance: Array<{
      id: string;
      name: string;
      distributed: number;
      avgResponseTime: number;
      errors: number;
    }>;
  };
  clients: {
    avgRating: number;
    newClients: number;
    returningRate: number;
    complaints: number;
    satisfactionTrend: number;
  };
}

export interface AIPredictions {
  revenue: {
    nextWeek: number;
    nextMonth: number;
    weekTrend: number;
    monthTrend: number;
  };
  orders: {
    nextWeek: number;
    nextMonth: number;
    weekTrend: number;
    monthTrend: number;
  };
  workload: {
    overloaded: string[];
    underutilized: string[];
    recommendations: string[];
  };
  risks: {
    clientChurn: number;
    overloadRisk: string[];
    revenueRisk: number;
  };
  recommendations: string[];
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: 'operations' | 'hr' | 'finance' | 'quality';
    estimatedImpact: string;
  }>;
}

interface DashboardContextValue {
  metrics: DashboardMetrics;
  period: Period;
  setPeriod: (period: Period) => void;
  refreshData: () => Promise<void>;
  isLoading: boolean;
  alerts: Alert[];
  aiPredictions: AIPredictions;
  dismissAlert: (alertId: string) => void;
}

export const [DashboardProvider, useDashboard] = createContextHook<DashboardContextValue>(() => {
  const [period, setPeriod] = useState<Period>('day');
  const [metrics, setMetrics] = useState<DashboardMetrics>(generateMockData(period));
  const [isLoading, setIsLoading] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [aiPredictions, setAIPredictions] = useState<AIPredictions>({
    revenue: {
      nextWeek: 850000,
      nextMonth: 3200000,
      weekTrend: 12,
      monthTrend: 8,
    },
    orders: {
      nextWeek: 180,
      nextMonth: 720,
      weekTrend: 12,
      monthTrend: 8,
    },
    workload: {
      overloaded: ['Иван Петров', 'Сергей Смирнов'],
      underutilized: ['Алексей Козлов'],
      recommendations: [
        'Перераспределить нагрузку между мастерами',
        'Добавить дополнительные смены в пиковые часы',
      ],
    },
    risks: {
      clientChurn: 15,
      overloadRisk: ['Вечерние смены', 'Выходные дни'],
      revenueRisk: 8,
    },
    recommendations: [
      'Добавить ещё одного мастера в вечерние смены (18:00-22:00)',
      'Увеличить стоимость срочных заказов на 15% для балансировки нагрузки',
      'Провести обучение диспетчера Марии - среднее время реакции выше нормы',
    ],
    tasks: [
      {
        id: '1',
        title: 'Нанять дополнительного мастера',
        description: 'Для покрытия вечерних смен и снижения нагрузки',
        priority: 'high',
        category: 'hr',
        estimatedImpact: '+15% выручки',
      },
      {
        id: '2',
        title: 'Оптимизировать ценообразование',
        description: 'Повысить стоимость срочных заказов',
        priority: 'high',
        category: 'finance',
        estimatedImpact: '+8% маржинальности',
      },
      {
        id: '3',
        title: 'Обучить диспетчеров',
        description: 'Улучшить время реакции на заявки',
        priority: 'medium',
        category: 'operations',
        estimatedImpact: '+12% удовлетворенности',
      },
    ],
  });

  useEffect(() => {
    loadSettings();
    generateAlerts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      generateAlerts();
    }, 30000); // Обновляем алерты каждые 30 секунд

    return () => clearInterval(interval);
  }, []);

  const loadSettings = async () => {
    try {
      const savedPeriod = await AsyncStorage.getItem('dashboardPeriod');
      if (savedPeriod) {
        setPeriod(savedPeriod as Period);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const savePeriod = async (newPeriod: Period) => {
    try {
      await AsyncStorage.setItem('dashboardPeriod', newPeriod);
      setPeriod(newPeriod);
    } catch (error) {
      console.error('Error saving period:', error);
    }
  };

  const generateAlerts = () => {
    const newAlerts: Alert[] = [];
    
    // Критичные алерты
    if (Math.random() > 0.4) {
      newAlerts.push({
        id: '1',
        type: 'critical',
        title: 'Нераспределённые заявки',
        description: `${Math.floor(Math.random() * 5) + 1} заявки не распределены более 5 минут`,
        timestamp: new Date(),
        timer: Math.floor(Math.random() * 600) + 300, // 5-15 минут в секундах
      });
    }

    if (Math.random() > 0.6) {
      newAlerts.push({
        id: '2',
        type: 'critical',
        title: 'Просроченный заказ',
        description: `Заказ #${Math.floor(Math.random() * 9000) + 1000} просрочен на ${Math.floor(Math.random() * 30) + 10} минут`,
        timestamp: new Date(),
      });
    }

    if (Math.random() > 0.7) {
      newAlerts.push({
        id: '5',
        type: 'critical',
        title: 'Мастер недоступен',
        description: 'Иван Петров не отвечает на заявки более 20 минут',
        timestamp: new Date(),
      });
    }

    // Предупреждения
    if (Math.random() > 0.5) {
      newAlerts.push({
        id: '3',
        type: 'warning',
        title: 'Низкий рейтинг',
        description: `Клиент оставил оценку ${Math.floor(Math.random() * 2) + 1} звезды для заказа #${Math.floor(Math.random() * 9000) + 1000}`,
        timestamp: new Date(),
      });
    }

    if (Math.random() > 0.6) {
      newAlerts.push({
        id: '6',
        type: 'warning',
        title: 'Высокая нагрузка',
        description: 'Количество заявок превышает норму на 25%',
        timestamp: new Date(),
      });
    }

    if (Math.random() > 0.7) {
      newAlerts.push({
        id: '7',
        type: 'warning',
        title: 'Медленная реакция',
        description: 'Диспетчер Мария отвечает на заявки медленнее обычного',
        timestamp: new Date(),
      });
    }

    // Информационные
    if (Math.random() > 0.8) {
      newAlerts.push({
        id: '4',
        type: 'info',
        title: 'Мастер вышел из сети',
        description: 'Алексей Козлов завершил смену',
        timestamp: new Date(),
      });
    }

    if (Math.random() > 0.9) {
      newAlerts.push({
        id: '8',
        type: 'info',
        title: 'Новый клиент',
        description: 'Зарегистрирован новый клиент в системе',
        timestamp: new Date(),
      });
    }

    setAlerts(newAlerts);
  };

  const refreshData = async () => {
    setIsLoading(true);
    
    // Имитация загрузки данных
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newData = generateMockData(period);
    setMetrics(newData);
    generateAlerts();
    
    // Обновляем прогнозы ИИ
    setAIPredictions(prev => ({
      ...prev,
      revenue: {
        ...prev.revenue,
        nextWeek: newData.revenue.total * 1.12,
        nextMonth: newData.revenue.total * 4.2 * 1.08,
      },
      orders: {
        ...prev.orders,
        nextWeek: Math.round(newData.orders.total * 1.12),
        nextMonth: Math.round(newData.orders.total * 4.2 * 1.08),
      },
    }));
    
    setIsLoading(false);
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  return {
    metrics,
    period,
    setPeriod: savePeriod,
    refreshData,
    isLoading,
    alerts,
    aiPredictions,
    dismissAlert,
  };
});