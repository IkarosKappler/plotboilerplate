/**
 * @authos   Ikaros Kappler
 * @date     2023-01-28
 * @modified 2023-02-03 Ported to typescript.
 * @version  1.0.1
 */
import { MainSettings } from "./interfaces";
export declare class MainControls {
    values: MainSettings;
    context: AudioContext;
    masterVolume: GainNode;
    volumeControl: HTMLInputElement;
    tempoControl: HTMLInputElement;
    constructor();
    _updateDisplays(): void;
    setValues(options: MainSettings): void;
}
