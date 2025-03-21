import { useState, useRef, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import plus from "../../../public/plus.svg";
import edit from "../../../public/edit.svg";
import deleteIcon from "../../../public/deleteIcon.svg";
import Threedot from "../../../public/Threedot.svg";

const TaskTypes = { TASK: "task" };

// Individual Task Component
function Task({ task, editTask, deleteTask }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    
    const [{ isDragging }, drag] = useDrag({
        type: TaskTypes.TASK,
        item: { id: task.id, status: task.status },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    
    // Handle edit task
    const handleEditTask = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setMenuOpen(false);
        // Small delay to ensure menu closes before modal opens
        setTimeout(() => {
            editTask(task);
        }, 50);
    };

    // Handle delete task
    const handleDeleteTask = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setMenuOpen(false);
        // Small delay to ensure menu closes before delete operation
        setTimeout(() => {
            deleteTask(task.id);
        }, 50);
    };
    
    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div
            ref={drag}
            className={`p-3 bg-white shadow-md rounded-[12px] w-full sm:w-[300px] h-[110px] 
            ${isDragging ? "opacity-50" : ""} mb-3 flex flex-col justify-between`}
        >
            {/* Title and Three-dot Menu */}
            <div className="flex items-center justify-between">
                <p
                    className={`font-medium truncate ${task.status === "Completed" ? "line-through text-black" : ""}`}
                    title={task.title} // Shows full title on hover
                >
                      {task.title.length > 20 ? `${task.title.substring(0, 20)}...` : task.title}
                </p>
                <div className="relative">
                    <img 
                        src={Threedot} 
                        className="w-5 h-5 cursor-pointer" 
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(!menuOpen);
                        }}
                    />
                    
                    {menuOpen && (
                        <div ref={menuRef} className="absolute right-0 bg-white border rounded-[12px] shadow-md p-2 w-24 z-10">
                            <button
                                className="w-full text-left p-1 flex"
                                onClick={handleEditTask}
                            >
                                <div className="mr-2 mt-1">
                                    <img src={edit} alt="Edit" />
                                </div>
                                Edit
                            </button>

                            <button
                                className="flex w-full text-left p-1 text-red-600"
                                onClick={handleDeleteTask}
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

            {/* Task Footer - Category and Date aligned at the bottom */}
            <div className="flex justify-between items-end mt-auto">
                {task.category && (
                    <p className="text-xs bg-gray-200 inline-block px-2 py-1 rounded">
                        {task.category}
                    </p>
                )}
                <p className="text-sm text-gray-500">{task.dueDate}</p>
            </div>
        </div>
    );
}

// Task Group Component
function TaskGroup({ status, tasks, moveTask, editTask, deleteTask }) {
    const [{ isOver }, drop] = useDrop({
        accept: TaskTypes.TASK,
        drop: (item) => moveTask(item.id, status),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    return (
        <div
            ref={drop}
            className={`p-4 border rounded-lg w-full sm:w-[336px] h-[566px] 
            ${isOver ? "bg-gray-200" : "bg-gray-100"}`}
        >
            {/* Status Header */}
            <div
                className={`font-semibold text-lg mb-3 p-2 rounded text-center 
                ${status === "To-Do" ? "bg-[#FAC3FF]" :
                        status === "In Progress" ? "bg-[#85D9F1]" :
                            "bg-[#A2D6A0]"} w-fit`}
            >
                {status} ({tasks.length})
            </div>

            {/* Task List */}
            <div className="overflow-y-auto h-[450px]">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <Task 
                            key={task.id} 
                            task={task} 
                            editTask={editTask} 
                            deleteTask={deleteTask} 
                        />
                    ))
                ) : (
                    <p className="text-gray-500 text-center mt-[200px]">
                        No tasks in {status}
                    </p>
                )}
            </div>
        </div>
    );
}

// TaskBoard Component
function TaskBoard({ tasks, updateTaskStatus, editTask, deleteTask }) {
    const statuses = ["To-Do", "In Progress", "Completed"];

    const moveTask = (taskId, newStatus) => {
        updateTaskStatus(taskId, newStatus);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col sm:flex-row gap-4 p-5 overflow-x-auto">
                {statuses.map((status) => (
                    <TaskGroup
                        key={status}
                        status={status}
                        tasks={tasks.filter((task) => task.status === status)}
                        moveTask={moveTask}
                        editTask={editTask}
                        deleteTask={deleteTask}
                    />
                ))}
            </div>
        </DndProvider>
    );
}

export default TaskBoard;