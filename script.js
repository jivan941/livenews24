function loadNews() {
  const topic = document.getElementById('searchInput').value || 'health';
  const encodedTopic = encodeURIComponent(topic.trim());
  const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=${encodedTopic}&hl=en-US&gl=US&ceid=US:en`;

  const container = document.getElementById('news-container');
  container.innerHTML = 'Loading...';

  fetch(rssUrl)
    .then(res => res.json())
    .then(data => {
      container.innerHTML = '';
      if (!data.items.length) {
        container.innerHTML = "<p>No news found for this topic.</p>";
        return;
      }

      data.items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
          <img src="${item.enclosure?.link || 'https://via.placeholder.com/600x300?text=No+Image'}" alt="News">
          <h2><a href="${item.link}" target="_blank">${item.title}</a></h2>
          <p>${new Date(item.pubDate).toLocaleString()}</p>
        `;
        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = "<p>Error loading news. Please try again later.</p>";
    });
}

window.onload = loadNews;
