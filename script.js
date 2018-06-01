// ui state varibles
let addingLink = false
let selectedNode = null

const pannel = d3.select('#pannel')
pannel.select('#addLink').on('click', () => {
  if (!selectedNode) {
    alert('You should select a source node')
  }
  addingLink = true
})

pannel.select('#deleteNode').on('click', () => {
  if (!selectedNode) {
    alert('You should select a node')
  }
  deleteNode(selectedNode)
})

function deleteNode() {
  if (selectedNode) {
    links = links.filter(link => link.source !== selectedNode && link.target !== selectedNode)
    nodes.splice(selectedNode.id - 1, 1)
    draw()
    selectedNode = null
  }
}

function addNode(x, y) {
  nodes.push({ id: nodes.length + 1, x, y })
  selectedNode = nodes[nodes.length - 1]
}

const colors = d3.scaleOrdinal(d3.schemeCategory10)

const margin = { top: 10, right: 10, bottom: 10, left: 10 }
const width = 960 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

const chart = d3
  .select('body')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

chart.append('rect')
  .attr('class', 'background')
  .attr('width', width)
  .attr('height', height)
  .on('click', function() {
    const coords = d3.mouse(this)
    const x = coords[0]
    const y = coords[1]
    addNode(x, y)
    draw()
  })

const linksContainer = chart
      .append('g')
      .attr('class', 'links-container')

const nodes = [
  { id: 1, x: 310, y: 200 },
  { id: 2, x: 450, y: 30 },
  { id: 3, x: 122, y: 150 }
]

let links = [
  { source: nodes[0], target: nodes[1], width: 10 },
  { source: nodes[0], target: nodes[2], width: 20 },
  { source: nodes[2], target: nodes[0], width: 15 },
]

let drag = d3.drag()
  .on('drag', (d) => {
    const { x, y } = d3.event
    d.x = x
    d.y = y
    draw()
  })

const line = d3.line()
  .x(d => d.x)
  .y(d => d.y)

function draw() {
  const nodesView = chart.selectAll('g.node').data(nodes)
  const linksView = linksContainer.selectAll('path').data(links)


  const linksViewEnter = linksView
  .enter()
    .append('path')

  linksView.exit().remove()

  const linksViewUpdate = linksViewEnter.merge(linksView)
        .attr('d', d => line([d.source, d.target]))


  const nodesViewEnter = nodesView
    .enter()
      .append('g')
       .attr('class', 'node')
       .call(drag)


  nodesView.exit().remove()
  
  nodesViewEnter
    .append('circle')//.merge(nodesView).attr('class', 'update')
    .attr('r', 10)
    .on('click', d => {
      if (selectedNode && addingLink) {
        links.push({ source: selectedNode, target: d})
        addingLink = false
      }
      selectedNode = d
      draw()
    })

  const nodesViewUpdate = nodesViewEnter.merge(nodesView)
        .attr('transform', d => `translate(${d.x}, ${d.y})`)
        .style('fill', (d) => (d === selectedNode) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id))

}

draw()