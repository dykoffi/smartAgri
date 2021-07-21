import * as d3 from "d3"

export function Data(data) {

    const x = d3.scaleTime().range([0, 1150]);
    const y = d3.scaleLinear().range([550, 0]);

    const xAxis = d3.axisBottom(x).ticks(20);
    const yAxis = d3.axisLeft(y).ticks(20);

    var parseTime = d3.timeParse("%Y-%m-%d");

    x.domain(d3.extent(data, function (d) { return parseTime(d.createdAt) }));
    y.domain([0, 300]);

    const line = d3.line()
        .x(d => x(new Date(d.createdAt)))
        .y(d => y(d.data));

    let svg = d3.select("#history")
    svg
        .select('#g')

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(30,570)`)
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", `translate(30,20)`)
        .call(yAxis);

    svg.append("path")
        .attr("class", "line")
        .attr("transform", `translate(30,20)`)
        .attr("d", line(data));

}