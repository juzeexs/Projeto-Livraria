document.addEventListener('DOMContentLoaded', () => {
    const catalogoLivros = document.getElementById('catalogo-livros');
    const livrosInicio = document.getElementById('livros-inicio');
    const detalhesLivro = document.getElementById('detalhes-livro');
    const listaItensCarrinho = document.getElementById('lista-itens-carrinho');
    const carrinhoTotal = document.getElementById('carrinho-total');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const genreItems = document.querySelectorAll('.genre-item');
    const navbarCollapse = document.getElementById('navbarNav');
    const btnFinalizarCompra = document.getElementById('btn-finalizar-compra');
    const opcoesPagamento = document.getElementById('opcoes-pagamento');
    const containerPagamento = document.getElementById('container-pagamento');
    const newsletterInput = document.getElementById('newsletter-input');
    const btnAssinar = document.getElementById('btn-assinar');
    const newsletterInputFooter = document.getElementById('newsletter-input-footer');
    const btnAssinarFooter = document.getElementById('btn-assinar-footer');

    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let livrosAPI = [];

    const liveToast = document.getElementById('liveToast');
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');
    const toastBootstrap = new bootstrap.Toast(liveToast);

    // Funcionalidade do Toast
    function showToast(title, message) {
        toastTitle.textContent = title;
        toastMessage.textContent = message;
        toastBootstrap.show();
    }

    // --- NOVA LÓGICA: Menu de Configurações, Temas e Fonte ---
    const settingsOffcanvas = document.getElementById('offcanvasSettings');
    const themeButtons = document.querySelectorAll('#offcanvasSettings [data-theme]');
    const fontButtons = document.querySelectorAll('#offcanvasSettings [data-font]');

    // Função para aplicar o tema com base no nome
    function applyTheme(themeName) {
        document.body.classList.remove('purple-theme', 'blue-theme', 'rainbow-theme');
        if (themeName !== 'default') {
            document.body.classList.add(`${themeName}-theme`);
        }
        localStorage.setItem('theme', themeName);
    }

    // Função para aplicar o tamanho da fonte
    function applyFontSize(fontSize) {
        document.body.classList.remove('large-font');
        if (fontSize === 'large') {
            document.body.classList.add('large-font');
        }
        localStorage.setItem('font-size', fontSize);
    }

    // Carrega as configurações salvas no localStorage ao iniciar
    const savedTheme = localStorage.getItem('theme') || 'default';
    applyTheme(savedTheme);

    const savedFontSize = localStorage.getItem('font-size') || 'normal';
    applyFontSize(savedFontSize);

    // Adiciona event listeners para os botões do novo menu
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.getAttribute('data-theme');
            applyTheme(theme);
        });
    });

    fontButtons.forEach(button => {
        button.addEventListener('click', () => {
            const font = button.getAttribute('data-font');
            applyFontSize(font);
        });
    });
    // --- FIM DA NOVA LÓGICA ---

    // Formulários de Checkout
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

                    /*API de qrcode*/
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
        containerPagamento.innerHTML = '';
        let formSpecific = '';
        
        if (method === 'cartao') {
            formSpecific = formCartaoHtml;
        } else if (method === 'pix') {
            formSpecific = formPixHtml;
        } else if (method === 'boleto') {
            formSpecific = formBoletoHtml;
        }
        
        containerPagamento.innerHTML = formSpecific + formEnderecoHtml;
        
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

    // Funcionalidades de navegação e renderização
    function fecharMenu() {
        const isMobile = window.innerWidth < 992;
        if (isMobile && navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
            bsCollapse.hide();
        }
    }

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

        if (pageId === 'produto' && bookId) {
            renderizarDetalhesLivro(bookId);
        } else if (pageId === 'catalogo') {
            renderizarLivros(livrosAPI, catalogoLivros);
        } else if (pageId === 'carrinho') {
            renderizarCarrinho();
        } else if (pageId === 'checkout') {
            document.getElementById('cartao').checked = true;
            showCheckoutSteps('cartao');
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

    /*API de livros*/
    async function buscarOpenLibrary(query, maxResults = 24) {
        try {
            const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${maxResults}`);
            const data = await response.json();
            return data.docs ? data.docs.map(item => {
                const coverId = item.cover_i;
                const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : 'https://via.placeholder.com/128x194.png?text=Sem+Capa';
                
                const precoBase = parseFloat((Math.random() * 50 + 20).toFixed(2));
                const desconto = parseFloat((Math.random() * 0.4 + 0.1).toFixed(2)); 
                const precoPromocional = (precoBase * (1 - desconto)).toFixed(2);
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
                    descricao: item.first_sentence || "Breve descrição não disponível.",
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
        renderizarEsqueleto(livrosInicio, 8);
        renderizarEsqueleto(catalogoLivros, 24);

        let livrosEncontrados = await buscarOpenLibrary(query, 24);

        livrosAPI = livrosEncontrados.filter(livro => livro.titulo && livro.autor && livro.imagem.includes('placeholder') === false);
        
        console.log(`Livros encontrados para "${query}":`, livrosAPI);

        if (livrosAPI.length > 0) {
            renderizarLivros(livrosAPI.slice(0, 8), livrosInicio);
            renderizarLivros(livrosAPI, catalogoLivros);
        } else {
            livrosInicio.innerHTML = '<p class="text-center text-secondary">Nenhum livro popular encontrado. Tente buscar algo!</p>';
            catalogoLivros.innerHTML = '<p class="text-center text-secondary">Nenhum livro encontrado para a sua busca. Tente um termo diferente.</p>';
        }
    }

    function renderizarLivros(livros, container) {
        container.innerHTML = '';
        if (livros.length === 0) {
            container.innerHTML = '<p class="text-center text-secondary">Nenhum livro encontrado.</p>';
            return;
        }
        
        const ageRatings = {
            'L': '#37a70a',
            '10': '#64a100',
            '12': '#a06e00',
            '14': '#b22222',
            '16': '#8b0000',
            '18': '#000000'
        };

        const getAgeBlock = (age) => {
            let text = '';
            let color = '';

            if (age < 10) {
                text = 'L';
                color = ageRatings['L'];
            } else if (age >= 10 && age < 12) {
                text = '10';
                color = ageRatings['10'];
            } else if (age >= 12 && age < 14) {
                text = '12';
                color = ageRatings['12'];
            } else if (age >= 14 && age < 16) {
                text = '14';
                color = ageRatings['14'];
            } else if (age >= 16 && age < 18) {
                text = '16';
                color = ageRatings['16'];
            } else {
                text = '18';
                color = ageRatings['18'];
            }
            
            return `<span style="background-color: ${color}; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${text}</span>`;
        };

        const renderStars = (rating) => {
            const fullStars = Math.floor(rating);
            const halfStar = rating % 1 >= 0.5;
            let starsHtml = '';
            for (let i = 0; i < fullStars; i++) {
                starsHtml += `<i class="fas fa-star text-warning"></i>`;
            }
            if (halfStar) {
                starsHtml += `<i class="fas fa-star-half-alt text-warning"></i>`;
            }
            for (let i = 0; i < (5 - fullStars - (halfStar ? 1 : 0)); i++) {
                starsHtml += `<i class="far fa-star text-warning"></i>`;
            }
            return starsHtml;
        };

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
            setTimeout(() => {
                col.querySelector('.card-livro').classList.add('animated');
            }, index * 100); 
        });
    }

    function renderizarDetalhesLivro(bookId) {
        const livro = livrosAPI.find(l => l.id === bookId);
        if (!livro) {
            detalhesLivro.innerHTML = '<p class="text-center text-secondary">Livro não encontrado.</p>';
            return;
        }
        
        const ageRatings = {
            'L': '#37a70a',
            '10': '#64a100',
            '12': '#a06e00',
            '14': '#b22222',
            '16': '#8b0000',
            '18': '#000000'
        };

        const getAgeBlock = (age) => {
            let text = '';
            let color = '';

            if (age < 10) {
                text = 'L';
                color = ageRatings['L'];
            } else if (age >= 10 && age < 12) {
                text = '10';
                color = ageRatings['10'];
            } else if (age >= 12 && age < 14) {
                text = '12';
                color = ageRatings['12'];
            } else if (age >= 14 && age < 16) {
                text = '14';
                color = ageRatings['14'];
            } else if (age >= 16 && age < 18) {
                text = '16';
                color = ageRatings['16'];
            } else {
                text = '18';
                color = ageRatings['18'];
            }
            
            return `<span style="background-color: ${color}; color: white; padding: 4px 10px; border-radius: 6px; font-size: 1.2em; font-weight: bold;">${text}</span>`;
        };

        const renderStars = (rating) => {
            const fullStars = Math.floor(rating);
            const halfStar = rating % 1 >= 0.5;
            let starsHtml = '';
            for (let i = 0; i < fullStars; i++) {
                starsHtml += `<i class="fas fa-star text-warning"></i>`;
            }
            if (halfStar) {
                starsHtml += `<i class="fas fa-star-half-alt text-warning"></i>`;
            }
            for (let i = 0; i < (5 - fullStars - (halfStar ? 1 : 0)); i++) {
                starsHtml += `<i class="far fa-star text-warning"></i>`;
            }
            return starsHtml;
        };
 detalhesLivro.innerHTML = `
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
                            ${getAgeBlock(livro.idadeRecomendada)}
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

    // Funcionalidades do carrinho
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
        listaItensCarrinho.innerHTML = '';
        if (carrinho.length === 0) {
            listaItensCarrinho.innerHTML = '<p class="text-center text-secondary mt-3">Seu carrinho está vazio.</p>';
            carrinhoTotal.textContent = 'R$ 0,00';
            btnFinalizarCompra.disabled = true;
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
            listaItensCarrinho.appendChild(li);
        });

        carrinhoTotal.textContent = `R$ ${total.toFixed(2)}`;
        btnFinalizarCompra.disabled = false;
    }

    function finalizarCompra(method) {
        showToast('Compra Finalizada!', `Agradecemos a sua preferência. A confirmação do pedido será enviada por e-mail.`);
        carrinho = [];
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        showPage('home');
        containerPagamento.innerHTML = '';
    }
    
    // --- Lógica Unificada da Newsletter ---
    function handleNewsletterSubscription(inputElement) {
        const email = inputElement.value.trim();
        if (email && email.includes('@') && email.includes('.')) {
            // Lógica para enviar o e-mail (simulada)
            showToast('Assinatura Concluída!', 'Obrigado por assinar! Em breve você receberá nossas melhores ofertas.');
            inputElement.value = ''; // Limpa o campo
        } else {
            showToast('Erro na Assinatura', 'Por favor, insira um endereço de e-mail válido.');
        }
    }

    // Event Listeners
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
            const preco = btnAddCarrinho.getAttribute('data-price');
            adicionarAoCarrinho(bookId, preco);
        } else if (btnRemover) {
            e.preventDefault();
            removerDoCarrinho(btnRemover.getAttribute('data-book-id'));
        }
    });

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            showPage('catalogo');
            buscarLivros(query);
        }
    });
    
    genreItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const query = e.target.getAttribute('data-genre-query');
            showPage('catalogo');
            buscarLivros(query);
        });
    });

    opcoesPagamento.addEventListener('change', (e) => {
        if (e.target.name === 'payment-method') {
            showCheckoutSteps(e.target.id);
        }
    });

    // Event listeners para a newsletter (com a nova função)
    if (btnAssinar) {
        btnAssinar.addEventListener('click', () => handleNewsletterSubscription(newsletterInput));
    }
    if (btnAssinarFooter) {
        btnAssinarFooter.addEventListener('click', () => handleNewsletterSubscription(newsletterInputFooter));
    }
    
    // Define o ano atual no rodapé
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Inicialização da página
    buscarLivros('popular science');
});

document.addEventListener('DOMContentLoaded', function() {
    // Sincronizar seletores de tema
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

    // Animação de cards ao rolar
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.2
    });

    document.querySelectorAll('.card-livro').forEach(card => {
        observer.observe(card);
    });

    // --- Lógica do Carrinho ---
    let carrinho = []; // Array para armazenar os itens do carrinho
    const cartCountSpan = document.querySelector('.position-absolute.top-0.start-100.translate-middle.badge');
    const itensCarrinhoContainer = document.getElementById('itensCarrinho');
    const carrinhoVazioMsg = document.getElementById('carrinhoVazio');
    const valorTotalSpan = document.getElementById('valorTotal');

    // Função para atualizar o carrinho na interface
    function atualizarCarrinhoUI() {
        itensCarrinhoContainer.innerHTML = ''; // Limpa o conteúdo atual
        let total = 0;

        if (carrinho.length === 0) {
            carrinhoVazioMsg.style.display = 'block';
        } else {
            carrinhoVazioMsg.style.display = 'none';
            carrinho.forEach(item => {
                const itemHTML = `
                    <div class="carrinho-item" data-product-id="${item.id}">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="carrinho-item-info">
                            <h5 class="mb-0">${item.name}</h5>
                            <small class="text-muted">R$ ${item.price.toFixed(2).replace('.', ',')}</small>
                        </div>
                        <button class="btn btn-sm btn-link text-danger btn-remover" data-product-id="${item.id}">
                            <i class="bi bi-x-circle"></i>
                        </button>
                    </div>
                `;
                itensCarrinhoContainer.innerHTML += itemHTML;
                total += item.price;
            });
        }
        
        cartCountSpan.textContent = carrinho.length;
        valorTotalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    // Adiciona evento de clique para os botões "Adicionar ao Carrinho"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const productName = this.dataset.productName;
            const productPrice = parseFloat(this.dataset.productPrice);
            const productImage = this.dataset.productImage;

            const novoItem = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage
            };

            carrinho.push(novoItem);
            atualizarCarrinhoUI();
        });
    });

    // Adiciona evento de clique para os botões "Remover"
    itensCarrinhoContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('btn-remover') || event.target.closest('.btn-remover')) {
            const button = event.target.closest('.btn-remover');
            const productId = button.dataset.productId;
            carrinho = carrinho.filter(item => item.id !== productId);
            atualizarCarrinhoUI();
        }
    });

    atualizarCarrinhoUI(); // Inicia a interface do carrinho vazia
});

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.dataset.productId;
        const productName = this.dataset.productName;
        const productPrice = parseFloat(this.dataset.productPrice);
        const productImage = this.dataset.productImage;

        // Verifica se o item já está no carrinho
        const itemExistente = carrinho.find(item => item.id === productId);

        if (itemExistente) {
            // Se o item já existe, apenas incrementa a quantidade
            itemExistente.quantidade++;
            showToast('Item Atualizado!', `${productName} foi adicionado novamente ao seu carrinho.`);
        } else {
            // Se o item não existe, adiciona um novo item com quantidade 1
            const novoItem = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantidade: 1 // Adiciona a propriedade 'quantidade'
            };
            carrinho.push(novoItem);
            showToast('Item Adicionado!', `${productName} foi adicionado ao seu carrinho.`);
        }

        // Salva o carrinho no localStorage e atualiza a UI
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarCarrinhoUI();
    });
});

function renderizarCarrinho() {
    listaItensCarrinho.innerHTML = '';
    if (carrinho.length === 0) {
        listaItensCarrinho.innerHTML = '<p class="text-center text-muted">Seu carrinho está vazio.</p>';
    } else {
        carrinho.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'd-flex', 'align-items-center', 'cart-item-list');
            li.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="img-thumbnail me-3" style="width: 60px;">
                <div class="flex-grow-1">
                    <h6 class="mb-0">${item.name}</h6>
                    <p class="text-muted mb-0">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                </div>
                <div class="d-flex align-items-center">
                    <input type="number" class="form-control form-control-sm me-2 item-quantity" value="${item.quantidade}" data-product-id="${item.id}" min="1" style="width: 70px;">
                    <button class="btn btn-danger btn-sm btn-remover" data-product-id="${item.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            listaItensCarrinho.appendChild(li);
        });
    }
}
    atualizarCarrinhoTotal();
     