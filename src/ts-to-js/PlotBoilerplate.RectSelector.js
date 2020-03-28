/**
 * A rectangular-selector tool for the plot-boilerplate using DIVs.
 *
 * This is to avoid redraw-events to be fired during the selection process (for large content
 * that takes long to redraw).
 *
 * @require PlotBoilerplate, MouseHandler
 *
 * @author  Ikaros Kappler
 * @date    2018-12-30
 * @version 1.0.0
 **/
var PlotBoilerpate = /** @class */ (function () {
    function PlotBoilerpate() {
    }
    return PlotBoilerpate;
}());
RectSelector;
{
    // Todo: rename callback to onRectSelected
    constructor(bp, PlotBoilerplate, divID, string, normalization, Normalization, callback, function (bounds) { return void ; });
    {
        // +---------------------------------------------------------------------------------
        // | Add a mouse listener to track the mouse position.
        // +-------------------------------
        var rect_1 = document.getElementById(divID);
        var rectBounds_1 = { xMin: 0, yMin: 0, xMax: 0, yMax: 0 };
        new MouseHandler(rect_1).up(function (e) {
            if (e.button != 0) // Left mouse button?
                return;
            rect_1.style.display = 'none';
            // console.log('xMin',rectBounds.xMin,'yMin',rectBounds.yMin,'xMax',rectBounds.xMax,'yMax',rectBounds.yMax);
            if (rectBounds_1.xMin != rectBounds_1.xMax && rectBounds_1.yMin != rectBounds_1.yMax)
                callback(rectBounds_1);
        });
        var mouseHandler = new MouseHandler(bp.canvas)
            .down(function (e) {
            if (e.button != 0) // Left mouse button?
                return;
            rect_1.style.display = 'inherit';
            rect_1.style.left = e.clientX + 'px';
            rect_1.style.top = e.clientY + 'px';
            rect_1.style.width = '1px';
            rect_1.style.height = '1px';
            var relPos = bp.transformMousePosition(e.params.mouseDownPos.x, e.params.mouseDownPos.y);
            rectBounds_1.xMin = rectBounds_1.xMax = normalization.unNormalizeX(relPos.x);
            rectBounds_1.yMin = rectBounds_1.yMax = normalization.unNormalizeY(relPos.y);
        })
            .up(function (e) {
            if (e.button != 0) // Left mouse button?
                return;
            // console.log('up');
            rect_1.style.display = 'none';
            // console.log('xMin',rectBounds.xStart,'yMin',rectBounds.yStart,'xMax',rectBounds.xEnd,'yMax',rectBounds.yEnd);
            //if( e.wasDragged )
            if (rectBounds_1.xMin != rectBounds_1.xMax && rectBounds_1.yMin != rectBounds_1.yMax)
                callback(rectBounds_1);
        })
            .drag(function (e) {
            if (e.button != 0) // Left mouse button?
                return;
            var bounds = {
                xStart: e.params.mouseDownPos.x,
                yStart: e.params.mouseDownPos.y,
                xEnd: e.params.pos.x,
                yEnd: e.params.pos.y
            };
            var relPos = bp.transformMousePosition(e.params.pos.x, e.params.pos.y);
            rectBounds_1.xMax = normalization.unNormalizeX(relPos.x);
            rectBounds_1.yMax = normalization.unNormalizeY(relPos.y);
            rect_1.style.width = (bounds.xEnd - bounds.xStart) + 'px';
            rect_1.style.height = (bounds.yEnd - bounds.yStart) + 'px';
        });
    }
    ; // END constructor
}
