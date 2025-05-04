import { enumActionSimulator } from '.'
import enumToggle from './enumToggle'

function handleToggleAt(setToggles, toggles, index, dispatch) {
  const newToggle = toggles.slice()
  switch (newToggle[index]) {
    case enumToggle.OPAQUE:
      newToggle[index] = enumToggle.TRANSPARENT
      break
    case enumToggle.TRANSPARENT:
      newToggle[index] = enumToggle.RED
      break
    case enumToggle.RED:
      newToggle[index] = enumToggle.BLUE
      break
    case enumToggle.BLUE:
      newToggle[index] = enumToggle.YELLOW
      break
    case enumToggle.YELLOW:
      newToggle[index] = enumToggle.WHITE
      break
    case enumToggle.WHITE:
      newToggle[index] = enumToggle.BLACK
      break
    case enumToggle.BLACK:
      newToggle[index] = enumToggle.TRANSPARENT
      break
    default:
      break
  }
  setToggles(newToggle)
  dispatch(enumActionSimulator.CONTINUE)
}

export default handleToggleAt
