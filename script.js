
document.addEventListener('DOMContentLoaded', () => {

    // --- VARIÁVEIS DE REFERÊNCIA DO DOM ---
    const dom = {
        catalogoLivros: document.getElementById('catalogo-livros'),
        livrosInicio: document.getElementById('livros-inicio'),
        detalhesLivro: document.getElementById('detalhes-livro'),
        listaItensCarrinho: document.getElementById('lista-itens-carrinho'),
        carrinhoTotal: document.getElementById('carrinho-total'),
        searchForm: document.getElementById('search-form'),
        searchInput: document.getElementById('search-input'),
        genreItems: document.querySelectorAll('.genre-item'),
        navbarCollapse: document.getElementById('navbarNav'),
        btnFinalizarCompra: document.getElementById('btn-finalizar-compra'),
        opcoesPagamento: document.getElementById('opcoes-pagamento'),
        containerPagamento: document.getElementById('container-pagamento'),
        newsletterInput: document.getElementById('newsletter-input'),
        btnAssinar: document.getElementById('btn-assinar'),
        newsletterInputFooter: document.getElementById('newsletter-input-footer'),
        btnAssinarFooter: document.getElementById('btn-assinar-footer'),
        carrosselContainer: document.getElementById('carrossel-container'),
        settingsOffcanvas: document.getElementById('offcanvasSettings'),
        themeButtons: document.querySelectorAll('#offcanvasSettings [data-theme]'),
        fontButtons: document.querySelectorAll('#offcanvasSettings [data-font]'),
        liveToast: document.getElementById('liveToast'),
        toastTitle: document.getElementById('toast-title'),
        toastMessage: document.getElementById('toast-message'),
    };

    // --- ESTADO GLOBAL ---
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let livrosAPI = [];
    const toastBootstrap = new bootstrap.Toast(dom.liveToast);

    // --- UTILS / FUNÇÕES AUXILIARES ---
    function showToast(title, message) {
        dom.toastTitle.textContent = title;
        dom.toastMessage.textContent = message;
        toastBootstrap.show();
    }

    function fecharMenu() {
        if (window.innerWidth < 992 && dom.navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(dom.navbarCollapse, { toggle: false });
            bsCollapse.hide();
        }
    }

    function renderStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        let starsHtml = '';
        for (let i = 0; i < fullStars; i++) starsHtml += `<i class="fas fa-star text-warning"></i>`;
        if (halfStar) starsHtml += `<i class="fas fa-star-half-alt text-warning"></i>`;
        for (let i = 0; i < (5 - fullStars - (halfStar ? 1 : 0)); i++) starsHtml += `<i class="far fa-star text-warning"></i>`;
        return starsHtml;
    }

    const ageRatings = {
        'L': '#37a70a',
        '10': '#64a100',
        '12': '#a06e00',
        '14': '#b22222',
        '16': '#8b0000',
        '18': '#000000'
    };

    function getAgeBlock(age) {
        let text = '';
        let color = '';
        if (age < 10) { text = 'L'; color = ageRatings['L']; } 
        else if (age >= 10 && age < 12) { text = '10'; color = ageRatings['10']; } 
        else if (age >= 12 && age < 14) { text = '12'; color = ageRatings['12']; } 
        else if (age >= 14 && age < 16) { text = '14'; color = ageRatings['14']; } 
        else if (age >= 16 && age < 18) { text = '16'; color = ageRatings['16']; } 
        else { text = '18'; color = ageRatings['18']; }
        return `<span style="background-color: ${color}; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${text}</span>`;
    }
    
    // --- LÓGICA DE CONFIGURAÇÃO (TEMA E FONTE) ---
    function applyTheme(themeName) {
        document.body.classList.remove('purple-theme', 'blue-theme', 'rainbow-theme');
        if (themeName !== 'default') {
            document.body.classList.add(`${themeName}-theme`);
        }
        localStorage.setItem('theme', themeName);
    }

    function applyFontSize(fontSize) {
        document.body.classList.remove('large-font');
        if (fontSize === 'large') {
            document.body.classList.add('large-font');
        }
        localStorage.setItem('font-size', fontSize);
    }

    function loadSettings() {
        const savedTheme = localStorage.getItem('theme') || 'default';
        applyTheme(savedTheme);
        const savedFontSize = localStorage.getItem('font-size') || 'normal';
        applyFontSize(savedFontSize);
    }

    // --- LÓGICA DE NAVEGAÇÃO E RENDERIZAÇÃO DE PÁGINAS ---
    function showPage(pageId, bookId = null) {
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });
        const targetPage = document.getElementById(pageId);
        targetPage.classList.add('active');
        targetPage.querySelectorAll('.animated-section').forEach(el => {
            el.classList.remove('animated-section');
            void el.offsetWidth;
            el.classList.add('animated-section');
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });
        
        switch (pageId) {
            case 'produto':
                if (bookId) renderizarDetalhesLivro(bookId);
                break;
            case 'catalogo':
                renderizarLivros(livrosAPI, dom.catalogoLivros);
                break;
            case 'carrinho':
                renderizarCarrinho();
                break;
            case 'checkout':
                document.getElementById('cartao').checked = true;
                showCheckoutSteps('cartao');
                break;
        }

        fecharMenu();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function renderizarEsqueleto(container, count = 8) {
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const esqueletoCard = document.createElement('div');
            esqueletoCard.classList.add('col-lg-3', 'col-md-4', 'col-sm-6', 'mb-4');
            esqueletoCard.innerHTML = `
                <div class="card card-livro h-100 placeholder-glow">
                    <svg class="bd-placeholder-img card-img-top" width="100%" height="350" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: " preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#444"></rect></svg>
                    <div class="card-body">
                        <h5 class="card-title placeholder col-6"></h5>
                        <p class="card-text placeholder col-8"></p>
                        <p class="card-text placeholder col-5"></p>
                        <a href="#" tabindex="-1" class="btn btn-cta disabled placeholder col-6"></a>
                    </div>
                </div>
            `;
            container.appendChild(esqueletoCard);
            setTimeout(() => {
                esqueletoCard.querySelector('.card-livro').classList.add('animated');
            }, i * 100);
        }
    }

    function renderizarLivros(livros, container) {
        container.innerHTML = '';
        if (livros.length === 0) {
            container.innerHTML = '<p class="text-center text-secondary">Nenhum livro encontrado.</p>';
            return;
        }
        livros.forEach((livro, index) => {
            const col = document.createElement('div');
            col.classList.add('col-lg-3', 'col-md-4', 'col-sm-6', 'mb-4');
            col.innerHTML = `
                <div class="card card-livro h-100" data-book-id="${livro.id}">
                    <img src="${livro.imagem}" class="card-img-top" alt="${livro.titulo}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${livro.titulo}</h5>
                        <p class="card-text text-muted">${livro.autor}</p>
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="text-warning">
                                ${renderStars(livro.rating)}
                                <small class="text-white ms-1">(${livro.rating.toFixed(1)})</small>
                            </span>
                            <span class="badge bg-secondary">${livro.genero}</span>
                        </div>
                        <div class="mb-2">
                            ${getAgeBlock(livro.idadeRecomendada)}
                            <span class="ms-2 small text-secondary">Recomendado para maiores de ${livro.idadeRecomendada}</span>
                        </div>
                        <p class="card-text small text-secondary">${livro.descricao.substring(0, 80)}...</p>
                        <div class="card-price mt-auto">
                            <span class="price-old">R$ ${livro.preco.toFixed(2)}</span>
                            <span class="price-new fw-bold">R$ ${livro.precoPromocional.toFixed(2)}</span>
                        </div>
                        <button class="btn btn-cta w-100 btn-adicionar-carrinho" data-book-id="${livro.id}" data-price="${livro.precoPromocional.toFixed(2)}">Adicionar ao Carrinho</button>
                    </div>
                </div>
            `;
            container.appendChild(col);
            setTimeout(() => col.querySelector('.card-livro').classList.add('animated'), index * 100);
        });
    }

    function renderizarDetalhesLivro(bookId) {
        const livro = livrosAPI.find(l => l.id === bookId);
        if (!livro) {
            dom.detalhesLivro.innerHTML = '<p class="text-center text-secondary">Livro não encontrado.</p>';
            return;
        }
        dom.detalhesLivro.innerHTML = `
            <div class="row">
                <div class="col-md-4">
                    <img src="${livro.imagem}" class="img-fluid rounded-3 shadow-lg" alt="${livro.titulo}">
                </div>
                <div class="col-md-8">
                    <h2 class="text-white">${livro.titulo}</h2>
                    <h4 class="text-muted">${livro.autor}</h4>
                    <div class="d-flex align-items-center mb-3">
                        <span class="me-2">${renderStars(livro.rating)}</span>
                        <span class="text-white">(${livro.rating.toFixed(1)} de 5)</span>
                        <span class="badge bg-secondary ms-3">${livro.genero}</span>
                        <span class="ms-3">
                            <span style="background-color: ${ageRatings[getAgeBlock(livro.idadeRecomendada).match(/>(\d+|L)</)[1]]}; color: white; padding: 4px 10px; border-radius: 6px; font-size: 1.2em; font-weight: bold;">${getAgeBlock(livro.idadeRecomendada).match(/>(\d+|L)</)[1]}</span>
                        </span>
                    </div>
                    <div class="d-flex align-items-baseline mb-3">
                        <span class="lead text-primary fw-bold display-6">R$ ${livro.precoPromocional.toFixed(2)}</span>
                        <span class="text-secondary ms-3 price-old">De: R$ ${livro.preco.toFixed(2)}</span>
                    </div>
                    <p class="text-secondary">${livro.descricao}</p>
                    <button class="btn btn-cta btn-lg mt-3 btn-adicionar-carrinho" data-book-id="${livro.id}" data-price="${livro.precoPromocional.toFixed(2)}">
                        <i class="fas fa-shopping-cart me-2"></i> Adicionar ao Carrinho
                    </button>
                    <button class="btn btn-outline-secondary btn-lg mt-3 ms-2" data-page="catalogo">
                        <i class="fas fa-arrow-left me-2"></i> Voltar ao Catálogo
                    </button>
                </div>
            </div>
        `;
    }

    // --- LÓGICA DE DATA FETCHING ---
    async function buscarOpenLibrary(query, maxResults = 24) {
        try {
            const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${maxResults}`);
            const data = await response.json();
            return data.docs ? data.docs.map(item => {
                const coverId = item.cover_i;
                const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : 'https://via.placeholder.com/128x194.png?text=Sem+Capa';
                const precoBase = parseFloat((Math.random() * 50 + 20).toFixed(2));
                const precoPromocional = (precoBase * (1 - parseFloat((Math.random() * 0.4 + 0.1).toFixed(2)))).toFixed(2);
                const genero = item.subject ? item.subject[0].replace('place:', '').trim().split(' ')[0] : 'Gênero';
                const rating = parseFloat((Math.random() * 2 + 3).toFixed(1));
                const idadeRecomendada = Math.floor(Math.random() * 10) + 8;
                return {
                    id: `ol-${item.key.replace('/works/', '')}`,
                    titulo: item.title || "Título não disponível",
                    autor: item.author_name ? item.author_name.join(', ') : "Autor não disponível",
                    preco: precoBase,
                    precoPromocional: parseFloat(precoPromocional),
                    imagem: coverUrl,
                    descricao: item.first_sentence || "Descrição não disponível.",
                    genero: genero,
                    rating: rating,
                    idadeRecomendada: idadeRecomendada,
                };
            }) : [];
        } catch (error) {
            console.error('Erro ao buscar livros da Open Library:', error);
            return [];
        }
    }

    async function buscarLivros(query) {
        renderizarEsqueleto(dom.livrosInicio, 8);
        renderizarEsqueleto(dom.catalogoLivros, 24);
        let livrosEncontrados = await buscarOpenLibrary(query, 24);
        livrosAPI = livrosEncontrados.filter(livro => livro.titulo && livro.autor && !livro.imagem.includes('placeholder'));
        if (livrosAPI.length > 0) {
            renderizarLivros(livrosAPI.slice(0, 8), dom.livrosInicio);
            renderizarLivros(livrosAPI, dom.catalogoLivros);
        } else {
            dom.livrosInicio.innerHTML = '<p class="text-center text-secondary">Nenhum livro popular encontrado. Tente buscar algo!</p>';
            dom.catalogoLivros.innerHTML = '<p class="text-center text-secondary">Nenhum livro encontrado para a sua busca. Tente um termo diferente.</p>';
        }
    }

    async function fetchAndRenderPopularBooks() {
        try {
            const data = await (await fetch(`https://openlibrary.org/search.json?q=popular+fiction&limit=12`)).json();
            dom.carrosselContainer.innerHTML = '';
            data.docs.map(item => {
                const coverId = item.cover_i;
                const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : 'https://via.placeholder.com/128x194.png?text=Sem+Capa';
                const author = item.author_name ? item.author_name.join(', ') : 'Autor Desconhecido';
                return { id: item.key.split('/').pop(), title: item.title, author: author, cover: coverUrl };
            }).forEach(book => {
                dom.carrosselContainer.innerHTML += `
                    <a href="#" class="card-livro-mini" data-bs-toggle="modal" data-bs-target="#bookDetailsModal" data-book-id="${book.id}">
                        <img src="${book.cover}" alt="${book.title}" class="img-fluid">
                        <div class="card-overlay">
                            <h6>${book.title}</h6>
                            <p>${book.author}</p>
                        </div>
                    </a>
                `;
            });
        } catch (error) {
            console.error('Erro ao buscar livros populares:', error);
            dom.carrosselContainer.innerHTML = '<p class="text-center text-muted">Não foi possível carregar os livros. Tente novamente mais tarde.</p>';
        }
    }
    
    // --- LÓGICA DO CARRINHO E CHECKOUT ---
    function adicionarAoCarrinho(bookId, preco) {
        const livro = livrosAPI.find(l => l.id === bookId);
        if (livro) {
            const itemExistente = carrinho.find(item => item.id === bookId);
            if (itemExistente) {
                itemExistente.quantidade++;
            } else {
                carrinho.push({ ...livro, preco: parseFloat(preco), quantidade: 1 });
            }
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            renderizarCarrinho();
            showToast('Adicionado ao Carrinho!', `${livro.titulo} foi adicionado com sucesso.`);
        }
    }

    function removerDoCarrinho(bookId) {
        carrinho = carrinho.filter(item => item.id !== bookId);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        renderizarCarrinho();
        showToast('Item Removido', 'O item foi removido do seu carrinho.');
    }

    function renderizarCarrinho() {
        dom.listaItensCarrinho.innerHTML = '';
        if (carrinho.length === 0) {
            dom.listaItensCarrinho.innerHTML = '<p class="text-center text-secondary mt-3">Seu carrinho está vazio.</p>';
            dom.carrinhoTotal.textContent = 'R$ 0,00';
            dom.btnFinalizarCompra.disabled = true;
            return;
        }
        let total = 0;
        carrinho.forEach(item => {
            total += item.preco * item.quantidade;
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'bg-dark', 'text-white', 'carrinho-item');
            li.innerHTML = `
                <img src="${item.imagem}" alt="${item.titulo}" class="img-fluid rounded me-3">
                <div class="carrinho-item-info">
                    <h5 class="mb-1">${item.titulo}</h5>
                    <small class="text-muted">${item.autor}</small>
                    <p class="mb-0"><strong>R$ ${item.preco.toFixed(2)}</strong> x ${item.quantidade}</p>
                </div>
                <button class="btn btn-remover" data-book-id="${item.id}" aria-label="Remover ${item.titulo}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            dom.listaItensCarrinho.appendChild(li);
        });
        dom.carrinhoTotal.textContent = `R$ ${total.toFixed(2)}`;
        dom.btnFinalizarCompra.disabled = false;
    }

    function finalizarCompra(method) {
        showToast('Compra Finalizada!', `Agradecemos a sua preferência. A confirmação do pedido será enviada por e-mail.`);
        carrinho = [];
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        showPage('home');
        dom.containerPagamento.innerHTML = '';
    }
    
    // --- LÓGICA DO CHECKOUT (CONSTRUÇÃO DOS FORMULÁRIOS) ---
    const formEnderecoHtml = `
        <h5 class="mb-3 text-white mt-4">Informações de Envio</h5>
        <form id="form-envio" class="mb-4">
            <div class="mb-3">
                <label for="cep" class="form-label">CEP</label>
                <input type="text" class="form-control form-control-custom" id="cep" placeholder="Ex: 00000-000" required>
            </div>
            <div class="mb-3">
                <label for="endereco" class="form-label">Endereço</label>
                <input type="text" class="form-control form-control-custom" id="endereco" required>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="numero" class="form-label">Número</label>
                    <input type="text" class="form-control form-control-custom" id="numero" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="complemento" class="form-label">Complemento</label>
                    <input type="text" class="form-control form-control-custom" id="complemento">
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="cidade" class="form-label">Cidade</label>
                    <input type="text" class="form-control form-control-custom" id="cidade" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="estado" class="form-label">Estado</label>
   

<input type="text" class="form-control form-control-custom" id="estado" required>
                </div>
            </div>
            <button type="submit" class="btn btn-cta w-100">Confirmar e Pagar</button>
        </form>
    `;

    const formCartaoHtml = `
        <form id="form-pagamento-cartao">
            <h5 class="mb-3 text-white">Dados do Cartão</h5>
            <div class="mb-3">
                <label for="nome-cartao" class="form-label">Nome no Cartão</label>
                <input type="text" class="form-control form-control-custom" id="nome-cartao" required>
            </div>
            <div class="mb-3">
                <label for="numero-cartao" class="form-label">Número do Cartão</label>
                <input type="text" class="form-control form-control-custom" id="numero-cartao" required>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="validade" class="form-label">Validade</label>
                    <input type="text" class="form-control form-control-custom" id="validade" placeholder="MM/AA" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="cvv" class="form-label">CVV</label>
                    <input type="text" class="form-control form-control-custom" id="cvv" required>
                </div>
            </div>
        </form>
    `;

    const formPixHtml = `
        <div id="info-pix">
            <h5 class="mb-3 text-white">Pagar com PIX</h5>
            <p class="text-center text-muted">Aponte a câmera do seu celular para o QR Code abaixo ou utilize o código Copia e Cola para pagar.</p>
            <div class="d-flex flex-column align-items-center mb-4">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ChavePix-LivrariaElite-ID-2025" alt="QR Code PIX" class="mb-3">
                <p class="fw-bold">Valor: <span id="pix-valor-total">R$ 0,00</span></p>
            </div>
            <div class="mb-3">
                <label for="pix-code" class="form-label">Código PIX Copia e Cola</label>
                <div class="input-group">
                    <textarea id="pix-code" class="form-control form-control-custom pix-code-container" rows="3" readonly>asdfgHJKLKJHGfdsaLKJHGfdsasdfghJHGfdsasdfghjklÇKJHGfdsaKLJHGfdsasdfghjklÇlkjhgfdsasdfghjklçkjhgfdsasdfghjklçasdfghjklç</textarea>
                    <button class="btn btn-copy-pix" type="button" id="btn-copy-pix" aria-label="Copiar código PIX">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    const formBoletoHtml = `
        <div id="info-boleto">
            <h5 class="mb-3 text-white">Pagar com Boleto</h5>
            <p class="text-center text-muted">O boleto será gerado após a confirmação do endereço de entrega. Você poderá imprimir ou pagar online.</p>
            <p class="text-center text-muted">O prazo para pagamento é de 3 dias úteis.</p>
        </div>
    `;

    function showCheckoutSteps(method) {
        dom.containerPagamento.innerHTML = '';
        let formSpecific = '';
        
        switch (method) {
            case 'cartao':
                formSpecific = formCartaoHtml;
                break;
            case 'pix':
                formSpecific = formPixHtml;
                break;
            case 'boleto':
                formSpecific = formBoletoHtml;
                break;
        }
        
        dom.containerPagamento.innerHTML = formSpecific + formEnderecoHtml;
        
        if (method === 'pix') {
            const totalCarrinho = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
            document.getElementById('pix-valor-total').textContent = `R$ ${totalCarrinho.toFixed(2)}`;
            
            document.getElementById('btn-copy-pix').addEventListener('click', () => {
                const pixCode = document.getElementById('pix-code');
                pixCode.select();
                navigator.clipboard.writeText(pixCode.value);
                showToast('Código Copiado!', 'O código PIX foi copiado para a área de transferência.');
            });
        }
        
        document.getElementById('form-envio').addEventListener('submit', (e) => {
            e.preventDefault();
            finalizarCompra(method);
        });
    }

    // --- LÓGICA DA NEWSLETTER ---
    function handleNewsletterSubscription(inputElement) {
        const email = inputElement.value.trim();
        if (email && email.includes('@') && email.includes('.')) {
            showToast('Assinatura Concluída!', 'Obrigado por assinar! Em breve você receberá nossas melhores ofertas.');
            inputElement.value = '';
        } else {
            showToast('Erro na Assinatura', 'Por favor, insira um endereço de e-mail válido.');
        }
    }

    // --- EVENT LISTENERS ---
    function setupEventListeners() {
        // Navegação, Adicionar/Remover do Carrinho
        document.body.addEventListener('click', (e) => {
            const target = e.target.closest('[data-page]');
            const bookCard = e.target.closest('.card-livro');
            const btnAddCarrinho = e.target.closest('.btn-adicionar-carrinho');
            const btnRemover = e.target.closest('.btn-remover');
            
            if (target) {
                e.preventDefault();
                showPage(target.getAttribute('data-page'));
            } else if (bookCard && !e.target.closest('.btn-adicionar-carrinho')) {
                e.preventDefault();
                showPage('produto', bookCard.getAttribute('data-book-id'));
            } else if (btnAddCarrinho) {
                e.preventDefault();
                const bookId = btnAddCarrinho.getAttribute('data-book-id');
                const price = btnAddCarrinho.getAttribute('data-price');
                adicionarAoCarrinho(bookId, price);
            } else if (btnRemover) {
                e.preventDefault();
                removerDoCarrinho(btnRemover.getAttribute('data-book-id'));
            }
        });

        // Search e Gêneros
        dom.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = dom.searchInput.value.trim();
            if (query) {
                showPage('catalogo');
                buscarLivros(query);
            }
        });
        
        dom.genreItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const query = e.target.getAttribute('data-genre-query');
                showPage('catalogo');
                buscarLivros(query);
            });
        });

        // Checkout
        dom.opcoesPagamento.addEventListener('change', (e) => {
            if (e.target.name === 'payment-method') {
                showCheckoutSteps(e.target.id);
            }
        });

        // Newsletter
        if (dom.btnAssinar) {
            dom.btnAssinar.addEventListener('click', () => handleNewsletterSubscription(dom.newsletterInput));
        }
        if (dom.btnAssinarFooter) {
            dom.btnAssinarFooter.addEventListener('click', () => handleNewsletterSubscription(dom.newsletterInputFooter));
        }

        // Configurações
        dom.themeButtons.forEach(button => {
            button.addEventListener('click', () => applyTheme(button.getAttribute('data-theme')));
        });
        dom.fontButtons.forEach(button => {
            button.addEventListener('click', () => applyFontSize(button.getAttribute('data-font')));
        });
        
        // Sincronizar seletores de tema (se existirem)
        const themeSelectors = document.querySelectorAll('#themeSelector, #themeSelectorOffcanvas');
        themeSelectors.forEach(selector => {
            selector.addEventListener('change', function() {
                const theme = this.value;
                document.body.className = `${theme}-theme`;
                themeSelectors.forEach(otherSelector => {
                    if (otherSelector !== this) {
                        otherSelector.value = theme;
                    }
                });
            });
        });
    }

    // --- ANIMAÇÃO DE CARDS NA ROLAGEM ---
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.2
    });
    
    function observeCards() {
        document.querySelectorAll('.card-livro').forEach(card => cardObserver.observe(card));
    }
    
    // --- FUNÇÃO DE INICIALIZAÇÃO ---
    function init() {
        loadSettings();
        setupEventListeners();
        const currentYearSpan = document.getElementById('current-year');
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }
        showPage('home');
        buscarLivros('popular fiction');
        fetchAndRenderPopularBooks();
        setTimeout(observeCards, 1000); // Observa os cards após o carregamento inicial
    }

    // Inicia a aplicação
    init();

});




