function NewsCard({ index, article }) {
  const dateText = article?.publishedAt
    ? `Publicado a ${new Date(article.publishedAt).toLocaleDateString('pt-PT')}`
    : 'A carregar...';

  return (
    <article className="news-card" id={`card-${index}`}>
      <div className={`news-thumb thumb-${index + 1}`}></div>
      <div className="news-body">
        <p className="news-date" id={`date-${index}`}>{dateText}</p>
        <h3 id={`title-${index}`}>{article?.title || 'A carregar notícia...'}</h3>
        <a href={article?.link || '#'} id={`link-${index}`} target="_blank" rel="noreferrer">LER MAIS</a>
      </div>
    </article>
  );
}

export default NewsCard;
