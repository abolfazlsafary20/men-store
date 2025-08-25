document.addEventListener('DOMContentLoaded', function () {
  const menuItems = document.querySelectorAll('.menu-item');
  const content = document.getElementById('main-content');

  // فانکشن برای بارگذاری محتوا با AJAX
  async function loadSection(section) {
    try {
      const response = await fetch(section + '.html');
      if (!response.ok) throw new Error('صفحه یافت نشد');
      const html = await response.text();
      content.innerHTML = html;
      // تغییر URL بدون رفرش
      history.pushState(null, '', section + '.html');
    } catch (err) {
      content.innerHTML = `<p>خطا در بارگذاری دسته‌بندی: ${err.message}</p>`;
    }
  }

  menuItems.forEach(item => {
    item.addEventListener('click', function () {
      const section = this.getAttribute('data-section');
      loadSection(section);
    });
  });

  // اگر کاربر با دکمه Back/Forward مرورگر حرکت کرد
  window.addEventListener('popstate', () => {
    const path = location.pathname.split('/').pop().replace('.html', '');
    if (path && path !== 'index') loadSection(path);
  });

  // ---------- کد فرم ثبت‌نام و ورود ----------
  function clearMessageAfterTimeout(element, timeout = 3000) {
    if (!element) return;
    setTimeout(() => {
      element.textContent = "";
    }, timeout);
  }

  const overlay = document.getElementById('overlay');

  // فرم ثبت نام
  const registerForm = document.getElementById('registerForm');
  const registerMessage = document.getElementById('register-message');

  if (registerForm) {
    registerForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const username = document.getElementById('register-username').value.trim();
      const email = document.getElementById('register-email').value.trim();
      const password = document.getElementById('register-password').value.trim();

      if (username && email && password) {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'register.php', true);
        xhr.onload = function() {
          registerMessage.textContent = xhr.responseText;
          registerMessage.style.color = xhr.responseText.includes('✅') ? 'green' : 'red';
          clearMessageAfterTimeout(registerMessage);
        };
        xhr.onerror = function() {
          registerMessage.textContent = "❌ خطای شبکه";
          registerMessage.style.color = "red";
          clearMessageAfterTimeout(registerMessage);
        };
        xhr.send(formData);
      } else {
        registerMessage.textContent = "لطفاً تمام فیلدها را پر کنید.";
        registerMessage.style.color = "red";
        clearMessageAfterTimeout(registerMessage);
      }
    });
  }

  // فرم ورود
  const loginForm = document.getElementById('loginForm');
  const loginMessage = document.getElementById('login-message');

  if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();

      if (email && password) {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'login.php', true);
        xhr.onload = function() {
          if (xhr.status === 200 && xhr.responseText.includes('✅')) {
            loginForm.style.display = 'none';
            overlay.style.display = 'none';

            let successDiv = document.getElementById('successMessage');
            if (!successDiv) {
              successDiv = document.createElement('div');
              successDiv.id = 'successMessage';
              successDiv.style.cssText = "text-align:center; margin-top:50px; font-size:24px; color:green; font-weight:bold; padding:15px; border:2px solid green; border-radius:8px;";
              loginForm.parentNode.appendChild(successDiv);
            }
            successDiv.textContent = "با موفقیت وارد شدید!";
            successDiv.style.display = 'block';
            setTimeout(() => { successDiv.style.display = 'none'; }, 3000);

            loginMessage.textContent = "";
          } else {
            loginMessage.textContent = xhr.responseText;
            loginMessage.style.color = 'red';
            clearMessageAfterTimeout(loginMessage);
          }
        };
        xhr.onerror = function() {
          loginMessage.textContent = "❌ خطای شبکه";
          loginMessage.style.color = "red";
          clearMessageAfterTimeout(loginMessage);
        };
        xhr.send(formData);
      } else {
        loginMessage.textContent = "لطفاً تمام فیلدها را پر کنید.";
        loginMessage.style.color = "red";
        clearMessageAfterTimeout(loginMessage);
      }
    });
  }

  // بستن فرم‌ها
  const closeRegisterBtn = document.getElementById('closeRegisterForm');
  const closeLoginBtn = document.getElementById('closeLoginForm');

  if (closeRegisterBtn) closeRegisterBtn.addEventListener('click', () => {
    registerForm.style.display = 'none';
    overlay.style.display = 'none';
    registerMessage.textContent = "";
  });

  if (closeLoginBtn) closeLoginBtn.addEventListener('click', () => {
    loginForm.style.display = 'none';
    overlay.style.display = 'none';
    loginMessage.textContent = "";
  });

  if (overlay) overlay.addEventListener('click', () => {
    registerForm.style.display = 'none';
    loginForm.style.display = 'none';
    overlay.style.display = 'none';
  });

  // ---------- بنر متحرک ----------
  const banners = document.querySelectorAll('.banner-slider img');
  const prevBtn = document.querySelector('.banner-slider .prev');
  const nextBtn = document.querySelector('.banner-slider .next');
  let currentBanner = 0;

  function showBanner(index) {
    banners.forEach((img, i) => img.classList.remove('active'));
    banners[index].classList.add('active');
  }

  if (banners.length) {
    showBanner(currentBanner);

    if (nextBtn) nextBtn.addEventListener('click', () => {
      currentBanner = (currentBanner + 1) % banners.length;
      showBanner(currentBanner);
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
      currentBanner = (currentBanner - 1 + banners.length) % banners.length;
      showBanner(currentBanner);
    });

    setInterval(() => {
      currentBanner = (currentBanner + 1) % banners.length;
      showBanner(currentBanner);
    }, 4000);
  }
});

// نمایش فرم‌ها
function showSignupForm() {
  document.getElementById('registerForm').style.display = 'block';
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('overlay').style.display = 'block';
}

function showLoginForm() {
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
}

document.addEventListener("DOMContentLoaded", function() {
  // وقتی profile container لود شد
  const profileContainer = document.getElementById("profile-container");

  // اضافه شدن منو بعد از fetch
  fetch("profile.php")
    .then(response => response.text())
    .then(data => {
      profileContainer.innerHTML = data;

      // بعد از اینکه HTML اضافه شد، event listener اضافه کنیم
      const profileIcon = document.getElementById("profileIcon");
      const profileMenu = document.getElementById("profileMenu");

      profileIcon.addEventListener("click", function(e) {
        e.stopPropagation();
        profileMenu.classList.toggle("active");
      });

      document.addEventListener("click", function() {
        profileMenu.classList.remove("active");
      });

      profileMenu.addEventListener("click", function(e) {
        e.stopPropagation();
      });
    });
});
