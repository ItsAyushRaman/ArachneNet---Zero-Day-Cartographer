import { useRef, useState, useMemo, lazy, Suspense, useCallback } from 'react'
import * as THREE from 'three'
import { ScanlineOverlay } from '../ui/index.js'
import GraphLegend from './GraphLegend.jsx'
import GraphStats from './GraphStats.jsx'
import GraphControls from './GraphControls.jsx'
import NodeTooltip from './NodeTooltip.jsx'
import GraphLoadingState from './GraphLoadingState.jsx'
import { transformThreatsToGraph } from '../../utils/graphTransform.js'
import { getSeverityHex } from '../../utils/severity.js'

const ForceGraph3D = lazy(() => import('react-force-graph-3d'))

export default function ThreatGraph({ threats = [], loading, onThreatSelect, selectedThreatId }) {
  const graphRef = useRef()
  const [tooltipNode, setTooltipNode] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  // Stable graph data — only recompute when IDs change
  const threatIds = threats.map(t => t.id).join(',')
  const graphData = useMemo(() => transformThreatsToGraph(threats), [threatIds])

  const handleNodeHover = useCallback((node) => {
    setTooltipNode(node || null)
    document.body.style.cursor = node ? 'pointer' : 'default'
  }, [])

  const handleMouseMove = useCallback((e) => {
    setTooltipPos({ x: e.clientX, y: e.clientY })
  }, [])

  const handleNodeClick = useCallback((node) => {
    if (node?.threat) onThreatSelect(node.threat)
  }, [onThreatSelect])

  const handleBgClick = useCallback(() => {
    onThreatSelect(null)
  }, [onThreatSelect])

  const resetCamera = useCallback(() => {
    graphRef.current?.cameraPosition({ x: 0, y: 0, z: 400 }, { x: 0, y: 0, z: 0 }, 600)
  }, [])

  const zoomIn  = useCallback(() => graphRef.current?.zoom(1.4, 300), [])
  const zoomOut = useCallback(() => graphRef.current?.zoom(0.7, 300), [])

  const makeNodeObject = useCallback((node) => {
    const group = new THREE.Group()
    const hex = getSeverityHex(node.severity)
    const col = new THREE.Color(hex)
    const size = node.val * 0.55

    // Base sphere
    const geo = new THREE.SphereGeometry(size, 12, 12)
    const mat = new THREE.MeshPhongMaterial({
      color: col, emissive: col,
      emissiveIntensity: node.severity === 'CRITICAL' ? 0.5 : 0.2,
      shininess: 80,
    })
    group.add(new THREE.Mesh(geo, mat))

    // CRITICAL: point light + wireframe shell
    if (node.severity === 'CRITICAL') {
      group.add(new THREE.PointLight(hex, 2, 30))
      const wMat = new THREE.MeshBasicMaterial({
        color: col, wireframe: true, opacity: 0.25, transparent: true,
      })
      group.add(new THREE.Mesh(new THREE.SphereGeometry(size * 1.4, 6, 6), wMat))
    }

    // HIGH: orbital ring
    if (node.severity === 'HIGH') {
      const rMat = new THREE.MeshBasicMaterial({
        color: col, side: THREE.DoubleSide, opacity: 0.35, transparent: true,
      })
      group.add(new THREE.Mesh(new THREE.TorusGeometry(size * 1.5, 0.3, 4, 12), rMat))
    }

    return group
  }, [])

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'var(--bg-base)' }}
         onMouseMove={handleMouseMove}>
      <ScanlineOverlay />

      {/* Crosshairs */}
      <div style={{ position:'absolute', top:'50%', left:0, right:0, height:1,
                    background:'var(--graph-grid)', pointerEvents:'none', zIndex:4 }} />
      <div style={{ position:'absolute', left:'50%', top:0, bottom:0, width:1,
                    background:'var(--graph-grid)', pointerEvents:'none', zIndex:4 }} />

      {/* Corner brackets */}
      {[['top','left','Top','Left'],['top','right','Top','Right'],
        ['bottom','left','Bottom','Left'],['bottom','right','Bottom','Right']].map(([v,h,V,H]) => (
        <div key={v+h} style={{
          position:'absolute', [v]:10, [h]:10, width:14, height:14,
          [`border${V}`]:'2px solid var(--green)',
          [`border${H}`]:'2px solid var(--green)',
          pointerEvents:'none', zIndex:5,
        }} />
      ))}

      {loading && <GraphLoadingState />}

      <Suspense fallback={<GraphLoadingState />}>
        <ForceGraph3D
          ref={graphRef}
          graphData={graphData}
          backgroundColor="rgba(0,0,0,0)"
          nodeLabel=""
          nodeColor={n => n.color}
          nodeVal={n => n.val}
          nodeThreeObject={makeNodeObject}
          nodeThreeObjectExtend={false}
          onNodeHover={handleNodeHover}
          onNodeClick={handleNodeClick}
          onBackgroundClick={handleBgClick}
          linkColor={() => 'var(--graph-link)'}
          linkWidth={0.5}
          linkOpacity={0.6}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.005}
          linkDirectionalParticleWidth={1.2}
          linkDirectionalParticleColor={() => '#00F0FF'}
          enableNodeDrag
          showNavInfo={false}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
          width={undefined}
          height={undefined}
        />
      </Suspense>

      <GraphLegend />
      <GraphStats threats={threats} />
      <GraphControls onReset={resetCamera} onZoomIn={zoomIn} onZoomOut={zoomOut} />
      <NodeTooltip node={tooltipNode} x={tooltipPos.x} y={tooltipPos.y} visible={!!tooltipNode} />
    </div>
  )
}
