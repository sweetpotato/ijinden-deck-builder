function ImageCard({ imageUrl, alt }) {
  return (
    <img className="img-card" width="78" height="109" src={imageUrl} alt={alt} />
  );
}

export default ImageCard;
