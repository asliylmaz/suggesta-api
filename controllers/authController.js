const User = require("../models/User");
const jwt = require("jsonwebtoken");

// JWT üretme helper
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET
  );
};

// REGISTER
exports.register = async (req, res) => {
  try {
    const {
      name,
      surname,
      email,
      password,
      birthdate,
    } = req.body;

    // 1️⃣ Zorunlu alan kontrolü
    if (!name || !surname || !email || !password || !birthdate) {
      return res.status(400).json({
        success: false,
        message: "Zorunlu alanlar eksik",
      });
    }

    // 2️⃣ Email daha önce kullanılmış mı?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Bu email zaten kullanılıyor",
      });
    }

    // 3️⃣ Yaş kontrolü (+13)
    const birthYear = new Date(birthdate).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    if (age < 13) {
      return res.status(400).json({
        success: false,
        message: "13 yaş altı kullanıcılar kayıt olamaz",
      });
    }

    // 4️⃣ User oluştur
    const user = await User.create({
      name,
      surname,
      email,
      password,
      birthdate,
      role: "user",
    });

    // 5️⃣ Token üret
    const token = generateToken(user._id);

    // 6️⃣ Response
    res.status(201).json({
      success: true,
      message: "Kayıt başarılı",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          surname: user.surname,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
};

const bcrypt = require("bcryptjs");

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Zorunlu alanlar
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email ve şifre zorunlu",
      });
    }

    // 2️⃣ Kullanıcı var mı?
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email veya şifre hatalı",
      });
    }

    // 3️⃣ Şifre doğru mu?
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Email veya şifre hatalı",
      });
    }

    // 4️⃣ Token üret
    const token = generateToken(user._id);

    // 5️⃣ Response
    res.status(200).json({
      success: true,
      message: "Giriş başarılı",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          surname: user.surname,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
};
