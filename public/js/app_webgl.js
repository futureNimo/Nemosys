var container, stats;
var camera, controls, scene, renderer;
var cross;

initialize();
animate();


function initialize() {
  console.log("Starting initialize()");

  // create a scene 
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 11111111 ); // --- set background color (purple in this case)


  // Create a camera which will be appened to the scene object
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 1e10 );
  camera.position.z = 2;

  // Create a controls object which allows for user control of the camera position 
  controls = new THREE.TrackballControls( camera );
  controls.rotateSpeed = 5.0;
  controls.zoomSpeed = 5;
  controls.panSpeed = 2;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  // append the camera to the scene object
  scene.add( camera );

  // lights
  var dirLight = new THREE.DirectionalLight( 0xffffff ); // directional light
  dirLight.position.set( 200, 200, 1000 ).normalize(); 
  camera.add( dirLight );
  camera.add( dirLight.target );


  var ambientLight = new THREE.AmbientLight(0x0c0c0c); 
  camera.add(ambientLight);

  // Create an zyx axes at the origin 
  var axes = new THREE.AxisHelper(20); // length of axes displayed is argument 
  scene.add(axes);

  // note: In threejs, in order to display an object you need to create a "mesh". A "mesh" 
  // consists of a "geometry" and a "material". 
  var material = new THREE.MeshLambertMaterial( 
      { 
	  color: 0xffffff, 
	  side: THREE.DoubleSide, 
	  wireframe: true 
	  
      });


  // ------------------------------------------------------------------------------------------
  // --------------- this is what we need to connect with the upload --------------------------
  // ------------------------------------------------------------------------------------------
  // note: the VTKLoader only works for a subset of VTK!!! 
  // Alternatively, the "STLLoader" can be used with the same syntax
  // var loader = new THREE.VTKLoader();
  var loader = new THREE.STLLoader();
  loader.load( "models/exampleCube.stl", function ( geometry ) {
  // loader.load( "models/exampleCube.vtk", function ( geometry ) {

      geometry.center();
      geometry.computeVertexNormals();

      // "mesh" from "geometry" and "material"
      var mesh = new THREE.Mesh( geometry, material ); 
      mesh.position.set( 0, 0, 0 );
      mesh.scale.multiplyScalar( 1 );
      scene.add( mesh ); // append the mesh to the scene

  } );
  // ------------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------------
	  

  // Create a renderer
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( 500, 500 ); // <---- customize this to fit in the "div" container!!!

  // container = document.createElement( 'div' );
  container = document.getElementById( 'webglContainerSrc' ) 
  // <----- in template, create a div with this ... repeat for additional container, ie 
  // one for the "input mesh" and one for the "target mesh"

  // renderer.setSize( container.innerWidth, container.innerHeight ); 
  // <---- customize this to fit in the "div" container!!!
  document.body.appendChild( container );
  container.appendChild( renderer.domElement );


  // display stats (not needed, debug only)
  // stats = new Stats();
  // container.appendChild( stats.dom );

  // watch for window resize - see function def below
  window.addEventListener( 'resize', onWindowResize, false );

}


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  controls.handleResize();
}


// --- this actually renders the screen and attempts to maintain 
// a constant 60 fps refresh rate (ie, this is "called" 60 times per sec) ---------------
function animate() {
  requestAnimationFrame( animate );
  controls.update();
  renderer.render( scene, camera );
  stats.update();
}

