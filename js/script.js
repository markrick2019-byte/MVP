function topo() {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}

function login() {
    var usuario = document.getElementById("usuario").value;
    var senha = document.getElementById("senha").value;

    if (usuario === "admin" && senha === "123456") {
        window.location = "index.html";
    } else {
        alert("Acesso negado. Dados incorretos.");
    }
}

function cadastro() {
    alert("Cadastro feito com sucesso.");
    window.location.href = "index.html";
}

const PRODUCT_STORAGE_KEY = "site_produtos_catalogo_v2";
const CART_STORAGE_KEY = "site_carrinho_compras_v2";
const ACCOUNT_STORAGE_KEY = "site_contas_usuarios_v1";
const SESSION_STORAGE_KEY = "site_sessao_usuario_v1";

const ADMIN_PRODUCT_PRIORITY = {
    byId: {
        "produto-seed-ressuscitou": 10,
        "produto-seed-liturgia": 20,
        "produto-seed-vtb": 30,
        "produto-seed-cic": 40,
        "produto-seed-santos": 50
    },
    byName: {},
    bySection: {
        ressuscitou: 100,
        liturgias: 200,
        vtb: 300,
        cic: 400,
        livros_santos: 500,
        biblia_livro: 600
    },
    defaultPriority: 9999
};

const PRODUCT_SECTIONS = {
    ressuscitou: { label: "Ressuscitou", page: "ressuscitou.html" },
    vtb: { label: "Livros - VTB", page: "Pgs Livros/VTB.html" },
    cic: { label: "Livros - CIC", page: "Pgs Livros/CIC.html" },
    liturgias: { label: "Livros - Liturgia das Horas", page: "Pgs Livros/liturgias.html" },
    livros_santos: { label: "Livros de Santos", page: "Pgs Livros/livros_santos.html" },
    biblia_livro: { label: "Livros - Bíblia", page: "Pgs Livros/Biblia.html" },
    biblia: { label: "Capa de Bíblia", page: "Pgs Capas/biblia.html" },
    lh_ziper: { label: "Capa Liturgia das Horas - Zíper", page: "Pgs Capas/LH_ziper.html" },
    lh_prendedor: { label: "Capa Liturgia das Horas - Prendedor", page: "Pgs Capas/LH_prendedor.html" },
    pasta_liturgica: { label: "Pasta Liturgica", page: "Pgs Capas/pastaLiturgica.html" },
    q_shema: { label: "Quadro - Shemá", page: "Pgs Quadros/q_Shema.html" },
    q_virgem: { label: "Quadro - Virgem", page: "Pgs Quadros/q_Virgem.html" },
    q_arcanjo: { label: "Quadro - Arcanjos", page: "Pgs Quadros/q_Arcanjo.html" },
    q_arcconj: { label: "Quadro - Arcanjos (Conjunto)", page: "Pgs Quadros/q_Arcconj.html" },
    calice: { label: "Calices", page: "Pgs Outro Prod/calice.html" },
    cruz_mesa: { label: "Cruz de Mesa", page: "Pgs Outro Prod/cruz_mesa.html" },
    cruz_ouro: { label: "Cruz - Ouro", page: "Pgs Outro Prod/Cruz/ouro.html" },
    cruz_prata: { label: "Cruz - Prata", page: "Pgs Outro Prod/Cruz/prata.html" }
};

PRODUCT_SECTIONS.biblia_livro.label = "Livros - B\u00edblia";
PRODUCT_SECTIONS.biblia.label = "Capa de B\u00edblia";
PRODUCT_SECTIONS.lh_ziper.label = "Capa Liturgia das Horas - Z\u00edper";
PRODUCT_SECTIONS.q_shema.label = "Quadro - Shem\u00e1";
PRODUCT_SECTIONS.calice.label = "C\u00e1lices";

const DEFAULT_PRODUCTS = [
    {
        id: "produto-seed-ressuscitou",
        name: "Livro de Cantos do Ressuscitou",
        image: "img/Livro de Cantos Ressuscitou.png",
        sectionKey: "ressuscitou",
        price: 70,
        salesCount: 18,
        createdAt: "2026-01-10T10:00:00.000Z",
        description: "Livro de cantos para as celebrações da comunidade, com acabamento pensado para uso frequente."
    },
    {
        id: "produto-seed-liturgia",
        name: "Livro de Liturgia das Horas",
        image: "img/Livro liturgia das Horas.png",
        sectionKey: "liturgias",
        price: 100,
        salesCount: 13,
        createdAt: "2026-01-12T10:00:00.000Z",
        description: "Edicao dedicada a oração diária da Igreja, ideal para quem deseja acompanhar a Liturgia das Horas."
    },
    {
        id: "produto-seed-vtb",
        name: "Livro VTB",
        image: "img/Livro VTB.png",
        sectionKey: "vtb",
        price: 350,
        salesCount: 11,
        createdAt: "2026-01-14T10:00:00.000Z",
        description: "Volume com acabamento especial e presença marcante para estudo e uso pastoral."
    },
    {
        id: "produto-seed-cic",
        name: "Catecismo da Igreja Católica",
        image: "img/Livro CIC.png",
        sectionKey: "cic",
        price: 60,
        salesCount: 8,
        createdAt: "2026-01-16T10:00:00.000Z",
        description: "Catecismo completo para formação, consulta e aprofundamento da fé."
    },
    {
        id: "produto-seed-santos",
        name: "Livro Carmen Hernandez",
        image: "img/Livro Carmén Hernandez.png",
        sectionKey: "livros_santos",
        price: 70,
        salesCount: 6,
        createdAt: "2026-01-18T10:00:00.000Z",
        description: "Leitura inspiradora com conteúdo voltado para espiritualidade e história de vida."
    }
];

document.addEventListener("DOMContentLoaded", function () {
    initializeSite();
});

async function initializeSite() {
    await loadHeader();
    await loadHead();
    await loadFooter();
    renderAuthNav();
    applySupplierOnlyVisibility();
    setupMenuInteractions();
    setupSearchForms();
    createCartDrawer();
    initializeCatalogFeatures();
    setupCatalogControls();
    renderAdminProductList();
    updateCartCount();
    renderProductPage();
    renderCartPage();
    setupAuthForms();
    enforceProductAccess();
    applySupplierOnlyVisibility();
}

function getBasePath() {
    return document.body && document.body.dataset.basePath ? document.body.dataset.basePath : ".";
}

function prefixRelativeUrl(basePath, url) {
    if (!url || /^(?:[a-z]+:|#|\/\/)/i.test(url) || url.startsWith("data:")) {
        return url;
    }

    var cleanedBase = (basePath || ".").replace(/\/$/, "");
    var cleanedUrl = url.replace(/^\.\//, "");

    if (!cleanedBase || cleanedBase === ".") {
        return cleanedUrl;
    }

    return cleanedBase + "/" + cleanedUrl;
}

async function loadHeader() {
    var headerContainer = document.querySelector("header");

    if (!headerContainer) {
        return;
    }

    try {
        var response = await fetch(prefixRelativeUrl(getBasePath(), "header.html"));
        var html = await response.text();
        headerContainer.innerHTML = html;
        updateRelativeAssets(headerContainer);
    } catch (error) {
        console.error("Não foi possível carregar o header:", error);
    }
}

async function loadHead() {
    var headContainer = document.querySelector("head");
    var currentTitle = document.title;

    if (!headContainer) {
        return;
    }

    try {
        var response = await fetch(prefixRelativeUrl(getBasePath(), "head.html"));
        var html = await response.text();
        headContainer.innerHTML = html;

        if (currentTitle && !headContainer.querySelector("title")) {
            var titleElement = document.createElement("title");
            titleElement.textContent = currentTitle;
            headContainer.appendChild(titleElement);
        }

        updateRelativeAssets(headContainer);
    } catch (error) {
        console.error("Não foi possível carregar o head:", error);
    }
}

async function loadFooter() {
    var footerContainer = document.querySelector("footer");

    if (!footerContainer) {
        return;
    }

    try {
        var response = await fetch(prefixRelativeUrl(getBasePath(), "footer.html"));
        var html = await response.text();
        footerContainer.innerHTML = html;
        updateRelativeAssets(footerContainer);
    } catch (error) {
        console.error("Não foi possível carregar o footer:", error);
    }
}

function updateRelativeAssets(scope) {
    var basePath = getBasePath();

    scope.querySelectorAll("[href]").forEach(function (element) {
        var href = element.getAttribute("href");

        if (!href || href === "#") {
            return;
        }

        element.setAttribute("href", prefixRelativeUrl(basePath, href));
    });

    scope.querySelectorAll("[src]").forEach(function (element) {
        var src = element.getAttribute("src");

        if (!src) {
            return;
        }

        element.setAttribute("src", prefixRelativeUrl(basePath, src));
    });
}

function applySupplierOnlyVisibility() {
    var session = getCurrentSession();
    var isSupplier = session && session.role === "fornecedor";

    document.querySelectorAll("[data-supplier-only='true']").forEach(function (element) {
        var shouldHide = !isSupplier;
        element.classList.toggle("d-none", shouldHide);
        element.setAttribute("aria-hidden", shouldHide ? "true" : "false");
    });
}



function setupMenuInteractions() {
    var collapseEl = document.getElementById("menuPrincipal");
    var toggler = document.querySelector(".custom-toggler");

    if (collapseEl && toggler) {
        collapseEl.addEventListener("show.bs.collapse", function () {
            toggler.classList.add("open");
        });

        collapseEl.addEventListener("hide.bs.collapse", function () {
            toggler.classList.remove("open");
        });
    }

    document.querySelectorAll(".dropdown-submenu > .dropdown-toggle").forEach(function (toggle) {
        toggle.addEventListener("click", function (event) {
            if (window.innerWidth < 992) {
                event.preventDefault();
                event.stopPropagation();

                var submenu = this.nextElementSibling;

                if (submenu) {
                    submenu.style.display = submenu.style.display === "block" ? "none" : "block";
                }
            }
        });
    });
}

function initializeCatalogFeatures() {
    ensureStoredProducts();
    ensureDefaultAccounts();
    setupProductForm();
    setupSalesForm();
    renderCatalogViews();
}

function ensureStoredProducts() {
  var currentProducts = getStoredProducts();

  // Se não houver produtos armazenados, inicializa com os defaults
  if (!currentProducts || !currentProducts.length) {
    saveProducts(DEFAULT_PRODUCTS);
    return;
  }

  // Caso já existam produtos no storage, NÃO re-adiciona os DEFAULT_PRODUCTS.
  // Isso evita que itens removidos sejam re-semeados ao navegar entre páginas.
}


function getStoredProducts() {
    try {
        var rawProducts = localStorage.getItem(PRODUCT_STORAGE_KEY);
        var parsedProducts = rawProducts ? JSON.parse(rawProducts) : [];

        if (!Array.isArray(parsedProducts)) {
            return [];
        }

        return parsedProducts.map(normalizeProduct);
    } catch (error) {
        console.error("Não foi possível ler os produtos:", error);
        return [];
    }
}

function saveProducts(products) {
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products.map(normalizeProduct)));
}

function getStoredCart() {
    try {
        var rawCart = localStorage.getItem(CART_STORAGE_KEY);
        var parsedCart = rawCart ? JSON.parse(rawCart) : [];
        return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
        console.error("Não foi possível ler o carrinho:", error);
        return [];
    }
}

function saveCart(items) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

function normalizeProduct(product) {
  var sectionConfig = PRODUCT_SECTIONS[product.sectionKey] || PRODUCT_SECTIONS.ressuscitou;
  var imgs = product.images && product.images.length ? product.images : (product.image ? [product.image] : ["img/logo.png"]);

  return {
    id: product.id || createProductId(),
    name: product.name || "Produto sem nome",
    images: imgs,
    image: imgs[0],
    sectionKey: product.sectionKey || "ressuscitou",
    price: Number(product.price || 0),
    salesCount: Number(product.salesCount || 0),
    createdAt: product.createdAt || new Date().toISOString(),
    adminPriority: Number(product.adminPriority || getAdminProductPriority(product)),
    sectionLabel: sectionConfig.label,
    page: sectionConfig.page,
    description: product.description || buildDefaultDescription(product.name || "Produto", sectionConfig.label)
  };
}

function buildDefaultDescription(name, sectionLabel) {
    return name + " cadastrado na seção " + sectionLabel + ". Edite a descrição ao cadastrar novos produtos para deixar a página do item ainda mais completa.";
}

function createProductId() {
    return "produto-" + Date.now() + "-" + Math.random().toString(16).slice(2, 8);
}

function formatCurrency(value) {
    return Number(value || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function buildProductUrl(productId) {
    return prefixRelativeUrl(getBasePath(), "produto.html?id=" + encodeURIComponent(productId));
}

function getProductById(productId) {
    return getStoredProducts().find(function (product) {
        return product.id === productId;
    }) || null;
}

function getProductsForView(viewType, sectionKey, limit) {
    var products = getStoredProducts().slice();

    if (viewType === "best-sellers") {
        return products.sort(compareBySales).slice(0, limit || 3);
    }

    if (viewType === "section") {
        return products
            .filter(function (product) { return product.sectionKey === sectionKey; })
            .sort(compareByDate);
    }

    return products.sort(compareByFeatured);
}

function compareBySales(productA, productB) {
    if (productB.salesCount !== productA.salesCount) {
        return productB.salesCount - productA.salesCount;
    }

    return new Date(productB.createdAt) - new Date(productA.createdAt);
}

function compareByDate(productA, productB) {
    return new Date(productB.createdAt) - new Date(productA.createdAt);
}

function compareByFeatured(productA, productB) {
    if (Number(productA.adminPriority || 0) !== Number(productB.adminPriority || 0)) {
        return Number(productA.adminPriority || 0) - Number(productB.adminPriority || 0);
    }

    if (productB.salesCount !== productA.salesCount) {
        return productB.salesCount - productA.salesCount;
    }

    return compareByDate(productA, productB);
}

function compareAlphabeticalAsc(productA, productB) {
    return productA.name.localeCompare(productB.name, "pt-BR");
}

function compareAlphabeticalDesc(productA, productB) {
    return productB.name.localeCompare(productA.name, "pt-BR");
}

function comparePriceAsc(productA, productB) {
    return Number(productA.price || 0) - Number(productB.price || 0);
}

function comparePriceDesc(productA, productB) {
    return Number(productB.price || 0) - Number(productA.price || 0);
}

function getAdminProductPriority(product) {
    if (!product) {
        return ADMIN_PRODUCT_PRIORITY.defaultPriority;
    }

    if (product.id && ADMIN_PRODUCT_PRIORITY.byId[product.id] != null) {
        return ADMIN_PRODUCT_PRIORITY.byId[product.id];
    }

    if (product.name && ADMIN_PRODUCT_PRIORITY.byName[product.name] != null) {
        return ADMIN_PRODUCT_PRIORITY.byName[product.name];
    }

    if (product.sectionKey && ADMIN_PRODUCT_PRIORITY.bySection[product.sectionKey] != null) {
        return ADMIN_PRODUCT_PRIORITY.bySection[product.sectionKey];
    }

    return ADMIN_PRODUCT_PRIORITY.defaultPriority;
}

function renderCatalogViews() {
    document.querySelectorAll("[data-catalog-view]").forEach(function (section) {
        var viewType = section.dataset.catalogView;
        var sectionKey = section.dataset.catalogSection;
        var limit = Number(section.dataset.catalogLimit || 0);
        var products = getProductsForView(viewType, sectionKey, limit);
        var grid = section.querySelector(".card-group");
        var emptyMessage = section.querySelector(".catalog-empty-message");
        var resultCounter = document.getElementById("catalog-result-count");

        if (!grid) {
            return;
        }

        if (viewType === "all") {
            products = applyCatalogFilters(products);
        }

        if (!products.length) {
            grid.innerHTML = "";

            if (emptyMessage) {
                emptyMessage.classList.remove("d-none");
            }

            if (resultCounter && viewType === "all") {
                resultCounter.textContent = "Nenhum produto encontrado com os filtros atuais.";
            }

            return;
        }

        if (emptyMessage) {
            emptyMessage.classList.add("d-none");
        }

        if (resultCounter && viewType === "all") {
            resultCounter.textContent = products.length === 1 ? "1 produto encontrado" : products.length + " produtos encontrados";
        }

        grid.innerHTML = products.map(buildProductCard).join("");
    });
}

function buildProductCard(product) {
    var sectionConfig = PRODUCT_SECTIONS[product.sectionKey] || PRODUCT_SECTIONS.ressuscitou;
    var salesText = product.salesCount === 1 ? "1 venda" : product.salesCount + " vendas";

    return [
        '<div class="card">',
        '  <a href="' + buildProductUrl(product.id) + '">',
        '    <img src="' + prefixRelativeUrl(getBasePath(), product.image) + '" class="card-img-top" alt="' + escapeHtml(product.name) + '">',
        '    <div class="card-body">',
        '      <p class="product-section-label">' + escapeHtml(sectionConfig.label) + "</p>",
        '      <h5 class="card-title">' + escapeHtml(product.name) + "</h5>",
        '      <div class="product-meta-row">',
        '        <p class="preço">' + formatCurrency(product.price) + "</p>",
        '        <span class="sales-pill">' + salesText + "</span>",
        "      </div>",
        '      <span class="btn">Ver produto</span>',
        "    </div>",
        "  </a>",
        "</div>"
    ].join("");
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function setupProductForm() {
    // dentro de setupProductForm()
    var imageInput = document.getElementById("product-image");
    var thumbsContainer = document.getElementById("product-image-thumbs");
    var uploadedImagesData = []; // array de dataURLs

    function clearThumbs() {
    if (thumbsContainer) thumbsContainer.innerHTML = "";
    uploadedImagesData = [];
    }

    function addThumb(dataUrl, name, index) {
    if (!thumbsContainer) return;
    var wrapper = document.createElement("div");
    wrapper.style.width = "84px";
    wrapper.style.height = "84px";
    wrapper.style.border = "1px solid #ddd";
    wrapper.style.borderRadius = "8px";
    wrapper.style.overflow = "hidden";
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "center";

    var img = document.createElement("img");
    img.src = dataUrl;
    img.alt = name || ("Imagem " + (index+1));
    img.style.maxWidth = "100%";
    img.style.maxHeight = "100%";
    wrapper.appendChild(img);

    thumbsContainer.appendChild(wrapper);
    }

    if (imageInput) {
    imageInput.addEventListener("change", async function (e) {
        var files = Array.from(e.target.files || []);
        clearThumbs();
        var maxFiles = 6;
        var allowed = files.slice(0, maxFiles);

        for (var i = 0; i < allowed.length; i++) {
        var f = allowed[i];
        // opcional: limitar tamanho ~800KB
        if (f.size && f.size > 800 * 1024) {
            alert("A imagem '" + f.name + "' é muito grande. Tente reduzir (<800KB). Ela será ignorada.");
            continue;
        }
        try {
            var url = await readFileAsDataURL(f);
            uploadedImagesData.push(url);
            addThumb(url, f.name, uploadedImagesData.length - 1);
        } catch (err) {
            console.error("Erro lendo arquivo", f.name, err);
        }
        }
    });
    }

    // no submit do formulário, adicionar images ao produto
    form.addEventListener("submit", async function (event) {
    event.preventDefault();
    // ... validações já existentes ...

    // antes de montar o objeto 'product', inclua:
    var imagesToSave = uploadedImagesData.slice(); // cópia (pode estar vazia)

    var product = {
        id: "produto-" + Date.now(),
        name: document.getElementById("product-name").value.trim(),
        images: imagesToSave,
        image: imagesToSave.length ? imagesToSave[0] : "img/logo.png",
        sectionKey: document.getElementById("product-section").value,
        price: parseFloat(document.getElementById("product-price").value || 0),
        description: document.getElementById("product-description").value.trim(),
        salesCount: 0,
        createdAt: new Date().toISOString()
    };

    var products = getStoredProducts();
    products.push(product);
    saveProducts(products);
    // restante do fluxo: reset form, mensagem, etc.
    });
}

function setupSalesForm() {
    var form = document.getElementById("sales-registration-form");

    if (!form) {
        return;
    }

    populateSalesProducts();

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var productId = document.getElementById("sold-product-id").value;
        var quantity = Number(document.getElementById("sold-quantity").value || 0);
        var messageBox = document.getElementById("sales-form-message");

        if (!productId || quantity < 1) {
            showFormMessage(messageBox, "Informe um produto e uma quantidade válida.", "error");
            return;
        }

        var products = getStoredProducts();
        var updatedProducts = products.map(function (product) {
            if (product.id === productId) {
                product.salesCount += quantity;
            }

            return normalizeProduct(product);
        });

        var soldProduct = updatedProducts.find(function (product) {
            return product.id === productId;
        });

        saveProducts(updatedProducts);
        renderCatalogViews();
        populateSalesProducts();
        form.reset();
        document.getElementById("sold-quantity").value = 1;

        if (soldProduct) {
            showFormMessage(
                messageBox,
                soldProduct.name + " agora possui " + soldProduct.salesCount + " vendas registradas e pode subir para os mais vendidos da home.",
                "success"
            );
        }
    });
}

function populateSectionOptions(select) {
    select.innerHTML = '<option value="">Selecione uma seção</option>';

    Object.keys(PRODUCT_SECTIONS).forEach(function (sectionKey) {
        var option = document.createElement("option");
        option.value = sectionKey;
        option.textContent = PRODUCT_SECTIONS[sectionKey].label;
        select.appendChild(option);
    });
}

function populateSalesProducts() {
    var select = document.getElementById("sold-product-id");

    if (!select) {
        return;
    }

    var products = getStoredProducts().sort(compareByDate);
    select.innerHTML = "";

    if (!products.length) {
        var emptyOption = document.createElement("option");
        emptyOption.value = "";
        emptyOption.textContent = "Nenhum produto cadastrado";
        select.appendChild(emptyOption);
        return;
    }

    products.forEach(function (product) {
        var option = document.createElement("option");
        option.value = product.id;
        option.textContent = product.name + " - " + PRODUCT_SECTIONS[product.sectionKey].label;
        select.appendChild(option);
    });
}

function updateSectionDestination() {
    var select = document.getElementById("product-section");
    var target = document.getElementById("section-destination");

    if (!select || !target) {
        return;
    }

    if (!select.value || !PRODUCT_SECTIONS[select.value]) {
        target.textContent = "Escolha a seção para enviar o produto para a página correta e para a seção Todos os Produtos.";
        return;
    }

    var sectionConfig = PRODUCT_SECTIONS[select.value];
    target.innerHTML = 'O produto será publicado em <a href="' + prefixRelativeUrl(getBasePath(), sectionConfig.page) + '">' + sectionConfig.label + '</a> e na seção <a href="' + prefixRelativeUrl(getBasePath(), "todos_produtos.html") + '">Todos os Produtos</a>.';
}

function getMissingProductFields() {
    var fields = [
        { id: "product-name", label: "Nome do produto" },
        { id: "product-image", label: "Imagem do produto" },
        { id: "product-section", label: "Seção do produto" },
        { id: "product-price", label: "Preço" }
    ];

    return fields.filter(function (field) {
        var element = document.getElementById(field.id);

        if (!element) {
            return false;
        }

        if (element.type === "file") {
            return !(element.files && element.files.length);
        }

        return !String(element.value || "").trim();
    }).map(function (field) {
        return field.label;
    });
}

function markMissingProductFields() {
    ["product-name", "product-image", "product-section", "product-price"].forEach(function (fieldId) {
        var field = document.getElementById(fieldId);

        if (!field) {
            return;
        }

        var hasValue = field.type === "file" ? field.files && field.files.length : String(field.value || "").trim();
        field.classList.toggle("is-invalid", !hasValue);
        field.classList.toggle("is-valid", !!hasValue);
    });
}

function updateImagePreview(event) {
    var preview = document.getElementById("product-image-preview");
    var file = event.target.files && event.target.files[0];

    if (!preview) {
        return;
    }

    if (!file) {
        resetImagePreview();
        return;
    }

    readFileAsDataURL(file).then(function (dataUrl) {
        preview.innerHTML = '<img src="' + dataUrl + '" alt="Preview do produto">';
    });
}

function resetImagePreview() {
    var preview = document.getElementById("product-image-preview");

    if (preview) {
        preview.innerHTML = "<span>Selecione uma imagem para visualizar.</span>";
    }
}

function readFileAsDataURL(file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();

        reader.onload = function () {
            resolve(reader.result);
        };

        reader.onerror = function () {
            reject(new Error("Não foi possível ler a imagem."));
        };

        reader.readAsDataURL(file);
    });
}

function showFormMessage(container, message, type) {
    if (!container) {
        return;
    }

    container.className = "form-feedback " + (type || "");
    container.innerHTML = message;
}

function setupSearchForms() {
    var currentQuery = getCatalogSearchValue();

    document.querySelectorAll(".search-form, .mobile-search").forEach(function (form) {
        var input = form.querySelector('input[type="search"]');

        if (!input) {
            return;
        }

        input.value = currentQuery;

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            redirectToCatalogSearch(input.value);
        });
    });
}

function redirectToCatalogSearch(term) {
    var url = new URL(prefixRelativeUrl(getBasePath(), "todos_produtos.html"), window.location.href);
    var normalizedTerm = String(term || "").trim();

    if (normalizedTerm) {
        url.searchParams.set("busca", normalizedTerm);
    }

    window.location.href = url.toString();
}

function getCatalogSearchValue() {
    var params = new URLSearchParams(window.location.search);
    return params.get("busca") || "";
}

function getCatalogSortValue() {
    var params = new URLSearchParams(window.location.search);
    return params.get("ordem") || "destaque";
}

function setupCatalogControls() {
    var searchInput = document.getElementById("catalog-search-input");
    var sortSelect = document.getElementById("catalog-sort");

    if (!searchInput || !sortSelect) {
        return;
    }

    searchInput.value = getCatalogSearchValue();
    sortSelect.value = getCatalogSortValue();

    searchInput.addEventListener("input", function () {
        updateCatalogUrlState(this.value, sortSelect.value);
        renderCatalogViews();
    });

    sortSelect.addEventListener("change", function () {
        updateCatalogUrlState(searchInput.value, this.value);
        renderCatalogViews();
    });
}

function updateCatalogUrlState(searchTerm, sortValue) {
    var url = new URL(window.location.href);
    var normalizedSearch = String(searchTerm || "").trim();
    var normalizedSort = String(sortValue || "destaque").trim();

    if (normalizedSearch) {
        url.searchParams.set("busca", normalizedSearch);
    } else {
        url.searchParams.delete("busca");
    }

    if (normalizedSort && normalizedSort !== "destaque") {
        url.searchParams.set("ordem", normalizedSort);
    } else {
        url.searchParams.delete("ordem");
    }

    window.history.replaceState({}, "", url.toString());
}

function applyCatalogFilters(products) {
    var filteredProducts = products.slice();
    var searchTerm = normalizeSearchText(getCatalogSearchValue());
    var sortValue = getCatalogSortValue();

    if (searchTerm) {
        filteredProducts = filteredProducts.filter(function (product) {
            var haystack = normalizeSearchText([
                product.name,
                product.sectionLabel,
                product.description
            ].join(" "));

            return haystack.indexOf(searchTerm) !== -1;
        });
    }

    if (sortValue === "mais-vendidos") {
        return filteredProducts.sort(compareBySales);
    }

    if (sortValue === "az") {
        return filteredProducts.sort(compareAlphabeticalAsc);
    }

    if (sortValue === "za") {
        return filteredProducts.sort(compareAlphabeticalDesc);
    }

    if (sortValue === "menor-preço") {
        return filteredProducts.sort(comparePriceAsc);
    }

    if (sortValue === "maior-preço") {
        return filteredProducts.sort(comparePriceDesc);
    }

    return filteredProducts.sort(compareByFeatured);
}

function normalizeSearchText(value) {
    return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function ensureDefaultAccounts() {
    var accounts = getStoredAccounts();

    if (accounts.length) {
        return;
    }

    saveAccounts([
        {
            id: "conta-admin-fornecedor",
            role: "fornecedor",
            fullName: "Administrador",
            displayName: "admin",
            email: "admin@site.com",
            phone: "",
            password: "123456",
            document: "00.000.000/0001-00",
            businessName: "Loja principal",
            productCategory: "Catálogo geral",
            createdAt: new Date().toISOString()
        }
    ]);
}

function getStoredAccounts() {
    try {
        var rawAccounts = localStorage.getItem(ACCOUNT_STORAGE_KEY);
        var parsedAccounts = rawAccounts ? JSON.parse(rawAccounts) : [];
        return Array.isArray(parsedAccounts) ? parsedAccounts : [];
    } catch (error) {
        console.error("Não foi possível ler as contas:", error);
        return [];
    }
}

function saveAccounts(accounts) {
    localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accounts));
}

function getCurrentSession() {
    try {
        var rawSession = localStorage.getItem(SESSION_STORAGE_KEY);
        return rawSession ? JSON.parse(rawSession) : null;
    } catch (error) {
        console.error("Não foi possível ler a sessão:", error);
        return null;
    }
}

function saveSession(sessionData) {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
}

function renderAuthNav() {
  var container = document.getElementById("nav-auth");
  if (!container) return;
  var session = getCurrentSession();

  var loginLink = '<a class="nav-link" href="' + prefixRelativeUrl(getBasePath(), 'login.html') + '">Login</a>';

  if (!session) {
    container.innerHTML = loginLink;
    return;
  }

  var name = escapeHtml(session.displayName || session.fullName || session.email || 'Usuário');
  var greeting = '<span class="ms-2 me-2">Olá, ' + name + '</span>';
  var logoutBtn = '<button class="btn btn-sm btn-outline-secondary" onclick="logout()" type="button">Sair</button>';

  container.innerHTML = '<div class="d-flex align-items-center">' + loginLink + greeting + logoutBtn + '</div>';
}

/**
 * Apaga contas armazenadas.
 * keepAdmin: se true (padrão) mantém a conta seed do admin; se false apaga tudo.
 */
function deleteAllAccounts(keepAdmin = true) {
  if (!confirm('Confirma apagar todas as contas? Esta ação é irreversível.')) return;

  if (keepAdmin) {
    var admin = getStoredAccounts().filter(function(a){ return a.id === 'conta-admin-fornecedor'; });
    saveAccounts(admin);
  } else {
    saveAccounts([]);
  }

  alert('Contas atualizadas.');
  // atualiza UI de autenticação caso a sessão atual pertença a uma conta removida
  applySupplierOnlyVisibility();
  renderAuthNav();
}

function setupAuthForms() {
    setupLoginForm();
    setupRegistrationForm();
    updateRoleFields();
}

function setupLoginForm() {
    var form = document.getElementById("login-form");
    var feedback = document.getElementById("login-message");

    if (!form) {
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var loginValue = document.getElementById("login-identifier").value.trim().toLowerCase();
        var password = document.getElementById("login-password").value;
        var account = getStoredAccounts().find(function (item) {
            return (String(item.email || "").toLowerCase() === loginValue || String(item.displayName || "").toLowerCase() === loginValue) && item.password === password;
        });

        if (!account) {
            showFormMessage(feedback, "Não encontramos uma conta com esses dados.", "error");
            return;
        }

        saveSession({
            id: account.id,
            role: account.role,
            fullName: account.fullName,
            email: account.email
        });
        applySupplierOnlyVisibility();

        showFormMessage(feedback, "Login realizado com sucesso. Redirecionando...", "success");
        window.setTimeout(function () {
            window.location.href = prefixRelativeUrl(getBasePath(), account.role === "fornecedor" ? "cadastro_produtos.html" : "index.html");
        }, 700);
    });
}

function setupRegistrationForm() {
    var form = document.getElementById("registration-form");
    var roleField = document.getElementById("register-role");
    var feedback = document.getElementById("register-message");

    if (!form) {
        return;
    }

    if (roleField) {
        roleField.addEventListener("change", updateRoleFields);
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var role = document.getElementById("register-role").value;
        var fullName = document.getElementById("register-name").value.trim();
        var displayName = document.getElementById("register-display-name").value.trim();
        var email = document.getElementById("register-email").value.trim().toLowerCase();
        var phone = document.getElementById("register-phone").value.trim();
        var password = document.getElementById("register-password").value;
        var confirmPassword = document.getElementById("register-password-confirm").value;
        var roleRequiredFields = getRoleRequiredFields(role);
        var missingFields = roleRequiredFields.filter(function (field) {
            var input = document.getElementById(field.id);
            return !input || !String(input.value || "").trim();
        });

        if (!role || !fullName || !displayName || !email || !phone || !password || !confirmPassword || missingFields.length) {
            var labels = ["Tipo de conta", "Nome completo", "Como deseja ser identificado", "E-mail", "Telefone", "Senha", "Confirmacao de senha"]
                .concat(missingFields.map(function (field) { return field.label; }));
            showFormMessage(feedback, "Complete os campos obrigatorios: " + labels.join(", ") + ".", "error");
            return;
        }

        if (password.length < 6) {
            showFormMessage(feedback, "A senha deve ter pelo menos 6 caracteres.", "error");
            return;
        }

        if (password !== confirmPassword) {
            showFormMessage(feedback, "A confirmação da senha não confere.", "error");
            return;
        }

        var accounts = getStoredAccounts();
        var emailExists = accounts.some(function (account) {
            return String(account.email || "").toLowerCase() === email;
        });

        if (emailExists) {
            showFormMessage(feedback, "Já existe uma conta cadastrada com esse e-mail.", "error");
            return;
        }

        var account = {
            id: "conta-" + Date.now(),
            role: role,
            fullName: fullName,
            displayName: displayName,
            email: email,
            phone: phone,
            password: password,
            document: document.getElementById(role === "fornecedor" ? "register-cnpj" : "register-cpf").value.trim(),
            city: role === "cliente" ? document.getElementById("register-city").value.trim() : "",
            businessName: role === "fornecedor" ? document.getElementById("register-business-name").value.trim() : "",
            productCategory: role === "fornecedor" ? document.getElementById("register-product-category").value.trim() : "",
            createdAt: new Date().toISOString()
        };

        accounts.push(account);
        saveAccounts(accounts);
        saveSession({
            id: account.id,
            role: account.role,
            fullName: account.fullName,
            email: account.email
        });
        applySupplierOnlyVisibility();

        form.reset();
        updateRoleFields();
        showFormMessage(
            feedback,
            role === "fornecedor"
                ? "Conta de fornecedor criada com sucesso. Voce já pode cadastrar produtos."
                : "Conta de cliente criada com sucesso. Seu acesso esta liberado para compras.",
            "success"
        );
    });
}

function getRoleRequiredFields(role) {
    if (role === "fornecedor") {
        return [
            { id: "register-business-name", label: "Nome da empresa" },
            { id: "register-cnpj", label: "CNPJ" },
            { id: "register-product-category", label: "Categoria de produtos" }
        ];
    }

    return [
        { id: "register-cpf", label: "CPF" },
        { id: "register-city", label: "Cidade" }
    ];
}

function updateRoleFields() {
    var roleSelect = document.getElementById("register-role");
    var clientFields = document.getElementById("client-fields");
    var supplierFields = document.getElementById("supplier-fields");
    var helperText = document.getElementById("register-role-helper");

    if (!roleSelect || !clientFields || !supplierFields || !helperText) {
        return;
    }

    var isSupplier = roleSelect.value === "fornecedor";
    clientFields.classList.toggle("d-none", isSupplier);
    supplierFields.classList.toggle("d-none", !isSupplier);
    helperText.textContent = isSupplier
        ? "Fornecedores podem acessar o cadastro de produtos após entrarem na conta."
        : "Clientes podem comprar normalmente, mas não acessam o painel de cadastro de produtos.";
}

function enforceProductAccess() {
    var accessPanel = document.getElementById("product-access-guard");
    var adminGrid = document.querySelector(".product-admin-grid");

    if (!accessPanel || !adminGrid) {
        return;
    }

    var session = getCurrentSession();
    var isSupplier = session && session.role === "fornecedor";

    accessPanel.classList.toggle("d-none", !!isSupplier);
    adminGrid.classList.toggle("d-none", !isSupplier);
    adminGrid.querySelectorAll("input, select, textarea, button").forEach(function (field) {
        field.disabled = !isSupplier;
    });

    if (!isSupplier) {
        accessPanel.innerHTML = [
            '<div class="access-guard-card">',
            '  <p class="catalog-eyebrow">Acesso restrito</p>',
            '  <h2>Somente fornecedores podem cadastrar produtos</h2>',
            '  <p>Entre com uma conta de fornecedor ou crie uma nova conta na página de login para liberar este painel.</p>',
            '  <a class="section-link" href="' + prefixRelativeUrl(getBasePath(), "login.html") + '">Ir para login e cadastro</a>',
            "</div>"
        ].join("");
        return;
    }

    accessPanel.innerHTML = [
        '<div class="access-guard-card is-success">',
        '  <p class="catalog-eyebrow">Fornecedor autenticado</p>',
        '  <h2>Painel liberado para cadastro</h2>',
        '  <p>Voce esta conectado como fornecedor e pode cadastrar produtos e registrar vendas.</p>',
        "</div>"
    ].join("");
}

function getOptionProfile(product) {
    if (String(product.sectionKey).indexOf("q_") === 0) {
        return [
            { key: "tamanho", label: "Tamanho", values: ["Pequeno", "Medio", "Grande"] },
            { key: "moldura", label: "Moldura", values: ["Madeira Clara", "Madeira Escura", "Preta"] },
            { key: "acabamento", label: "Acabamento", values: ["Fosco", "Brilho"] }
        ];
    }

    if (String(product.sectionKey).indexOf("lh_") === 0 || product.sectionKey === "biblia" || product.sectionKey === "pasta_liturgica") {
        return [
            { key: "icone", label: "Icone", values: ["Icone 01", "Icone 02", "Icone 03"] },
            { key: "tamanho", label: "Tamanho", values: ["Medio", "Grande"] },
            { key: "fecho", label: "Fecho", values: ["Botao", "Ziper"] }
        ];
    }

    if (product.sectionKey === "cruz_ouro" || product.sectionKey === "cruz_prata" || product.sectionKey === "cruz_mesa" || product.sectionKey === "calice") {
        return [
            { key: "acabamento", label: "Acabamento", values: ["Padrão", "Premium"] },
            { key: "cor", label: "Cor", values: ["Ouro", "Prata", "Marrom"] }
        ];
    }

    return [
        { key: "modelo", label: "Modelo", values: ["Padrão", "Especial"] },
        { key: "acabamento", label: "Acabamento", values: ["Clássico", "Premium"] }
    ];
}

function buildProductOptionFields(optionProfile) {
    return optionProfile.map(function (field) {
        return [
            '<label class="form-field">',
            '  <span>' + escapeHtml(field.label) + "</span>",
            '  <select id="option-' + escapeHtml(field.key) + '">',
                 field.values.map(function (value) {
                    return '<option value="' + escapeHtml(value) + '">' + escapeHtml(value) + "</option>";
                 }).join(""),
            "  </select>",
            "</label>"
        ].join("");
    }).join("");
}

function renderProductPage() {
    var container = document.getElementById("product-detail-page");

    if (!container) {
        return;
    }

    var params = new URLSearchParams(window.location.search);
    var productId = params.get("id");
    var product = productId ? getProductById(productId) : null;

    if (!product) {
        document.title = "Produto não encontrado";
        container.innerHTML = [
            '<div class="catalog-hero">',
            '<p class="catalog-eyebrow">Produto não encontrado</p>',
            '<h1>Este item não foi localizado</h1>',
            '<p>Volte ao catálogo geral para continuar comprando.</p>',
            '<a class="section-link" href="' + prefixRelativeUrl(getBasePath(), "todos_produtos.html") + '">Ir para Todos os Produtos</a>',
            "</div>"
        ].join("");
        return;
    }

    var sectionConfig = PRODUCT_SECTIONS[product.sectionKey] || PRODUCT_SECTIONS.ressuscitou;
    var optionProfile = getOptionProfile(product);
    document.title = product.name;

    container.innerHTML = [
        '<div class="product-layout">',
        '  <div class="product-gallery">',
        '    <div class="product-main-image"><img src="' + prefixRelativeUrl(getBasePath(), product.image) + '" alt="' + escapeHtml(product.name) + '"></div>',
        '    <div class="product-thumb-row"><button type="button" class="product-thumb is-active"><img src="' + prefixRelativeUrl(getBasePath(), product.image) + '" alt="' + escapeHtml(product.name) + '"></button></div>',
        "  </div>",
        '  <div class="product-summary">',
        '    <p class="catalog-eyebrow">Produto cadastrado</p>',
        '    <h1>' + escapeHtml(product.name) + "</h1>",
        '    <p class="product-subtitle">' + escapeHtml(sectionConfig.label) + "</p>",
        '    <div class="product-price">' + formatCurrency(product.price) + "</div>",
        '    <form id="product-purchase-form" class="product-purchase-form">',
             buildProductOptionFields(optionProfile),
        '      <label class="form-field"><span>Quantidade</span><input type="number" id="product-quantity" min="1" step="1" value="1"></label>',
        '      <button type="submit" class="product-add-button">Adicionar ao carrinho</button>',
        "    </form>",
        '    <div class="product-description"><h3>Sobre este produto</h3><p>' + escapeHtml(product.description) + "</p></div>",
        '    <a class="section-link" href="' + prefixRelativeUrl(getBasePath(), sectionConfig.page) + '">Ver outros itens desta seção</a>',
        "  </div>",
        "</div>"
    ].join("");

    var form = document.getElementById("product-purchase-form");

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            var quantity = Number(document.getElementById("product-quantity").value || 1);
            var selectedOptions = {};

            optionProfile.forEach(function (field) {
                var select = document.getElementById("option-" + field.key);
                if (select) {
                    selectedOptions[field.label] = select.value;
                }
            });

            addProductToCart(product.id, quantity, selectedOptions);
        });
    }
}

function createCartDrawer() {
    if (document.getElementById("cart-drawer-overlay")) {
        return;
    }

    var wrapper = document.createElement("div");
    wrapper.innerHTML = [
        '<div id="cart-drawer-overlay" class="cart-drawer-overlay"></div>',
        '<aside id="cart-drawer" class="cart-drawer" aria-hidden="true">',
        '  <div class="cart-drawer-header">',
        '    <div><p class="catalog-eyebrow">Sua compra</p><h2>Carrinho lateral</h2></div>',
        '    <button type="button" class="cart-close-button" id="cart-drawer-close" aria-label="Fechar carrinho">&times;</button>',
        "  </div>",
        '  <div id="cart-drawer-body" class="cart-drawer-body"></div>',
        '  <div class="cart-drawer-footer"><a class="submit-button cart-page-link" href="' + prefixRelativeUrl(getBasePath(), "carrinho.html") + '">Ver carrinho completo</a></div>',
        "</aside>"
    ].join("");

    document.body.appendChild(wrapper);
    document.getElementById("cart-drawer-overlay").addEventListener("click", closeCartDrawer);
    document.getElementById("cart-drawer-close").addEventListener("click", closeCartDrawer);
}

function openCartDrawer() {
    var overlay = document.getElementById("cart-drawer-overlay");
    var drawer = document.getElementById("cart-drawer");

    if (!overlay || !drawer) {
        return;
    }

    renderCartDrawer();
    overlay.classList.add("is-open");
    drawer.classList.add("is-open");
}

function closeCartDrawer() {
    var overlay = document.getElementById("cart-drawer-overlay");
    var drawer = document.getElementById("cart-drawer");

    if (!overlay || !drawer) {
        return;
    }

    overlay.classList.remove("is-open");
    drawer.classList.remove("is-open");
}

function createCartItemKey(productId, options) {
    var optionKeys = Object.keys(options || {}).sort();
    var serialized = optionKeys.map(function (key) { return key + ":" + options[key]; }).join("|");
    return productId + "::" + serialized;
}

function addProductToCart(productId, quantity, selectedOptions) {
    if (!productId || quantity < 1) {
        return;
    }

    var cart = getStoredCart();
    var itemKey = createCartItemKey(productId, selectedOptions);
    var existingItem = cart.find(function (item) { return item.key === itemKey; });

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            key: itemKey,
            productId: productId,
            quantity: quantity,
            options: selectedOptions || {}
        });
    }

    saveCart(cart);
    refreshCartUi();
    openCartDrawer();
}

function hydrateCartItems() {
    return getStoredCart().map(function (item) {
        var product = getProductById(item.productId);

        if (!product) {
            return null;
        }

        return {
            key: item.key,
            productId: item.productId,
            quantity: Number(item.quantity || 1),
            options: item.options || {},
            product: product,
            total: Number(item.quantity || 1) * Number(product.price || 0)
        };
    }).filter(Boolean);
}

function updateCartCount() {
    var count = getStoredCart().reduce(function (total, item) {
        return total + Number(item.quantity || 0);
    }, 0);

    document.querySelectorAll(".cart-count").forEach(function (badge) {
        badge.textContent = count;
    });
}

function formatOptionsSummary(options) {
    var entries = Object.keys(options || {}).map(function (key) {
        return options[key];
    }).filter(Boolean);

    return entries.length ? entries.join(" / ") : "Configuração padrão";
}

function renderCartDrawer() {
    var container = document.getElementById("cart-drawer-body");

    if (!container) {
        return;
    }

    document.title = "Carrinho de Compras";

    var items = hydrateCartItems();

    if (!items.length) {
        container.innerHTML = '<div class="cart-empty-state"><p>Seu carrinho esta vazio.</p><a class="section-link" href="' + prefixRelativeUrl(getBasePath(), "todos_produtos.html") + '">Continuar comprando</a></div>';
        return;
    }

    var subtotal = items.reduce(function (total, item) { return total + item.total; }, 0);

    container.innerHTML = [
        '<div class="cart-drawer-items">',
        items.map(function (item) {
            return [
                '<article class="cart-mini-item" data-cart-key="' + escapeHtml(item.key) + '">',
                '  <img src="' + prefixRelativeUrl(getBasePath(), item.product.image) + '" alt="' + escapeHtml(item.product.name) + '">',
                '  <div class="cart-mini-content">',
                '    <h3>' + escapeHtml(item.product.name) + "</h3>",
                '    <p class="cart-mini-options">' + escapeHtml(formatOptionsSummary(item.options)) + "</p>",
                '    <div class="cart-mini-actions">',
                '      <div class="quantity-control" data-cart-key="' + escapeHtml(item.key) + '"><button type="button" data-action="decrease">-</button><span>' + item.quantity + '</span><button type="button" data-action="increase">+</button></div>',
                '      <strong>' + formatCurrency(item.total) + "</strong>",
                "    </div>",
                '    <button type="button" class="remove-link" data-remove-key="' + escapeHtml(item.key) + '">Remover</button>',
                "  </div>",
                "</article>"
            ].join("");
        }).join(""),
        "</div>",
        '<div class="cart-inline-total"><span>Subtotal</span><strong>' + formatCurrency(subtotal) + "</strong></div>"
    ].join("");

    bindCartControls(container);
}

function renderCartPage() {
    var container = document.getElementById("cart-page");

    if (!container) {
        return;
    }

    var items = hydrateCartItems();

    if (!items.length) {
        container.innerHTML = '<section class="catalog-hero"><p class="catalog-eyebrow">Carrinho</p><h1>Seu carrinho esta vazio</h1><p>Adicione um produto para visualizar os itens aqui.</p><a class="section-link" href="' + prefixRelativeUrl(getBasePath(), "todos_produtos.html") + '">Ir para Todos os Produtos</a></section>';
        return;
    }

    var subtotal = items.reduce(function (total, item) { return total + item.total; }, 0);

    container.innerHTML = [
        '<section class="cart-page-layout">',
        '  <div class="cart-page-header"><h1>Carrinho de compras</h1><a class="section-link" href="' + prefixRelativeUrl(getBasePath(), "todos_produtos.html") + '">Continuar comprando</a></div>',
        '  <div class="cart-page-items">',
             items.map(function (item) {
                return [
                    '<article class="cart-page-item" data-cart-key="' + escapeHtml(item.key) + '">',
                    '  <img src="' + prefixRelativeUrl(getBasePath(), item.product.image) + '" alt="' + escapeHtml(item.product.name) + '">',
                    '  <div class="cart-page-item-main"><h2>' + escapeHtml(item.product.name) + '</h2><p class="cart-page-item-options">' + escapeHtml(formatOptionsSummary(item.options)) + '</p><button type="button" class="remove-link" data-remove-key="' + escapeHtml(item.key) + '">Remover</button></div>',
                    '  <div class="cart-page-item-price"><span>Preço</span><strong>' + formatCurrency(item.product.price) + '</strong></div>',
                    '  <div class="cart-page-item-qty"><span>Quantidade</span><div class="quantity-control" data-cart-key="' + escapeHtml(item.key) + '"><button type="button" data-action="decrease">-</button><span>' + item.quantity + '</span><button type="button" data-action="increase">+</button></div></div>',
                    '  <div class="cart-page-item-total"><span>Total</span><strong>' + formatCurrency(item.total) + "</strong></div>",
                    "</article>"
                ].join("");
             }).join(""),
        "  </div>",
        '  <div class="cart-page-summary">',
        '    <div class="cart-summary-note"><label for="seller-note">Instruções especiais para o vendedor</label><textarea id="seller-note" rows="5" placeholder="Ex.: separar por comunidade, informar contato ou observações do pedido."></textarea></div>',
        '    <div class="cart-summary-box"><p>Os códigos de desconto, o frete e os impostos sao adicionados no encerramento.</p><div class="cart-summary-total"><span>Subtotal</span><strong>' + formatCurrency(subtotal) + '</strong></div><button type="button" class="submit-button checkout-button">Fechar pedido</button></div>',
        "  </div>",
        "</section>"
    ].join("");

    bindCartControls(container);
}

function bindCartControls(scope) {
    scope.querySelectorAll(".quantity-control button").forEach(function (button) {
        button.addEventListener("click", function () {
            var key = this.parentElement.dataset.cartKey;
            var action = this.dataset.action;
            changeCartQuantity(key, action === "increase" ? 1 : -1);
        });
    });

    scope.querySelectorAll("[data-remove-key]").forEach(function (button) {
        button.addEventListener("click", function () {
            removeCartItem(this.dataset.removeKey);
        });
    });
}

function changeCartQuantity(itemKey, delta) {
    var cart = getStoredCart().map(function (item) {
        if (item.key === itemKey) {
            item.quantity = Math.max(1, Number(item.quantity || 1) + delta);
        }
        return item;
    });

    saveCart(cart);
    refreshCartUi();
}

function removeCartItem(itemKey) {
    var cart = getStoredCart().filter(function (item) {
        return item.key !== itemKey;
    });

    saveCart(cart);
    refreshCartUi();
}

function refreshCartUi() {
    updateCartCount();
    renderCartDrawer();
    renderCartPage();
}

function renderAdminProductList() {
  const container = document.getElementById("admin-product-list");
  if (!container) return;
  const products = getStoredProducts().sort(compareByDate);
  if (!products.length) {
    container.innerHTML = '<p class="catalog-empty-message">Nenhum produto cadastrado.</p>';
    return;
  }
  container.innerHTML = products.map(p => `
    <div class="admin-product-row" style="display:flex;align-items:center;gap:12px;padding:10px;border-bottom:1px solid #eee;">
      <img src="${prefixRelativeUrl(getBasePath(), p.image)}" alt="${escapeHtml(p.name)}" style="width:64px;height:64px;object-fit:contain;border-radius:8px;">
      <div style="flex:1;">
        <strong>${escapeHtml(p.name)}</strong>
        <div style="font-size:0.9rem;color:#666;">${formatCurrency(p.price)} · ${escapeHtml(p.sectionLabel)}</div>
      </div>
      <div>
        <button class="btn btn-sm btn-outline-danger" onclick="confirmAndRemoveProduct('${p.id}')">Remover</button>
      </div>
    </div>
  `).join("");
}

function confirmAndRemoveProduct(productId) {
  if (!confirm("Confirmar remoção do produto? Esta ação não pode ser desfeita.")) return;
  removeProductById(productId);
}

function removeProductById(productId) {
  const products = getStoredProducts();
  const idx = products.findIndex(p => p.id === productId);
  if (idx === -1) {
    alert("Produto não encontrado.");
    return;
  }
  products.splice(idx, 1);
  saveProducts(products);
  // atualizar UI
  renderCatalogViews();
  renderAdminProductList();
  populateSalesProducts();
  updateCartCount();
  showFormMessage(document.getElementById("product-form-message"), "Produto removido com sucesso.", "success");
}

function renderProductUploadPreview(imageSources, activeIndex) {
  var preview = document.getElementById("product-image-preview");

  if (!preview) {
    return;
  }

  var images = Array.isArray(imageSources) ? imageSources.filter(Boolean) : [];
  preview.innerHTML = "";

  if (!images.length) {
    preview.innerHTML = '<p class="form-text">Selecione imagens para visualizar a galeria.</p><div id="product-image-thumbs" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"></div>';
    return;
  }

  var safeIndex = Math.min(Math.max(Number(activeIndex || 0), 0), images.length - 1);
  var mainImage = document.createElement("img");
  var thumbsContainer = document.createElement("div");

  mainImage.src = images[safeIndex];
  mainImage.alt = "Preview do produto";
  preview.appendChild(mainImage);

  thumbsContainer.id = "product-image-thumbs";
  thumbsContainer.style.display = "flex";
  thumbsContainer.style.gap = "8px";
  thumbsContainer.style.flexWrap = "wrap";
  thumbsContainer.style.marginTop = "12px";

  images.forEach(function (src, index) {
    var button = document.createElement("button");
    var thumb = document.createElement("img");

    button.type = "button";
    button.style.width = "84px";
    button.style.height = "84px";
    button.style.border = index === safeIndex ? "2px solid #8b5e3c" : "1px solid #ddd";
    button.style.borderRadius = "12px";
    button.style.overflow = "hidden";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.background = "#fff";
    button.style.padding = "4px";
    button.setAttribute("aria-label", "Visualizar imagem " + (index + 1));
    button.addEventListener("click", function () {
      renderProductUploadPreview(images, index);
    });

    thumb.src = src;
    thumb.alt = "Miniatura " + (index + 1);
    thumb.style.maxWidth = "100%";
    thumb.style.maxHeight = "100%";
    thumb.style.objectFit = "contain";
    button.appendChild(thumb);

    thumbsContainer.appendChild(button);
  });

  preview.appendChild(thumbsContainer);
}

function setupProductForm() {
  var form = document.getElementById("product-registration-form");
  var imageInput = document.getElementById("product-image");
  var sectionSelect = document.getElementById("product-section");
  var messageBox = document.getElementById("product-form-message");
  var uploadedImagesData = [];

  if (!form) {
    return;
  }

  if (sectionSelect) {
    populateSectionOptions(sectionSelect);
    updateSectionDestination();
    sectionSelect.addEventListener("change", function () {
      updateSectionDestination();
      markMissingProductFields();
    });
  }

  ["product-name", "product-price"].forEach(function (fieldId) {
    var field = document.getElementById(fieldId);

    if (!field) {
      return;
    }

    field.addEventListener("input", markMissingProductFields);
    field.addEventListener("blur", markMissingProductFields);
  });

  renderProductUploadPreview([]);

  if (imageInput) {
    imageInput.addEventListener("change", async function (event) {
      var files = Array.from(event.target.files || []).slice(0, 6);
      var nextImages = [];

      for (var index = 0; index < files.length; index += 1) {
        var file = files[index];

        if (file.size && file.size > 800 * 1024) {
          console.warn("Imagem ignorada por tamanho excedido:", file.name);
          continue;
        }

        try {
          nextImages.push(await readFileAsDataURL(file));
        } catch (error) {
          console.error("Erro lendo arquivo", file.name, error);
        }
      }

      uploadedImagesData = nextImages;

      if (!uploadedImagesData.length) {
        imageInput.value = "";
      }

      renderProductUploadPreview(uploadedImagesData, 0);
      markMissingProductFields();
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var missingFields = getMissingProductFields();
    var name = document.getElementById("product-name").value.trim();
    var sectionKey = document.getElementById("product-section").value;
    var price = Number(document.getElementById("product-price").value || 0);
    var description = document.getElementById("product-description").value.trim();

    if (missingFields.length) {
      markMissingProductFields();
      showFormMessage(messageBox, "Preencha os campos obrigatorios: " + missingFields.join(", ") + ".", "error");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      markMissingProductFields();
      showFormMessage(messageBox, "Informe um preco valido maior que zero.", "error");
      return;
    }

    var product = normalizeProduct({
      id: createProductId(),
      name: name,
      images: uploadedImagesData.slice(),
      image: uploadedImagesData[0],
      sectionKey: sectionKey,
      price: price,
      salesCount: 0,
      createdAt: new Date().toISOString(),
      description: description
    });

    var products = getStoredProducts();
    products.push(product);
    saveProducts(products);

    form.reset();
    uploadedImagesData = [];
    renderProductUploadPreview([]);
    markMissingProductFields();
    updateSectionDestination();
    renderCatalogViews();
    populateSalesProducts();
    renderAdminProductList();

    showFormMessage(
      messageBox,
      'Produto cadastrado com sucesso. Ele ja aparece na seção escolhida e em <a href="' + prefixRelativeUrl(getBasePath(), "todos_produtos.html") + '">Todos os Produtos</a>.',
      "success"
    );
  });
}

function updateImagePreview(event) {
  var files = Array.from((event.target && event.target.files) || []);

  if (!files.length) {
    resetImagePreview();
    return;
  }

  Promise.all(files.map(readFileAsDataURL)).then(function (dataUrls) {
    renderProductUploadPreview(dataUrls, 0);
  });
}

function resetImagePreview() {
  renderProductUploadPreview([]);
}

function normalizeCatalogSortValue(value) {
  var normalizedValue = String(value || "destaque").trim().toLowerCase();

  if (normalizedValue === "menor-preço") {
    return "menor-preco";
  }

  if (normalizedValue === "maior-preço") {
    return "maior-preco";
  }

  return normalizedValue || "destaque";
}

function getCatalogSortValue() {
  var params = new URLSearchParams(window.location.search);
  return normalizeCatalogSortValue(params.get("ordem") || "destaque");
}

function updateCatalogUrlState(searchTerm, sortValue) {
  var url = new URL(window.location.href);
  var normalizedSearch = String(searchTerm || "").trim();
  var normalizedSort = normalizeCatalogSortValue(sortValue || "destaque");

  if (normalizedSearch) {
    url.searchParams.set("busca", normalizedSearch);
  } else {
    url.searchParams.delete("busca");
  }

  if (normalizedSort && normalizedSort !== "destaque") {
    url.searchParams.set("ordem", normalizedSort);
  } else {
    url.searchParams.delete("ordem");
  }

  window.history.replaceState({}, "", url.toString());
}

function applyCatalogFilters(products) {
  var filteredProducts = products.slice();
  var searchTerm = normalizeSearchText(getCatalogSearchValue());
  var sortValue = getCatalogSortValue();

  if (searchTerm) {
    filteredProducts = filteredProducts.filter(function (product) {
      var haystack = normalizeSearchText([
        product.name,
        product.sectionLabel,
        product.description
      ].join(" "));

      return haystack.indexOf(searchTerm) !== -1;
    });
  }

  if (sortValue === "mais-vendidos") {
    return filteredProducts.sort(compareBySales);
  }

  if (sortValue === "az") {
    return filteredProducts.sort(compareAlphabeticalAsc);
  }

  if (sortValue === "za") {
    return filteredProducts.sort(compareAlphabeticalDesc);
  }

  if (sortValue === "menor-preco") {
    return filteredProducts.sort(comparePriceAsc);
  }

  if (sortValue === "maior-preco") {
    return filteredProducts.sort(comparePriceDesc);
  }

  return filteredProducts.sort(compareByFeatured);
}

function logout() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
  renderAuthNav();
  applySupplierOnlyVisibility();
  enforceProductAccess();
}

function setupLoginForm() {
  var form = document.getElementById("login-form");
  var feedback = document.getElementById("login-message");

  if (!form) {
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var loginValue = document.getElementById("login-identifier").value.trim().toLowerCase();
    var password = document.getElementById("login-password").value;
    var account = getStoredAccounts().find(function (item) {
      return (String(item.email || "").toLowerCase() === loginValue || String(item.displayName || "").toLowerCase() === loginValue) && item.password === password;
    });

    if (!account) {
      showFormMessage(feedback, "NÃ£o encontramos uma conta com esses dados.", "error");
      return;
    }

    saveSession({
      id: account.id,
      role: account.role,
      fullName: account.fullName,
      email: account.email,
      displayName: account.displayName
    });
    renderAuthNav();
    applySupplierOnlyVisibility();

    showFormMessage(feedback, "Login realizado com sucesso. Redirecionando...", "success");
    window.setTimeout(function () {
      window.location.href = prefixRelativeUrl(getBasePath(), account.role === "fornecedor" ? "cadastro_produtos.html" : "index.html");
    }, 700);
  });
}

function setupRegistrationForm() {
  var form = document.getElementById("registration-form");
  var roleField = document.getElementById("register-role");
  var feedback = document.getElementById("register-message");

  if (!form) {
    return;
  }

  if (roleField) {
    roleField.addEventListener("change", updateRoleFields);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var role = document.getElementById("register-role").value;
    var fullName = document.getElementById("register-name").value.trim();
    var displayName = document.getElementById("register-display-name").value.trim();
    var email = document.getElementById("register-email").value.trim().toLowerCase();
    var phone = document.getElementById("register-phone").value.trim();
    var password = document.getElementById("register-password").value;
    var confirmPassword = document.getElementById("register-password-confirm").value;
    var roleRequiredFields = getRoleRequiredFields(role);
    var missingFields = roleRequiredFields.filter(function (field) {
      var input = document.getElementById(field.id);
      return !input || !String(input.value || "").trim();
    });

    if (!role || !fullName || !displayName || !email || !phone || !password || !confirmPassword || missingFields.length) {
      var labels = ["Tipo de conta", "Nome completo", "Como deseja ser identificado", "E-mail", "Telefone", "Senha", "Confirmacao de senha"]
        .concat(missingFields.map(function (field) { return field.label; }));
      showFormMessage(feedback, "Complete os campos obrigatorios: " + labels.join(", ") + ".", "error");
      return;
    }

    if (password.length < 6) {
      showFormMessage(feedback, "A senha deve ter pelo menos 6 caracteres.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showFormMessage(feedback, "A confirmaÃ§Ã£o da senha nÃ£o confere.", "error");
      return;
    }

    var accounts = getStoredAccounts();
    var emailExists = accounts.some(function (account) {
      return String(account.email || "").toLowerCase() === email;
    });

    if (emailExists) {
      showFormMessage(feedback, "JÃ¡ existe uma conta cadastrada com esse e-mail.", "error");
      return;
    }

    var account = {
      id: "conta-" + Date.now(),
      role: role,
      fullName: fullName,
      displayName: displayName,
      email: email,
      phone: phone,
      password: password,
      document: document.getElementById(role === "fornecedor" ? "register-cnpj" : "register-cpf").value.trim(),
      city: role === "cliente" ? document.getElementById("register-city").value.trim() : "",
      businessName: role === "fornecedor" ? document.getElementById("register-business-name").value.trim() : "",
      productCategory: role === "fornecedor" ? document.getElementById("register-product-category").value.trim() : "",
      createdAt: new Date().toISOString()
    };

    accounts.push(account);
    saveAccounts(accounts);
    saveSession({
      id: account.id,
      role: account.role,
      fullName: account.fullName,
      email: account.email,
      displayName: account.displayName
    });
    renderAuthNav();
    applySupplierOnlyVisibility();

    form.reset();
    updateRoleFields();
    showFormMessage(
      feedback,
      role === "fornecedor"
        ? "Conta de fornecedor criada com sucesso. Você já pode cadastrar produtos."
        : "Conta de cliente criada com sucesso. Seu acesso está liberado para compras.",
      "success"
    );
  });
}

function renderProductPage() {
  var container = document.getElementById("product-detail-page");

  if (!container) {
    return;
  }

  var params = new URLSearchParams(window.location.search);
  var productId = params.get("id");
  var product = productId ? getProductById(productId) : null;

  if (!product) {
    document.title = "Produto nÃ£o encontrado";
    container.innerHTML = [
      '<div class="catalog-hero">',
      '<p class="catalog-eyebrow">Produto nÃ£o encontrado</p>',
      '<h1>Este item nÃ£o foi localizado</h1>',
      '<p>Volte ao catÃ¡logo geral para continuar comprando.</p>',
      '<a class="section-link" href="' + prefixRelativeUrl(getBasePath(), "todos_produtos.html") + '">Ir para Todos os Produtos</a>',
      "</div>"
    ].join("");
    return;
  }

  var sectionConfig = PRODUCT_SECTIONS[product.sectionKey] || PRODUCT_SECTIONS.ressuscitou;
  var optionProfile = getOptionProfile(product);
  var galleryImages = product.images && product.images.length ? product.images : [product.image];
  document.title = product.name;

  container.innerHTML = [
    '<div class="product-layout">',
    '  <div class="product-gallery">',
    '    <div class="product-main-image"><img id="product-main-image" src="' + prefixRelativeUrl(getBasePath(), galleryImages[0]) + '" alt="' + escapeHtml(product.name) + '"></div>',
    '    <div class="product-thumb-row">' + galleryImages.map(function (image, index) {
      return '<button type="button" class="product-thumb' + (index === 0 ? ' is-active' : '') + '" data-product-image="' + escapeHtml(image) + '"><img src="' + prefixRelativeUrl(getBasePath(), image) + '" alt="' + escapeHtml(product.name + " - imagem " + (index + 1)) + '"></button>';
    }).join("") + '</div>',
    "  </div>",
    '  <div class="product-summary">',
    '    <p class="catalog-eyebrow">Produto cadastrado</p>',
    '    <h1>' + escapeHtml(product.name) + "</h1>",
    '    <p class="product-subtitle">' + escapeHtml(sectionConfig.label) + "</p>",
    '    <div class="product-price">' + formatCurrency(product.price) + "</div>",
    '    <form id="product-purchase-form" class="product-purchase-form">',
         buildProductOptionFields(optionProfile),
    '      <label class="form-field"><span>Quantidade</span><input type="number" id="product-quantity" min="1" step="1" value="1"></label>',
    '      <button type="submit" class="product-add-button">Adicionar ao carrinho</button>',
    "    </form>",
    '    <div class="product-description"><h3>Sobre este produto</h3><p>' + escapeHtml(product.description) + "</p></div>",
    '    <a class="section-link" href="' + prefixRelativeUrl(getBasePath(), sectionConfig.page) + '">Ver outros itens desta seÃ§Ã£o</a>',
    "  </div>",
    "</div>"
  ].join("");

  var form = document.getElementById("product-purchase-form");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var quantity = Number(document.getElementById("product-quantity").value || 1);
      var selectedOptions = {};

      optionProfile.forEach(function (field) {
        var select = document.getElementById("option-" + field.key);
        if (select) {
          selectedOptions[field.label] = select.value;
        }
      });

      addProductToCart(product.id, quantity, selectedOptions);
    });
  }

  container.querySelectorAll("[data-product-image]").forEach(function (button) {
    button.addEventListener("click", function () {
      var mainImage = document.getElementById("product-main-image");
      var nextImage = this.dataset.productImage;

      if (!mainImage || !nextImage) {
        return;
      }

      mainImage.src = prefixRelativeUrl(getBasePath(), nextImage);

      container.querySelectorAll("[data-product-image]").forEach(function (thumb) {
        thumb.classList.toggle("is-active", thumb === button);
        thumb.style.borderColor = thumb === button ? "#8b5e3c" : "#e3d7cf";
        thumb.style.boxShadow = thumb === button ? "0 0 0 3px rgba(139, 94, 60, 0.12)" : "none";
      });
    });
  });
}
