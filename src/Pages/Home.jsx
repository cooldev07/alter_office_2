import googleicon from "../../public/googleicon.png";
import login from "../../public/login.png";
import circles from "../../public/circles.png";

function Home({ handleLogin }) {
    return (
        <div className="flex flex-col md:flex-row justify-center min-h-screen w-full">
            {/* Left side with login (centered vertically) */}
            <div className="flex flex-col items-center justify-center py-8 px-4 md:px-0 md:w-1/2 md:ml-8 lg:ml-20">
                <img 
                    src={login} 
                    alt="Login Logo" 
                    className="w-64 md:w-[300px] h-auto mb-8" 
                />
                <button
                    className="flex items-center justify-center gap-3 w-full max-w-xs md:max-w-sm h-14 md:h-[60px] rounded-[18px] bg-[#292929] text-white font-medium shadow-md hover:bg-[#3a3a3a] transition-colors"
                    onClick={handleLogin}
                >
                    <img src={googleicon} alt="Google Logo" className="w-6 h-6" />
                    <span>Sign in with Google</span>
                </button>
            </div>

            {/* Right side with circles image (for md screens and up) */}
            <div className="hidden md:flex items-center justify-center md:w-1/2 md:h-auto">
                <img 
                    src={circles} 
                    alt="Circles illustration" 
                    className="w-full max-w-lg lg:max-w-xl h-auto"
                />
            </div>
            
            {/* Bottom circles image (only for mobile) */}
            <div className="flex justify-center w-full mt-4 md:hidden">
                <img 
                    src={circles} 
                    alt="Circles illustration" 
                    className="w-full max-w-xs h-auto"
                />
            </div>
        </div>
    );
}

export default Home;