// SPDX-License-Identifier: MIT

function ImageCard({
  imageUrl, alt, numCopies, hide = false, children,
}) {
  return (
    <div className="container-card" style={{ display: (hide ? 'none' : 'block') }}>
      <img className="img-card" width="80" height="112" src={imageUrl} alt={alt} />
      {
        numCopies !== undefined
          && <span className="container-num-copies">{numCopies}</span>
      }
      {children}
    </div>
  );
}

export default ImageCard;
