// select svg
const svg = d3
  .select('.canvas')
  .append('svg')
  .attr('width', 600)
  .attr('height', 600)

// create margins and dimensions
const margin = {
  top: 20,
  right: 20,
  bottom: 100,
  left: 100,
}
const graphWidth = 600 - margin.left - margin.right
const graphHeight = 600 - margin.top - margin.bottom

// select graph
const graph = svg
  .append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

const xAxisGroup = graph
  .append('g')
  .attr('transform', `translate(0, ${graphHeight})`)
const yAxisGroup = graph.append('g')

db.collection('dishes')
  .get()
  .then((res) => {
    let data = res.docs.map((doc) => doc.data())
    console.log(data)
    // create Accessors
    const yAccessor = (d) => d.orders
    const xAccessor = (d) => d.name

    // create scales
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, yAccessor)])
      .range([graphHeight, 0])

    const xScale = d3
      .scaleBand()
      .padding(0.2)
      .domain(data.map(xAccessor))
      .range([0, graphWidth])
    // join data to rects
    const rects = graph.selectAll('rect').data(data)

    // append enter selection to DOM
    rects
      .enter()
      .append('rect')
      .attr('width', xScale.bandwidth)
      .attr('height', (d) => graphHeight - yScale(yAccessor(d)))
      .attr('fill', 'goldenrod')
      .attr('x', (d) => xScale(xAccessor(d)))
      .attr('y', (d) => yScale(yAccessor(d)))

    // create and call axes
    const xAxis = d3.axisBottom().scale(xScale)
    const yAxis = d3
      .axisLeft()
      .scale(yScale)
      .ticks(5)
      .tickFormat((d) => `${d} orders`)

    // takes groups and runs axes function onto it which generates svg
    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    xAxisGroup
      .selectAll('text')
      .attr('transform', 'rotate(-40)')
      .attr('text-anchor', 'end')
      .attr('fill', 'goldenrod')
      .attr('font-size', '14px')
  })
