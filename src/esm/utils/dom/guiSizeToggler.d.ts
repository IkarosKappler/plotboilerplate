/**
 * @requires dat.gui
 *
 * @author   Ikaros Kappler
 * @date     2021-12-13
 * @modified 2022-01-10
 * @modified 2024-06-25 Ported to typescript and moved to utils/dom (was located inside demos before).
 * @version  1.1.0
 */
import { GUI } from "../../interfaces/externals";
interface ITogglerConfig {
    guiDoubleSize?: boolean;
}
export declare const guiSizeToggler: (gui: GUI, config: ITogglerConfig, cssProps: Record<string, string>) => {
    update: () => void;
};
export {};
