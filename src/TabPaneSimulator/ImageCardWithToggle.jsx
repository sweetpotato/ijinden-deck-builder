import classNames from 'classnames'
import { Button } from 'react-bootstrap'
import ImageCard from '../components/ImageCard'
import enumToggle from './enumToggle'

function ImageCardWithToggle({ imageUrl, alt, toggle, handleToggleAt, index }) {
  const classesButton = classNames({
    'btn-toggled': true,
    'btn-toggled-opaque': toggle === enumToggle.OPAQUE,
    'btn-toggled-transparent': toggle === enumToggle.TRANSPARENT,
    'btn-toggled-red': toggle === enumToggle.RED,
    'btn-toggled-blue': toggle === enumToggle.BLUE,
    'btn-toggled-yellow': toggle === enumToggle.YELLOW,
    'btn-toggled-white': toggle === enumToggle.WHITE,
    'btn-toggled-black': toggle === enumToggle.BLACK,
  })

  return (
    <ImageCard imageUrl={imageUrl} alt={alt}>
      <Button className={classesButton} onClick={() => handleToggleAt(index)} />
    </ImageCard>
  )
}

export default ImageCardWithToggle
