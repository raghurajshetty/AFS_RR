sap.ui.controller("rewardsandrecognition.dynamicView", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf rewardsandrecognition.dynamicView
*/
	onInit: function() {
		/*jQuery.ajax({
			url:"http://localhost:8080/servicesforRR/catlist.svc/",
			dataType:"json",
			success:function(oData){
				console.log(oData);
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(oData);
				sap.ui.getCore().setModel(oModel);
				sap.ui.getCore().getElementById("iddynamicView--HLay").setModel(oModel);
			},
			error:function(err){
				console.log(err);
			}})*/
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf rewardsandrecognition.dynamicView
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf rewardsandrecognition.dynamicView
*/
	onAfterRendering: function() {
		var data;
		jQuery.ajax({
			url:"http://localhost:8080/servicesforRR/catlist.svc/Categorys",
			dataType:"json",
			success:function(oData){
				console.log(oData);
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(oData);
				for(var i=0;i<oData.d.results.length;i++){
					data = oData.d.results[i];
					data.Img = "data:image/png;base64," + data.Img;
				}
				sap.ui.getCore().getElementById("iddynamicView--HLay").setModel(oModel);
			},
			error:function(err){
				console.log(err);
			}})
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf rewardsandrecognition.dynamicView
*/
//	onExit: function() {
//
//	}

});