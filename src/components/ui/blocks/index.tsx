import { useState, useEffect } from "react";
import { FaCube } from "react-icons/fa";
interface Block {
    height: number;
    timestamp: string;
    miner: string;
    transactions: number;
    size: number;
}

export default function Blocks() {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const API_BASE_URL = "https://cors-anywhere.herokuapp.com/http://ec2-3-86-252-180.compute-1.amazonaws.com:18443";
    const AUTH_HEADER = 'Basic ' + btoa('user:pass');

    useEffect(() => {
        const listLastBlocks = async (): Promise<Block[]> => {
            try {
                const blockCountResponse = await fetch(`${API_BASE_URL}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': AUTH_HEADER
                    },
                    body: JSON.stringify({
                        jsonrpc: "1.0",
                        id: "getblockcount",
                        method: "getblockcount",
                        params: []
                    })
                });

                if (!blockCountResponse.ok) {
                    throw new Error(`Failed to fetch block count: ${blockCountResponse.status}`);
                }

                const blockCountData = await blockCountResponse.json();
                const latestBlockHeight = blockCountData.result;

                const fetchedBlocks = [];

                for (let i = latestBlockHeight; i > Math.max(0, latestBlockHeight - 6); i--) {
                    const blockHashResponse = await fetch(`${API_BASE_URL}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': AUTH_HEADER
                        },
                        body: JSON.stringify({
                            jsonrpc: "1.0",
                            id: "getblockhash",
                            method: "getblockhash",
                            params: [i]
                        })
                    });

                    if (!blockHashResponse.ok) {
                        throw new Error(`Failed to fetch block hash for height ${i}: ${blockHashResponse.status}`);
                    }

                    const blockHashData = await blockHashResponse.json();
                    const blockHash = blockHashData.result;

                    const blockDetailsResponse = await fetch(`${API_BASE_URL}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': AUTH_HEADER
                        },
                        body: JSON.stringify({
                            jsonrpc: "1.0",
                            id: "getblock",
                            method: "getblock",
                            params: [blockHash]
                        })
                    });

                    if (!blockDetailsResponse.ok) {
                        throw new Error(`Failed to fetch block details for hash ${blockHash}: ${blockDetailsResponse.status}`);
                    }

                    const blockDetailsData = await blockDetailsResponse.json();

                    fetchedBlocks.push({
                        height: blockDetailsData.result.height,
                        timestamp: new Date(blockDetailsData.result.time * 1000).toLocaleString(),
                        miner: blockDetailsData.result.miner || 'Unknown',
                        transactions: blockDetailsData.result.tx.length,
                        size: blockDetailsData.result.size
                    });
                }

                return fetchedBlocks;

            } catch (error) {
                console.error('Error:', error);
                console.log('Error fetching blocks:', error instanceof Error ? error.message : 'Unknown error');
                return [];
            }
        };

        const fetchBlocks = async () => {
            try {
                const fetchedBlocks = await listLastBlocks();
                setBlocks(fetchedBlocks);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Unknown error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlocks();
    }, [API_BASE_URL, AUTH_HEADER]);

    if (isLoading) {
        return <div className="text-orange-400 font-black">Loading blocks...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div>
            <div className="flex flex-row items-center mb-2">
                <FaCube className="text-orange-500 text-2xl mr-2" />
                <h2 className="text-xl text-left font-bold text-orange-500">Latest Blocks</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="hidden sm:table w-full max-w-4xl mx-auto border-collapse border border-gray-600 text-sm">
                    <thead>
                        <tr className="bg-zinc-900 text-gray-400">
                            <th className="border border-gray-600 px-6 py-3">Height</th>
                            <th className="border border-gray-600 px-6 py-3">Timestamp</th>
                            <th className="border border-gray-600 px-6 py-3">Miner</th>
                            <th className="border border-gray-600 px-6 py-3">Transactions</th>
                            <th className="border border-gray-600 px-6 py-3">Size (bytes)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blocks.map((block) => (
                            <tr key={block.height} className="hover:bg-zinc-900 hover:text-gray-300 text-gray-400">
                                <td className="border border-gray-600 px-6 py-3">{block.height}</td>
                                <td className="border border-gray-600 px-6 py-3">{block.timestamp}</td>
                                <td className="border border-gray-600 px-6 py-3">{block.miner}</td>
                                <td className="border border-gray-600 px-6 py-3">{block.transactions}</td>
                                <td className="border border-gray-600 px-6 py-3">{block.size}</td>
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
                        className="border-gray-600 mb-4 p-4 rounded bg-zinc-900 text-gray-400"
                    >
                        <p>
                            <span className="font-bold text-orange-500">Height:</span> {block.height}
                        </p>
                        <p>
                            <span className="font-bold text-orange-500">Timestamp:</span> {block.timestamp}
                        </p>
                        <p>
                            <span className="font-bold text-orange-500">Miner:</span> {block.miner}
                        </p>
                        <p>
                            <span className="font-bold text-orange-500">Transactions:</span> {block.transactions}
                        </p>
                        <p>
                            <span className="font-bold text-orange-500">Size (bytes):</span> {block.size}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
