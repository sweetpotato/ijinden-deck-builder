// SPDX-License-Identifier: MIT

function ImageCard({
  imageUrl,
  alt,
  numCopies,
  loading = 'auto',
  small = false,
  children,
}) {
  const width = small ? 40 : 80
  const height = small ? 56 : 112
  return (
    <li>
      <img
        width={width}
        height={height}
        src={imageUrl}
        alt={alt}
        loading={loading}
      />
      {numCopies !== undefined && (
        <span className="container-num-copies">{numCopies}</span>
      )}
      {children}
    </li>
  )
}

export default ImageCard
