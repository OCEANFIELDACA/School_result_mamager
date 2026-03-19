import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { Share } from 'react-native';

const ReportCardGenerator = ({ student, term, session }) => {
  const [generating, setGenerating] = useState(false);

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

  const generatePDF = async () => {
    setGenerating(true);
    
    try {
      const studentData = {
        name: student?.name || 'Student Name',
        admissionNo: student?.admissionNo || 'N/A',
        class: student?.class || 'N/A',
        term: term || 'First Term',
        session: session || '2024/2025',
        photo: student?.photo || '',
        attendance: student?.attendance || { present: 0, total: 0 },
        subjects: student?.subjects || [],
        psychomotor: student?.psychomotor || {
          punctuality: 'Good',
          neatness: 'Good',
          attendance: 'Good',
          cooperation: 'Good',
          leadership: 'Fair'
        },
        comments: student?.comments || {
          teacherComment: '',
          principalComment: ''
        }
      };

      const attendancePercentage = studentData.attendance.total > 0 
        ? Math.round((studentData.attendance.present / studentData.attendance.total) * 100)
        : 0;

      const subjectsRows = studentData.subjects.map((subject, index) => {
        const total = (subject.caScore || 0) + (subject.examScore || 0);
        const gradeInfo = calculateGrade(total);
        
        return `
          <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f9f9f9'};">
            <td style="border: 1px solid #333; padding: 10px; text-align: left;">${subject.name}</td>
            <td style="border: 1px solid #333; padding: 10px; text-align: center;">${subject.caScore || '-'}</td>
            <td style="border: 1px solid #333; padding: 10px; text-align: center;">${subject.examScore || '-'}</td>
            <td style="border: 1px solid #333; padding: 10px; text-align: center; font-weight: bold;">${total}</td>
            <td style="border: 1px solid #333; padding: 10px; text-align: center; font-weight: bold; color: ${total >= 50 ? 'green' : 'red'};">${gradeInfo.grade}</td>
            <td style="border: 1px solid #333; padding: 10px; text-align: center;">${gradeInfo.remark}</td>
          </tr>
        `;
      }).join('');

      const photoHtml = studentData.photo 
        ? `<img src="${studentData.photo}" style="width: 120px; height: 120px; border: 3px solid #1a237e; border-radius: 8px;" />`
        : `<div style="width: 120px; height: 120px; border: 3px solid #1a237e; border-radius: 8px; background-color: #e8eaf6; display: flex; align-items: center; justify-content: center; color: #1a237e; font-size: 12px; text-align: center;">No Photo</div>`;

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #ffffff; }
            .container { max-width: 800px; margin: 0 auto; border: 4px double #1a237e; padding: 30px; }
            .header { text-align: center; background: linear-gradient(135deg, #1a237e 0%, #283593 100%); color: white; margin: -30px -30px 25px -30px; padding: 30px; }
            .school-name { font-size: 32px; font-weight: 800; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 2px; }
            .school-motto { font-size: 14px; font-style: italic; margin-bottom: 15px; }
            .school-address { font-size: 13px; line-height: 1.8; }
            .contact-info { font-size: 12px; margin-top: 10px; }
            .report-title { text-align: center; font-size: 24px; font-weight: 700; color: #1a237e; margin: 25px 0; text-transform: uppercase; letter-spacing: 3px; border-bottom: 2px solid #ffc107; padding-bottom: 10px; }
            .student-info { display: flex; gap: 25px; margin-bottom: 25px; align-items: flex-start; }
            .info-grid { flex-grow: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
            .info-item { background-color: #e8eaf6; padding: 10px 15px; border-radius: 6px; border-left: 4px solid #1a237e; }
            .info-label { font-size: 11px; color: #666; text-transform: uppercase; }
            .info-value { font-size: 15px; font-weight: 600; color: #1a237e; }
            table { width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 13px; }
            th { background: linear-gradient(135deg, #1a237e 0%, #283593 100%); color: white; padding: 12px 8px; text-align: center; font-weight: 600; text-transform: uppercase; font-size: 11px; }
            td { padding: 10px 8px; border: 1px solid #ddd; }
            .psychomotor { margin: 25px 0; background-color: #f5f5f5; padding: 20px; border-radius: 8px; border: 2px solid #e0e0e0; }
            .section-title { font-size: 18px; font-weight: 700; color: #1a237e; margin-bottom: 15px; text-transform: uppercase; border-bottom: 2px solid #ffc107; padding-bottom: 8px; display: inline-block; }
            .psychomotor-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
            .skill-item { background-color: white; padding: 12px 15px; border-radius: 6px; border-left: 4px solid #4caf50; display: flex; justify-content: space-between; align-items: center; }
            .skill-name { font-weight: 600; color: #333; text-transform: capitalize; }
            .skill-rating { background-color: #e8eaf6; color: #1a237e; padding: 4px 12px; border-radius: 12px; font-weight: 600; font-size: 12px; }
            .comments { margin: 25px 0; }
            .comment-box { background-color: #fff; border: 2px solid #e0e0e0; border-radius: 8px; padding: 15px; margin: 15px 0; min-height: 80px; }
            .comment-label { font-weight: 700; color: #1a237e; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; }
            .signatures { display: flex; justify-content: space-between; margin-top: 40px; gap: 40px; }
            .signature-box { flex: 1; text-align: center; }
            .signature-line { border-top: 2px solid #333; margin-top: 60px; padding-top: 10px; font-weight: 600; color: #333; }
            .date-stamp { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px dashed #ccc; font-size: 12px; color: #666; }
            .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #999; padding-top: 20px; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="school-name">OCEANFIELD ACADEMY</div>
              <div class="school-motto">Excellence in Education, Character, and Service</div>
              <div class="school-address">23, Behind Ikani Hospital,<br>Egili Omata Phase II</div>
              <div class="contact-info">📞 09135640237 | ✉️ oceanfieldacademy@gmail.com</div>
            </div>

            <div class="report-title">Student Report Card</div>

            <div class="student-info">
              <div>${photoHtml}</div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Student Name</div>
                  <div class="info-value">${studentData.name}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Admission Number</div>
                  <div class="info-value">${studentData.admissionNo}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Class</div>
                  <div class="info-value">${studentData.class}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Term / Session</div>
                  <div class="info-value">${studentData.term} / ${studentData.session}</div>
                </div>
                <div class="info-item" style="grid-column: 1 / -1;">
                  <div class="info-label">Attendance</div>
                  <div style="background: #4caf50; color: white; padding: 8px 15px; border-radius: 20px; display: inline-block; font-weight: bold;">
                    ${attendancePercentage}% Present
                  </div>
                </div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>CA (30%)</th>
                  <th>Exam (70%)</th>
                  <th>Total</th>
                  <th>Grade</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                ${subjectsRows || '<tr><td colspan="6" style="text-align: center;">No subjects recorded</td></tr>'}
              </tbody>
            </table>

            <div class="psychomotor">
              <div class="section-title">Psychomotor Skills Assessment</div>
              <div class="psychomotor-grid">
                <div class="skill-item"><span class="skill-name">Punctuality</span><span class="skill-rating">${studentData.psychomotor.punctuality}</span></div>
                <div class="skill-item"><span class="skill-name">Neatness</span><span class="skill-rating">${studentData.psychomotor.neatness}</span></div>
                <div class="skill-item"><span class="skill-name">Attendance</span><span class="skill-rating">${studentData.psychomotor.attendance}</span></div>
                <div class="skill-item"><span class="skill-name">Cooperation</span><span class="skill-rating">${studentData.psychomotor.cooperation}</span></div>
                <div class="skill-item"><span class="skill-name">Leadership</span><span class="skill-rating">${studentData.psychomotor.leadership}</span></div>
              </div>
            </div>

            <div class="comments">
              <div class="section-title">Comments</div>
              <div class="comment-box">
                <div class="comment-label">Class Teacher's Comment</div>
                <div>${studentData.comments.teacherComment || '_______________________________________________'}</div>
              </div>
              <div class="comment-box">
                <div class="comment-label">Principal's Comment</div>
                <div>${studentData.comments.principalComment || '_______________________________________________'}</div>
              </div>
            </div>

            <div class="signatures">
              <div class="signature-box">
                <div class="signature-line">Class Teacher's Signature & Date</div>
              </div>
              <div class="signature-box">
                <div class="signature-line">Principal's Signature & Date</div>
              </div>
            </div>

            <div class="date-stamp">
              <strong>Date of Issue:</strong> ${new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>

            <div class="footer">
              <strong>OCEANFIELD ACADEMY</strong> | Excellence in Education<br>
              This is an official document. Any alteration renders it invalid.
            </div>
          </div>
        </body>
        </html>
      `;

      const options = {
        html: html,
        fileName: `OCEANFIELD_Report_${studentData.name.replace(/\s+/g, '_')}`,
        directory: 'Documents/OceanfieldReports',
      };

      const pdf = await RNHTMLtoPDF.convert(options);
      
      await Share.share({
        title: `Report Card - ${studentData.name}`,
        message: `Report Card for ${studentData.name}`,
        url: `file://${pdf.filePath}`,
        type: 'application/pdf',
      });

      Alert.alert('Success!', `Report card saved to:\n${pdf.filePath}`);

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to generate report card');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, generating && styles.buttonDisabled]} 
        onPress={generatePDF}
        disabled={generating}
      >
        <Text style={styles.buttonText}>
          {generating ? 'Generating...' : '📄 Generate Report Card'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#1a237e',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#9fa8da',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReportCardGenerator;
