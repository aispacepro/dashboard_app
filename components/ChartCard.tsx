import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { BarChart, LineChart } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

interface ChartCardProps {
  title: string;
  data: any;
  type: 'bar' | 'line' | 'pie';
}

export default function ChartCard({ title, data, type }: ChartCardProps) {
  const renderChart = () => {
    if (type === 'bar') {
      const statuses = data as any;
      const total = Object.values(statuses).reduce((sum: number, val: any) => sum + val, 0) as number;
      
      return (
        <View style={styles.barChart}>
          <View style={styles.barRow}>
            <Text style={styles.barLabel}>Новые</Text>
            <View style={styles.barContainer}>
              <View style={[styles.bar, { width: `${(statuses.new / total) * 100}%`, backgroundColor: '#3B82F6' }]} />
            </View>
            <Text style={styles.barValue}>{statuses.new}</Text>
          </View>
          <View style={styles.barRow}>
            <Text style={styles.barLabel}>Распределены</Text>
            <View style={styles.barContainer}>
              <View style={[styles.bar, { width: `${(statuses.distributed / total) * 100}%`, backgroundColor: '#8B5CF6' }]} />
            </View>
            <Text style={styles.barValue}>{statuses.distributed}</Text>
          </View>
          <View style={styles.barRow}>
            <Text style={styles.barLabel}>Распределено{"\n"}ИИ</Text>
            <View style={styles.barContainer}>
              <View style={[styles.bar, { width: `${(statuses.distributedByAI / total) * 100}%`, backgroundColor: '#06B6D4' }]} />
            </View>
            <Text style={styles.barValue}>{statuses.distributedByAI}</Text>
          </View>
          <View style={styles.barRow}>
            <Text style={styles.barLabel}>Распределено{"\n"}диспетчером</Text>
            <View style={styles.barContainer}>
              <View style={[styles.bar, { width: `${(statuses.distributedByDispatcher / total) * 100}%`, backgroundColor: '#8B5CF6' }]} />
            </View>
            <Text style={styles.barValue}>{statuses.distributedByDispatcher}</Text>
          </View>
          <View style={styles.barRow}>
            <Text style={styles.barLabel}>В работе</Text>
            <View style={styles.barContainer}>
              <View style={[styles.bar, { width: `${(statuses.inProgress / total) * 100}%`, backgroundColor: '#F59E0B' }]} />
            </View>
            <Text style={styles.barValue}>{statuses.inProgress}</Text>
          </View>
          <View style={styles.barRow}>
            <Text style={styles.barLabel}>Завершены</Text>
            <View style={styles.barContainer}>
              <View style={[styles.bar, { width: `${(statuses.completed / total) * 100}%`, backgroundColor: '#10B981' }]} />
            </View>
            <Text style={styles.barValue}>{statuses.completed}</Text>
          </View>
          <View style={styles.barRow}>
            <Text style={styles.barLabel}>Отменены</Text>
            <View style={styles.barContainer}>
              <View style={[styles.bar, { width: `${(statuses.cancelled / total) * 100}%`, backgroundColor: '#EF4444' }]} />
            </View>
            <Text style={styles.barValue}>{statuses.cancelled}</Text>
          </View>
        </View>
      );
    }

    if (type === 'line') {
      const dynamics = data as Array<{ date: string; value: number }>;
      const maxValue = Math.max(...dynamics.map(d => d.value));
      
      return (
        <View style={styles.lineChart}>
          <View style={styles.lineChartContent}>
            {dynamics.map((point, index) => (
              <View key={index} style={styles.linePoint}>
                <View style={styles.lineBar}>
                  <View 
                    style={[
                      styles.lineBarFill, 
                      { height: `${(point.value / maxValue) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.lineLabel}>{point.date}</Text>
              </View>
            ))}
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {type === 'bar' ? (
          <BarChart color="#64748B" size={20} />
        ) : (
          <LineChart color="#64748B" size={20} />
        )}
      </View>
      {renderChart()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#162236',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  barChart: {
    gap: 12,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barLabel: {
    width: 110,
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 16,
  },
  barContainer: {
    flex: 1,
    height: 24,
    backgroundColor: '#1E293B',
    borderRadius: 6,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 6,
  },
  barValue: {
    width: 40,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'right',
  },
  lineChart: {
    height: 150,
  },
  lineChartContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  linePoint: {
    flex: 1,
    alignItems: 'center',
  },
  lineBar: {
    width: 30,
    height: 100,
    backgroundColor: '#1E293B',
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  lineBarFill: {
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  lineLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 8,
  },
});