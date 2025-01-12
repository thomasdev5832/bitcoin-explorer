import { FaExchangeAlt } from "react-icons/fa";
interface Transaction {
    hash: string;
    amount: number;
    timestamp: string;
}

interface TransactionsProps {
    transactions: Transaction[];
}

export default function Transactions({ transactions }: TransactionsProps) {
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
                            <tr key={transaction.hash} className="hover:bg-zinc-800">
                                <td className="border border-gray-600 px-6 py-3">{transaction.hash}</td>
                                <td className="border border-gray-600 px-6 py-3">{transaction.amount}</td>
                                <td className="border border-gray-600 px-6 py-3">{transaction.timestamp}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="sm:hidden">
                {transactions.map((transaction) => (
                    <div
                        key={transaction.hash}
                        className="border border-gray-600 mb-4 p-4 rounded bg-zinc-900 text-gray-400"
                    >
                        <p>
                            <span className="font-bold text-orange-500">Hash:</span> {transaction.hash}
                        </p>
                        <p>
                            <span className="font-bold text-orange-500">Amount:</span> {transaction.amount} BTC
                        </p>
                        <p>
                            <span className="font-bold text-orange-500">Timestamp:</span> {transaction.timestamp}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
