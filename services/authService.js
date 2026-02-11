const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// JWT Helper
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d", // Token süresi (isteğe bağlı)
    });
};

exports.register = async ({ name, surname, username, email, password, birthdate }) => {
    // 1. Email kontrolü
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        throw new Error("Bu email zaten kullanılıyor");
    }

    // 2. Kullanıcı adı kontrolü
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
        throw new Error("Bu kullanıcı adı zaten kullanılıyor");
    }

    // 3. Yaş kontrolü (+13)
    const birthYear = new Date(birthdate).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    if (age < 13) {
        throw new Error("13 yaş altı kullanıcılar kayıt olamaz");
    }

    // 4. Veritabanına kayıt
    const user = await User.create({
        name,
        surname,
        email,
        username,
        password,
        birthdate,
        role: "user",
    });

    // 5. Token üret
    const token = generateToken(user._id);

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            username: user.username,
            role: user.role,
        },
    };
};

exports.login = async ({ email, password }) => {
    // 1. Kullanıcıyı bul
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new Error("Email veya şifre hatalı");
    }

    // 2. Şifreyi kontrol et
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Email veya şifre hatalı");
    }

    // 3. Token üret
    const token = generateToken(user._id);

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            username: user.username,
            role: user.role,
        },
    };
};
