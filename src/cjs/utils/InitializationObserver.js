"use strict";
/**
 * Approach to observe objects from other scripts to be initialized.
 *
 * @author  Ikaros Kappler
 * @date    2024-07-08
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializationObserver = void 0;
var InitializationObserver = /** @class */ (function () {
    function InitializationObserver(timeout, timeoutMessage) {
        var _this = this;
        this._acceptRejectPairs = [];
        this._timeoutMessage = timeoutMessage !== null && timeoutMessage !== void 0 ? timeoutMessage : null;
        globalThis.setTimeout(function () {
            var _a;
            if (_this._isInitialized) {
                return; // NOOP
            }
            // else
            if (!_this._timeoutMessage) {
                console.warn("Failed to initialize object. Reason unknown.");
            }
            _this._fireReject((_a = _this._timeoutMessage) !== null && _a !== void 0 ? _a : null);
        }, timeout);
    }
    InitializationObserver.prototype.accept = function (value) {
        if (this._isInitialized) {
            return;
        }
        this._isInitialized = true;
        this._initializedValue = value;
        this._fireAccept(value);
    };
    InitializationObserver.prototype._fireAccept = function (value) {
        this._acceptRejectPairs.forEach(function (pair) {
            pair.accept(value);
        });
    };
    InitializationObserver.prototype._fireReject = function (error) {
        this._acceptRejectPairs.forEach(function (pair) {
            pair.reject(error);
        });
    };
    InitializationObserver.prototype.waitForInitialized = function () {
        var _self = this;
        // If the value is already present, then accept immediately
        if (_self._isInitialized) {
            return new Promise(function (accept, reject) {
                accept(_self._initializedValue);
            });
        }
        else {
            return new Promise(function (accept, reject) {
                _self._acceptRejectPairs.push({ accept: accept, reject: reject });
            });
        }
    };
    return InitializationObserver;
}());
exports.InitializationObserver = InitializationObserver;
//# sourceMappingURL=InitializationObserver.js.map