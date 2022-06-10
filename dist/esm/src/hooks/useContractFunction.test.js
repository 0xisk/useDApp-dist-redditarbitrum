import { useContractFunction } from '../../src';
import { expect } from 'chai';
import { MockProvider } from 'ethereum-waffle';
import { BigNumber } from 'ethers';
import { renderWeb3Hook, contractCallOutOfGasMock, deployMockToken, setupTestingConfig } from '../../src/testing';
import { renderDAppHook } from '../testing/renderDAppHook';
const CONTRACT_FUNCTION_COST = 51941; // mock transfer transaction cost
describe('useContractFunction', () => {
    const mockProvider = new MockProvider();
    const [deployer, spender] = mockProvider.getWallets();
    let token;
    let config;
    beforeEach(async () => {
        ;
        ({ config } = await setupTestingConfig());
        token = await deployMockToken(deployer);
    });
    it('success', async () => {
        const { result, waitForCurrent, waitForNextUpdate } = await renderWeb3Hook(() => useContractFunction(token, 'approve'), {
            mockProvider,
        });
        await waitForNextUpdate();
        await result.current.send(spender.address, 200);
        await waitForCurrent((val) => val.state !== undefined);
        expect(result.current.state.status).to.eq('Success');
        expect(await token.allowance(deployer.address, spender.address)).to.eq(200);
    });
    it('events', async () => {
        var _a, _b, _c, _d;
        const { result, waitForCurrent, waitForNextUpdate } = await renderWeb3Hook(() => useContractFunction(token, 'approve'), {
            mockProvider,
        });
        await waitForNextUpdate();
        await result.current.send(spender.address, 200);
        await waitForCurrent((val) => val.state !== undefined);
        expect((_b = (_a = result.current) === null || _a === void 0 ? void 0 : _a.events) === null || _b === void 0 ? void 0 : _b.length).to.eq(1);
        const event = (_d = (_c = result.current) === null || _c === void 0 ? void 0 : _c.events) === null || _d === void 0 ? void 0 : _d[0];
        expect(event === null || event === void 0 ? void 0 : event.name).to.eq('Approval');
        expect(event === null || event === void 0 ? void 0 : event.args['owner']).to.eq(deployer.address);
        expect(event === null || event === void 0 ? void 0 : event.args['spender']).to.eq(spender.address);
        expect(event === null || event === void 0 ? void 0 : event.args['value']).to.eq(BigNumber.from(200));
    });
    it('exception (bad arguments)', async () => {
        const { result, waitForCurrent, waitForNextUpdate } = await renderWeb3Hook(() => useContractFunction(token, 'approve'), {
            mockProvider,
        });
        await waitForNextUpdate();
        await result.current.send();
        await waitForCurrent((val) => val.state !== undefined);
        expect(result.current.state.status).to.eq('Exception');
        if (result.current.state.status === 'Exception') {
            expect(result.current.state.errorMessage).to.eq('missing argument: passed to contract');
        }
    });
    it('fail (when transaction reverts)', async () => {
        const contractMock = contractCallOutOfGasMock;
        const { result, waitForCurrent, waitForNextUpdate } = await renderWeb3Hook(() => useContractFunction(contractMock, 'transfer'), {
            mockProvider,
        });
        await waitForNextUpdate();
        await result.current.send(spender.address, 10);
        await waitForCurrent((val) => val.state !== undefined);
        expect(result.current.state.status).to.eq('Fail');
        if (result.current.state.status === 'Fail') {
            expect(result.current.state.errorMessage).to.eq('out of gas');
        }
    });
    it('should not throw error when contract is Falsy', async () => {
        const { result, waitForNextUpdate } = await renderWeb3Hook(() => useContractFunction(null, 'approve'), {
            mockProvider,
        });
        await waitForNextUpdate();
        await result.current.send(spender.address, 200);
    });
    it('transfer amount with limit', async () => {
        const { result, waitForCurrent, waitForNextUpdate } = await renderDAppHook(() => useContractFunction(token, 'transfer'), {
            config: Object.assign(Object.assign({}, config), { bufferGasLimitPercentage: 100 }),
        });
        await waitForNextUpdate();
        const startingBalance = await deployer.getBalance();
        await result.current.send(spender.address, 200);
        await waitForCurrent((val) => val.state !== undefined);
        expect(result.current.state.status).to.eq('Success');
        const finalBalance = await deployer.getBalance();
        const txCost = finalBalance.sub(startingBalance);
        expect(txCost).to.be.at.most(2 * CONTRACT_FUNCTION_COST);
    });
    it('success with correct receipt', async () => {
        var _a, _b, _c, _d, _e, _f, _g;
        const { result, waitForCurrent, waitForNextUpdate } = await renderWeb3Hook(() => useContractFunction(token, 'approve'), {
            mockProvider,
        });
        await waitForNextUpdate();
        await result.current.send(spender.address, 200);
        await waitForCurrent((val) => val.state !== undefined);
        expect(result.current.state.status).to.eq('Success');
        expect(await token.allowance(deployer.address, spender.address)).to.eq(200);
        expect(result.current.state.receipt).to.not.be.undefined;
        expect((_a = result.current.state.receipt) === null || _a === void 0 ? void 0 : _a.to).to.eq(token.address);
        expect((_b = result.current.state.receipt) === null || _b === void 0 ? void 0 : _b.from).to.eq(deployer.address);
        expect((_c = result.current.state.receipt) === null || _c === void 0 ? void 0 : _c.gasUsed).to.be.gt(0);
        expect((_d = result.current.state.receipt) === null || _d === void 0 ? void 0 : _d.status).to.eq(1);
        expect((_e = result.current.state.receipt) === null || _e === void 0 ? void 0 : _e.blockHash).to.match(/^0x/);
        expect((_f = result.current.state.receipt) === null || _f === void 0 ? void 0 : _f.transactionHash).to.match(/^0x/);
        expect((_g = result.current.state.receipt) === null || _g === void 0 ? void 0 : _g.gasUsed).to.be.gt(0);
    });
});
//# sourceMappingURL=useContractFunction.test.js.map