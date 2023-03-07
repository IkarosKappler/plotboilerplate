/**
 * @author   Ikaros Kappler
 * @date     2023-01-27
 * @modified 2023-02-04 Ported to Typescript.
 * @version  1.0.1
 */
import { EnvelopeSettings } from "./interfaces";
export declare class EnvelopeHandler {
    envelope: EnvelopeSettings;
    private onEnvelopeChanged;
    pb: any;
    attackTimeVert: any;
    releaseTimeVert: any;
    noteLengthVert: any;
    _attackControl: HTMLInputElement;
    _releaseControl: HTMLInputElement;
    _noteLengthControl: HTMLInputElement;
    _sustainLevelControl: HTMLInputElement;
    viewport: any;
    constructor(canvasId: string, GUP: Record<string, string>, backgroundColor: string, onEnvelopeChanged: (newEnvelope: EnvelopeSettings) => void);
    private _fireEnvelopeChanged;
    _updateVertices(): void;
    _updateValuesFromVertices(): void;
    _updateDisplay: () => void;
    /**
     * Set the values of the envelope
     * @param {number?} options.attackTime (optional)
     * @param {number?} options.releaseTime (optional)
     * @param {number?} options.sustainLevel (optional)
     * @param {number?} options.noteLength (optional)
     */
    setValues(options: EnvelopeSettings): void;
    update(): void;
}
