// ==================== CONFIGURATION ====================
const DEFAULT_PASSWORD = 'admin123';
const DEFAULT_WHATSAPP = '2250777181502';

// ==================== DONNÉES ====================
let adminPassword = localStorage.getItem('sevyAdminPassword') || DEFAULT_PASSWORD;
let whatsappNumber = localStorage.getItem('sevyWhatsAppNumber') || DEFAULT_WHATSAPP;
let products = [];
let orders = [];
let editingProductId = null;

// ==================== AUTHENTIFICATION ====================
function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('login-password').value;
    
    if (password === adminPassword) {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('admin-dashboard').classList.remove('hidden');
        loadData();
        showToast('Connexion réussie ! Bienvenue dans l\'administration.');
    } else {
        showToast('Mot de passe incorrect !', 'error');
        document.getElementById('login-password').value = '';
    }
}

function logout() {
    document.getElementById('admin-dashboard').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('login-password').value = '';
    showToast('Déconnexion réussie.');
}

function togglePassword() {
    const input = document.getElementById('login-password');
    const icon = document.getElementById('password-icon');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// ==================== NAVIGATION ====================
function showTab(tabName) {
    // Cacher tous les contenus
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Réinitialiser tous les nav items
    document.querySelectorAll('.nav-item').forEach(nav => {
        nav.classList.remove('bg-[#8b1e2f]/10', 'text-[#8b1e2f]');
        nav.classList.add('text-gray-600', 'hover:bg-gray-50');
    });
    
    // Activer le tab sélectionné
    document.getElementById(`tab-${tabName}`).classList.add('active');
    const activeNav = document.getElementById(`nav-${tabName}`);
    activeNav.classList.remove('text-gray-600', 'hover:bg-gray-50');
    activeNav.classList.add('bg-[#8b1e2f]/10', 'text-[#8b1e2f]');
    
    // Charger les données spécifiques
    if (tabName === 'dashboard') {
        updateDashboardStats();
        loadRecentActivity();
    } else if (tabName === 'products') {
        loadProductsGrid();
    } else if (tabName === 'orders') {
        loadOrdersList();
    } else if (tabName === 'settings') {
        loadSettings();
    }
}

// ==================== CHARGEMENT DES DONNÉES ====================
function loadData() {
    // Charger les produits
    const savedProducts = localStorage.getItem('sevyProducts');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // Produits par défaut
        products = getDefaultProducts();
        saveProducts();
    }
    
    // Charger les commandes
    const savedOrders = localStorage.getItem('sevyOrders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    }
    
    updateSidebarStats();
    updateDashboardStats();
    loadRecentActivity();
    loadProductsGrid();
    loadOrdersList();
    loadSettings();
    
    document.getElementById('last-update').textContent = new Date().toLocaleDateString('fr-FR');
}

function getDefaultProducts() {
    return [
        { 
            id: 1, 
            name: "New Balance 530 White/Pink", 
            price: 20000, 
            category: "femme", 
            image: "assets/WhatsApp Image 2026-03-31 at 11.05.44.jpeg", 
            description: "Sneakers New Balance 530 en blanc et rose. Style rétro running avec mesh respirant et détails métallisés. Confort exceptionnel pour le quotidien.", 
            sizes: ["36", "37", "38", "39", "40", "41"], 
            colors: ["blanc/rose"], 
            inStock: true 
        },
        { 
            id: 2, 
            name: "Vans Old Skool Black/White", 
            price: 17000, 
            category: "mixte", 
            image: "assets/WhatsApp Image 2026-03-31 at 11.05.45.jpeg", 
            description: "Classic Vans Old Skool noire et blanche. Icone du skate depuis 1977. Toile et daim avec la célèbre bande jazz côté. Style intemporel.", 
            sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44"], 
            colors: ["noir/blanc"], 
            inStock: true 
        },
        { 
            id: 3, 
            name: "Nike Air Max 1 Brown/White", 
            price: 18000, 
            category: "homme", 
            image: "assets/WhatsApp Image 2026-03-31 at 11.05.45 (1).jpeg", 
            description: "Nike Air Max 1 marron et blanche. La légende du Air Max. Cuir premium avec unité Air visible. Élégance et confort réunis.", 
            sizes: ["40", "41", "42", "43", "44", "45"], 
            colors: ["marron/blanc"], 
            inStock: true 
        },
        { 
            id: 4, 
            name: "Nike Air Max Plus TN Black/Chrome", 
            price: 25000, 
            category: "homme", 
            image: "assets/WhatsApp Image 2026-03-31 at 11.05.46.jpeg", 
            description: "Nike Air Max Plus TN noire chrome. Design agressif avec cages TPU métallisées. Amorti Tuned Air pour un confort maximal. Style urbain bold.", 
            sizes: ["40", "41", "42", "43", "44", "45"], 
            colors: ["noir/chrome"], 
            inStock: true 
        },
        { 
            id: 5, 
            name: "Nike Nocta Hot Step Air Terra Black", 
            price: 25000, 
            category: "homme", 
            image: "assets/WhatsApp Image 2026-03-31 at 11.05.46 (1).jpeg", 
            description: "Nike x Drake Nocta Hot Step Air Terra noire. Collaboration premium avec cuir matelassé et détails réfléchissants. Édition limitée, style unique.", 
            sizes: ["40", "41", "42", "43", "44", "45"], 
            colors: ["noir/argent"], 
            inStock: true 
        },
        { 
            id: 6, 
            name: "Nike Shox TL Black/Racer Blue", 
            price: 19000, 
            category: "homme", 
            image: "assets/WhatsApp Image 2026-03-31 at 11.05.46 (2).jpeg", 
            description: "Nike Shox TL noire et bleu électrique. Technologie Shox emblématique avec colonnes amortissantes. Look futuriste et agressif des années 2000.", 
            sizes: ["40", "41", "42", "43", "44", "45"], 
            colors: ["noir/bleu"], 
            inStock: true 
        },
        { 
            id: 7, 
            name: "Nike Shox TL Wolf Grey/Silver", 
            price: 19000, 
            category: "mixte", 
            image: "assets/WhatsApp Image 2026-03-31 at 11.05.46 (3).jpeg", 
            description: "Nike Shox TL gris loup et argent. Version élégante de la Shox TL. Technologie de pointe avec style minimaliste et moderne.", 
            sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44"], 
            colors: ["gris/argent"], 
            inStock: true 
        },
        { 
            id: 8, 
            name: "Asics Gel-Kayano 14 White/Green", 
            price: 18000, 
            category: "mixte", 
            image: "assets/azer.jpeg", 
            description: "Asics Gel-Kayano 14 blanche et verte. Design années 2000 revisité avec technologie GEL. Confort de running dans un style lifestyle tendance.", 
            sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44"], 
            colors: ["blanc/vert"], 
            inStock: true 
        },
        { 
            id: 9, 
            name: "Nike Air Force 1 White Rope Laces", 
            price: 18000, 
            category: "femme", 
            image: "assets/qsdf.jpeg", 
            description: "Nike Air Force 1 blanche avec lacets corde violet. Classic AF1 personnalisé avec lacets épais style corde. Look unique et tendance.", 
            sizes: ["36", "37", "38", "39", "40", "41"], 
            colors: ["blanc/violet"], 
            inStock: true 
        }
    ];
}

function saveProducts() {
    localStorage.setItem('sevyProducts', JSON.stringify(products));
    // Notifier le site principal
    localStorage.setItem('sevyProductsUpdated', Date.now().toString());
}

function saveOrders() {
    localStorage.setItem('sevyOrders', JSON.stringify(orders));
}

// ==================== DASHBOARD ====================
function updateDashboardStats() {
    document.getElementById('stat-total-products').textContent = products.length;
    document.getElementById('stat-total-orders').textContent = orders.length;
    
    const revenue = orders.reduce((acc, order) => acc + order.total, 0);
    document.getElementById('stat-revenue').textContent = formatPrice(revenue);
    
    const stockValue = products.reduce((acc, p) => acc + p.price, 0);
    document.getElementById('stat-stock-value').textContent = (stockValue / 1000000).toFixed(1) + 'M FCFA';
}

function updateSidebarStats() {
    document.getElementById('sidebar-stat-products').textContent = products.length;
    document.getElementById('sidebar-stat-orders').textContent = orders.length;
    
    const revenue = orders.reduce((acc, order) => acc + order.total, 0);
    document.getElementById('sidebar-stat-revenue').textContent = (revenue / 1000000).toFixed(1) + 'M';
    
    // Badge commandes
    const badge = document.getElementById('orders-badge');
    if (orders.length > 0) {
        badge.textContent = orders.length;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

function loadRecentActivity() {
    // Dernières commandes
    const recentOrdersDiv = document.getElementById('recent-orders');
    if (orders.length === 0) {
        recentOrdersDiv.innerHTML = '<p class="text-gray-400 text-center py-4">Aucune commande récente</p>';
    } else {
        const recent = orders.slice(0, 3);
        recentOrdersDiv.innerHTML = recent.map(order => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                    <p class="font-medium text-gray-900">Commande #${order.id.toString().slice(-6)}</p>
                    <p class="text-xs text-gray-500">${order.date}</p>
                </div>
                <span class="font-semibold text-[#8b1e2f]">${formatPrice(order.total)}</span>
            </div>
        `).join('');
    }
    
    // Derniers produits
    const recentProductsDiv = document.getElementById('recent-products');
    if (products.length === 0) {
        recentProductsDiv.innerHTML = '<p class="text-gray-400 text-center py-4">Aucun produit</p>';
    } else {
        const recent = products.slice(-3).reverse();
        recentProductsDiv.innerHTML = recent.map(product => `
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <img src="${product.image}" class="w-12 h-12 object-cover rounded-lg">
                <div class="flex-1">
                    <p class="font-medium text-gray-900 text-sm">${product.name}</p>
                    <p class="text-xs text-gray-500">${product.category}</p>
                </div>
                <span class="font-semibold text-[#8b1e2f] text-sm">${formatPrice(product.price)}</span>
            </div>
        `).join('');
    }
}

// ==================== PRODUITS ====================
function loadProductsGrid() {
    const grid = document.getElementById('products-grid-admin');
    
    if (products.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12 bg-white rounded-2xl">
                <i class="fas fa-box-open text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">Aucun produit. Cliquez sur "Ajouter une tenue" pour commencer.</p>
            </div>`;
        return;
    }
    
    grid.innerHTML = products.map(product => `
        <div class="product-card bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div class="relative">
                <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                ${!product.inStock ? '<div class="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold">Rupture de stock</div>' : ''}
            </div>
            <div class="p-4">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h3 class="font-semibold text-gray-900">${product.name}</h3>
                        <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">${product.category}</span>
                    </div>
                    <span class="font-bold text-[#8b1e2f]">${formatPrice(product.price)}</span>
                </div>
                <p class="text-sm text-gray-500 mb-4 line-clamp-2">${product.description}</p>
                <div class="flex gap-2">
                    <button onclick="editProduct(${product.id})" class="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all text-sm">
                        <i class="fas fa-edit mr-1"></i> Modifier
                    </button>
                    <button onclick="deleteProduct(${product.id})" class="flex-1 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all text-sm">
                        <i class="fas fa-trash mr-1"></i> Supprimer
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ==================== MODAL PRODUIT ====================
function openProductModal(productId = null) {
    editingProductId = productId;
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('product-modal-title');
    
    if (productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        title.textContent = 'Modifier la paire';
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-image').value = product.image;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-sizes').value = product.sizes.join(', ');
        document.getElementById('product-colors').value = product.colors.join(', ');
        document.getElementById('product-instock').checked = product.inStock;
    } else {
        title.textContent = 'Ajouter une paire';
        document.getElementById('product-id').value = '';
        document.getElementById('product-name').value = '';
        document.getElementById('product-price').value = '';
        document.getElementById('product-category').value = 'homme';
        document.getElementById('product-image').value = '';
        document.getElementById('product-description').value = '';
        document.getElementById('product-sizes').value = '36, 37, 38, 39, 40, 41';
        document.getElementById('product-colors').value = 'noir, blanc';
        document.getElementById('product-instock').checked = true;
    }
    
    modal.classList.remove('hidden');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
    editingProductId = null;
}

function handleProductSubmit(e) {
    e.preventDefault();
    
    const productData = {
        id: editingProductId || Date.now(),
        name: document.getElementById('product-name').value,
        price: parseInt(document.getElementById('product-price').value),
        category: document.getElementById('product-category').value,
        image: document.getElementById('product-image').value || 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80',
        description: document.getElementById('product-description').value,
        sizes: document.getElementById('product-sizes').value.split(',').map(s => s.trim()).filter(s => s),
        colors: document.getElementById('product-colors').value.split(',').map(c => c.trim()).filter(c => c),
        inStock: document.getElementById('product-instock').checked
    };
    
    if (editingProductId) {
        const index = products.findIndex(p => p.id === editingProductId);
        if (index > -1) {
            products[index] = productData;
            showToast('Paire modifiée avec succès !');
        }
    } else {
        products.push(productData);
        showToast('Paire ajoutée avec succès !');
    }
    
    saveProducts();
    loadProductsGrid();
    updateSidebarStats();
    updateDashboardStats();
    closeProductModal();
}

function editProduct(id) {
    openProductModal(id);
}

function deleteProduct(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette paire ?')) return;
    
    const index = products.findIndex(p => p.id === id);
    if (index > -1) {
        products.splice(index, 1);
        saveProducts();
        loadProductsGrid();
        updateSidebarStats();
        updateDashboardStats();
        showToast('Paire supprimée.');
    }
}

// ==================== COMMANDES ====================
function loadOrdersList() {
    const container = document.getElementById('orders-list');
    
    if (orders.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 bg-white rounded-2xl">
                <i class="fas fa-clipboard-list text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">Aucune commande enregistrée</p>
                <p class="text-sm text-gray-400 mt-1">Les commandes apparaîtront ici</p>
            </div>`;
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <div class="order-item bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                    <div class="flex items-center gap-3">
                        <h3 class="font-bold text-gray-900 text-lg">Commande #${order.id.toString().slice(-6)}</h3>
                        <span class="px-3 py-1 ${order.status === 'Traitée' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} rounded-full text-xs font-medium">
                            ${order.status}
                        </span>
                    </div>
                    <p class="text-sm text-gray-500 mt-1"><i class="far fa-clock mr-1"></i> ${order.date}</p>
                </div>
                <div class="text-right">
                    <p class="text-2xl font-bold text-[#8b1e2f]">${formatPrice(order.total)}</p>
                    <p class="text-sm text-gray-500">${order.items.length} article(s)</p>
                </div>
            </div>
            
            <div class="border-t border-gray-100 pt-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Articles commandés:</h4>
                <div class="space-y-2">
                    ${order.items.map(item => `
                        <div class="flex justify-between items-center text-sm">
                            <span class="text-gray-600">${item.name} <span class="text-gray-400">(×${item.quantity})</span></span>
                            <span class="font-medium">${formatPrice(item.price * item.quantity)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                ${order.status !== 'Traitée' ? `
                    <button onclick="markOrderComplete(${order.id})" class="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-sm">
                        <i class="fas fa-check mr-1"></i> Marquer comme traitée
                    </button>
                ` : ''}
                <button onclick="deleteOrder(${order.id})" class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-all text-sm">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function markOrderComplete(id) {
    const order = orders.find(o => o.id === id);
    if (order) {
        order.status = 'Traitée';
        saveOrders();
        loadOrdersList();
        updateSidebarStats();
        showToast('Commande marquée comme traitée !');
    }
}

function deleteOrder(id) {
    if (!confirm('Supprimer cette commande ?')) return;
    orders = orders.filter(o => o.id !== id);
    saveOrders();
    loadOrdersList();
    updateSidebarStats();
    updateDashboardStats();
    showToast('Commande supprimée.');
}

function clearAllOrders() {
    if (!confirm('Effacer tout l\'historique des commandes ? Cette action est irréversible.')) return;
    orders = [];
    saveOrders();
    loadOrdersList();
    updateSidebarStats();
    updateDashboardStats();
    showToast('Historique des commandes effacé.');
}

function exportOrders() {
    if (orders.length === 0) {
        showToast('Aucune commande à exporter', 'error');
        return;
    }
    
    let csv = 'ID,Date,Articles,Total,Status\n';
    orders.forEach(order => {
        const items = order.items.map(i => `${i.name}(${i.quantity})`).join('; ');
        csv += `${order.id},${order.date},"${items}",${order.total},${order.status}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commandes-sevy-store-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast('Commandes exportées avec succès !');
}

// ==================== PARAMÈTRES ====================
function loadSettings() {
    document.getElementById('setting-whatsapp').value = whatsappNumber;
}

function saveWhatsApp() {
    const newNumber = document.getElementById('setting-whatsapp').value.trim();
    
    if (!newNumber || newNumber.length < 10) {
        showToast('Veuillez entrer un numéro valide.', 'error');
        return;
    }
    
    whatsappNumber = newNumber;
    localStorage.setItem('sevyWhatsAppNumber', whatsappNumber);
    showToast('Numéro WhatsApp mis à jour !');
}

function changePassword() {
    const currentPass = document.getElementById('setting-current-password').value;
    const newPass = document.getElementById('setting-new-password').value;
    const confirmPass = document.getElementById('setting-confirm-password').value;
    
    if (currentPass !== adminPassword) {
        showToast('Mot de passe actuel incorrect.', 'error');
        return;
    }
    
    if (newPass.length < 6) {
        showToast('Le nouveau mot de passe doit faire au moins 6 caractères.', 'error');
        return;
    }
    
    if (newPass !== confirmPass) {
        showToast('Les mots de passe ne correspondent pas.', 'error');
        return;
    }
    
    adminPassword = newPass;
    localStorage.setItem('sevyAdminPassword', adminPassword);
    
    document.getElementById('setting-current-password').value = '';
    document.getElementById('setting-new-password').value = '';
    document.getElementById('setting-confirm-password').value = '';
    
    showToast('Mot de passe mis à jour avec succès !');
}

function resetAllData() {
    if (!confirm('Êtes-vous sûr de vouloir tout réinitialiser ? Tous les produits et commandes seront supprimés. Cette action est irréversible.')) return;
    
    localStorage.removeItem('sevyProducts');
    localStorage.removeItem('sevyOrders');
    localStorage.removeItem('sevyAdminPassword');
    localStorage.removeItem('sevyWhatsAppNumber');
    
    products = getDefaultProducts();
    orders = [];
    adminPassword = DEFAULT_PASSWORD;
    whatsappNumber = DEFAULT_WHATSAPP;
    
    saveProducts();
    loadData();
    showToast('Toutes les données ont été réinitialisées.');
}

// ==================== UTILITAIRES ====================
function formatPrice(price) {
    return price.toLocaleString('fr-FR') + ' FCFA';
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    toast.className = `toast ${bgColor} text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 min-w-[300px]`;
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span class="font-medium">${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== INITIALISATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si on est déjà connecté (dans la même session)
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('admin-dashboard').classList.remove('hidden');
        loadData();
    }
});

// Sauvegarder l'état de connexion
window.addEventListener('beforeunload', () => {
    if (!document.getElementById('admin-dashboard').classList.contains('hidden')) {
        sessionStorage.setItem('adminLoggedIn', 'true');
    }
});
