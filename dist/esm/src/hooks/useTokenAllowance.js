import { Contract } from 'ethers';
import { ERC20Interface } from '../constants';
import { useCall } from './useCall';
/**
 * Returns allowance (tokens left to use by spender) for given token owner - spender relationship.
 * @param tokenAddress address of a token contract
 * @param ownerAddress address of an account to which tokens are linked
 * @param spenderAddress address of an account allowed to spend tokens
 * @param queryParams see {@link QueryParams}.
 * @returns an allowance which is `BigNumber`, or `undefined` if any address or token is `Falsy` or not connected.
 * @public
 * @example
 * const TOKEN_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f'
 * const SPENDER_ADDRESS = '0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA'
 * const { account, chainId } = useEthers()
 * const allowance = useTokenAllowance(TOKEN_ADDRESS, account, SPENDER_ADDRESS)
 *
 * return (
 *   {allowance && <p>Remaining allowance: {formatUnits(allowance, 18)} tokens</p>}
 * )
 */
export function useTokenAllowance(tokenAddress, ownerAddress, spenderAddress, queryParams = {}) {
    var _a;
    const { value: allowance } = (_a = useCall(ownerAddress &&
        spenderAddress &&
        tokenAddress && {
        contract: new Contract(tokenAddress, ERC20Interface),
        method: 'allowance',
        args: [ownerAddress, spenderAddress],
    }, queryParams)) !== null && _a !== void 0 ? _a : {};
    return allowance === null || allowance === void 0 ? void 0 : allowance[0];
}
//# sourceMappingURL=useTokenAllowance.js.map