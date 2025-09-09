const NEWS_URL = 'https://servicodados.ibge.gov.br/api/v3/noticias/?qtd=10';
function loadNews() {
    console.log('Iniciando carregamento de notícias...');
    console.log('URL da API:', NEWS_URL);

    const newsContainer = document.getElementById('news-container');
    if(newsContainer){
        newsContainer.innerHTML = '<p>Carregando notícias...</p>';
    }
    fetch(NEWS_URL).then(response => {
        console.log('Resposta recebida. Status:', response.status);
        if(!response.ok){
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`)
        }
        return response.json();
   })
   .then(data => {
    console.log('Dados recebidos:', data);
    if(!newsContainer){
        console.error('Elemento news-container não encontrado no DOM');
        return;
    }
    newsContainer.innerHTML = '';
    if(!data.items || data.items.length === 0) {
        console.log('Nenhuma notícia encontrada');
        newsContainer.innerHTML = `<div class="news-item">
        <h3>Nenhuma notícia encontrada no momento.</h3>
        <p>Tente novamente mais tarde ou verifique sua conexão com a internet.</p>
        </div>`; return;
    }
    data.items.forEach((noticia, index) =>{
        console.log(`Processando notícia ${index + 1}:`, noticia.titulo);
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';

        const dataPublicacao = noticia.data_publicacao ? new Date(noticia.data_publicacao).toLocaleDateString('pt-BR') : 'Data não disponível';
        newsItem.innerHTML = `<h3>${noticia.titulo || 'Sem título'}</h3>
        <p class="news-date">${dataPublicacao}</p>
        <p class="news-intro">${noticia.introducao || ''}</p>
        ${noticia.link ? `<a href="${noticia.link}" target="_blank" class="read-more">Ler mais</a>`: ''}`;
        newsContainer.appendChild(newsItem);
    });
   })
   .catch(error => {
    console.error('Erro ao carregar notícias:', error);
    if(newsContainer){
        newsContainer.innerHTML = `
        <div class="erro-message">
        <p>Não for possível carregar as notícias no momento.</p>
        <p>Tente novamente mais tarde ou verifique sua conexão com a internet.</p>
        <button onclick="loadNews()" class="retry-button">Tentar novamente</button>`
    }
   })
}
window.onload = loadNews;