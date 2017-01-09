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
		comingFromDel = false;
		sap.ui.getCore().byId("idRewards--selCategory").setText(that._selCategory.CategoryName);
		that._oDialog.open();
		jQuery.sap.delayedCall(2000,this,function(){
			that._oDialog.close();
		});
		var sUrl = "https://ldciey8.wdf.sap.corp:44320/sap/opu/odata/sap/ZREWARDSANDRECOGNITION_SRV/usersSet";
		$.ajax({
			url:sUrl,
			dataType:"json",
			crossDomain:true,
			success:function(oData){
				that._ouserList = oData;
				var ojsonModel = new sap.ui.model.json.JSONModel();
				ojsonModel.setData(oData);
				sap.ui.getCore().byId("idRewards--nomineeSel").setModel(ojsonModel);
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
			success:function(oData,oStatus,oRequest){
				that._osubNomi = oData;
				var oNomJson = 	new sap.ui.model.json.JSONModel();
				oNomJson.setData(oData);
				sap.ui.getCore().byId("idRewards--subList").setModel(oNomJson);
			},
			error:function(errLog){
				console.log(errLog);
			}
			
		});
		
		
		var nsUrl = "https://ldciey8.wdf.sap.corp:44320/sap/opu/odata/SAP/ZREWARDSANDRECOGNITION_SRV/nominations_saveSet";
		$.ajax({
			url: nsUrl,
			dataType:"json",
			crossDomain:true,
			success:function(oData){
				that._osavNomi = oData;
				var oNomsJson = 	new sap.ui.model.json.JSONModel();
				oNomsJson.setData(oData);
				sap.ui.getCore().byId("idRewards--savList").setModel(oNomsJson);
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
		var oUserName  = sap.ui.getCore().byId("idRewards--userName");
		if(oEvent.getParameters().selectedItem != null){
		var userselPath = oEvent.getParameters().selectedItem.getBindingContext().sPath;
		var userArr = userselPath.split("/");
		/*var ojsonModel = new sap.ui.model.json.JSONModel();
		ojsonModel.setData(that._ouserList);
		oUserImage.setModel(ojsonModel);*/
		/*oUserImage.bindProperty("src","ProfilePic");
		oUserImage.bindElement(oEvent.getParameters().selectedItem.getBindingContext().sPath);*/
		oUserImage.setSrc(that._ouserList.d.results[userArr[3]].ProfilePic);
		var descString = that._ouserList.d.results[userArr[3]].Name + "\n" + that._ouserList.d.results[userArr[3]].ModuleName + "\n" + 
		 that._ouserList.d.results[userArr[3]].Team;
		 oUserName.setValue(descString);
		 that._toUser = that._ouserList.d.results[userArr[3]].Username;
		 that._nomTo = that._ouserList.d.results[userArr[3]].Name;
		}else{
			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.alert("Could not find a nominee with that name, please select from the dropdown list",{
			 	title:"Problem in nominee selection",
			 	onClose:function(){
			 		sap.ui.getCore().byId("idRewards").getController().clearContent();
			 	}
			});
		}
		
		
		
		
		/*oEvent.getParameters().selectedItem.getBindingContext().sPath*/
		
	/*	sap.ui.getCore().byId("idRewards--userSelected").bindContext(
				oEvent.getParameters().selectedItem.getBindingContext());*/

	},
	
	navtoCat:function(){
		 sap.ui.getCore().byId("idRewards").getController().clearContent();
		 var categoriesView = sap.ui.getCore().byId("idCategories")
		 var oShell = sap.ui.getCore().byId("shellContainer");
		 oShell.removeAllContent();
		 oShell.addContent(categoriesView);	 
	},
	
	submitNomination:function(oEvent){
		that._oDialog.open();
		if(this.getView().byId("nomineeSel").getValue() != "" && this.getView().byId("selReason").getValue() != "" ){
			
		var fromUser = that._oUser.d.Username;
		var nomFrom = that._oUser.d.Name;
		var toUser = that._toUser;
		var nomTo = that._nomTo;
		var catId = that._selCategory.CategoryId;
		var catName = that._selCategory.CategoryName;
		var reasonNom = sap.ui.getCore().byId("idRewards--selReason").getValue();
		var todayDate = new Date();
		var todayDD = todayDate.getDate();
		var todayMonth = todayDate.getMonth()+1;
		var todayYear = todayDate.getFullYear();
		if(todayDD<10){
			todayDD = "0"+todayDD;
		}
		if(todayMonth<10){
			todayMonth = "0"+todayMonth;
		}
		var today = todayYear+"-"+todayMonth+"-"+todayDD+"T00:00:00";

		var ojsonPayload ={
				"FromUser":fromUser,
				"ToUser":toUser,
				"CategoryId":catId,
				"NomiFromName":nomFrom,
				"NomiToName":nomTo,
				"CategoryName":catName,
				"Reason":reasonNom,
				"NomDate":today
		}
		
		var oModel = new sap.ui.model.odata.ODataModel("proxy/https/ldciey8.wdf.sap.corp:44320/sap/opu/odata/SAP/ZREWARDSANDRECOGNITION_SRV/",{
			json:true
		});
		
		oModel.create("/nominationsSet", ojsonPayload,{
			success:function(oData,response){
				that._oDialog.close();
				jQuery.sap.require("sap.m.MessageBox");
				 sap.m.MessageBox.success(oData.Reason,{
					 	title:"Nomination Submittion Status",
					 	onClose:function(){
					 		sap.ui.getCore().byId("idRewards").getController().clearContent();
					 	}
					});
				 sap.ui.getCore().byId("idRewards").getController().refreshSubNominations();
			},
			error:function(oError){
				that._oDialog.close();
				jQuery.sap.require("sap.m.MessageBox");
				sap.m.MessageBox.alert("Error in saving Nomination",{
				 	title:"Oops something went wrong!!",
				});
			}
		});
		}else{
			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.alert("Please make these checks\n 1) Is the nominee been selected?\n 2) Is the description been maintained?",{
			 	title:"Problem in submitting Nomination",
			 	onClose:function(){
			 		that._oDialog.close();
			 	}
			});
		}
	},
	
	saveNomination:function(oEvent){
		that._oDialog.open();
		if(this.getView().byId("nomineeSel").getValue() != "" && this.getView().byId("selReason").getValue() != "" ){
			
		var fromUser = that._oUser.d.Username;
		var nomFrom = that._oUser.d.Name;
		var toUser = that._toUser;
		var nomTo = that._nomTo;
		var catId = that._selCategory.CategoryId;
		var catName = that._selCategory.CategoryName;
		var reasonNom = sap.ui.getCore().byId("idRewards--selReason").getValue();
		var todayDate = new Date();
		var todayDD = todayDate.getDate();
		var todayMonth = todayDate.getMonth()+1;
		var todayYear = todayDate.getFullYear();
		if(todayDD<10){
			todayDD = "0"+todayDD;
		}
		if(todayMonth<10){
			todayMonth = "0"+todayMonth;
		}
		var today = todayYear+"-"+todayMonth+"-"+todayDD+"T00:00:00";

		var ojsonPayload ={
				"FromUser":fromUser,
				"ToUser":toUser,
				"CategoryId":catId,
				"NomiFromName":nomFrom,
				"NomiToName":nomTo,
				"CategoryName":catName,
				"Reason":reasonNom,
				"NomDate":today
		}
		
		var oModel = new sap.ui.model.odata.ODataModel("proxy/https/ldciey8.wdf.sap.corp:44320/sap/opu/odata/SAP/ZREWARDSANDRECOGNITION_SRV/",{
			json:true
		});
		
		oModel.create("/nominations_saveSet", ojsonPayload,{
			success:function(oData,response){
				that._oDialog.close();
				jQuery.sap.require("sap.m.MessageBox");
				 sap.m.MessageBox.success(oData.Reason,{
					 	title:"Nomination Save Status",
					 	onClose:function(){
					 		sap.ui.getCore().byId("idRewards").getController().clearContent();
					 	}
					});
				 sap.ui.getCore().byId("idRewards").getController().refreshSavNominations();
			},
			error:function(oError){
				that._oDialog.close();
				jQuery.sap.require("sap.m.MessageBox");
				sap.m.MessageBox.alert("Error in saving Nomination",{
				 	title:"Oops something went wrong!!",
				});
			}
		});
		
	  }else{
		  that._oDialog.close();
		  jQuery.sap.require("sap.m.MessageBox");
		  sap.m.MessageBox.alert("Please make these checks\n 1) Is the nominee been selected?\n 2) Is the description been maintained?",{
			 	title:"Problem in saving Nomination",
			});
	  }	
	},
	
	savetoSubmit:function(oEvent){
		if(!comingFromDel){
		 var bPath = oEvent.getSource().getBindingContext().sPath;
		 jQuery.sap.require("sap.m.MessageBox");
		 sap.m.MessageBox.confirm("Do you want to submit your nominations?",{
			onClose:function(oAction){
				switch(oAction){
				case "OK":
					        that._oDialog.open();
							var relArr = bPath.split("/");
							sap.ui.getCore().byId("idRewards").getController().submitFromSave(relArr[3]);
					break;
				case "CANCEL":
				}
			}
		});
	  }
		comingFromDel = false;
	},
	
	clearContent:function(oEvent){
		this.getView().byId("selReason").setValue('');
		this.getView().byId("nomineeSel").setValue('');
		this.getView().byId("nomineeSel").clearSelection();
		this.getView().byId("userSelected").setSrc('images/Rewards/nominee_2016.jpg');
		this.getView().byId("userName").setValue('Nominee Details');
	},
	
	submitFromSave:function(arrIndex){
		var fromUser = that._osavNomi.d.results[arrIndex].FromUser;
		var nomFrom = that._osavNomi.d.results[arrIndex].NomiFromName;
		var toUser = that._osavNomi.d.results[arrIndex].ToUser;
		var nomTo = that._osavNomi.d.results[arrIndex].NomiToName;
		var catId = that._osavNomi.d.results[arrIndex].CategoryId;
		var catName = that._osavNomi.d.results[arrIndex].CategoryName;
		var reasonNom = that._osavNomi.d.results[arrIndex].Reason;
		var todayDate = new Date();
		var todayDD = todayDate.getDate();
		var todayMonth = todayDate.getMonth()+1;
		var todayYear = todayDate.getFullYear();
		if(todayDD<10){
			todayDD = "0"+todayDD;
		}
		if(todayMonth<10){
			todayMonth = "0"+todayMonth;
		}
		var today = todayYear+"-"+todayMonth+"-"+todayDD+"T00:00:00";

		var ojsonPayload ={
				"FromUser":fromUser,
				"ToUser":toUser,
				"CategoryId":catId,
				"NomiFromName":nomFrom,
				"NomiToName":nomTo,
				"CategoryName":catName,
				"Reason":reasonNom,
				"NomDate":today
		}
		
		var oModel = new sap.ui.model.odata.ODataModel("proxy/https/ldciey8.wdf.sap.corp:44320/sap/opu/odata/SAP/ZREWARDSANDRECOGNITION_SRV/",{
			json:true
		});
		
		oModel.create("/nominationsSet", ojsonPayload,{
			success:function(oData,response){
				/**/
				jQuery.sap.require("sap.m.MessageToast");
				sap.m.MessageToast.show("Submitting Nomination, please wait",{
					
				});
				sap.ui.getCore().byId("idRewards").getController().refreshSubNominations();
				 var removeUrl = "/nominations_saveSet(FromUser='"+fromUser+"',ToUser='"+toUser+"',CategoryId='"+catId+"')";
				 oModel.remove(removeUrl,{
					 success:function(oData,response){
						 that._oDialog.close();
						 jQuery.sap.require("sap.m.MessageBox");
						 sap.m.MessageBox.success("Nomination Submitted",{
							 	title:"Nomination Submittion Status",
							});
						 sap.ui.getCore().byId("idRewards").getController().refreshSavNominations();
					 },
					 error:function(oError){
						 that._oDialog.close();
						 sap.m.MessageBox.alert("Error in saving Nomination",{
							 	title:"Oops something went wrong!!",
							});
					 }
				 });
			},
			error:function(oError){
				that._oDialog.close();
				jQuery.sap.require("sap.m.MessageBox");
				sap.m.MessageBox.alert("Error in saving Nomination",{
				 	title:"Oops something went wrong!!",
				});
			}
		});

	},
	
	refreshSavNominations:function(){
		that._oDialog.open();
		var nsUrl = "https://ldciey8.wdf.sap.corp:44320/sap/opu/odata/SAP/ZREWARDSANDRECOGNITION_SRV/nominations_saveSet";
		$.ajax({
			url: nsUrl,
			dataType:"json",
			crossDomain:true,
			success:function(oData){
				that._oDialog.close();
				that._osavNomi = oData;
				var oNomsJson = 	new sap.ui.model.json.JSONModel();
				oNomsJson.setData(oData);
				sap.ui.getCore().byId("idRewards--savList").setModel(oNomsJson);
			},
			error:function(errLog){
				console.log(errLog);
			}
			
		})
	},
	
	refreshSubNominations:function(){
		that._oDialog.open();
		var nUrl = "https://ldciey8.wdf.sap.corp:44320/sap/opu/odata/SAP/ZREWARDSANDRECOGNITION_SRV/nominationsSet";
		$.ajax({
			url: nUrl,
			dataType:"json",
			crossDomain:true,
			success:function(oData,oStatus,oRequest){
				that._oDialog.close();
				that._osubNomi = oData;
				var oNomJson = 	new sap.ui.model.json.JSONModel();
				oNomJson.setData(oData);
				sap.ui.getCore().byId("idRewards--subList").setModel(oNomJson);
			},
			error:function(errLog){
				console.log(errLog);
			}
			
		});
	},
	
	savNomDel:function(oEvent){
		comingFromDel = true;
		that._oDialog.open();
		var oModel = new sap.ui.model.odata.ODataModel("proxy/https/ldciey8.wdf.sap.corp:44320/sap/opu/odata/SAP/ZREWARDSANDRECOGNITION_SRV/",{
			json:true
		});
		var bPath = oEvent.getParameter("listItem").getBindingContext().sPath;
		var relArr = bPath.split("/");
		
		var fromUser = that._osavNomi.d.results[relArr[3]].FromUser;
		var toUser = that._osavNomi.d.results[relArr[3]].ToUser;
		var catId = that._osavNomi.d.results[relArr[3]].CategoryId;
		
		var removeUrl = "/nominations_saveSet(FromUser='"+fromUser+"',ToUser='"+toUser+"',CategoryId='"+catId+"')";
		 oModel.remove(removeUrl,{
			 success:function(oData,response){
				 that._oDialog.close();
				 jQuery.sap.require("sap.m.MessageBox");
				 sap.m.MessageBox.success("Saved Nomination Deleted",{
					 	title:"Nomination Deletion Status",
					});
				 sap.ui.getCore().byId("idRewards").getController().refreshSavNominations();
			 },
			 error:function(oError){
				 that._oDialog.close();
				 sap.m.MessageBox.alert("Error in saving Nomination",{
					 	title:"Oops something went wrong!!",
					});
			 }
		 });
	}
	
});