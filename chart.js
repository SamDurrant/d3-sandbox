const data = [
  { width: 200, height: 100, fill: 'purple' },
  { width: 100, height: 60, fill: 'salmon' },
  { width: 50, height: 30, fill: 'goldenrod' },
]

const svg = d3.select('svg')

// join data to rects
const rects = svg.selectAll('rect').data(data)

// add attrs to rects already in the DOM
rects
  .attr('width', (d, i, n) => d.width)
  .attr('height', (d) => d.height)
  .attr('fill', (d) => d.fill)

// append the enter selection to DOM
rects
  .enter()
  .append('rect')
  .attr('width', (d, i, n) => d.width)
  .attr('height', (d) => d.height)
  .attr('fill', (d) => d.fill)

/**
 * The extra virtual elements which haven't been created yet make up a sub-collection. The enter selection is a container for these virtual elements
 *
 * const rects = d3.selectAll('rect').data(data)
 * rects.enter().append('rect).attr(...) - appends rects to DOM for each virtual element
 */
