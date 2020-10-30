// select svg container
const svg = d3.select('svg')

const data = d3.json('./planets.json').then((data) => {
  const circs = svg.selectAll('circle').data(data)

  // add attrs to circs already in DOM
  circs
    .attr('cy', 200)
    .attr('cx', (d) => d.distance)
    .attr('r', (d) => d.radius)
    .attr('fill', (d) => d.fill)

  circs
    .enter()
    .append('circle')
    .attr('cy', 200)
    .attr('cx', (d) => d.distance)
    .attr('r', (d) => d.radius)
    .attr('fill', (d) => d.fill)
})
