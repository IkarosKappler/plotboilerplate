/**
 * Approach to observe objects from other scripts to be initialized.
 *
 * @author  Ikaros Kappler
 * @date    2024-07-08
 * @version 1.0.0
 */
export declare class InitializationObserver<T, E> {
    private _acceptRejectPairs;
    private _timeoutMessage;
    private _initializedValue;
    private _isInitialized;
    constructor(timeout: number, timeoutMessage?: E);
    accept(value: T): void;
    private _fireAccept;
    private _fireReject;
    waitForInitialized(): Promise<T>;
}
