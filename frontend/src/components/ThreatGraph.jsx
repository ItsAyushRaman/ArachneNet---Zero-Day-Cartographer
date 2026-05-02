import React, { useEffect, useRef } from 'react'
import ForceGraph3D from 'force-graph'

const ThreatGraph = ({ threats, onThreatSelect }) => {
  const containerRef = useRef(null)
  const fgRef = useRef(null)

  const severityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return '#ff3b3b'
      case 'HIGH':
        return '#f59e0b'
      case 'MEDIUM':
        return '#06b6d4'
      case 'LOW':
        return '#22c55e'
      default:
        return '#64748b'
    }
  }

  const severitySize = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 8
      case 'HIGH':
        return 5
      case 'MEDIUM':
        return 3
      case 'LOW':
        return 1
      default:
        return 2
    }
  }

  useEffect(() => {
    if (!containerRef.current) return

    // Transform threats into graph data
    const graphData = {
      nodes: threats.map((threat) => ({
        id: threat.id,
        name: threat.title,
        severity: threat.severity,
        val: severitySize(threat.severity),
        color: severityColor(threat.severity),
        ...threat,
      })),
      links: [],
    }

    // Auto-generate links between nodes with same attack vector
    const attackVectorMap = {}
    graphData.nodes.forEach((node) => {
      if (!attackVectorMap[node.attack_vector]) {
        attackVectorMap[node.attack_vector] = []
      }
      attackVectorMap[node.attack_vector].push(node.id)
    })

    // Create links between nodes in same group
    Object.values(attackVectorMap).forEach((nodeIds) => {
      if (nodeIds.length > 1) {
        for (let i = 0; i < nodeIds.length - 1; i++) {
          graphData.links.push({
            source: nodeIds[i],
            target: nodeIds[i + 1],
          })
        }
      }
    })

    // Initialize graph
    const graph = ForceGraph3D()(containerRef.current)
      .graphData(graphData)
      .backgroundColor('#080b0f')
      .nodeLabel((node) => node.name)
      .nodeColor((node) => node.color)
      .nodeVal((node) => node.val)
      .nodeOpacity(0.9)
      .linkColor(() => '#1c2333')
      .linkWidth(0.5)
      .linkOpacity(0.4)
      .onNodeClick((node) => onThreatSelect(node))
      .enableNodeDrag(true)
      .cooldownTime(2000)
      .d3VelocityDecay(0.3)
      .d3AlphaDecay(0.02)

    fgRef.current = graph

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [threats, onThreatSelect])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}

export default ThreatGraph
