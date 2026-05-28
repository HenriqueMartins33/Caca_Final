function StatCard({ number, text }) {
  return (
    <article className="stat-card">
      <span className="stat-number">{number}</span>
      <p>{text}</p>
    </article>
  );
}

export default StatCard;
