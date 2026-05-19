// SECTION: Данные меню (20 блюд)
// NOTE: Для каждого блюда заполняйте поле `image` - вставьте туда прямую ссылку на фото.
const fallbackDishImage = "https://placehold.co/600x400/0a1026/bfd7ff?text=ADD+DISH+PHOTO";

const menuData = [
  { id: 1, name: "Рамен", description: "Наваристый бульон, лапша, яйцо и зелень.", price: 590, category: "asian", image: "icons/ramen.jpg" },
  { id: 2, name: "Том Ям", description: "Острый тайский суп с креветками.", price: 640, category: "asian", image: "icons/Tom_Yum.jpg" },
  { id: 3, name: "Фо Бо", description: "Вьетнамский суп с говядиной и рисовой лапшой.", price: 560, category: "asian", image: "icons/fo_bo.jpg" },
  { id: 4, name: "Пад Тай", description: "Рисовая лапша с курицей, овощами и арахисом.", price: 610, category: "asian", image: "icons/pad_thai.jpg" },
  { id: 5, name: "Удон с курицей", description: "Японская лапша в соусе терияки.", price: 580, category: "asian", image: "icons/udon_chicken.jpg" },
  { id: 6, name: "Ролл Филадельфия", description: "Лосось, сливочный сыр и рис.", price: 620, category: "asian", image: "icons/filadelfia.jpg" },
  { id: 7, name: "Том Кха", description: "Кокосовый суп с курицей и грибами.", price: 570, category: "asian", image: "icons/tom_kha.jpg" },
  { id: 8, name: "Рис с морепродуктами", description: "Жареный рис с креветками и кальмаром.", price: 650, category: "asian", image: "icons/rice_with_seefood.jpg" },
  { id: 9, name: "Паста Карбонара", description: "Спагетти, сливочный соус, бекон.", price: 560, category: "european", image: "icons/karbonara.jpg" },
  { id: 10, name: "Паста Болоньезе", description: "Спагетти с томатно-мясным соусом.", price: 540, category: "european", image: "icons/boloniez.webp" },
  { id: 11, name: "Лазанья", description: "Классическая лазанья с говядиной.", price: 590, category: "european", image: "icons/lasagna.jpg" },
  { id: 12, name: "Пицца Маргарита", description: "Томатный соус, моцарелла, базилик.", price: 550, category: "european", image: "icons/pizza-margarita.jpg" },
  { id: 13, name: "Пицца Пепперони", description: "Моцарелла и пепперони на тонком тесте.", price: 620, category: "european", image: "icons/pizza_pepperoni.jpg" },
  { id: 14, name: "Стейк с овощами", description: "Говяжий стейк и гриль-овощи.", price: 980, category: "european", image: "icons/steak.jpg" },
  { id: 15, name: "Ризотто с грибами", description: "Кремовое ризотто с белыми грибами.", price: 640, category: "european", image: "icons/rizotto.jpg" },
  { id: 16, name: "Цезарь с курицей", description: "Салат, курица, соус цезарь и пармезан.", price: 470, category: "european", image: "icons/caesar.webp" },
  { id: 17, name: "Чизкейк", description: "Нежный сливочный десерт.", price: 340, category: "dessert", image: "icons/cheesecake.png" },
  { id: 18, name: "Тирамису", description: "Итальянский десерт с кофе и маскарпоне.", price: 360, category: "dessert", image: "icons/teramisu.jpg" },
  { id: 19, name: "Лимонад", description: "Освежающий домашний лимонад.", price: 240, category: "drink", image: "icons/lemonade.webp" },
  { id: 20, name: "Матча-латте", description: "Молочный напиток с японским чаем матча.", price: 320, category: "drink", image: "icons/matcha_latte.jpg" }
];

// SECTION: Константы для бронирования (слоты времени)
const availableTimes = [
  "12:00", "13:30", "15:00", "16:30", "18:00", "19:30", "21:00"
];

// SECTION: Состояние корзины и брони (с сохранением в localStorage)
let cart = JSON.parse(localStorage.getItem("nw_cart") || "[]");
let bookings = JSON.parse(localStorage.getItem("nw_bookings") || "{}");

// SECTION: Ссылки на DOM-элементы
const menuGrid = document.getElementById("menuGrid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const bookingForm = document.getElementById("bookingForm");
const bookingDateInput = document.getElementById("bookingDate");
const bookingTimeSelect = document.getElementById("bookingTime");
const bookedList = document.getElementById("bookedList");
const addSetBtn = document.getElementById("addSetBtn");
const miniBookingPreview = document.getElementById("miniBookingPreview");
const menuFilters = document.getElementById("menuFilters");
let activeMenuFilter = "all";

// SECTION: Утилиты сохранения данных
function saveCart() {
  localStorage.setItem("nw_cart", JSON.stringify(cart));
}

function saveBookings() {
  localStorage.setItem("nw_bookings", JSON.stringify(bookings));
}

// SECTION: Рендер карточек меню
function renderMenu() {
  if (!menuGrid) return;
  const visibleDishes = activeMenuFilter === "all"
    ? menuData
    : menuData.filter((item) => item.category === activeMenuFilter);

  if (visibleDishes.length === 0) {
    menuGrid.innerHTML = "<p class='menu-empty'>В этой категории пока нет блюд.</p>";
    return;
  }

  menuGrid.innerHTML = visibleDishes.map((item) => `
    <article class="glass-card menu-card">
      <img src="${item.image || fallbackDishImage}" alt="${item.name}" />
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <div class="price-row">
        <strong>${item.price} ₽</strong>
        <button class="btn btn-ghost" data-add="${item.id}">В корзину</button>
      </div>
    </article>
  `).join("");
}

// SECTION: Добавление товара в корзину
function addToCart(id) {
  const item = menuData.find((dish) => dish.id === id);
  if (!item) return;

  const existing = cart.find((row) => row.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
  }
  saveCart();
  renderCart();
}

// SECTION: Изменение количества товара в корзине
function changeQty(id, delta) {
  const row = cart.find((entry) => entry.id === id);
  if (!row) return;
  row.qty += delta;
  if (row.qty <= 0) {
    cart = cart.filter((entry) => entry.id !== id);
  }
  saveCart();
  renderCart();
}

// SECTION: Рендер корзины и итогов
function renderCart() {
  if (!cartItems || !cartCount || !cartTotal) return;
  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Корзина пока пустая.</p>";
  } else {
    cartItems.innerHTML = cart.map((row) => `
      <div class="cart-item">
        <div>
          <strong>${row.name}</strong><br />
          <small>${row.price} ₽ x ${row.qty}</small>
        </div>
        <div><strong>${row.price * row.qty} ₽</strong></div>
        <div class="mini-actions">
          <button class="mini-btn" data-minus="${row.id}">-</button>
          <button class="mini-btn" data-plus="${row.id}">+</button>
          <button class="mini-btn" data-remove="${row.id}">x</button>
        </div>
      </div>
    `).join("");
  }

  const totalQty = cart.reduce((acc, row) => acc + row.qty, 0);
  const totalPrice = cart.reduce((acc, row) => acc + row.qty * row.price, 0);
  cartCount.textContent = String(totalQty);
  cartTotal.textContent = `${totalPrice} ₽`;
}

// SECTION: Формирование опций времени с учетом уже занятых слотов на выбранную дату
function renderTimeOptions(dateValue) {
  if (!bookingTimeSelect) return;
  const taken = bookings[dateValue] || [];
  const freeSlots = availableTimes.filter((time) => !taken.includes(time));

  if (!dateValue) {
    bookingTimeSelect.innerHTML = "<option value=''>Сначала выберите дату</option>";
    return;
  }

  if (freeSlots.length === 0) {
    bookingTimeSelect.innerHTML = "<option value=''>Нет свободных слотов</option>";
    return;
  }

  bookingTimeSelect.innerHTML = freeSlots.map((time) =>
    `<option value="${time}">${time}</option>`
  ).join("");
}

// SECTION: Рендер списка всех занятых бронирований
function renderBookedList() {
  if (!bookedList) return;
  const all = Object.entries(bookings)
    .flatMap(([date, times]) => times.map((time) => ({ date, time })))
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  if (all.length === 0) {
    bookedList.innerHTML = "<p>Пока нет броней.</p>";
    return;
  }

  bookedList.innerHTML = all.map((entry) => `
    <div class="booked-item">
      ${entry.date} • ${entry.time}
    </div>
  `).join("");
}

// SECTION: Дополнительная фича случайный "Сет дня" из 3 блюд
function addRandomSet() {
  const shuffled = [...menuData].sort(() => Math.random() - 0.5);
  const chosen = shuffled.slice(0, 3);
  chosen.forEach((dish) => addToCart(dish.id));
  alert(`В корзину добавлен сет: ${chosen.map((d) => d.name).join(", ")}`);
}

// SECTION: Краткий превью-список ближайших броней для главной страницы
function renderMiniBookingPreview() {
  if (!miniBookingPreview) return;
  const all = Object.entries(bookings)
    .flatMap(([date, times]) => times.map((time) => ({ date, time })))
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
    .slice(0, 5);

  if (all.length === 0) {
    miniBookingPreview.innerHTML = "<p>Свободно: все слоты доступны.</p>";
    return;
  }

  miniBookingPreview.innerHTML = all
    .map((entry) => `<div class="booked-item">${entry.date} • ${entry.time}</div>`)
    .join("");
}

// SECTION: Назначение обработчиков событий
if (menuGrid) {
  menuGrid.addEventListener("click", (event) => {
    const addId = Number(event.target.dataset.add);
    if (addId) addToCart(addId);
  });
}

if (menuFilters) {
  menuFilters.addEventListener("click", (event) => {
    const filterButton = event.target.closest("[data-filter]");
    if (!filterButton) return;
    activeMenuFilter = filterButton.dataset.filter;

    menuFilters.querySelectorAll(".filter-btn").forEach((button) => {
      button.classList.remove("is-active");
    });
    filterButton.classList.add("is-active");
    renderMenu();
  });
}

if (cartItems) {
  cartItems.addEventListener("click", (event) => {
    const plusId = Number(event.target.dataset.plus);
    const minusId = Number(event.target.dataset.minus);
    const removeId = Number(event.target.dataset.remove);
    if (plusId) changeQty(plusId, 1);
    if (minusId) changeQty(minusId, -1);
    if (removeId) {
      cart = cart.filter((row) => row.id !== removeId);
      saveCart();
      renderCart();
    }
  });
}

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Корзина пустая. Добавьте хотя бы одно блюдо.");
      return;
    }
    alert("Заказ оформлен! (демо-режим)");
    cart = [];
    saveCart();
    renderCart();
  });
}

if (bookingDateInput) {
  bookingDateInput.addEventListener("change", () => {
    renderTimeOptions(bookingDateInput.value);
  });
}

if (bookingForm && bookingDateInput && bookingTimeSelect) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("guestName").value.trim();
    const phone = document.getElementById("guestPhone").value.trim();
    const date = bookingDateInput.value;
    const time = bookingTimeSelect.value;
    const guests = document.getElementById("guestCount").value;

    if (!name || !phone || !date || !time || !guests) {
      alert("Пожалуйста, заполните все поля.");
      return;
    }

    const taken = bookings[date] || [];
    if (taken.includes(time)) {
      alert("Это время уже занято. Выберите другой слот.");
      renderTimeOptions(date);
      return;
    }

    bookings[date] = [...taken, time].sort();
    saveBookings();
    renderBookedList();
    renderMiniBookingPreview();
    renderTimeOptions(date);

    alert(`Бронь подтверждена: ${name}, ${date} в ${time} (${guests} гостя/гостей).`);
    bookingForm.reset();
    renderTimeOptions("");
  });
}

if (addSetBtn) {
  addSetBtn.addEventListener("click", addRandomSet);
}

// SECTION: Инициализация страницы
if (bookingDateInput) {
  bookingDateInput.min = new Date().toISOString().split("T")[0];
}
renderMenu();
renderCart();
renderBookedList();
renderMiniBookingPreview();
renderTimeOptions("");
