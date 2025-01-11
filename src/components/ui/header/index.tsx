export default function Header() {
    return (
        <header className="bg-zinc-950 border-b-2 border-gray-500 shadow-sm sticky top-0 z-10 w-full">
            <div className="max-w-[1280px] mx-auto px-4 flex justify-between items-center py-4">
                <h1 className="text-2xl font-bold text-orange-400">Bitcoin Explorer</h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li className="">
                            <a
                                href="#"
                                className="px-4 py-2 border-2 border-gray-500 text-gray-500 hover:border-orange-400 hover:text-orange-400 transition">
                                Connect
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
