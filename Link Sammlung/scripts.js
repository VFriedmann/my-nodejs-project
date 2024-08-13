const apiUrl = 'links.json'; // URL zur JSON-Datei

async function fetchLinks() {
    const response = await fetch(apiUrl);
    return response.json();
}

async function saveLinks(links) {
    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(links),
    });
}

async function addLink() {
    const comment = document.getElementById('comment').value;
    const link = document.getElementById('link').value;
    const category1 = document.getElementById('category1').value;
    const category2 = document.getElementById('category2').value;
    const date = document.getElementById('date').value;

    if (!comment || !link || !category1 || !category2 || !date) {
        alert("Bitte alle Felder ausfüllen!");
        return;
    }

    const links = await fetchLinks();
    links.push({ comment, link, category1, category2, date });
    await saveLinks(links);
    loadLinks();
    toggleForm();
}

async function loadLinks() {
    const links = await fetchLinks();
    const linksContainer = document.getElementById('linksContainer');
    linksContainer.innerHTML = '';

    links.forEach((linkObj, index) => {
        const tile = document.createElement('div');
        tile.className = 'tile';

        let thumbnail = '';
        if (linkObj.link.includes('youtube.com') || linkObj.link.includes('youtu.be')) {
            const videoId = getYoutubeVideoId(linkObj.link);
            thumbnail = videoId ? `<img class="youtube-thumbnail" src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="YouTube Thumbnail">` : '';
        }

        tile.innerHTML = `
            ${thumbnail}
            <h3>${linkObj.comment}</h3>
            <p class="description">Kategorie: ${linkObj.category1}, ${linkObj.category2}</p>
            <p>Datum: ${linkObj.date}</p>
            <button class="open-link" onclick="window.open('${linkObj.link}', '_blank')">Link öffnen</button>
            <button onclick="deleteLink(${index})">Löschen</button>
        `;
        linksContainer.appendChild(tile);
    });
}

function getYoutubeVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : null;
}

async function deleteLink(index) {
    if (!confirm("Möchten Sie diesen Link wirklich löschen?")) {
        return;
    }

    const links = await fetchLinks();
    links.splice(index, 1);
    await saveLinks(links);
    loadLinks();
}

async function filterLinks() {
    const searchComment = document.getElementById('searchComment').value.toLowerCase();
    const filterCategory1 = document.getElementById('filterCategory1').value;
    const filterCategory2 = document.getElementById('filterCategory2').value;
    const filterDate = document.getElementById('filterDate').value;
    const links = await fetchLinks();
    const linksContainer = document.getElementById('linksContainer');
    linksContainer.innerHTML = '';

    const filteredLinks = links.filter(linkObj => {
        return (
            (!searchComment || linkObj.comment.toLowerCase().includes(searchComment)) &&
            (!filterCategory1 || linkObj.category1 === filterCategory1) &&
            (!filterCategory2 || linkObj.category2 === filterCategory2) &&
            (!filterDate || linkObj.date === filterDate)
        );
    });

    filteredLinks.forEach((linkObj, index) => {
        const tile = document.createElement('div');
        tile.className = 'tile';

        let thumbnail = '';
        if (linkObj.link.includes('youtube.com') || linkObj.link.includes('youtu.be')) {
            const videoId = getYoutubeVideoId(linkObj.link);
            thumbnail = videoId ? `<img class="youtube-thumbnail" src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="YouTube Thumbnail">` : '';
        }

        tile.innerHTML = `
            ${thumbnail}
            <h3>${linkObj.comment}</h3>
            <p class="description">Kategorie: ${linkObj.category1}, ${linkObj.category2}</p>
            <p class="link">Link: <a href="${linkObj.link}" target="_blank" rel="noopener noreferrer">${linkObj.link}</a></p>
            <p>Datum: ${linkObj.date}</p>
            <button class="open-link" onclick="window.open('${linkObj.link}', '_blank')">Link öffnen</button>
            <button onclick="deleteLink(${index})">Löschen</button>
        `;
        linksContainer.appendChild(tile);
    });
}

function toggleForm() {
    const formContainer = document.getElementById('formContainer');
    const toggleFormButton = document.getElementById('toggleFormButton');
    const isVisible = formContainer.style.display === 'block';
    formContainer.style.display = isVisible ? 'none' : 'block';
    toggleFormButton.textContent = isVisible ? 'Link einfügen' : 'Link einfügen schließen';
    if (!isVisible) {
        formContainer.querySelector('input').focus();
    } else {
        document.getElementById('comment').value = '';
        document.getElementById('link').value = '';
        document.getElementById('category1').value = '';
        document.getElementById('category2').value = '';
        document.getElementById('date').value = '';
    }
}

loadLinks();
