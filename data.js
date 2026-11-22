// Données fixes de l'app : récitateurs, noms et nombre de versets des 114 sourates.

// Chaque récitateur garde sa couleur, en thème clair comme en sombre.
// L'audio vient d'everyayah.com (un fichier par verset) : https://everyayah.com/data/<dossier>/SSSAAA.mp3
export const RECITERS = [
  { id: 'alafasy', name: 'Mishary Rashid Alafasy', short: 'Alafasy', ar: 'مشاري راشد العفاسي', country: 'Koweït', tone: '#1f5e5a', photo: 'portraits/alafasy.webp', folder: 'Alafasy_128kbps' },
  { id: 'abdulbasit', name: 'Abdul Basit Abdus Samad', short: 'Abdul Basit', ar: 'عبد الباسط عبد الصمد', country: 'Égypte', tone: '#8a4a24', photo: null, folder: 'Abdul_Basit_Murattal_192kbps' },
  { id: 'husary', name: 'Mahmoud Khalil Al-Husary', short: 'Al-Husary', ar: 'محمود خليل الحصري', country: 'Égypte', tone: '#2f3a7a', photo: 'portraits/husary.webp', folder: 'Husary_128kbps' },
  { id: 'muaiqly', name: 'Maher Al-Muaiqly', short: 'Al-Muaiqly', ar: 'ماهر المعيقلي', country: 'Arabie saoudite', tone: '#7a3550', photo: 'portraits/muaiqly.webp', folder: 'MaherAlMuaiqly128kbps' },
  { id: 'dosari', name: 'Yasser Al-Dosari', short: 'Al-Dosari', ar: 'ياسر الدوسري', country: 'Arabie saoudite', tone: '#4f5a2a', photo: 'portraits/dosari.webp', folder: 'Yasser_Ad-Dussary_128kbps' },
  { id: 'ghamdi', name: 'Saad Al-Ghamdi', short: 'Al-Ghamdi', ar: 'سعد الغامدي', country: 'Arabie saoudite', tone: '#2c4f6e', photo: 'portraits/ghamdi.webp', folder: 'Ghamadi_40kbps' },
  { id: 'minshawi', name: 'Mohamed Siddiq Al-Minshawi', short: 'Al-Minshawi', ar: 'محمد صديق المنشاوي', country: 'Égypte', tone: '#4e2d62', photo: 'portraits/minshawi.webp', folder: 'Minshawy_Murattal_128kbps' },
  { id: 'sudais', name: 'Abdul Rahman Al-Sudais', short: 'As-Sudais', ar: 'عبد الرحمن السديس', country: 'Arabie saoudite', tone: '#6b4a1f', photo: 'portraits/sudais.webp', folder: 'Abdurrahmaan_As-Sudais_192kbps' },
  { id: 'shuraim', name: 'Saud Al-Shuraim', short: 'Ash-Shuraim', ar: 'سعود الشريم', country: 'Arabie saoudite', tone: '#3d5a4a', photo: 'portraits/shuraim.webp', folder: 'Saood_ash-Shuraym_128kbps' },
  { id: 'qatami', name: 'Nasser Al-Qatami', short: 'Al-Qatami', ar: 'ناصر القطامي', country: 'Arabie saoudite', tone: '#5a2d3e', photo: null, folder: 'Nasser_Alqatami_128kbps' },
  { id: 'ajmi', name: 'Ahmed Al-Ajmi', short: 'Al-Ajmi', ar: 'أحمد بن علي العجمي', country: 'Arabie saoudite', tone: '#24506b', photo: 'portraits/ajmi.webp', folder: 'ahmed_ibn_ali_al_ajamy_128kbps' },
  { id: 'hudhaify', name: 'Ali Al-Hudhaify', short: 'Al-Hudhaify', ar: 'علي الحذيفي', country: 'Arabie saoudite', tone: '#55452a', photo: null, folder: 'Hudhaify_128kbps' },
  { id: 'juhany', name: 'Abdullah Awad Al-Juhany', short: 'Al-Juhany', ar: 'عبد الله عواد الجهني', country: 'Arabie saoudite', tone: '#2f5a5a', photo: 'portraits/juhany.webp', folder: 'Abdullaah_3awwaad_Al-Juhaynee_128kbps' },
  { id: 'jibreel', name: 'Muhammad Jibreel', short: 'Jibreel', ar: 'محمد جبريل', country: 'Égypte', tone: '#3a2f6b', photo: null, folder: 'Muhammad_Jibreel_128kbps' },
  { id: 'shatri', name: 'Abu Bakr Ash-Shatri', short: 'Ash-Shatri', ar: 'أبو بكر الشاطري', country: 'Arabie saoudite', tone: '#3b4a6b', photo: null, folder: 'Abu_Bakr_Ash-Shaatree_128kbps' },
  { id: 'rifai', name: 'Hani Ar-Rifai', short: 'Ar-Rifai', ar: 'هاني الرفاعي', country: 'Arabie saoudite', tone: '#6b3b5a', photo: null, folder: 'Hani_Rifai_192kbps' },
  { id: 'abbad', name: 'Fares Abbad', short: 'Fares Abbad', ar: 'فارس عباد', country: 'Arabie saoudite', tone: '#2d5a3d', photo: null, folder: 'Fares_Abbad_64kbps' },
  { id: 'ayyub', name: 'Muhammad Ayyub', short: 'Ayyub', ar: 'محمد أيوب', country: 'Arabie saoudite', tone: '#5a4a2d', photo: null, folder: 'Muhammad_Ayyoub_128kbps' },
  { id: 'budair', name: 'Salah Al-Budair', short: 'Al-Budair', ar: 'صلاح البدير', country: 'Arabie saoudite', tone: '#2d3d5a', photo: null, folder: 'Salah_Al_Budair_128kbps' },
  { id: 'jaber', name: 'Ali Jaber', short: 'Ali Jaber', ar: 'علي جابر', country: 'Arabie saoudite', tone: '#5a2d2d', photo: null, folder: 'Ali_Jaber_64kbps' },
  { id: 'basfar', name: 'Abdullah Basfar', short: 'Basfar', ar: 'عبد الله بصفر', country: 'Arabie saoudite', tone: '#2d5a55', photo: null, folder: 'Abdullah_Basfar_192kbps' },
  { id: 'qahtani', name: 'Khalid Al-Qahtani', short: 'Al-Qahtani', ar: 'خالد القحطاني', country: 'Arabie saoudite', tone: '#6b552d', photo: null, folder: 'Khaalid_Abdullaah_al-Qahtaanee_192kbps' },
  { id: 'banna', name: 'Mahmoud Ali Al-Banna', short: 'Al-Banna', ar: 'محمود علي البنا', country: 'Égypte', tone: '#4a2d5a', photo: null, folder: 'Mahmoud_Ali_Al_Banna_32kbps' },
  { id: 'tablawi', name: 'Mohamed Al-Tablawi', short: 'At-Tablawi', ar: 'محمد محمود الطبلاوي', country: 'Égypte', tone: '#3d2d4a', photo: null, folder: 'Mohammad_al_Tablaway_128kbps' },
  { id: 'mustafaismail', name: 'Mustafa Ismail', short: 'Mustafa Ismail', ar: 'مصطفى إسماعيل', country: 'Égypte', tone: '#6b2f2f', photo: null, folder: 'Mustafa_Ismail_48kbps' }
];

export const VERSES = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];

export const NAMES_AR = 'الفاتحة البقرة آل_عمران النساء المائدة الأنعام الأعراف الأنفال التوبة يونس هود يوسف الرعد إبراهيم الحجر النحل الإسراء الكهف مريم طه الأنبياء الحج المؤمنون النور الفرقان الشعراء النمل القصص العنكبوت الروم لقمان السجدة الأحزاب سبأ فاطر يس الصافات ص الزمر غافر فصلت الشورى الزخرف الدخان الجاثية الأحقاف محمد الفتح الحجرات ق الذاريات الطور النجم القمر الرحمن الواقعة الحديد المجادلة الحشر الممتحنة الصف الجمعة المنافقون التغابن الطلاق التحريم الملك القلم الحاقة المعارج نوح الجن المزمل المدثر القيامة الإنسان المرسلات النبأ النازعات عبس التكوير الانفطار المطففين الانشقاق البروج الطارق الأعلى الغاشية الفجر البلد الشمس الليل الضحى الشرح التين العلق القدر البينة الزلزلة العاديات القارعة التكاثر العصر الهمزة الفيل قريش الماعون الكوثر الكافرون النصر المسد الإخلاص الفلق الناس'.split(' ').map((s) => s.replace('_', ' '));

export const NAMES_LATIN = "Al-Fatiha|Al-Baqara|Al-Imran|An-Nisa|Al-Ma'ida|Al-An'am|Al-A'raf|Al-Anfal|At-Tawba|Yunus|Hud|Yusuf|Ar-Ra'd|Ibrahim|Al-Hijr|An-Nahl|Al-Isra|Al-Kahf|Maryam|Ta-Ha|Al-Anbiya|Al-Hajj|Al-Mu'minun|An-Nur|Al-Furqan|Ash-Shu'ara|An-Naml|Al-Qasas|Al-Ankabut|Ar-Rum|Luqman|As-Sajda|Al-Ahzab|Saba|Fatir|Ya-Sin|As-Saffat|Sad|Az-Zumar|Ghafir|Fussilat|Ash-Shura|Az-Zukhruf|Ad-Dukhan|Al-Jathiya|Al-Ahqaf|Muhammad|Al-Fath|Al-Hujurat|Qaf|Adh-Dhariyat|At-Tur|An-Najm|Al-Qamar|Ar-Rahman|Al-Waqi'a|Al-Hadid|Al-Mujadila|Al-Hashr|Al-Mumtahana|As-Saff|Al-Jumu'a|Al-Munafiqun|At-Taghabun|At-Talaq|At-Tahrim|Al-Mulk|Al-Qalam|Al-Haqqa|Al-Ma'arij|Nuh|Al-Jinn|Al-Muzzammil|Al-Muddaththir|Al-Qiyama|Al-Insan|Al-Mursalat|An-Naba|An-Nazi'at|Abasa|At-Takwir|Al-Infitar|Al-Mutaffifin|Al-Inshiqaq|Al-Buruj|At-Tariq|Al-A'la|Al-Ghashiya|Al-Fajr|Al-Balad|Ash-Shams|Al-Layl|Ad-Duha|Ash-Sharh|At-Tin|Al-Alaq|Al-Qadr|Al-Bayyina|Az-Zalzala|Al-Adiyat|Al-Qari'a|At-Takathur|Al-Asr|Al-Humaza|Al-Fil|Quraysh|Al-Ma'un|Al-Kawthar|Al-Kafirun|An-Nasr|Al-Masad|Al-Ikhlas|Al-Falaq|An-Nas".split('|');

// Pochettes : une couleur sourde par sourate, en boucle.
const TONES = ['#8a4a24', '#1f5e5a', '#2f3a7a', '#7a3550', '#4f5a2a', '#2c4f6e', '#4e2d62', '#9a5328'];
export const surahTone = (n) => TONES[(n - 1) % TONES.length];


export const CREDITS = [
  ['Mishary Alafasy', '« Мишари Рашид.jpg », quranic.ru, usage libre'],
  ['Al-Husary', '« Hussary.jpg », domaine public'],
  ['Maher Al-Muaiqly', "« Professor Maher Al-Mu'aiqly.jpg », Real avdulmouhd, CC BY-SA 4.0"],
  ['Yasser Al-Dosari', '« Yasser Al-Dosari (cropped).jpg », MAL MALDIVE, CC BY-SA 4.0'],
  ['Saad Al-Ghamdi', '« Saad al Ghamdi.jpg », الشيخ هيثم الدخين, CC BY-SA 4.0'],
  ['Al-Minshawi', '« Elminshwey.jpg », domaine public'],
  ['As-Sudais', '« Abdul-Rahman Al-Sudais (Cropped, 2011).jpg », Prime Minister\'s Office (Inde), GODL-India'],
  ['Ash-Shuraim', '« Saud Shuraim.png », Sazwanmisuari, CC0'],
  ['Al-Qatami', '« صورة شخصية ناصر القطامي.jpg », Ayman dhū alghiná, CC BY-SA 4.0'],
  ['Al-Ajmi', '« Ahmad bin Ali Al-Ajmi.png », أحمد زين, CC BY-SA 3.0'],
  ['Al-Hudhaify', '« Ali al-Hudhayfi.jpg », آيات, CC BY 3.0'],
  ['Al-Juhany', '« Abdullah Al Juhany (Cropped).png », الشيخ هيثم الدخين, CC BY-SA 4.0'],
  ['Jibreel', '« Qari Muhammad Jebril, Ramadan 2019.png », Alhidaya Croydon, CC BY 3.0'],
  ['Mustafa Ismail', '« Mustafa Ismail.jpg », domaine public']
];
