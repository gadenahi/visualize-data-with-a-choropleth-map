const w = 1000;
const h = 600;
const padding = 100;
const scale = 10;
const EDUCATION_FILE_PATH = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json"
const COUNTY_FILE_PATH = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json"
const colors = ["#66FF00","#34D505","#02B01D","#028439"]

d3.queue()
  .defer(d3.json, COUNTY_FILE_PATH)
  .defer(d3.json, EDUCATION_FILE_PATH)
  .await(usmap);

function usmap(error, c_original, e_original) {
  
  var usa = topojson.feature(c_original, c_original.objects.counties).features;  
  var h_percentage = d3.max(e_original, (d) => d.bachelorsOrHigher)
  var l_percentage = d3.min(e_original, (d) => d.bachelorsOrHigher)   
  const legendVals = (1/4*75.1);  
  
  var path = d3.geoPath()
  
  var svg = d3.select("body")
              .append("svg")
              .attr("width", w)
              .attr("height", h)
              .attr("class", "graph")
  
  svg.append("g")
     .selectAll("path")
     .data(usa)
     .enter()
     .append("path")
     .attr("d", path)
     .attr("class", "county")
     .style("stroke", "gray")
     .style("stroke-width", 0.25)
     .attr("data-fips", (d, i) => {var result = e_original.filter((obj) => {return obj.fips == d.id;});
                                   if(result[0]){
                                     return result[0].fips
                                   }})
     .attr("data-education", (d, i) => {var result = e_original.filter((obj) => {return obj.fips == d.id;});
                                        if(result[0]){
                                          return result[0].bachelorsOrHigher
                                        }})
     .style("fill", (d, i) => {var result = e_original.filter((obj) => {return obj.fips == d.id;});
                               if(result[0]){
                                 return colors[Math.floor(result[0].bachelorsOrHigher/h_percentage * colors.length)]
                               }})  
     .on("mouseover", function(d, i) {
      d3.select(".js_toolTip")
        .html(() => {var result = e_original.filter((obj) => {return obj.fips == d.id;});
                         if(result[0]){
                           return result[0].area_name +", "+ result[0].state + ": " + result[0].bachelorsOrHigher + "%"
                         }})
        .style("top", (d3.event.pageY + 10) + "px")
        .style("left", (d3.event.pageX + 10) + "px")    
        .style("display", "inline-block")
        .attr("id", "tooltip")
        .attr("data-education", () => {var result = e_original.filter((obj) => {return obj.fips == d.id;});
                                            if(result[0]){
                                              return result[0].bachelorsOrHigher
                                            }})
  })
     .on("mouseout", function(d, i) {
      d3.select(".js_toolTip")
        .style("display", "none")    
  })  
  
  const legend = svg.selectAll(".legends")
                    .data(colors)
                    .enter()
                    .append('g')
                    .attr("id", "legend")
  
  legend.append('rect')
        .attr("x", (d, i) => w - padding - 35*colors.length + (i *35))
	      .attr("y", 10)
	      .attr("width", 30)
	      .attr("height", 10)
	      .attr("fill", (d, i) => colors[i])  
  
  legend.append('text') 
	      .attr("x", (d, i) => w - padding - 37*colors.length + (i *35))
	      .attr("y", 30)
        .text(function (d, i) {return (legendVals * (i)).toFixed(0) + "%"})
	      .style("font-size", 10)    
}
