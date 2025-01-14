import btcImage from '../../../assets/bitcoin-img.svg'

export default function BitcoinInfo() {
    return (
        <div className='max-w-[500px] m-10 flex flex-col items-center space-y-4'>
            <img
                src={btcImage}
                className="w-40 object-contain"
            />
            <p className='text-xs text-gray-400 leading-relaxed'><span className='text-gray-300 font-bold hover:text-orange-500 cursor-pointer transition'>Bitcoin</span> is a peer-to-peer electronic cash system that leverages blockchain technology, proposed by Satoshi Nakamoto in 2008.
                <br />The chain ensures transaction security and privacy through the proof-of-work algorithm and encryption technology. As the first successful application of blockchain in digital currency, it revolutionized finance by enabling decentralized and transparent transactions.</p>
            <a target="_blank"
                rel="noopener noreferrer"
                href='https://bitcoin.org'
                className='text-xs font-bold eading-relaxed text-orange-500 hover:text-orange-600 transition'>
                Learn more about Bitcoin
            </a>
        </div>
    )
}

