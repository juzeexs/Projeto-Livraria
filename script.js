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

   