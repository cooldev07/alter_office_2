
import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import TaskModal from "./TaskModal";
import TaskList from "../Pages/TaskList/TaskList";
// import TaskGroupPage from "../Pages/TaskGroup/TaskGroup";
import Filter from "../Pages/Filter/Filter";
import UserProfile from "../Pages/UserProfile/UserProfile";
import LogoutButton from "../Pages/LogoutButton/LogoutButton";
import Title from "../../public/Title.png";
import List from "../../public/List.png";
import Group from "../../public/Group.png";
import NotFound from "../../public/NotFound.png";
import { Navigate, useLocation } from "react-router-dom";
import TaskBoard from "./TaskGroup/TaskBoard";

function Dashboard({ user, handleLogout }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [dueDateFilter, setDueDateFilter] = useState("");

    // Open modal for new task
    const openModal = () => {
        setSelectedTask(null);
        setIsModalOpen(true);
    };

    // Save new/edited task
    const handleSaveTask = (taskData) => {
        if (selectedTask) {
            setTasks(tasks.map((t) => (t.id === selectedTask.id ? taskData : t)));
        } else {
            setTasks([...tasks, { ...taskData, id: Date.now() }]);
        }
        setIsModalOpen(false);
    };

    // Delete task
    const deleteTask = (taskId) => {
        setTasks(tasks.filter((t) => t.id !== taskId));
    };

    // Update task status
    const updateTaskStatus = (taskId, newStatus) => {
        setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)));
    };

    // Filtered & Sorted Tasks
    // Filtered & Sorted Tasks
    const filteredTasks = tasks
        .filter((task) =>
            (!searchQuery || task.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
            // Case-insensitive comparison
            (!categoryFilter || task.category.toUpperCase() === categoryFilter) &&
            (!dueDateFilter || task.dueDate === dueDateFilter)
        )
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    // Clear filters
    const clearFilters = () => {
        setSearchQuery("");
        setCategoryFilter("");
        setDueDateFilter("");
    };


    const updateTaskCategory = (taskId, newCategory) => {
        setTasks(tasks.map(task => task.id === taskId ? { ...task, category: newCategory } : task));
    };
    return (
        <div className="min-h-screen p-6">
            {/* Top Section (Static) */}
            {/* Top Section with Responsive Adjustments */}
            {/* Top Section - Single Row Layout */}
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <img src={Title} alt="Title image" className="max-w-[100px] sm:max-w-[150px] md:max-w-full mr-2 sm:mr-[30px]" />
                </div>
                <UserProfile user={user} className="scale-90 sm:scale-100 ml-2 sm:ml-[38px]" />
            </div>


            <div className="flex justify-between items-center mt-4">
                {/* Left: List & Group Section */}
                <div className="flex gap-6">
                    <div
                        className={`flex items-center cursor-pointer  ${location.pathname === "/dashboard/list" ? "font-bold border-b-2 border-[#000000]" : ""}`}
                        onClick={() => navigate("/dashboard/list")}
                    >
                        <img src={List} alt="List" className="w-[16px] h-[16px]" />
                        <p className="ml-2">List</p>
                    </div>
                    <div
                        className={`flex items-center cursor-pointer  ${location.pathname === "/dashboard/group" ? "font-bold border-b-2 border-[#000000]" : ""}`}
                        onClick={() => navigate("/dashboard/group")}
                    >
                        <img src={Group} alt="Group" className="w-[16px] h-[16px]" />
                        <p className="ml-2">Group</p>
                    </div>
                </div>

                {/* Right: Logout Button */}
                <LogoutButton handleLogout={handleLogout} />
            </div>

            {/* Filters (Static) */}
            <Filter
                openModal={openModal}
                setSearchQuery={setSearchQuery}
                setCategoryFilter={setCategoryFilter}
                setDueDateFilter={setDueDateFilter}
                clearFilters={clearFilters}
                searchQuery={searchQuery}
                categoryFilter={categoryFilter}
                dueDateFilter={dueDateFilter}
            />

            {/* Routing for List and Group Page */}
            {/* Routing for List and Group Page */}
            <Routes>
                {/* Redirect /dashboard to /dashboard/list by default */}
                <Route path="" element={<Navigate to="list" replace />} />

                <Route
                    path="list"
                    element={filteredTasks.length === 0 && (searchQuery || categoryFilter || dueDateFilter) ? (
                        <>
                            <div className="mt-[100px] flex justify-center items-center ">
                                <img src={NotFound} alt="Not Found" className="w-[430px] h-[309px]" />
                            </div>
                            <div className="flex justify-center items-center">
                                <button className="ml-2 mt-[20px] text-white px-4 py-2 rounded-full bg-[#7B1984]" onClick={clearFilters}>Clear Filters</button>
                            </div>
                        </>
                    ) : (
                        <TaskList
                            tasks={filteredTasks}
                            editTask={(task) => {
                                setSelectedTask(task);
                                setIsModalOpen(true);
                            }}
                            deleteTask={deleteTask}
                            updateTaskStatus={updateTaskStatus}
                            openModal={openModal}
                        />
                    )}
                />
                <Route
                    path="group"
                    element={
                        <TaskBoard
                            tasks={filteredTasks}
                            updateTaskStatus={updateTaskStatus}
                            openModal={openModal}
                            editTask={(task) => {
                                setSelectedTask(task);
                                setIsModalOpen(true);
                            }}
                            deleteTask={deleteTask}
                        />
                    }
                />
            </Routes>
            {isModalOpen && <TaskModal onClose={() => setIsModalOpen(false)} onSave={handleSaveTask} task={selectedTask} />}
        </div>
    );
}

export default Dashboard;
