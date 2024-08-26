/**
 * Approach to observe objects from other scripts to be initialized.
 *
 * @author  Ikaros Kappler
 * @date    2024-07-08
 * @version 1.0.0
 */
export class InitializationObserver {
    constructor(timeout, timeoutMessage) {
        this._acceptRejectPairs = [];
        this._timeoutMessage = timeoutMessage !== null && timeoutMessage !== void 0 ? timeoutMessage : null;
        globalThis.setTimeout(() => {
            var _a;
            if (this._isInitialized) {
                return; // NOOP
            }
            // else
            if (!this._timeoutMessage) {
                console.warn("Failed to initialize object. Reason unknown.");
            }
            this._fireReject((_a = this._timeoutMessage) !== null && _a !== void 0 ? _a : null);
        }, timeout);
    }
    accept(value) {
        if (this._isInitialized) {
            return;
        }
        this._isInitialized = true;
        this._initializedValue = value;
        this._fireAccept(value);
    }
    _fireAccept(value) {
        this._acceptRejectPairs.forEach(pair => {
            pair.accept(value);
        });
    }
    _fireReject(error) {
        this._acceptRejectPairs.forEach(pair => {
            pair.reject(error);
        });
    }
    waitForInitialized() {
        const _self = this;
        // If the value is already present, then accept immediately
        if (_self._isInitialized) {
            return new Promise((accept, reject) => {
                accept(_self._initializedValue);
            });
        }
        else {
            return new Promise((accept, reject) => {
                _self._acceptRejectPairs.push({ accept, reject });
            });
        }
    }
}
//# sourceMappingURL=InitializationObserver.js.map