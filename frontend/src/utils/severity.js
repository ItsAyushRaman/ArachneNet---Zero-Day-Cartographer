export const SEVERITY_CONFIG = {
  CRITICAL: {
    color: 'var(--severity-critical)',
    label: 'CRITICAL',
    nodeSize: 8,
    glowColor: '#ff2d2d',
    pulse: 'pulse-glow-red',
  },
  HIGH: {
    color: 'var(--severity-high)',
    label: 'HIGH',
    nodeSize: 5,
    glowColor: '#f5e642',
    pulse: 'pulse-glow-yellow',
  },
  MEDIUM: {
    color: 'var(--severity-medium)',
    label: 'MEDIUM',
    nodeSize: 3,
    glowColor: '#ff6b00',
    pulse: null,
  },
  LOW: {
    color: 'var(--severity-low)',
    label: 'LOW',
    nodeSize: 1,
    glowColor: '#39ff14',
    pulse: null,
  },
}

export const SEVERITIES = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

export const getSeverityHex = (severity) => {
  const hexMap = {
    CRITICAL: '#FF1A1A',
    HIGH: '#FFE500',
    MEDIUM: '#FF6B00',
    LOW: '#00FF41',
  }
  return hexMap[severity] || hexMap.LOW
}

export const getSeverityConfig = (severity) => {
  return SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.LOW
}

export const getSeverityOrder = (severity) => {
  const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
  return order[severity] ?? 3
}
