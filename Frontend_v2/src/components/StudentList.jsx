import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchStudents = async (pageNumber = 1) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No token found — please log in first.");
        return;
      }

      const res = await axios.get(
        `http://127.0.0.1:8000/api/students/?page=${pageNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStudents(res.data.results);
      setCount(Math.ceil(res.data.count / 5));
      setCurrentPage(pageNumber);
    } catch (err) {
      console.error("Error fetching students:", err.response?.data || err.message);
    }
  };

  const exportCSV = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No token found — please log in first.");
        return;
      }

      const res = await axios.get(
        "http://127.0.0.1:8000/api/students/export_students_csv/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", 
        }
      );

      // Create a URL for the file blob
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "students.csv"); 
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error exporting CSV:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchStudents(1);
  }, []);

  return (
    <div>
      <h2>Student List</h2>
      <button onClick={exportCSV} style={{ marginBottom: "10px" }}>
        Export CSV
      </button>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Class</th>
            <th>Roll No</th>
            <th>Phone No</th>
            <th>DOB</th>
            <th>Admission</th>
            <th>Assigned Teacher</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.student_name}</td>
                <td>{student.student_class}</td>
                <td>{student.roll_number}</td>
                <td>{student.phone_number}</td>
                <td>{student.date_of_birth}</td>
                <td>{student.admission_date}</td>
                <td>{student.assigned_teacher_name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No students found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: "10px" }}>
        {Array.from({ length: count }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => fetchStudents(page)}
            disabled={page === currentPage}
            style={{ margin: "0 5px" }}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudentList;
