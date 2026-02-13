import { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, Users, CalendarCheck, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import './index.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            if (activeTab === 'dashboard' || activeTab === 'employees') {
                const empRes = await axios.get(`${API_BASE}/employees`);
                setEmployees(empRes.data);
            }
            if (activeTab === 'dashboard' || activeTab === 'attendance') {
                const attRes = await axios.get(`${API_BASE}/attendance`);
                setAttendance(attRes.data);
            }
        } catch (err) {
            setError('Failed to fetch data. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const addEmployee = async (employee) => {
        try {
            await axios.post(`${API_BASE}/employees`, employee);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to add employee');
        }
    };

    const deleteEmployee = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee? All their attendance records will also be deleted.')) {
            try {
                await axios.delete(`${API_BASE}/employees/${id}`);
                fetchData();
            } catch (err) {
                alert('Failed to delete employee');
            }
        }
    };

    const markAttendance = async (record) => {
        try {
            await axios.post(`${API_BASE}/attendance`, record);
            fetchData();
        } catch (err) {
            alert('Failed to mark attendance');
        }
    };

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="logo">
                    <LayoutDashboard size={28} />
                    <span>HRMS Lite</span>
                </div>
                <nav className="nav">
                    <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                        <LayoutDashboard size={20} />
                        Dashboard
                    </div>
                    <div className={`nav-item ${activeTab === 'employees' ? 'active' : ''}`} onClick={() => setActiveTab('employees')}>
                        <Users size={20} />
                        Employees
                    </div>
                    <div className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>
                        <CalendarCheck size={20} />
                        Attendance
                    </div>
                </nav>
            </aside>

            <main className="main-content">
                {error && <div className="card" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>{error}</div>}

                {activeTab === 'dashboard' && <Dashboard employees={employees} attendance={attendance} />}
                {activeTab === 'employees' && <EmployeeManagement employees={employees} onAdd={addEmployee} onDelete={deleteEmployee} loading={loading} />}
                {activeTab === 'attendance' && <AttendanceManagement employees={employees} attendance={attendance} onMark={markAttendance} loading={loading} />}
            </main>
        </div>
    );
}

function Dashboard({ employees, attendance }) {
    const totalEmployees = employees.length;
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.filter(a => a.date === today);
    const presentToday = todayAttendance.filter(a => a.status === 'Present').length;

    return (
        <div>
            <h1 style={{ marginBottom: '1.5rem' }}>Dashboard Overview</h1>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Total Employees</div>
                    <div className="stat-value">{totalEmployees}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Present Today ({today})</div>
                    <div className="stat-value">{presentToday}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Attendance Rate Today</div>
                    <div className="stat-value">{totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 0}%</div>
                </div>
            </div>

            <div className="card">
                <h2 className="card-title">Recent Attendance</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.slice(0, 5).map(record => (
                            <tr key={record.id}>
                                <td>{record.full_name}</td>
                                <td>{record.date}</td>
                                <td>
                                    <span className={record.status === 'Present' ? 'status-present' : 'status-absent'}>
                                        {record.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {attendance.length === 0 && (
                            <tr><td colSpan="3" className="empty-state">No attendance records yet</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function EmployeeManagement({ employees, onAdd, onDelete, loading }) {
    const [showAdd, setShowAdd] = useState(false);
    const [formData, setFormData] = useState({ employee_id: '', full_name: '', email: '', department: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        setFormData({ employee_id: '', full_name: '', email: '', department: '' });
        setShowAdd(false);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1>Employee Management</h1>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setShowAdd(!showAdd)}>
                    <Plus size={18} /> Add Employee
                </button>
            </div>

            {showAdd && (
                <div className="card">
                    <h2 className="card-title">Add New Employee</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Employee ID</label>
                                <input required value={formData.employee_id} onChange={e => setFormData({ ...formData, employee_id: e.target.value })} placeholder="e.g. EMP001" />
                            </div>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input required value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} placeholder="e.g. John Doe" />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="e.g. john@example.com" />
                            </div>
                            <div className="form-group">
                                <label>Department</label>
                                <select required value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                                    <option value="">Select Department</option>
                                    <option value="HR">HR</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Marketing">Marketing</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                            <button type="submit" className="btn-primary">Save Employee</button>
                            <button type="button" className="btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card">
                <h2 className="card-title">All Employees</h2>
                {loading ? <div className="empty-state">Loading...</div> : (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp.employee_id}>
                                    <td>{emp.employee_id}</td>
                                    <td>{emp.full_name}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.department}</td>
                                    <td>
                                        <button className="btn-danger" onClick={() => onDelete(emp.employee_id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {employees.length === 0 && (
                                <tr><td colSpan="5" className="empty-state">No employees found</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

function AttendanceManagement({ employees, attendance, onMark, loading }) {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    return (
        <div>
            <h1 style={{ marginBottom: '1.5rem' }}>Attendance Tracking</h1>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 className="card-title" style={{ marginBottom: 0 }}>Mark Attendance</h2>
                    <div className="form-group" style={{ marginBottom: 0, width: '200px' }}>
                        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Department</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(emp => {
                            const record = attendance.find(a => a.employee_id === emp.employee_id && a.date === selectedDate);
                            return (
                                <tr key={emp.employee_id}>
                                    <td>{emp.full_name}</td>
                                    <td>{emp.department}</td>
                                    <td>
                                        {record ? (
                                            <span className={record.status === 'Present' ? 'status-present' : 'status-absent'}>
                                                {record.status}
                                            </span>
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)' }}>Not marked</span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn-outline" style={{ padding: '0.4rem 0.8rem', borderColor: 'var(--success)', color: 'var(--success)' }}
                                                onClick={() => onMark({ employee_id: emp.employee_id, date: selectedDate, status: 'Present' })}>
                                                <CheckCircle size={16} /> Present
                                            </button>
                                            <button className="btn-outline" style={{ padding: '0.4rem 0.8rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                                                onClick={() => onMark({ employee_id: emp.employee_id, date: selectedDate, status: 'Absent' })}>
                                                <XCircle size={16} /> Absent
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {employees.length === 0 && (
                            <tr><td colSpan="4" className="empty-state">Add employees first to mark attendance</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="card">
                <h2 className="card-title">Attendance History</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Employee</th>
                            <th>Department</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.map(record => (
                            <tr key={record.id}>
                                <td>{record.date}</td>
                                <td>{record.full_name}</td>
                                <td>{record.department}</td>
                                <td>
                                    <span className={record.status === 'Present' ? 'status-present' : 'status-absent'}>
                                        {record.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {attendance.length === 0 && (
                            <tr><td colSpan="4" className="empty-state">No attendance records yet</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default App;
