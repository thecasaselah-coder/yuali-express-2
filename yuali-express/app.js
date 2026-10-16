const MY_WHATSAPP_NUMBER = "972504138698"; // 

let products = [];
let activeCategory = 'הכל';

const grid = document.getElementById('products-grid');
const catContainer = document.getElementById('categories-container');
const searchInput = document.getElementById('search-input');
const modalRoot = document.getElementById('modal-root');

async function init() {
    setupModals();
    await loadData();
    renderCategories();
    renderProducts();
    
    searchInput.addEventListener('input', renderProducts);
    document.getElementById('btn-submit-link').addEventListener('click', () => toggleModal('modal-submit'));
    document.getElementById('btn-submit-banner').addEventListener('click', () => toggleModal('modal-submit'));
    document.getElementById('btn-admin').addEventListener('click', () => toggleModal('modal-admin'));
}

// קורא נתונים מהקובץ בפעם הראשונה ואז שומר בזיכרון של הדפדפן כדי שתוכל לערוך
async function loadData() {
    try {
        const localData = localStorage.getItem('yuali_pro_data');
        if (localData) {
            products = JSON.parse(localData);
        } else {
            const res = await fetch('data.json');
            products = await res.json();
            localStorage.setItem('yuali_pro_data', JSON.stringify(products));
        }
    } catch (e) {
        console.error("שגיאה בטעינת הנתונים", e);
    }
}

function renderCategories() {
    const categories = ['הכל', 'נשים - חרדי קפדני', 'נשים - מודרני (שסע/פתוח)', 'גברים', 'ילדים ותינוקות', 'לבית'];
    catContainer.innerHTML = categories.map(cat => `
        <button onclick="setCategory('${cat}')" class="px-6 py-2 rounded-full border-2 transition-all font-bold text-sm ${activeCategory === cat ? 'bg-black text-white border-black shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-black'}">
            ${cat}
        </button>
    `).join('');
}

function setCategory(cat) {
    activeCategory = cat;
    renderCategories();
    renderProducts();
}

function renderProducts() {
    const term = searchInput.value.toLowerCase();
    const filtered = products.filter(p => {
        const matchesCat = activeCategory === 'הכל' || p.category === activeCategory;
        const matchesSearch = p.title.toLowerCase().includes(term) || p.store.toLowerCase().includes(term);
        return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center py-20 text-gray-400 text-xl font-serif">לא מצאנו מוצרים שמתאימים לחיפוש שלך.</div>';
        return;
    }

    grid.innerHTML = filtered.map(p => `
        <div class="product-card flex flex-col justify-between">
            <div>
                <div class="product-image-wrapper relative h-80">
                    <img src="${p.image}" class="product-image w-full h-full object-cover" alt="${p.title}">
                    <span class="absolute top-4 right-4 bg-black text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">${p.store}</span>
                </div>
                <div class="p-6">
                    <span class="text-xs font-bold text-yellow-600 tracking-widest uppercase block mb-2">${p.category}</span>
                    <h3 class="font-serif text-2xl font-bold mb-3 leading-tight text-black">${p.title}</h3>
                    <p class="text-gray-600 text-sm leading-relaxed">${p.desc}</p>
                </div>
            </div>
            <div class="p-6 pt-0 flex justify-between items-end border-t border-gray-100 mt-4">
                <span class="text-2xl font-black text-black">${p.price}</span>
                <a href="${p.link}" target="_blank" class="bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-yellow-600 transition-colors text-sm shadow-md">לקנייה באתר המקור ↗</a>
            </div>
        </div>
    `).join('');
}

function setupModals() {
    modalRoot.innerHTML = `
        <!-- מודל הצעת מוצר על ידי גולש -->
        <div id="modal-submit" class="fixed inset-0 modal-overlay hidden flex items-center justify-center p-4 z-50">
            <div class="modal-content bg-white w-full max-w-md p-8 relative border-t-8 border-yellow-600">
                <button onclick="toggleModal('modal-submit')" class="absolute top-4 left-4 text-gray-400 hover:text-black font-bold text-xl">✕</button>
                <h3 class="font-serif text-2xl font-bold mb-1 text-black">הצעת קישור להגרלה</h3>
                <p class="text-sm text-gray-500 mb-6">מלא את הפרטים וצוות האתר יבדוק את הקישור.</p>
                
                <form onsubmit="submitRaffle(event)" class="space-y-4">
                    <input type="text" id="r-title" required placeholder="שם המוצר" class="w-full p-4 border border-gray-200 rounded-xl focus:border-yellow-600 outline-none bg-gray-50">
                    <input type="url" id="r-link" required placeholder="קישור למוצר (מאליאקספרס/שיין וכו')" class="w-full p-4 border border-gray-200 rounded-xl focus:border-yellow-600 outline-none bg-gray-50">
                    <div class="grid grid-cols-2 gap-4">
                        <input type="text" id="r-name" required placeholder="השם שלך" class="w-full p-4 border border-gray-200 rounded-xl focus:border-yellow-600 outline-none bg-gray-50">
                        <input type="text" id="r-phone" required placeholder="טלפון לחזרה" class="w-full p-4 border border-gray-200 rounded-xl focus:border-yellow-600 outline-none bg-gray-50">
                    </div>
                    <textarea id="r-desc" required placeholder="למה הציבור חייב להכיר את המוצר הזה?" rows="2" class="w-full p-4 border border-gray-200 rounded-xl focus:border-yellow-600 outline-none bg-gray-50"></textarea>
                    <button type="submit" class="w-full bg-yellow-600 text-white font-bold py-4 rounded-xl hover:bg-black transition-colors text-lg shadow-md">שלח והיכנס להגרלה 🚀</button>
                </form>
            </div>
        </div>

        <!-- מודל ניהול להוספת מוצר -->
        <div id="modal-admin" class="fixed inset-0 modal-overlay hidden flex items-center justify-center p-4 z-50">
            <div class="modal-content bg-white w-full max-w-lg p-8 relative border-t-8 border-black">
                <button onclick="toggleModal('modal-admin')" class="absolute top-4 left-4 text-gray-400 hover:text-black font-bold text-xl">✕</button>
                <h3 class="font-serif text-2xl font-bold mb-6 text-black">ניהול - הוספת מוצר לאתר</h3>
                
                <form onsubmit="addAdminProduct(event)" class="space-y-4">
                    <input type="text" id="a-title" required placeholder="שם המוצר" class="w-full p-3 border border-gray-200 rounded-lg focus:border-black outline-none">
                    <div class="grid grid-cols-2 gap-4">
                        <select id="a-cat" required class="w-full p-3 border border-gray-200 rounded-lg focus:border-black outline-none bg-white">
                            <option value="נשים - חרדי קפדני">נשים - חרדי קפדני</option>
                            <option value="נשים - מודרני (שסע/פתוח)">נשים - מודרני (שסע/פתוח)</option>
                            <option value="גברים">גברים</option>
                            <option value="ילדים ותינוקות">ילדים ותינוקות</option>
                            <option value="לבית">לבית</option>
                        </select>
                        <input type="text" id="a-price" required placeholder="מחיר (₪)" class="w-full p-3 border border-gray-200 rounded-lg focus:border-black outline-none">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <input type="text" id="a-store" required placeholder="חנות (AliExpress / Shein)" class="w-full p-3 border border-gray-200 rounded-lg focus:border-black outline-none">
                        <input type="url" id="a-link" required placeholder="קישור אפיליאייט שלך" class="w-full p-3 border border-gray-200 rounded-lg focus:border-black outline-none">
                    </div>
                    <input type="url" id="a-image" required placeholder="קישור לתמונה של המוצר" class="w-full p-3 border border-gray-200 rounded-lg focus:border-black outline-none">
                    <textarea id="a-desc" required placeholder="תיאור קצר והמלצה" rows="2" class="w-full p-3 border border-gray-200 rounded-lg focus:border-black outline-none"></textarea>
                    <button type="submit" class="w-full bg-black text-white font-bold py-4 rounded-lg hover:bg-gray-800 transition-colors">שמור ופרסם באתר מיד</button>
                </form>
            </div>
        </div>
    `;
}

function toggleModal(id) {
    document.getElementById(id).classList.toggle('hidden');
}

function submitRaffle(e) {
    e.preventDefault();
    const title = document.getElementById('r-title').value;
    const link = document.getElementById('r-link').value;
    const name = document.getElementById('r-name').value;
    const phone = document.getElementById('r-phone').value;
    const desc = document.getElementById('r-desc').value;

    const msg = `היי יואלי, קבל הצעה חדשה לאתר!\n\n🛍️ מוצר: ${title}\n🔗 קישור: ${link}\n👤 מאת: ${name}\n📞 טלפון: ${phone}\n📝 למה לקנות: ${desc}`;
    window.open(`https://wa.me/${MY_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    toggleModal('modal-submit');
}

function addAdminProduct(e) {
    e.preventDefault();
    const newP = {
        id: Date.now(),
        title: document.getElementById('a-title').value,
        category: document.getElementById('a-cat').value,
        price: document.getElementById('a-price').value,
        store: document.getElementById('a-store').value,
        link: document.getElementById('a-link').value,
        image: document.getElementById('a-image').value,
        desc: document.getElementById('a-desc').value
    };
    
    products.unshift(newP); // מוסיף למעלה
    localStorage.setItem('yuali_pro_data', JSON.stringify(products));
    renderCategories();
    renderProducts();
    toggleModal('modal-admin');
    e.target.reset();
}

init();