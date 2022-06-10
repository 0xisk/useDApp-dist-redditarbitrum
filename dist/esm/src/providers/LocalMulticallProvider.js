import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { getChainById } from '../helpers';
import { useEthers, useBlockNumber, useConfig, useUpdateConfig } from '../hooks';
import multicallABI from '../constants/abi/MultiCall.json';
import multicall2ABI from '../constants/abi/MultiCall2.json';
import { deployContract } from '../helpers/contract';
var LocalMulticallState;
(function (LocalMulticallState) {
    LocalMulticallState[LocalMulticallState["Unknown"] = 0] = "Unknown";
    LocalMulticallState[LocalMulticallState["NonLocal"] = 1] = "NonLocal";
    LocalMulticallState[LocalMulticallState["Deploying"] = 2] = "Deploying";
    LocalMulticallState[LocalMulticallState["Deployed"] = 3] = "Deployed";
    LocalMulticallState[LocalMulticallState["Error"] = 4] = "Error";
})(LocalMulticallState || (LocalMulticallState = {}));
export function LocalMulticallProvider({ children }) {
    const updateConfig = useUpdateConfig();
    const { library, chainId } = useEthers();
    const { multicallAddresses, multicallVersion } = useConfig();
    const [localMulticallState, setLocalMulticallState] = useState(LocalMulticallState.Unknown);
    const [multicallBlockNumber, setMulticallBlockNumber] = useState();
    const blockNumber = useBlockNumber();
    useEffect(() => {
        var _a;
        if (!library || !chainId) {
            setLocalMulticallState(LocalMulticallState.Unknown);
        }
        else if (!((_a = getChainById(chainId)) === null || _a === void 0 ? void 0 : _a.isLocalChain)) {
            setLocalMulticallState(LocalMulticallState.NonLocal);
        }
        else if (multicallAddresses && multicallAddresses[chainId]) {
            setLocalMulticallState(LocalMulticallState.Deployed);
        }
        else if (localMulticallState !== LocalMulticallState.Deploying) {
            const signer = library.getSigner();
            if (!signer) {
                setLocalMulticallState(LocalMulticallState.Error);
                return;
            }
            setLocalMulticallState(LocalMulticallState.Deploying);
            const deployMulticall = async () => {
                try {
                    const { contractAddress, blockNumber } = await deployContract(multicallVersion === 1 ? multicallABI : multicall2ABI, signer);
                    updateConfig({ multicallAddresses: { [chainId]: contractAddress } });
                    setMulticallBlockNumber(blockNumber);
                    setLocalMulticallState(LocalMulticallState.Deployed);
                }
                catch (_a) {
                    setLocalMulticallState(LocalMulticallState.Error);
                }
            };
            void deployMulticall();
        }
    }, [library, chainId]);
    const awaitingMulticallBlock = multicallBlockNumber && blockNumber && blockNumber < multicallBlockNumber;
    if (localMulticallState === LocalMulticallState.Deploying ||
        (localMulticallState === LocalMulticallState.Deployed && awaitingMulticallBlock)) {
        return _jsx("div", { children: "Deploying multicall..." });
    }
    else if (localMulticallState === LocalMulticallState.Error) {
        return _jsx("div", { children: "Error deploying multicall contract" });
    }
    else {
        return _jsx(_Fragment, { children: children });
    }
}
//# sourceMappingURL=LocalMulticallProvider.js.map