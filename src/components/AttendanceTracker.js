import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const AttendanceTracker = ({ students, date, onAttendanceUpdate }) => {
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    const initialAttendance = {};
    students.forEach(student => {
      initialAttendance[student.id] = 'present';
    });
    setAttendance(initialAttendance);
  }, [students]);

  const toggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present'
    }));
  };

  const saveAttendance = () => {
    const presentCount = Object.values(attendance).filter(v => v === 'present').length;
    const totalCount = students.length;
    
    onAttendanceUpdate(date, attendance);
    
    Alert.alert(
      'Attendance Saved',
      `Present: ${presentCount}\nAbsent: ${totalCount - presentCount}\nTotal: ${totalCount}`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.dateHeader}>Date: {date}</Text>
      
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Student Name</Text>
        <Text style={styles.headerCell}>Status</Text>
        <Text style={styles.headerCell}>Action</Text>
      </View>

      {students.map((student) => (
        <View key={student.id} style={styles.row}>
          <Text style={styles.nameCell}>{student.name}</Text>
          <View style={styles.statusCell}>
            <View style={[
              styles.statusBadge,
              attendance[student.id] === 'present' ? styles.present : styles.absent
            ]}>
              <Text style={styles.statusText}>
                {attendance[student.id] === 'present' ? '✓ Present' : '✗ Absent'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => toggleAttendance(student.id)}
          >
            <Text style={styles.toggleText}>Toggle</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.saveButton} onPress={saveAttendance}>
        <Text style={styles.saveButtonText}>💾 Save Attendance</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a237e',
    marginBottom: 15,
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#e8eaf6',
    borderRadius: 6,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#1a237e',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  headerCell: {
    flex: 1,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fafafa',
  },
  nameCell: {
    flex: 1.5,
    fontSize: 15,
    fontWeight: '500',
  },
  statusCell: {
    flex: 1,
    alignItems: 'center',
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    minWidth: 80,
    alignItems: 'center',
  },
  present: {
    backgroundColor: '#4caf50',
  },
  absent: {
    backgroundColor: '#f44336',
  },
  statusText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
  toggleButton: {
    flex: 0.8,
    backgroundColor: '#ffc107',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  toggleText: {
    color: '#1a237e',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#1a237e',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AttendanceTracker;
