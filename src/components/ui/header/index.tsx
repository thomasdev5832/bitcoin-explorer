import { useState, useEffect } from "react";
import axios from "axios";
import btcLogo from "../../../assets/btc.svg";

export default function Header() {
    const [bitcoinPrice, setBitcoinPrice] = useState<number | null>(null);

    useEffect(() => {
        const fetchBitcoinPrice = async () => {
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
                const price = response.data.bitcoin.usd;
                setBitcoinPrice(price);
                console.log(`Bitcoin Price: $${price}`);
            } catch (error) {
                console.error("Erro ao obter o preço do Bitcoin:", error);
            }
        };

        fetchBitcoinPrice();

        const interval = setInterval(fetchBitcoinPrice, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <header className="bg-zinc-950 shadow-sm top-0 z-10 w-full">
            <div className="max-w-[1280px] mx-auto px-4 flex justify-between items-center py-4">

                <h1 className="flex flex-row text-2xl font-black text-orange-500">
                    <img
                        src={btcLogo}
                        alt="Logo"
                        className="w-8 ml-2 object-contain"
                    />

                </h1>
                <nav>
                    <ul className="flex flex-row items-center space-x-4">
                        <li className="border-2 border-gray-400 rounded-sm px-2 py-1 flex items-center">
                            <span className="text-gray-400 text-sm font-black">
                                {bitcoinPrice ? `$${bitcoinPrice.toLocaleString()}` : "Loading..."}
                            </span>
                        </li>
                        <li className="">
                            <a
                                href="#"
                                className="px-2 py-1 font-black text-sm border-2 rounded-sm border-orange-500 text-orange-500 hover:border-orange-600 hover:text-orange-600 transition">
                                Mainnet
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
