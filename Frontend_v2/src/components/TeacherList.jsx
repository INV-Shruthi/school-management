import React, { useEffect, useState } from "react";
import axios from "axios";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTeachers = async (pageNumber = 1) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No token found — please log in first.");
        return;
      }

      const res = await axios.get(
        `http://127.0.0.1:8000/api/teachers/?page=${pageNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTeachers(res.data.results);
      setCount(Math.ceil(res.data.count / 5));
      setCurrentPage(pageNumber);
    } catch (err) {
      console.error("Error fetching teachers:", err.response?.data || err.message);
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
        "http://127.0.0.1:8000/api/teachers/export_teachers_csv/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // important for file download
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "teachers.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error exporting teachers CSV:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchTeachers(1);
  }, []);

  return (
    <div>
      <h2>Teachers List</h2>
      <button onClick={exportCSV} style={{ marginBottom: "10px" }}>
        Export CSV
      </button>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Employee Id</th>
            <th>Subject</th>
            <th>Joining Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {teachers.length > 0 ? (
            teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td>{teacher.id}</td>
                <td>{teacher.full_name}</td>
                <td>{teacher.employee_id}</td>
                <td>{teacher.subject_specialization}</td>
                <td>{teacher.date_of_joining}</td>
                <td>{teacher.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No teachers found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: "10px" }}>
        {Array.from({ length: count }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => fetchTeachers(page)}
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

export default TeacherList;
