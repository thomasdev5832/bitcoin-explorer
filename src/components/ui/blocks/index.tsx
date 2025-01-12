interface Block {
    height: number;
    timestamp: string;
    miner: string;
    transactions: number;
}

interface BlocksProps {
    blocks: Block[];
}

export default function Blocks({ blocks }: BlocksProps) {
    return (
        <div>
            <h2 className="text-xl font-bold text-orange-400 mb-4">Latest Blocks</h2>
            <div className="overflow-x-auto">
                <table className="hidden sm:table w-full max-w-4xl mx-auto border-collapse border border-gray-600 text-sm">
                    <thead>
                        <tr className="bg-zinc-900 text-gray-400">
                            <th className="border border-gray-600 px-6 py-3">Height</th>
                            <th className="border border-gray-600 px-6 py-3">Timestamp</th>
                            <th className="border border-gray-600 px-6 py-3">Miner</th>
                            <th className="border border-gray-600 px-6 py-3">Transactions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blocks.map((block) => (
                            <tr key={block.height} className="hover:bg-zinc-800">
                                <td className="border border-gray-600 px-6 py-3">{block.height}</td>
                                <td className="border border-gray-600 px-6 py-3">{block.timestamp}</td>
                                <td className="border border-gray-600 px-6 py-3">{block.miner}</td>
                                <td className="border border-gray-600 px-6 py-3">{block.transactions}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="sm:hidden">
                {blocks.map((block) => (
                    <div
                        key={block.height}
                        className="border border-gray-600 mb-4 p-4 rounded bg-zinc-900 text-gray-400"
                    >
                        <p>
                            <span className="font-bold text-orange-400">Height:</span> {block.height}
                        </p>
                        <p>
                            <span className="font-bold text-orange-400">Timestamp:</span> {block.timestamp}
                        </p>
                        <p>
                            <span className="font-bold text-orange-400">Miner:</span> {block.miner}
                        </p>
                        <p>
                            <span className="font-bold text-orange-400">Transactions:</span> {block.transactions}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
