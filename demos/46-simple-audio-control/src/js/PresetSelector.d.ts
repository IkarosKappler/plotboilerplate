/**
 * @date 2023-01-28
 * @modified 2023-02-04 Ported to Typescript.
 */
import { TrackPreset } from "./interfaces";
export declare class PresetSelector {
    constructor(onPresetSelected: (selectedPreset: TrackPreset) => void);
}
