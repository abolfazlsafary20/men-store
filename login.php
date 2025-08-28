<?php
// نمایش خطاها فقط برای توسعه
error_reporting(E_ALL);
ini_set('display_errors', 1);

// اتصال به دیتابیس
$conn = new mysqli("localhost", "root", "", "shop_users");
if ($conn->connect_error) {
    die("❌ اتصال به دیتابیس ناموفق بود: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = trim($_POST["email"]);
    $password = $_POST["password"];

    if (empty($email) || empty($password)) {
        echo "⚠ لطفاً ایمیل و رمز عبور را وارد کنید.";
        exit;
    }

    $stmt = $conn->prepare("SELECT password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 1) {
        $stmt->bind_result($hashedPassword);
        $stmt->fetch();

        if (password_verify($password, $hashedPassword)) {
            echo "✅ ورود با موفقیت انجام شد!";
            // اینجا میتونی session هم ست کنی برای ورود
        } else {
            echo "❌ رمز عبور اشتباه است.";
        }
    } else {
        echo "❌ ایمیل یافت نشد.";
    }

    $stmt->close();
}

$conn->close();
?>
