import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import PsychomotorForm from '../components/PsychomotorForm';
import CommentsSection from '../components/CommentsSection';
import ReportCardGenerator from '../components/ReportCardGenerator';

const ResultEntryScreen = ({ route, navigation }) => {
  const { student, className, term, session } = route.params || {};

  const [subjects, setSubjects] = useState([
    { name: 'Mathematics', caScore: '', examScore: '', total: 0, grade: '' },
    { name: 'English Language', caScore: '', examScore: '', total: 0, grade: '' },
    { name: 'Basic Science', caScore: '', examScore: '', total: 0, grade: '' },
  ]);

  const [psychomotor, setPsychomotor] = useState({
    punctuality: 'Good',
    neatness: 'Good',
    attendance: 'Good',
    cooperation: 'Good',
    leadership: 'Fair',
  });

  const [comments, setComments] = useState({
    teacherComment: '',
    principalComment: '',
  });

  const calculateGrade = (total) => {
    if (total >= 70) return { grade: 'A1', remark: 'Excellent' };
    if (total >= 65) return { grade: 'B2', remark: 'Very Good' };
    if (total >= 60) return { grade: 'B3', remark: 'Good' };
    if (total >= 55) return { grade: 'C4', remark: 'Credit' };
    if (total >= 50) return { grade: 'C5', remark: 'Credit' };
    if (total >= 45) return { grade: 'C6', remark: 'Credit' };
    if (total >= 40) return { grade: 'D7', remark: 'Pass' };
    if (total >= 35) return { grade: 'E8', remark: 'Pass' };
    return { grade: 'F9', remark: 'Fail' };
  };

  const updateSubjectScore = (index, field, value) => {
    const newSubjects = [...subjects];
    newSubjects[index][field] = value;

    const ca = parseFloat(newSubjects[index].caScore) || 0;
    const exam = parseFloat(newSubjects[index].examScore) || 0;

    if (ca > 30) {
      Alert.alert('Error', 'CA Score cannot exceed 30');
      return;
    }
    if (exam > 70) {
      Alert.alert('Error', 'Exam Score cannot exceed 70');
      return;
    }

    const total = ca + exam;
    newSubjects[index].total = total;
    
    const gradeInfo = calculateGrade(total);
    newSubjects[index].grade = gradeInfo.grade;
    newSubjects[index].remark = gradeInfo.remark;

    setSubjects(newSubjects);
  };

  const addSubject = () => {
    setSubjects([...subjects, { name: '', caScore: '', examScore: '', total: 0, grade: '' }]);
  };

  const removeSubject = (index) => {
    const newSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(newSubjects);
  };

  const updateSubjectName = (index, name) => {
    const newSubjects = [...subjects];
    newSubjects[index].name = name;
    setSubjects(newSubjects);
  };

  const saveResults = () => {
    const invalidSubject = subjects.find(
      (s) => !s.name || s.caScore === '' || s.examScore === ''
    );

    if (invalidSubject) {
      Alert.alert('Error', 'Please fill in all subject names and scores');
      return;
    }

    Alert.alert('Success', 'Results saved successfully!');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.schoolName}>OCEANFIELD ACADEMY</Text>
        <Text style={styles.screenTitle}>Result Entry</Text>
      </View>

      <View style={styles.studentCard}>
        {student?.photo && (
          <Image source={{ uri: student.photo }} style={styles.studentPhoto} />
        )}
        <View style={styles.studentInfo}>
          <Text style={styles.infoText}>Student: {student?.name}</Text>
          <Text style={styles.infoText}>Class: {className}</Text>
          <Text style={styles.infoText}>Term: {term}</Text>
          <Text style={styles.infoText}>Session: {session}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Academic Results</Text>
        <Text style={styles.sectionSubtitle}>CA = 30%, Exam = 70%</Text>

        {subjects.map((subject, index) => (
          <View key={index} style={styles.subjectRow}>
            <TextInput
              style={styles.subjectNameInput}
              placeholder="Subject Name"
              value={subject.name}
              onChangeText={(text) => updateSubjectName(index, text)}
            />
            <TextInput
              style={styles.scoreInput}
              placeholder="CA"
              keyboardType="numeric"
              maxLength={2}
              value={subject.caScore}
              onChangeText={(value) => updateSubjectScore(index, 'caScore', value)}
            />
            <TextInput
              style={styles.scoreInput}
              placeholder="Exam"
              keyboardType="numeric"
              maxLength={2}
              value={subject.examScore}
              onChangeText={(value) => updateSubjectScore(index, 'examScore', value)}
            />
            <Text style={styles.totalText}>{subject.total}</Text>
            <Text style={[styles.gradeText, subject.total >= 50 ? styles.pass : styles.fail]}>
              {subject.grade}
            </Text>
            <TouchableOpacity style={styles.removeBtn} onPress={() => removeSubject(index)}>
              <Text style={styles.removeText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addSubject}>
          <Text style={styles.addButtonText}>+ Add Subject</Text>
        </TouchableOpacity>
      </View>

      <PsychomotorForm psychomotor={psychomotor} setPsychomotor={setPsychomotor} />
      <CommentsSection comments={comments} setComments={setComments} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={saveResults}>
          <Text style={styles.saveButtonText}>💾 Save Results</Text>
        </TouchableOpacity>

        <ReportCardGenerator
          student={{
            ...student,
            subjects: subjects.map((s) => ({
              name: s.name,
              caScore: parseFloat(s.caScore) || 0,
              examScore: parseFloat(s.examScore) || 0,
              total: s.total,
              grade: s.grade,
              remarks: s.remark,
            })),
            psychomotor,
            comments,
            term,
            session,
            class: className,
          }}
          term={term}
          session={session}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1a237e',
    padding: 20,
    alignItems: 'center',
  },
  schoolName: {
    color: '#ffc107',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 5,
  },
  screenTitle: {
    color: '#ffffff',
    fontSize: 18,
  },
  studentCard: {
    backgroundColor: '#ffffff',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    borderWidth: 3,
    borderColor: '#1a237e',
  },
  studentInfo: {
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  section: {
    backgroundColor: '#ffffff',
    margin: 15,
    padding: 20,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a237e',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fafafa',
    padding: 10,
    borderRadius: 6,
  },
  subjectNameInput: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  scoreInput: {
    width: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    textAlign: 'center',
    marginRight: 8,
  },
  totalText: {
    width: 40,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  gradeText: {
    width: 40,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  pass: {
    color: '#4caf50',
  },
  fail: {
    color: '#f44336',
  },
  removeBtn: {
    width: 30,
    height: 30,
    backgroundColor: '#ffebee',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: '#f44336',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#e8eaf6',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#1a237e',
    borderStyle: 'dashed',
  },
  addButtonText: {
    color: '#1a237e',
    fontWeight: '600',
  },
  buttonContainer: {
    padding: 20,
    marginBottom: 30,
  },
  saveButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ResultEntryScreen;
