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
	
	ssoLogin: function() {
		
		var surl = "https://ldciey8.wdf.sap.corp:44320/sap/opu/odata/SAP/ZREWARDSANDRECOGNITION_SRV/usersSet(Username='SSO')";
		/*var surl = "/sap/opu/odata/SAP/ZREWARDSANDRECOGNITION_SRV/usersSet(Username='SSO')";*/
		/*var surl = "/sap/opu/odata/SAP";*/
		that = this;
		$.ajax({
			url: surl,
			dataType:"json",
			crossDomain:true,
			success:function(oData){
				that._oUser = oData;
				var oShell = sap.ui.getCore().byId("shellContainer");
				oShell.removeAllContent();
				var categoriesView = sap.ui.getCore().byId("idCategories");
				oShell.addContent(categoriesView);
			},
			error:function(errLog){
				console.log(errLog);
			}
		})
		
	}

});