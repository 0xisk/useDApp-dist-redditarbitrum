import type { TransactionReceipt, TransactionResponse } from '@ethersproject/abstract-provider';
declare type NotificationPayload = {
    submittedAt: number;
} & ({
    type: 'transactionStarted';
    transaction: TransactionResponse;
    transactionName?: string;
} | {
    type: 'transactionSucceed';
    transaction: TransactionResponse;
    receipt: TransactionReceipt;
    transactionName?: string;
    originalTransaction?: TransactionResponse;
} | {
    type: 'transactionFailed';
    transaction: TransactionResponse;
    receipt: TransactionReceipt;
    transactionName?: string;
    originalTransaction?: TransactionResponse;
} | {
    type: 'walletConnected';
    address: string;
});
/**
 * @public
 */
export declare type Notification = {
    id: string;
} & NotificationPayload;
/**
 * @public
 */
export declare type AddNotificationPayload = {
    chainId: number;
    notification: NotificationPayload;
};
/**
 * @public
 */
export declare type RemoveNotificationPayload = {
    chainId: number;
    notificationId: string;
};
/**
 * @public
 */
export declare type Notifications = {
    [chainID: number]: Notification[];
};
/**
 * @internal Intended for internal use - use it on your own risk
 */
export declare const DEFAULT_NOTIFICATIONS: Notifications;
export {};
//# sourceMappingURL=model.d.ts.map