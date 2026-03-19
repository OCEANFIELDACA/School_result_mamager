import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const PsychomotorForm = ({ psychomotor, setPsychomotor }) => {
  const skills = [
    { key: 'punctuality', label: 'Punctuality' },
    { key: 'neatness', label: 'Neatness' },
    { key: 'attendance', label: 'Attendance' },
    { key: 'cooperation', label: 'Cooperation' },
    { key: 'leadership', label: 'Leadership' }
  ];

  const ratings = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Psychomotor Skills Assessment</Text>
      
      {skills.map((skill) => (
        <View key={skill.key} style={styles.row}>
          <Text style={styles.label}>{skill.label}</Text>
          <Picker
            selectedValue={psychomotor[skill.key]}
            onValueChange={(value) => 
              setPsychomotor({ ...psychomotor, [skill.key]: value })
            }
            style={styles.picker}
          >
            {ratings.map((rating) => (
              <Picker.Item key={rating} label={rating} value={rating} />
            ))}
          </Picker>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    marginVertical: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a237e',
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  picker: {
    flex: 1,
    height: 45,
  },
});

export default PsychomotorForm;
