import logout from "../../../public/logout.png"

function LogoutButton({ handleLogout }) {
    return (
        <div className="mt-6 flex justify-end">
    <button className="flex items-center px-4 py-2 sm:px-4 sm:py-2 bg-[#FFF9F9] rounded-[12px] border-2 border-[#00000099] hover:bg-[#7B1984] 
                      text-base sm:text-sm md:text-base lg:text-lg transition-all duration-200"
        onClick={handleLogout}
    >
        <img src={logout} alt="Logout" 
            className="w-[15px] h-[15px] mr-[10px] mt-[4px] sm:w-[12px] sm:h-[12px] sm:mr-[6px] sm:mt-[2px]"
        />
        <span className="hidden sm:inline">Logout</span>
        <span className="sm:hidden text-xs">Logout</span> {/* Short text on very small screens */}
    </button>
</div>

    );
}

export default LogoutButton;
