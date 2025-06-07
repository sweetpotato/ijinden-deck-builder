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
    <>
      <img
        width={width}
        height={height}
        src={imageUrl}
        alt={alt}
        loading={loading}
      />
      {numCopies !== undefined && (
        <span role="textbox" aria-readonly className="container-num-copies">
          {numCopies}
        </span>
      )}
      {children}
    </>
  )
}

export default ImageCard
