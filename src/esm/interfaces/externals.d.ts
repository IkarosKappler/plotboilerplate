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
/**
 * This is just for the backdrop-filter vaules (CSS after effects filters). They are not directly
 * used by PB but can be passed through by the config/params.
 */
export interface CSSBackdropFilterParams {
    isBackdropFiltersEnabled?: boolean;
    effectFilterColor?: string;
    isEffectsColorEnabled?: boolean;
    opacity?: number;
    isOpacityEnabled?: boolean;
    invert?: number;
    isInvertEnabled?: boolean;
    sepia?: number;
    isSepiaEnabled?: boolean;
    blur?: number;
    isBlurEnabled?: boolean;
    brightness?: number;
    isBrightnessEnabled?: boolean;
    contrast?: number;
    isContrastEnabled?: boolean;
    dropShadow?: number;
    dropShadowColor?: string;
    isDropShadowEnabled?: boolean;
    grayscale?: number;
    isGrayscaleEnabled?: boolean;
    hueRotate?: number;
    isHueRotateEnabled?: boolean;
    saturate?: number;
    isSaturateEnabled?: boolean;
}
