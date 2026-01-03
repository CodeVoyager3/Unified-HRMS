import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, CheckCircle, AlertTriangle, Camera, DollarSign, X, Check, Eye, User } from 'lucide-react';

const SISpecialTasks = ({ language = 'en', currentUser }) => {
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [fineAmount, setFineAmount] = useState('');
    const [showFineInput, setShowFineInput] = useState(false);

    // Form State
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        assignedTo: '',
        deadline: ''
    });

    const fetchTasks = async () => {
        if (!currentUser?.Ward) return;
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/task/ward/${currentUser.Ward}`);
            const data = await response.json();
            if (data.success) setTasks(data.tasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        if (!currentUser?.Ward) return;
        try {
            // Reusing the robust payroll route we fixed earlier to get employee list
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/payroll/ward/${currentUser.Ward}`);
            const data = await response.json();
            if (data.success) setEmployees(data.employees);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchEmployees();
    }, [currentUser]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/task/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newTask,
                    assignedBy: currentUser.employeeId,
                    ward: currentUser.Ward
                })
            });
            const data = await response.json();
            if (data.success) {
                setShowCreateModal(false);
                setNewTask({ title: '', description: '', assignedTo: '', deadline: '' });
                fetchTasks();
                alert(language === 'en' ? 'Task assigned successfully' : 'कार्य सफलतापूर्वक सौंपा गया');
            }
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    const handleVerify = async (taskId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/task/verify/${taskId}`, { method: 'PUT' });
            if (response.ok) {
                fetchTasks();
                setSelectedTask(null);
            }
        } catch (error) {
            console.error("Error verifying task:", error);
        }
    };

    const handleFine = async () => {
        if (!fineAmount || !selectedTask) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/task/fine/${selectedTask._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: fineAmount })
            });
            const data = await response.json();
            if (data.success) {
                alert(`Fine of ₹${fineAmount} has been levied and deducted from payroll.`);
                fetchTasks();
                setSelectedTask(null);
                setFineAmount('');
                setShowFineInput(false);
            }
        } catch (error) {
            console.error("Error levying fine:", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
            case 'Verified': return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
            case 'Fined': return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
            default: return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
        }
    };

    const formatDeadline = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = date - now;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

        if (days < 0) return { text: 'Overdue', color: 'text-red-500' };
        if (days === 0) return { text: 'Today', color: 'text-amber-500' };
        return { text: `${days} days left`, color: 'text-gray-500' };
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {language === 'en' ? 'Special Tasks' : 'विशेष कार्य'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {language === 'en' ? 'Assign ad-hoc tasks, verify work, and manage penalties' : 'तदर्थ कार्य सौंपें, कार्य सत्यापित करें और दंड प्रबंधित करें'}
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#6F42C1] hover:bg-[#5a32a3] text-white rounded-xl shadow-lg shadow-purple-500/20 transition-all font-medium"
                >
                    <Plus size={18} />
                    {language === 'en' ? 'Assign Task' : 'कार्य सौंपें'}
                </button>
            </div>

            {/* Task Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar p-2">
                {tasks.map(task => {
                    const deadlineInfo = formatDeadline(task.deadline);
                    const assignee = employees.find(e => e.id === task.assignedTo);

                    return (
                        <div key={task._id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(task.status)}`}>
                                    {task.status}
                                </span>
                                <span className={`text-xs font-medium flex items-center gap-1 ${deadlineInfo.color}`}>
                                    <Clock size={12} /> {deadlineInfo.text}
                                </span>
                            </div>

                            <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-1">{task.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{task.description}</p>

                            <div className="flex items-center gap-3 mb-4 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                                    {assignee?.name?.[0] || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{assignee?.name || task.assignedTo}</p>
                                    <p className="text-xs text-gray-500 truncate">{assignee?.role || 'Employee'}</p>
                                </div>
                            </div>

                            <div className="mt-auto border-t border-gray-100 dark:border-gray-700 pt-4 flex gap-2">
                                <button
                                    onClick={() => setSelectedTask(task)}
                                    className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Eye size={16} /> Details
                                </button>
                                {task.status === 'Completed' && (
                                    <button
                                        onClick={() => setSelectedTask(task)}
                                        className="flex-1 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={16} /> Verify
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold dark:text-white">Assign New Task</h3>
                            <button onClick={() => setShowCreateModal(false)}><X className="dark:text-white" /></button>
                        </div>
                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Title</label>
                                <input required className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g. VIP Visit Cleaning" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Description</label>
                                <textarea required className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows="3" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Assign To</label>
                                <select required className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newTask.assignedTo} onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}>
                                    <option value="">Select Employee</option>
                                    {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.role})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Deadline</label>
                                <input required type="datetime-local" className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newTask.deadline} onChange={e => setNewTask({ ...newTask, deadline: e.target.value })} />
                            </div>
                            <button className="w-full py-3 bg-[#6F42C1] text-white rounded-xl font-bold mt-4">Assign Task</button>
                        </form>
                    </div>
                </div>
            )}

            {/* View/Verify Modal */}
            {selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                            <h3 className="text-lg font-bold dark:text-white">Task Details</h3>
                            <button onClick={() => { setSelectedTask(null); setShowFineInput(false); }}><X className="dark:text-white" /></button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <h2 className="text-xl font-bold dark:text-white">{selectedTask.title}</h2>
                            <p className="text-gray-600 dark:text-gray-300">{selectedTask.description}</p>

                            {selectedTask.proofImage ? (
                                <div className="mt-4">
                                    <p className="text-sm font-bold mb-2 dark:text-white">Proof of Work</p>
                                    <img src={selectedTask.proofImage} alt="Proof" className="w-full h-48 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-700 mb-3" />
                                    {selectedTask.completionDescription && (
                                        <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Employee Notes</p>
                                            <p className="text-sm text-gray-800 dark:text-white italic">"{selectedTask.completionDescription}"</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-900/50 rounded-xl text-center text-gray-500 text-sm italic">
                                    No proof uploaded yet.
                                </div>
                            )}

                            {selectedTask.status === 'Fined' && (
                                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl flex items-center gap-2 font-bold">
                                    <AlertTriangle size={20} />
                                    Fined Amount: ₹{selectedTask.fineAmount}
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 flex gap-3 border-t border-gray-100 dark:border-gray-700">
                            {selectedTask.status !== 'Verified' && selectedTask.status !== 'Fined' && (
                                <>
                                    <button
                                        onClick={() => handleVerify(selectedTask._id)}
                                        className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-500/20"
                                    >
                                        Verify & Close
                                    </button>

                                    {!showFineInput ? (
                                        <button
                                            onClick={() => setShowFineInput(true)}
                                            className="flex-1 py-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl font-bold border border-red-200"
                                        >
                                            Levy Fine
                                        </button>
                                    ) : (
                                        <div className="flex-1 flex gap-2">
                                            <input
                                                type="number"
                                                placeholder="Amount"
                                                className="w-24 px-2 rounded-lg border border-red-300 outline-none"
                                                value={fineAmount}
                                                onChange={e => setFineAmount(e.target.value)}
                                            />
                                            <button
                                                onClick={handleFine}
                                                className="flex-1 bg-red-600 text-white rounded-lg font-bold text-sm"
                                            >
                                                Confirm Fine
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                            {(selectedTask.status === 'Verified' || selectedTask.status === 'Fined') && (
                                <div className="w-full text-center text-gray-500 font-medium py-2">
                                    Task Closed ({selectedTask.status})
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SISpecialTasks;
