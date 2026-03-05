async function renderSiteMap() {
  const list = document.getElementById('site-map');
  if (!list) {
    return;
  }

  try {
    const response = await fetch('./site-links.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Could not load site-links.json (${response.status})`);
    }

    const links = await response.json();
    list.innerHTML = '';

    for (const item of links) {
      if (item.label === 'Home' || item.url === './index.html') {
        continue;
      }

      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.url;
      a.textContent = item.label || item.url;
      li.appendChild(a);
      list.appendChild(li);
    }
  } catch (error) {
    list.innerHTML = '<li>Unable to load links. Run `node sitemap.js` to regenerate site-links.json.</li>';
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', renderSiteMap);
