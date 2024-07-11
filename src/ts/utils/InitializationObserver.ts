/**
 * Approach to observe objects from other scripts to be initialized.
 *
 * @author  Ikaros Kappler
 * @date    2024-07-08
 * @version 1.0.0
 */

interface IAccepptRejectPair<T, E> {
  accept: (value: T) => void;
  reject: (error: E | null) => void;
}

export class InitializationObserver<T, E> {
  private _acceptRejectPairs: Array<IAccepptRejectPair<T, E | null>>;
  private _timeoutMessage: E | null;
  private _initializedValue: T;
  private _isInitialized: boolean;

  constructor(timeout: number, timeoutMessage?: E) {
    this._acceptRejectPairs = [];
    this._timeoutMessage = timeoutMessage ?? null;

    globalThis.setTimeout(() => {
      if (!this._timeoutMessage) {
        console.warn("Failed to initialize object. Reason unknown.");
      }
      this._fireReject(this._timeoutMessage ?? null);
    }, timeout);
  }

  public accept(value: T): void {
    this._isInitialized = true;
    this._initializedValue = value;
    this._fireAccept(value);
  }

  private _fireAccept(value: T) {
    this._acceptRejectPairs.forEach(pair => {
      pair.accept(value);
    });
  }

  private _fireReject(error: E | null) {
    this._acceptRejectPairs.forEach(pair => {
      pair.reject(error);
    });
  }

  waitForInitialized(): Promise<T> {
    const _self = this;
    // If the value is already present, then accept immediately
    if (_self._isInitialized) {
      return new Promise<T>((accept: (value: T) => void, reject: (error: E | null) => void) => {
        accept(_self._initializedValue);
      });
    } else {
      return new Promise<T>((accept: (value: T) => void, reject: (error: E | null) => void) => {
        _self._acceptRejectPairs.push({ accept, reject });
      });
    }
  }
}
