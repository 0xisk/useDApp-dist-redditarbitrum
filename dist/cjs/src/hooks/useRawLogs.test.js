"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var provider_1 = require("@ethereum-waffle/provider");
var ethers_1 = require("ethers");
var chai_1 = require("chai");
var constants_1 = require("../constants");
var testing_1 = require("../testing");
var useRawLogs_1 = require("./useRawLogs");
var useSendTransaction_1 = require("./useSendTransaction");
var AddressZero = ethers_1.constants.AddressZero;
var defaultAbiCoder = ethers_1.utils.defaultAbiCoder, getAddress = ethers_1.utils.getAddress, hexStripZeros = ethers_1.utils.hexStripZeros;
describe('useRawLogs', function () {
    var mockProvider = new provider_1.MockProvider();
    var secondMockProvider = new provider_1.MockProvider({ ganacheOptions: { _chainIdRpc: testing_1.SECOND_TEST_CHAIN_ID } });
    var _a = mockProvider.getWallets(), deployer = _a[0], receiver = _a[1];
    var secondDeployer = secondMockProvider.getWallets()[0];
    var eventTopic = ethers_1.ethers.utils.id('Transfer(address,address,uint256)');
    var token;
    var secondToken;
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, testing_1.deployMockToken)(deployer)];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, (0, testing_1.deployMockToken)(secondDeployer, testing_1.SECOND_MOCK_TOKEN_INITIAL_BALANCE)];
                case 2:
                    secondToken = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    function sendToken(signer, to, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, result, waitForCurrent, waitForNextUpdate, txData, tx;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, testing_1.renderWeb3Hook)(function () {
                            return (0, useSendTransaction_1.useSendTransaction)({
                                signer: signer
                            });
                        }, { mockProvider: mockProvider })];
                    case 1:
                        _a = _b.sent(), result = _a.result, waitForCurrent = _a.waitForCurrent, waitForNextUpdate = _a.waitForNextUpdate;
                        return [4 /*yield*/, waitForNextUpdate()];
                    case 2:
                        _b.sent();
                        txData = constants_1.ERC20MockInterface.encodeFunctionData('transfer(address,uint)', [to, amount]);
                        tx = {
                            to: token.address,
                            value: ethers_1.BigNumber.from(0),
                            data: txData,
                            gasPrice: 0
                        };
                        return [4 /*yield*/, result.current.sendTransaction(tx)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, waitForCurrent(function (val) { return val.state !== undefined; })];
                    case 4:
                        _b.sent();
                        (0, chai_1.expect)(result.current.state.status).to.eq('Success');
                        return [2 /*return*/];
                }
            });
        });
    }
    function extractAddress(address) {
        var result;
        result = hexStripZeros(address);
        while (result.length != 42)
            result = '0x0' + result.substring(2);
        return result;
    }
    it('Can get only the recent token transfer log', function () { return __awaiter(void 0, void 0, void 0, function () {
        var blockNumber, from, to, fromAddress, toAddress, amount, filter, _a, result, waitForCurrent, log, decodedData;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, mockProvider.getBlockNumber()];
                case 1:
                    blockNumber = _c.sent();
                    from = deployer;
                    to = receiver;
                    fromAddress = from.address;
                    toAddress = to.address;
                    amount = ethers_1.BigNumber.from(1);
                    return [4 /*yield*/, sendToken(from, toAddress, amount)];
                case 2:
                    _c.sent();
                    filter = {
                        address: token.address,
                        fromBlock: blockNumber + 1,
                        toBlock: blockNumber + 2,
                        topics: [eventTopic]
                    };
                    return [4 /*yield*/, (0, testing_1.renderWeb3Hook)(function () { return (0, useRawLogs_1.useRawLogs)(filter); }, { mockProvider: mockProvider })];
                case 3:
                    _a = _c.sent(), result = _a.result, waitForCurrent = _a.waitForCurrent;
                    return [4 /*yield*/, waitForCurrent(function (val) { return val !== undefined; })];
                case 4:
                    _c.sent();
                    (0, chai_1.expect)(result.error).to.be.undefined;
                    (0, chai_1.expect)((_b = result.current) === null || _b === void 0 ? void 0 : _b.length).to.equal(1, 'Number of logs');
                    log = result.current[0];
                    (0, chai_1.expect)(log.topics[0]).to.equal(eventTopic, 'Event topic');
                    (0, chai_1.expect)(getAddress(extractAddress(log.topics[1]))).to.equal(getAddress(fromAddress), 'From');
                    (0, chai_1.expect)(getAddress(extractAddress(log.topics[2]))).to.equal(getAddress(toAddress), 'To');
                    decodedData = defaultAbiCoder.decode(['uint'], log.data);
                    (0, chai_1.expect)(decodedData[0]).to.equal(amount, 'Amount');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Can get all token transfer logs', function () { return __awaiter(void 0, void 0, void 0, function () {
        var from, to, fromAddress, toAddress, amount, filter, _a, result, waitForCurrent, log1, decodedData1, log, decodedData;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    from = deployer;
                    to = receiver;
                    fromAddress = from.address;
                    toAddress = to.address;
                    amount = ethers_1.BigNumber.from(1);
                    return [4 /*yield*/, sendToken(from, toAddress, amount)];
                case 1:
                    _c.sent();
                    filter = {
                        address: token.address,
                        fromBlock: 0,
                        toBlock: 'latest',
                        topics: [eventTopic]
                    };
                    return [4 /*yield*/, (0, testing_1.renderWeb3Hook)(function () { return (0, useRawLogs_1.useRawLogs)(filter); }, { mockProvider: mockProvider })];
                case 2:
                    _a = _c.sent(), result = _a.result, waitForCurrent = _a.waitForCurrent;
                    return [4 /*yield*/, waitForCurrent(function (val) { return val !== undefined; })];
                case 3:
                    _c.sent();
                    (0, chai_1.expect)(result.error).to.be.undefined;
                    (0, chai_1.expect)((_b = result.current) === null || _b === void 0 ? void 0 : _b.length).to.equal(2, 'Number of logs');
                    log1 = result.current[0];
                    (0, chai_1.expect)(log1.topics[0]).to.equal(eventTopic, 'Event topic');
                    (0, chai_1.expect)(getAddress(extractAddress(log1.topics[1]))).to.equal(getAddress(AddressZero), 'From');
                    (0, chai_1.expect)(getAddress(extractAddress(log1.topics[2]))).to.equal(getAddress(deployer.address), 'To');
                    decodedData1 = defaultAbiCoder.decode(['uint'], log1.data);
                    (0, chai_1.expect)(decodedData1[0]).to.equal(testing_1.MOCK_TOKEN_INITIAL_BALANCE, 'Amount');
                    log = result.current[1];
                    (0, chai_1.expect)(log.topics[0]).to.equal(eventTopic, 'Event topic');
                    (0, chai_1.expect)(getAddress(extractAddress(log.topics[1]))).to.equal(getAddress(fromAddress), 'From');
                    (0, chai_1.expect)(getAddress(extractAddress(log.topics[2]))).to.equal(getAddress(toAddress), 'To');
                    decodedData = defaultAbiCoder.decode(['uint'], log.data);
                    (0, chai_1.expect)(decodedData[0]).to.equal(amount, 'Amount');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Can get the mint transfer log', function () { return __awaiter(void 0, void 0, void 0, function () {
        var filter, _a, result, waitForCurrent, log, decodedData;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    filter = {
                        address: token.address,
                        fromBlock: 0,
                        toBlock: 'latest',
                        topics: [eventTopic]
                    };
                    return [4 /*yield*/, (0, testing_1.renderWeb3Hook)(function () { return (0, useRawLogs_1.useRawLogs)(filter); }, { mockProvider: mockProvider })];
                case 1:
                    _a = _c.sent(), result = _a.result, waitForCurrent = _a.waitForCurrent;
                    return [4 /*yield*/, waitForCurrent(function (val) { return val !== undefined; })];
                case 2:
                    _c.sent();
                    (0, chai_1.expect)(result.error).to.be.undefined;
                    (0, chai_1.expect)((_b = result.current) === null || _b === void 0 ? void 0 : _b.length).to.equal(1, 'Number of logs');
                    log = result.current[0];
                    (0, chai_1.expect)(log.topics[0]).to.equal(eventTopic, 'Event topic');
                    (0, chai_1.expect)(getAddress(extractAddress(log.topics[1]))).to.equal(getAddress(AddressZero), 'From');
                    (0, chai_1.expect)(getAddress(extractAddress(log.topics[2]))).to.equal(getAddress(deployer.address), 'To');
                    decodedData = defaultAbiCoder.decode(['uint'], log.data);
                    (0, chai_1.expect)(decodedData[0]).to.equal(testing_1.MOCK_TOKEN_INITIAL_BALANCE, 'Amount');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Can get the mint transfer log on the alternative chain', function () { return __awaiter(void 0, void 0, void 0, function () {
        var filter, _a, result, waitForCurrent, log, decodedData;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    filter = {
                        address: secondToken.address,
                        fromBlock: 0,
                        toBlock: 'latest',
                        topics: [eventTopic]
                    };
                    return [4 /*yield*/, (0, testing_1.renderWeb3Hook)(function () { return (0, useRawLogs_1.useRawLogs)(filter); }, {
                            mockProvider: secondMockProvider
                        })];
                case 1:
                    _a = _c.sent(), result = _a.result, waitForCurrent = _a.waitForCurrent;
                    return [4 /*yield*/, waitForCurrent(function (val) { return val !== undefined; })];
                case 2:
                    _c.sent();
                    (0, chai_1.expect)(result.error).to.be.undefined;
                    (0, chai_1.expect)((_b = result.current) === null || _b === void 0 ? void 0 : _b.length).to.equal(1, 'Number of logs');
                    log = result.current[0];
                    (0, chai_1.expect)(log.topics[0]).to.equal(eventTopic, 'Event topic');
                    (0, chai_1.expect)(getAddress(extractAddress(log.topics[1]))).to.equal(getAddress(AddressZero), 'From');
                    (0, chai_1.expect)(getAddress(extractAddress(log.topics[2]))).to.equal(getAddress(secondDeployer.address), 'To');
                    decodedData = defaultAbiCoder.decode(['uint'], log.data);
                    (0, chai_1.expect)(decodedData[0]).to.equal(testing_1.SECOND_MOCK_TOKEN_INITIAL_BALANCE, 'Amount');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Works if there are no logs', function () { return __awaiter(void 0, void 0, void 0, function () {
        var filter, _a, result, waitForCurrent;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    filter = {
                        address: secondToken.address,
                        fromBlock: 0,
                        toBlock: 'latest',
                        topics: [eventTopic]
                    };
                    return [4 /*yield*/, (0, testing_1.renderWeb3Hook)(function () { return (0, useRawLogs_1.useRawLogs)(filter); }, { mockProvider: mockProvider })];
                case 1:
                    _a = _c.sent(), result = _a.result, waitForCurrent = _a.waitForCurrent;
                    return [4 /*yield*/, waitForCurrent(function (val) { return val !== undefined; })];
                case 2:
                    _c.sent();
                    (0, chai_1.expect)(result.error).to.be.undefined;
                    (0, chai_1.expect)((_b = result.current) === null || _b === void 0 ? void 0 : _b.length).to.equal(0, 'Number of logs');
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=useRawLogs.test.js.map