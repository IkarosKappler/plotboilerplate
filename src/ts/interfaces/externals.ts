/**
 * @author  Ikaros Kappler
 * @date    2021-07-00
 * @version 1.0.0
 */

// https://www.npmjs.com/package/@types/dat.gui
// @DEPRECATED Dat.GUI is replaced by lil-gui.
export interface DatGuiProps {
  name?: string;
  load?: object;
  parent?: dat.GUI;
  autoPlace?: boolean;
  hideable?: boolean;
  closed?: boolean;
  closeOnTop?: boolean;
}

// Compatible with dat.gui and lil-gui.
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
  // A global switch to enable/disable all filters
  isBackdropFiltersEnabled?: boolean;
  // This is just for the global effect color
  effectFilterColor?: string; // "#204a87",
  isEffectsColorEnabled?: boolean;
  // These are real filter values
  opacity?: number; // 0.5,
  isOpacityEnabled?: boolean; // false,
  invert?: number; // 0.8,
  isInvertEnabled?: boolean; // false,
  sepia?: number; // 0.9,
  isSepiaEnabled?: boolean; // false,
  blur?: number; // 2, // px
  isBlurEnabled?: boolean; // false,
  brightness?: number; // 0.6,
  isBrightnessEnabled?: boolean; // false,
  contrast?: number; // 0.9,
  isContrastEnabled?: boolean; // false,
  dropShadow?: number; // 4, // px
  dropShadowColor?: string; // "#00ffff",
  isDropShadowEnabled?: boolean; // false,
  grayscale?: number; // 0.3,
  isGrayscaleEnabled?: boolean; // false,
  hueRotate?: number; // 120, // deg
  isHueRotateEnabled?: boolean; // false,
  saturate?: number; // 2.0,
  isSaturateEnabled?: boolean; // false
}
