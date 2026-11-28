"use client";

import { useEffect, useState } from "react";

export type LangInfo = {
  code: string;
  native: string;
  en: string;
  flag: string;
  rtl?: boolean;
  fb?: string;
};

export const LANGS: LangInfo[] = [
  { code: "ms", native: "Bahasa Melayu", en: "Malay", flag: "🇲🇾" },
  { code: "id", native: "Bahasa Indonesia", en: "Indonesian", flag: "🇮🇩" },
  { code: "jv", native: "Basa Jawa (Baku)", en: "Javanese (Standard)", flag: "🇮🇩" },
  { code: "jv-utara", native: "Basa Jawa Pantura (Utara)", en: "Javanese (Northern)", flag: "🇮🇩" },
  { code: "jv-timur", native: "Basa Jawa Wetan (Timur)", en: "Javanese (Eastern)", flag: "🇮🇩" },
  { code: "su", native: "Basa Sunda", en: "Sundanese", flag: "🇮🇩" },
  { code: "mad", native: "Basa Madhurâ", en: "Madurese", flag: "🇮🇩", fb: "id" },
  { code: "bug", native: "Basa Ugi'", en: "Buginese", flag: "🇮🇩", fb: "id" },
  { code: "min", native: "Minangkabau", en: "Minangkabau", flag: "🇮🇩", fb: "id" },
  { code: "ace", native: "Acèh", en: "Acehnese", flag: "🇮🇩", fb: "id" },
  { code: "ban", native: "Basa Bali", en: "Balinese", flag: "🇮🇩", fb: "id" },
  { code: "en", native: "English", en: "English", flag: "🇬🇧" },
  { code: "fr", native: "Français", en: "French", flag: "🇫🇷" },
  { code: "de", native: "Deutsch", en: "German", flag: "🇩🇪" },
  { code: "nl", native: "Nederlands", en: "Dutch", flag: "🇳🇱" },
  { code: "es", native: "Español", en: "Spanish", flag: "🇪🇸" },
  { code: "pt", native: "Português", en: "Portuguese", flag: "🇵🇹" },
  { code: "it", native: "Italiano", en: "Italian", flag: "🇮🇹" },
  { code: "ca", native: "Català", en: "Catalan", flag: "🇪🇸", fb: "es" },
  { code: "gl", native: "Galego", en: "Galician", flag: "🇪🇸", fb: "es" },
  { code: "eu", native: "Euskara", en: "Basque", flag: "🇪🇸", fb: "es" },
  { code: "ro", native: "Română", en: "Romanian", flag: "🇷🇴" },
  { code: "pl", native: "Polski", en: "Polish", flag: "🇵🇱" },
  { code: "cs", native: "Čeština", en: "Czech", flag: "🇨🇿" },
  { code: "sk", native: "Slovenčina", en: "Slovak", flag: "🇸🇰" },
  { code: "hu", native: "Magyar", en: "Hungarian", flag: "🇭🇺" },
  { code: "el", native: "Ελληνικά", en: "Greek", flag: "🇬🇷" },
  { code: "tr", native: "Türkçe", en: "Turkish", flag: "🇹🇷" },
  { code: "ru", native: "Русский", en: "Russian", flag: "🇷🇺" },
  { code: "uk", native: "Українська", en: "Ukrainian", flag: "🇺🇦" },
  { code: "bg", native: "Български", en: "Bulgarian", flag: "🇧🇬" },
  { code: "sr", native: "Српски", en: "Serbian", flag: "🇷🇸" },
  { code: "hr", native: "Hrvatski", en: "Croatian", flag: "🇭🇷" },
  { code: "sl", native: "Slovenščina", en: "Slovenian", flag: "🇸🇮" },
  { code: "bs", native: "Bosanski", en: "Bosnian", flag: "🇧🇦" },
  { code: "mk", native: "Македонски", en: "Macedonian", flag: "🇲🇰" },
  { code: "sq", native: "Shqip", en: "Albanian", flag: "🇦🇱" },
  { code: "lt", native: "Lietuvių", en: "Lithuanian", flag: "🇱🇹" },
  { code: "lv", native: "Latviešu", en: "Latvian", flag: "🇱🇻" },
  { code: "et", native: "Eesti", en: "Estonian", flag: "🇪🇪" },
  { code: "fi", native: "Suomi", en: "Finnish", flag: "🇫🇮" },
  { code: "sv", native: "Svenska", en: "Swedish", flag: "🇸🇪" },
  { code: "no", native: "Norsk", en: "Norwegian", flag: "🇳🇴" },
  { code: "da", native: "Dansk", en: "Danish", flag: "🇩🇰" },
  { code: "is", native: "Íslenska", en: "Icelandic", flag: "🇮🇸" },
  { code: "ga", native: "Gaeilge", en: "Irish", flag: "🇮🇪" },
  { code: "cy", native: "Cymraeg", en: "Welsh", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
  { code: "mt", native: "Malti", en: "Maltese", flag: "🇲🇹" },
  { code: "zh", native: "中文", en: "Chinese", flag: "🇨🇳" },
  { code: "ja", native: "日本語", en: "Japanese", flag: "🇯🇵" },
  { code: "ko", native: "한국어", en: "Korean", flag: "🇰🇷" },
  { code: "mn", native: "Монгол", en: "Mongolian", flag: "🇲🇳" },
  { code: "hi", native: "हिन्दी", en: "Hindi", flag: "🇮🇳" },
  { code: "bn", native: "বাংলা", en: "Bengali", flag: "🇧🇩" },
  { code: "ta", native: "தமிழ்", en: "Tamil", flag: "🇮🇳" },
  { code: "te", native: "తెలుగు", en: "Telugu", flag: "🇮🇳" },
  { code: "mr", native: "मराठी", en: "Marathi", flag: "🇮🇳" },
  { code: "gu", native: "ગુજરાતી", en: "Gujarati", flag: "🇮🇳" },
  { code: "kn", native: "ಕನ್ನಡ", en: "Kannada", flag: "🇮🇳" },
  { code: "ml", native: "മലയാളം", en: "Malayalam", flag: "🇮🇳" },
  { code: "pa", native: "ਪੰਜਾਬੀ", en: "Punjabi", flag: "🇮🇳" },
  { code: "si", native: "සිංහල", en: "Sinhala", flag: "🇱🇰" },
  { code: "ne", native: "नेपाली", en: "Nepali", flag: "🇳🇵" },
  { code: "ur", native: "اردو", en: "Urdu", flag: "🇵🇰", rtl: true },
  { code: "ps", native: "پښتو", en: "Pashto", flag: "🇦🇫", rtl: true },
  { code: "fa", native: "فارسی", en: "Persian", flag: "🇮🇷", rtl: true },
  { code: "ar", native: "العربية", en: "Arabic", flag: "🇸🇦", rtl: true },
  { code: "he", native: "עברית", en: "Hebrew", flag: "🇮🇱", rtl: true },
  { code: "ku", native: "Kurdî", en: "Kurdish", flag: "🇮🇶", fb: "tr" },
  { code: "hy", native: "Հայերեն", en: "Armenian", flag: "🇦🇲" },
  { code: "ka", native: "ქართული", en: "Georgian", flag: "🇬🇪" },
  { code: "az", native: "Azərbaycan", en: "Azerbaijani", flag: "🇦🇿" },
  { code: "kk", native: "Қазақша", en: "Kazakh", flag: "🇰🇿" },
  { code: "uz", native: "Oʻzbekcha", en: "Uzbek", flag: "🇺🇿" },
  { code: "tg", native: "Тоҷикӣ", en: "Tajik", flag: "🇹🇯", fb: "fa" },
  { code: "tk", native: "Türkmençe", en: "Turkmen", flag: "🇹🇲", fb: "tr" },
  { code: "ky", native: "Кыргызча", en: "Kyrgyz", flag: "🇰🇬" },
  { code: "th", native: "ไทย", en: "Thai", flag: "🇹🇭" },
  { code: "vi", native: "Tiếng Việt", en: "Vietnamese", flag: "🇻🇳" },
  { code: "km", native: "ខ្មែរ", en: "Khmer", flag: "🇰🇭" },
  { code: "lo", native: "ລາວ", en: "Lao", flag: "🇱🇦" },
  { code: "my", native: "မြန်မာ", en: "Burmese", flag: "🇲🇲" },
  { code: "tl", native: "Filipino", en: "Filipino", flag: "🇵🇭" },
  { code: "sw", native: "Kiswahili", en: "Swahili", flag: "🇰🇪" },
  { code: "am", native: "አማርኛ", en: "Amharic", flag: "🇪🇹" },
  { code: "ha", native: "Hausa", en: "Hausa", flag: "🇳🇬" },
  { code: "yo", native: "Yorùbá", en: "Yoruba", flag: "🇳🇬" },
  { code: "ig", native: "Igbo", en: "Igbo", flag: "🇳🇬" },
  { code: "zu", native: "isiZulu", en: "Zulu", flag: "🇿🇦" },
  { code: "af", native: "Afrikaans", en: "Afrikaans", flag: "🇿🇦" },
  { code: "so", native: "Soomaali", en: "Somali", flag: "🇸🇴" },
  { code: "mg", native: "Malagasy", en: "Malagasy", flag: "🇲🇬" },
  { code: "mi", native: "Te Reo Māori", en: "Māori", flag: "🇳🇿" },
];

export const LANG_BY_CODE: Map<string, LangInfo> = new Map(LANGS.map((l) => [l.code, l]));

export const DEFAULT_LANG = "ms";

type Dict = Record<string, Record<string, string>>;
export const DICT: Dict = {
  "nav.home": { ms: "Rumah", en: "Home", id: "Beranda", jv: "Omah", "jv-utara": "Omah", "jv-timur": "Omah", su: "Imah", zh: "首页", ja: "ホーム", ko: "홈", hi: "होम", ar: "الرئيسية", es: "Inicio", fr: "Accueil", pt: "Início", de: "Start", ru: "Главная", th: "หน้าแรก", vi: "Trang chủ", tl: "Tahanan" },
  "nav.quiz": { ms: "Kuiz", en: "Quiz", id: "Kuis", jv: "Kuis", "jv-utara": "Kuis", "jv-timur": "Kuis", su: "Kuis", zh: "测验", ja: "クイズ", ko: "퀴즈", hi: "क्विज़", ar: "اختبار", es: "Quiz", fr: "Quiz", pt: "Quiz", de: "Quiz", ru: "Квиз", th: "ควิซ", vi: "Đố vui", tl: "Kuwiz" },
  "nav.pokedex": { ms: "Pokédex", en: "Pokédex", id: "Pokédex", jv: "Pokédex", "jv-utara": "Pokédex", "jv-timur": "Pokédex", su: "Pokédex", zh: "图鉴", ja: "図鑑", ko: "도감", hi: "पॉकेडेक्स", ar: "بوكيدكس", es: "Pokédex", fr: "Pokédex", pt: "Pokédex", de: "Pokédex", ru: "Покедекс", th: "โปเกเด็กซ์", vi: "Pokédex", tl: "Pokédex" },
  "nav.music": { ms: "Muzik", en: "Music", id: "Musik", jv: "Musik", "jv-utara": "Musik", "jv-timur": "Musik", su: "Musik", zh: "音乐", ja: "音楽", ko: "음악", hi: "संगीत", ar: "الموسيقى", es: "Música", fr: "Musique", pt: "Música", de: "Musik", ru: "Музыка", th: "เพลง", vi: "Nhạc", tl: "Musika" },
  "nav.apiKey": { ms: "Kunci API", en: "API Keys", id: "Kunci API", jv: "Kunci API", "jv-utara": "Kunci API", "jv-timur": "Kunci API", su: "Konci API", zh: "API 密钥", ja: "APIキー", ko: "API 키", hi: "API कुंजी", ar: "مفتاح API", es: "Claves API", fr: "Clés API", pt: "Chaves API", de: "API-Schlüssel", ru: "API-ключи", th: "คีย์ API", vi: "Khóa API", tl: "API Key" },
  "nav.pokex": { ms: "PokeX", en: "PokeX", id: "PokeX", jv: "PokeX", "jv-utara": "PokeX", "jv-timur": "PokeX", su: "PokeX", zh: "PokeX", ja: "PokeX", ko: "PokeX", hi: "PokeX", ar: "PokeX", es: "PokeX", fr: "PokeX", pt: "PokeX", de: "PokeX", ru: "PokeX", th: "PokeX", vi: "PokeX", tl: "PokeX" },
  "nav.info": { ms: "Info", en: "Info", id: "Info", jv: "Info", "jv-utara": "Info", "jv-timur": "Info", su: "Info", zh: "信息", ja: "情報", ko: "정보", hi: "जानकारी", ar: "معلومات", es: "Info", fr: "Infos", pt: "Info", de: "Info", ru: "Инфо", th: "ข้อมูล", vi: "Thông tin", tl: "Impo" },
  "nav.changelog": { ms: "Changelog", en: "Changelog", id: "Changelog", jv: "Changelog", "jv-utara": "Changelog", "jv-timur": "Changelog", su: "Changelog", zh: "更新日志", ja: "更新履歴", ko: "변경 로그", hi: "बदलाव लॉग", ar: "سجل التغييرات", es: "Cambios", fr: "Journal", pt: "Alterações", de: "Änderungen", ru: "Изменения", th: "บันทึกเวอร์ชัน", vi: "Nhật ký", tl: "Pagbabago" },
  "menu": { ms: "Menu", en: "Menu", id: "Menu", jv: "Menu", "jv-utara": "Menu", "jv-timur": "Menu", su: "Ménu", zh: "菜单", ja: "メニュー", ko: "메뉴", hi: "मेनू", ar: "القائمة", es: "Menú", fr: "Menu", pt: "Menu", de: "Menü", ru: "Меню", th: "เมนู", vi: "Menu", tl: "Menu" },
  "close": { ms: "Tutup", en: "Close", id: "Tutup", jv: "Tutup", "jv-utara": "Nutup", "jv-timur": "Tutup", su: "Tutup", zh: "关闭", ja: "閉じる", ko: "닫기", hi: "बंद करें", ar: "إغلاق", es: "Cerrar", fr: "Fermer", pt: "Fechar", de: "Schließen", ru: "Закрыть", th: "ปิด", vi: "Đóng", tl: "Isara" },
  "set.title": { ms: "Tetapan & Kawalan", en: "Settings & Controls", id: "Pengaturan & Kontrol", jv: "Setelan & Kontrol", "jv-utara": "Setèlan & Kendhali", "jv-timur": "Setelan & Kontrol", su: "Setélan & Kontrol", zh: "设置与控制", ja: "設定と操作", ko: "설정 및 컨트롤", hi: "सेटिंग्स और नियंत्रण", ar: "الإعدادات والتحكم", es: "Ajustes y controles", fr: "Réglages et contrôles", pt: "Ajustes e controles", de: "Einstellungen & Steuerung", ru: "Настройки и управление", th: "ตั้งค่าและการควบคุม", vi: "Cài đặt & Điều khiển", tl: "Mga Setting at Kontrol" },
  "set.sound": { ms: "Bunyi & SFX", en: "Sound & SFX", id: "Suara & SFX", jv: "Swara & SFX", "jv-utara": "Suworo & SFX", "jv-timur": "Suara & SFX", su: "Sora & SFX", zh: "音效与 SFX", ja: "サウンド & SFX", ko: "사운드 & SFX", hi: "ध्वनि & SFX", ar: "الصوت والمؤثرات", es: "Sonido y SFX", fr: "Son & SFX", pt: "Som e SFX", de: "Ton & SFX", ru: "Звук и SFX", th: "เสียง & SFX", vi: "Âm thanh & SFX", tl: "Tunog & SFX" },
  "set.bright": { ms: "Cerah / Gelap", en: "Light / Dark", id: "Terang / Gelap", jv: "Padhang / Peteng", "jv-utara": "Terang / Peteng", "jv-timur": "Terang / Peteng", su: "Caang / Poék", zh: "亮色 / 深色", ja: "ライト / ダーク", ko: "라이트 / 다크", hi: "लाइट / डार्क", ar: "فاتح / داكن", es: "Claro / Oscuro", fr: "Clair / Sombre", pt: "Claro / Escuro", de: "Hell / Dunkel", ru: "Светлая / Тёмная", th: "สว่าง / มืด", vi: "Sáng / Tối", tl: "Maliwanag / Madilim" },
  "set.theme": { ms: "Tema: {t}", en: "Theme: {t}", id: "Tema: {t}", jv: "Tema: {t}", "jv-utara": "Tema: {t}", "jv-timur": "Tema: {t}", su: "Téma: {t}", zh: "主题：{t}", ja: "テーマ：{t}", ko: "테마: {t}", hi: "थीम: {t}", ar: "السمة: {t}", es: "Tema: {t}", fr: "Thème : {t}", pt: "Tema: {t}", de: "Thema: {t}", ru: "Тема: {t}", th: "ธีม: {t}", vi: "Chủ đề: {t}", tl: "Tema: {t}" },
  "set.wallpaper": { ms: "Latar Custom", en: "Custom Wallpaper", id: "Latar Kustom", jv: "Latar Kustom", "jv-utara": "Latar Kustom", "jv-timur": "Latar Kustom", su: "Latar Kustom", zh: "自定义壁纸", ja: "カスタム壁紙", ko: "사용자 지정 배경", hi: "कस्टम वॉलपेपर", ar: "خلفية مخصصة", es: "Fondo personalizado", fr: "Fond personnalisé", pt: "Papel de parede", de: "Eigenes Hintergrundbild", ru: "Свой фон", th: "วอลเปเปอร์ส่วนตัว", vi: "Hình nền tùy chỉnh", tl: "Custom na Wallpaper" },
  "set.spui": { ms: "SPUI", en: "SPUI", id: "SPUI", jv: "SPUI", "jv-utara": "SPUI", "jv-timur": "SPUI", su: "SPUI", zh: "SPUI", ja: "SPUI", ko: "SPUI", hi: "SPUI", ar: "SPUI", es: "SPUI", fr: "SPUI", pt: "SPUI", de: "SPUI", ru: "SPUI", th: "SPUI", vi: "SPUI", tl: "SPUI" },
  "set.logout": { ms: "Log Keluar", en: "Log out", id: "Keluar", jv: "Metu", "jv-utara": "Metu", "jv-timur": "Metu", su: "Kaluar", zh: "退出登录", ja: "ログアウト", ko: "로그아웃", hi: "लॉग आउट", ar: "تسجيل الخروج", es: "Cerrar sesión", fr: "Se déconnecter", pt: "Sair", de: "Abmelden", ru: "Выйти", th: "ออกจากระบบ", vi: "Đăng xuất", tl: "Mag-log out" },
  "set.explore": { ms: "Terokai", en: "Explore", id: "Jelajahi", jv: "Tlusuri", "jv-utara": "Tlusur", "jv-timur": "Tlusur", su: "Ngalanglang", zh: "探索", ja: "見つける", ko: "탐색", hi: "खोजें", ar: "استكشاف", es: "Explorar", fr: "Explorer", pt: "Explorar", de: "Erkunden", ru: "Обзор", th: "สำรวจ", vi: "Khám phá", tl: "Tuklasin" },
  "set.lang": { ms: "Bahasa", en: "Language", id: "Bahasa", jv: "Basa", "jv-utara": "Basa", "jv-timur": "Basa", su: "Basa", zh: "语言", ja: "言語", ko: "언어", hi: "भाषा", ar: "اللغة", es: "Idioma", fr: "Langue", pt: "Idioma", de: "Sprache", ru: "Язык", th: "ภาษา", vi: "Ngôn ngữ", tl: "Wika" },
  "pick.search": { ms: "Cari bahasa…", en: "Search languages…", id: "Cari bahasa…", jv: "Golèk basa…", "jv-utara": "Golèk basa…", "jv-timur": "Golèk basa…", su: "Milari basa…", zh: "搜索语言…", ja: "言語を検索…", ko: "언어 검색…", hi: "भाषा खोजें…", ar: "ابحث عن لغة…", es: "Buscar idioma…", fr: "Rechercher une langue…", pt: "Procurar idioma…", de: "Sprache suchen…", ru: "Найти язык…", th: "ค้นหาภาษา…", vi: "Tìm ngôn ngữ…", tl: "Maghanap ng wika…" },
  "pick.note": { ms: "Terjemahan penuh untuk bahasa utama; bahasa lain guna English", en: "Full translations for major languages; others fall back to English", id: "Terjemahan penuh untuk bahasa utama; lainnya memakai English", jv: "Terjemahan pepak kanggo basa utama; liyané nganggo English", "jv-utara": "Terjemahan pepak kanggo basa utama; sing liyané nganggo English", "jv-timur": "Terjemahan pepak kanggo basa utama; seng lain nganggo English", su: "Tarjamahan lengkep pikeun basa utama; nu séjén paké English", zh: "主要语言提供完整翻译；其他语言使用英语", ja: "主要言語は完全翻訳、それ以外は英語で表示", ko: "주요 언어는 완전 번역, 나머지는 영어로 표시", hi: "प्रमुख भाषाओं का पूरा अनुवाद; बाकी अंग्रेज़ी में", ar: "ترجمة كاملة للغات الرئيسية؛ وغيرها بالإنجليزية", es: "Traducción completa en los idiomas principales; el resto en inglés", fr: "Traduction complète pour les langues principales ; les autres en anglais", pt: "Tradução completa nos idiomas principais; restantes em inglês", de: "Vollübersetzung für wichtige Sprachen; Rest auf Englisch", ru: "Полный перевод для основных языков; остальные — на английском", th: "แปลครบในภาษาหลัก; ภาษาอื่นใช้ภาษาอังกฤษ", vi: "Dịch đầy đủ các ngôn ngữ chính; còn lại dùng tiếng Anh", tl: "Kumpletong salin sa pangunahing wika; iba ay Ingles" },
  "hero.badge": { ms: "Data langsung dari PokéAPI", en: "Live data from PokéAPI", id: "Data langsung dari PokéAPI", jv: "Data langsung saka PokéAPI", "jv-utara": "Data langsung sekang PokéAPI", "jv-timur": "Data langsung seng PokéAPI", su: "Data langsung ti PokéAPI", zh: "数据实时来自 PokéAPI", ja: "PokéAPI からのライブデータ", ko: "PokéAPI의 실시간 데이터", hi: "PokéAPI से सीधा डेटा", ar: "بيانات مباشرة من PokéAPI", es: "Datos en vivo de PokéAPI", fr: "Données en direct de PokéAPI", pt: "Dados em direto do PokéAPI", de: "Live-Daten von PokéAPI", ru: "Данные в реальном времени из PokéAPI", th: "ข้อมูลสดจาก PokéAPI", vi: "Dữ liệu trực tiếp từ PokéAPI", tl: "Live na data mula sa PokéAPI" },
  "hero.head1": { ms: "Seribu Wajah.", en: "A Thousand Faces.", id: "Seribu Wajah.", jv: "Éwu Rupa.", "jv-utara": "Sewu Rupa.", "jv-timur": "Sewu Rupa.", su: "Sarébu Beungeut.", zh: "千张面孔。", ja: "千の顔。", ko: "천 개의 얼굴.", hi: "हज़ार चेहरे।", ar: "ألف وجه.", es: "Mil rostros.", fr: "Mille visages.", pt: "Mil rostos.", de: "Tausend Gesichter.", ru: "Тысяча лиц.", th: "พันหน้าด้าน.", vi: "Nghìn gương mặt.", tl: "Sanlibong Mukha." },
  "hero.head2": { ms: "Satu", en: "One", id: "Satu", jv: "Siji", "jv-utara": "Siji", "jv-timur": "Siji", su: "Hiji", zh: "一个", ja: "ひつの", ko: "하나의", hi: "एक", ar: "واحد", es: "Un", fr: "Un", pt: "Um", de: "Ein", ru: "Одна", th: "หนึ่ง", vi: "Một", tl: "Isa" },
  "hero.live": { ms: "Legenda.|Cerita.|Petualangan.|Misteri.|Keajaiban.", en: "Legend.|Story.|Adventure.|Mystery.|Wonder.", id: "Legenda.|Cerita.|Petualangan.|Misteri.|Keajaiban.", jv: "Legenda.|Carita.|Lelana.|Misteri.|Mukjizat.", "jv-utara": "Legenda.|Carita.|Lelana.|Misteri.|Mukjizat.", "jv-timur": "Legenda.|Carita.|Lelana.|Misteri.|Mukjizat.", su: "Legenda.|Carita.|Lalampahan.|Misteri.|Kaajaiban.", zh: "传奇。|故事。|冒险。|神秘。|奇迹。", ja: "伝説。|物語。|冒険。|謎。|奇跡。", ko: "전설.|이야기.|모험.|미스터리.|기적.", hi: "किंवदंती।|कहानी।|रोमांच।|रहस्य।|चमत्कार।", ar: "أسطورة.|قصة.|مغامرة.|غموض.|معجزة.", es: "Leyenda.|Historia.|Aventura.|Misterio.|Maravilla.", fr: "Légende.|Histoire.|Aventure.|Mystère.|Merveille.", pt: "Lenda.|História.|Aventura.|Mistério.|Maravilha.", de: "Legende.|Geschichte.|Abenteuer.|Mysterium.|Wunder.", ru: "Легенда.|История.|Приключение.|Загадка.|Чудо.", th: "ตำนาน.|เรื่องราว.|การผจญภัย.|ปริศนา.|ปาฏิหาริย์.", vi: "Huyền thoại.|Câu chuyện.|Phiêu lưu.|Bí ẩn.|Kỳ diệu.", tl: "Alamat.|Kuwento.|Paglalakbay.|Hiwaga.|Kagila-gilalas." },
  "hero.sub": { ms: "Tatal untuk menyusuri sembilan generasi, tapis mengikut jenis, dan buka mana-mana kad untuk melihat statistik penuh.", en: "Scroll through nine generations, filter by type, and open any card for full stats.", id: "Gulir untuk menyusuri sembilan generasi, saring menurut jenis, dan buka kartu mana pun untuk statistik lengkap.", jv: "Gurata kanggo ngluru sangang generasi, saring miturut jinis, lan bukak kadhé menapa wae kanggo mirughi statistik pepak.", "jv-utara": "Gulung manggo kanggo ngambah sangang generasi, sari miturut jinis, lan bukak kadhé sing ngendi wae kanggo ndeleng statistik pepak.", "jv-timur": "Gulung kanggo ngambah sangang generasi, saring miturut jinis, lan bukak kadé seng ngendi wae kanggo ndelok statistik pepak.", su: "Gulung pikeun ngabaturan salapan generasi, nyaring dumasar jenis, jeung buka kartu naon waé pikeun ningali statistik lengkep.", zh: "滚动浏览九个世代，按属性筛选，点开任意卡片查看完整数据。", ja: "スクロールして 9 世代をたどり、タイプで絞り込み、カードを開いて全ステータスを確認。", ko: "스크롤로 9세대를 탐색하고, 타입으로 필터링하고, 카드를 열어 전체 능력치를 확인하세요.", hi: "नौ पीढ़ियाँ देखने के लिए स्क्रॉल करें, प्रकार से छानें, और पूरे आँकड़े देखने के लिए कोई भी कार्ड खोलें।", ar: "مرّر لتستكشف تسعة أجيال، رشّح حسب النوع، وافتح أي بطاقة لرؤية الإحصائيات كاملة.", es: "Desliza para recorrer nueve generaciones, filtra por tipo y abre cualquier tarjeta para ver sus estadísticas completas.", fr: "Faites défiler neuf générations, filtrez par type et ouvrez une carte pour voir toutes les stats.", pt: "Percorra nove gerações, filtre por tipo e abra qualquer cartão para ver as estatísticas completas.", de: "Scroll durch neun Generationen, filtere nach Typ und öffne eine Karte für alle Werte.", ru: "Листайте девять поколений, фильтруйте по типу и открывайте карточки со полной статистикой.", th: "เลื่อนสำรวจเก้าเจเนอเรชัน กรองตามประเภท และเปิดการ์ดใดก็ได้เพื่อดูสถิติเต็ม", vi: "Cuộn để khám phá chín thế hệ, lọc theo hệ, và mở thẻ bất kỳ để xem chỉ số đầy đủ.", tl: "I-scroll para tuklasin ang siyam na henerasyon, i-filter ayon sa uri, at buksan ang anumang card para sa buod na stats." },
  "hero.counts": { ms: "{s} spesies, {t} jenis, {g} generasi.", en: "{s} species, {t} types, {g} generations.", id: "{s} spesies, {t} jenis, {g} generasi.", jv: "{s} spesies, {t} jinis, {g} generasi.", "jv-utara": "{s} spesies, {t} jinis, {g} generasi.", "jv-timur": "{s} spesies, {t} jinis, {g} generasi.", su: "{s} spésiés, {t} jenis, {g} generasi.", zh: "{s} 只宝可梦、{t} 种属性、{g} 个世代。", ja: "{s} 匹のポケモン、{t} タイプ、{g} 世代。", ko: "{s}종 포켓몬, {t}가지 타입, {g}세대.", hi: "{s} प्रजातियाँ, {t} प्रकार, {g} पीढ़ियाँ।", ar: "{s} مخلوق، {t} نوع، {g} جيل.", es: "{s} especies, {t} tipos, {g} generaciones.", fr: "{s} espèces, {t} types, {g} générations.", pt: "{s} espécies, {t} tipos, {g} gerações.", de: "{s} Spezies, {t} Typen, {g} Generationen.", ru: "{s} видов, {t} типов, {g} поколений.", th: "{s} สายพันธุ์ {t} ประเภท {g} เจเนอเรชัน", vi: "{s} loài, {t} hệ, {g} thế hệ.", tl: "{s} species, {t} uri, {g} henerasyon." },
  "hero.search": { ms: "Cari nama atau nombor, cth. pikachu…", en: "Search a name or number, e.g. pikachu…", id: "Cari nama atau nomor, mis. pikachu…", jv: "Golèk asma utawa nomer, umpluk. pikachu…", "jv-utara": "Golèk jeneng utawa nomer, upamané pikachu…", "jv-timur": "Golèk jeneng utawa nomer, contone pikachu…", su: "Milari ngaran atawa nomer, contona pikachu…", zh: "搜索名字或编号，例如 pikachu…", ja: "名前や番号で検索（例：pikachu…）", ko: "이름이나 번호로 검색 (예: pikachu…)", hi: "नाम या नंबर खोजें, जैसे pikachu…", ar: "ابحث عن اسم أو رقم، مثال pikachu…", es: "Busca un nombre o número, p. ej. pikachu…", fr: "Cherchez un nom ou un numéro, ex. pikachu…", pt: "Procure um nome ou número, ex.: pikachu…", de: "Name oder Nummer suchen, z. B. pikachu…", ru: "Ищите имя или номер, напр. pikachu…", th: "ค้นหาชื่อหรือหมายเลข เช่น pikachu…", vi: "Tìm tên hoặc số, vd. pikachu…", tl: "Maghanap ng pangalan o numero, hal. pikachu…" },
  "hero.cta": { ms: "Terokai Pokédex", en: "Explore Pokédex", id: "Jelajahi Pokédex", jv: "Tlusuri Pokédex", "jv-utara": "Tlusur Pokédex", "jv-timur": "Tlusur Pokédex", su: "Ngalanglang Pokédex", zh: "探索图鉴", ja: "図鑑を探検", ko: "도감 탐색", hi: "पॉकेडेक्स देखें", ar: "استكشف بوكيدكس", es: "Explorar Pokédex", fr: "Explorer le Pokédex", pt: "Explorar Pokédex", de: "Pokédex erkunden", ru: "Открыть Покедекс", th: "สำรวจโปเกเด็กซ์", vi: "Khám phá Pokédex", tl: "Tuklasin ang Pokédex" },
  "hero.stats": { ms: "Spesies|Jenis|Generasi", en: "Species|Types|Generations", id: "Spesies|Jenis|Generasi", jv: "Spesies|Jinis|Generasi", "jv-utara": "Spesies|Jinis|Generasi", "jv-timur": "Spesies|Jinis|Generasi", su: "Spésiés|Jenis|Generasi", zh: "宝可梦|属性|世代", ja: "ポケモン|タイプ|世代", ko: "포켓몬|타입|세대", hi: "प्रजातियाँ|प्रकार|पीढ़ियाँ", ar: "مخلوق|نوع|جيل", es: "Especies|Tipos|Generaciones", fr: "Espèces|Types|Générations", pt: "Espécies|Tipos|Gerações", de: "Spezies|Typen|Generationen", ru: "Виды|Типы|Поколения", th: "สายพันธุ์|ประเภท|เจเนอเรชัน", vi: "Loài|Hệ|Thế hệ", tl: "Species|Uri|Henerasyon" },
  "ql.dex": { ms: "Pokédex", en: "Pokédex", id: "Pokédex", jv: "Pokédex", "jv-utara": "Pokédex", "jv-timur": "Pokédex", su: "Pokédex", zh: "图鉴", ja: "図鑑", ko: "도감", hi: "पॉकेडेक्स", ar: "بوكيدكس", es: "Pokédex", fr: "Pokédex", pt: "Pokédex", de: "Pokédex", ru: "Покедекс", th: "โปเกเด็กซ์", vi: "Pokédex", tl: "Pokédex" },
  "ql.dexN": { ms: "Semua 1025 spesies, tapis jenis & generasi", en: "All 1025 species, filter by type & generation", id: "Semua 1025 spesies, saring jenis & generasi", jv: "Sadaya 1025 spesies, saring jinis & generasi", "jv-utara": "Kabèh 1025 spesies, sari jinis & generasi", "jv-timur": "Kabèh 1025 spesies, saring jinis & generasi", su: "Sadaya 1025 spésiés, nyaring jenis & generasi", zh: "全部 1025 只宝可梦，按属性与世代筛选", ja: "全 1025 匹、タイプ・世代でフィルター", ko: "전체 1025종, 타입·세대 필터", hi: "सभी 1025 प्रजातियाँ, प्रकार व पीढ़ी फ़िल्टर", ar: "كل الـ1025، ترشيح حسب النوع والجيل", es: "Las 1025 especies, filtra por tipo y generación", fr: "Les 1025 espèces, filtres type & génération", pt: "Todas as 1025 espécies, filtro por tipo e geração", de: "Alle 1025 Spezies, Filter nach Typ & Generation", ru: "Все 1025 видов, фильтры по типу и поколению", th: "ครบ 1025 สายพันธุ์ กรองประเภทและเจเนอเรชัน", vi: "Đủ 1025 loài, lọc theo hệ & thế hệ", tl: "Lahat ng 1025 species, filter ayon sa uri at henerasyon" },
  "ql.quiz": { ms: "Kuiz", en: "Quiz", id: "Kuis", jv: "Kuis", "jv-utara": "Kuis", "jv-timur": "Kuis", su: "Kuis", zh: "测验", ja: "クイズ", ko: "퀴즈", hi: "क्विज़", ar: "اختبار", es: "Quiz", fr: "Quiz", pt: "Quiz", de: "Quiz", ru: "Квиз", th: "ควิซ", vi: "Đố vui", tl: "Kuwiz" },
  "ql.quizN": { ms: "Teka siluet, tanpa had, kejar skor terbaik", en: "Guess silhouettes, unlimited, chase your best score", id: "Tebak siluet, tanpa batas, kejar skor terbaik", jv: "Wangsulana siluet, tanpa wates, kejar skor paling apik", "jv-utara": "Wangsul siluet, tanpa wates, stopok skor paling apik", "jv-timur": "Tebak siluet, tanpa wates, kejar skor paling dhuwur", su: "Tangtoskeun siluet, tanpa wates, buruan skor pangsaéna", zh: "猜剪影，无限制，挑战最高分", ja: "シルエット当て、無制限、ハイスコアを狙え", ko: "실루엣 맞추기, 무제한, 최고 점수 도전", hi: "सिल्वूट पहचानो, असीमित, बेहतरीन स्कोर का पीछा", ar: "خمّن الظل، بلا حدود، اطارد أفضل نتيجة", es: "Adivina siluetas, sin límites, persigue tu mejor puntaje", fr: "Devine les silhouettes, sans limite, vise le meilleur score", pt: "Adivinhe silhuetas, sem limites, persiga a melhor pontuação", de: "Silhouetten erraten, unbegrenzt, jage den Bestwert", ru: "Угадай силуэты, без лимитов, гонись за рекордом", th: "เดาเงา ไม่จำกัด ล่าสกอร์สูงสุด", vi: "Đoán bóng, không giới hạn, đuổi điểm cao nhất", tl: "Hulaan ang silhouette, walang limit, habulin ang pinakamataas na score" },
  "ql.info": { ms: "Info", en: "Info", id: "Info", jv: "Info", "jv-utara": "Info", "jv-timur": "Info", su: "Info", zh: "信息", ja: "情報", ko: "정보", hi: "जानकारी", ar: "معلومات", es: "Info", fr: "Infos", pt: "Info", de: "Info", ru: "Инфо", th: "ข้อมูล", vi: "Thông tin", tl: "Impo" },
  "ql.infoN": { ms: "Tentang laman, data terbuka & kredit", en: "About the site, open data & credits", id: "Tentang situs, data terbuka & kredit", jv: "Pranatan situs, data kebuka & krédit", "jv-utara": "Babagan situs, data kebuka & krédit", "jv-timur": "Babagan situs, data terbuka & kredit", su: "Ngeunaan situs, data terbuka & kredit", zh: "关于本站、开放数据与致谢", ja: "サイトについて、オープンデータ & クレジット", ko: "사이트 소개, 오픈 데이터 & 크레딧", hi: "साइट के बारे में, खुला डेटा व श्रेय", ar: "عن الموقع، البيانات المفتوحة والشكر", es: "Sobre el sitio, datos abiertos y créditos", fr: "À propos, données ouvertes & crédits", pt: "Sobre o site, dados abertos e créditos", de: "Über die Seite, offene Daten & Credits", ru: "О сайте, открытые данные и благодарности", th: "เกี่ยวกับเว็บ ข้อมูลเปิดและเครดิต", vi: "Về trang web, dữ liệu mở & ghi công", tl: "Tungkol sa site, bukas na data at kredito" },
  "ql.music": { ms: "Muzik", en: "Music", id: "Musik", jv: "Musik", "jv-utara": "Musik", "jv-timur": "Musik", su: "Musik", zh: "音乐", ja: "音楽", ko: "음악", hi: "संगीत", ar: "الموسيقى", es: "Música", fr: "Musique", pt: "Música", de: "Musik", ru: "Музыка", th: "เพลง", vi: "Nhạc", tl: "Musika" },
  "ql.musicN": { ms: "Pustaka penuh OST + import anda", en: "Full OST library + your imports", id: "Pustaka penuh OST + impor Anda", jv: "Pustaka OST pepak + impor sampeyan", "jv-utara": "Pustaka OST pepak + impor sampeyan", "jv-timur": "Pustaka OST pepak + impor sampeyan", su: "Pustaka OST lengkep + impor anjeun", zh: "完整原声库 + 你的导入", ja: "OST フルライブラリ + インポート", ko: "전체 OST 라이브러리 + 가져온 음악", hi: "पूरा OST लाइब्रेरी + आपके इंपोर्ट", ar: "مكتبة الأوساط الكاملة + استيراداتك", es: "Biblioteca OST completa + tus importaciones", fr: "Toute la BO + vos imports", pt: "Biblioteca OST completa + as suas importações", de: "Komplette OST-Bibliothek + eigene Imports", ru: "Вся OST-библиотека + ваши импорты", th: "คลัง OST เต็ม + เพลงที่นำเข้า", vi: "Thư viện OST đầy đủ + nhạc của bạn", tl: "Buong OST library + mga import mo" },
  "ql.key": { ms: "Kunci API", en: "API Keys", id: "Kunci API", jv: "Kunci API", "jv-utara": "Kunci API", "jv-timur": "Kunci API", su: "Konci API", zh: "API 密钥", ja: "APIキー", ko: "API 키", hi: "API कुंजी", ar: "مفتاح API", es: "Claves API", fr: "Clés API", pt: "Chaves API", de: "API-Schlüssel", ru: "API-ключи", th: "คีย์ API", vi: "Khóa API", tl: "API Key" },
  "ql.keyN": { ms: "Jana kunci API peribadi PokéAPI", en: "Generate your own PokéAPI keys", id: "Buat kunci API pribadi PokéAPI", jv: "Damel kunci API pribadi PokéAPI", "jv-utara": "Gawé kunci API pribadi PokéAPI", "jv-timur": "Gawe kunci API pribadi PokéAPI", su: "Jieun konci API pribadi PokéAPI", zh: "生成你专属的 PokéAPI 密钥", ja: "自分専用の PokéAPI キーを生成", ko: "나만의 PokéAPI 키 생성", hi: "अपनी निजी PokéAPI कुंजी बनाएँ", ar: "أنشئ مفتاح PokéAPI خاصاً بك", es: "Genera tus claves PokéAPI personales", fr: "Générez vos clés PokéAPI personnelles", pt: "Gere as suas chaves PokéAPI pessoais", de: "Eigene PokéAPI-Schlüssel erstellen", ru: "Создайте личные ключи PokéAPI", th: "สร้างคีย์ PokéAPI ส่วนตัว", vi: "Tạo khóa PokéAPI riêng của bạn", tl: "Gumawa ng sariling PokéAPI key" },
  "ql.pokex": { ms: "PokeX", en: "PokeX", id: "PokeX", jv: "PokeX", "jv-utara": "PokeX", "jv-timur": "PokeX", su: "PokeX", zh: "PokeX", ja: "PokeX", ko: "PokeX", hi: "PokeX", ar: "PokeX", es: "PokeX", fr: "PokeX", pt: "PokeX", de: "PokeX", ru: "PokeX", th: "PokeX", vi: "PokeX", tl: "PokeX" },
  "ql.pokexN": { ms: "Analisis semua Pokémon dengan AI sebenar", en: "Analyse every Pokémon with real AI", id: "Analisis semua Pokémon dengan AI nyata", jv: "Analisis sadaya Pokémon nganggo AI sayekti", "jv-utara": "Analisis kabèh Pokémon nganggo AI nyata", "jv-timur": "Analisis kabèh Pokémon nganggo AI nyata", su: "Analisis sadaya Pokémon ku AI nyata", zh: "用真正的 AI 分析所有宝可梦", ja: "本物の AI で全ポケモンを分析", ko: "진짜 AI로 모든 포켓몬 분석", hi: "असली AI से हर पॉकेमन का विश्लेषण", ar: "حلّل كل البوكيمون بذكاء اصطناعي حقيقي", es: "Analiza cada Pokémon con IA real", fr: "Analysez chaque Pokémon avec une vraie IA", pt: "Analise cada Pokémon com IA real", de: "Jedes Pokémon mit echter KI analysieren", ru: "Анализ любого Покемона с настоящим ИИ", th: "วิเคราะห์โปเกมอนทุกตัวด้วย AI จริง", vi: "Phân tích mọi Pokémon bằng AI thật", tl: "Suriin bawat Pokémon gamit ang tunay na AI" },
};

const KEY = "md-lang";
const EV = "md-lang";

export function translate(lang: string, key: string): string {
  const entry = DICT[key];
  if (!entry) return key;
  const direct = entry[lang];
  if (direct) return direct;
  const info = LANG_BY_CODE.get(lang);
  if (info?.fb) {
    const f = entry[info.fb];
    if (f) return f;
  }
  const base = lang.split("-")[0];
  if (base !== lang) {
    const b = entry[base];
    if (b) return b;
  }
  return entry.en ?? entry.ms ?? key;
}

export function getLang(): string {
  try {
    const v = localStorage.getItem(KEY);
    return v && LANG_BY_CODE.has(v) ? v : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

export function applyLang(code: string) {
  const info = LANG_BY_CODE.get(code);
  document.documentElement.lang = code;
  document.documentElement.dir = info?.rtl ? "rtl" : "ltr";
}

export function setLang(code: string) {
  try {
    localStorage.setItem(KEY, code);
  } catch {
    /* pelayar swasta */
  }
  applyLang(code);
  window.dispatchEvent(new CustomEvent(EV, { detail: code }));
}

export function useLang(): string {
  const [lang, setL] = useState<string>(DEFAULT_LANG);
  useEffect(() => {
    const cur = getLang();
    setL(cur);
    applyLang(cur);
    const on = (e: Event) => {
      const v = (e as CustomEvent<string>).detail;
      if (v && LANG_BY_CODE.has(v)) setL(v);
    };
    window.addEventListener(EV, on);
    return () => window.removeEventListener(EV, on);
  }, []);
  return lang;
}

export function useT() {
  const lang = useLang();
  return (key: string) => translate(lang, key);
}
