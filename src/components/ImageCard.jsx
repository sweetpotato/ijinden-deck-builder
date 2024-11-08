// SPDX-License-Identifier: MIT

import React from 'react';

function ImageCard({
  imageUrl, alt, numCopies, loading = 'auto', small = false, children,
}) {
  const width = small ? 40 : 80;
  const height = small ? 56 : 112;
  const containerClass = small
    ? 'container-card card-small'
    : 'container-card card-medium';
  return (
    <div className={containerClass}>
      <img className="img-card" width={width} height={height} src={imageUrl} alt={alt} loading={loading} />
      {
        numCopies !== undefined
          && <span className="container-num-copies">{numCopies}</span>
      }
      {children}
    </div>
  );
}

export default ImageCard;
