import Banner from "../../ui/banner";
import BitcoinInfo from "../../ui/bitcoin-info";
import Blocks from "../../ui/blocks";
import Footer from "../../ui/footer";
import Header from "../../ui/header";
import SearchBar from "../../ui/searchbar";
import Transactions from "../../ui/transactions";

const mockBlocks = [
    { height: 807456, timestamp: "2025-01-11 14:00", miner: "AntPool", transactions: 2753 },
    { height: 807455, timestamp: "2025-01-11 13:55", miner: "F2Pool", transactions: 2300 },
    { height: 807454, timestamp: "2025-01-11 13:50", miner: "ViaBTC", transactions: 3201 },
    { height: 807453, timestamp: "2025-01-11 13:45", miner: "Binance Pool", transactions: 1900 },
    { height: 807452, timestamp: "2025-01-11 13:40", miner: "Foundry USA", transactions: 2800 },
    { height: 807451, timestamp: "2025-01-11 13:35", miner: "Slush Pool", transactions: 2100 },
];


const mockTransactions = [
    { hash: "1a2b3c4d5e6f7g8h9i0j", amount: 0.045, timestamp: "2025-01-11 14:10" },
    { hash: "2b3c4d5e6f7g8h9i0j1k", amount: 1.275, timestamp: "2025-01-11 14:05" },
    { hash: "3c4d5e6f7g8h9i0j1k2l", amount: 0.329, timestamp: "2025-01-11 14:00" },
    { hash: "4d5e6f7g8h9i0j1k2l3m", amount: 2.503, timestamp: "2025-01-11 13:55" },
    { hash: "5e6f7g8h9i0j1k2l3m4n", amount: 0.987, timestamp: "2025-01-11 13:50" },
    { hash: "6f7g8h9i0j1k2l3m4n5o", amount: 1.845, timestamp: "2025-01-11 13:45" },
];

export default function Home() {
    return (
        <div className="w-full flex flex-col items-center justify-center gap-10">
            <Header />
            <Banner />
            <SearchBar />
            <div className="max-w-[1280px] mx-auto mt-4 px-4 flex flex-col gap-4">
                <Blocks blocks={mockBlocks} />
                <Transactions transactions={mockTransactions} />
            </div>
            <BitcoinInfo />
            <Footer />
        </div>
    );
}