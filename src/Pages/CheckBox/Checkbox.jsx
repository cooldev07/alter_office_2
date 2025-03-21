function CustomCheckbox({ isChecked, onChange }) {
    return (
        <label className="flex items-center gap-2 cursor-pointer">
            <input
                type="checkbox"
                checked={isChecked}
                onChange={onChange}
                className="hidden"
            />
            <div
                className={`w-[20px] h-[20px] rounded border-2 border-gray-400 flex items-center justify-center transition-all 
                ${isChecked ? "bg-[#7B1984] border-[#7B1984]" : "bg-white"}`}
            >
                {isChecked && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="white"
                        className="w-4 h-4"
                    >
                        <path
                            fillRule="evenodd"
                            d="M20.293 5.293a1 1 0 010 1.414l-10 10a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586l9.293-9.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                )}
            </div>
        </label>
    );
}

export default CustomCheckbox;
