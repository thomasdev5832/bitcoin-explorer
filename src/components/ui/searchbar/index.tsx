import { useState } from "react";
import { FaExchangeAlt, FaSearch, FaCube, FaWallet } from "react-icons/fa";

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
    size: number;
}

interface WalletBalanceDetailsProps {
    address: string;
    walletName: string;
    balance: number;
}

interface SearchFieldProps {
    onSearch: (query: string) => void;
    placeholder: string;
    isLoading: boolean;
}

const SearchField = ({ onSearch, placeholder, isLoading }: SearchFieldProps) => {
    const [inputValue, setInputValue] = useState('');

    const handleSearch = () => {
        if (inputValue.trim()) {
            onSearch(inputValue);
            setInputValue('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="max-w-[1280px] mx-auto text-gray-600 bg-zinc-950 hover:border-gray-500 rounded flex flex-row items-center transition">
            <input
                type="text"
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full sm:w-[550px] px-2 py-2 caret-orange-500 text-gray-600 hover:border-orange-500 bg-zinc-950 border-gray-500 border-2 focus:outline-none focus:text-white focus:border-orange-500 transition rounded"
            />
            <button
                onClick={handleSearch}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-3 -ml-2 border-2 bg-orange-500 border-orange-500 text-gray-900 font-bold hover:bg-orange-600 hover:border-orange-600 rounded transition disabled:opacity-50"
            >
                <FaSearch size={16} />
            </button>
        </div>
    );
};

export default function SearchBar() {
    const [transactionResult, setTransactionResult] = useState<Transaction | null>(null);
    const [blockResult, setBlockResult] = useState<Block | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [balance, setBalance] = useState<number | undefined>(undefined);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [searchedAddress, setSearchedAddress] = useState('');

    const API_BASE_URL = "https://cors-anywhere.herokuapp.com/http://ec2-3-86-252-180.compute-1.amazonaws.com:18443";
    const AUTH_HEADER = 'Basic ' + btoa('user:pass');

    const fetchFromAPI = async <T,>(endpoint: string, method: string, params: unknown[]): Promise<T> => {
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

    /*
        const listLastTransactions = async () => {
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
                        params: ["*", 10]
                    })
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
                const data = await response.json();
    
                if (data.error) {
                    throw new Error(data.error.message || 'Unknown error fetching transactions');
                }
    
                console.log('Last 10 transactions:', data.result);
            } catch (error) {
                console.error('Error:', error);
                console.log('Error fetching transactions:', error instanceof Error ? error.message : 'Unknown error');
            }
        };
    
        const listUnspent = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/wallet/wallet1`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain;',
                        'Authorization': AUTH_HEADER,
                    },
                    body: JSON.stringify({
                        jsonrpc: "1.0",
                        id: "listutxos",
                        method: "listunspent",
                        params: []
                    })
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Server response:', data);
            } catch (error) {
                console.error('Error:', error);
                console.log('Error fetching UTXOs:', error instanceof Error ? error.message : 'Unknown error');
            }
        };
    
        const checkBlockCount = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}`, {
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
    
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Latest block height:', data.result);
            } catch (error) {
                console.error('Error:', error);
                console.log('Error checking block count:', error instanceof Error ? error.message : 'Unknown error');
            }
        };
    
        const listLastBlocks = async () => {
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
    
                const blocks = [];
    
                for (let i = latestBlockHeight; i > latestBlockHeight - 10; i--) {
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
                    blocks.push(blockDetailsData.result);
                }
    
                console.log('Last 10 blocks:', blocks);
            } catch (error) {
                console.error('Error:', error);
                console.log('Error fetching blocks:', error instanceof Error ? error.message : 'Unknown error');
            }
        };
    
        const listAllWallets = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': AUTH_HEADER,
                    },
                    body: JSON.stringify({
                        jsonrpc: "1.0",
                        id: "listwallets",
                        method: "listwallets",
                        params: []
                    })
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
                const data = await response.json();
    
                if (data.error) {
                    throw new Error(data.error.message || 'Unknown error fetching wallets');
                }
    
                console.log('All Wallets:', data.result);
            } catch (error) {
                console.error('Error:', error);
                console.log('Error fetching wallets:', error instanceof Error ? error.message : 'Unknown error');
            }
        };
    
        const listAllWalletsWithBalances = async () => {
            try {
                const walletsResponse = await fetch(`${API_BASE_URL}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': AUTH_HEADER,
                    },
                    body: JSON.stringify({
                        jsonrpc: "1.0",
                        id: "listwallets",
                        method: "listwallets",
                        params: []
                    })
                });
    
                if (!walletsResponse.ok) {
                    throw new Error(`HTTP error listing wallets! status: ${walletsResponse.status}`);
                }
    
                const walletsData = await walletsResponse.json();
    
                if (walletsData.error) {
                    throw new Error(walletsData.error.message || 'Unknown error fetching wallets');
                }
    
                const wallets = walletsData.result;
    
                const walletsWithBalances = await Promise.all(wallets.map(async (wallet: unknown) => {
                    const walletInfoResponse = await fetch(`${API_BASE_URL}/wallet/${wallet}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': AUTH_HEADER,
                        },
                        body: JSON.stringify({
                            jsonrpc: "1.0",
                            id: "getwalletinfo",
                            method: "getwalletinfo",
                            params: []
                        })
                    });
    
                    if (!walletInfoResponse.ok) {
                        console.error(`Error fetching info for wallet ${wallet}:`, walletInfoResponse.status);
                        return { name: wallet, balance: 'Error fetching balance' };
                    }
    
                    const walletInfo = await walletInfoResponse.json();
    
                    if (walletInfo.error) {
                        console.error(`Error fetching info for wallet ${wallet}:`, walletInfo.error.message);
                        return { name: wallet, balance: 'Error fetching balance' };
                    }
    
                    return { name: wallet, balance: walletInfo.result.balance };
                }));
    
                console.log('Wallets with Balances:', walletsWithBalances);
            } catch (error) {
                console.error('Error:', error);
                console.log('Error fetching wallets or balances:', error instanceof Error ? error.message : 'Unknown error');
            }
        };
    
        const listUnspentForAddress = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/wallet/wallet1`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': AUTH_HEADER,
                    },
                    body: JSON.stringify({
                        jsonrpc: "1.0",
                        id: "listunspent",
                        method: "listunspent",
                        params: []
                    })
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
                const data = await response.json();
    
                if (data.error) {
                    throw new Error(data.error.message || 'Unknown error fetching UTXOs');
                }
    
                // Listar endereços únicos com saldo
                const addresses = [...new Set(data.result.map((utxo: { address: unknown; }) => utxo.address))];
                console.log('Addresses with balance:', addresses);
            } catch (error) {
                console.error('Error:', error);
                console.log('Error fetching UTXOs:', error instanceof Error ? error.message : 'Unknown error');
            }
        };
    */

    const handleSearchTransaction = async (query: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchFromAPI<Transaction>("", "getrawtransaction", [query, 1]);
            setTransactionResult(result);
            setBlockResult(null);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('500')) {
                    setError(`Server Error: The server encountered an internal error when processing your request. Please check if ${query} is a valid transaction ID.`);
                } else {
                    setError(error.message);
                }
            } else {
                setError('An unknown error occurred.');
            }
            setTransactionResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchBlock = async (query: string) => {
        setIsLoading(true);
        setError(null);
        try {
            // Primeiro, obtemos o hash do bloco pelo height
            const blockHash = await fetchFromAPI<string>("", "getblockhash", [parseInt(query, 10)]);

            // Depois, buscamos os detalhes do bloco usando o hash obtido
            const result = await fetchFromAPI<Block>("", "getblock", [blockHash, 2]);
            setBlockResult(result);
            setTransactionResult(null);
        } catch (error) {
            if (error instanceof Error && error.message.includes('Block not found')) {
                setError(`Block with height ${query} not found.`);
            } else {
                setError(error instanceof Error ? error.message : 'Unknown error');
            }
            setBlockResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    const getBalanceByAddress = async (address: string) => {
        setIsLoading(true);
        setError(null);
        setSearchPerformed(true);
        setSearchedAddress(address);
        setBalance(undefined);
        setTransactionResult(null);
        setBlockResult(null);
        try {
            const result = await fetchFromAPI<Array<{ amount: number }>>("/wallet/wallet1", "listunspent", [0, 9999999, [address]]);

            const balance = result.reduce((sum: number, utxo) => sum + utxo.amount, 0);
            setBalance(balance);
            return balance;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
            return 0;
        } finally {
            setIsLoading(false);
        }
    };

    const TransactionDetails = ({ transaction }: { transaction: Transaction }) => (
        <div className="bg-zinc-950 rounded-lg shadow-lg m-4 flex items-center flex-col">
            {/* Desktop View */}
            <div className="hidden sm:block overflow-x-auto">
                <div className="flex flex-row items-center mb-4">
                    <FaExchangeAlt className="text-orange-500 text-2xl mr-2" />
                    <h2 className="text-xl font-bold text-orange-500">Transaction Details</h2>
                </div>
                <table className="w-full border-collapse border border-gray-600 text-sm">
                    <thead>
                        <tr className="bg-zinc-900 text-gray-400">
                            <th className="border border-gray-600 px-4 py-2 text-left">Transaction ID</th>
                            <th className="border border-gray-600 px-4 py-2 text-left">Block Hash</th>
                            <th className="border border-gray-600 px-4 py-2 text-left">Confirmations</th>
                            <th className="border border-gray-600 px-4 py-2 text-left">Time</th>
                            <th className="border border-gray-600 px-4 py-2 text-left">Total Amount (BTC)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-zinc-900 text-gray-400 hover:text-gray-300">
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
            <div className="sm:hidden rounded bg-zinc-900 space-y-1 -m-2 p-6 border-2 border-gray-600">
                <div className="flex flex-col items-center mb-4">
                    <div className="flex flex-row items-center">
                        <FaExchangeAlt className="text-orange-500 text-2xl mr-2" />
                        <h2 className="text-lg font-bold text-orange-500">Transaction Details</h2>
                    </div>
                </div>
                <div className="space-y-1">
                    {[
                        { label: 'Transaction ID:', value: transaction.txid ? `${transaction.txid.slice(0, 4)}...${transaction.txid.slice(-4)}` : 'N/A', fullValue: transaction.txid },
                        { label: 'Block Hash:', value: transaction.blockhash ? `${transaction.blockhash.slice(0, 4)}...${transaction.blockhash.slice(-4)}` : 'Unconfirmed', fullValue: transaction.blockhash },
                        { label: 'Confirmations:', value: transaction.confirmations || 0 },
                        { label: 'Time:', value: transaction.time ? new Date(transaction.time * 1000).toLocaleString() : 'N/A' },
                        { label: 'Total Amount:', value: `${Math.floor(transaction.vout.reduce((sum, output) => sum + output.value, 0))} BTC` },
                    ].map((item, index) => (
                        <div key={index} className="flex justify-between">
                            <span className="font-bold text-orange-500">{item.label}</span>
                            {item.fullValue ? (
                                <button
                                    className="break-all text-right text-gray-400 font-bold hover:underline cursor-pointer"
                                    onClick={() => {
                                        navigator.clipboard.writeText(item.fullValue);
                                        alert(`${item.label} copied!`);
                                    }}
                                >
                                    {item.value}
                                </button>
                            ) : (
                                <span className="break-all text-right text-gray-400">{item.value}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const BlockDetails = ({ block }: { block: Block }) => (
        <div className="bg-zinc-950 rounded-lg shadow-lg p-4 flex items-center flex-col">
            {/* Desktop View */}
            <div className="hidden sm:block overflow-x-auto">
                <div className="flex flex-row items-center mb-4">
                    <FaCube className="text-orange-500 text-2xl mr-2" />
                    <h2 className="text-xl font-bold text-orange-500">Block Details</h2>
                </div>
                <table className="w-full border-collapse border border-gray-600 text-sm">
                    <thead>
                        <tr className="bg-zinc-900 text-gray-400">
                            <th className="border border-gray-600 px-4 py-2 text-left">Block Hash</th>
                            <th className="border border-gray-600 px-4 py-2 text-left">Height</th>
                            <th className="border border-gray-600 px-4 py-2 text-left">Confirmations</th>
                            <th className="border border-gray-600 px-4 py-2 text-left">Time</th>
                            <th className="border border-gray-600 px-4 py-2 text-left">Transactions</th>
                            <th className="border border-gray-600 px-4 py-2 text-left">Size (bytes)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-zinc-900 text-gray-400 hover:text-gray-300">
                            <td className="border border-gray-600 px-4 py-2 break-all">{block.hash}</td>
                            <td className="border border-gray-600 px-4 py-2">{block.height}</td>
                            <td className="border border-gray-600 px-4 py-2">{block.confirmations}</td>
                            <td className="border border-gray-600 px-4 py-2">{new Date(block.time * 1000).toLocaleString()}</td>
                            <td className="border border-gray-600 px-4 py-2">{block.tx.length}</td>
                            <td className="border border-gray-600 px-4 py-2">{block.size}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="sm:hidden rounded bg-zinc-900 space-y-1 -m-2 p-6 border-2 border-gray-600">
                <div className="flex flex-col items-center mb-4">
                    <div className="flex flex-row items-center">
                        <FaCube className="text-orange-500 text-2xl mr-2" />
                        <h2 className="text-lg font-bold text-orange-500">Block Details</h2>
                    </div>
                </div>
                <div className="space-y-1">
                    {[
                        { label: 'Block Hash:', value: `${block.hash.slice(0, 4)}...${block.hash.slice(-4)}`, fullValue: block.hash },
                        { label: 'Height:', value: block.height },
                        { label: 'Confirmations:', value: block.confirmations },
                        { label: 'Time:', value: new Date(block.time * 1000).toLocaleString() },
                        { label: 'Transactions:', value: block.tx.length },
                        { label: 'Size (bytes):', value: block.size },
                    ].map((item, index) => (
                        <div key={index} className="flex justify-between">
                            <span className="font-bold text-orange-500">{item.label}</span>
                            {item.fullValue ? (
                                <button
                                    className="break-all text-right text-gray-400 font-bold hover:underline cursor-pointer"
                                    onClick={() => {
                                        navigator.clipboard.writeText(item.fullValue);
                                        alert(`${item.label} copied!`);
                                    }}
                                >
                                    {item.value}
                                </button>
                            ) : (
                                <span className="break-all text-right text-gray-400">{item.value}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const WalletBalanceDetails = ({ address, walletName, balance }: WalletBalanceDetailsProps) => (
        <div className="bg-zinc-950 rounded-lg shadow-lg p-4 flex items-center flex-col">


            {/* Desktop View */}
            <div className="hidden sm:block overflow-x-auto">
                <div className="flex flex-row items-center mb-4">
                    <FaWallet className="text-orange-500 text-2xl mr-2" />
                    <h2 className="text-xl font-bold text-orange-500">Wallet Balance Details</h2>
                </div>
                <table className="w-full border-collapse border border-gray-600 text-sm">
                    <thead>
                        <tr className="bg-zinc-900 text-gray-400">
                            <th className="border border-gray-600 px-4 py-2 text-left">Address</th>
                            <th className="border border-gray-600 px-4 py-2 text-left">Wallet Name</th>
                            <th className="border border-gray-600 px-4 py-2 text-left">Balance (BTC)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-zinc-900 text-gray-400 hover:text-gray-300">
                            <td className="border border-gray-600 px-4 py-2 break-all">{address}</td>
                            <td className="border border-gray-600 px-4 py-2">{walletName}</td>
                            <td className="border border-gray-600 px-4 py-2">{balance}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="sm:hidden rounded bg-zinc-900 space-y-1 -m-2 p-6 border-2 border-gray-600">
                <div className="flex flex-col items-center mb-4">
                    <div className="flex flex-row items-center">
                        <FaExchangeAlt className="text-orange-500 text-2xl mr-2" />
                        <h2 className="text-lg font-bold text-orange-500">Wallet Details</h2>
                    </div>
                </div>
                <div className="space-y-1">
                    {[
                        { label: 'Address:', value: `${address.slice(0, 4)}...${address.slice(-4)}`, fullValue: address },
                        { label: 'Wallet Name:', value: walletName },
                        { label: 'Balance:', value: `${balance} BTC` },
                    ].map((item, index) => (
                        <div key={index} className="flex justify-between">
                            <span className="font-bold text-orange-500">{item.label}</span>
                            {item.fullValue ? (
                                <button
                                    className="break-all text-right text-gray-400 font-bold hover:underline cursor-pointer"
                                    onClick={() => {
                                        navigator.clipboard.writeText(item.fullValue);
                                        alert(`${item.label} copied!`);
                                    }}
                                >
                                    {item.value}
                                </button>
                            ) : (
                                <span className="break-all text-right text-gray-400">{item.value}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-zinc-950 py-4 shadow-sm flex flex-col items-center space-y-4">
            {/* Transaction Search */}
            <SearchField
                onSearch={handleSearchTransaction}
                placeholder="Enter a transaction hash"
                isLoading={isLoading}
            />

            {/* Block Search */}
            <SearchField
                onSearch={handleSearchBlock}
                placeholder="Enter a block height"
                isLoading={isLoading}
            />

            {/* Wallet Balance Search */}
            <SearchField
                onSearch={getBalanceByAddress}
                placeholder="Enter a wallet address"
                isLoading={isLoading}
            />

            {/* Results */}
            <div className="p-4 sm:p-8 max-w-screen-lg mx-auto">
                {error && (
                    <div className="text-red-500 bg-red-100 border border-red-400 rounded p-4 mb-4">
                        {error}
                    </div>
                )}
                {isLoading && (
                    <div className="flex justify-center items-center">
                        <FaCube className="animate-spin text-orange-500 text-4xl" />
                    </div>
                )}
                {!isLoading && !error && (
                    <>
                        {transactionResult && (
                            <TransactionDetails transaction={transactionResult} />
                        )}
                        {!transactionResult && blockResult && (
                            <BlockDetails block={blockResult} />
                        )}
                        {!transactionResult && !blockResult && searchPerformed && balance !== undefined && (
                            <WalletBalanceDetails
                                address={searchedAddress}
                                walletName="wallet1"
                                balance={balance ?? 0}
                            />
                        )}
                    </>
                )}
            </div>

            {/* Test Buttons  
            <div className="max-w-[1280px] mx-auto mt-40 flex flex-col items-center justify-center gap-2">
                <h2 className="text-xl font-bold text-gray-400 -mt-4">Tests</h2>
                <button onClick={listUnspent}
                    className="w-full flex items-center justify-center px-4 py-3 -ml-2  bg-orange-500 orange-500 text-gray-900 font-bold hover:bg-orange-600 hover:border-orange-600 rounded transition">
                    List UTXOs
                </button>
                <button onClick={listLastTransactions}
                    className="w-full flex items-center justify-center px-4 py-3 -ml-2  bg-orange-500 orange-500 text-gray-900 font-bold hover:bg-orange-600 hover:border-orange-600 rounded transition">
                    List Last Transactions
                </button>
                <button onClick={listLastBlocks}
                    className="w-full flex items-center justify-center px-4 py-3 -ml-2  bg-orange-500 orange-500 text-gray-900 font-bold hover:bg-orange-600 hover:border-orange-600 rounded transition">
                    List Last Blocks
                </button>
                <button onClick={listAllWallets}
                    className="w-full flex items-center justify-center px-4 py-3 -ml-2  bg-orange-500 orange-500 text-gray-900 font-bold hover:bg-orange-600 hover:border-orange-600 rounded transition">
                    List All Wallets
                </button>
                <button onClick={listAllWalletsWithBalances}
                    className="w-full flex items-center justify-center px-4 py-3 -ml-2  bg-orange-500 orange-500 text-gray-900 font-bold hover:bg-orange-600 hover:border-orange-600 rounded transition">
                    List All Wallets with Balances
                </button>
                <button onClick={listUnspentForAddress}
                    className="w-full flex items-center justify-center px-4 py-3 -ml-2  bg-orange-500 orange-500 text-gray-900 font-bold hover:bg-orange-600 hover:border-orange-600 rounded transition">
                    List UTXOs for Address
                </button>
                <button onClick={checkBlockCount}
                    className="w-full flex items-center justify-center px-4 py-3 -ml-2  bg-orange-500 orange-500 text-gray-900 font-bold hover:bg-orange-600 hover:border-orange-600 rounded transition">
                    Check Block Count
                </button>
            </div>
            */}
        </div>
    );
}
