import { useState, useRef, useEffect } from "react";
import CustomDatePicker from "../CustomDatePicker/CustomDatePicker"
import search from "../../../public/search.svg"

function TaskFilter({ openModal, setSearchQuery, setCategoryFilter, setDueDateFilter, clearFilters, searchQuery, categoryFilter, dueDateFilter }) {
    const [showCalendar, setShowCalendar] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const calendarRef = useRef(null);

    // Close calendar when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [calendarRef]);

    return (

        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Mobile Filter Toggle */}
            <div className="flex justify-between items-center md:hidden">
                <button
                    className="flex items-center gap-2 text-gray-700 font-medium p-2 border rounded-lg"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    Filters {(categoryFilter || dueDateFilter) && <span className="bg-[#7B1984] text-white text-xs rounded-full px-2 py-1">Active</span>}
                </button>
                <button className="bg-[#7B1984] text-white px-4 py-2 rounded-full text-sm" onClick={openModal}>
                    ADD TASK
                </button>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden">
                <input
                    type="text"
                    placeholder="Search by Title"
                    className="border p-2 rounded-full w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Mobile Filters (Expandable) */}
            <div className={`flex flex-col gap-3 ${showMobileFilters ? 'block' : 'hidden'} md:hidden`}>
                <div className="flex flex-col gap-2">
                    <span className="text-gray-700 font-medium">Category:</span>
                    <select
                        className="border p-2 rounded-xl"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="WORK">Work</option>
                        <option value="PERSONAL">Personal</option>
                    </select>
                </div>

                {/* Fixed Mobile Calendar Section */}
                <div className="relative inline-block">
                    {console.log("About to render DatePicker with placeholder:", "Due Date")}
                    <CustomDatePicker
                        value={dueDateFilter}
                        onChange={(e) => setDueDateFilter(e.target.value)}
                        onClear={() => setDueDateFilter("")} // Clear function
                        placeholderText="Due Date"
                    />
                    
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex md:gap-2 md:items-center">
                <span className="text-gray-700 font-medium whitespace-nowrap">Filter by:</span>

                {/* Category Filter */}
                <select
                    className="border p-2 mr-2 rounded-[60px]"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">All</option>
                    <option value="WORK">Work</option>
                    <option value="PERSONAL">Personal</option>
                </select>

                <div className="relative inline-block">
                    <CustomDatePicker
                        value={dueDateFilter}
                        onChange={(e) => setDueDateFilter(e.target.value)}
                        onClear={() => setDueDateFilter("")} // Clear function
                        placeholderText="Due Date"
                    />
                </div>

            </div>

            {/* Search and Add Task (Desktop) */}
            <div className="hidden md:flex md:gap-3 md:items-center">
                <div className="relative">
                    <img src={search} alt="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="border p-2 pl-10 rounded-full w-52"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <button className="bg-[#7B1984] text-white px-4 py-2 rounded-full whitespace-nowrap" onClick={openModal}>
                    ADD TASK
                </button>
            </div>
        </div>


    );
}

export default TaskFilter;