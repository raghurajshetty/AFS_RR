sap.ui.controller("rewardsandrecognition.welcomePage", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf rewardsandrecognition.welcomePage
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf rewardsandrecognition.welcomePage
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf rewardsandrecognition.welcomePage
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf rewardsandrecognition.welcomePage
*/
//	onExit: function() {
//
//	}
	
	gofwd: function() {
		var oShell = sap.ui.getCore().byId("shellContainer");
		oShell.removeAllContent();
		var dashboardView = sap.ui.getCore().byId("iddashboardPage");
		oShell.addContent(dashboardView);
	}

});