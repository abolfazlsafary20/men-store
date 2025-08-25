<?php
// نمایش خطاها فقط برای توسعه (در حالت نهایی بهتره غیرفعال باشه)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// اتصال به دیتابیس
$conn = new mysqli("localhost", "root", "", "shop_users");
if ($conn->connect_error) {
    die("❌ اتصال به دیتابیس ناموفق بود: " . $conn->connect_error);
}

// بررسی ارسال فرم
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // گرفتن ورودی‌ها و جلوگیری از کد مخرب
    $username = trim($_POST["username"]);
    $email = trim($_POST["email"]);
    $password = $_POST["password"];

    if (empty($username) || empty($email) || empty($password)) {
        echo "⚠ لطفا تمام فیلدها را پر کنید.";
        exit;
    }

    // بررسی ایمیل معتبر
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "⚠ ایمیل وارد شده معتبر نیست.";
        exit;
    }

    // هش کردن رمز عبور
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // بررسی ایمیل تکراری
    $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo "❌ این ایمیل قبلاً ثبت شده است.";
        $check->close();
        $conn->close();
        exit;
    }
    $check->close();

    // درج در دیتابیس
    $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $email, $hashedPassword);

    if ($stmt->execute()) {
        echo "✅ ثبت‌نام با موفقیت انجام شد!";
    } else {
        echo "❌ خطا در ثبت‌نام: " . $conn->error;
    }

    $stmt->close();
}

$conn->close();
?>
