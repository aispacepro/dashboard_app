import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { AlertCircle, AlertTriangle, Info, X, Clock } from 'lucide-react-native';
import { Alert } from '@/contexts/DashboardContext';

interface AlertCardProps {
  alert: Alert;
  onDismiss?: () => void;
}

export default function AlertCard({ alert, onDismiss }: AlertCardProps) {
  const [timer, setTimer] = useState(alert.timer || 0);

  useEffect(() => {
    if (alert.timer) {
      const interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [alert.timer]);

  const getAlertColor = () => {
    switch (alert.type) {
      case 'critical':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      default:
        return '#3B82F6';
    }
  };

  const getAlertIcon = () => {
    switch (alert.type) {
      case 'critical':
        return <AlertCircle color="#FFFFFF" size={20} />;
      case 'warning':
        return <AlertTriangle color="#FFFFFF" size={20} />;
      default:
        return <Info color="#FFFFFF" size={20} />;
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, { borderLeftColor: getAlertColor() }]}>
      <View style={[styles.iconContainer, { backgroundColor: getAlertColor() }]}>
        {getAlertIcon()}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{alert.title}</Text>
          {timer > 0 && (
            <View style={styles.timerContainer}>
              <Clock color="#EF4444" size={14} />
              <Text style={styles.timer}>{formatTimer(timer)}</Text>
            </View>
          )}
        </View>
        <Text style={styles.description}>{alert.description}</Text>
      </View>

      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
          <X color="#64748B" size={20} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#162236',
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF444420',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  timer: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 4,
  },
  description: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
  },
  dismissButton: {
    padding: 4,
  },
});