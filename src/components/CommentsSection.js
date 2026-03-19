import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const CommentsSection = ({ comments, setComments }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comments</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Class Teacher's Comment</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={4}
          placeholder="Enter teacher's comment here..."
          value={comments.teacherComment}
          onChangeText={(text) => setComments({ ...comments, teacherComment: text })}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Principal's Comment</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={4}
          placeholder="Enter principal's comment here..."
          value={comments.principalComment}
          onChangeText={(text) => setComments({ ...comments, principalComment: text })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginVertical: 15,
    borderWidth: 2,
    borderColor: '#e8eaf6',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a237e',
    marginBottom: 15,
    textTransform: 'uppercase',
    borderBottomWidth: 2,
    borderBottomColor: '#ffc107',
    paddingBottom: 8,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#fafafa',
    minHeight: 100,
    textAlignVertical: 'top',
  },
});

export default CommentsSection;
