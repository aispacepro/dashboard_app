import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: number;
  status?: 'normal' | 'warning' | 'critical';
  style?: ViewStyle;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  status = 'normal',
  style,
}: MetricCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'critical':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      default:
        return '#3B82F6';
    }
  };

  const getTrendColor = () => {
    if (!trend) return '#94A3B8';
    return trend > 0 ? '#10B981' : '#EF4444';
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        {trend !== undefined && (
          <View style={[styles.trendContainer, { backgroundColor: getTrendColor() + '20' }]}>
            {trend > 0 ? (
              <TrendingUp color={getTrendColor()} size={16} />
            ) : (
              <TrendingDown color={getTrendColor()} size={16} />
            )}
            <Text style={[styles.trendText, { color: getTrendColor() }]}>
              {Math.abs(trend)}%
            </Text>
          </View>
        )}
      </View>
      
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, status === 'critical' && { color: getStatusColor() }]}>
        {value}
      </Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#162236',
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  title: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
  },
});