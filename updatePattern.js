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

// create accessor functions
const yAccessor = (d) => d.orders
const xAccessor = (d) => d.name

// create scales
const yScale = d3.scaleLinear().range([graphHeight, 0])

const xScale = d3.scaleBand().padding(0.2).range([0, graphWidth])

// create the axes
const xAxis = d3.axisBottom().scale(xScale)
const yAxis = d3
  .axisLeft()
  .scale(yScale)
  .ticks(5)
  .tickFormat((d) => `${d} orders`)

const transitionStyle = d3.transition().duration(1000)

// update function
const update = (data) => {
  // 1. update scales (domains) if they rely on our data
  yScale.domain([0, d3.max(data, yAccessor)])
  xScale.domain(data.map(xAccessor))

  // 2. join updated data to rect elements
  const rects = graph.selectAll('rect').data(data)

  // 3. remove unwanted shapes using exit selection
  rects.exit().remove()

  // 4. update current shapes in DOM
  rects
    .attr('width', xScale.bandwidth)
    .attr('fill', 'goldenrod')
    .attr('x', (d) => xScale(xAccessor(d)))

  // 5. append the enter selection to the DOM
  rects
    .enter()
    .append('rect')
    .attr('height', 0)
    .attr('fill', 'goldenrod')
    .attr('x', (d) => xScale(xAccessor(d)))
    .attr('y', graphHeight)
    .merge(rects)
    .transition(transitionStyle)
    .attrTween('width', widthTween)
    .attr('height', (d) => graphHeight - yScale(yAccessor(d)))
    .attr('y', (d) => yScale(yAccessor(d)))

  // call axes
  xAxisGroup.call(xAxis)
  yAxisGroup.call(yAxis)

  // update x axis text
  xAxisGroup
    .selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end')
    .attr('fill', 'goldenrod')
    .attr('font-size', '12px')
}
let data = []
db.collection('dishes').onSnapshot((res) => {
  res.docChanges().forEach((ch) => {
    const doc = { ...ch.doc.data(), id: ch.doc.id }

    switch (ch.type) {
      case 'added':
        data.push(doc)
        break
      case 'modified':
        const index = data.findIndex((it) => it.id === doc.id)
        data[index] = doc
        break
      case 'removed':
        data = data.filter((it) => it.id !== doc.id)
        break
      default:
        break
    }
  })
  update(data)
})

const widthTween = (d) => {
  // define interpolation
  // d3.interpolate returns a function which we call 'i'
  let i = d3.interpolate(0, xScale.bandwidth())

  // return a function which takes in a time ticker 't'
  return function (t) {
    // return the value from passing the ticker into the interpolation
    return i(t)
  }
}

/**
 * setting transitions for bars:
 *
 * starting conditions:
 * Y = graphHeight
 * height = 0
 *
 * ending conditions:
 * Y = yScale(yAccessor(d))
 * height = graphHeight - yScale(yAccessor(d))
 */
