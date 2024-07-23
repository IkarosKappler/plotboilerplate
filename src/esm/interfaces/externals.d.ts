/**
 * @author  Ikaros Kappler
 * @date    2021-07-00
 * @version 1.0.0
 */
export interface DatGuiProps {
    name?: string;
    load?: object;
    parent?: dat.GUI;
    autoPlace?: boolean;
    hideable?: boolean;
    closed?: boolean;
    closeOnTop?: boolean;
}
export interface GUI {
    domElement: HTMLElement;
}
export interface LilGuiProps {
    name?: string;
    load?: object;
    parent?: dat.GUI;
    autoPlace?: boolean;
    hideable?: boolean;
    closed?: boolean;
    closeOnTop?: boolean;
}
