/* LAVIE FASHION — cửa hàng demo thực hành GA4
   Lưu ý: giỏ hàng/đơn demo lưu trên trình duyệt; không có backend và không thu tiền thật.
*/
(() => {
  'use strict';

  const GA_MEASUREMENT_ID = String(window.LAVIE_CONFIG?.GA_MEASUREMENT_ID || '').trim();
  const STORAGE = { cart: 'lavie_cart_v1', wishlist: 'lavie_wishlist_v1', orders: 'lavie_demo_orders_v1' };
  const FREE_SHIPPING_THRESHOLD = 699000;
  const SHIPPING_FEE = 25000;
  const COUPON_CODE = 'LAVIE10';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  const validMeasurementId = /^G-[A-Z0-9]+$/i.test(GA_MEASUREMENT_ID) && !/XXXX|YOUR|IDHERE/i.test(GA_MEASUREMENT_ID);
  if (validMeasurementId) {
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
    document.head.appendChild(gaScript);
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: true });
    console.info(`[LAVIE GA4] Đã cấu hình Measurement ID: ${GA_MEASUREMENT_ID}`);
  } else {
    console.info('[LAVIE GA4] Measurement ID trực tiếp chưa được cấu hình. Event demo được đẩy vào dataLayer; dùng Google Tag Manager để gửi event đến GA4.');
  }

  const products = [
    { id: 'LV001', name: 'Đầm midi linen An Nhiên', category: 'dress', categoryLabel: 'VÁY & ĐẦM', price: 489000, oldPrice: 589000, badge: 'BEST SELLER', description: 'Phom midi nhẹ nhàng, chất vải linen pha thoáng mát và hàng nút tinh tế. Dễ mặc đi làm, đi cà phê hay một buổi hẹn cuối tuần.', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85', imageAlt: 'Đầm nữ phong cách thanh lịch', colors: [{ name: 'Đỏ đất', hex: '#ad6c55' }, { name: 'Kem sữa', hex: '#e7ddca' }, { name: 'Đen', hex: '#292b27' }], sizes: ['S', 'M', 'L', 'XL'], rating: '4.9' },
    { id: 'LV002', name: 'Áo sơ mi Mây Trắng', category: 'top', categoryLabel: 'ÁO', price: 329000, oldPrice: null, badge: 'MỚI VỀ', description: 'Áo sơ mi phom relaxed với đường may gọn gàng, dễ phối cùng quần suông hoặc chân váy. Một món cơ bản để mặc quanh năm.', image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=900&q=85', imageAlt: 'Áo sơ mi nữ màu sáng', colors: [{ name: 'Trắng', hex: '#f1eee5' }, { name: 'Xanh nhạt', hex: '#b6c9c7' }, { name: 'Be', hex: '#cbbba4' }], sizes: ['S', 'M', 'L', 'XL'], rating: '4.8' },
    { id: 'LV003', name: 'Quần suông Thanh Lịch', category: 'bottom', categoryLabel: 'QUẦN & CHÂN VÁY', price: 419000, oldPrice: null, badge: '', description: 'Cạp cao vừa vặn, ống suông tạo cảm giác cân đối và thoải mái khi di chuyển. Phối cùng áo thun hoặc sơ mi đều hợp.', image: 'https://images.unsplash.com/photo-1506629905607-d9a0d9e0e6b4?auto=format&fit=crop&w=900&q=85', imageAlt: 'Quần nữ phom suông', colors: [{ name: 'Nâu cacao', hex: '#7d604b' }, { name: 'Đen', hex: '#272a26' }, { name: 'Kem', hex: '#e5decd' }], sizes: ['S', 'M', 'L', 'XL'], rating: '4.9' },
    { id: 'LV004', name: 'Áo thun basic Nắng', category: 'top', categoryLabel: 'ÁO', price: 189000, oldPrice: null, badge: 'DỄ PHỐI', description: 'Áo thun cotton mềm, bề mặt mịn, phom suông vừa phải. Mặc riêng thật thoải mái hoặc làm lớp nền cho nhiều kiểu phối đồ.', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85', imageAlt: 'Áo thun cotton màu trắng', colors: [{ name: 'Trắng', hex: '#f1eee7' }, { name: 'Xanh sage', hex: '#aebca7' }, { name: 'Đen', hex: '#282a26' }], sizes: ['S', 'M', 'L', 'XL'], rating: '4.8' },
    { id: 'LV005', name: 'Chân váy chữ A Hạ', category: 'bottom', categoryLabel: 'QUẦN & CHÂN VÁY', price: 349000, oldPrice: 399000, badge: '−13%', description: 'Chân váy chữ A có độ xòe vừa đủ, tôn dáng mà vẫn dễ vận động. Phù hợp với áo thun, sơ mi và cardigan.', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=85', imageAlt: 'Chân váy nữ phong cách tối giản', colors: [{ name: 'Đen', hex: '#282a26' }, { name: 'Nâu nhạt', hex: '#b69b7e' }, { name: 'Kem', hex: '#e9dfcc' }], sizes: ['S', 'M', 'L'], rating: '4.7' },
    { id: 'LV006', name: 'Blazer tối giản Lụa', category: 'top', categoryLabel: 'ÁO KHOÁC', price: 699000, oldPrice: null, badge: 'SIGNATURE', description: 'Blazer có cấu trúc mềm và vai áo tinh gọn, tạo vẻ chỉn chu mà không cứng nhắc. Lý tưởng cho ngày làm việc hoặc những dịp cần thêm điểm nhấn.', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85', imageAlt: 'Áo khoác blazer thời trang', colors: [{ name: 'Nâu', hex: '#95775d' }, { name: 'Đen', hex: '#292b27' }, { name: 'Be sáng', hex: '#ded0bb' }], sizes: ['S', 'M', 'L', 'XL'], rating: '5.0' },
    { id: 'LV007', name: 'Cardigan Thu Dịu', category: 'top', categoryLabel: 'ÁO KHOÁC', price: 379000, oldPrice: null, badge: '', description: 'Cardigan dệt kim mềm mại để khoác nhẹ khi trời se lạnh hoặc ngồi phòng máy lạnh. Dáng gọn, màu dịu, dễ đi cùng đồ cơ bản.', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85', imageAlt: 'Áo dệt kim thời trang nữ', colors: [{ name: 'Hồng phấn', hex: '#d8b2ae' }, { name: 'Xanh sage', hex: '#aebba6' }, { name: 'Kem', hex: '#e6ddcc' }], sizes: ['S', 'M', 'L'], rating: '4.8' },
    { id: 'LV008', name: 'Túi đeo vai Lumi', category: 'accessory', categoryLabel: 'PHỤ KIỆN', price: 459000, oldPrice: null, badge: 'VỪA VỀ', description: 'Túi đeo vai nhỏ gọn với phom cong mềm, đủ chỗ cho những món đồ thiết yếu mỗi ngày. Điểm nhấn tinh giản cho bộ trang phục.', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85', imageAlt: 'Túi đeo vai nữ màu trung tính', colors: [{ name: 'Nâu caramel', hex: '#a36b47' }, { name: 'Đen', hex: '#292b27' }, { name: 'Kem', hex: '#e5d8c2' }], sizes: ['FREESIZE'], rating: '4.9' },
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const formatVND = value => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Math.max(0, Number(value) || 0));
  const readStorage = (key, fallback) => {
    try { const parsed = JSON.parse(localStorage.getItem(key)); return parsed ?? fallback; }
    catch { return fallback; }
  };
  const writeStorage = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { console.warn('[LAVIE] Không thể lưu dữ liệu trình duyệt:', error); } };
  let cart = readStorage(STORAGE.cart, []);
  if (!Array.isArray(cart)) cart = [];
  let wishlist = readStorage(STORAGE.wishlist, []);
  if (!Array.isArray(wishlist)) wishlist = [];
  let orders = readStorage(STORAGE.orders, []);
  if (!Array.isArray(orders)) orders = [];
  let activeCategory = 'all';
  let searchTerm = '';
  let sortMode = 'featured';
  let onlyWishlist = false;
  let selectedProduct = null;
  let selectedSize = 'M';
  let selectedColorIndex = 0;
  let selectedQty = 1;
  let appliedCoupon = '';
  let currentModal = null;
  let lastOrder = null;
  let hasSentInitialListEvent = false;

  function productById(id) { return products.find(product => product.id === id); }
  function itemForAnalytics(product, qty = 1, size = '', color = '') {
    return { item_id: product.id, item_name: product.name, item_category: product.categoryLabel, item_brand: 'LAVIE FASHION', item_variant: [size, color].filter(Boolean).join(' / ') || undefined, price: product.price, quantity: qty };
  }
  function cartItemsForAnalytics() {
    return cart.map(line => {
      const product = productById(line.productId);
      if (!product) return null;
      const item = itemForAnalytics(product, line.qty, line.size, line.color);
      // Khi có coupon, dùng giá hàng sau giảm để value GA4 khớp giá trị sản phẩm thực tế.
      if (appliedCoupon === COUPON_CODE) item.price = Math.round(product.price * 0.9);
      return item;
    }).filter(Boolean);
  }
  function cartValueForAnalytics() {
    return cartItemsForAnalytics().reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
  }
  function cartSubtotal() { return cart.reduce((sum, line) => { const product = productById(line.productId); return sum + (product ? product.price * line.qty : 0); }, 0); }
  function cartQuantity() { return cart.reduce((sum, line) => sum + line.qty, 0); }
  function shippingCost() { return cartSubtotal() <= 0 || cartSubtotal() >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE; }
  function discountAmount() { return appliedCoupon === COUPON_CODE ? Math.round(cartSubtotal() * 0.1) : 0; }
  function cartTotal() { return Math.max(0, cartSubtotal() - discountAmount()) + shippingCost(); }
  const ecommerceEvents = new Set([
    'view_item_list',
    'select_item',
    'view_item',
    'view_cart',
    'add_to_cart',
    'remove_from_cart',
    'begin_checkout',
    'add_shipping_info',
    'add_payment_info',
    'purchase'
  ]);

  function trackEvent(name, params = {}) {
    const eventParams = { ...params };
    if (!validMeasurementId) {
      if (ecommerceEvents.has(name)) {
        // Clear ecommerce values from the preceding hit before sending this event.
        window.dataLayer.push({ ecommerce: null });
        window.dataLayer.push({ event: name, ecommerce: eventParams });
      } else {
        const diagnostic = { event: name, ...eventParams };
        window.dataLayer.push(diagnostic);
        console.info(`[LAVIE GA4 DEMO] ${name}`, diagnostic);
      }
      return;
    }
    window.gtag('event', name, eventParams);
  }
  function showToast(message, type = '') {
    const region = $('#toastRegion');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`.trim();
    toast.textContent = message;
    region.appendChild(toast);
    window.setTimeout(() => toast.remove(), 3100);
  }
  function saveCart() { writeStorage(STORAGE.cart, cart); }
  function saveWishlist() { writeStorage(STORAGE.wishlist, wishlist); }
  function saveOrders() { writeStorage(STORAGE.orders, orders); }

  function visibleProducts() {
    let result = [...products];
    if (activeCategory !== 'all') result = result.filter(product => product.category === activeCategory);
    if (onlyWishlist) result = result.filter(product => wishlist.includes(product.id));
    if (searchTerm) {
      const normalized = searchTerm.toLocaleLowerCase('vi-VN').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      result = result.filter(product => `${product.name} ${product.categoryLabel} ${product.description}`.toLocaleLowerCase('vi-VN').normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(normalized));
    }
    if (sortMode === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sortMode === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sortMode === 'name') result.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    return result;
  }
  function categoryName(category) { return ({ all: 'Tất cả', dress: 'Váy & đầm', top: 'Áo', bottom: 'Quần & chân váy', accessory: 'Phụ kiện' })[category] || 'Tất cả'; }
  function swatchMarkup(colors) { return colors.map(color => `<span title="${color.name}" style="background:${color.hex}"></span>`).join(''); }
  function renderProducts({ listEvent = false } = {}) {
    const result = visibleProducts();
    const grid = $('#productGrid');
    $('#emptyResults').hidden = result.length !== 0;
    grid.hidden = result.length === 0;
    $('#resultsText').textContent = onlyWishlist ? `Bạn có ${result.length} sản phẩm yêu thích` : searchTerm ? `Tìm thấy ${result.length} sản phẩm phù hợp` : `Đang có ${result.length} thiết kế dành cho bạn`;
    $('#clearFilters').hidden = !(searchTerm || activeCategory !== 'all' || onlyWishlist);
    grid.innerHTML = result.map(product => `
      <article class="product-card" data-product-card="${product.id}">
        <div class="product-image-wrap" data-open-product="${product.id}" tabindex="0" role="button" aria-label="Xem ${product.name}">
          <img src="${product.image}" alt="${product.imageAlt}" loading="lazy" />
          ${product.badge ? `<span class="product-badge ${product.badge.includes('−') ? 'terracotta' : ''}">${product.badge}</span>` : ''}
          <button class="favorite-btn ${wishlist.includes(product.id) ? 'is-favorite' : ''}" data-favorite="${product.id}" aria-label="${wishlist.includes(product.id) ? 'Bỏ yêu thích' : 'Thêm yêu thích'} ${product.name}" aria-pressed="${wishlist.includes(product.id)}">${wishlist.includes(product.id) ? '♥' : '♡'}</button>
          <button class="quick-view-btn" data-open-product="${product.id}">XEM CHI TIẾT <span>↗</span></button>
        </div>
        <div class="product-info">
          <div class="product-meta"><span class="product-category">${product.categoryLabel}</span><span class="product-rating">★ ${product.rating}</span></div>
          <button class="product-name" data-open-product="${product.id}">${product.name}</button>
          <div class="product-price-row"><span class="product-price">${formatVND(product.price)}</span>${product.oldPrice ? `<span class="old-price">${formatVND(product.oldPrice)}</span>` : ''}</div>
          <div class="card-swatches" aria-label="Màu sắc: ${product.colors.map(color => color.name).join(', ')}">${swatchMarkup(product.colors)}</div>
        </div>
      </article>`).join('');
    if (listEvent && result.length) {
      trackEvent('view_item_list', { currency: 'VND', item_list_name: onlyWishlist ? 'Danh sách yêu thích' : searchTerm ? 'Kết quả tìm kiếm' : categoryName(activeCategory), items: result.map((product, index) => ({ ...itemForAnalytics(product), index })) });
    } else if (!hasSentInitialListEvent && result.length) {
      trackEvent('view_item_list', { currency: 'VND', item_list_name: 'Bộ sưu tập nổi bật', items: result.map((product, index) => ({ ...itemForAnalytics(product), index })) });
      hasSentInitialListEvent = true;
    }
  }

  function updateHeaderCounts() {
    $('#cartCount').textContent = cartQuantity();
    $('#wishlistCount').textContent = wishlist.length;
    $('#drawerCount').textContent = `(${cartQuantity()})`;
  }
  function refreshCart() {
    updateHeaderCounts();
    $('#cartItems').innerHTML = cart.map(line => {
      const product = productById(line.productId);
      if (!product) return '';
      return `<div class="cart-line" data-cart-key="${line.key}">
        <img src="${product.image}" alt="${product.imageAlt}" loading="lazy" />
        <div class="cart-line-info"><p class="cart-line-title">${product.name}</p><p class="cart-line-variant">${line.color} · Size ${line.size}</p><p class="cart-line-price">${formatVND(product.price * line.qty)}</p><button class="cart-line-remove" data-remove-line="${line.key}">Xóa</button></div>
        <div class="cart-line-end"><div class="quantity-control"><button data-change-qty="${line.key}" data-delta="-1" aria-label="Giảm số lượng">−</button><span>${line.qty}</span><button data-change-qty="${line.key}" data-delta="1" aria-label="Tăng số lượng">+</button></div></div>
      </div>`;
    }).join('');
    const empty = cart.length === 0;
    $('#cartEmpty').hidden = !empty;
    $('#cartItems').hidden = empty;
    $('#drawerBottom').hidden = empty;
    $('#shippingProgress').hidden = empty;
    const subtotal = cartSubtotal();
    $('#shippingProgressBar').style.width = `${Math.min(100, subtotal / FREE_SHIPPING_THRESHOLD * 100)}%`;
    $('#shippingProgress span').textContent = subtotal >= FREE_SHIPPING_THRESHOLD ? 'Tuyệt vời! Đơn hàng đã được miễn phí giao hàng.' : `Mua thêm ${formatVND(FREE_SHIPPING_THRESHOLD - subtotal)} để được miễn phí giao hàng.`;
    $('#subtotalText').textContent = formatVND(subtotal);
    $('#shippingText').textContent = shippingCost() === 0 ? (subtotal ? 'Miễn phí' : '—') : formatVND(shippingCost());
    $('#discountRow').hidden = discountAmount() === 0;
    $('#discountText').textContent = `−${formatVND(discountAmount())}`;
    $('#totalText').textContent = formatVND(cartTotal());
    $('#couponMessage').textContent = appliedCoupon ? `Đã áp dụng mã ${appliedCoupon} — giảm 10% tạm tính.` : '';
    $('#couponMessage').style.color = appliedCoupon ? 'var(--sage-dark)' : 'var(--terracotta)';
    saveCart();
  }
  function setOverlay(show) {
    $('#overlay').hidden = !show;
    document.body.classList.toggle('no-scroll', show);
  }
  function openCart() {
    closeModalOnly();
    $('#cartDrawer').classList.add('open');
    $('#cartDrawer').setAttribute('aria-hidden', 'false');
    setOverlay(true);
    refreshCart();
    trackEvent('view_cart', { currency: 'VND', value: cartValueForAnalytics(), items: cartItemsForAnalytics() });
    $('#closeCart').focus();
  }
  function closeCart() {
    $('#cartDrawer').classList.remove('open');
    $('#cartDrawer').setAttribute('aria-hidden', 'true');
    if (!currentModal) setOverlay(false);
  }
  function openModal(id) {
    closeCart();
    $$('.modal').forEach(modal => { modal.hidden = true; });
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.hidden = false;
    currentModal = modal;
    setOverlay(true);
    const closeButton = $('.modal-close', modal);
    if (closeButton) closeButton.focus();
  }
  function closeModalOnly() {
    $$('.modal').forEach(modal => { modal.hidden = true; });
    currentModal = null;
  }
  function closeEverything() {
    closeCart();
    closeModalOnly();
    setOverlay(false);
  }
  function toggleFavorite(productId) {
    const product = productById(productId);
    if (!product) return;
    const exists = wishlist.includes(productId);
    if (exists) wishlist = wishlist.filter(id => id !== productId);
    else wishlist = [...wishlist, productId];
    saveWishlist();
    updateHeaderCounts();
    renderProducts();
    if (selectedProduct && selectedProduct.id === productId) updateModalFavoriteButton();
    trackEvent(exists ? 'remove_from_wishlist' : 'add_to_wishlist', { currency: 'VND', value: product.price, items: [itemForAnalytics(product)] });
    showToast(exists ? 'Đã bỏ khỏi danh sách yêu thích.' : 'Đã lưu vào danh sách yêu thích.', 'success');
    if (onlyWishlist && !wishlist.length) { onlyWishlist = false; renderProducts(); }
  }
  function updateModalFavoriteButton() {
    if (!selectedProduct) return;
    const isFav = wishlist.includes(selectedProduct.id);
    $('#modalWishlist').textContent = isFav ? '♥ Đã có trong yêu thích' : '♡ Thêm vào yêu thích';
    $('#modalWishlist').setAttribute('aria-pressed', String(isFav));
  }
  function openProduct(productId) {
    const product = productById(productId);
    if (!product) return;
    selectedProduct = product;
    selectedSize = product.sizes.includes('M') ? 'M' : product.sizes[0];
    selectedColorIndex = 0;
    selectedQty = 1;
    $('#modalProductImage').src = product.image;
    $('#modalProductImage').alt = product.imageAlt;
    $('#modalProductCategory').textContent = product.categoryLabel;
    $('#modalProductName').textContent = product.name;
    $('#modalProductPrice').textContent = formatVND(product.price);
    $('#modalProductDescription').textContent = product.description;
    $('#sizeOptions').innerHTML = product.sizes.map(size => `<button class="size-option ${size === selectedSize ? 'selected' : ''}" data-size="${size}" aria-pressed="${size === selectedSize}">${size}</button>`).join('');
    $('#sizeOptions').parentElement.hidden = product.sizes.length === 1 && product.sizes[0] === 'FREESIZE';
    $('#colorOptions').innerHTML = product.colors.map((color, index) => `<button class="color-swatch ${index === selectedColorIndex ? 'selected' : ''}" data-color-index="${index}" style="background:${color.hex}" title="${color.name}" aria-label="Màu ${color.name}" aria-pressed="${index === selectedColorIndex}"></button>`).join('');
    $('#selectedColorLabel').textContent = product.colors[selectedColorIndex].name;
    $('#modalQty').textContent = selectedQty;
    $('#sizeError').hidden = true;
    updateModalFavoriteButton();
    trackEvent('select_item', { currency: 'VND', item_list_name: categoryName(activeCategory), items: [itemForAnalytics(product)] });
    trackEvent('view_item', { currency: 'VND', value: product.price, items: [itemForAnalytics(product, 1, selectedSize, product.colors[selectedColorIndex].name)] });
    openModal('productModal');
  }
  function addSelectedProduct() {
    if (!selectedProduct) return;
    if (!selectedSize) { $('#sizeError').hidden = false; return; }
    const color = selectedProduct.colors[selectedColorIndex].name;
    const key = `${selectedProduct.id}__${selectedSize}__${color}`;
    const existing = cart.find(line => line.key === key);
    if (existing) existing.qty += selectedQty;
    else cart.push({ key, productId: selectedProduct.id, size: selectedSize, color, qty: selectedQty });
    saveCart();
    refreshCart();
    trackEvent('add_to_cart', { currency: 'VND', value: selectedProduct.price * selectedQty, items: [itemForAnalytics(selectedProduct, selectedQty, selectedSize, color)] });
    closeEverything();
    showToast(`Đã thêm ${selectedProduct.name} vào giỏ hàng.`, 'success');
  }
  function changeQuantity(key, delta) {
    const line = cart.find(item => item.key === key);
    if (!line) return;
    const product = productById(line.productId);
    if (!product) return;
    if (delta > 0) {
      line.qty += 1;
      trackEvent('add_to_cart', { currency: 'VND', value: product.price, items: [itemForAnalytics(product, 1, line.size, line.color)] });
    } else {
      trackEvent('remove_from_cart', { currency: 'VND', value: product.price, items: [itemForAnalytics(product, 1, line.size, line.color)] });
      line.qty -= 1;
      if (line.qty <= 0) cart = cart.filter(item => item.key !== key);
    }
    if (!cart.length) appliedCoupon = '';
    refreshCart();
  }
  function removeCartLine(key) {
    const line = cart.find(item => item.key === key);
    if (!line) return;
    const product = productById(line.productId);
    if (product) trackEvent('remove_from_cart', { currency: 'VND', value: product.price * line.qty, items: [itemForAnalytics(product, line.qty, line.size, line.color)] });
    cart = cart.filter(item => item.key !== key);
    if (!cart.length) appliedCoupon = '';
    refreshCart();
    showToast('Đã xóa sản phẩm khỏi giỏ hàng.');
  }
  function applyCoupon() {
    const entered = $('#couponInput').value.trim().toUpperCase().replace(/\s+/g, '');
    if (!cart.length) { $('#couponMessage').textContent = 'Thêm sản phẩm vào giỏ trước nhé.'; return; }
    if (entered === COUPON_CODE) {
      appliedCoupon = COUPON_CODE;
      trackEvent('add_coupon', { coupon: COUPON_CODE, currency: 'VND', value: discountAmount() });
      refreshCart();
      showToast('Áp dụng mã LAVIE10 thành công!', 'success');
    } else {
      appliedCoupon = '';
      refreshCart();
      $('#couponMessage').textContent = 'Mã chưa đúng. Thử LAVIE10 nhé!';
      $('#couponMessage').style.color = 'var(--terracotta)';
    }
  }
  function renderCheckoutSummary() {
    $('#checkoutItems').innerHTML = cart.map(line => {
      const product = productById(line.productId);
      if (!product) return '';
      return `<div class="checkout-summary-line"><img src="${product.image}" alt="" loading="lazy" /><div><strong>${product.name}</strong><small>${line.color} · ${line.size} · SL ${line.qty}</small></div><span class="summary-line-price">${formatVND(product.price * line.qty)}</span></div>`;
    }).join('');
    $('#checkoutSubtotal').textContent = formatVND(cartSubtotal());
    $('#checkoutShipping').textContent = shippingCost() === 0 ? 'Miễn phí' : formatVND(shippingCost());
    $('#checkoutShippingPrice').textContent = shippingCost() === 0 ? 'Miễn phí' : formatVND(shippingCost());
    $('#checkoutDiscountRow').hidden = discountAmount() === 0;
    $('#checkoutDiscount').textContent = `−${formatVND(discountAmount())}`;
    $('#checkoutTotal').textContent = formatVND(cartTotal());
  }
  function beginCheckout() {
    if (!cart.length) { showToast('Giỏ hàng đang trống. Chọn món bạn yêu thích nhé.'); return; }
    trackEvent('begin_checkout', { currency: 'VND', value: cartValueForAnalytics(), coupon: appliedCoupon || undefined, items: cartItemsForAnalytics() });
    renderCheckoutSummary();
    closeCart();
    $('#checkoutError').hidden = true;
    openModal('checkoutModal');
  }
  function createDemoOrder(event) {
    event.preventDefault();
    const form = $('#checkoutForm');
    if (!form.reportValidity()) return;
    const phone = $('#customerPhone').value.replace(/[\s().+-]/g, '');
    if (!/^0?\d{9,10}$/.test(phone)) {
      $('#checkoutError').textContent = 'Số điện thoại chưa đúng. Hãy nhập số điện thoại Việt Nam từ 9–11 chữ số.';
      $('#checkoutError').hidden = false;
      $('#customerPhone').focus();
      return;
    }
    if (!$('#agreeDemo').checked) {
      $('#checkoutError').textContent = 'Mày cần xác nhận đây là đơn giả lập trước khi tiếp tục.';
      $('#checkoutError').hidden = false;
      $('#agreeDemo').focus();
      return;
    }
    if (!cart.length) { closeEverything(); showToast('Giỏ hàng đang trống.'); return; }
    const shippingType = $('input[name="shipping"]:checked')?.value || 'standard';
    const paymentType = $('input[name="payment"]:checked')?.value || 'cod';
    const subtotal = cartSubtotal();
    const shipping = shippingCost();
    const discount = discountAmount();
    const total = cartTotal();
    const transactionId = `LV-DEMO-${Date.now().toString().slice(-8)}`;
    const purchasedItems = cartItemsForAnalytics();
    trackEvent('add_shipping_info', { currency: 'VND', value: cartValueForAnalytics(), shipping_tier: shippingType === 'standard' ? 'Giao hàng tiêu chuẩn (demo)' : shippingType, coupon: appliedCoupon || undefined, items: purchasedItems });
    trackEvent('add_payment_info', { currency: 'VND', value: cartValueForAnalytics(), payment_type: paymentType === 'cod' ? 'Thanh toán khi nhận hàng (demo)' : 'Chuyển khoản (demo)', coupon: appliedCoupon || undefined, items: purchasedItems });
    trackEvent('purchase', { transaction_id: transactionId, affiliation: 'LAVIE FASHION DEMO', currency: 'VND', value: cartValueForAnalytics(), tax: 0, shipping, coupon: appliedCoupon || undefined, items: purchasedItems });
    lastOrder = { id: transactionId, date: new Date().toISOString(), total, itemCount: cartQuantity(), items: purchasedItems.map(item => ({ item_id: item.item_id, item_name: item.item_name, quantity: item.quantity, price: item.price })) };
    orders.unshift(lastOrder);
    orders = orders.slice(0, 30);
    saveOrders();
    $('#confirmationOrderId').textContent = transactionId;
    $('#confirmationDate').textContent = new Date().toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' });
    $('#confirmationTotal').textContent = formatVND(total);
    cart = [];
    appliedCoupon = '';
    saveCart();
    refreshCart();
    form.reset();
    $$('.choice-card').forEach(label => label.classList.toggle('selected', $('input', label).checked));
    closeModalOnly();
    openModal('confirmationModal');
  }
  function showInfo(title, html) {
    $('#infoTitle').textContent = title;
    $('#infoBody').innerHTML = html;
    openModal('infoModal');
  }
  function openDemoOrders() {
    const body = orders.length ? `<p>Danh sách đơn giả lập chỉ được lưu trên trình duyệt/thiết bị này. Không có thông tin nhận hàng được lưu.</p><ol>${orders.map(order => `<li><strong>${order.id}</strong> — ${formatVND(order.total)}<br><small>${new Date(order.date).toLocaleString('vi-VN')} · ${order.itemCount} sản phẩm</small></li>`).join('')}</ol>` : '<p>Chưa có đơn demo nào trên thiết bị này. Thử chọn vài sản phẩm và hoàn tất checkout nhé.</p>';
    showInfo('Đơn hàng demo trên thiết bị này', body);
  }

  // Navigation and search
  $('#categoryTabs').addEventListener('click', event => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    activeCategory = button.dataset.category;
    onlyWishlist = false;
    $$('.category-tab').forEach(tab => tab.classList.toggle('active', tab === button));
    renderProducts({ listEvent: true });
  });
  $$('[data-nav-category], [data-footer-category]').forEach(link => link.addEventListener('click', () => {
    const category = link.dataset.navCategory || link.dataset.footerCategory || 'all';
    activeCategory = category;
    onlyWishlist = false;
    $$('.category-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.category === category));
    renderProducts({ listEvent: true });
    $('#mainNav').classList.remove('open');
  }));
  $('#searchInput').addEventListener('input', event => {
    searchTerm = event.target.value.trim();
    renderProducts();
  });
  $('#searchInput').addEventListener('keydown', event => {
    if (event.key === 'Enter' && searchTerm) trackEvent('search', { search_term: searchTerm });
  });
  $('#sortSelect').addEventListener('change', event => { sortMode = event.target.value; renderProducts({ listEvent: true }); });
  $('#clearFilters').addEventListener('click', () => {
    activeCategory = 'all'; searchTerm = ''; sortMode = 'featured'; onlyWishlist = false;
    $('#searchInput').value = ''; $('#sortSelect').value = 'featured';
    $$('.category-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.category === 'all'));
    renderProducts({ listEvent: true });
  });
  $('#showAllBtn').addEventListener('click', () => $('#clearFilters').click());
  $('#wishlistBtn').addEventListener('click', () => {
    if (!wishlist.length) { showToast('Danh sách yêu thích của bạn đang trống.'); return; }
    onlyWishlist = !onlyWishlist;
    if (onlyWishlist) activeCategory = 'all';
    $$('.category-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.category === activeCategory));
    renderProducts({ listEvent: true });
    $('#shop').scrollIntoView({ behavior: 'smooth' });
    showToast(onlyWishlist ? 'Đang xem sản phẩm yêu thích.' : 'Đang xem toàn bộ sản phẩm.');
  });
  $('#mobileMenuBtn').addEventListener('click', () => {
    const nav = $('#mainNav');
    const isOpen = nav.classList.toggle('open');
    $('#mobileMenuBtn').setAttribute('aria-expanded', String(isOpen));
  });

  // Product list, modal variants and wishlist
  $('#productGrid').addEventListener('click', event => {
    const favoriteButton = event.target.closest('[data-favorite]');
    if (favoriteButton) { event.stopPropagation(); toggleFavorite(favoriteButton.dataset.favorite); return; }
    const openButton = event.target.closest('[data-open-product]');
    if (openButton) openProduct(openButton.dataset.openProduct);
  });
  $('#productGrid').addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-open-product][role="button"]')) { event.preventDefault(); openProduct(event.target.dataset.openProduct); }
  });
  $('#sizeOptions').addEventListener('click', event => {
    const button = event.target.closest('[data-size]');
    if (!button) return;
    selectedSize = button.dataset.size;
    $('#sizeError').hidden = true;
    $$('[data-size]', $('#sizeOptions')).forEach(option => { const selected = option === button; option.classList.toggle('selected', selected); option.setAttribute('aria-pressed', String(selected)); });
  });
  $('#colorOptions').addEventListener('click', event => {
    const button = event.target.closest('[data-color-index]');
    if (!button || !selectedProduct) return;
    selectedColorIndex = Number(button.dataset.colorIndex);
    const color = selectedProduct.colors[selectedColorIndex];
    $('#selectedColorLabel').textContent = color.name;
    $$('[data-color-index]', $('#colorOptions')).forEach(option => { const selected = option === button; option.classList.toggle('selected', selected); option.setAttribute('aria-pressed', String(selected)); });
  });
  $('#modalQtyMinus').addEventListener('click', () => { selectedQty = Math.max(1, selectedQty - 1); $('#modalQty').textContent = selectedQty; });
  $('#modalQtyPlus').addEventListener('click', () => { selectedQty = Math.min(10, selectedQty + 1); $('#modalQty').textContent = selectedQty; });
  $('#modalAddToCart').addEventListener('click', addSelectedProduct);
  $('#modalWishlist').addEventListener('click', () => { if (selectedProduct) toggleFavorite(selectedProduct.id); });
  $('#sizeGuideTrigger').addEventListener('click', () => showInfo('Hướng dẫn chọn size', '<p>Bảng size dưới đây là hướng dẫn minh họa cho đồ án; số đo thực tế có thể khác theo thiết kế.</p><ul><li><strong>S:</strong> vòng ngực khoảng 80–84 cm</li><li><strong>M:</strong> vòng ngực khoảng 85–89 cm</li><li><strong>L:</strong> vòng ngực khoảng 90–95 cm</li><li><strong>XL:</strong> vòng ngực khoảng 96–101 cm</li></ul><p>Nếu bạn nằm giữa hai size, ưu tiên phom dáng mong muốn hoặc liên hệ cửa hàng để được tư vấn.</p>'));

  // Cart and checkout
  $('#cartBtn').addEventListener('click', openCart);
  $('#closeCart').addEventListener('click', closeCart);
  $('#continueShopping').addEventListener('click', () => { closeEverything(); $('#shop').scrollIntoView({ behavior: 'smooth' }); });
  $('#cartItems').addEventListener('click', event => {
    const quantityButton = event.target.closest('[data-change-qty]');
    if (quantityButton) { changeQuantity(quantityButton.dataset.changeQty, Number(quantityButton.dataset.delta)); return; }
    const removeButton = event.target.closest('[data-remove-line]');
    if (removeButton) removeCartLine(removeButton.dataset.removeLine);
  });
  $('#applyCoupon').addEventListener('click', applyCoupon);
  $('#couponInput').addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); applyCoupon(); } });
  $('#checkoutBtn').addEventListener('click', beginCheckout);
  $('#checkoutForm').addEventListener('submit', createDemoOrder);
  $$('input[name="payment"], input[name="shipping"]').forEach(input => input.addEventListener('change', () => {
    $$('.choice-card').forEach(label => label.classList.toggle('selected', $('input', label).checked));
    renderCheckoutSummary();
  }));
  $('#overlay').addEventListener('click', () => {
    if ($('#cartDrawer').classList.contains('open')) closeCart();
    closeModalOnly();
    setOverlay(false);
  });
  $$('[data-close-modal]').forEach(button => button.addEventListener('click', closeEverything));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeEverything(); });
  $('#finishShopping').addEventListener('click', () => { closeEverything(); $('#shop').scrollIntoView({ behavior: 'smooth' }); });
  $('#viewDemoOrders').addEventListener('click', openDemoOrders);

  // Newsletter and footer info are local demo interactions only.
  $('#newsletterForm').addEventListener('submit', event => {
    event.preventDefault();
    const email = $('#newsletterEmail').value.trim();
    if (!email) return;
    trackEvent('sign_up', { method: 'newsletter_form_demo' });
    $('#newsletterForm').reset();
    showToast('Cảm ơn bạn! Đây là đăng ký nhận tin giả lập.', 'success');
  });
  const footerInfo = {
    shipping: ['Giao hàng & vận chuyển', '<p>Phí giao hàng minh họa là 25.000₫ cho đơn dưới 699.000₫ và miễn phí từ 699.000₫. Thời gian giao hàng mẫu là 2–5 ngày làm việc. Website hiện không kết nối đơn vị vận chuyển thật.</p>'],
    returns: ['Đổi trả & đổi size', '<p>Chính sách đổi size 7 ngày được đưa vào để minh họa nội dung cửa hàng. Website demo chưa tiếp nhận hay xử lý yêu cầu đổi trả thật.</p>'],
    care: ['Chăm sóc sản phẩm', '<p>Đọc nhãn hướng dẫn giặt trên từng sản phẩm. Ưu tiên giặt nhẹ, phơi nơi thoáng mát và bảo quản theo chất liệu. Thông tin sản phẩm ở website là dữ liệu mẫu.</p>'],
    contact: ['Liên hệ LAVIE', '<p>Email minh họa: hello@laviefashion.demo<br />Thời gian hỗ trợ: Thứ 2 – Thứ 7, 09:00–18:00.<br />Đây không phải địa chỉ liên hệ của một cửa hàng đang hoạt động.</p>'],
  };
  $$('[data-info]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault(); const info = footerInfo[link.dataset.info]; if (info) showInfo(info[0], info[1]);
  }));
  $('#footerDemoInfo').addEventListener('click', () => showInfo('Thông tin bản demo', '<p><strong>LAVIE FASHION</strong> là cửa hàng mô phỏng phục vụ học tập và kiểm thử Google Analytics 4.</p><ul><li>Sản phẩm, giá và đơn hàng đều là dữ liệu giả lập.</li><li>Không có thanh toán, kho hàng, giao vận hay hệ thống quản trị thật.</li><li>Giỏ hàng và danh sách yêu thích lưu trong trình duyệt hiện tại.</li><li>Đơn demo lưu mã đơn, tổng tiền, thời gian và số sản phẩm trên thiết bị; không lưu tên, email, số điện thoại hoặc địa chỉ nhận hàng.</li></ul><p>Vui lòng không nhập thông tin cá nhân thật khi thử nghiệm.</p>'));

  // Initial render and persisted-cart validation.
  cart = cart.filter(line => productById(line.productId) && Number.isInteger(line.qty) && line.qty > 0);
  wishlist = wishlist.filter(id => productById(id));
  saveCart(); saveWishlist();
  renderProducts();
  refreshCart();
  updateHeaderCounts();
})();
