fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((res) => res.json())
  .then((data) => func(data));

const func = (dataset) => {
  // Constants
  const height = 400;
  const width = 800;
  const padding = 40;

  const minYear = new Date(d3.min(dataset, (d) => d.Year).toString());
  const maxYear = new Date(d3.max(dataset, (d) => d.Year).toString());

  const date = new Date(0);
  const offset = date.getTimezoneOffset() * 60000;
  const minS = d3.min(dataset, (d) => d.Seconds);
  const maxS = d3.max(dataset, (d) => d.Seconds);

  const minSeconds = new Date(minS * 1000 + offset);
  const maxSeconds = new Date(maxS * 1000 + offset);

  // Scales
  const xScale = d3
    .scaleTime()
    .range([padding, width - padding])
    .domain([minYear, maxYear]);

  const yScale = d3
    .scaleTime()
    .range([padding, height - padding])
    .domain([minSeconds, maxSeconds]);

  // Big Daddy SVG Declaration
  const svg = d3
    .select("#container")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .style("border", "1px solid black");

  // Axex
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
  const xAxis = d3.axisBottom(xScale);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0,360)")
    .call(xAxis);
  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(40,0)")
    .call(yAxis);

  // Scatterplot circles/dots
  svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => new Date(d.Seconds * 1000 + offset))
    .attr("r", 8)
    .attr("cx", (d) => xScale(new Date(d.Year.toString())))
    .attr("cy", (d) => yScale(new Date(d.Seconds * 1000 + offset)))
    .attr("fill", (d) => {
      if (d.Doping == "") {
        return "#00b894";
      } else {
        return "#d63031";
      }
    })
    .on("mouseover", (e, d) => {
      let str = `Name: ${d.Name}\nNationality: ${d.Nationality}\nIncident: ${d.Doping}\nYear: ${d.Year}\nTime: ${d.Time}\nPlace: ${d.Place}\nMore Info: ${d.URL}`;
      let datayear = d.Year;

      d3.select("#tooltip")
        .attr("data-year", datayear)
        .text(str)
        .style("left", e.pageX + 10 + "px")
        .style("top", e.pageY + 10 + "px")
        .style("opacity", 1);
    })
    .on("mouseout", (e, d) => {
      console.log(e);
      d3.select("#tooltip").style("opacity", 0);
    });

  // Legend Data
  const legend_data = [
    {
      text: "No Doping",
      color: "#00b894",
      box_x: 750,
      box_y: 150,
      text_y: 160,
      text_x: 680,
    },
    {
      text: "Doping Incidents Reported",
      color: "#d63031",
      box_x: 750,
      box_y: 175,
      text_y: 185,
      text_x: 590,
    },
  ];

  // Legend
  const legend = svg.append("g").attr("id", "legend");

  legend
    .selectAll("text")
    .data(legend_data)
    .enter()
    .append("text")
    .attr("class", "legendText")
    .attr("x", (d) => d.text_x)
    .attr("y", (d) => d.text_y)
    .text((d) => d.text);

  legend
    .selectAll("rect")
    .data(legend_data)
    .enter()
    .append("rect")
    .attr("x", (d) => d.box_x)
    .attr("y", (d) => d.box_y)
    .attr("height", 10)
    .attr("width", 10)
    .attr("fill", (d) => d.color);

  console.log(dataset);
  // console.log(xScale.domain(), xScale.range());
  // console.log(yScale.domain(), yScale.range());
  // END
};
