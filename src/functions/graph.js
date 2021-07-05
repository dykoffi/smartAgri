import io from "socket.io-client"
import * as d3 from "d3"

let scale = d3.scaleLinear().range([0, 280]).domain([100, 0])
let scaleY = d3.scaleLinear().range([0, 280]).domain([0, 100])
let scaleX = d3.scaleLinear().range([0, 270]).domain([0, 100])
let scaleTemp = d3.scaleLinear().range([0, 270]).domain([0, 80])
let opacityScale = d3.scaleLinear().range([0, 1]).domain([0, 550])
let scalelight= d3.scaleLinear().range([0, 100]).domain([0, 550])

let color = d3.scaleLinear()
    .domain([0, 100])
    .range(["red", "green"])

let colorTemp = d3.scaleSequential(d3.interpolatePlasma)
    .domain([0, 80])

let colorE = d3.scaleLinear()
    .domain([0, 100])
    .range(["blue", "white"])

let axisR = d3.axisRight(scale)
    .tickSizeOuter(5)
    .tickSizeInner(2)
    .tickPadding(10)

let axisB = d3.axisBottom(scaleX)
    .tickSizeOuter(5)
    .tickSizeInner(2)
    .tickPadding(10)

let axisTemp = d3.axisBottom(scaleTemp)
    .tickSizeOuter(5)
    .tickSizeInner(2)
    .tickPadding(10)

export function niveau(data) {
    let svg = d3.select("#niveau")
    let all = d3.range(100)

    svg
        .select('#g')
        .attr("transform", "translate(270,50)")
        .call(axisR)

    svg
        .select('#text')
        .transition()
        .text(data)

    svg
        .select("#gbar")
        .selectAll("rect")
        .data(all)
        .join("rect")
        .attr("x", "0")
        .attr("height", "3.5")
        .attr("width", "40")
        .attr("y", d => scaleY(d))
        .attr("fill", d => colorE(d))
        .transition()
        .attr("opacity", d => d < data ? "1" : 0.1)
}

export function humiditeSol(data) {
    let svg = d3.select("#humiditeSol")

    svg
        .select('#g')
        .attr("transform", "translate(270,50)")
        .call(axisR)

    svg
        .select('#text')
        .transition()
        .text(data)

    svg
        .select("#bar")
        .transition()
        .attr('height', scaleY(data))
        .attr("fill", color(data))


}

export function humiditeAir(data) {
    let svg = d3.select("#humiditeAir")

    svg
        .select('#g')
        .attr("transform", "translate(10,320)")
        .call(axisB)

    svg
        .select('#text')
        .transition()
        .text(data)

    svg
        .select("#bar")
        .transition()
        .attr('width', scaleX(data))
        .attr("fill", color(data))


}

export function temperature(data) {
    let svg = d3.select("#temperature")
    let all = d3.range(80)

    svg
        .select('#g')
        .attr("transform", "translate(10,320)")
        .call(axisTemp)

    svg
        .select('#text')
        .transition()
        .text(data)

    svg
        .select("#gbar")
        .selectAll("rect")
        .data(all)
        .join("rect")
        .attr("y", "0")
        .attr("height", "40")
        .attr("width", "3.5")
        .attr("x", d => scaleTemp(d))
        .attr("fill", d => colorTemp(d))
        .transition()
        .attr("opacity", d => d < data ? "1" : 0.1)
}

export function luminosite(data) {
    let svg = d3.select("#luminosite")
    svg
        .select('#text')
        .transition()
        .text(parseInt(scalelight(data)))

    svg
        .select("#soleil")
        .transition()
        .attr("opacity", opacityScale(data))
        .attr("fill", colorTemp(70))
}



export const socket = io("http://192.168.43.152:8088")