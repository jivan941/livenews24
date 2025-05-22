const container = document.getElementById('news-container');
const rssUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=health+usa&hl=en-US&gl=US&ceid=US:en';

fetch(rssUrl)
  .then(res => res.json())
  .then(data => {
    container.innerHTML = '';
    data.items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'news-card';
      card.innerHTML = `
        <img src="${item.enclosure?.link || 'https://via.placeholder.com/600x300?text=News+Image'}" alt="News">
        <h2><a href="${item.link}" target="_blank">${item.title}</a></h2>
        <p>${new Date(item.pubDate).toLocaleString()}</p>
      `;
      container.appendChild(card);
    });
  })
  .catch(err => {
    container.innerHTML = "<p>Failed to load news. Please try again later.</p>";
    console.error(err);
  });
