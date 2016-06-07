sap.ui.controller("rewardsandrecognition.Rewards", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf rewards.Rewards
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf rewards.Rewards
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf rewards.Rewards
*/
	onAfterRendering: function() {
		
		sap.ui.getCore().byId("idRewards--selCategory").setText(that._selCategory);
		var sUrl = "https://ldciey8.wdf.sap.corp:44320/sap/opu/odata/sap/ZREWARDSANDRECOGNITION_SRV/usersSet";
		
		$.ajax({
			url:sUrl,
			dataType:"json",
			crossDomain:true,
			success:function(oData){
				that._ouserList = oData;
				var ojsonModel = new sap.ui.model.json.JSONModel();
				ojsonModel.setData(oData);
				sap.ui.getCore().byId("idRewards--test").setModel(ojsonModel);
			},
			error:function(errLog){
				console.log(errLog);
			}
		})
		
		var nUrl = "https://ldciey8.wdf.sap.corp:44320/sap/opu/odata/SAP/ZREWARDSANDRECOGNITION_SRV/nominationsSet";
		
		$.ajax({
			url: nUrl,
			dataType:"json",
			crossDomain:true,
			success:function(oData){
				var oNomJson = 	new sap.ui.model.json.JSONModel();
				oNomJson.setData(oData);
				sap.ui.getCore().byId("idRewards--subList").setModel(oNomJson);
			},
			error:function(errLog){
				console.log(errLog);
			}
			
		})
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf rewards.Rewards
*/
//	onExit: function() {
//
//	}
	
	userSelected:function(oEvent){
		var oUserImage = sap.ui.getCore().byId("idRewards--userSelected");
		var ojsonModel = new sap.ui.model.json.JSONModel();
		ojsonModel.setData(that._ouserList);
		oUserImage.setModel(ojsonModel);
		oUserImage.bindProperty("src","ProfilePic");
		oUserImage.bindElement(oEvent.getParameters().selectedItem.getBindingContext().sPath);
		
		/*oEvent.getParameters().selectedItem.getBindingContext().sPath*/
		
	/*	sap.ui.getCore().byId("idRewards--userSelected").bindContext(
				oEvent.getParameters().selectedItem.getBindingContext());*/
	}

});