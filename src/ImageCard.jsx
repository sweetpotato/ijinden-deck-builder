function ImageCard({ imageUrl, alt }) {
  return (
    <img className="img-card" width="80" height="112" src={imageUrl} alt={alt} />
  );
}

export default ImageCard;
