"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.DAppProvider = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var config_1 = require("./config");
var blockNumber_1 = require("./blockNumber/blockNumber");
var chainState_1 = require("./chainState");
var hooks_1 = require("../hooks");
var provider_1 = require("./notifications/provider");
var provider_2 = require("./transactions/provider");
var LocalMulticallProvider_1 = require("./LocalMulticallProvider");
var network_1 = require("./network");
var blockNumbers_1 = require("./blockNumber/blockNumbers");
var window_1 = require("./window");
var react_flat_providers_1 = require("react-flat-providers");
/**
 * Provides basic services for a DApp.
 * @public
 */
function DAppProvider(_a) {
    var config = _a.config, children = _a.children;
    return ((0, jsx_runtime_1.jsx)(config_1.ConfigProvider, __assign({ config: config }, { children: (0, jsx_runtime_1.jsx)(DAppProviderWithConfig, { children: children }) })));
}
exports.DAppProvider = DAppProvider;
var getMulticallAddresses = function (networks) {
    var result = {};
    networks === null || networks === void 0 ? void 0 : networks.forEach(function (network) { return (result[network.chainId] = network.multicallAddress); });
    return result;
};
var getMulticall2Addresses = function (networks) {
    var result = {};
    networks === null || networks === void 0 ? void 0 : networks.forEach(function (network) {
        if (network.multicall2Address) {
            result[network.chainId] = network.multicall2Address;
        }
    });
    return result;
};
function DAppProviderWithConfig(_a) {
    var children = _a.children;
    var _b = (0, hooks_1.useConfig)(), multicallAddresses = _b.multicallAddresses, networks = _b.networks, multicallVersion = _b.multicallVersion;
    var defaultAddresses = (0, react_1.useMemo)(function () { return (multicallVersion === 1 ? getMulticallAddresses(networks) : getMulticall2Addresses(networks)); }, [networks, multicallVersion]);
    var multicallAddressesMerged = __assign(__assign({}, defaultAddresses), multicallAddresses);
    return ((0, jsx_runtime_1.jsx)(react_flat_providers_1.FlatProviders, __assign({ providers: [
            window_1.WindowProvider,
            network_1.ReadonlyNetworksProvider,
            network_1.NetworkProvider,
            blockNumber_1.BlockNumberProvider,
            blockNumbers_1.BlockNumbersProvider,
            LocalMulticallProvider_1.LocalMulticallProvider,
            [chainState_1.MultiChainStateProvider, { multicallAddresses: multicallAddressesMerged }],
            provider_1.NotificationsProvider,
            provider_2.TransactionProvider,
        ] }, { children: children })));
}
//# sourceMappingURL=DAppProvider.js.map