 let currentUser = null;
      let currentListId = null;
      let currentFilter = "all";
      let currentManagerTab = "pending";
      let selectedIcon = "🛒";
      let itemsFromDB = [];

      const store = {
        users: [
          { id: 1, name: "Aasim", role: "admin", createdAt: "2024-01-01" },
          { id: 2, name: "Mihir", role: "manager", createdAt: "2024-01-05" },
          { id: 3, name: "Sahil", role: "manager", createdAt: "2024-01-08" },
          { id: 4, name: "khushi", role: "user", createdAt: "2024-01-10" },
          { id: 5, name: "Rohan", role: "user", createdAt: "2024-01-12" },
          { id: 6, name: "Nidhi", role: "user", createdAt: "2024-01-15" },
        ],
        lists: [
          {
            id: 1,
            name: "Weekly Groceries",
            icon: "🛒",
            description: "Our regular household shop",
            color: "#16a34a",
            memberCount: 3,
          },
          {
            id: 2,
            name: "BBQ Party",
            icon: "🥩",
            description: "Everything for the Saturday BBQ",
            color: "#f59e0b",
            memberCount: 2,
          },
          {
            id: 3,
            name: "Healthy Meal Prep",
            icon: "🥗",
            description: "Veggies and proteins for the week",
            color: "#3b82f6",
            memberCount: 4,
          },
        ],
        categories: [
          "Dairy",
          "Bakery",
          "Meat",
          "Beverages",
          "Vegetables",
          "Grains",
          "Condiments",
          "Snacks",
          "Frozen",
          "Household",
        ],
        nextId: 100,
      };

      function getId() {
        return store.nextId++;
      }

      function loadItemsFromDB() {
  fetch("http://localhost:3000/items")
    .then(res => res.json())
    .then(data => {
      itemsFromDB = data;
      renderDashboard();
      if (currentListId) renderListDetail();
    });
}

      /* ===================== AUTH ===================== */
      function renderLogin() {
        const ul = document.getElementById("user-list");
        ul.innerHTML = store.users
          .map(
            (u) => `
    <button onclick="loginAs(${u.id})" style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border:1.5px solid #e2e8f0;border-radius:14px;background:#fff;cursor:pointer;width:100%;text-align:left;transition:border-color .15s;" onmouseover="this.style.borderColor='#16a34a'" onmouseout="this.style.borderColor='#e2e8f0'">
      <span style="font-weight:600;color:#1e293b;font-size:15px;">${u.name}</span>
      <span class="badge badge-${u.role}">${cap(u.role)}</span>
    </button>
  `,
          )
          .join("");
      }

      function loginAs(userId) {
        if (userId === null) {
          currentUser = { id: 0, name: "Guest", role: "user" };
        } else {
          currentUser = store.users.find((u) => u.id === userId);
        }
        document.getElementById("page-login").style.display = "none";
        document.getElementById("page-app").style.display = "block";
        updateUserChip();
        updateNavForRole();
        showView("dashboard");
      }

      function logout() {
        currentUser = null;
        document.getElementById("page-login").style.display = "flex";
        document.getElementById("page-app").style.display = "none";
        renderLogin();
      }

      function updateUserChip() {
        document.getElementById("user-chip-name").textContent =
          currentUser.name;
        document.getElementById("user-avatar").textContent =
          currentUser.name[0].toUpperCase();
        document.getElementById("user-chip-badge").innerHTML =
          `<span class="badge badge-${currentUser.role}" style="font-size:10px;">${cap(currentUser.role)}</span>`;
      }

      function updateNavForRole() {
        const r = currentUser.role;
        document.getElementById("nav-manager").style.display =
          r === "manager" || r === "admin" ? "flex" : "none";
        document.getElementById("nav-admin").style.display =
          r === "admin" ? "flex" : "none";
      }

      /* ===================== NAVIGATION ===================== */
      function showView(view) {
        document
          .querySelectorAll(".view")
          .forEach((v) => (v.style.display = "none"));
        document
          .querySelectorAll(".sidebar-link")
          .forEach((l) => l.classList.remove("active"));

        const el = document.getElementById("view-" + view);
        if (el) el.style.display = "block";

        const navEl = document.getElementById("nav-" + view);
        if (navEl) navEl.classList.add("active");

        if (view === "dashboard") renderDashboard();
        if (view === "categories") renderCategories();
        if (view === "manager") renderManagerItems();
        if (view === "admin") renderAdminUsers();
        if (view === "create") resetCreateForm();
      }

      function toggleMobileNav() {
        const s = document.getElementById("sidebar");
        s.style.display =
          s.style.display === "none" || !s.style.display ? "flex" : "none";
      }

      /* ===================== DASHBOARD ===================== */
      function renderDashboard() {
        const allItems = itemsFromDB;
        const checked = allItems.filter((i) => i.checked).length;
        const pending = allItems.filter((i) => i.status === "pending").length;

        document.getElementById("stat-lists").textContent = store.lists.length;
        document.getElementById("stat-lists-sub").textContent =
          `${store.lists.length} active`;
        document.getElementById("stat-checked").textContent = checked;
        document.getElementById("stat-checked-sub").textContent =
          `out of ${allItems.length} total items`;
        document.getElementById("stat-pending").textContent = pending;

        const grid = document.getElementById("lists-grid");
        grid.innerHTML = store.lists
          .map((list) => {
            const items = itemsFromDB.filter((i) => i.listId === list.id);
            const total = items.length;
            const done = items.filter((i) => i.checked).length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            const pend = items.filter((i) => i.status === "pending").length;
            return `
      <div class="list-card" onclick="openList(${list.id})">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
          <div style="font-size:17px;font-weight:700;color:#1e293b;">${list.icon} ${list.name}</div>
          ${pend > 0 ? `<span class="badge badge-pending">${pend} pending</span>` : ""}
        </div>
        <div style="font-size:13px;color:#64748b;margin-bottom:16px;">${list.description || "No description"}</div>
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;">
          <span style="color:#64748b;">${done} / ${total} items</span>
          <span style="font-weight:700;color:#16a34a;">${pct}%</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${list.color}"></div></div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;padding-top:12px;border-top:1px solid #f1f5f9;font-size:12px;color:#94a3b8;">
          <span>👥 ${list.memberCount} members</span>
          <span>Open →</span>
        </div>
      </div>`;
          })
          .join("");
      }

      /* ===================== LIST DETAIL ===================== */
      function openList(id) {
        currentListId = id;
        currentFilter = "all";
        document
          .querySelectorAll(".view")
          .forEach((v) => (v.style.display = "none"));
        document
          .querySelectorAll(".sidebar-link")
          .forEach((l) => l.classList.remove("active"));
        document.getElementById("view-list").style.display = "block";
        renderListDetail();
      }

      function renderListDetail() {
        const list = store.lists.find((l) => l.id === currentListId);
        if (!list) return;
        const items = itemsFromDB.filter((i) => i.listId === currentListId);
        const total = items.length;
        const done = items.filter((i) => i.checked).length;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;

        document.getElementById("list-detail-header").innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;">
      <div>
        <div style="font-size:26px;font-weight:700;color:#1e293b;">${list.icon} ${list.name}</div>
        <div style="color:#64748b;margin-top:4px;">${list.description || ""}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:30px;font-weight:700;color:#16a34a;">${pct}%</div>
        <div style="font-size:12px;color:#94a3b8;">Completed</div>
      </div>
    </div>
    <div class="progress-bar" style="margin-top:16px;"><div class="progress-fill" style="width:${pct}%;background:${list.color}"></div></div>
  `;

        const checkedCount = items.filter((i) => i.checked).length;
        const ccBtn = document.getElementById("clear-checked-btn");
        ccBtn.style.display =
          checkedCount > 0 && currentFilter !== "active"
            ? "inline-flex"
            : "none";
        ccBtn.textContent = `Clear ${checkedCount} completed`;

        renderItems();
      }

      function renderItems() {
        const list = store.lists.find((l) => l.id === currentListId);
        if (!list) return;
        let items = itemsFromDB.filter((i) => i.listId === currentListId);
        if (currentFilter === "active") items = items.filter((i) => !i.checked);
        if (currentFilter === "completed")
          items = items.filter((i) => i.checked);

        const grouped = {};
        items.forEach((item) => {
          const cat = item.category || "Uncategorized";
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push(item);
        });

        const container = document.getElementById("items-container");
        if (items.length === 0) {
          container.innerHTML = `
      <div style="text-align:center;padding:48px;border:2px dashed #e2e8f0;border-radius:16px;background:#fff;">
        <div style="font-size:40px;margin-bottom:12px;">✅</div>
        <div style="font-weight:600;color:#1e293b;">All caught up!</div>
        <div style="color:#64748b;font-size:14px;margin-top:4px;">${currentFilter === "active" ? "Nothing left to buy." : "No items yet. Add one above!"}</div>
      </div>`;
          return;
        }

        const canCheck = (role) => role === "manager" || role === "admin";

        container.innerHTML = Object.entries(grouped)
          .map(
            ([cat, catItems]) => `
    <div style="margin-bottom:24px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
        <span style="background:#f1f5f9;border:1px solid #e2e8f0;border-radius:20px;padding:3px 12px;font-size:13px;font-weight:600;color:#374151;">${cat}</span>
        <span style="font-size:13px;color:#94a3b8;">${catItems.length} items</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;">
        ${catItems
          .map((item) => {
            const canToggle = item.status === "approved";
            return `
          <div class="item-row" id="item-row-${item.id}">
            <div style="display:flex;align-items:center;gap:14px;flex:1;min-width:0;">
              <div class="checkbox ${item.checked ? "checked" : ""}" onclick="${canToggle ? `toggleItem(${item.id})` : `showToast('Item must be approved before checking off')`}" title="${canToggle ? "" : "Awaiting approval"}">
                ${item.checked ? `<svg width="12" height="12" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>` : ""}
              </div>
              <div style="flex:1;min-width:0;">
                <div style="font-size:16px;font-weight:500;color:${item.checked ? "#94a3b8" : "#1e293b"};${item.checked ? "text-decoration:line-through;" : ""}">${item.name}</div>
                ${item.quantity ? `<div style="font-size:12px;color:#94a3b8;">Qty: ${item.quantity}</div>` : ""}
                ${item.reviewNote ? `<div style="font-size:12px;color:#9ca3af;font-style:italic;">Note: ${item.reviewNote}</div>` : ""}
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
              <span class="badge badge-${item.status}">${cap(item.status)}</span>
              <button class="btn btn-ghost btn-sm" style="color:#ef4444;padding:4px 8px;" onclick="deleteItem(${item.id})">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              </button>
            </div>
          </div>`;
          })
          .join("")}
      </div>
    </div>
  `,
          )
          .join("");
      }

 function addItem() {
  const input = document.getElementById("new-item-input");
  const name = input.value.trim();

  if (!name) {
    showToast("Please enter an item name");
    return;
  }

  fetch("http://localhost:3000/add-item", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name,
      listId: currentListId,
      category: "Uncategorized",
      status: "pending",
      checked: false,
      quantity: "",
      addedBy: currentUser?.name || "Guest",
      approvedBy: null,
      reviewNote: null
    })
  })
  .then(res => res.text())
  .then(() => {
    input.value = "";
    loadItemsFromDB();
    showToast(`"${name}" added — awaiting approval`);
  });
}
      function toggleItem(id) {
        const item = itemsFromDB.find((i) => i.id === id);
        if (!item) return;
        if (item.status !== "approved") {
          showToast("Item must be approved before checking off");
          return;
        }
        item.checked = !item.checked;
        renderListDetail();
      }

function deleteItem(id) {
  fetch(`http://localhost:3000/delete-item/${id}`, {
    method: "DELETE"
  })
  .then(res => res.text())
  .then(() => {
    loadItemsFromDB();
    showToast("Item removed");
  });
}

      function clearChecked() {
        itemsFromDB = itemsFromDB.filter(
          (i) => !(i.listId === currentListId && i.checked),
        );
        renderListDetail();
        showToast("Completed items cleared");
      }

      function setFilter(f, btn) {
        currentFilter = f;
        document
          .querySelectorAll("#filter-bar .tab")
          .forEach((t) => t.classList.remove("active"));
        btn.classList.add("active");
        renderListDetail();
      }

      /* ===================== CATEGORIES ===================== */
      function renderCategories() {
        const list = document.getElementById("cat-list");
        list.innerHTML =
          store.categories
            .map(
              (cat, i) => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f1f5f9;">
      <span style="font-weight:500;color:#1e293b;">${cat}</span>
      <button class="btn btn-ghost btn-sm" style="color:#ef4444;" onclick="deleteCategory(${i})">Remove</button>
    </div>
  `,
            )
            .join("") ||
          '<p style="color:#94a3b8;text-align:center;padding:24px 0;">No categories yet.</p>';
      }

      function addCategory() {
        const input = document.getElementById("cat-input");
        const val = input.value.trim();
        if (!val) return;
        if (store.categories.includes(val)) {
          showToast("Category already exists");
          return;
        }
        store.categories.push(val);
        input.value = "";
        renderCategories();
        showToast(`Category "${val}" added`);
      }

      function deleteCategory(index) {
        store.categories.splice(index, 1);
        renderCategories();
      }

      /* ===================== CREATE LIST ===================== */
      function resetCreateForm() {
        document.getElementById("create-name").value = "";
        document.getElementById("create-desc").value = "";
        selectedIcon = "🛒";
        document
          .querySelectorAll(".icon-btn")
          .forEach((b) => b.classList.remove("active"));
        document.querySelector('[data-icon="🛒"]').classList.add("active");
      }

      function pickIcon(btn, icon) {
        selectedIcon = icon;
        document
          .querySelectorAll(".icon-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      }

      function createList() {
        const name = document.getElementById("create-name").value.trim();
        if (!name) {
          showToast("Please enter a list name");
          return;
        }
        const colors = [
          "#16a34a",
          "#f59e0b",
          "#3b82f6",
          "#8b5cf6",
          "#ef4444",
          "#ec4899",
        ];
        const list = {
          id: getId(),
          name,
          icon: selectedIcon,
          description: document.getElementById("create-desc").value.trim(),
          color: colors[store.lists.length % colors.length],
          memberCount: 1,
        };
        showToast(`List "${name}" created!`);
        showView("dashboard");
      }

      /* ===================== MANAGER DASHBOARD ===================== */
      function setManagerTab(tab, btn) {
        currentManagerTab = tab;
        document
          .querySelectorAll("#manager-tabs .tab")
          .forEach((t) => t.classList.remove("active"));
        btn.classList.add("active");
        renderManagerItems();
      }

      function renderManagerItems() {
        const items = itemsFromDB.filter((i) => i.status === currentManagerTab);
        const container = document.getElementById("manager-items-list");

        if (items.length === 0) {
          container.innerHTML = `<div style="text-align:center;padding:40px;color:#94a3b8;">
      <div style="font-size:36px;margin-bottom:12px;">📋</div>
      <div style="font-weight:600;">No ${currentManagerTab} items</div>
    </div>`;
          return;
        }

        container.innerHTML = items
          .map((item) => {
            const list = store.lists.find((l) => l.id === item.listId);
            return `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:16px;border:1px solid #e2e8f0;border-radius:14px;margin-bottom:12px;background:#fff;flex-wrap:wrap;gap:12px;">
      <div style="flex:1;min-width:200px;">
        <div style="font-weight:700;font-size:16px;color:#1e293b;">${item.name}</div>
        <div style="font-size:13px;color:#64748b;margin-top:2px;">List: ${list ? list.icon + " " + list.name : "—"} · Added by: ${item.addedBy || "Unknown"}</div>
        ${item.quantity ? `<div style="font-size:13px;color:#94a3b8;">Qty: ${item.quantity}</div>` : ""}
        ${item.reviewNote ? `<div style="font-size:13px;color:#94a3b8;font-style:italic;margin-top:4px;">Note: ${item.reviewNote}</div>` : ""}
      </div>
      <div style="display:flex;gap:8px;align-items:center;flex-shrink:0;">
        ${
          currentManagerTab === "pending"
            ? `
          <button class="btn btn-green btn-sm" onclick="openApproveModal(${item.id})">✓ Approve</button>
          <button class="btn btn-red btn-sm"   onclick="openRejectModal(${item.id})">✕ Reject</button>
        `
            : currentManagerTab === "approved"
              ? `
          <span class="badge badge-approved">Approved by ${item.approvedBy}</span>
        `
              : `
          <span class="badge badge-rejected">Rejected by ${item.approvedBy}</span>
        `
        }
      </div>
    </div>`;
          })
          .join("");
      }

      function openApproveModal(itemId) {
        const item = itemsFromDB.find((i) => i.id === itemId);
        document.getElementById("modal-box").innerHTML = `
    <h2 style="font-size:20px;font-weight:700;margin:0 0 20px;">Approve Item</h2>
    <div style="margin-bottom:14px;">
      <label style="font-size:13px;font-weight:600;color:#374151;display:block;margin-bottom:6px;">Quantity (optional edit)</label>
      <input id="modal-qty" class="input" value="${item.quantity || ""}" />
    </div>
    <div style="margin-bottom:20px;">
      <label style="font-size:13px;font-weight:600;color:#374151;display:block;margin-bottom:6px;">Note (optional)</label>
      <input id="modal-note" class="input" placeholder="Optional approval note" />
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end;">
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="approveItem(${itemId})">Approve</button>
    </div>`;
        document.getElementById("modal-overlay").classList.add("open");
      }

      function openRejectModal(itemId) {
        document.getElementById("modal-box").innerHTML = `
    <h2 style="font-size:20px;font-weight:700;margin:0 0 20px;">Reject Item</h2>
    <div style="margin-bottom:20px;">
      <label style="font-size:13px;font-weight:600;color:#374151;display:block;margin-bottom:6px;">Reason for rejection *</label>
      <input id="modal-note" class="input" placeholder="e.g. Already have enough" />
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end;">
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
      <button class="btn btn-red btn-sm" style="padding:8px 18px;" onclick="rejectItem(${itemId})">Reject</button>
    </div>`;
        document.getElementById("modal-overlay").classList.add("open");
      }

      function approveItem(itemId) {
        const item = itemsFromDB.find((i) => i.id === itemId);
        const qty = document.getElementById("modal-qty")?.value.trim();
        const note = document.getElementById("modal-note")?.value.trim();
        item.status = "approved";
        item.approvedBy = currentUser.name;
        item.reviewNote = note || null;
        if (qty) item.quantity = qty;
        closeModal();
        renderManagerItems();
        showToast(`"${item.name}" approved`);
      }

      function rejectItem(itemId) {
        const note = document.getElementById("modal-note")?.value.trim();
        if (!note) {
          showToast("Please provide a rejection reason");
          return;
        }
        const item = store.items.find((i) => i.id === itemId);
        item.status = "rejected";
        item.approvedBy = currentUser.name;
        item.reviewNote = note;
        closeModal();
        renderManagerItems();
        showToast(`"${item.name}" rejected`);
      }

      function closeModal(event) {
        if (event && event.target !== document.getElementById("modal-overlay"))
          return;
        document.getElementById("modal-overlay").classList.remove("open");
      }

      /* ===================== ADMIN PANEL ===================== */
      function renderAdminUsers() {
        const tbody = document.getElementById("admin-users-table");
        tbody.innerHTML = store.users
          .map(
            (u) => `
    <tr>
      <td style="font-weight:600;">${u.name} ${u.id === currentUser.id ? '<span style="font-size:11px;color:#94a3b8;">(you)</span>' : ""}</td>
      <td><span class="badge badge-${u.role}">${cap(u.role)}</span></td>
      <td style="color:#94a3b8;">${u.createdAt}</td>
      <td style="text-align:right;">
        <div style="display:flex;gap:8px;justify-content:flex-end;align-items:center;">
          <select class="select" ${u.id === currentUser.id ? 'disabled style="opacity:.5;"' : ""} onchange="adminChangeRole(${u.id},this.value)">
            <option value="user"    ${u.role === "user" ? "selected" : ""}>User</option>
            <option value="manager" ${u.role === "manager" ? "selected" : ""}>Manager</option>
            <option value="admin"   ${u.role === "admin" ? "selected" : ""}>Admin</option>
          </select>
          <button class="btn btn-ghost btn-sm" style="color:#ef4444;" ${u.id === currentUser.id ? 'disabled style="opacity:.4;"' : ""} onclick="adminDeleteUser(${u.id})">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `,
          )
          .join("");
      }

      function adminAddUser() {
        const name = document.getElementById("admin-new-name").value.trim();
        const role = document.getElementById("admin-new-role").value;
        if (!name) {
          showToast("Please enter a name");
          return;
        }
        store.users.push({
          id: getId(),
          name,
          role,
          createdAt: new Date().toISOString().split("T")[0],
        });
        document.getElementById("admin-new-name").value = "";
        renderAdminUsers();
        showToast(`User "${name}" added`);
      }

      function adminChangeRole(userId, newRole) {
        const u = store.users.find((u) => u.id === userId);
        if (!u) return;
        u.role = newRole;
        renderAdminUsers();
        showToast(`${u.name}'s role changed to ${newRole}`);
      }

      function adminDeleteUser(userId) {
        const u = store.users.find((u) => u.id === userId);
        if (!u) return;
        store.users = store.users.filter((u) => u.id !== userId);
        renderAdminUsers();
        showToast(`User "${u.name}" removed`);
      }

      /* ===================== UTILS ===================== */
      function cap(str) {
        return str ? str[0].toUpperCase() + str.slice(1) : "";
      }

      function showToast(msg) {
        const t = document.getElementById("toast");
        t.textContent = msg;
        t.classList.add("show");
        clearTimeout(t._timer);
        t._timer = setTimeout(() => t.classList.remove("show"), 3000);
      }

      /* ===================== INIT ===================== */
   renderLogin();
loadItemsFromDB();
