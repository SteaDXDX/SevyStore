// ==================== SEVY STORE (CLIENT) ====================
const DEFAULT_WHATSAPP = '2250777181502';
const TIKTOK_URL =
  'https://www.tiktok.com/@sevy_store?_r=1&_d=ee1039h9klhhah&sec_uid=MS4wLjABAAAAlqfQCeqno-EaL2H-zdGMvBJCHO6cCPttrVmkNUkQj6Y93-wwH260XSfpfuE9ss1C&share_author_id=7547269570928100408&sharer_language=fr&source=h5_m&u_code=em91c5dfh40170&timestamp=1775700813&user_id=7547269570928100408&sec_user_id=MS4wLjABAAAAlqfQCeqno-EaL2H-zdGMvBJCHO6cCPttrVmkNUkQj6Y93-wwH260XSfpfuE9ss1C&item_author_type=1&utm_source=whatsapp&utm_campaign=client_share&utm_medium=android&share_iid=7626564589090785045&share_link_id=8259fefd-cf5a-4352-ac40-8960a7f64239&share_app_id=1233&ugbiz_name=ACCOUNT&ug_btm=b8727%2Cb7360&social_share_type=5&enable_checksum=1';

const STORAGE_KEYS = {
  products: 'sevyProducts',
  productsUpdated: 'sevyProductsUpdated',
  orders: 'sevyOrders',
  whatsapp: 'sevyWhatsAppNumber',
  cart: 'sevyCart',
  favorites: 'sevyFavorites',
};

const PAGE_SIZE = 10;

let allProducts = [];
let filteredProducts = [];
let visibleCount = PAGE_SIZE;
let selectedCategory = 'all';
let selectedProductId = null;
let modalQuantity = 1;
let selectedSize = '';
let selectedColor = '';

let cart = [];
let favorites = new Set();

function $(id) {
  return document.getElementById(id);
}

function safeJsonParse(value, fallback) {
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function formatPrice(amount) {
  return `${new Intl.NumberFormat('fr-FR').format(Number(amount) || 0)} FCFA`;
}

function categoryLabel(category) {
  if (category === 'homme') return 'Homme';
  if (category === 'femme') return 'Femme';
  if (category === 'mixte') return 'Mixte';
  return 'Autre';
}

function getDefaultProducts() {
  return [
    {
      id: 1,
      name: 'New Balance 530 White/Pink',
      price: 20000,
      category: 'femme',
      image: 'assets/WhatsApp Image 2026-03-31 at 11.05.44.jpeg',
      description:
        'Sneakers New Balance 530 en blanc et rose. Style rétro running avec mesh respirant et détails métallisés. Confort exceptionnel pour le quotidien.',
      sizes: ['36', '37', '38', '39', '40', '41'],
      colors: ['blanc/rose'],
      inStock: true,
    },
    {
      id: 2,
      name: 'Vans Old Skool Black/White',
      price: 17000,
      category: 'mixte',
      image: 'assets/WhatsApp Image 2026-03-31 at 11.05.45.jpeg',
      description:
        "Classic Vans Old Skool noire et blanche. Icone du skate depuis 1977. Toile et daim avec la célèbre bande jazz côté. Style intemporel.",
      sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44'],
      colors: ['noir/blanc'],
      inStock: true,
    },
    {
      id: 3,
      name: 'Nike Air Max 1 Brown/White',
      price: 18000,
      category: 'homme',
      image: 'assets/WhatsApp Image 2026-03-31 at 11.05.45 (1).jpeg',
      description:
        "Nike Air Max 1 marron et blanche. La légende du Air Max. Cuir premium avec unité Air visible. Élégance et confort réunis.",
      sizes: ['40', '41', '42', '43', '44', '45'],
      colors: ['marron/blanc'],
      inStock: true,
    },
    {
      id: 4,
      name: 'Nike Air Max Plus TN Black/Chrome',
      price: 25000,
      category: 'homme',
      image: 'assets/WhatsApp Image 2026-03-31 at 11.05.46.jpeg',
      description:
        'Nike Air Max Plus TN noire chrome. Design agressif avec cages TPU métallisées. Amorti Tuned Air pour un confort maximal. Style urbain bold.',
      sizes: ['40', '41', '42', '43', '44', '45'],
      colors: ['noir/chrome'],
      inStock: true,
    },
    {
      id: 5,
      name: 'Nike Nocta Hot Step Air Terra Black',
      price: 25000,
      category: 'homme',
      image: 'assets/WhatsApp Image 2026-03-31 at 11.05.46 (1).jpeg',
      description:
        'Nike x Drake Nocta Hot Step Air Terra noire. Collaboration premium avec cuir matelassé et détails réfléchissants. Édition limitée, style unique.',
      sizes: ['40', '41', '42', '43', '44', '45'],
      colors: ['noir/argent'],
      inStock: true,
    },
    {
      id: 6,
      name: 'Nike Shox TL Black/Racer Blue',
      price: 19000,
      category: 'homme',
      image: 'assets/WhatsApp Image 2026-03-31 at 11.05.46 (2).jpeg',
      description:
        'Nike Shox TL noire et bleu électrique. Technologie Shox emblématique avec colonnes amortissantes. Look futuriste et agressif des années 2000.',
      sizes: ['40', '41', '42', '43', '44', '45'],
      colors: ['noir/bleu'],
      inStock: true,
    },
    {
      id: 7,
      name: 'Nike Shox TL Wolf Grey/Silver',
      price: 19000,
      category: 'mixte',
      image: 'assets/WhatsApp Image 2026-03-31 at 11.05.46 (3).jpeg',
      description:
        'Nike Shox TL gris loup et argent. Version élégante de la Shox TL. Technologie de pointe avec style minimaliste et moderne.',
      sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44'],
      colors: ['gris/argent'],
      inStock: true,
    },
    {
      id: 8,
      name: 'Asics Gel-Kayano 14 White/Green',
      price: 18000,
      category: 'mixte',
      image: 'assets/azer.jpeg',
      description:
        'Asics Gel-Kayano 14 blanche et verte. Design années 2000 revisité avec technologie GEL. Confort de running dans un style lifestyle tendance.',
      sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44'],
      colors: ['blanc/vert'],
      inStock: true,
    },
    {
      id: 9,
      name: 'Nike Air Force 1 White Rope Laces',
      price: 18000,
      category: 'femme',
      image: 'assets/qsdf.jpeg',
      description:
        'Nike Air Force 1 blanche avec lacets corde violet. Classic AF1 personnalisé avec lacets épais style corde. Look unique et tendance.',
      sizes: ['36', '37', '38', '39', '40', '41'],
      colors: ['blanc/violet'],
      inStock: true,
    },
  ];
}

function getWhatsAppNumber() {
  const raw = localStorage.getItem(STORAGE_KEYS.whatsapp);
  return (raw && raw.trim()) || DEFAULT_WHATSAPP;
}

function loadProducts() {
  const existing = safeJsonParse(localStorage.getItem(STORAGE_KEYS.products), null);
  if (Array.isArray(existing) && existing.length > 0) {
    allProducts = existing;
    return;
  }
  allProducts = getDefaultProducts();
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(allProducts));
  localStorage.setItem(STORAGE_KEYS.productsUpdated, Date.now().toString());
}

function loadCart() {
  const existing = safeJsonParse(localStorage.getItem(STORAGE_KEYS.cart), []);
  cart = Array.isArray(existing) ? existing : [];
}

function saveCart() {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
  updateCartCount();
}

function loadFavorites() {
  const existing = safeJsonParse(localStorage.getItem(STORAGE_KEYS.favorites), []);
  favorites = new Set(Array.isArray(existing) ? existing : []);
}

function saveFavorites() {
  localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(Array.from(favorites)));
}

function updateCartCount() {
  const badge = $('cart-count-nav');
  if (!badge) return;
  const count = cart.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
  badge.textContent = String(count);
  badge.classList.remove('cart-count');
  // trigger animation
  void badge.offsetWidth;
  badge.classList.add('cart-count');
}

function applyFilters() {
  const searchDesktop = ($('search-input')?.value || '').trim();
  const searchMobile = ($('mobile-search-input')?.value || '').trim();
  const query = (searchMobile || searchDesktop).toLowerCase();

  filteredProducts = allProducts.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesQuery =
      !query ||
      String(p.name || '').toLowerCase().includes(query) ||
      String(p.description || '').toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  const sortValue = $('sort-select')?.value || 'default';
  if (sortValue === 'price-low') filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
  else if (sortValue === 'price-high') filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
  else if (sortValue === 'name') filteredProducts.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'fr'));

  visibleCount = PAGE_SIZE;
}

function renderProducts() {
  const grid = $('products-grid');
  if (!grid) return;

  const slice = filteredProducts.slice(0, visibleCount);
  if (filteredProducts.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full bg-white border border-gray-100 rounded-3xl p-8 text-center">
        <div class="text-4xl mb-3 text-gray-300"><i class="fas fa-search"></i></div>
        <div class="text-lg font-bold text-gray-900">Aucun produit trouvé</div>
        <div class="text-sm text-gray-500 mt-1">Essaie une autre recherche ou réinitialise les filtres.</div>
        <div class="mt-5">
          <button type="button" onclick="resetFilters()" class="px-6 py-3 rounded-2xl bg-[#8b1e2f] text-white font-semibold hover:bg-[#6f1826]">
            Réinitialiser
          </button>
        </div>
      </div>
    `;
    const results = $('results-count');
    if (results) results.textContent = `0 produit(s)`;
    const loadMoreBtn = $('load-more-btn');
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    return;
  }
  grid.innerHTML = slice
    .map((p) => {
      const fav = favorites.has(p.id);
      return `
        <div class="product-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer" data-product-id="${p.id}">
          <div class="product-image-container relative bg-gray-100">
            <img src="${p.image}" alt="${String(p.name || '').replaceAll('"', '&quot;')}" loading="lazy" decoding="async" class="w-full h-40 sm:h-48 object-cover">
            <button type="button" data-action="toggle-favorite" class="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-lg ${fav ? 'text-[#8b1e2f]' : 'text-gray-700'}" title="Favoris">
              ${fav ? '♥' : '♡'}
            </button>
          </div>
          <div class="p-3">
            <div class="text-[11px] text-gray-500 mb-1">${categoryLabel(p.category)}</div>
            <div class="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 min-h-[2.5rem]">${p.name}</div>
            <div class="mt-2 flex items-center justify-between gap-2">
              <div class="font-extrabold text-[#8b1e2f]">${formatPrice(p.price)}</div>
              <button type="button" data-action="add-to-cart" class="w-10 h-10 rounded-md bg-[#8b1e2f] text-white flex items-center justify-center hover:bg-[#6f1826]" title="Ajouter au panier">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  const results = $('results-count');
  if (results) results.textContent = `${filteredProducts.length} produit(s)`;

  const loadMoreBtn = $('load-more-btn');
  if (loadMoreBtn) loadMoreBtn.style.display = filteredProducts.length > visibleCount ? '' : 'none';
}

function resetFilters() {
  selectedCategory = 'all';
  if ($('search-input')) $('search-input').value = '';
  if ($('mobile-search-input')) $('mobile-search-input').value = '';
  document.querySelectorAll('.category-btn').forEach((btn) => {
    const btnCat = btn.getAttribute('data-category') || '';
    btn.classList.toggle('active', btnCat === 'all');
  });
  applyFilters();
  renderProducts();
}

function getProductById(id) {
  return allProducts.find((p) => p.id === id) || null;
}

function addToCart(productId, quantity, size, color) {
  const product = getProductById(productId);
  if (!product) return;

  const qty = Math.max(1, Number(quantity) || 1);
  const fallbackSize = Array.isArray(product.sizes) && product.sizes.length > 0 ? String(product.sizes[0]) : '—';
  const fallbackColor = Array.isArray(product.colors) && product.colors.length > 0 ? String(product.colors[0]) : '—';
  const itemSize = String(size || '').trim() || fallbackSize;
  const itemColor = String(color || '').trim() || fallbackColor;

  const existingIndex = cart.findIndex(
    (it) => it.productId === productId && it.size === itemSize && it.color === itemColor,
  );
  if (existingIndex >= 0) cart[existingIndex].quantity += qty;
  else cart.push({ productId, quantity: qty, size: itemSize, color: itemColor });

  saveCart();
  showToast('Ajouté au panier ✅');
}

function toggleFavorite(productId) {
  if (favorites.has(productId)) favorites.delete(productId);
  else favorites.add(productId);
  saveFavorites();
  renderProducts();
  if (!$('product-modal')?.classList.contains('hidden')) syncProductModalFavorite();
}

function renderFavorites() {
  const content = $('favorites-content');
  const empty = $('empty-favorites');
  if (!content || !empty) return;

  const favProducts = Array.from(favorites)
    .map((id) => getProductById(id))
    .filter(Boolean);

  if (favProducts.length === 0) {
    empty.classList.remove('hidden');
    content.innerHTML = '';
    return;
  }

  empty.classList.add('hidden');
  content.innerHTML = favProducts
    .map((p) => {
      return `
        <div class="flex gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-gray-50">
          <img src="${p.image}" alt="${String(p.name || '').replaceAll('"', '&quot;')}" class="w-20 h-20 rounded-xl object-cover bg-gray-100">
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-gray-900 truncate">${p.name}</div>
            <div class="text-sm text-gray-500">${categoryLabel(p.category)}</div>
              <div class="mt-2 flex items-center justify-between gap-2">
                <div class="font-extrabold text-[#8b1e2f]">${formatPrice(p.price)}</div>
                <div class="flex gap-2">
                <button type="button" onclick="addToCart(${p.id}, 1)" class="px-3 py-2 rounded-xl bg-[#8b1e2f] text-white text-sm font-semibold hover:bg-[#6f1826]">
                  <i class="fas fa-shopping-bag mr-1"></i> Panier
                </button>
                <button type="button" onclick="toggleFavorite(${p.id})" class="px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold hover:border-[#8b1e2f] hover:text-[#8b1e2f]">
                  Retirer
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join('');
}

function renderCart() {
  const content = $('cart-content');
  if (!content) return;

  if (cart.length === 0) {
    content.innerHTML = `
      <div class="text-center py-10 text-gray-500">
        <i class="fas fa-shopping-bag text-4xl text-gray-300 mb-3"></i>
        <p class="font-medium">Votre panier est vide</p>
        <p class="text-sm text-gray-400 mt-1">Ajoutez des articles pour commander</p>
      </div>
    `;
    $('cart-subtotal') && ($('cart-subtotal').textContent = formatPrice(0));
    $('cart-total') && ($('cart-total').textContent = formatPrice(0));
    return;
  }

  const lines = cart
    .map((item, index) => {
      const p = getProductById(item.productId);
      if (!p) return null;
      const qty = Math.max(1, Number(item.quantity) || 1);
      const lineTotal = (Number(p.price) || 0) * qty;
      return `
        <div class="flex gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-gray-50">
          <img src="${p.image}" alt="${String(p.name || '').replaceAll('"', '&quot;')}" class="w-20 h-20 rounded-xl object-cover bg-gray-100">
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="font-semibold text-gray-900 truncate">${p.name}</div>
                <div class="text-xs text-gray-500 mt-0.5">Taille: ${item.size || '—'} • Couleur: ${item.color || '—'}</div>
              </div>
              <button type="button" onclick="removeCartItem(${index})" class="w-10 h-10 rounded-xl border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600" title="Supprimer">
                <i class="fas fa-trash"></i>
              </button>
            </div>
            <div class="mt-3 flex items-center justify-between">
              <div class="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                <button type="button" onclick="changeCartItemQty(${index}, -1)" class="px-4 py-2 font-semibold hover:bg-gray-100">-</button>
                <span class="px-4 font-bold">${qty}</span>
                <button type="button" onclick="changeCartItemQty(${index}, 1)" class="px-4 py-2 font-semibold hover:bg-gray-100">+</button>
              </div>
              <div class="font-extrabold text-[#8b1e2f]">${formatPrice(lineTotal)}</div>
            </div>
          </div>
        </div>
      `;
    })
    .filter(Boolean);

  content.innerHTML = lines.join('');

  const subtotal = cart.reduce((acc, item) => {
    const p = getProductById(item.productId);
    if (!p) return acc;
    return acc + (Number(p.price) || 0) * Math.max(1, Number(item.quantity) || 1);
  }, 0);

  $('cart-subtotal') && ($('cart-subtotal').textContent = formatPrice(subtotal));
  $('cart-total') && ($('cart-total').textContent = formatPrice(subtotal));
}

function removeCartItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function changeCartItemQty(index, delta) {
  const item = cart[index];
  if (!item) return;
  const next = Math.max(1, (Number(item.quantity) || 1) + (Number(delta) || 0));
  item.quantity = next;
  saveCart();
  renderCart();
}

function showToast(message, type = 'success') {
  const container = $('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast px-4 py-3 rounded-xl shadow-lg text-sm font-semibold ${
    type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'
  }`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

// ==================== GLOBAL FUNCTIONS (used by HTML) ====================
function navigateToSection(id) {
  if (id === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function backToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openMobileMenu() {
  $('mobile-menu')?.classList.add('open');
  $('mobile-overlay')?.classList.remove('hidden');
}

function closeMobileMenu() {
  $('mobile-menu')?.classList.remove('open');
  $('mobile-overlay')?.classList.add('hidden');
}

function filterByCategory(category) {
  selectedCategory = category || 'all';
  document.querySelectorAll('.category-btn').forEach((btn) => {
    const btnCat = btn.getAttribute('data-category') || '';
    btn.classList.toggle('active', btnCat === selectedCategory);
  });
  filterProducts();
  navigateToSection('shop');
}

function filterProducts() {
  const q = (($('mobile-search-input')?.value || $('search-input')?.value || '').trim());
  if ($('search-input')) $('search-input').value = q;
  if ($('mobile-search-input')) $('mobile-search-input').value = q;
  applyFilters();
  renderProducts();
}

function sortProducts() {
  applyFilters();
  renderProducts();
}

function loadMoreProducts() {
  visibleCount += PAGE_SIZE;
  renderProducts();
}

function showFavorites() {
  renderFavorites();
  $('favorites-modal')?.classList.remove('hidden');
}

function hideFavorites() {
  $('favorites-modal')?.classList.add('hidden');
}

function showCart() {
  renderCart();
  $('cart-modal')?.classList.remove('hidden');
}

function hideCart() {
  $('cart-modal')?.classList.add('hidden');
}

function openProductModal(productId) {
  const p = getProductById(productId);
  if (!p) return;

  selectedProductId = productId;
  modalQuantity = 1;
  $('modal-quantity') && ($('modal-quantity').textContent = String(modalQuantity));

  $('modal-product-image') && ($('modal-product-image').src = p.image);
  $('modal-product-name') && ($('modal-product-name').textContent = p.name);
  $('modal-product-price') && ($('modal-product-price').textContent = formatPrice(p.price));
  $('modal-product-description') && ($('modal-product-description').textContent = p.description || '');
  $('modal-product-category') && ($('modal-product-category').textContent = categoryLabel(p.category));

  renderModalOptions(p);

  syncProductModalFavorite();
  $('product-modal')?.classList.remove('hidden');
}

function closeProductModal() {
  $('product-modal')?.classList.add('hidden');
  selectedProductId = null;
}

function syncProductModalFavorite() {
  const btn = $('modal-favorite-btn');
  if (!btn || selectedProductId == null) return;
  const fav = favorites.has(selectedProductId);
  btn.textContent = fav ? '♥' : '♡';
  btn.classList.toggle('text-[#8b1e2f]', fav);
  btn.classList.toggle('border-[#8b1e2f]', fav);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderModalOptions(product) {
  const sizes = Array.isArray(product.sizes) ? product.sizes.map((s) => String(s)) : [];
  const colors = Array.isArray(product.colors) ? product.colors.map((c) => String(c)) : [];

  const sizeBlock = $('modal-size-block');
  const colorBlock = $('modal-color-block');
  const sizesEl = $('modal-sizes');
  const colorsEl = $('modal-colors');

  if (sizesEl && sizeBlock) {
    if (sizes.length === 0) {
      sizeBlock.classList.add('hidden');
    } else {
      sizeBlock.classList.remove('hidden');
      selectedSize = sizes.includes(selectedSize) ? selectedSize : sizes[0];
      sizesEl.innerHTML = sizes
        .map(
          (s) =>
            `<button type="button" class="size-btn px-4 h-12 rounded-xl border-2 border-gray-200 font-semibold ${s === selectedSize ? 'active' : ''}" data-size="${escapeHtml(s)}">${escapeHtml(s)}</button>`,
        )
        .join('');
    }
  }

  if (colorsEl && colorBlock) {
    if (colors.length === 0) {
      colorBlock.classList.add('hidden');
    } else {
      colorBlock.classList.remove('hidden');
      selectedColor = colors.includes(selectedColor) ? selectedColor : colors[0];
      colorsEl.innerHTML = colors
        .map(
          (c) =>
            `<button type="button" class="size-btn px-4 h-12 rounded-xl border-2 border-gray-200 font-semibold ${c === selectedColor ? 'active' : ''}" data-color="${escapeHtml(c)}">${escapeHtml(c)}</button>`,
        )
        .join('');
    }
  }
}

function selectSize(size) {
  selectedSize = String(size || '').trim() || selectedSize;
  $('modal-sizes')
    ?.querySelectorAll('[data-size]')
    .forEach((b) => b.classList.toggle('active', b.getAttribute('data-size') === selectedSize));
}

function selectColor(color) {
  selectedColor = String(color || '').trim() || selectedColor;
  $('modal-colors')
    ?.querySelectorAll('[data-color]')
    .forEach((b) => b.classList.toggle('active', b.getAttribute('data-color') === selectedColor));
}

function changeModalQuantity(delta) {
  modalQuantity = Math.max(1, modalQuantity + (Number(delta) || 0));
  $('modal-quantity') && ($('modal-quantity').textContent = String(modalQuantity));
}

function addToCartFromModal() {
  if (selectedProductId == null) return;
  addToCart(selectedProductId, modalQuantity, selectedSize, selectedColor);
}

function toggleFavoriteFromModal() {
  if (selectedProductId == null) return;
  toggleFavorite(selectedProductId);
  syncProductModalFavorite();
}

function proceedToWhatsApp() {
  if (cart.length === 0) {
    showToast('Votre panier est vide.', 'error');
    return;
  }

  const whatsapp = getWhatsAppNumber();
  const now = new Date();
  const dateStr = now.toLocaleString('fr-FR');

  const orderItems = cart
    .map((item) => {
      const p = getProductById(item.productId);
      if (!p) return null;
      return {
        name: p.name,
        quantity: Math.max(1, Number(item.quantity) || 1),
        price: Number(p.price) || 0,
        size: item.size || '—',
        color: item.color || '—',
      };
    })
    .filter(Boolean);

  const total = orderItems.reduce((acc, it) => acc + it.price * it.quantity, 0);

  const textLines = [
    'Bonjour Sevy Store, je souhaite commander :',
    '',
    ...orderItems.map((it) => `• ${it.name} (x${it.quantity}) — Taille: ${it.size} — Couleur: ${it.color}`),
    '',
    `Total: ${formatPrice(total)}`,
    '',
    `Réf: ${Date.now().toString().slice(-6)} — ${dateStr}`,
  ];
  const url = `https://wa.me/${encodeURIComponent(whatsapp)}?text=${encodeURIComponent(textLines.join('\n'))}`;

  // Save order for admin page
  const existingOrders = safeJsonParse(localStorage.getItem(STORAGE_KEYS.orders), []);
  const orders = Array.isArray(existingOrders) ? existingOrders : [];
  orders.unshift({
    id: Date.now(),
    date: dateStr,
    items: orderItems.map((it) => ({ name: it.name, quantity: it.quantity, price: it.price })),
    total,
    status: 'En attente',
  });
  localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));

  cart = [];
  saveCart();
  renderCart();

  window.open(url, '_blank');
  showToast('Redirection vers WhatsApp…');
}

function handleNewsletterSubmit(e) {
  e.preventDefault();
  const phone = ($('newsletter-phone')?.value || '').trim();
  if (!phone) {
    showToast('Entrez un numéro de téléphone.', 'error');
    return;
  }
  $('newsletter-phone').value = '';
  showToast('Merci ! Vous êtes inscrit(e) ✅');
}

function handleFooterNewsletter(e) {
  e.preventDefault();
  showToast('Merci ! ✅');
}

function handleContactSubmit(e) {
  e.preventDefault();
  const name = ($('contact-name')?.value || '').trim();
  const phone = ($('contact-phone')?.value || '').trim();
  const msg = ($('contact-message')?.value || '').trim();

  if (!name || !phone || !msg) {
    showToast('Veuillez remplir tous les champs.', 'error');
    return;
  }

  $('contact-name').value = '';
  $('contact-phone').value = '';
  $('contact-message').value = '';
  $('contact-email') && ($('contact-email').value = '');
  showToast('Message envoyé ✅');
}

// ==================== INIT ====================
function bindProductGridEvents() {
  const grid = $('products-grid');
  if (!grid) return;
  grid.addEventListener('click', (e) => {
    const actionEl = e.target?.closest?.('[data-action]');
    const card = e.target?.closest?.('[data-product-id]');
    if (!card) return;
    const productId = Number(card.getAttribute('data-product-id'));
    if (!Number.isFinite(productId)) return;

    if (actionEl) {
      const action = actionEl.getAttribute('data-action');
      if (action === 'toggle-favorite') toggleFavorite(productId);
      else if (action === 'add-to-cart') addToCart(productId, 1);
      return;
    }

    openProductModal(productId);
  });
}

function init() {
  loadProducts();
  loadCart();
  loadFavorites();
  updateCartCount();

  const wa = getWhatsAppNumber();
  document.querySelectorAll('a[data-whatsapp-link]').forEach((a) => {
    a.href = `https://wa.me/${encodeURIComponent(wa)}`;
  });

  applyFilters();
  renderProducts();
  bindProductGridEvents();

  $('modal-sizes')?.addEventListener('click', (e) => {
    const btn = e.target?.closest?.('[data-size]');
    const size = btn?.getAttribute?.('data-size');
    if (size) selectSize(size);
  });

  $('modal-colors')?.addEventListener('click', (e) => {
    const btn = e.target?.closest?.('[data-color]');
    const color = btn?.getAttribute?.('data-color');
    if (color) selectColor(color);
  });

  const backToTopBtn = $('back-to-top');
  const updateBackToTop = () => {
    if (!backToTopBtn) return;
    const shouldShow = window.scrollY > 700;
    backToTopBtn.classList.toggle('hidden', !shouldShow);
  };
  updateBackToTop();
  window.addEventListener('scroll', updateBackToTop, { passive: true });

  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!$('product-modal')?.classList.contains('hidden')) closeProductModal();
    if (!$('cart-modal')?.classList.contains('hidden')) hideCart();
    if (!$('favorites-modal')?.classList.contains('hidden')) hideFavorites();
    if ($('mobile-menu')?.classList.contains('open')) closeMobileMenu();
  });

  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEYS.productsUpdated || e.key === STORAGE_KEYS.products) {
      loadProducts();
      applyFilters();
      renderProducts();
      showToast('Catalogue mis à jour.');
    }
  });
}

init();
