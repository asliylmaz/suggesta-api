const authService = require("../services/authService");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, surname, username, email, password, birthdate } = req.body;

    // Basit Validasyon (Zorunlu alanlar)
    if (!name || !surname || !email || !username || !password || !birthdate) {
      return res.status(400).json({
        success: false,
        message: "Zorunlu alanlar eksik",
      });
    }

    // Service çağır
    const result = await authService.register({
      name,
      surname,
      username,
      email,
      password,
      birthdate,
    });

    res.status(201).json({
      success: true,
      message: "Kayıt başarılı",
      data: result,
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message || "Bir hata oluştu",
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email ve şifre zorunlu",
      });
    }

    // Service çağır
    const result = await authService.login({ email, password });

    res.status(200).json({
      success: true,
      message: "Giriş başarılı",
      data: result,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message || "Giriş başarısız",
    });
  }
};
