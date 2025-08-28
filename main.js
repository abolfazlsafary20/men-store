document.addEventListener('DOMContentLoaded', function () {
  const menuItems = document.querySelectorAll('.menu-item');
  const content = document.getElementById('main-content');

  const sections = {
    tshirt: '<h2>تیشرت‌های مردانه</h2><p>مدل‌های متنوع تیشرت با بهترین قیمت.</p>',
    shoes: '<h2>کتونی‌های اسپرت</h2><p>انواع کتونی‌های راحت و اسپرت برای هر سلیقه‌ای.</p>',
    pants: '<h2>شلوارهای مردانه</h2><p>شلوار جین، کتان و رسمی.</p>',
    watch: '<h2>ساعت‌های مردانه</h2><p>ساعت‌های شیک و لوکس.</p>',
    glasses: '<h2>عینک‌های آفتابی</h2><p>عینک‌های ترند و خاص.</p>'
  };

  menuItems.forEach(item => {
    item.addEventListener('click', function () {
      const section = this.getAttribute('data-section');
      content.innerHTML = sections[section] || '<p>دسته‌بندی مورد نظر پیدا نشد.</p>';
    });
  });

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
          if (xhr.status === 200) {
            registerMessage.textContent = xhr.responseText;
            registerMessage.style.color = xhr.responseText.includes('✅') ? 'green' : 'red';
            clearMessageAfterTimeout(registerMessage, 3000);
          } else {
            registerMessage.textContent = "❌ خطا در ثبت‌نام.";
            registerMessage.style.color = "red";
            clearMessageAfterTimeout(registerMessage, 3000);
          }
        };
        xhr.onerror = function() {
          registerMessage.textContent = "❌ خطای شبکه. لطفاً دوباره تلاش کنید.";
          registerMessage.style.color = "red";
          clearMessageAfterTimeout(registerMessage, 3000);
        };
        xhr.send(formData);
      } else {
        registerMessage.textContent = "لطفاً تمام فیلدها را پر کنید.";
        registerMessage.style.color = "red";
        clearMessageAfterTimeout(registerMessage, 3000);
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
          if (xhr.status === 200) {
            if (xhr.responseText.includes('✅')) {
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

              setTimeout(() => {
                successDiv.style.display = 'none';
              }, 3000);

              loginMessage.textContent = "";
            } else {
              loginMessage.textContent = xhr.responseText;
              loginMessage.style.color = 'red';
              clearMessageAfterTimeout(loginMessage, 3000);
            }
          } else {
            loginMessage.textContent = "❌ خطا در ورود.";
            loginMessage.style.color = "red";
            clearMessageAfterTimeout(loginMessage, 3000);
          }
        };
        xhr.onerror = function() {
          loginMessage.textContent = "❌ خطای شبکه. لطفاً دوباره تلاش کنید.";
          loginMessage.style.color = "red";
          clearMessageAfterTimeout(loginMessage, 3000);
        };
        xhr.send(formData);
      } else {
        loginMessage.textContent = "لطفاً تمام فیلدها را پر کنید.";
        loginMessage.style.color = "red";
        clearMessageAfterTimeout(loginMessage, 3000);
      }
    });
  }

  // بستن فرم‌ها
  const closeRegisterBtn = document.getElementById('closeRegisterForm');
  const closeLoginBtn = document.getElementById('closeLoginForm');

  if (closeRegisterBtn) {
    closeRegisterBtn.addEventListener('click', function () {
      if (registerForm) registerForm.style.display = 'none';
      overlay.style.display = 'none';
      registerMessage.textContent = "";
    });
  }

  if (closeLoginBtn) {
    closeLoginBtn.addEventListener('click', function () {
      if (loginForm) loginForm.style.display = 'none';
      overlay.style.display = 'none';
      loginMessage.textContent = "";
    });
  }

  if (overlay) {
    overlay.addEventListener('click', function() {
      if (registerForm) registerForm.style.display = 'none';
      if (loginForm) loginForm.style.display = 'none';
      overlay.style.display = 'none';
    });
  }

  // بنر متحرک
  const banners = document.querySelectorAll('.banner-slider img');
  if (banners.length) {
    let currentBanner = 0;
    banners[currentBanner].classList.add('active');
    setInterval(() => {
      banners[currentBanner].classList.remove('active');
      currentBanner = (currentBanner + 1) % banners.length;
      banners[currentBanner].classList.add('active');
    }, 4000);
  }
});

// نمایش فرم ثبت‌نام
function showSignupForm() {
  document.getElementById('registerForm').style.display = 'block';
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('overlay').style.display = 'block';
}

// نمایش فرم ورود
function showLoginForm() {
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function () {
  const profileIcon = document.getElementById('profileIcon'); // آیکون منو
  const profileMenu = document.getElementById('profileMenu'); // منوی پروفایل

  profileIcon.addEventListener('click', function () {
    // چک می‌کنیم که منو نمایش داده بشه یا مخفی
    profileMenu.classList.toggle('active');
  });

  // وقتی کلیک در خارج از منو باشه، منو بسته بشه
  document.addEventListener('click', function (e) {
    if (!profileIcon.contains(e.target) && !profileMenu.contains(e.target)) {
      profileMenu.classList.remove('active');
    }
  });
});
