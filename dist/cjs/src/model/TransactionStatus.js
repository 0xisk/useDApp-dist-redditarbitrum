"use strict";
exports.__esModule = true;
exports.transactionErrored = void 0;
/**
 * @public
 */
function transactionErrored(transaction) {
    return 'errorMessage' in transaction;
}
exports.transactionErrored = transactionErrored;
//# sourceMappingURL=TransactionStatus.js.map