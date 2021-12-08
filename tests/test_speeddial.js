/**
 * @author  Ikaros Kappler
 * @date    2021-12-08
 * @version 1.0.0
 */

window.addEventListener("load", function() {

    // console.log("SpeedDial class", SpeedDial);

    var speedDial = new SpeedDial();
    speedDial.addActionButton( "A", function() { console.log("A clicked."); } );
    speedDial.addActionButton( "B", function() { console.log("B clicked."); } );
    speedDial.addActionButton( "C", function() { console.log("C clicked."); } );

});