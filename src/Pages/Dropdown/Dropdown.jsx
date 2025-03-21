import { useState, useEffect } from "react";

function CustomDropdown({ value, onChange }) {
    const [selectedValue, setSelectedValue] = useState(value);
    const [isOpen, setIsOpen] = useState(false);

    const options = [
        { label: "To-Do", value: "To-Do" },
        { label: "In Progress", value: "In Progress" },
        { label: "Completed", value: "Completed" }
    ];

    // Sync the selected value if the parent updates it
    useEffect(() => {
        setSelectedValue(value);
    }, [value]);

    return (
        <div className="relative inline-block text-left w-[116px]">
            <button
                className="border p-1 rounded text-center bg-white w-full h-[28px] flex items-center justify-center"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedValue}
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-1 w-full bg-white border rounded-[12px] shadow-lg ">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className="p-2 text-center text-xs cursor-pointer hover:bg-[#7B1984] hover:rounded-[8px] hover:text-white   "
                            onClick={() => {
                                setSelectedValue(option.value);
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CustomDropdown;
