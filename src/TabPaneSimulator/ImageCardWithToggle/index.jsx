// SPDX-License-Identifier: MIT

import classNames from 'classnames'
import { useState } from 'react'
import { Button } from 'react-bootstrap'

import ImageCard from '../../components/ImageCard'

import './index.css'

const enumToggle = {
  OPAQUE: 0,
  TRANSPARENT: 1,
  RED: 2,
  BLUE: 3,
  YELLOW: 4,
  WHITE: 5,
  BLACK: 6,
}

function ImageCardWithToggleOpaque({ imageUrl, alt, continueSimulator }) {
  return ImageCardWithToggle({
    imageUrl,
    alt,
    defaultToggle: enumToggle.OPAQUE,
    continueSimulator,
  })
}

function ImageCardWithToggleTransparent({ imageUrl, alt, continueSimulator }) {
  return ImageCardWithToggle({
    imageUrl,
    alt,
    defaultToggle: enumToggle.TRANSPARENT,
    continueSimulator,
  })
}

function ImageCardWithToggle({
  imageUrl,
  alt,
  defaultToggle,
  continueSimulator,
}) {
  const [toggle, setToggle] = useState(defaultToggle)

  function handleToggle(continueSimulator) {
    let newToggle
    switch (toggle) {
      case enumToggle.OPAQUE:
        newToggle = enumToggle.TRANSPARENT
        break
      case enumToggle.TRANSPARENT:
        newToggle = enumToggle.RED
        break
      case enumToggle.RED:
        newToggle = enumToggle.BLUE
        break
      case enumToggle.BLUE:
        newToggle = enumToggle.YELLOW
        break
      case enumToggle.YELLOW:
        newToggle = enumToggle.WHITE
        break
      case enumToggle.WHITE:
        newToggle = enumToggle.BLACK
        break
      case enumToggle.BLACK:
        newToggle = enumToggle.TRANSPARENT
        break
      default:
        break
    }
    setToggle(newToggle)
    continueSimulator()
  }

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
      <Button
        className={classesButton}
        onClick={() => handleToggle(continueSimulator)}
      />
    </ImageCard>
  )
}

export { ImageCardWithToggleOpaque, ImageCardWithToggleTransparent }
