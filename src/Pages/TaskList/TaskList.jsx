import { useState, useRef, useEffect } from "react";
import CustomDropdown from "../Dropdown/Dropdown";
import CustomCheckbox from "../CheckBox/Checkbox"
import plus from "../../../public/plus.svg";
import checkmark from "../../../public/checkmark.png"
import Vertical from "../../../public/Vertical.png"
import Green from "../../../public/Green.png"
import Threedot from "../../../public/Threedot.svg"
import logout from "../../../public/logout.png"
import edit from "../../../public/edit.svg"
import deleteIcon from "../../../public/deleteIcon.svg"

function TaskList({ tasks, editTask, deleteTask, updateTaskStatus, openModal }) {
    const [menuOpen, setMenuOpen] = useState(null);
    const menuRef = useRef(null);

    // checkbox
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

    // Toggle selection
    const toggleSelectTask = (taskId) => {
        setSelectedTasks((prevSelected) =>
            prevSelected.includes(taskId)
                ? prevSelected.filter((id) => id !== taskId)
                : [...prevSelected, taskId]
        );
        setShowBulkActions(true);
    };

    // Delete selected tasks
    const handleDeleteSelected = () => {
        selectedTasks.forEach((taskId) => deleteTask(taskId));
        setSelectedTasks([]);
        setShowBulkActions(false);
    };

    // Bulk status update
    const handleUpdateStatus = (newStatus) => {
        // Make a copy to avoid issues with state updates during iteration
        const tasksToUpdate = [...selectedTasks];
        tasksToUpdate.forEach((taskId) => updateTaskStatus(taskId, newStatus));
        setShowStatusDropdown(false);
        setSelectedTasks([]);
        setShowBulkActions(false);
    };


    // Handle edit task
    const handleEditTask = (event, task) => {
        event.preventDefault();
        event.stopPropagation();
        setMenuOpen(null);
        // Small delay to ensure menu closes before modal opens
        setTimeout(() => {
            editTask(task);
        }, 50);
    };

    // Handle delete task
    const handleDeleteTask = (event, taskId) => {
        event.preventDefault();
        event.stopPropagation();
        setMenuOpen(null);
        // Small delay to ensure menu closes before delete operation
        setTimeout(() => {
            deleteTask(taskId);
        }, 50);
    };

    // Open menu
    const handleOpenMenu = (event, taskId) => {
        event.stopPropagation();
        setMenuOpen(menuOpen === taskId ? null : taskId);
    };

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
        <hr className="mb-[10px] mt-[53.5px] "></hr>
           {/* Table headers */}
<div className="hidden sm:flex justify-between px-2 sm:px-4">
    {/* Task name - aligned with left section */}
    <div className="sm:w-1/4 flex items-center">
        <p className="font-semibold ml-[40px]">Task name</p>
    </div>

    {/* Right side headers - aligned with right section grid */}
    <div className="grid grid-cols-4 w-3/4 gap-6">
        <p className="font-semibold text-center">Due on</p>
        <p className="font-semibold text-center">Task Status</p>
        <p className="font-semibold text-center">Task Category</p>
        <div className="w-[20px]"></div> {/* Space for the three dots menu */}
    </div>
</div>

{["To-Do", "In Progress", "Completed"].map((status) => (
    <div key={status} className="border rounded-[18px] mt-4">
        <div className={`p-3 font-semibold ${status === "To-Do" ? "bg-[#FAC3FF] rounded-t-[12px]" : status === "In Progress" ? "bg-[#85D9F1] rounded-t-[12px]" : "bg-[#CEFFCC] rounded-t-[12px]"}`}>
            {status} ({tasks.filter((task) => task.status === status).length})
        </div>
        <div className="bg-gray-100 p-2 sm:p-4 h-[330px] overflow-y-auto rounded-b-[12px]">
            {status === "To-Do" && (
                <div className="flex gap-2 cursor-pointer px-2 sm:px-4 py-2 items-center" onClick={openModal}>
                    <img src={plus} alt="Add Task" className="w-4 h-4" />
                    <p className="text-[#000000CC] font-medium">ADD TASK</p>
                </div>
            )}
            {tasks.filter((task) => task.status === status).length === 0 ? (
                <p className="text-gray-500 flex items-center justify-center text-sm mt-[126px]">No Tasks in {status}</p>
            ) : (
                tasks.filter((task) => task.status === status).map((task) => (
                    <div key={task.id} className="flex items-center justify-between my-2 hover:bg-white hover:rounded-[8px] transition-transform duration-200 hover:-translate-y-1">
                        {/* Combined container for task and three-dot menu with same hover background */}
                        <div className="flex justify-between items-center w-full bg-[#F1F1F1] hover:bg-white rounded-[8px] pr-2">
                            {/* Left Section (Checkbox, Icon, and Title) */}
                            <div className="flex items-center gap-1 sm:w-1/4 p-2 sm:p-3">
                                <CustomCheckbox
                                    isChecked={selectedTasks.includes(task.id)}
                                    onChange={() => toggleSelectTask(task.id)}
                                />

                                <img src={Vertical} alt="Divider" className="h-[20px] mx-1 ml-[7.2px]" />

                                {/* Status Icon */}
                                {status === "Completed" ? (
                                    <img src={Green} alt="Completed" className="w-[25px] h-[25px]" />
                                ) : (
                                    <img src={checkmark} alt="Pending" className="w-[25px] h-[25px]" />
                                )}

                                {/* Task Title */}
                                <p className={`font-medium ${status === "Completed" ? "line-through" : ""} truncate`}>
                                    {task.title}
                                </p>
                            </div>

                            {/* Right Section - Equal Distribution */}
                            <div className="hidden sm:grid grid-cols-4 w-3/4 gap-6">
                                {/* Due Date */}
                                <p className="font-medium text-center">{task.dueDate}</p>

                                {/* Status Dropdown */}
                                <div className="flex justify-center ">
                                    <CustomDropdown
                                        value={task.status}
                                        onChange={(newStatus) => updateTaskStatus(task.id, newStatus)}
                                    />
                                </div>

                                {/* Category */}
                                <p className="text-sm text-gray-500 text-center">{task.category}</p>
                            </div>
                            
                            {/* Three dots menu - now inside the main container for consistent hover effect */}
                            <div className="relative flex-shrink-0">
                                <button
                                    className="text-gray-600 flex items-center justify-center h-full"
                                    onClick={(e) => handleOpenMenu(e, task.id)}
                                >
                                    <img src={Threedot} alt="Menu" className="w-[20px] h-[20px]" />
                                </button>

                                {menuOpen === task.id && (
                                    <div ref={menuRef} className="absolute right-0 bg-white border rounded-[12px] shadow-md p-2 w-24 z-10">
                                        <button
                                            className="w-full text-left p-1 flex"
                                            onClick={(e) => handleEditTask(e, task)}
                                        >
                                            <div className="mr-2 mt-1">
                                                <img src={edit} alt="Edit" />
                                            </div>
                                            Edit
                                        </button>

                                        <button
                                            className="flex w-full text-left p-1 text-red-600"
                                            onClick={(e) => handleDeleteTask(e, task.id)}
                                        >
                                            <div className="mr-2 mt-1">
                                                <img src={deleteIcon} alt="Delete" />
                                            </div>
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
))}

{/* Bulk actions bar */}
{selectedTasks.length > 0 && (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 bg-[#1a1a1a] text-white px-3 sm:px-4 py-2 rounded-xl shadow-lg z-20">
        <p className="px-2 sm:px-4 py-1 sm:py-2 border rounded-full text-sm sm:text-base">{selectedTasks.length} Tasks Selected</p>
        <button className="px-2 sm:px-4 py-1 sm:py-2 border rounded-full text-sm sm:text-base" onClick={() => setShowStatusDropdown(!showStatusDropdown)}>Status</button>
        <button className="px-2 sm:px-4 py-1 sm:py-2 border bg-[#FF353524] rounded-full text-[#E13838] text-sm sm:text-base" onClick={handleDeleteSelected}>Delete</button>
    </div>
)}

{/* Status dropdown */}
{showStatusDropdown && (
    <div className="fixed bottom-20 text-white left-1/2 transform -translate-x-1/2 bg-black border-white shadow-md rounded-[12px] p-2 z-20">
        {["To-Do", "In Progress", "Completed"].map((status) => (
            <button
                key={status}
                className="block w-full text-left p-2"
                onClick={() => handleUpdateStatus(status)}
            >
                {status}
            </button>
        ))}
    </div>
)}
        </>




    );
}

export default TaskList;