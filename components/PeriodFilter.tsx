import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Calendar } from 'lucide-react-native';
import { Period } from '@/contexts/DashboardContext';

interface PeriodFilterProps {
  selectedPeriod: Period;
  onPeriodChange: (period: Period) => void;
}

export default function PeriodFilter({ selectedPeriod, onPeriodChange }: PeriodFilterProps) {
  const periods: { value: Period; label: string }[] = [
    { value: 'day', label: 'День' },
    { value: 'week', label: 'Неделя' },
    { value: 'month', label: 'Месяц' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Calendar color="#94A3B8" size={20} />
        <Text style={styles.title}>Период</Text>
      </View>
      
      <View style={styles.filters}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period.value}
            style={[
              styles.filterButton,
              selectedPeriod === period.value && styles.filterButtonActive,
            ]}
            onPress={() => onPeriodChange(period.value)}
          >
            <Text
              style={[
                styles.filterText,
                selectedPeriod === period.value && styles.filterTextActive,
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#94A3B8',
    marginLeft: 8,
  },
  filters: {
    flexDirection: 'row',
    backgroundColor: '#162236',
    borderRadius: 12,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
});