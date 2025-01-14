import Banner from "../../ui/banner";
import BitcoinInfo from "../../ui/bitcoin-info";
import Blocks from "../../ui/blocks";
import Footer from "../../ui/footer";
import Header from "../../ui/header";
import SearchBar from "../../ui/searchbar";
import Transactions from "../../ui/transactions";

export default function Home() {
    return (
        <div className="w-full flex flex-col items-center justify-center gap-10">
            <Header />
            <Banner />
            <SearchBar />
            <div className="max-w-[1280px] mx-auto mt-4 px-4 flex flex-col gap-12">
                <Blocks />
                <Transactions />
            </div>
            <BitcoinInfo />
            <Footer />
        </div>
    );
}