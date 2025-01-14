import { useState } from "react";
import { FaExchangeAlt, FaSearch, FaCube } from "react-icons/fa";

// Types
interface Transaction {
    txid: string;
    blockhash: string;
    confirmations: number;
    time: number;
    vout: Array<{ value: number }>;
}

interface Block {
    hash: string;
    height: number;
    confirmations: number;
    time: number;
    tx: string[];
}

interface APIResponse<T> {
    result: T;
    error?: {
        message: string;
    };
}

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [transactionResult, setTransactionResult] = useState<Transaction | null>(null);
    const [blockResult, setBlockResult] = useState<Block | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const API_BASE_URL = "https://cors-anywhere.herokuapp.com/http://ec2-3-86-252-180.compute-1.amazonaws.com:18443";
    const AUTH_HEADER = 'Basic ' + btoa('user:pass');

    // Utility function for API calls
    const fetchFromAPI = async <T,>(endpoint: string, method: string, params: any[]): Promise<T> => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AUTH_HEADER,
            },
            body: JSON.stringify({
                jsonrpc: "1.0",
                id: method,
                method: method,
                params: params
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }

        return data.result;
    };

    // API Functions
    const handleSearchTransaction = async () => {
        if (!query.trim()) return;

        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchFromAPI<Transaction>("", "getrawtransaction", [query, 1]);
            setTransactionResult(result);
            setBlockResult(null);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
            setTransactionResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchBlock = async () => {
        if (!query.trim()) return;

        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchFromAPI<Block>("", "getblock", [query, 2]);
            setBlockResult(result);
            setTransactionResult(null);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
            setBlockResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    // UI Components
    const SearchField = ({ onSearch, placeholder }: { onSearch: () => void, placeholder: string }) => (
        <div className="max-w-[1280px] mx-auto text-gray-600 bg-zinc-950 hover:border-gray-500 rounded flex flex-row items-center transition">
            <input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full sm:w-[550px] px-2 py-2 caret-orange-500 text-gray-600 bg-zinc-950 border-orange-500 border-2 focus:outline-none focus:text-white transition rounded"
            />
            <button
                onClick={onSearch}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-3 -ml-2 border-2 bg-orange-500 border-orange-500 text-gray-900 font-bold hover:bg-orange-600 hover:border-orange-600 rounded transition disabled:opacity-50"
            >
                <FaSearch size={16} />
            </button>
        </div>
    );

    const TransactionDetails = ({ transaction }: { transaction: Transaction }) => (
        <div className="bg-zinc-950 rounded-lg shadow-lg p-4">
            <div className="flex flex-row items-center mb-4">
                <FaExchangeAlt className="text-orange-500 text-2xl mr-2" />
                <h2 className="text-xl font-bold text-orange-500">Transaction Details</h2>
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full border-collapse border border-gray-600 text-sm">
                    <thead>
                        <tr className="bg-zinc-800 text-gray-400">
                            <th className="border border-gray-600 px-4 py-2 text-left">Transaction ID</th>
                            <th className="border border-gray-600 px-4 py-2 text-left">Block Hash</th>
                            <th className="border border-gray-600 px-4 py-2 text-left">Confirmations</th>
                            <th className="border border-gray-600 px-4 py-2 text-left">Time</th>
                            <th className="border border-gray-600 px-4 py-2 text-left">Total Amount (BTC)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-zinc-800">
                            <td className="border border-gray-600 px-4 py-2 break-all">{transaction.txid}</td>
                            <td className="border border-gray-600 px-4 py-2 break-all">{transaction.blockhash || 'Unconfirmed'}</td>
                            <td className="border border-gray-600 px-4 py-2">{transaction.confirmations || 0}</td>
                            <td className="border border-gray-600 px-4 py-2">{transaction.time ? new Date(transaction.time * 1000).toLocaleString() : 'N/A'}</td>
                            <td className="border border-gray-600 px-4 py-2">{transaction.vout.reduce((sum, output) => sum + output.value, 0).toFixed(8)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="sm:hidden">
                <div className="border border-gray-600 mb-4 p-4 rounded bg-zinc-900 text-gray-400 space-y-2">
                    <p><span className="font-bold text-orange-500">Transaction ID:</span> <span className="break-all">{transaction.txid}</span></p>
                    <p><span className="font-bold text-orange-500">Block Hash:</span> <span className="break-all">{transaction.blockhash || 'Unconfirmed'}</span></p>
                    <p><span className="font-bold text-orange-500">Confirmations:</span> {transaction.confirmations || 0}</p>
                    <p><span className="font-bold text-orange-500">Time:</span> {transaction.time ? new Date(transaction.time * 1000).toLocaleString() : 'N/A'}</p>
                    <p><span className="font-bold text-orange-500">Total Amount:</span> {transaction.vout.reduce((sum, output) => sum + output.value, 0).toFixed(8)} BTC</p>
                </div>
            </div>
        </div>
    );

    const BlockDetails = ({ block }: { block: Block }) => (
        <div className="bg-zinc-950 rounded-lg shadow-lg p-4">
            <div className="flex flex-row items-center mb-4">
                <FaCube className="text-orange-500 text-2xl mr-2" />
                <h2 className="text-xl font-bold text-orange-500">Block Details</h2>
            </div>

            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full border-collapse border border-gray-600 text-sm">
                    <thead>
                        <tr className="bg-zinc-800 text-gray-400">
                            <th className="border border-gray-600 px-4 py-2 text-left">Block Hash</th>
                            <th className="border border-gray-600 px-4 py-2 text-left">Height</th>
                            <th className="border border-gray-600 px-4 py-2 text-left">Confirmations</th>
                            <th className="border border-gray-600 px-4 py-2 text-left">Time</th>
                            <th className="border border-gray-600 px-4 py-2 text-left">Transactions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-zinc-800">
                            <td className="border border-gray-600 px-4 py-2 break-all">{block.hash}</td>
                            <td className="border border-gray-600 px-4 py-2">{block.height}</td>
                            <td className="border border-gray-600 px-4 py-2">{block.confirmations}</td>
                            <td className="border border-gray-600 px-4 py-2">{new Date(block.time * 1000).toLocaleString()}</td>
                            <td className="border border-gray-600 px-4 py-2">{block.tx.length}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="sm:hidden">
                <div className="border border-gray-600 mb-4 p-4 rounded bg-zinc-900 text-gray-400 space-y-2">
                    <p><span className="font-bold text-orange-500">Block Hash:</span> <span className="break-all">{block.hash}</span></p>
                    <p><span className="font-bold text-orange-500">Height:</span> {block.height}</p>
                    <p><span className="font-bold text-orange-500">Confirmations:</span> {block.confirmations}</p>
                    <p><span className="font-bold text-orange-500">Time:</span> {new Date(block.time * 1000).toLocaleString()}</p>
                    <p><span className="font-bold text-orange-500">Transactions:</span> {block.tx.length}</p>
                </div>
            </div>
        </div>
    );

    const listLastTransactions = async () => {
        try {
            const response = await fetch(`https://cors-anywhere.herokuapp.com/http://ec2-3-86-252-180.compute-1.amazonaws.com:18443/wallet/wallet1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa('user:pass'),
                },
                body: JSON.stringify({
                    "jsonrpc": "1.0",
                    "id": "listtransactions",
                    "method": "listtransactions",
                    "params": ["*", 10] // Listar as últimas 10 transações para qualquer conta
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message || 'Erro desconhecido ao buscar transações');
            }

            console.log('Últimas 10 transações:', data.result);
        } catch (error) {
            console.error('Error:', error);
            console.log('Erro ao buscar as transações:', error.message || 'Erro desconhecido');
        }
    };


    const listUnspent = async () => {
        try {
            const response = await fetch(`https://cors-anywhere.herokuapp.com/http://ec2-3-86-252-180.compute-1.amazonaws.com:18443/wallet/wallet1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;',
                    'Authorization': 'Basic ' + btoa('user:pass'),
                },
                body: JSON.stringify({
                    "jsonrpc": "1.0",
                    "id": "listutxos",
                    "method": "listunspent",
                    "params": []
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Resposta do servidor:', data);
        } catch (error) {
            console.error('Error:', error);
            console.log('Erro ao buscar os UTXOs:', error.message || 'Erro desconhecido');
        }
    };

    const checkBlockCount = async () => {
        const auth = 'Basic ' + btoa('user:pass');
        const response = await fetch(`https://cors-anywhere.herokuapp.com/http://ec2-3-86-252-180.compute-1.amazonaws.com:18443`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth
            },
            body: JSON.stringify({
                "jsonrpc": "1.0",
                "id": "getblockcount",
                "method": "getblockcount",
                "params": []
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Altura do bloco mais recente:', data.result);
    };

    return (
        <div className="bg-zinc-950 py-4 shadow-sm flex flex-col items-center space-y-4">
            {/* Transaction Search */}
            <SearchField
                onSearch={handleSearchTransaction}
                placeholder="Enter a transaction hash"
            />

            {/* Block Search */}
            <SearchField
                onSearch={handleSearchBlock}
                placeholder="Enter a block hash"
            />

            {/* Results */}
            <div className="p-4 sm:p-8 max-w-screen-lg mx-auto">
                {error && (
                    <div className="text-red-500 bg-red-100 border border-red-400 rounded p-4 mb-4">
                        {error}
                    </div>
                )}
                {isLoading && (
                    <div className="text-orange-500 text-center">Loading...</div>
                )}
                {transactionResult && <TransactionDetails transaction={transactionResult} />}
                {blockResult && <BlockDetails block={blockResult} />}
            </div>


        </div>
    );
}