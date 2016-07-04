sap.ui.controller("rewardsandrecognition.Categories", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf akila_rnr.Akila_DashBoard
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf akila_rnr.Akila_DashBoard
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf akila_rnr.Akila_DashBoard
*/
	onAfterRendering: function() {
		/*jQuery(".sapUiUx3ShellHeader-logout").removeAttr("visible");*/
		jQuery(".sapUiUx3ShellHeader-logout").removeClass("hide");
		jQuery(".sapUiUx3ShellContent").removeClass("welcomeBackground");
		jQuery(".sapUiUx3ShellHeaderTitleLeft > span").removeClass("hide");
		sap.ui.getCore().byId("idCategories--loggedUser").setSrc(that._oUser.d.ProfilePic);
		sap.ui.getCore().byId("idCategories--userName").setText(that._oUser.d.Name);
		/*sap.ui.getCore().byId("idCategories--loggedUser").setSrc("images/profilePic/Raghuraj.jpg");*/
		jQuery.ajax({
			url:"https://ldciey8.wdf.sap.corp:44320/sap/opu/odata/SAP/ZREWARDSANDRECOGNITION_SRV/categoriesSet",
			/*url:"/sap/opu/odata/SAP/ZREWARDSANDRECOGNITION_SRV/categoriesSet",*/
			dataType:"json",
			crossDomain:true,
			success:function(oData){
				that._ocategories = oData;
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(oData);
				/*for(var i=0;i<oData.d.results.length;i++){
					data = oData.d.results[i];
					data.Img = "data:image/png;base64," + data.Img;
				}*/
				sap.ui.getCore().getElementById("idCategories--categoriesList").setModel(oModel);
			},
			error:function(err){
				console.log(err);
			}})
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf akila_rnr.Akila_DashBoard
*/
//	onExit: function() {
//
//	}
	
	navToRewards:function(oEvent){
		var selIndex = oEvent.getSource().getBindingContext().sPath;
		var indTab = selIndex.split("/");
		var categorySel = that._ocategories.d.results[indTab[3]];
		that._selCategory = categorySel;
		var oShell = sap.ui.getCore().byId("shellContainer");
		oShell.removeAllContent();
		var rewardsView = sap.ui.getCore().byId("idRewards");
		oShell.addContent(rewardsView);
	}

});