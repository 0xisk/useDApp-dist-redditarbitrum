import { useSendTransaction } from '../../src';
import { expect } from 'chai';
import { MockProvider } from 'ethereum-waffle';
import { BigNumber, utils } from 'ethers';
import { renderWeb3Hook } from '../../src/testing';
describe('useSendTransaction', () => {
    const mockProvider = new MockProvider();
    const [spender, receiver, secondReceiver] = mockProvider.getWallets();
    it('success', async () => {
        const { result, waitForCurrent } = await renderWeb3Hook(useSendTransaction, { mockProvider });
        const spenderBalance = await spender.getBalance();
        const receiverBalance = await receiver.getBalance();
        await result.current.sendTransaction({ to: receiver.address, value: BigNumber.from(10), gasPrice: 0 });
        await waitForCurrent((val) => val.state !== undefined);
        expect(result.current.state.status).to.eq('Success');
        expect(await receiver.getBalance()).to.eq(receiverBalance.add(10));
        expect(await spender.getBalance()).to.eq(spenderBalance.sub(10));
    });
    it('sends with different signer', async () => {
        const receiverBalance = await receiver.getBalance();
        const secondReceiverBalance = await secondReceiver.getBalance();
        const { result, waitForCurrent, waitForNextUpdate } = await renderWeb3Hook(() => useSendTransaction({ signer: receiver }), {
            mockProvider,
        });
        await waitForNextUpdate();
        await result.current.sendTransaction({ to: secondReceiver.address, value: BigNumber.from(10) });
        await waitForCurrent((val) => val.state != undefined);
        expect(result.current.state.status).to.eq('Success');
        expect(await secondReceiver.getBalance()).to.eq(secondReceiverBalance.add(10));
        expect(await receiver.getBalance()).to.not.eq(receiverBalance);
    });
    it('Exception(invalid sender)', async () => {
        const { result, waitForCurrent, waitForNextUpdate } = await renderWeb3Hook(useSendTransaction, { mockProvider });
        await waitForNextUpdate();
        await result.current.sendTransaction({ to: '0x1', value: utils.parseEther('1') });
        await waitForCurrent((val) => val.state !== undefined);
        expect(result.current.state.status).to.eq('Exception');
        expect(result.current.state.errorMessage).to.eq('invalid address');
    });
    it('Returns receipt after correct transaction', async () => {
        var _a, _b, _c, _d, _e, _f, _g;
        const { result, waitForCurrent } = await renderWeb3Hook(useSendTransaction, { mockProvider });
        const spenderBalance = await spender.getBalance();
        const receiverBalance = await receiver.getBalance();
        await result.current.sendTransaction({ to: receiver.address, value: BigNumber.from(10), gasPrice: 0 });
        await waitForCurrent((val) => val.state !== undefined);
        expect(result.current.state.status).to.eq('Success');
        expect(await receiver.getBalance()).to.eq(receiverBalance.add(10));
        expect(await spender.getBalance()).to.eq(spenderBalance.sub(10));
        expect(result.current.state.receipt).to.not.be.undefined;
        expect((_a = result.current.state.receipt) === null || _a === void 0 ? void 0 : _a.to).to.eq(receiver.address);
        expect((_b = result.current.state.receipt) === null || _b === void 0 ? void 0 : _b.from).to.eq(spender.address);
        expect((_c = result.current.state.receipt) === null || _c === void 0 ? void 0 : _c.gasUsed).to.be.gt(0);
        expect((_d = result.current.state.receipt) === null || _d === void 0 ? void 0 : _d.status).to.eq(1);
        expect((_e = result.current.state.receipt) === null || _e === void 0 ? void 0 : _e.blockHash).to.match(/^0x/);
        expect((_f = result.current.state.receipt) === null || _f === void 0 ? void 0 : _f.transactionHash).to.match(/^0x/);
        expect((_g = result.current.state.receipt) === null || _g === void 0 ? void 0 : _g.gasUsed).to.be.gt(0);
    });
});
//# sourceMappingURL=useSendTransaction.test.js.map