import { useState, useEffect, useCallback } from "react";
import { FaExchangeAlt } from "react-icons/fa";
interface Transaction {
    hash: string;
    amount: number;
    timestamp: string;
}

interface RawTransaction {
    txid: string;
    amount: number;
    time: number;
}

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const API_BASE_URL = "https://cors-anywhere.herokuapp.com/http://ec2-3-86-252-180.compute-1.amazonaws.com:18443";
    const AUTH_HEADER = 'Basic ' + btoa('user:pass');

    const listLastTransactions = useCallback(async (): Promise<Transaction[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/wallet/wallet1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_HEADER,
                },
                body: JSON.stringify({
                    jsonrpc: "1.0",
                    id: "listtransactions",
                    method: "listtransactions",
                    params: ["*", 6]
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message || 'Unknown error fetching transactions');
            }

            return data.result.map((tx: RawTransaction) => ({
                hash: tx.txid,
                amount: tx.amount,
                timestamp: tx.time ? new Date(tx.time * 1000).toLocaleString() : 'N/A'
            }));

        } catch (error) {
            console.error('Error:', error);
            console.log('Error fetching transactions:', error instanceof Error ? error.message : 'Unknown error');
            return [];
        }
    }, [API_BASE_URL, AUTH_HEADER]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const fetchedTransactions = await listLastTransactions();
                setTransactions(fetchedTransactions);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Unknown error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, [listLastTransactions]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center gap-2">
                <FaExchangeAlt className="animate-spin text-orange-500 text-4xl" />
                <div className="text-orange-500 font-black text-2xl">Loading transactions...</div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div>
            <div className="flex flex-row items-center mb-2">
                <FaExchangeAlt className="text-orange-500 text-2xl mr-2" />
                <h2 className="text-xl text-left font-bold text-orange-500">Latest Transactions</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="hidden sm:table w-full max-w-4xl mx-auto border-collapse border border-gray-600 text-sm">
                    <thead>
                        <tr className="bg-zinc-900 text-gray-400">
                            <th className="border border-gray-600 px-6 py-3">Hash</th>
                            <th className="border border-gray-600 px-6 py-3">Amount (BTC)</th>
                            <th className="border border-gray-600 px-6 py-3">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.hash} className="hover:bg-zinc-900 hover:text-gray-300 text-gray-400">
                                <td className="border border-gray-600 px-6 py-3 break-all">{transaction.hash}</td>
                                <td className="border border-gray-600 px-6 py-3">{transaction.amount}</td>
                                <td className="border border-gray-600 px-6 py-3">{transaction.timestamp}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="sm:hidden ">
                {transactions.map((transaction) => (
                    <div
                        key={transaction.hash}
                        className="mb-4 p-4 rounded bg-zinc-900 text-gray-400 border-zinc-900 hover:border-gray-500 border-2 transition"
                    >
                        <div className="flex justify-between">
                            <span className="font-bold text-orange-500">Hash:</span>
                            <span className="break-all text-right">{transaction.hash}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold text-orange-500">Amount:</span>
                            <span className="break-all text-right">{transaction.amount} BTC</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold text-orange-500">Timestamp:</span>
                            <span className="break-all text-right">{transaction.timestamp}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
