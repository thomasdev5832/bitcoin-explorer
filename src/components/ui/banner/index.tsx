export default function Banner() {
    return (
        <div className="bg-zinc-950 shadow-sm py-6 px-4 text-center">
            <div className="max-w-xl mx-auto">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-orange-500 mb-2">
                    Real-time Bitcoin Explorer
                </h1>
                <p className="text-gray-400 text-lg">
                    Easily track and visualize the latest blocks and transactions on the Bitcoin network.
                </p>
            </div>
        </div>
    );
}
