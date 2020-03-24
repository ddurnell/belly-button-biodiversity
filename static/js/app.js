function sliceArray(ar, num) {
  return ar.slice(0, num);
};

function sliceSample(sample, num) {
  // get the arrays
  // console.log(sample);

  // get the name
  var key = sample.id;
  // console.log(key);

  // get the arrays
  var otuIds = sliceArray(sample.otu_ids, num);
  // console.log(otuIds);
  // turn the ids into text
  otuIdsStr = [];
  for (var i = 0; i < otuIds.length; i++) {
    otuIdsStr.push(`OTU ${otuIds[i].toString()}`);
  };




  var sampleValues = sliceArray(sample.sample_values, num);
  // console.log(sampleValues);

  var otuLabels = sliceArray(sample.otu_labels, num);
  // console.log(otuLabels);

  filteredObject = {
    "name": key,
    "otuIds": otuIdsStr,
    "sampleValues": sampleValues,
    "otuLabels": otuLabels
  };
  return filteredObject;
};

// Initializes the page with a horizontal plot
function buildChart(tops) {
  console.log(tops.name);
  console.log(tops.sampleValues);
  console.log(tops.otuIds);
  console.log(tops.otuLabels);
  // get the other stuff to the graph
  var name = tops.name;
  var sValues = tops.sampleValues;
  var oIds = tops.otuIds;
  var oLabels = tops.otuLabels;

  var data = data = [{
    type: 'bar',
    x: sValues,
    y: oIds,
    text: oLabels,
    orientation: 'h'
  }];

  // Title and reverse the chart
  var layout = {
    title: `Belly Button Bacteria for ${name}`,
    xaxis: { title: "Bacteria Count" },
    yaxis: { autorange: "reversed" }

    // margin: {
    //   l: 100,
    //   r: 100,
    //   t: 100,
    //   b: 100
    // }
  };

  // Render the plot to the div tag with id "bar"
  // Plotly.newPlot("bar", data, layout);
  Plotly.newPlot("bar", data, layout);
}

//read in samples.json
d3.json("static/data/samples.json").then(function (data) {

  var names = data.names;
  var metadata = data.metadata;
  var samples = data.samples;
  // console.log(names);
  // console.log(metadata);
  // console.log(samples);

  // For each id in samples, sort and keep the top ten
  // get the ids
  var ids = names.map(id => id);
  var sampleValues = samples.map(s => s);
  // console.log(sampleValues);
  var unfilteredSamples = [];
  var topTen = [];
  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];
    // console.log(`key = : ${id}`);
    var sample = sampleValues[i];

    // console.log(sample);
    // unfilteredSamples.push(sample);
    // filter the samples for each id
    var filteredSample = sliceSample(sample, 10);
    topTen.push(filteredSample);

  };

  console.log();

  // Populate the dropdown with the name keys
  var select = document.getElementById("selDataset");
  var names = topTen.map(n => n.name);

  //console.log(names);
  for (var j = 0; j < names.length; j++) {
    var name = names[j];
    var el = document.createElement("option");
    el.textContent = name;
    el.value = name;
    select.appendChild(el);
  };

  // initialize the bar chart
  // console.log(topTen[0]);
  buildChart(topTen[0]);

  // Make a listener for the name dropdown
  d3.selectAll("#selDataset").on("change", refreshBar);

  // This function is called when a dropdown menu item is selected
  function refreshBar() {
    newName = d3.select("#selDataset").node().value;
    // console.log(newName);
    // There must be a better way
    // Find the index of the new value
    var index = 0;
    for (var i=0; i<topTen.length; i++){
      console.log(topTen[i].name);
      if (parseInt(topTen[i].name) === parseInt(newName)){
        index = i;
        break;
      }
    };
    console.log(index);
    buildChart(topTen[index]);


    //buildChart(parseInt(newName));
    // newName = d3.select("#selDataset").node().value; 
    // // get the index corresponding to the new value
    // console.log(topTen);
    // var index = topTen.name.findIndex(newName);
    // console.log(`newName index: ${index}`);

    //buildChart(topTen[1]);
    // // Use D3 to select the dropdown menu
    // var dropdownMenu = d3.select("#selDataset");
    // // Assign the value of the dropdown menu option to a variable
    // var dataset = dropdownMenu.property("value");

    // // Initialize x and y arrays
    // var x = [];
    // var y = [];

    // if (dataset === 'dataset1') {
    //   x = [1, 2, 3, 4, 5];
    //   y = [1, 2, 4, 8, 16];
    // }

    // if (dataset === 'dataset2') {
    //   x = [10, 20, 30, 40, 50];
    //   y = [1, 10, 100, 1000, 10000];
    // }

    // // Note the extra brackets around 'x' and 'y'
    // Plotly.restyle("plot", "x", [x]);
    // Plotly.restyle("plot", "y", [y]);
  }

});
