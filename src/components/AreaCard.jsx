function AreaCard({ icon, title, text }) {
  return (
    <article className="area-card">
      <span className="area-icon material-symbols-outlined" aria-hidden="true">{icon}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

export default AreaCard;
