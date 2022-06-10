export const ZkSyncTestnet = {
    chainId: 280,
    chainName: 'zkSync alpha testnet',
    isTestChain: true,
    isLocalChain: false,
    multicallAddress: '0x5014a961801de9a52548068bDac853CE337221e7',
    multicall2Address: '0x32Caf123F6f574035f51532E597125062C0Aa8EE',
    getExplorerAddressLink: (address) => `https://zksync2-testnet.zkscan.io/address/${address}`,
    getExplorerTransactionLink: (transactionHash) => `https://zksync2-testnet.zkscan.io/tx/${transactionHash}`,
};
//# sourceMappingURL=zksync.js.map