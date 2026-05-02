import useTheme from '../../hooks/useTheme'

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button className="nb-btn" onClick={toggleTheme}>
      {isDark ? '[DARK MODE ■]' : '[LIGHT MODE □]'}
    </button>
  )
}

export default ThemeToggle
