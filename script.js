// Змінна, що зберігає зображення для відображення у тегу <svg>.
var svg = d3.select("#bar-chart"),
    margin = { top: 20, right: 20, bottom: 30, left: 40 },
    x = d3.scaleBand().padding(0.1),
    y = d3.scaleLinear(),
    theData = undefined;

// Налаштовуємо класи та параметри системи координат.
var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

g.append("g")
    .attr("class", "axis axis--x");

g.append("g")
    .attr("class", "axis axis--y");

g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.7em")
    .attr("text-anchor", "end")
    .text("Відсоток опитаних");


// Функція для відображення діаграми.
function draw() {
    // Розміри діаграми
    var bounds = svg.node().getBoundingClientRect(),
        width = bounds.width - margin.left - margin.right,
        height = bounds.height - margin.top - margin.bottom;

    x.rangeRound([15, width]);
    y.rangeRound([height, 0]);

    // Передаємо параметри вісей координат, відовідно до введених даних.
    g.select(".axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.select(".axis--y")
        .call(d3.axisLeft(y).ticks(10, "%"));

    // Вибираємо джерело даних для стовпчиків.
    var bars = g.selectAll(".bar")
        .data(theData);

    // Перше відображення графіку.
    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return x(d.language); })
        .attr("y", height)
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .transition()
        .duration(1000)
        .attr("y", function (d) { return y(d.percent); })
        .attr("height", function (d) { return height - y(d.percent); });

    // Перемальовуємо графік при зміні розміру вікна.
    bars.transition()
        .attr("x", function (d) { return x(d.language); })
        .attr("y", function (d) { return y(d.percent); })
        .attr("width", x.bandwidth())
        .attr("height", function (d) { return height - y(d.percent); });


    bars.exit()
        .remove();

}



function loadData(tsvData) {
    tsvData.forEach(function(d) {
        d.percent = +d.percent;
    });

    theData = tsvData;

    x.domain(theData.map(function (d) { return d.language; }));
    y.domain([0, d3.max(theData, function (d) { return d.percent; })]);

    draw();
}

tsvData = [
    {language: "JavaScript", percent: 0.18800},
    {language: "C#", percent: 0.14700},
    {language: "Java", percent: 0.14300},
    {language: "Python", percent: 0.11200},
    {language: "PHP", percent: 0.10600},
    {language: "TypeScript", percent: 0.10400},
    {language: "Kotlin", percent: 0.03400},
    {language: "Swift", percent: 0.03400},
    {language: "C++", percent: 0.03300},
    {language: "Go", percent: 0.02200},
    {language: "Ruby", percent: 0.02100},
    {language: "Dart", percent: 0.01000},
    {language: "C", percent: 0.01000},
    {language: "Scala", percent: 0.00900},
    {language: "1С", percent: 0.00700},
    {language: "Apex", percent: 0.00600},
    {language: "Groovy", percent: 0.00300},
    {language: "Objective-C", percent: 0.00200},
    {language: "Rust", percent: 0.00200},
    {language: "Clojure", percent: 0.00100},
];


window.addEventListener("resize", draw);
loadData(tsvData);