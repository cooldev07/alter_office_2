import { useState, useEffect } from "react";
import CloseIcon from "../../public/CloseIcon.svg";
import CustomDatePicker from "../Pages/CustomDatePicker/CustomDatePicker";

const TaskModal = ({ onClose, onSave, task }) => {
    const [title, setTitle] = useState(task ? task.title : "");
    const [description, setDescription] = useState(task ? task.description || "" : "");
    const [category, setCategory] = useState(task ? task.category : "Work");
    const [dueDate, setDueDate] = useState(task ? task.dueDate : "");
    const [status, setStatus] = useState(task ? task.status : "To-Do");
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [createdDate, setCreatedDate] = useState(task?.createdDate || new Date().toLocaleString());
    const [lastModifiedDate, setLastModifiedDate] = useState(task?.lastModifiedDate || new Date().toLocaleString());
    const [activeTab, setActiveTab] = useState("details"); // Mobile tabs

    useEffect(() => {
        if (task) {
            setLastModifiedDate(new Date().toLocaleString()); // Update modified date when editing
        }
    }, [title, description, category, dueDate, status]);

    const validateForm = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = "Task title is required!";
        if (!description.trim()) newErrors.description = "Description is required!";
        if (!category) newErrors.category = "Task category is required!";
        if (!dueDate) newErrors.dueDate = "Due date is required!";
        if (!status) newErrors.status = "Task status is required!";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSave({
                id: task?.id || Date.now(),
                title,
                description,
                category,
                dueDate,
                status,
                createdDate,
                lastModifiedDate: new Date().toLocaleString() // Save last modified date
            });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-[20px] w-full max-w-[900px] relative flex flex-col md:flex-row max-h-[875px] h-[675px] overflow-hidden">

                {/* Show Mobile Tabs ONLY when updating a task */}
                {task && (
                    <div className="sm:hidden flex justify-around border-b border-gray-300">
                        <button
                            className={`w-1/3 py-2 ${activeTab === "details" ? "border-b-2 border-[#7B1984] text-white rounded-[20px] mt-[20px] font-semibold p-2 bg-black" : "text-gray-500"}`}
                            onClick={() => setActiveTab("details")}
                        >
                            Details
                        </button>
                        <button
                            className={`w-1/2 py-2 ${activeTab === "activity" ? "border-b-2 border-[#7B1984] text-white rounded-[20px] mt-[20px] bg-black font-semibold" : "text-gray-500"}`}
                            onClick={() => setActiveTab("activity")}
                        >
                            Activity
                        </button>
                    </div>
                )}

                {/* Left Side - Task Form (Mobile: Show only when Details tab is active) */}
                {(!task || activeTab === "details") && (
                    <div className="flex flex-col w-full p-4 md:p-6 h-full">
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl text-[#2F2F2F] font-bold">
                                {task ? "Edit Task" : "Create Task"}
                            </h2>
                            <img
                                src={CloseIcon}
                                alt="Close"
                                className="w-[24px] h-[33px] cursor-pointer"
                                onClick={onClose}
                            />
                        </div>

                        {/* Scrollable Form */}
                        <div className="overflow-y-auto flex-grow pb-20">
                            <hr className="mt-[20px]" />
                            <div className="mb-4 mt-[10px]">
                                <input
                                    type="text"
                                    placeholder="Task Title"
                                    className={`w-full border p-2 rounded ${errors.title ? 'border-red-500' : ''}`}
                                    value={title}
                                    maxLength={200}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                            </div>

                            <div className="mb-4">
                                <textarea
                                    placeholder="Description"
                                    className={`w-full border p-2 rounded min-h-[80px] ${errors.description ? 'border-red-500' : ''}`}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                            </div>

                            {/* Categories & Status */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <p className="text-[#00000099] mb-2">Task Category*</p>
                                    <div className="flex gap-2">
                                        <button
                                            className={`px-4 py-2 rounded-[41px] ${category === "Work" ? "bg-[#7B1984] text-white" : "bg-gray-200"}`}
                                            onClick={() => setCategory("Work")}
                                        >
                                            Work
                                        </button>
                                        <button
                                            className={`px-4 py-2 rounded-[41px] ${category === "Personal" ? "bg-[#7B1984] text-white" : "bg-gray-200"}`}
                                            onClick={() => setCategory("Personal")}
                                        >
                                            Personal
                                        </button>
                                    </div>
                                </div>

                                <div className="relative z-20">
                                    <p className="text-[#00000099] mb-2">Due on*</p>
                                    <CustomDatePicker
                                        value={dueDate}
                                        className={`border p-2 rounded ${errors.dueDate ? 'border-red-500' : ''}`}
                                        onChange={(e) => setDueDate(e.target.value)}
                                    />
                                </div>

                                <div className="relative z-10">
                                    <p className="text-[#00000099] mb-2">Task Status*</p>
                                    <select
                                        className="border w-full p-2 rounded-[8px] z-10 relative"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option>To-Do</option>
                                        <option>In Progress</option>
                                        <option>Completed</option>
                                    </select>
                                </div>

                            </div>

                            {/* File Upload */}
                            <div className="mb-4">
                                <p className="text-[#00000099] mb-2">Upload File</p>
                                <label className="w-full border-2 p-4 rounded-[8px] flex items-center justify-center cursor-pointer bg-gray-100 hover:bg-gray-200 transition">
                                    <span className="text-gray-600">Drop your files here or Update</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                </label>
                            </div>

                        </div>

                        {/* Bottom Buttons */}
                        <div className="border-t border-gray-300 p-4 bg-white flex justify-end gap-3 w-full sticky bottom-0 z-20">
                            <button className="px-6 py-2 bg-gray-300 rounded-[41px]" onClick={onClose}>
                                Cancel
                            </button>
                            <button className="px-6 py-2 bg-[#7B1984] text-white rounded-[41px]" onClick={handleSubmit}>
                                {task ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Activity Tab (Show only when Activity is selected in Mobile) */}
                {task && activeTab === "activity" && (
                    <div className="p-4 bg-gray-100 rounded-md sm:block md:hidden h-full w-full">
                        <h3 className="text-lg font-semibold mb-2">Task Activity</h3>
                        <p className="text-gray-700 text-sm"><strong>Created On:</strong> {createdDate}</p>
                        <p className="text-gray-700 text-sm"><strong>Last Modified:</strong> {lastModifiedDate}</p>
                    </div>
                )}

                {/* Right Side - Task Details (Desktop: Always Show) */}
                {task && (
                    <div className="hidden md:block w-1/4 border-l border-gray-300 p-4 bg-gray-100 rounded-r-[20px]">
                        <h3 className="text-lg font-semibold mb-2">Task Details</h3>
                        <p className="text-sm text-gray-600"><strong>You created this task</strong> {createdDate}</p>
                        <p className="text-sm text-gray-600"><strong>Last Modified:</strong> {lastModifiedDate}</p>
                    </div>
                )}
            </div>
        </div>





    );
};

export default TaskModal;
