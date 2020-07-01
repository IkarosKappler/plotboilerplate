/**
 * @author  Ikaros Kappler
 * @date    2020-07-01
 * @version 1.0.0
 **/

(function() {

    var DildoGeneration = function( canvasId ) {
	this.canvas = document.getElementById( canvasId );
	this.parent = this.canvas.parentElement;

	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	this.camera.position.z = 500;
	// this.camera.position.x = -50;
	// this.camera.position.y = -50;

	this.light = new THREE.AmbientLight( 0x0000ff, 0.5 ); //, 100.5 ); // , 600, 100 );
	var pointLight = new THREE.PointLight( 0xffffff, 700, 200 );
	pointLight.position.x = 100;
	this.scene.add( pointLight );
	this.light.position.set( 250, 250, 50 );
	this.scene.add( this.light );

	this.renderer = new THREE.WebGLRenderer( { canvas: this.canvas,
						   preserveDrawingBuffer: true,   // This is required to take screen shots
						   antialias: false
						 } );
	this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
	this.controls.update();

	this.lathe = null;

	var _self = this;
	window.addEventListener( 'resize', function() { _self.resizeCanvas(); } );
	this.resizeCanvas();

	var i = 0;
	function animate() {
	    if( i % 100 == 0 )
		console.log('animate');
	    requestAnimationFrame( animate );
	    _self.controls.update();
	    _self.light.position.set( -_self.camera.position.x, -_self.camera.position.y, -_self.camera.position.z );
	    _self.renderer.render( _self.scene, _self.camera );
	    i++;
	}
	animate();
    };

    DildoGeneration.prototype.resizeCanvas = function() {
	let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	this.canvas.width = width;
	this.canvas.height = height;
	this.canvas.style.width = "" + width + "px";
	this.canvas.style.height = "" + height + "px";
	this.canvas.setAttribute( "width", "" + width + "px" );
	this.canvas.setAttribute( "height", height + "px" );
	this.renderer.setSize( width, height );
	// What am I doing here?
	this.camera.setViewOffset( width, height, width/4, height/20, width, height );
    };

    /**
     * @param {BezierPath} outline
     **/
    DildoGeneration.prototype.rebuild = function( outline ) {
	if( this.lathe != null ) {
	    // Remove old object.
	    //  A better way would be to update the lathe in-place. Possible?
	    this.scene.remove( this.lathe );
	    this.lathe.geometry.dispose();
	    this.lathe.material.dispose();
	    this.lathe = undefined;
	}

	// Compare with lathe example
	//    https://threejs.org/docs/#api/en/geometries/LatheGeometry
	
	var points = [];
	for( var i = 0; i <= 100; i++ ) {
	    var vert = outline.getPointAt( i/100 );
	    points.push( new THREE.Vector2( -vert.x, -vert.y ) );
	}
	var geometry = new THREE.LatheGeometry( points, 12, Math.PI*2 );
	// var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
	// var material = new THREE.MeshBasicMaterial({ color: 0x999999, wireframe: false, transparent: false, opacity: 0.85 } );
	var material = new THREE.MeshPhongMaterial({ color: 0xffff00, wireframe : false, flatShading: false, depthTest : true, opacity : 1.0, side : THREE.DoubleSide, visible : true, /* emissive : 0x0, reflectivity : 1.0, refractionRatio : 0.89, shinyness: 50 */ } )
	/* var material = new THREE.MeshPhongMaterial( 
	    { color: 0x151D28, // 0x151D28, //0x2D303D, 
	      ambient: 0x996633, // 0xffffff, // 0x996633, // should generally match color
	      specular: 0x888888, // 0x050505,
	      shininess: 50, //100,
	      //emissive: 0x101010, // 0x000000, 
	      wireframe: false, // wireFrame, 
	      shading: THREE.LambertShading // THREE.FlatShading 
	    } 
	); */
	this.lathe = new THREE.Mesh( geometry, material );
	// lathe.rotation.x = Math.PI;
	this.lathe.position.y = -100;
	this.camera.lookAt( new THREE.Vector3(20,0,150) );
	this.lathe.name = "my-dildo";
	// console.log( 'rebuilt', lathe );
	this.scene.add( this.lathe );
    };
    

    window.DildoGeneration = DildoGeneration;
})();
