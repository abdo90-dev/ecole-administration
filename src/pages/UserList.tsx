import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Plus, Search, Edit2, Trash2, Save, X, GraduationCap } from 'lucide-react';
import { get, getDatabase, onValue, push, ref, remove, update } from 'firebase/database';
import { db } from '../environment';

interface Student {
  id: number;
  name: string;
  email: string;
  studentId: string;
  class: string;
  speciality: string;
  year: string;
  phone: string;
}

export default function UserList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSpeciality, setSelectedSpeciality] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({});
  const [isAddingStudent, setIsAddingStudent] = useState(false);

  const studentsPerPage = 5;
  const classes = ['L1', 'L2', 'L3', 'M1', 'M2'];
  const specialities = ['Informatique', 'Réseaux', 'Cybersécurité', 'Intelligence Artificielle', 'Data Science'];
  const years = ['2023-2024', '2024-2025'];
const fetchUsers = (setStudents: React.Dispatch<React.SetStateAction<Student[]>>, setFilteredStudents: React.Dispatch<React.SetStateAction<Student[]>>) => {
  const db = getDatabase();
  const usersRef = ref(db, 'students');


    onValue(usersRef, (snapshot) => {
    const data = snapshot.val();
    const users: Student[] = data ? Object.values(data) : [];
    console.log('Data from Firebase:', data);
    
    setStudents(users);
    setFilteredStudents(users);
  });
};
  useEffect(() => {
    fetchUsers(setStudents, setFilteredStudents);
  }, []);
  // Simuler des données d'étudiants
  // useEffect(() => {
  //   const mockStudents: Student[] = Array.from({ length: 20 }, (_, i) => ({
  //     id: i + 1,
  //     name: `Étudiant ${i + 1}`,
  //     email: `etudiant${i + 1}@universite.fr`,
  //     studentId: `STU${String(i + 1).padStart(5, '0')}`,
  //     class: classes[Math.floor(Math.random() * classes.length)],
  //     speciality: specialities[Math.floor(Math.random() * specialities.length)],
  //     year: years[Math.floor(Math.random() * years.length)],
  //     phone: `+33 6${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`
  //   }));
  //   setStudents(mockStudents);
  //   setFilteredStudents(mockStudents);
  // }, []);

  useEffect(() => {
    let result = students;
    
    if (searchTerm) {
      result = result.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedClass !== 'all') {
      result = result.filter(student => student.class === selectedClass);
    }

    if (selectedSpeciality !== 'all') {
      result = result.filter(student => student.speciality === selectedSpeciality);
    }

    if (selectedYear !== 'all') {
      result = result.filter(student => student.year === selectedYear);
    }
    
    setFilteredStudents(result);
    setCurrentPage(1);
  }, [searchTerm, selectedClass, selectedSpeciality, selectedYear, students]);

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handleAddStudent = async () => {
    if (newStudent.name && newStudent.email && newStudent.class && newStudent.speciality && newStudent.year) {
      const newId = Math.max(...students.map(s => s.id)) + 1;
      const studentToAdd = {
        id: newId,
        name: newStudent.name,
        email: newStudent.email,
        studentId: `STU${String(newId).padStart(5, '0')}`,
        class: newStudent.class,
        speciality: newStudent.speciality,
        year: newStudent.year,
        phone: newStudent.phone || ''
      } as Student;
      try {
        // Add student to Realtime Database
        const studentRef = ref(db, 'students');
        await push(studentRef, studentToAdd);
  
        // Update local state
        setStudents([...students, studentToAdd]);
        setIsAddingStudent(false);
        setNewStudent({});
        alert('Student added successfully');
      } catch (error) {
        console.error('Error adding student:', error);
        alert('Failed to add student');
      }

    }
  };

  const handleUpdateStudent = async () => {
    if (editingStudent) {
      const db = getDatabase();
      const studentsRef = ref(db, "students");
  
      try {
        // Step 1: Fetch all students to find the Firebase key by studentId
        const snapshot = await get(studentsRef);
        if (snapshot.exists()) {
          const studentsData = snapshot.val();
  
          // Step 2: Find the Firebase key where studentId matches
          const firebaseKey = Object.keys(studentsData).find(
            (key) => studentsData[key].studentId === editingStudent.studentId
          );
  
          if (!firebaseKey) {
            console.error("Student not found with studentId:", editingStudent.studentId);
            return;
          }
  
          // Step 3: Update the specific student using the Firebase key
          const studentRef = ref(db, `students/${firebaseKey}`);
  
          await update(studentRef, editingStudent);
          console.log("Student updated successfully!");
  
          // Step 4: Update local state
          setStudents(
            students.map((student) =>
              student.studentId === editingStudent.studentId ? editingStudent : student
            )
          );
  
          setEditingStudent(null);
        } else {
          console.error("No students found in the database.");
        }
      } catch (error) {
        console.error("Error updating student:", error);
      }
    }
  };
  
  

  const handleDeleteStudent = async (studentId: string) => {
    const db = getDatabase();
    const studentsRef = ref(db, "students");
  
    try {
      // Step 1: Fetch all students to find the Firebase key by studentId
      const snapshot = await get(studentsRef);
      if (snapshot.exists()) {
        const studentsData = snapshot.val();
  
        // Step 2: Find the Firebase key where studentId matches
        const firebaseKey = Object.keys(studentsData).find(
          (key) => studentsData[key].studentId === studentId
        );
  
        if (!firebaseKey) {
          console.error("Student not found with studentId:", studentId);
          return;
        }
  
        // Step 3: Delete the student using the Firebase key
        const studentRef = ref(db, `students/${firebaseKey}`);
        await remove(studentRef);
        console.log("Student deleted successfully!");
  
        // Step 4: Update local state to remove the student from the list
        setStudents(students.filter((student) => student.studentId !== studentId));
      } else {
        console.error("No students found in the database.");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 mt-16">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <GraduationCap size={32} className="text-blue-600" />
            <h1 className="text-3xl font-bold">Gestion des Étudiants</h1>
          </div>
          <button
            onClick={() => setIsAddingStudent(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-blue-700"
          >
            <Plus size={20} />
            <span>Ajouter un étudiant</span>
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1 md:col-span-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-md"
              />
            </div>
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border rounded-md px-4 py-2"
          >
            <option value="all">Toutes les classes</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
          <select
            value={selectedSpeciality}
            onChange={(e) => setSelectedSpeciality(e.target.value)}
            className="border rounded-md px-4 py-2"
          >
            <option value="all">Toutes les spécialités</option>
            {specialities.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border rounded-md px-4 py-2"
          >
            <option value="all">Toutes les années</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N° Étudiant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Téléphone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Classe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Spécialité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Année
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isAddingStudent && (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-500">Auto-généré</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={newStudent.name || ''}
                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                        placeholder="Nom"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="email"
                        value={newStudent.email || ''}
                        onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                        placeholder="Email"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="tel"
                        value={newStudent.phone || ''}
                        onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                        placeholder="Téléphone"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={newStudent.class || ''}
                        onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      >
                        <option value="">Sélectionner...</option>
                        {classes.map(cls => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={newStudent.speciality || ''}
                        onChange={(e) => setNewStudent({ ...newStudent, speciality: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      >
                        <option value="">Sélectionner...</option>
                        {specialities.map(spec => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={newStudent.year || ''}
                        onChange={(e) => setNewStudent({ ...newStudent, year: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      >
                        <option value="">Sélectionner...</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={handleAddStudent}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Save size={20} />
                        </button>
                        <button
                          onClick={() => setIsAddingStudent(false)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
                {currentStudents.map(student => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.studentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingStudent?.id === student.id ? (
                        <input
                          type="text"
                          value={editingStudent.name}
                          onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        student.name
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingStudent?.id === student.id ? (
                        <input
                          type="email"
                          value={editingStudent.email}
                          onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        student.email
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingStudent?.id === student.id ? (
                        <input
                          type="tel"
                          value={editingStudent.phone}
                          onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        student.phone
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingStudent?.id === student.id ? (
                        <select
                          value={editingStudent.class}
                          onChange={(e) => setEditingStudent({ ...editingStudent, class: e.target.value })}
                          className="border rounded px-2 py-1 w-full"
                        >
                          {classes.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {student.class}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingStudent?.id === student.id ? (
                        <select
                          value={editingStudent.speciality}
                          onChange={(e) => setEditingStudent({ ...editingStudent, speciality: e.target.value })}
                          className="border rounded px-2 py-1 w-full"
                        >
                          {specialities.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          {student.speciality}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingStudent?.id === student.id ? (
                        <select
                          value={editingStudent.year}
                          onChange={(e) => setEditingStudent({ ...editingStudent, year: e.target.value })}
                          className="border rounded px-2 py-1 w-full"
                        >
                          {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                          {student.year}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {editingStudent?.id === student.id ? (
                          <>
                            <button
                              onClick={handleUpdateStudent}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Save size={20} />
                            </button>
                            <button
                              onClick={() => setEditingStudent(null)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X size={20} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingStudent(student)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit2 size={20} />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student.studentId)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={20} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 flex justify-between items-center border-t">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-md disabled:opacity-50"
            >
              Précédent
            </button>
            <span>
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-md disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}