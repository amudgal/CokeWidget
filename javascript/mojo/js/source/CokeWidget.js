(function () {
    // Define this code as a plugin in the mstrmojo object
    if (!mstrmojo.plugins.CokeWidget) {
        mstrmojo.plugins.CokeWidget = {};
    }
    // All mojo visualizations require the CustomVisBase library to render
    mstrmojo.requiresCls("mstrmojo.CustomVisBase");
    /**
     * A visualization that integrates Microstrategy data with Custom code
     * @extends mstrmojo.CustomVisBase
     */
    // Declare the visualization object
    mstrmojo.plugins.CokeWidget.CokeWidget = mstrmojo.declare(
        // Declare that this code extends CustomVisBase
        mstrmojo.CustomVisBase,
        null,
        {
            // Define the JavaScript class that renders your visualization as mstrmojo.plugins.{plugin name}.{js file name}
            scriptClass: 'mstrmojo.plugins.CokeWidget.CokeWidget',
	    // Define the CSS class that will be appended to container div
            cssClass: [
                {url: "../plugins/CokeWidget/style/PopUpWidget.css"},
                {url: "../plugins/CokeWidget/javascript/vendor/bootstrap/css/bootstrap.min.css"},
                {url: "../plugins/CokeWidget/javascript/vendor/animatedModal/demo/css/animate.min.css"},
                {url: "../plugins/CokeWidget/javascript/vendor/animatedModal/demo/css/normalize.min.css"},
                {url: "../plugins/CokeWidget/javascript/vendor/bootstrap/css/bootstrap-theme.min.css"}
            ],
	    // Define the error message to be displayed if JavaScript errors prevent data from being displayed
            errorDetails: "This visualization requires one attributes.",
	    // Define the external libraries to be used - in this sample. the Google Charts library
            externalLibraries: [
                {url: "../plugins/CokeWidget/javascript/vendor/jquery/jquery-3.2.1.min.js"},
                {url: "../plugins/CokeWidget/javascript/vendor/bootstrap/js/bootstrap.min.js"},
                {url: "../plugins/CokeWidget/javascript/vendor/typeahead/bloodhound.min.js"},
                {url: "../plugins/CokeWidget/javascript/vendor/typeahead/typeahead.bundle.min.js"},
                {url: "../plugins/CokeWidget/javascript/vendor/typeahead/typeahead.jquery.min.js"},
                {url: "../plugins/CokeWidget/javascript/Visualization/renderViz.js"}//,
                //{url: "../plugins/CokeWidget/javascript/Visualization/PopUpWidgetController.js"}
                
            ],
            // Define whether a tooltip should be displayed with additional information
            useRichTooltip: true,
            // Define whether the DOM should be reused on data/layout change or reconstructed from scratch
            reuseDOMNode: false,
            plot: function () {
                var domNode = this.domNode, width = this.width, height = this.height, dp = this.dataInterface;
                function prepareData() {
                    var data = {};
                    // Set cols //attributes column header/type
                    data.cols = [];
                    //data.cols[0] = {"id": "ATT_NAME_JS", "label": "Attribute", "type": "string"};
                    // Set metrics columns header/type
                    var i;
                    //get all Attribute names 
                    for (i = 0; i < dp.getRowTitles().size(); i++) {
                        var AttribName = dp.getRowTitles(0).getTitle(i).getName();
                        //console.log(AttribName);
                        data.cols[i]=AttribName;
                    }
                    
                    /*for (i = 0; i < dp.getColumnHeaderCount(); i++) {
                        var metricName = dp.getColHeaders(0).getHeader(i).getName();
                        data.cols[1 + i] = {"id": metricName, "label": metricName, "type": "number"};
                    }*/
                    // Set rows data
                    data.rows = [];
                    // Iterate thru all rows
                    for (i = 0; i < dp.getTotalRows(); i++) {
                    	
                        data.rows[i] = {};
                        var c = [], attributesValue = "";
                        // Set attribute values to single string for row
                        var a;
                        for (a = 0; a < dp.getRowHeaders(i).size(); a++) {
                            attributesValue += dp.getRowHeaders(i).getHeader(a).getName() + "|";
                        }
                        //console.log(attributesValue);    
                        c[0] = {"v": attributesValue};
                        // Set metrics values in row
                        var z;
                        /*for (z = 0; z < dp.getColumnHeaderCount(); z++) {
                            c[1 + z] = {"v": dp.getMetricValue(i, z).getRawValue()};
                        }*/
                        data.rows[i].c = c;
                    }
                    //console.log(data);
                    return data;
                }
                //console.log('Applying to Domnode');
                $(domNode).append('<div class="DashboardBar" ><a href="../plugins/CokeWidget/html/popupWidget.html" data-toggle="modal" data-target="#myModal" ><img id="imgS" src="../plugins/CokeWidget/style/images/badges/CCNA.png"><p id="paths" ></p></img></a><div id="myModal" class="modal fade" ><div class="modal-dialog" style="width:80%"><div class="modal-content" ></div></div></div></div>');                
                //$(domNode).append('<ul><li><a id="demo01" href="#animatedModal">DEMO01</a></li></ul> <div id="animatedModal"><div  id="btn-close-modal" class="close-animatedModal">CLOSE MODAL</div><div class="modal-content"></div></div><script>$("#demo01").animatedModal();</script>');
                ApplyBaseImage(prepareData());
                /*function renderGraph() {
                    var data = new google.visualization.DataTable(prepareData());
                    var options = {'title': 'Google chart', 'width': width, 'height': height};
                    var chart = new google.visualization.LineChart(domNode);
                    chart.draw(data, options);
                }

                google.load("visualization", "1", {"callback": function () {
                    renderGraph();
                }, "packages": ["corechart"]});*/
            }
        }
    );
}());