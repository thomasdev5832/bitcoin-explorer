import { FaTwitter, FaDiscord, FaTelegramPlane, FaGithub } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-zinc-950 text-gray-400 py-4 mt-10 w-full">
            <div className="max-w-[1280px] w-full mx-auto px-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                {/* Left Content */}
                <div className="text-center sm:text-left">
                    <p className="text-sm hover:text-orange-400 cursor-pointer">&copy; 2025 Bitcoin Explorer</p>
                    <p className="text-xs mt-1">Built with care for the Bitcoin community.</p>
                </div>

                {/* Right Content */}
                <div className="text-center sm:text-right">
                    <div className="flex justify-center sm:justify-end space-x-2 mt-1">
                        <a
                            href="#"
                            className="text-gray-400 hover:text-orange-400 transition"
                            aria-label="Twitter"
                        >
                            <FaTwitter size={20} />
                        </a>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-orange-400 transition"
                            aria-label="Discord"
                        >
                            <FaDiscord size={20} />
                        </a>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-orange-400 transition"
                            aria-label="Telegram"
                        >
                            <FaTelegramPlane size={20} />
                        </a>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-orange-400 transition"
                            aria-label="GitHub"
                        >
                            <FaGithub size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
