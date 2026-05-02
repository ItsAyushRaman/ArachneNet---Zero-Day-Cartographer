import { getSeverityConfig } from './severity'

export const transformThreatsToGraph = (threats) => {
  const nodes = threats.map((t) => ({
    id: t.id,
    name: t.title,
    val: getSeverityConfig(t.severity).nodeSize,
    color: getSeverityConfig(t.severity).color,
    severity: t.severity,
    attack_vector: t.attack_vector,
    threat: t,
  }))

  const links = []
  const attackVectorMap = {}

  nodes.forEach((node) => {
    if (!attackVectorMap[node.attack_vector]) {
      attackVectorMap[node.attack_vector] = []
    }
    attackVectorMap[node.attack_vector].push(node.id)
  })

  Object.entries(attackVectorMap).forEach(([vector, nodeIds]) => {
    if (nodeIds.length > 1) {
      for (let i = 0; i < nodeIds.length - 1; i++) {
        links.push({
          source: nodeIds[i],
          target: nodeIds[i + 1],
          vector,
        })
      }
    }
  })

  return { nodes, links }
}
