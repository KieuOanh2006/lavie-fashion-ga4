'use strict';
// Isolated application regressions, not browser E2E. No scripts or requests leave this VM.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const plain = value => JSON.parse(JSON.stringify(value));

class Element {
  constructor(tag = 'div', attrs = {}) {
    this.tagName = tag; this.attrs = attrs; this.children = []; this.listeners = {};
    this.style = {}; this.value = attrs.value || ''; this.checked = 'checked' in attrs;
    this.hidden = 'hidden' in attrs; this.isConnected = true; this.valid = true;
    this.dataset = Object.fromEntries(Object.entries(attrs).filter(([k]) => k.startsWith('data-')).map(([k,v]) => [k.slice(5).replace(/-([a-z])/g, (_,c) => c.toUpperCase()),v]));
    this.classList = { contains: c => this.classes().includes(c), add: c => this.classList.toggle(c,true), remove: c => this.classList.toggle(c,false), toggle: (c,force) => {
      const set = new Set(this.classes()); const enabled = force === undefined ? !set.has(c) : force;
      enabled ? set.add(c) : set.delete(c); this.attrs.class = [...set].join(' '); return enabled;
    }};
  }
  get id() { return this.attrs.id; }
  get src() { return this.attrs.src; }
  set src(value) { this.srcWrites = (this.srcWrites || 0) + 1; this.attrs.src = value; }
  classes() { return (this.attrs.class || '').split(/\s+/); }
  set className(value) { this.attrs.class = value; }
  setAttribute(key,value) { this.attrs[key] = String(value); }
  getAttribute(key) { return this.attrs[key] ?? null; }
  appendChild(child) { child.parentElement = this; this.children.push(child); return child; }
  remove() { this.parentElement.children = this.parentElement.children.filter(c => c !== this); }
  focus() { Element.focused = this; }
  scrollIntoView() {}
  reportValidity() { return this.valid; }
  reset() { this.querySelectorAll('input, textarea').forEach(e => { e.value = e.attrs.value || ''; e.checked = 'checked' in e.attrs; }); }
  addEventListener(type,fn) { (this.listeners[type] ||= []).push(fn); }
  fire(type,extra = {}) { const event = { target:this, preventDefault(){}, stopPropagation(){}, ...extra }; for (const fn of this.listeners[type] || []) fn(event); }
  click() { this.fire('click'); }
  matches(selector) {
    return selector.split(',').some(part => {
      const segments = part.trim().split(/\s+(?![^[]*\])/); const last = segments.pop();
      const simple = s => {
        if (s.endsWith(':checked') && !this.checked) return false;
        s = s.replace(/:checked$/, '');
        const tag = s.match(/^[a-z]+/i)?.[0]; if (tag && tag !== this.tagName) return false;
        if ([...s.matchAll(/#([\w-]+)/g)].some(m => this.id !== m[1])) return false;
        if ([...s.matchAll(/\.([\w-]+)/g)].some(m => !this.classes().includes(m[1]))) return false;
        return [...s.matchAll(/\[([\w-]+)(?:="([^"]*)")?\]/g)].every(m => m[1] in this.attrs && (m[2] === undefined || this.attrs[m[1]] === m[2]));
      };
      if (!simple(last)) return false;
      let parent = this.parentElement;
      while (segments.length) { const wanted = segments.pop(); while (parent && !parent.matches(wanted)) parent = parent.parentElement; if (!parent) return false; parent = parent.parentElement; }
      return true;
    });
  }
  closest(selector) { return this.matches(selector) ? this : this.parentElement?.closest(selector); }
  querySelectorAll(selector) { return this.children.flatMap(child => [...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector)]); }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  set innerHTML(html) { this.markup = html; this.children = []; parse(html,this); }
  get innerHTML() { return this.markup || ''; }
}
function parse(html, parent) {
  const stack = [parent];
  for (const match of html.matchAll(/<\/?([a-z][\w-]*)\b([^>]*)>/gi)) {
    const tag = match[1].toLowerCase();
    if (match[0].startsWith('</')) { const index = stack.findLastIndex(e => e.tagName === tag); if (index > 0) stack.length = index; continue; }
    const attrs = {}; for (const a of match[2].matchAll(/([\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) attrs[a[1]] = a[2] ?? a[3] ?? a[4] ?? '';
    const node = new Element(tag,attrs); stack.at(-1).appendChild(node);
    if (!['img','input','br','hr','meta','link','source','wbr'].includes(tag)) stack.push(node);
  }
}
function boot(storage = new Map(), source = read('app.js')) {
  const document = new Element('document'); parse(read('index.html'), document);
  document.body = document.querySelector('body'); document.head = document.querySelector('head');
  document.getElementById = id => document.querySelector('#' + id);
  document.createElement = tag => new Element(tag);
  const window = { LAVIE_CONFIG:{ GA_MEASUREMENT_ID:'' }, setTimeout(){} };
  const context = vm.createContext({ window,document, HTMLImageElement:Element, console:{info(){},warn(){}}, localStorage:{getItem:key => storage.get(key) ?? null,setItem:(key,value) => storage.set(key,value)}, setTimeout(){} });
  const exposed = `window.testApi = { products, openProduct, addSelectedProduct, changeQuantity, removeCartLine, applyCoupon, beginCheckout, createDemoOrder, trackEvent, cartTotal, cartSubtotal, shippingCost, discountAmount, state: () => ({cart,wishlist,orders,appliedCoupon,selectedSize,selectedColorIndex,selectedQty,currentModal:currentModal?.id}) };`;
  vm.runInContext(source.replace(/\}\)\(\);\s*$/, exposed + '\n})();'),context);
  return { api:window.testApi, document, storage, window, $:s => document.querySelector(s), events:name => window.dataLayer.filter(e => e.event === name) };
}
function add(app,id='LV001') { app.api.openProduct(id); app.$('#modalAddToCart').click(); }
function validCheckout(app) { app.$('#customerName').value = 'Demo'; app.$('#customerAddress').value = 'Demo address'; app.$('#customerPhone').value = '0901234567'; app.$('#agreeDemo').checked = true; }

test('every catalog product adds, increases, decreases and removes with correct analytics quantities', () => {
  const app = boot(); assert.equal(app.api.products.length,8);
  for (const product of app.api.products) {
    add(app,product.id); const line = app.api.state().cart[0];
    assert.equal(line.productId, product.id); assert.equal(line.qty,1);
    assert.equal(app.events('add_to_cart').at(-1).ecommerce.value,product.price);
    app.api.changeQuantity(line.key,1); assert.equal(line.qty,2);
    app.api.changeQuantity(line.key,-1); assert.equal(line.qty,1);
    app.api.removeCartLine(line.key); assert.equal(app.api.state().cart.length,0);
    assert.equal(app.events('remove_from_cart').at(-1).ecommerce.items[0].quantity,1);
  }
  assert.equal(app.events('add_to_cart').length,16); assert.equal(app.events('remove_from_cart').length,16);
});
test('identical variants merge; size and color variants remain distinct', () => {
  const app = boot(); add(app); add(app);
  assert.equal(app.api.state().cart.length,1); assert.equal(app.api.state().cart[0].qty,2);
  app.api.openProduct('LV001'); const size = app.$('[data-size="L"]'); app.$('#sizeOptions').fire('click',{target:size}); app.api.addSelectedProduct();
  app.api.openProduct('LV001'); const color = app.$('[data-color-index="1"]'); app.$('#colorOptions').fire('click',{target:color}); app.api.addSelectedProduct();
  assert.equal(app.api.state().cart.length,3); assert.equal(new Set(app.api.state().cart.map(l => l.key)).size,3);
});
test('totals, coupon normalization, restart persistence and shipping threshold', () => {
  const app = boot(); add(app); assert.equal(app.api.cartTotal(),514000);
  app.$('#couponInput').value = ' lavie 10 '; app.$('#applyCoupon').click(); assert.equal(app.api.cartTotal(),465100);
  const restart = boot(app.storage); assert.equal(restart.api.cartTotal(),465100); assert.equal(restart.api.state().appliedCoupon,'LAVIE10');
  restart.api.removeCartLine(restart.api.state().cart[0].key); assert.equal(restart.api.state().appliedCoupon,'');
  add(restart,'LV006'); assert.equal(restart.api.cartTotal(),699000); assert.equal(restart.api.shippingCost(),0);
});
test('legacy cart, wishlist and order storage schemas remain readable', () => {
  const line = {key:'LV001__M__Đỏ đất',productId:'LV001',size:'M',color:'Đỏ đất',qty:2};
  const order = {id:'LV-DEMO-LEGACY',date:'2026-01-01T00:00:00Z',total:978000,itemCount:2,items:[]};
  const app = boot(new Map([['lavie_cart_v1',JSON.stringify([line])],['lavie_wishlist_v1','["LV008"]'],['lavie_demo_orders_v1',JSON.stringify([order])]]));
  assert.deepEqual(plain(app.api.state().cart),[line]); assert.deepEqual(plain(app.api.state().wishlist),['LV008']); assert.deepEqual(plain(app.api.state().orders),[order]);
  app.$('[data-demo-orders]').click(); assert.match(app.$('#infoBody').innerHTML,/LV-DEMO-LEGACY/); assert.equal(app.events('purchase').length,0);
});
test('invalid checkout cannot purchase; duplicate submission and restart never replay purchase', () => {
  const app = boot(); add(app); app.$('#checkoutBtn').click();
  app.$('#checkoutForm').valid = false; app.$('#checkoutForm').fire('submit'); assert.equal(app.events('purchase').length,0);
  app.$('#checkoutForm').valid = true; app.$('#customerPhone').value = 'bad'; app.$('#checkoutForm').fire('submit'); assert.equal(app.events('purchase').length,0);
  app.$('#customerPhone').value = '0901234567'; app.$('#agreeDemo').checked = false; app.$('#checkoutForm').fire('submit'); assert.equal(app.events('purchase').length,0);
  validCheckout(app); app.$('#checkoutForm').fire('submit'); validCheckout(app); app.$('#checkoutForm').fire('submit');
  assert.equal(app.events('purchase').length,1); assert.equal(app.api.state().orders.length,1); assert.equal(app.api.state().cart.length,0);
  const purchase = app.events('purchase')[0].ecommerce; assert.equal(purchase.value,489000); assert.equal(purchase.shipping,25000);
  const persisted = app.storage.get('lavie_demo_orders_v1'); assert.doesNotMatch(persisted,/0901234567|Demo address/);
  const restart = boot(app.storage); restart.$('[data-demo-orders]').click(); assert.equal(restart.api.state().orders.length,1); assert.equal(restart.events('purchase').length,0);
});
test('adding opens cart and records each add and cart view exactly once', () => {
  const app = boot(); add(app);
  assert.equal(app.$('#cartDrawer').classList.contains('open'),true); assert.equal(app.$('#overlay').hidden,false);
  assert.equal(app.$('#productModal').hidden,true); assert.equal(app.events('add_to_cart').length,1); assert.equal(app.events('view_cart').length,1);
});
for (const dismissal of ['close','Escape','overlay']) test(`size guide ${dismissal} restores selections without another view_item`, () => {
  const app = boot(); app.api.openProduct('LV001');
  app.$('#sizeOptions').fire('click',{target:app.$('[data-size="L"]')}); app.$('#colorOptions').fire('click',{target:app.$('[data-color-index="2"]')}); app.$('#modalQtyPlus').click();
  app.$('#sizeGuideTrigger').click(); assert.equal(app.api.state().currentModal,'infoModal');
  if (dismissal === 'close') app.$('#infoModal').querySelector('[data-close-modal]').click();
  else if (dismissal === 'Escape') app.document.fire('keydown',{key:'Escape'}); else app.$('#overlay').click();
  const state = app.api.state(); assert.equal(state.currentModal,'productModal'); assert.equal(state.selectedSize,'L'); assert.equal(state.selectedColorIndex,2); assert.equal(state.selectedQty,2);
  assert.equal(app.$('#productModal').hidden,false); assert.equal(app.$('#overlay').hidden,false); assert.equal(Element.focused,app.$('#sizeGuideTrigger')); assert.equal(app.events('view_item').length,1);
});
test('each demo order navigation button opens history without purchase', () => {
  const app = boot(); const buttons = app.document.querySelectorAll('[data-demo-orders]'); assert.ok(buttons.length >= 2);
  for (const button of buttons) { button.click(); assert.equal(app.api.state().currentModal,'infoModal'); }
  assert.equal(app.events('purchase').length,0);
});
test('image error fallback changes source once and stops retrying', () => {
  const app = boot(); const image = app.$('#modalProductImage'); image.src = 'broken.jpg'; const before = image.srcWrites;
  app.document.fire('error',{target:image}); assert.equal(image.src,'assets/images/product-placeholder.svg');
  app.document.fire('error',{target:image}); assert.equal(image.srcWrites,before + 1); assert.equal(app.document.listeners.error.length,1);
});
test('catalog identity, tracking payload implementation and GTM configuration match HEAD', () => {
  const baseline = name => execFileSync('git',['show',`HEAD:${name}`],{cwd:root,encoding:'utf8'});
  const current = read('app.js'); const original = baseline('app.js');
  const catalog = source => [...source.matchAll(/\{ id: '(LV\d+)', name: '([^']+)'[^\n]*?price: (\d+)/g)].map(m => m.slice(1));
  assert.deepEqual(catalog(current),catalog(original)); assert.equal(catalog(current).length,8);
  const tracking = source => source.slice(source.indexOf('  function trackEvent('),source.indexOf('  function showToast(')).replace(/\r\n/g,'\n');
  assert.equal(tracking(current),tracking(original)); assert.equal(read('config.js').replace(/\r\n/g,'\n'),baseline('config.js').replace(/\r\n/g,'\n'));
  const gtm = html => [html.match(/<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->/)?.[0],html.match(/<noscript>[\s\S]*?<\/noscript>/)?.[0]].map(s => s?.replace(/\r\n/g,'\n'));
  const actual = gtm(read('index.html')); assert.ok(actual.every(Boolean)); assert.deepEqual(actual,gtm(baseline('index.html'))); assert.match(actual[0],/GTM-5M5HVX2L/);
});
