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
var PlotBoilerpate$RectSelector = /** @class */ (function () {
    // Todo: rename callback to onRectSelected
    function PlotBoilerpate$RectSelector(bp, divID, normalization, callback) {
        // +---------------------------------------------------------------------------------
        // | Add a mouse listener to track the mouse position.
        // +-------------------------------
        var rect = document.getElementById(divID);
        var rectBounds = { xMin: 0, yMin: 0, xMax: 0, yMax: 0 };
        new MouseHandler(rect).up(function (e) {
            if (e.button != 0) // Left mouse button?
                return;
            rect.style.display = 'none';
            // console.log('xMin',rectBounds.xMin,'yMin',rectBounds.yMin,'xMax',rectBounds.xMax,'yMax',rectBounds.yMax);
            if (rectBounds.xMin != rectBounds.xMax && rectBounds.yMin != rectBounds.yMax)
                callback(rectBounds);
        });
        var mouseHandler = new MouseHandler(bp.canvas)
            .down(function (e) {
            if (e.button != 0) // Left mouse button?
                return;
            rect.style.display = 'inherit';
            rect.style.left = e.clientX + 'px';
            rect.style.top = e.clientY + 'px';
            rect.style.width = '1px';
            rect.style.height = '1px';
            var relPos = bp.transformMousePosition(e.params.mouseDownPos.x, e.params.mouseDownPos.y);
            rectBounds.xMin = rectBounds.xMax = normalization.unNormalizeX(relPos.x);
            rectBounds.yMin = rectBounds.yMax = normalization.unNormalizeY(relPos.y);
        })
            .up(function (e) {
            if (e.button != 0) // Left mouse button?
                return;
            // console.log('up');
            rect.style.display = 'none';
            // console.log('xMin',rectBounds.xStart,'yMin',rectBounds.yStart,'xMax',rectBounds.xEnd,'yMax',rectBounds.yEnd);
            //if( e.wasDragged )
            if (rectBounds.xMin != rectBounds.xMax && rectBounds.yMin != rectBounds.yMax)
                callback(rectBounds);
        })
            .drag(function (e) {
            if (e.button != 0) // Left mouse button?
                return;
            var bounds = {
                xMin: e.params.mouseDownPos.x,
                yMin: e.params.mouseDownPos.y,
                xMax: e.params.pos.x,
                yMax: e.params.pos.y
            };
            var relPos = bp.transformMousePosition(e.params.pos.x, e.params.pos.y);
            rectBounds.xMax = normalization.unNormalizeX(relPos.x);
            rectBounds.yMax = normalization.unNormalizeY(relPos.y);
            rect.style.width = (bounds.xMax - bounds.xMin) + 'px';
            rect.style.height = (bounds.yMax - bounds.yMin) + 'px';
        });
    }
    ; // END constructor
    return PlotBoilerpate$RectSelector;
}());
