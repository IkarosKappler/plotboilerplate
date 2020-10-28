/**
 * @requires Color
 * 
 * @date 2020-10-27
 **/

import { Color } from "./datastructures/Color";
import { shuffleWebColors } from "./WebColors";

const ORDER_CONTRAST : Array<number> = [ 8, 0, 6, 4, 1, 9, 2, 10, 3, 7, 5 ];

export const WebColorsContrast = shuffleWebColors( ORDER_CONTRAST );
