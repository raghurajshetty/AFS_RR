/*sap.ui.controller("rewardsandrecognition.dashboardPage", {

*//**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf rewardsandrecognition.dashboardPage
*//*
//	onInit: function() {
//
//	},

*//**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf rewardsandrecognition.dashboardPage
*//*
//	onBeforeRendering: function() {
//
//	},

*//**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf rewardsandrecognition.dashboardPage
*//*
	onAfterRendering: function() {
		var oCanvas = document.getElementById("iddashboardPage--canvasSheet");
		var ctx = oCanvas.getContext("webgl");
		if(ctx){
			ctx.clearColor(0.0, 0.0, 0.0, 1.0);
			ctx.enable(ctx.DEPTH_TEST);
			ctx.depthFunc(ctx.LEQUAL);
			ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
		}
		
		
		
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
        render();
		This piece of code can be used if we need to do anything with respect SVG
		 * var oCanvas = document.getElementById("iddashboardPage--canvasSheet"); 
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

*//**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf rewardsandrecognition.dashboardPage
*//*
//	onExit: function() {
//
//	}
	 back: function(){
		 var welcomeView = sap.ui.getCore().byId("idwelcomePage");
		 var oShell = sap.ui.getCore().byId("shellContainer");
		 oShell.removeAllContent();
		 oShell.addContent(welcomeView);	 
	 }
});*/


sap.ui.controller("rewardsandrecognition.dashboardPage", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf rewardsandrecognition.dashboardPage
*/
//    onInit: function() {
//
//    },

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf rewardsandrecognition.dashboardPage
*/
      onBeforeRendering: function() {
    	  
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
                        sap.ui.getCore().getElementById("idDashboard--idCarousel").setModel(oModel);}
            });
                  
                  
                  
      },

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf rewardsandrecognition.dashboardPage
*/
      
      onInit: function() {
            
    	    this._oDialog = this.getView().byId("busyDialog");
            console.log("Init");
            debugger;
//          
            var oModel = new sap.ui.model.json.JSONModel();
            var oVizFrame = this.getView().byId("idcolumn");
            var oVizFrame1 = this.getView().byId("idcolumn2");
            var oVizFrame2 = this.getView().byId("idcolumn3");
            var oVizFrame3 = this.getView().byId("idcolumn4");
            
//         
      //
            that=this;             
            jQuery.ajax({
                  url:"https://ldciey8.wdf.sap.corp:44320/sap/opu/odata/SAP/ZREWARDSANDRECOGNITION_SRV/categoriesSet",
                  /*url:"/sap/opu/odata/SAP/ZREWARDSANDRECOGNITION_SRV/categoriesSet",*/
                  dataType:"json",
                  crossDomain:true,
                  success:function(oData){ 
             jQuery.ajax({
                              //url:"https://ldciey8.wdf.sap.corp:44320/sap/opu/odata/sap/ZTESTRNRRESULT_SRV/categoriesSet('IN')/CatetoNomCnt",
                 url:"https://ldciey8.wdf.sap.corp:44320/sap/opu/odata/sap/ZTESTRNRRESULT_SRV/categoriesSet("+"'"+oData.d.results[0].CategoryId+"')/CatetoNomCnt",
//                      url:"/sap/opu/odata/SAP/ZREWARDSANDRECOGNITION_SRV/categoriesSet",
                        dataType:"json",
                        crossDomain:true,
                        success:function(oData){
                              var i =0;
                              var afs = new Array();
                              var afstop = new Array();
                              var fmstop = new Array();
                              var fms = new Array();
                              
                              for (i=0; i < oData.d.results.length; i++)
                                    {
                                    if (oData.d.results[i].SubTeam=="AFS")
                                          {
                                             afs.push(oData.d.results[i]);
                                          }
                                    else 
                                          {
                                          fms.push(oData.d.results[i]); 
                                          }
                                    }
                              if (afs.length > 3)
                                    {
                                    for (i=0; i < 3; i++)
                                          {
                                             afstop.push (afs[i]);
                                          }
                                    }
                              
                              if (fms.length > 3)
                              {
                              for (i=0; i < 3; i++)
                                    {
                                       fmstop.push (fms[i]);
                                    }
                              }
                              var oModel = new sap.ui.model.json.JSONModel();
                              if (afstop.length>0)
                                    {
                              that._oAfs = afstop;
                              oModel.setData(afstop);
                                    }
                              else
                                    {
                                    that._oAfs = afs;
                                    oModel.setData(afs);
                                    }
                        
                                var oDataset = new sap.viz.ui5.data.FlattenedDataset({
                            dimensions : [{
                                            name : 'Nominee',
                                            value : '{NomiToName}'}],
                                           
                            measures : [{
                                            name : 'Votes',
                                            value : '{NomCount}'} ],
                                         
                            data : {
                                            path : "/"
                            }
            });                           
            oVizFrame.setDataset(oDataset);
            oVizFrame.setModel(oModel);
            oVizFrame.setLegendVisible(true);
           // oVizFrame.setTitle("AFS");
            oVizFrame.setVizType('column');
            oVizFrame.setVizProperties({
                  plotArea: {
                          colorPalette : d3.scale.category20().range()
                      },
                      
                    
                          title:{
                              visible: true,
                              text: "AFS-Top 3"
                          }});
                          
                          var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                                'uid': "valueAxis",
                                'type': "Measure",
                                'values': ["Votes"]
                              }); 
                              feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                                'uid': "categoryAxis",
                                'type': "Dimension",
                                'values': ["Nominee"]
                              });
                              oVizFrame.removeAllFeeds();
                          oVizFrame.addFeed(feedValueAxis);
                          oVizFrame.addFeed(feedCategoryAxis);
                   
                          
                          oVizFrame.attachSelectData(function(event) {
                              var data = event.getParameter('data');
                              for ( var i = 0; i < data.length; i++) {
                                  console.log(oDataset.findContext(data[i].data))
                              }
                          });
                        
           
            var oModelfms = new sap.ui.model.json.JSONModel();
           
            if (fmstop.length>0)
            {
                 oModelfms.setData(fmstop);
            }
      else
            {
            oModelfms.setData(fms);
            }
      
      sap.ui.getCore().getElementById("idDashboard--idcolumn2").setModel(oModelfms);
              var oDataset = new sap.viz.ui5.data.FlattenedDataset({
              dimensions : [{
                              name : 'Nominee',
                              value : '{NomiToName}'}],
                             
              measures : [{
                              name : 'Votes',
                              value : '{NomCount}'} ],
                           
              data : {
                              path : "/"
              }
});                           
oVizFrame1.setDataset(oDataset);
oVizFrame1.setModel(oModelfms); 
oVizFrame1.setVizType('column');
oVizFrame1.setVizProperties({
      plotArea: {
              colorPalette : d3.scale.category20().range()
          },
              title:{
                  
                  text: "FMS-Top 3"
              }});
              
              var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                    'uid': "valueAxis",
                    'type': "Measure",
                    'values': ["Votes"]
                  }), 
                  feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                    'uid': "categoryAxis",
                    'type': "Dimension",
                    'values': ["Nominee"]
                  });
              oVizFrame1.removeAllFeeds();
              oVizFrame1.addFeed(feedValueAxis);
              oVizFrame1.addFeed(feedCategoryAxis);
      
              
              oVizFrame1.attachSelectData(function(event) {
                  var data = event.getParameter('data');
                  for ( var i = 0; i < data.length; i++) {
                      console.log(oDataset.findContext(data[i].data))
                  }
              });
              
      }     
             
      });

}
});
           
/////////////////////////////////////////////////////////////////////column chart starts here-----------------------------------------------------------------
           
//         
//          
      

            
            jQuery.ajax({
                  url:"https://ldciey8.wdf.sap.corp:44320/sap/opu/odata/SAP/ZREWARDSANDRECOGNITION_SRV/categoriesSet",
                  /*url:"/sap/opu/odata/SAP/ZREWARDSANDRECOGNITION_SRV/categoriesSet",*/
                  dataType:"json",
                  crossDomain:true,
                  success:function(oData){ 
            jQuery.ajax({
                  url:"https://ldciey8.wdf.sap.corp:44320/sap/opu/odata/sap/ZTESTRNRRESULT_SRV/categoriesSet("+"'"+oData.d.results[0].CategoryId+"')/CatetoNomCnt",
                  /*url:"/sap/opu/odata/SAP/ZREWARDSANDRECOGNITION_SRV/categoriesSet",*/
                  dataType:"json",
                  crossDomain:true,
                  success:function(oData){ 
                        
                  
                        
                        var i =0;
                        var afs = new Array();
                        var fms = new Array();
                        
                        for (i=0; i < oData.d.results.length; i++)
                              {
                              if (oData.d.results[i].SubTeam=="AFS")
                                    {
                                       afs.push(oData.d.results[i]);
                                    }
                              else 
                                    {
                                    fms.push(oData.d.results[i]); 
                                    }
                              }
                        
                        that._oafs = afs;
                        that._ofms = fms;
                        
                        
                        var model = new sap.ui.model.json.JSONModel();
                        
                  
                        model.setData(afs);
                        
                        var oDataset = new sap.viz.ui5.data.FlattenedDataset({
                     dimensions : [{
                                     name : 'Nominee',
                                     value : '{NomiToName}'}],
                                    
                     measures : [{
                                     name : 'Votes',
                                     value : '{NomCount}'} ],
                                  
                     data : {
                                     path : "/"
                     }
     });                           
     oVizFrame2.setDataset(oDataset);
     oVizFrame2.setModel(model); 
     oVizFrame2.setVizType('column');
     oVizFrame2.setVizProperties({
     plotArea: {
             colorPalette : d3.scale.category20().range()
         },
             title:{
                 visible: true,
                 text: "AFS"
             }});
             
              var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                   'uid': "valueAxis",
                   'type': "Measure",
                   'values': ["Votes"]
                 }); 
                  feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                   'uid': "categoryAxis",
                   'type': "Dimension",
                   'values': ["Nominee"]
                 });
                 oVizFrame2.removeAllFeeds();
             oVizFrame2.addFeed(feedValueAxis);
             oVizFrame2.addFeed(feedCategoryAxis);
             
              
              
             var model1 = new sap.ui.model.json.JSONModel();
                        
                  
                        model1.setData(fms);
                        
                        var oDataset = new sap.viz.ui5.data.FlattenedDataset({
                    dimensions : [{
                                    name : 'Nominee',
                                    value : '{NomiToName}'}],
                                   
                    measures : [{
                                    name : 'Votes',
                                    value : '{NomCount}'} ],
                                 
                    data : {
                                    path : "/"
                    }
    });                           
    oVizFrame3.setDataset(oDataset);
    oVizFrame3.setModel(model1); 
    oVizFrame3.setVizType('column');
    oVizFrame3.setVizProperties({
                  plotArea: {
              colorPalette : d3.scale.category20().range()
                              },
              title:{
                  
                  text: 'FMS'
              }});
              
              var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                    'uid': "valueAxis",
                    'type': "Measure",
                    'values': ["Votes"]
                  }); 
                  feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                    'uid': "categoryAxis",
                    'type': "Dimension",
                    'values': ["Nominee"]
                  });
                  oVizFrame3.removeAllFeeds();
              oVizFrame3.addFeed(feedValueAxis);
              oVizFrame3.addFeed(feedCategoryAxis);
//                
                  }
            });

                  }
            });
           
            
////
////
      },
      
      test : function(oEvent)
     {
//          
            var arr = that._oafs;
            var catid = arr[oEvent.getParameters().data[0].data._context_row_number].CatId;
            var uname = arr[oEvent.getParameters().data[0].data._context_row_number].ToUser;
            var value = oEvent.getParameters().data[0].data.Nominee;
            var id = oEvent.getSource().sId;
            var indx = id.split("-");
            var oModel = new sap.ui.model.json.JSONModel();
            that= this;
            jQuery.ajax({
//                url:"https://ldciey8.wdf.sap.corp:44320/sap/opu/odata/sap/ZTESTRNRRESULT_SRV/DescriptionSet(CategoryId='CF',Uname='VEERAPPAN')",
                  /*url:"/sap/opu/odata/SAP/ZREWARDSANDRECOGNITION_SRV/categoriesSet",*/
                  //oEvent.getParameters().data[0].data._context_row_number
                  
                  url:"https://ldciey8.wdf.sap.corp:44320/sap/opu/odata/sap/ZTESTRNRRESULT_SRV/DescriptionSet(CategoryId='"+catid+"',Uname='"+uname+"')",
                  dataType:"json",
                  crossDomain:true,
                  success:function(oData){ 
                        oModel.setData(oData);
                        that.getView().byId("idDashboard--idtextarea-idDashboard--idCarousel-" + indx[6]).setHtmlText(oData.d["Descripiton"]);
                  }
            
            });
            
            //this.getView().byId("idDashboard--idtextarea-idDashboard--idCarousel-" + indx[6]).setHtmlText(value);
            //this.getView().byId("idDashboard--idtextarea").setText(value);
            
      },
     
      test1 : function(oEvent)
     {
           var arr = that._ofms;
            var catid = arr[oEvent.getParameters().data[0].data._context_row_number].CatId;
            var uname = arr[oEvent.getParameters().data[0].data._context_row_number].ToUser;
           var value = oEvent.getParameters().data[0].data.Nominee;
            var id = oEvent.getSource().sId;
            var indx = id.split("-");
            var oModel = new sap.ui.model.json.JSONModel();
            that= this;
            jQuery.ajax({
                  url:"https://ldciey8.wdf.sap.corp:44320/sap/opu/odata/sap/ZTESTRNRRESULT_SRV/DescriptionSet(CategoryId='"+catid+"',Uname='"+uname+"')",
                  /*url:"/sap/opu/odata/SAP/ZREWARDSANDRECOGNITION_SRV/categoriesSet",*/
                  dataType:"json",
                  crossDomain:true,
                  success:function(oData){ 
                        oModel.setData(oData);
                        that.getView().byId("idDashboard--idtextarea1-idDashboard--idCarousel-" + indx[6]).setHtmlText(oData.d["Descripiton"]);
                  }
            
            });
     },
     
      test2 : function(oEvent)
     {
//          
            var id = oEvent.getSource().sId;
            var indx = id.split("-");
            this.getView().byId("idDashboard--idtextarea-idDashboard--idCarousel-" + indx[6]).setHtmlText("");
            
      },
     test3 : function(oEvent)
     {
//          
            var id = oEvent.getSource().sId;
            var indx = id.split("-");
            this.getView().byId("idDashboard--idtextarea1-idDashboard--idCarousel-" + indx[6]).setHtmlText("");
            
      },
     
      test4 : function(oEvent)
     {
            var arr = that._oafs;
            var catid = arr[oEvent.getParameters().data[0].data._context_row_number].CatId;
            var uname = arr[oEvent.getParameters().data[0].data._context_row_number].ToUser;
           var value = oEvent.getParameters().data[0].data.Nominee;
            var id = oEvent.getSource().sId;
            var indx = id.split("-");
            var oModel = new sap.ui.model.json.JSONModel();
            that= this;
            jQuery.ajax({
                  url:"https://ldciey8.wdf.sap.corp:44320/sap/opu/odata/sap/ZTESTRNRRESULT_SRV/DescriptionSet(CategoryId='"+catid+"',Uname='"+uname+"')",
                  /*url:"/sap/opu/odata/SAP/ZREWARDSANDRECOGNITION_SRV/categoriesSet",*/
                  dataType:"json",
                  crossDomain:true,
                  success:function(oData){ 
                        oModel.setData(oData);
                        that.getView().byId("idDashboard--idtextarea2-idDashboard--idCarousel-" + indx[6]).setHtmlText(oData.d["Descripiton"]);
                  }
            
            });
            
      },
     test5 : function(oEvent)
     {
//          
            var id = oEvent.getSource().sId;
            var indx = id.split("-");
            this.getView().byId("idDashboard--idtextarea2-idDashboard--idCarousel-" + indx[6]).setHtmlText("");
            
      },
     
      test6 : function(oEvent)
     {
            var arr = that._ofms;
            var catid = arr[oEvent.getParameters().data[0].data._context_row_number].CatId;
            var uname = arr[oEvent.getParameters().data[0].data._context_row_number].ToUser;
           var value = oEvent.getParameters().data[0].data.Nominee;
            var id = oEvent.getSource().sId;
            var indx = id.split("-");
            var oModel = new sap.ui.model.json.JSONModel();
            that= this;
            jQuery.ajax({
                  url:"https://ldciey8.wdf.sap.corp:44320/sap/opu/odata/sap/ZTESTRNRRESULT_SRV/DescriptionSet(CategoryId='"+catid+"',Uname='"+uname+"')",
                  /*url:"/sap/opu/odata/SAP/ZREWARDSANDRECOGNITION_SRV/categoriesSet",*/
                  dataType:"json",
                  crossDomain:true,
                  success:function(oData){ 
                        oModel.setData(oData);
                        that.getView().byId("idDashboard--idtextarea3-idDashboard--idCarousel-" + indx[6]).setHtmlText(oData.d["Descripiton"]);
                  }
            
            });
            
      },
     
      test7 : function(oEvent)
     {
//          
            var id = oEvent.getSource().sId;
            var indx = id.split("-");
            this.getView().byId("idDashboard--idtextarea3-idDashboard--idCarousel-" + indx[6]).setHtmlText("");
            
      },
      
      onAfterRendering: function() {
            
            that = this;
            jQuery(".sapUiUx3ShellHeader-logout").removeClass("hide");
            jQuery(".sapUiUx3ShellContent").removeClass("welcomeBackground");
            jQuery(".sapUiUx3ShellHeaderTitleLeft > span").removeClass("hide");
//          sap.ui.getCore().byId("idCategories--loggedUser").setSrc(that._oUser.d.ProfilePic);
//          sap.ui.getCore().byId("idCategories--userName").setText(that._oUser.d.Name);
            /*sap.ui.getCore().byId("idCategories--loggedUser").setSrc("images/profilePic/Raghuraj.jpg");*/
            that._oDialog.open();
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
                        that._oDialog.close();
                  },
                  error:function(err){
                        console.log(err);
                  }})
                  
                  
                  
//          
                  
            
      },

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf rewardsandrecognition.dashboardPage
*/
//    onExit: function() {
//
//    }
      back: function(){
            var welcomeView = sap.ui.getCore().byId("idwelcomePage");
            var oShell = sap.ui.getCore().byId("shellContainer");
            oShell.removeAllContent();
            oShell.addContent(welcomeView);    
       },
      

      
       carouselchange: function(oControlEvent)
      {
            var id= oControlEvent.getParameter('newActivePageId');
            this._oresult= id.split("-");
            this._olen = this._oresult.length;
            that = this;
            
             oVizFrame = this.getView().byId("idcolumn");
            oVizFrame1 = this.getView().byId("idcolumn2");
           oVizFrame2 = this.getView().byId("idcolumn3");
            oVizFrame3 = this.getView().byId("idcolumn4");
            that._oDialog.open();
             jQuery.ajax({
                  
                              //url:"https://ldciey8.wdf.sap.corp:44320/sap/opu/odata/sap/ZTESTRNRRESULT_SRV/categoriesSet('IN')/CatetoNomCnt",
                 url:"https://ldciey8.wdf.sap.corp:44320/sap/opu/odata/sap/ZTESTRNRRESULT_SRV/categoriesSet("+"'"+that._ocategories.d.results[that._oresult[that._olen-1]].CategoryId+"')/CatetoNomCnt",
                        /*url:"/sap/opu/odata/SAP/ZREWARDSANDRECOGNITION_SRV/categoriesSet",*/
                        dataType:"json",
                        crossDomain:true,
                        success:function(oData){
                              
                              
                              
                              var i =0;
                              var afs = new Array();
                              var fms = new Array();
                              var afstop = new Array();
                              var fmstop = new Array();
                              
                              for (i=0; i < oData.d.results.length; i++)
                                    {
                                    if (oData.d.results[i].SubTeam=="AFS")
                                          {
                                             afs.push(oData.d.results[i]);
                                          }
                                    else 
                                          {
                                          fms.push(oData.d.results[i]); 
                                          }
                                    }
                              
                              
                              if(afs.length > 3)
                                    {
                                    for (i=0;i<3;i++)
                                          {
                                              afstop.push(afs[i]);
                                          }
                                    }
                              
                              if(fms.length > 3)
                              {
                              for (i=0;i<3;i++)
                                    {
                                        fmstop.push(fms[i]);
                                    }
                              }
                              
                              if(afstop.length > 0){
                                oVizFrame.getModel().setData(afstop); 
                              }
                              else
                                    {
                                    oVizFrame.getModel().setData(afs); 
                                    }
                              
                              
                              if(fmstop.length > 0){
                                      oVizFrame1.getModel().setData(fmstop); 
                                    }
                                    else
                                          {
                                          oVizFrame1.getModel().setData(fms); 
                                          }
                                //oVizFrame1.getModel().setData(fmstop);   
                                oVizFrame2.getModel().setData(afs);    
                                oVizFrame3.getModel().setData(fms);    
                        
                        that._oafs = afs;
                        that._ofms = fms;
                        
                        /*that._oDialog.close();*/
                        }
                        
                        });
            
             
//          
//          //--------------------------------------------------------------------pie setter-----------------------------------------
//          
//         jQuery.ajax({
//                
//                //url:"https://ldciey8.wdf.sap.corp:44320/sap/opu/odata/sap/ZTESTRNRRESULT_SRV/categoriesSet('IN')/CatetoNomCnt",
//          url:"https://ldciey8.wdf.sap.corp:44320/sap/opu/odata/sap/ZTESTRNRRESULT_SRV/categoriesSet("+"'"+that._ocategories.d.results[that._oresult[that._olen-1]].CategoryId+"')/CatetoNomCnt",
//          /*url:"/sap/opu/odata/SAP/ZREWARDSANDRECOGNITION_SRV/categoriesSet",*/
//          dataType:"json",
//          crossDomain:true,
//          success:function(oData){
//                
//                
//                
//                var i =0;
//                var afs = new Array();
//                var fms = new Array();
//                
//                for (i=0; i < oData.d.results.length; i++)
//                      {
//                      if (oData.d.results[i].SubTeam=="AFS")
//                            {
//                               afs.push(oData.d.results[i]);
//                            }
//                      else 
//                            {
//                            fms.push(oData.d.results[i]); 
//                            }
//                      }
//                
//                var model = new sap.ui.model.json.JSONModel();
//                
//                
//                model.setData(afs);
//                
//                that.getView().byId("idVizFrame").removeAllFeeds();
//                  var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
//                  'uid': "valueAxis",
//                  'type': "Measure",
//                  'values': ["Votes"]
//                }); 
//                feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
//                  'uid': "categoryAxis",
//                  'type': "Dimension",
//                  'values': ["Nominee"]
//                });
//              
//              oVizFrame2.addFeed(feedValueAxis);
//            oVizFrame2.addFeed(feedCategoryAxis);
//          that.getView().byId("idVizFrame").setModel(model);
//          
//          
//        var model1 = new sap.ui.model.json.JSONModel();
//        
//           
//          model1.setData(fms);
//          
//          that.getView().byId("idVizFrame1").removeAllFeeds();
//            var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
//                  'uid': "valueAxis",
//                  'type': "Measure",
//                  'values': ["Votes"]
//                }); 
//                feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
//                  'uid': "categoryAxis",
//                  'type': "Dimension",
//                  'values': ["Nominee"]
//                });
//              
//              oVizFrame3.addFeed(feedValueAxis);
//            oVizFrame3.addFeed(feedCategoryAxis);
//          that.getView().byId("idVizFrame1").setModel(model1);
//          
//          
//          }
//          
//          });
////        
////        
//          
//          
                  
                        
            
            // console.log(that._ocategories.d.results[result[len-1]].CategoryId);
      
      },
      
      dialogEnd:function(oEvent){
    	  that._oDialog.close();
      }
//
//    
});

