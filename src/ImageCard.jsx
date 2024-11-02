// SPDX-License-Identifier: MIT

function ImageCard({
  imageUrl, alt, hide = false, children,
}) {
  return (
    <div className="container-card" style={{ display: (hide ? 'none' : 'block') }}>
      <img className="img-card" width="80" height="112" src={imageUrl} alt={alt} />
      {children}
    </div>
  );
}

export default ImageCard;
