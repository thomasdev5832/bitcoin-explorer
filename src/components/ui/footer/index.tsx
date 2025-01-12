import { FaTwitter, FaDiscord, FaTelegramPlane, FaGithub } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-zinc-950 text-gray-400 py-4 mt-10 w-full flex items-center">
            <div className="max-w-[1280px] w-full mx-auto px-4 flex flex-col sm:flex-row justify-between items-center sm:items-center space-y-4 sm:space-y-0">
                {/* Redes sociais - Ficam no topo no mobile, à direita no desktop */}
                <div className="text-center sm:text-right order-1 sm:order-2 w-full sm:w-auto">
                    <div className="flex justify-center sm:justify-end space-x-2">
                        <a
                            href="#"
                            className="text-gray-400 hover:text-orange-500 transition"
                            aria-label="Twitter"
                        >
                            <FaTwitter size={20} />
                        </a>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-orange-500 transition"
                            aria-label="Discord"
                        >
                            <FaDiscord size={20} />
                        </a>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-orange-500 transition"
                            aria-label="Telegram"
                        >
                            <FaTelegramPlane size={20} />
                        </a>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-orange-500 transition"
                            aria-label="GitHub"
                        >
                            <FaGithub size={20} />
                        </a>
                    </div>
                </div>

                {/* Copyright - Fica embaixo no mobile, à esquerda no desktop */}
                <div className="text-center sm:text-left order-2 sm:order-1 w-full sm:w-auto">
                    <p className="text-sm font-bold hover:text-orange-500 cursor-pointer">
                        &copy; 2025 Bitcoin Explorer
                    </p>
                    <p className="text-xs mt-1">Built with care for the Bitcoin community.</p>
                </div>
            </div>
        </footer>
    );
}
