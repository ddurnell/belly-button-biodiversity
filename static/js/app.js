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
function buildBarChart(tops) {
  // console.log(tops.name);
  // console.log(tops.sampleValues);
  // console.log(tops.otuIds);
  // console.log(tops.otuLabels);
  // get the other stuff to the graph
  var name = tops.name;
  var sValues = tops.sampleValues;
  var oIds = tops.otuIds;
  var oLabels = tops.otuLabels;

  var data = [{
    type: 'bar',
    x: sValues,
    y: oIds,
    text: oLabels,
    orientation: 'h'
  }];

  // Title and reverse the chart
  var layout = {
    title: `Top 10 Belly Button Bacteria for ${name}`,
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
};

// copied and modified from stackOverflow
// some kind of bitmapping
function toColor(num) {
  num = -num + 2000;
  num >>>= 0;
  var b = num & 0xFF,
      g = (num & 0xFF00) >>> 8,
      r = (num & 0xFF0000) >>> 16;
  return "rgb(" + [r, g, b].join(",") + ")";
};

// Initializes the page with a bubble plot
function buildBubbleChart(samples) {
  // get the other stuff to the graph
  // console.log(tops);
  var name = samples.id;
  var sValues = samples.sample_values;
  var oIds = samples.otu_ids;
  var oLabels = samples.otu_labels;

  // * Use `otu_ids` for the x values.
  // * Use `sample_values` for the y values.
  // * Use `sample_values` for the marker size.
  // * Use `otu_ids` for the marker colors.
  // * Use `otu_labels` for the text values.

  // convert oIds to colors
  colors = [];
  for (var i=0; i<oIds.length; i++){
    colors.push(toColor(oIds[i]));
  }

  var data = [{
    x: oIds,
    y: sValues,
    text: oLabels,
    mode: 'markers',
    marker: {
      color: colors,
      size: sValues
    }
  }];

  // Title and reverse the chart
  var layout = {
    title: `Belly Button Bacteria for ${name}`,
    showlegend: false,
    height: 400,
    width: 1000,
    xaxis: { title: "OTU ID" },
    yaxis: { title: "Bacteria Count" }

    // margin: {
    //   l: 100,
    //   r: 100,
    //   t: 100,
    //   b: 100
    // }
  };

  // Render the plot to the div tag with id "bar"
  // Plotly.newPlot("bar", data, layout);
  Plotly.newPlot("bubble", data, layout);
}

function buildPanel(meta){
  // 

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

  // initialize the charts
  buildBarChart(topTen[0]);
  // console.log(samples[0]);
  buildBubbleChart(samples[0]);
  buildPanel(metadata[0]);


  // Make a listener for the name dropdown
  d3.selectAll("#selDataset").on("change", refreshCharts);

  // This function is called when a dropdown menu item is selected
  function refreshCharts() {
    newName = d3.select("#selDataset").node().value;
    // console.log(newName);
    // There must be a better way
    // Find the index of the new value
    var index = 0;
    for (var i=0; i<topTen.length; i++){
      // console.log(topTen[i].name);
      if (parseInt(topTen[i].name) === parseInt(newName)){
        index = i;
        break;
      }
    };
    console.log(index);

    // Note the extra brackets around 'x' and 'y'
    // Plotly.restyle("bar", "x", [topTen[index].sampleValues]);
    // Plotly.restyle("bar", "y", [topTen[index].otuIds]);
    buildBarChart(topTen[index]);
    buildBubbleChart(samples[index]);
    buildPanel(metadata[index]);
  }

});
