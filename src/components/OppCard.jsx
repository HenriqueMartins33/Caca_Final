function OppCard({ tag, title, text }) {
  return (
    <article className="opp-card">
      <span className="opp-tag">{tag}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

export default OppCard;
