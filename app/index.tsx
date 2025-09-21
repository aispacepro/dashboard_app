import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Platform,
} from 'react-native';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  AlertCircle,
  Clock,
  Star,
  Activity,
  ChevronRight,
  Calendar,
  Brain,
  Target,
  CheckCircle,
  Zap,
  BarChart3,
  PieChart,
  UserCheck,
  Headphones,
  Heart,
  Lightbulb,
  ArrowRight,
} from 'lucide-react-native';
import { useDashboard } from '@/contexts/DashboardContext';
import MetricCard from '@/components/MetricCard';
import ChartCard from '@/components/ChartCard';
import AlertCard from '@/components/AlertCard';
import PeriodFilter from '@/components/PeriodFilter';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatters';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

export default function DashboardScreen() {
  const { 
    metrics, 
    period, 
    setPeriod, 
    refreshData, 
    isLoading,
    alerts,
    aiPredictions,
    dismissAlert 
  } = useDashboard();
  
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  }, [refreshData]);

  useEffect(() => {
    refreshData();
  }, [period]);

  const getKPIStatus = (value: number, target: number, type: 'higher' | 'lower' = 'higher') => {
    const ratio = value / target;
    if (type === 'higher') {
      if (ratio >= 1) return 'normal';
      if (ratio >= 0.8) return 'warning';
      return 'critical';
    } else {
      if (ratio <= 1) return 'normal';
      if (ratio <= 1.2) return 'warning';
      return 'critical';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B82F6"
            colors={['#3B82F6']}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Фильтр периода */}
        <PeriodFilter 
          selectedPeriod={period} 
          onPeriodChange={setPeriod}
        />

        {/* Главные KPI */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Главные KPI</Text>
          <View style={styles.kpiGrid}>
            <MetricCard
              title="Выручка"
              value={formatCurrency(metrics.revenue.total)}
              subtitle={`${metrics.revenue.trend > 0 ? '+' : ''}${formatPercent(metrics.revenue.trend)} к прошлому периоду`}
              icon={<DollarSign color="#10B981" size={24} />}
              trend={metrics.revenue.trend}
              status={getKPIStatus(metrics.revenue.total, period === 'day' ? 300000 : period === 'week' ? 2000000 : 8000000)}
              style={{ flex: 1 }}
            />
            <MetricCard
              title="Заявки"
              value={formatNumber(metrics.orders.total)}
              subtitle={`${metrics.orders.trend > 0 ? '+' : ''}${formatPercent(metrics.orders.trend)} к прошлому периоду`}
              icon={<Activity color="#3B82F6" size={24} />}
              trend={metrics.orders.trend}
              status={getKPIStatus(metrics.orders.total, period === 'day' ? 150 : period === 'week' ? 1000 : 4000)}
              style={{ flex: 1, marginLeft: 12 }}
            />
          </View>
          <View style={styles.kpiGrid}>
            <MetricCard
              title="Выполнено вовремя"
              value={`${Math.round((metrics.orders.statuses.completed / metrics.orders.total) * 100)}%`}
              subtitle="От общего количества"
              icon={<CheckCircle color="#10B981" size={24} />}
              status={getKPIStatus(Math.round((metrics.orders.statuses.completed / metrics.orders.total) * 100), 85)}
              style={{ flex: 1 }}
            />
            <MetricCard
              title="Рейтинг клиентов"
              value={metrics.clients.avgRating.toFixed(1)}
              subtitle="Средняя оценка"
              icon={<Star color="#FCD34D" size={24} />}
              status={getKPIStatus(metrics.clients.avgRating, 4.0)}
              style={{ flex: 1, marginLeft: 12 }}
            />
          </View>
        </View>

        {/* Секция заявок */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Заявки</Text>
          <View style={styles.metricsRow}>
            <MetricCard
              title="Всего заявок"
              value={formatNumber(metrics.orders.total)}
              subtitle={`За ${period === 'day' ? 'сегодня' : period === 'week' ? 'неделю' : 'месяц'}`}
              icon={<Activity color="#3B82F6" size={24} />}
              trend={metrics.orders.trend}
              style={{ flex: 1 }}
            />
            <MetricCard
              title="Срочные"
              value={formatNumber(metrics.orders.urgent)}
              subtitle="Не распределены > 5 мин"
              icon={<AlertCircle color="#EF4444" size={24} />}
              status="critical"
              style={{ flex: 1, marginLeft: 12 }}
            />
          </View>
          
          <ChartCard
            title="Статусы заявок"
            data={metrics.orders.statuses}
            type="bar"
          />
        </View>

        {/* Секция выручки */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Выручка</Text>
          <View style={styles.metricsRow}>
            <MetricCard
              title="Выручка"
              value={formatCurrency(metrics.revenue.total)}
              subtitle={`За ${period === 'day' ? 'день' : period === 'week' ? 'неделю' : 'месяц'}`}
              icon={<DollarSign color="#10B981" size={24} />}
              trend={metrics.revenue.trend}
              style={{ flex: 1 }}
            />
            <MetricCard
              title="Средний чек"
              value={formatCurrency(metrics.revenue.averageCheck)}
              subtitle={`${metrics.revenue.checkTrend > 0 ? '+' : ''}${formatPercent(metrics.revenue.checkTrend)}`}
              icon={<TrendingUp color="#3B82F6" size={24} />}
              style={{ flex: 1, marginLeft: 12 }}
            />
          </View>
          
          <View style={styles.metricsRow}>
            <MetricCard
              title="Маржинальность"
              value={`${metrics.revenue.margin}%`}
              subtitle={`${metrics.revenue.marginTrend > 0 ? '+' : ''}${formatPercent(metrics.revenue.marginTrend)} к прошлому периоду`}
              icon={<BarChart3 color="#8B5CF6" size={24} />}
              trend={metrics.revenue.marginTrend}
              status={getKPIStatus(metrics.revenue.margin, 30)}
              style={{ flex: 1 }}
            />
            <MetricCard
              title="Жалобы"
              value={formatNumber(metrics.clients.complaints)}
              subtitle="За период"
              icon={<AlertCircle color="#EF4444" size={24} />}
              status={getKPIStatus(metrics.clients.complaints, 5, 'lower')}
              style={{ flex: 1, marginLeft: 12 }}
            />
          </View>
          
          <ChartCard
            title="Динамика выручки"
            data={metrics.revenue.dynamics}
            type="line"
          />
        </View>

        {/* Секция мастеров */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Мастера</Text>
          <View style={styles.metricsRow}>
            <MetricCard
              title="Онлайн"
              value={`${metrics.masters.online}/${metrics.masters.total}`}
              subtitle="Мастеров в системе"
              icon={<Users color="#3B82F6" size={24} />}
              style={{ flex: 1 }}
            />
            <MetricCard
              title="Ср. время"
              value={`${metrics.masters.avgCompletionTime} мин`}
              subtitle="Выполнения заказа"
              icon={<Clock color="#3B82F6" size={24} />}
              style={{ flex: 1, marginLeft: 12 }}
            />
          </View>
          
          <View style={styles.topPerformers}>
            <Text style={styles.subsectionTitle}>Топ мастеров</Text>
            {metrics.masters.top.map((master, index) => (
              <View key={master.id} style={styles.performerRow}>
                <Text style={styles.performerRank}>{index + 1}</Text>
                <View style={styles.performerInfo}>
                  <Text style={styles.performerName}>{master.name}</Text>
                  <View style={styles.performerStats}>
                    <Text style={styles.performerOrders}>{master.completedOrders} заказов</Text>
                    <View style={styles.ratingContainer}>
                      <Star color="#FCD34D" size={14} fill="#FCD34D" />
                      <Text style={styles.performerRating}>{master.rating}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Секция диспетчеров */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Диспетчеры</Text>
          <View style={styles.metricsRow}>
            <MetricCard
              title="Распределено"
              value={formatNumber(metrics.dispatchers.totalDistributed)}
              subtitle="Заявок за период"
              icon={<Activity color="#3B82F6" size={24} />}
              style={{ flex: 1 }}
            />
            <MetricCard
              title="Ср. реакция"
              value={`${metrics.dispatchers.avgResponseTime} сек`}
              subtitle="На новую заявку"
              icon={<Clock color="#3B82F6" size={24} />}
              status={metrics.dispatchers.avgResponseTime > 60 ? 'warning' : 'normal'}
              style={{ flex: 1, marginLeft: 12 }}
            />
          </View>
        </View>

        {/* Секция клиентов */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Клиенты</Text>
          <View style={styles.metricsRow}>
            <MetricCard
              title="Ср. рейтинг"
              value={metrics.clients.avgRating.toFixed(1)}
              subtitle="От клиентов"
              icon={<Star color="#FCD34D" size={24} />}
              style={{ flex: 1 }}
            />
            <MetricCard
              title="Новые"
              value={formatNumber(metrics.clients.newClients)}
              subtitle="За период"
              icon={<Users color="#10B981" size={24} />}
              trend={15}
              style={{ flex: 1, marginLeft: 12 }}
            />
            <MetricCard
              title="Постоянные"
              value={`${formatPercent(metrics.clients.returningRate)}`}
              subtitle="Повторные заказы"
              icon={<TrendingUp color="#3B82F6" size={24} />}
              style={{ flex: 1, marginLeft: 12 }}
            />
          </View>
        </View>

        {/* Секция оповещений */}
        {alerts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Оповещения</Text>
            {alerts.map((alert) => (
              <AlertCard 
                key={alert.id} 
                alert={alert} 
                onDismiss={() => dismissAlert(alert.id)} 
              />
            ))}
          </View>
        )}

        {/* Прогноз от ИИ */}
        <View style={styles.section}>
          <View style={styles.aiHeader}>
            <Brain color="#8B5CF6" size={24} />
            <Text style={styles.sectionTitle}>Прогноз от ИИ</Text>
          </View>
          
          <View style={styles.aiGrid}>
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.aiCard}
            >
              <View style={styles.aiPrediction}>
                <Text style={styles.aiTitle}>Прогноз выручки</Text>
                <Text style={styles.aiValue}>
                  {formatCurrency(aiPredictions.revenue.nextWeek)}
                </Text>
                <Text style={styles.aiSubtitle}>
                  Следующая неделя ({aiPredictions.revenue.weekTrend > 0 ? '+' : ''}{formatPercent(aiPredictions.revenue.weekTrend)})
                </Text>
                <Text style={styles.aiValue}>
                  {formatCurrency(aiPredictions.revenue.nextMonth)}
                </Text>
                <Text style={styles.aiSubtitle}>
                  Следующий месяц ({aiPredictions.revenue.monthTrend > 0 ? '+' : ''}{formatPercent(aiPredictions.revenue.monthTrend)})
                </Text>
              </View>
            </LinearGradient>

            <LinearGradient
              colors={['#059669', '#047857']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.aiCard}
            >
              <View style={styles.aiPrediction}>
                <Text style={styles.aiTitle}>Прогноз заявок</Text>
                <Text style={styles.aiValue}>
                  {formatNumber(Math.round(metrics.orders.total * 1.12))}
                </Text>
                <Text style={styles.aiSubtitle}>
                  Следующая неделя (+12%)
                </Text>
                <Text style={styles.aiValue}>
                  {formatNumber(Math.round(metrics.orders.total * 4.2 * 1.08))}
                </Text>
                <Text style={styles.aiSubtitle}>
                  Следующий месяц (+8%)
                </Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.aiWorkload}>
            <Text style={styles.recommendationsTitle}>Прогноз загрузки мастеров</Text>
            <View style={styles.workloadGrid}>
              <View style={styles.workloadCard}>
                <View style={styles.workloadHeader}>
                  <AlertCircle color="#EF4444" size={20} />
                  <Text style={styles.workloadTitle}>Перегружены</Text>
                </View>
                {aiPredictions.workload.overloaded.map((master, index) => (
                  <Text key={index} style={styles.workloadMaster}>{master}</Text>
                ))}
              </View>
              <View style={styles.workloadCard}>
                <View style={styles.workloadHeader}>
                  <Clock color="#10B981" size={20} />
                  <Text style={styles.workloadTitle}>Свободны</Text>
                </View>
                {aiPredictions.workload.underutilized.map((master, index) => (
                  <Text key={index} style={styles.workloadMaster}>{master}</Text>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Задачи руководителя */}
        <View style={styles.section}>
          <View style={styles.tasksHeader}>
            <Target color="#F59E0B" size={24} />
            <Text style={styles.sectionTitle}>Задачи руководителя</Text>
            <View style={styles.aiGenerated}>
              <Zap color="#8B5CF6" size={16} />
              <Text style={styles.aiGeneratedText}>ИИ</Text>
            </View>
          </View>
          
          <View style={styles.tasksList}>
            {aiPredictions.recommendations.map((task, index) => (
              <TouchableOpacity key={index} style={styles.taskCard}>
                <View style={styles.taskContent}>
                  <View style={styles.taskIcon}>
                    <Lightbulb color="#F59E0B" size={20} />
                  </View>
                  <View style={styles.taskInfo}>
                    <Text style={styles.taskText}>{task}</Text>
                    <Text style={styles.taskPriority}>Высокий приоритет</Text>
                  </View>
                  <ArrowRight color="#64748B" size={20} />
                </View>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity style={styles.taskCard}>
              <View style={styles.taskContent}>
                <View style={styles.taskIcon}>
                  <BarChart3 color="#3B82F6" size={20} />
                </View>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskText}>Проанализировать причины отмен заказов</Text>
                  <Text style={styles.taskPriority}>Средний приоритет</Text>
                </View>
                <ArrowRight color="#64748B" size={20} />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.taskCard}>
              <View style={styles.taskContent}>
                <View style={styles.taskIcon}>
                  <UserCheck color="#10B981" size={20} />
                </View>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskText}>Провести собеседование с новыми мастерами</Text>
                  <Text style={styles.taskPriority}>Низкий приоритет</Text>
                </View>
                <ArrowRight color="#64748B" size={20} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  kpiGrid: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#94A3B8',
    marginBottom: 12,
  },
  topPerformers: {
    backgroundColor: '#162236',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
  },
  performerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  performerRank: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    width: 30,
  },
  performerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  performerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  performerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  performerOrders: {
    fontSize: 14,
    color: '#94A3B8',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  performerRating: {
    fontSize: 14,
    color: '#FCD34D',
    marginLeft: 4,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiGrid: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  aiCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
  },
  aiPrediction: {
    alignItems: 'center',
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  aiValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  aiSubtitle: {
    fontSize: 14,
    color: '#E9D5FF',
    marginBottom: 16,
  },
  aiRecommendations: {
    backgroundColor: '#162236',
    borderRadius: 16,
    padding: 16,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#94A3B8',
    marginBottom: 12,
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recommendationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
    marginTop: 6,
    marginRight: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 20,
  },
  aiWorkload: {
    backgroundColor: '#162236',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  workloadGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  workloadCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
  },
  workloadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  workloadTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  workloadMaster: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 4,
  },
  tasksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiGenerated: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF620',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 'auto',
  },
  aiGeneratedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5CF6',
    marginLeft: 4,
  },
  tasksList: {
    gap: 12,
  },
  taskCard: {
    backgroundColor: '#162236',
    borderRadius: 12,
    padding: 16,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
    lineHeight: 20,
  },
  taskPriority: {
    fontSize: 12,
    color: '#94A3B8',
  },
});