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
      const url = normalizeSiteUrl(item.url);
      if (item.label === 'Home' || url === './' || url === '') {
        continue;
      }

      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = url;
      a.textContent = item.label || pageNameFromUrl(url);
      li.appendChild(a);
      list.appendChild(li);
    }
  } catch (error) {
    list.innerHTML = '<li>Unable to load links. Run `node sitemap.js` to regenerate site-links.json.</li>';
    console.error(error);
  }
}

function normalizeSiteUrl(url) {
  if (!url) {
    return '';
  }

  return url.replace(/index\.html$/i, '');
}

function pageNameFromUrl(url) {
  const cleaned = normalizeSiteUrl(url).replace(/\/$/, '');
  const segments = cleaned.split('/').filter(Boolean);
  return segments[segments.length - 1] || 'Page';
}

document.addEventListener('DOMContentLoaded', renderSiteMap);