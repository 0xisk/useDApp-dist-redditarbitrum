"use strict";
exports.__esModule = true;
exports.addressEqual = exports.compareAddress = exports.shortenIfAddress = exports.shortenAddress = void 0;
var ethers_1 = require("ethers");
var ethers_2 = require("ethers");
var common_1 = require("./common");
/**
 * @public
 */
function shortenAddress(address) {
    try {
        var formattedAddress = ethers_1.utils.getAddress(address);
        return (0, common_1.shortenString)(formattedAddress);
    }
    catch (_a) {
        throw new TypeError("Invalid input, address can't be parsed");
    }
}
exports.shortenAddress = shortenAddress;
/**
 * @public
 */
function shortenIfAddress(address) {
    if (typeof address === 'string' && address.length > 0) {
        return shortenAddress(address);
    }
    return '';
}
exports.shortenIfAddress = shortenIfAddress;
/**
 * @public
 */
function compareAddress(firstAddress, secondAddress) {
    try {
        var parsedFirstAddress = ethers_2.BigNumber.from(firstAddress);
        var parsedSecondAddress = ethers_2.BigNumber.from(secondAddress);
        if (parsedFirstAddress.gt(parsedSecondAddress)) {
            return 1;
        }
        if (parsedFirstAddress.lt(parsedSecondAddress)) {
            return -1;
        }
        return 0;
    }
    catch (_a) {
        throw new TypeError("Invalid input, address can't be parsed");
    }
}
exports.compareAddress = compareAddress;
/**
 * @public
 */
function addressEqual(firstAddress, secondAddress) {
    try {
        return ethers_1.utils.getAddress(firstAddress) === ethers_1.utils.getAddress(secondAddress);
    }
    catch (_a) {
        throw new TypeError("Invalid input, address can't be parsed");
    }
}
exports.addressEqual = addressEqual;
//# sourceMappingURL=address.js.map