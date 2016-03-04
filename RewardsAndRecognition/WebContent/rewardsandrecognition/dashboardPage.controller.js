sap.ui.controller("rewardsandrecognition.dashboardPage", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf rewardsandrecognition.dashboardPage
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf rewardsandrecognition.dashboardPage
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf rewardsandrecognition.dashboardPage
*/
	onAfterRendering: function() {
		/*var oCanvas = document.getElementById("iddashboardPage--canvasSheet");
		var ctx = oCanvas.getContext("webgl");
		if(ctx){
			ctx.clearColor(0.0, 0.0, 0.0, 1.0);
			ctx.enable(ctx.DEPTH_TEST);
			ctx.depthFunc(ctx.LEQUAL);
			ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
		}*/
		
		
		/*
		 * using three.js
		 * var oScene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		
		var renderer = new THREE.WebGLRenderer();
        renderer.setSize(640, 480);
        document.getElementById("iddashboardPage--canvasSheet").appendChild(renderer.domElement);
        document.body.appendChild(renderer.domElement);
        
        var cubegeometry = new THREE.CubeGeometry(1,1,1);
        var cubematerial = new THREE.MeshBasicMaterial({ morphTargets: true, color: 0x00ff00, fog: false});
        
        var cube = new THREE.Mesh(cubegeometry, cubematerial);
        
        oScene.add(cube);
        
        camera.position.z = 5;
        
        var render = function () {
            requestAnimationFrame(render);

            cube.rotation.y += 0.01;
            cube.rotation.x += 0.01;
            cube.rotation.z += 0.01;

            renderer.render(oScene, camera);
        };

        // Calling the render function
        render();*/
		var oCanvas = document.getElementById("iddashboardPage--canvasSheet");
		var ctx = oCanvas.getContext("2d");
		ctx.beginPath();
		ctx.moveTo(320,20);
		ctx.quadraticCurveTo(-50, 60, 320, 100);
		ctx.strokeStyle= 'black';
		ctx.stroke();
		
		ctx.beginPath();
		ctx.moveTo(320,20);
		ctx.quadraticCurveTo(690, 60, 320, 100);
		ctx.strokeStyle = 'black';
		ctx.stroke();
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf rewardsandrecognition.dashboardPage
*/
//	onExit: function() {
//
//	}
	 back: function(){
		 var welcomeView = sap.ui.getCore().byId("idwelcomePage");
		 var oShell = sap.ui.getCore().byId("shellContainer");
		 oShell.removeAllContent();
		 oShell.addContent(welcomeView);	 
	 }
});