async function drawChart() {
  // 1. ACCESS DATA
  // ---------------------------------------------------
  let dataset = await d3.json('./etc.json').then((res) => res)

  // 2. CREATE CHART DIMENSIONS
  // ---------------------------------------------------
  /* calculate wrapper & margin dimensions */
  const width = '600'
  let dimensions = {
    width: width,
    height: width * 0.6,
    margin: {
      top: 30,
      right: 10,
      bottom: 50,
      left: 10,
    },
  }
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  const metrics = ['humidity']
  metrics.forEach(drawHistogram)

  function drawHistogram(metric) {
    let metricAccessor = (d) => d[metric]
    let yAccessor = (d) => d.length

    // 3. DRAW CANVAS
    // ---------------------------------------------------
    const wrapper = d3
      .select('#wrapper')
      .append('svg')
      .attr('role', 'figure')
      .attr('tabindex', '0')
      .attr('class', 'chart')
      .attr('height', dimensions.height)
      .attr('width', dimensions.width)
      .style('background', '#e0e0e0')

    wrapper
      .append('title')
      .text(`Histogram looking at the distribution of ${metric}`)

    const bounds = wrapper
      .append('g')
      .style(
        'transform',
        `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
      )

    // 4. CREATE SCALES
    // ---------------------------------------------------
    let xScale = d3
      .scaleLinear()
      .domain(d3.extent(dataset, metricAccessor))
      .range([0, dimensions.boundedWidth])
      .nice()

    const binsGenerator = d3
      .histogram()
      .domain(xScale.domain())
      .value(metricAccessor)
      .thresholds(12)

    const bins = binsGenerator(dataset)

    let yScale = d3
      .scaleLinear()
      .domain([0, d3.max(bins, yAccessor)])
      .range([dimensions.boundedHeight, 0])
      .nice()

    // 5. DRAW DATA
    // ---------------------------------------------------
    const binsGroup = bounds
      .append('g')
      .attr('tabindex', '0')
      .attr('role', 'list')
      .attr('aria-label', 'histogram bars')
    /* create a <g> element for each bin. Place bars within this group */
    const binGroups = binsGroup
      .selectAll('g')
      .data(bins)
      .enter()
      .append('g')
      .attr('tabindex', '0')
      .attr('role', 'listitem')
      .attr(
        'aria-label',
        (d) =>
          `There were ${yAccessor(d)} days between ${d.x0
            .toString()
            .slice(0, 4)} and ${d.x1.toString().slice(0, 4)} ${metric} levels.`
      )
    const barPadding = 1

    const barRects = binGroups
      .append('rect')
      .attr('x', (d) => xScale(d.x0) + barPadding / 2)
      .attr('y', (d) => yScale(yAccessor(d)))
      .attr('height', (d) => dimensions.boundedHeight - yScale(yAccessor(d)))
      .attr('width', (d) =>
        d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding])
      )
      .attr('fill', '#8bafdf')

    const barText = binGroups
      .filter(yAccessor)
      .append('text')
      .attr('x', (d) => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
      .attr('y', (d) => yScale(yAccessor(d)) - 5)
      .text(yAccessor)
      .style('text-anchor', 'middle')
      .attr('fill', '#444444')
      .style('font-size', '10px')
      .style('font-family', 'sans-serif')

    const mean = d3.mean(dataset, metricAccessor)
    const meanLine = bounds
      .append('line')
      .attr('x1', xScale(mean))
      .attr('x2', xScale(mean))
      .attr('y1', -15)
      .attr('y2', dimensions.boundedHeight)
      .attr('stroke', 'maroon')
      .attr('stroke-dasharray', '2px 4px')

    const meanLabel = bounds
      .append('text')
      .attr('x', xScale(mean))
      .attr('y', -20)
      .text('mean')
      .attr('fill', 'maroon')
      .style('font-size', '10px')
      .attr('text-anchor', 'middle')

    wrapper
      .selectAll('text')
      .attr('role', 'presentation')
      .attr('aria-hidden', true)
    // 6. DRAW PERIPHERALS
    // ---------------------------------------------------
    const xAxisGenerator = d3.axisBottom().scale(xScale)
    const xAxis = bounds
      .append('g')
      .call(xAxisGenerator)
      .style('transform', `translateY(${dimensions.boundedHeight}px)`)

    const xAxisLabel = xAxis
      .append('text')
      .attr('x', dimensions.boundedWidth / 2)
      .attr('y', dimensions.margin.bottom - 10)
      .attr('fill', 'black')
      .style('font-size', '12px')
      .text(metric)
      .style('text-transform', 'uppercase')

    // 7. SET UP INTERACTIONS
    // ---------------------------------------------------
  }
}

drawChart()
