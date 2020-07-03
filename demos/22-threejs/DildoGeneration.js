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

	this.ambientLightA = new THREE.AmbientLight( 0x0088ff ); 
	this.ambientLightA.position.set( 350, 350, 50 );
	this.scene.add( this.ambientLightA );
	
	this.directionalLightA = new THREE.DirectionalLight(0xffffff,1);
	this.directionalLightA.position.set( 350, 350, 50 );
	this.scene.add( this.directionalLightA );

	this.directionalLightB = new THREE.DirectionalLight(0xffffff,1);
	this.directionalLightB.position.set( -350, -350, -50 );
	this.scene.add( this.directionalLightB );

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
	    // _self.ambientLightA.position.set( _self.camera.position.y, _self.camera.position.x, _self.camera.position.z );
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
     * @param {BezierPath} options.outline
     * @param {number}     options.segmentCount
     **/
    DildoGeneration.prototype.rebuild = function( options ) {
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
	var outlineBounds = options.outline.getBounds();
	for( var i = 0; i <= options.segmentCount; i++ ) {
	    var vert = options.outline.getPointAt( i/options.segmentCount );
	    points.push( new THREE.Vector2( -vert.x+(outlineBounds.max.x) , -vert.y ) );
	}
	var geometry = new THREE.LatheGeometry( points, 12, Math.PI*2 );

	var material = new THREE.MeshPhongMaterial({ color: 0x3838ff, wireframe : false, flatShading: false, depthTest : true, opacity : 1.0, side : THREE.DoubleSide, visible : true, emissive : 0x0, reflectivity : 1.0, refractionRatio : 0.89, specular: 0x888888, /*, shading : THREE.LambertShading */ } )
	this.lathe = new THREE.Mesh( geometry, material );
	this.lathe.position.y = -100;
	this.camera.lookAt( new THREE.Vector3(20,0,150) );
	this.scene.add( this.lathe );
    };
    

    window.DildoGeneration = DildoGeneration;
})();
