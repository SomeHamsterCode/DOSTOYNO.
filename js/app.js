/**
 * ДОСТОЙНО - ЕГЭ по русскому языку с геймификацией
 * Версия 4.0 - Исправление мобильных ошибок
 */

// ============================================
// БЕЗОПАСНОЕ СОХРАНЕНИЕ (с обработкой ошибок)
// ============================================
function safeSave(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Ошибка сохранения:', e);
        // Fallback - сохраняем в памяти
        window.tempSave = window.tempSave || {};
        window.tempSave[key] = data;
        return false;
    }
}

function safeLoad(key) {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : null;
    } catch (e) {
        console.error('Ошибка загрузки:', e);
        // Fallback - загружаем из памяти
        return window.tempSave ? window.tempSave[key] : null;
    }
}

// ============================================
// БАЗА ДАННЫХ
// ============================================
const DB = {
    modules: [
        { id: 9, title: "Задание 9", subtitle: "Гласные в корне слова", topics: ["Уровень 1", "Уровень 2", "Уровень 3", "Уровень 4"], icon: "✏️", levels: 4 },
        { id: 10, title: "Задание 10", subtitle: "Правописание приставок", topics: ["ПРЕ-/ПРИ-", "Ы/И после приставок", "ПРИ- (значения)"], icon: "🔤", levels: 3 },
        { id: 11, title: "Задание 11", subtitle: "Правописание суффиксов", topics: ["Н/НН в суффиксах", "Суффиксы прилагательных", "Суффиксы существительных"], icon: "🧩", levels: 3 },
        { id: 12, title: "Задание 12", subtitle: "Правописание окончаний", topics: ["Окончания глаголов", "Суффиксы причастий"], icon: "🔚", levels: 2 },
        { id: 13, title: "Задание 13", subtitle: "Слитное и раздельное написание", topics: ["НЕ с разными частями речи", "Тоже/также", "Что(бы)"], icon: "🔗", locked: true, levels: 3 },
        { id: 14, title: "Задание 14", subtitle: "Дефис", topics: ["Сложные слова", "Частицы -то, -либо, -нибудь"], icon: "➖", locked: true, levels: 2 },
        { id: 15, title: "Задание 15", subtitle: "Правописание наречий и предлогов", topics: ["Наречия", "Производные предлоги"], icon: "📝", locked: true, levels: 2 }
    ],
    buildings: [
        { id: 'lib', name: 'Библиотека', cost: 100, income: 10, icon: '📚', level: 1 },
        { id: 'arena', name: 'Арена тестов', cost: 300, income: 10, icon: '⚔️', level: 1 },
        { id: 'uni', name: 'Университет', cost: 1200, income: 25, icon: '🎓', level: 1 },
        { id: 'lab', name: 'Лаборатория', cost: 2500, income: 50, icon: '🧪', level: 1 },
        { id: 'obs', name: 'Обсерватория', cost: 6000, income: 100, icon: '🔭', level: 1 }
    ],
    shopItems: [
        { id: 'hair_default', type: 'hair', name: 'Базовая', cost: 0, bonus: 0, icon: '🧑‍🎓', rarity: 'common' },
        { id: 'hair_care', type: 'hair', name: 'Каре', cost: 150, bonus: 0.5, icon: '👩', rarity: 'common' },
        { id: 'hair_mohawk', type: 'hair', name: 'Ирокез', cost: 300, bonus: 1.0, icon: '👨‍🦲', rarity: 'rare' },
        { id: 'cloth_default', type: 'clothes', name: 'Футболка', cost: 0, bonus: 0, icon: '👕', rarity: 'common' },
        { id: 'cloth_hoodie', type: 'clothes', name: 'Худи', cost: 200, bonus: 0.5, icon: '🧥', rarity: 'common' },
        { id: 'cloth_suit', type: 'clothes', name: 'Костюм', cost: 1000, bonus: 2.5, icon: '🤵', rarity: 'legendary' },
        { id: 'acc_none', type: 'acc', name: 'Без аксессуаров', cost: 0, bonus: 0, icon: '✨', rarity: 'common' },
        { id: 'acc_glasses', type: 'acc', name: 'Очки', cost: 100, bonus: 0.3, icon: '👓', rarity: 'common' },
        { id: 'acc_headphones', type: 'acc', name: 'Наушники', cost: 500, bonus: 1.5, icon: '🎧', rarity: 'rare' }
    ],
    

questions: {
        9: [
            { level: 1, q: "Укажите варианты ответов, в которых во всех словах одного ряда содержится безударная проверяемая гласная корня. Запишите номера ответов.", options: ["1) романтичный, организовать, реформа", "2) логичный, раскраснеться, далёкий", "3) растирание, аплодировать, утолщённый", "4) атаковать, положение, минеральный", "5) соединиться, роскошный, смягчить"], correct: [1, 4] },
            { level: 1, q: "Укажите все варианты ответов, в которых во всех словах одного ряда содержится безударная проверяемая гласная корня. Запишите номера ответов.", options: ["1) загримировать, тончайший, приближение", "2) директива, динамический, поплавок", "3) ознаменовать, компонент, метафорический", "4) реалистический, драматург, усмирённый", "5) экологический, тиражировать, мотивировать"], correct: [0, 4] },
            { level: 2, q: "Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква. Запишите номера ответов.", options: ["1) мотивировать, тревожиться, улучшить (во лжи)", "2) вытирать, замерать (от восторга), собирательство", "3) нападение, ослабев, пловец", "4) баснописец, издавать, сбалансированный", "5) положиться (на друга), выскочить, озарение"], correct: [0, 3] },
            { level: 2, q: "Укажите варианты ответов, в которых во всех словах одного ряда пропущена безударная проверяемая гласная корня. Запишите номера ответов.", options: ["1) росток, положиться, торопливый", "2) укращать, понимание, государственный", "3) облагать (налогом), целлофановый, ремесло", "4) шелестеть, отторгать, напрягаясь", "5) роскошный, теоретический, (ранняя) седина"], correct: [3, 4] },
            { level: 3, q: "Укажите варианты ответов, в которых во всех словах одного ряда пропущена безударная проверяемая гласная корня. Запишите номера ответов.", options: ["1) основной, росток, стипендия", "2) изменение, непостижимый, подлокотник", "3) предложение, палисадник, растрепать", "4) государство, словосочетание, предъявить", "5) обижаться, роскошный, оплатить"], correct: [1, 3] },
            { level: 3, q: "Укажите варианты ответов, в которых во всех словах одного ряда пропущена безударная проверяемая гласная корня. Запишите номера ответов.", options: ["1) сплотиться, внезапно, выбирать", "2) ухватиться, хлопотать, вычисление", "3) соберёшь, кавычки, упрощённый", "4) замереть, угнетённый, поколение", "5) критиковать, укращать (зверя), обрамление"], correct: [1, 4] },
            { level: 4, q: "Укажите варианты ответов, в которых во всех словах одного ряда содержится безударная проверяемая гласная корня. Запишите номера ответов.", options: ["1) передвигаться, изложение, минеральный", "2) возникновение, нежнейший (шёлк), побледневший", "3) гимназист, завещать, прикосновение", "4) этикетка, тревожиться, происходить", "5) гористый, вишнёвый, передавать"], correct: [1, 4] },
            { level: 4, q: "Укажите все варианты ответов, в которых во всех словах одного ряда содержится безударная проверяемая гласная корня. Запишите номера ответов.", options: ["1) воспитать, увлекаться, устаревший", "2) разобщённый, располагаться, галактика", "3) экзаменатор, загадать, роскошный", "4) освежительный, очищение, непостижимый", "5) центральный, направление, загорелый"], correct: [0, 3] }
        ],
        10: [
            { level: 1, q: "Определите ряд, в котором в обоих словах пропущена одна и та же буква.", options: ["о..гладил, по..ставка", "по..черкнуть, о..бой", "пр..смирел, пр..умный", "об..грел, поз..вчера", "пр..волье, пр..уныть"], correct: [4] },
            { level: 1, q: "Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква. Запишите номера ответов.", options: ["1) завьюжило, фамильярный, гнездовье", "2) предобрый, гостеприимный, правопреемник", "3) бессрочный, исчерченный, распущенный", "4) взыскание, безынтересный, межинститутский", "5) надломить, позабросил, заношевать"], correct: [3, 4] },
            { level: 1, q: "Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква. Запишите номера ответов.", options: ["1) приданое (невесты), (включить) приёмник, притвориться (спящим)", "2) (не видно ни) ..ги, (отремонтировать) ..дание, близсидящий", "3) заинтересоваться, межинститутский, контригра", "4) конъюнктура, субъядерный, контрудар", "5) доверять, подарить, проветривать"], correct: [2, 4] },
            { level: 2, q: "Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква. Запишите номера ответов.", options: ["1) подпустить, нехватный, возместить", "2) безбрежный, распорядок, исковеркать", "3) пристрастие, присвоить, приподнятый", "4) предъявить, пьеса, объёмный", "5) переделать, супробложка, внислужебный"], correct: [1, 2] },
            { level: 2, q: "Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква. Запишите номера ответов.", options: ["1) набросок, сотрудник, разыскать", "2) расширить, недержанность, исчерпать", "3) присвоить, приобретение, преградить", "4) объём, вьётся, завьюжило", "5) предыдущий, отыграться, изыскания"], correct: [3, 4] },
            { level: 3, q: "Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква. Запишите номера ответов.", options: ["1) подобрать, незавершённая (работа), понемногу", "2) вьюнок, межъярусный, адъютант", "3) прибрежный, претерпеться (к боли), приуныть", "4) бескомпромиссный, возросший, неудержанный", "5) предписание, накусить, подправить"], correct: [2, 3] },
            { level: 3, q: "Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква. Запишите номера ответов.", options: ["1) рассредоточивать, бесперспективный, истомить", "2) приволье, премудрый, приберечь", "3) подстёжка, накусить, предшествовать", "4) постиндустриальный, разыграть, сверхъизысканный", "5) взъерошить, премьера, необъятный"], correct: [1, 4] }
        ],
        11: [
            { level: 1, q: "Укажите варианты ответов, в которых в обоих словах одного ряда пропущена одна и та же буква. Запишите номера ответов.", options: ["1) недолюбл..вать, завлад..вать", "2) изменч..вость, варень..це", "3) выносл..вый, рассматр..вая", "4) отрасл..вой, гречн..вый", "5) светл..нький, медвед..ца"], correct: [0, 1, 3] },
            { level: 1, q: "Укажите варианты ответов, в которых в обоих словах одного ряда пропущена одна и та же буква. Запишите номера ответов.", options: ["1) груш..вый, врем..чко", "2) устра..вать, продл..вать", "3) въедл..вый, посме..ваться", "4) запот..вавший, питом..ц", "5) рассчит..вать, завид..вать"], correct: [0, 3, 4] },
            { level: 2, q: "Укажите все варианты ответов, в которых в обоих словах одного ряда пропущена одна и та же буква. Запишите номера ответов.", options: ["1) встрет..шь, сброш..нный", "2) долож..шь, высуш..нный", "3) расцвеч..нный, постигн..шь (умом)", "4) привстан..шь, провер..нный", "5) дорогостоящие (препараты), (родители) подар..т (сувениры)"], correct: [0, 3] },
            { level: 2, q: "Укажите варианты ответов, в которых в обоих словах одного ряда пропущена одна и та же буква. Запишите номера ответов.", options: ["1) загон..шь, (ветер) свищ..т", "2) тревож..вшийся, (он) наточ..т (ножницы)", "3) (они) топч..т (траву), блещ..щий (умом)", "4) надломл..нный, насто..нный (напиток)", "5) окраш..нный, улучш..нный"], correct: [3, 4] },
            { level: 3, q: "Укажите варианты ответов, в которых в обоих словах одного ряда пропущена одна и та же буква. Запишите номера ответов.", options: ["1) ма..лся, отча..ться", "2) запросто, накрепко", "3) продл..вать, зависеть", "4) сирен..вый, надрыв..стый", "5) соч..нский (пляж), нищ..нский"], correct: [0, 3, 4] },
            { level: 3, q: "Укажите варианты ответов, в которых в обоих словах одного ряда пропущена одна и та же буква. Запишите номера ответов.", options: ["1) талантл..вый, пугов..ца", "2) отво..вать, звоноч..к", "3) просматр..вая, сирен..вый", "4) миндал..вый, карманч..к", "5) медвеж..нок, (любить) горяч.."], correct: [0, 2, 3] }
        ],
        12: [
            { level: 1, q: "Укажите варианты ответов, в которых в обоих словах одного ряда пропущена одна и та же буква. Запишите номера ответов.", options: ["1) встрет..шь, сброш..нный", "2) долож..шь, высуш..нный", "3) расцвеч..нный, постигн..шь (умом)", "4) привстан..шь, довер..нная (тайна)", "5) дорогостоящие (препараты), (родители) дар..т (сувениры)"], correct: [3, 4] },
            { level: 1, q: "Укажите все варианты ответов, в которых в обоих словах одного ряда пропущена одна и та же буква. Запишите номера ответов.", options: ["1) встрет..шь, сброш..нный", "2) долож..шь, высуш..нный", "3) расцвеч..нный, постигн..шь (умом)", "4) привстан..шь, провер..нный", "5) дорогостоящие (препараты), (родители) подар..т (сувениры)"], correct: [0, 3] },
            { level: 2, q: "Укажите варианты ответов, в которых в обоих словах одного ряда пропущена одна и та же буква. Запишите номера ответов.", options: ["1) загон..шь, (ветер) свищ..т", "2) тревож..вшийся, (он) наточ..т (ножницы)", "3) (они) топч..т (траву), блещ..щий (умом)", "4) надломл..нный, насто..нный (напиток)", "5) окраш..нный, улучш..нный"], correct: [3, 4] },
            { level: 2, q: "Укажите варианты ответов, в которых в обоих словах одного ряда пропущена одна и та же буква. Запишите номера ответов.", options: ["1) помн..шь, вид..мый", "2) расскаж..шь, увенч..нный", "3) верт..шься, потрат..вший", "4) леле..шь, несгиба..мый", "5) самокле..щиеся (обои), (зёрна) перемел..тся"], correct: [0, 1] }
        ],
        13: [
            { level: 1, q: "Укажите варианты ответов, в которых НЕ (НИ) с выделенным словом пишется СЛИТНО. Запишите номера ответов.", options: ["1) Он с удивлением смотрел на нас, (НЕ)ПОНИМАЯ, что происходит.", "2) (НИ)КАКИМИ словами не передать того, что почувствовали мы, впервые войдя в эти узорчатые ворота.", "3) Весной тоже случались штормы, но ветер в это время дул (НЕ)ХОЛОДНЫЙ, а тёплый и ласковый.", "4) Любовь к бурям, грозе и (НЕ)ПОГОДЕ была выражена у О.А. Кипренского в его картинах.", "5) Аркадий понял, что поступил (НЕ)ПО-ТОВАРИЩЕСКИ."], correct: [3, 4] },
            { level: 1, q: "Укажите варианты ответов, в которых НЕ (НИ) с выделенным словом пишется РАЗДЕЛЬНО. Запишите номера ответов.", options: ["1) Мы продолжали идти вперёд, (НЕ)СМОТРЯ ни на какие трудности.", "2) Был тихий, вовсе (НЕ)ЖАРКИЙ июньский день.", "3) Солнце, ещё (НЕ)СКРЫТОЕ облаками, освещает мрачную жёлто-лиловую тучу.", "4) (НЕ)СУЛИ журавля в небе, а дай синицу в руки.", "5) Если моя выходка вам кажется смешна, смейтесь: предупреждаю вас, что это меня (НИ)МАЛО не огорчит."], correct: [1, 2, 4] },
            { level: 2, q: "Укажите варианты ответов, в которых НЕ (НИ) с выделенным словом пишется СЛИТНО. Запишите номера ответов.", options: ["1) Без труда (НЕ)ВЫЛОВИШЬ и рыбку из пруда.", "2) Алёша (НИ)МАЛО не сомневался в том, что и в этот раз ему удастся показать свою необыкновенную способность.", "3) Терапевт выписывает Гавриле временные рецепты, так как обследование (НЕ)ЗАВЕРШЕНО.", "4) Казалось бы, что могло привлечь красавицу в таком (НЕ)ПРИМЕТНОМ мужчине, как он?", "5) Она его внимательно слушает, (НЕ)ЗАБЫВАЯ, однако, о своих хозяйственных обязанностях."], correct: [3] },
            { level: 2, q: "Укажите варианты ответов, в которых НЕ с выделенным словом пишется РАЗДЕЛЬНО. Запишите номера ответов.", options: ["1) Группа туристов отправилась на рыболовецком судне к совершенно (НЕ)ИЗВЕСТНОМУ острову.", "2) Зной усиливался, хотелось лежать (НЕ)ДВИГАЯСЬ и ни о чём не думать.", "3) Войдя в (НЕ)ОСВЕЩЁННУЮ комнату, я вначале не заметил фигуру человека, стоявшего у окна.", "4) За перевалом перед путешественниками открылась ещё (НЕ)ИССЛЕДОВАННАЯ местность.", "5) Даже небольшие (НЕ)РОВНОСТИ на дороге могут спровоцировать автомобильную аварию."], correct: [1, 2, 3] },
            { level: 3, q: "Укажите варианты ответов, в которых НЕ с выделенным словом пишется РАЗДЕЛЬНО. Запишите номера ответов.", options: ["1) Записи в дневнике были короткими, (НЕ)ОТРАЖАЮЩИМИ всей сложности душевных переживаний.", "2) (НЕ)ВЗИРАЯ на летний зной, мы отправились в поле за васильками и ромашками.", "3) Отключили электричество, и, (НЕ)БУДЬ у нас в доме свечей, мы весь вечер сидели бы в темноте.", "4) Близкие будут переживать за судьбу родственника (НЕ)ЗАВИСИМО от его возраста.", "5) Евгений держался спокойно, казалось, он вовсе (НЕ)СМУЩЁН произошедшим."], correct: [0, 1, 4] },
            { level: 3, q: "Укажите варианты ответов, в которых НЕ (НИ) с выделенным словом пишется РАЗДЕЛЬНО. Запишите номера ответов.", options: ["1) Мотивы его поступка отнюдь (НЕ)ОЧЕВИДНЫ.", "2) Странное дело: мои рассказы вас (НИ)ЧУТЬ не смешат.", "3) Простите великодушно: сегодня я так (НЕ)УКЛЮЖ!", "4) На обложке была крупно выведена моя фамилия, и я (НЕ)ОТРЫВАЯСЬ глядел на неё.", "5) За озером местность (НЕ)ОЖИДАННО изменилась: хвойный лес кончился, начались болота."], correct: [0, 3, 4] }
        ]
};

// ============================================
// СОСТОЯНИЕ ПРИЛОЖЕНИЯ
// ============================================
let state = {
    username: "",
    coins: 0,
    xp: 0,
    level: 1,
    streak: 0,
    lastLogin: null,
    dailyRewardClaimed: false,
    buildings: {},
    cityBalance: 0,
    inventory: ['hair_default', 'cloth_default', 'acc_none'],
    equipped: { hair: 'hair_default', clothes: 'cloth_default', acc: 'acc_none' },
    progress: {},
    achievements: [],
    soundEnabled: true,
    notificationsEnabled: true,
    mapZoom: 1,
    buildingPositions: {}
};

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================
function init() {
    console.log('🚀 Инициализация приложения...');
    
    try {
        const saved = safeLoad('dostoino_save_v4');
        console.log('💾 Загруженные данные:', saved);
        
        if (saved) {
            state = { ...state, ...saved };
            console.log('✅ Данные загружены');
            
            // Проверяем, что интерфейс существует
            const onboarding = document.getElementById('page-onboarding');
            const appInterface = document.getElementById('app-interface');
            
            if (onboarding && appInterface) {
                onboarding.style.display = 'none';
                appInterface.style.display = 'block';
                console.log('✅ Интерфейс переключен');
            } else {
                console.error('❌ Элементы интерфейса не найдены!');
            }
            
            updateUI();
            startGameLoop();
            checkDailyReward();
            navTo('roadmap');
        } else {
            console.log('ℹ️ Нет сохраненных данных, показываем онбординг');
        }
    } catch (e) {
        console.error('❌ Критическая ошибка инициализации:', e);
        // Показываем онбординг в случае ошибки
        const onboarding = document.getElementById('page-onboarding');
        const appInterface = document.getElementById('app-interface');
        if (onboarding) onboarding.style.display = 'flex';
        if (appInterface) appInterface.style.display = 'none';
    }
}

function saveGame() {
    try {
        const success = safeSave('dostoino_save_v4', state);
        if (success) {
            console.log('✅ Игра сохранена');
        } else {
            console.warn('⚠️ Сохранено во временную память');
        }
        updateUI();
    } catch (e) {
        console.error('❌ Ошибка сохранения:', e);
        showToast('⚠️ Не удалось сохранить прогресс');
    }
}

function startGame() {
    console.log('🎮 Начало игры...');
    
    const name = document.getElementById('usernameInput').value.trim();
    if (!name) {
        showToast('⚠️ Введите имя персонажа!');
        return;
    }
    if (name.length < 2) {
        showToast('⚠️ Имя должно быть не менее 2 символов');
        return;
    }
    
    state.username = name;
    state.lastLogin = Date.now();
    state.streak = 1;
    state.coins = 150;
    state.inventory = ['hair_default', 'cloth_default', 'acc_none'];
    state.equipped = { hair: 'hair_default', clothes: 'cloth_default', acc: 'acc_none' };
    
    saveGame();
    
    const onboarding = document.getElementById('page-onboarding');
    const appInterface = document.getElementById('app-interface');
    
    if (onboarding && appInterface) {
        onboarding.style.opacity = '0';
        setTimeout(() => {
            onboarding.style.display = 'none';
            appInterface.style.display = 'block';
            setTimeout(() => {
                appInterface.style.opacity = '1';
            }, 50);
        }, 300);
    }
    
    startGameLoop();
    navTo('roadmap');
    showToast('🎉 Добро пожаловать в ДОСТОЙНО!');
}

function resetProgress() {
    if (confirm('⚠️ Вы уверены? Весь прогресс будет удален безвозвратно.')) {
        try {
            localStorage.removeItem('dostoino_save_v4');
        } catch (e) {
            console.error('Ошибка очистки:', e);
        }
        window.tempSave = {};
        location.reload();
    }
}

// ============================================
// ИГРОВОЙ ЦИКЛ
// ============================================
function startGameLoop() {
    setInterval(() => {
        try {
            const income = calculateIncome();
            state.coins += income;
            state.cityBalance += income;
            saveGame();
        } catch (e) {
            console.error('Ошибка игрового цикла:', e);
        }
    }, 1000);
}

function calculateIncome() {
    let income = 0;
    try {
        DB.buildings.forEach(b => {
            if (state.buildings[b.id]) {
                income += (state.buildings[b.id].count * b.income);
            }
        });
        ['hair', 'clothes', 'acc'].forEach(type => {
            if (state.equipped[type]) {
                const item = DB.shopItems.find(i => i.id === state.equipped[type]);
                if (item) income += item.bonus;
            }
        });
    } catch (e) {
        console.error('Ошибка расчета дохода:', e);
    }
    return income;
}

function checkDailyReward() {
    try {
        const today = new Date().toDateString();
        if (state.lastLogin !== today && !state.dailyRewardClaimed) {
            state.streak++;
            state.coins += 50;
            state.dailyRewardClaimed = true;
            showToast('🎁 Ежедневная награда: +50 🪙');
            saveGame();
        }
    } catch (e) {
        console.error('Ошибка ежедневной награды:', e);
    }
}

// ============================================
// НАВИГАЦИЯ
// ============================================
function navTo(pageId) {
    console.log('🧭 Навигация:', pageId);
    
    try {
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        document.querySelectorAll('.nav-item').forEach(n => {
            n.classList.remove('active');
        });
        
        const targetPage = document.getElementById(`page-${pageId}`);
        if (targetPage) {
            targetPage.classList.add('active');
            console.log('✅ Страница активирована:', pageId);
        } else {
            console.error('❌ Страница не найдена:', pageId);
        }
        
        const navIndex = ['roadmap', 'city', 'shop', 'profile'].indexOf(pageId);
        if (navIndex !== -1) {
            const navItems = document.querySelectorAll('.nav-item');
            if (navItems[navIndex]) {
                navItems[navIndex].classList.add('active');
            }
        }
        
        if (pageId === 'roadmap') renderRoadmap();
        if (pageId === 'city') renderCity();
        if (pageId === 'shop') renderShop();
        if (pageId === 'profile') renderProfile();
        
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.scrollTop = 0;
        }
    } catch (e) {
        console.error('Ошибка навигации:', e);
    }
}

function updateUI() {
    try {
        const elements = {
            'coinDisplay': Math.floor(state.coins),
            'headerName': state.username,
            'headerLevel': state.level,
            'headerXP': state.xp % 100,
            'streakDisplay': state.streak,
            'profileName': state.username,
            'profileXp': state.xp % 100,
            'cityIncome': calculateIncome().toFixed(1) + ' 🪙/сек',
            'cityBalance': Math.floor(state.cityBalance),
            'cpsDisplay': calculateIncome().toFixed(1),
            'avatarBonus': '+' + calculateBonus().toFixed(1)
        };
        
        for (const [id, value] of Object.entries(elements)) {
            const el = document.getElementById(id);
            if (el) {
                if (id === 'xpFill') {
                    el.style.width = `${value}%`;
                } else {
                    el.innerText = value;
                }
            }
        }
        
        const icon = getAvatarIcon();
        ['headerAvatar', 'shopAvatarPreview', 'profileAvatar', 'startAvatar'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerText = icon;
        });
    } catch (e) {
        console.error('Ошибка обновления UI:', e);
    }
}

function calculateBonus() {
    let bonus = 0;
    ['hair', 'clothes', 'acc'].forEach(type => {
        if (state.equipped[type]) {
            const item = DB.shopItems.find(x => x.id === state.equipped[type]);
            if (item) bonus += item.bonus;
        }
    });
    return bonus;
}

function getAvatarIcon() {
    let icon = '🧑‍🎓';
    if (state.equipped.hair) {
        const h = DB.shopItems.find(x => x.id === state.equipped.hair);
        if (h) icon = h.icon;
    }
    return icon;
}

function showToast(msg) {
    try {
        const t = document.getElementById('toast');
        if (t) {
            t.innerText = msg;
            t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 3000);
        }
    } catch (e) {
        console.error('Ошибка toast:', e);
    }
}

// ============================================
// ДОРОЖНАЯ КАРТА
// ============================================
function renderRoadmap() {
    try {
        const container = document.getElementById('roadmapNodes');
        if (!container) {
            console.error('Контейнер roadmapNodes не найден!');
            return;
        }
        container.innerHTML = '';
        
        const totalModules = DB.modules.length;
        const containerWidth = container.offsetWidth || 700;
        const nodeSpacing = 320;
        const centerX = containerWidth / 2;
        const nodePositions = [];
        
        DB.modules.forEach((mod, index) => {
            const offset = index % 2 === 0 ? -220 : 220;
            const x = centerX + offset;
            const y = 150 + (index * nodeSpacing);
            nodePositions.push({ x, y, index, mod });
        });
        
        for (let i = 0; i < nodePositions.length - 1; i++) {
            const start = nodePositions[i];
            const end = nodePositions[i + 1];
            const numBalls = 3;
            for (let j = 1; j <= numBalls; j++) {
                const t = j / (numBalls + 1);
                const ballX = start.x + (end.x - start.x) * t;
                const ballY = start.y + (end.y - start.y) * t;
                const sizeClass = j % 2 === 0 ? 'medium' : 'small';
                const ball = document.createElement('div');
                ball.className = `path-ball ${sizeClass}`;
                ball.style.left = `${ballX}px`;
                ball.style.top = `${ballY}px`;
                ball.style.zIndex = '0';
                container.appendChild(ball);
            }
        }
        
        nodePositions.forEach(({ x, y, index, mod }) => {
            const modState = state.progress[mod.id] || { levelIndex: 0, attempts: 0, gold: false, completed: false };
            const prevMod = DB.modules.find(m => m.id === mod.id - 1);
            const prevDone = prevMod ? (state.progress[prevMod.id] && state.progress[prevMod.id].completed) : true;
            const isLocked = !prevDone && mod.id !== 9;
            
            let statusClass = '';
            if (modState.completed) statusClass = 'completed';
            else if (modState.levelIndex > 0 || mod.id === 9) statusClass = 'current';
            if (isLocked) statusClass = 'locked';
            
            const totalLevels = mod.levels || 3;
            const progressDots = Array.from({ length: totalLevels }, (_, i) => {
                let dotClass = 'progress-dot';
                if (i < modState.levelIndex) dotClass += ' completed';
                if (i === modState.levelIndex && !isLocked) dotClass += ' current';
                return `<div class="${dotClass}"></div>`;
            }).join('');
            
            const cardOffset = index % 2 === 0 ? 140 : -300;
            const nodeHTML = `
                <div class="roadmap-node ${statusClass}" style="left: ${x - 45}px; top: ${y - 45}px;" onclick="${isLocked ? '' : `openModule(${mod.id})`}">
                    ${modState.gold ? '<div class="gold-crown">👑</div>' : ''}
                    ${isLocked ? '<div class="node-lock">🔒</div>' : ''}
                    ${modState.levelIndex === 0 && mod.id === 9 ? '<div class="start-button">▶ START</div>' : ''}
                    <div class="node-circle">${mod.id}<div class="node-number">${mod.icon}</div></div>
                    <div class="node-info" style="left: ${cardOffset}px;">
                        <div class="node-title">${mod.title}</div>
                        <div class="node-subtitle">${mod.subtitle}</div>
                        <div class="node-progress">${progressDots}</div>
                        ${modState.completed ? '<div style="margin-top:10px; font-size:0.75rem; color:var(--success); font-weight:600;">✅ Пройдено</div>' : ''}
                    </div>
                </div>`;
            container.innerHTML += nodeHTML;
        });
        
        const lastNode = nodePositions[nodePositions.length - 1];
        if (lastNode) {
            const spacer = document.createElement('div');
            spacer.style.height = '250px';
            spacer.style.position = 'absolute';
            spacer.style.left = '0';
            spacer.style.top = `${lastNode.y + 150}px`;
            spacer.style.width = '100%';
            container.appendChild(spacer);
        }
        
        console.log('✅ Дорожная карта отрисована');
    } catch (e) {
        console.error('❌ Ошибка отрисовки дорожной карты:', e);
    }
}

let currentQuiz = { moduleId: null, level: 1, topic: null, questions: [], index: 0, correctCount: 0, streak: 0 };
let selectedOptions = [];

function openModule(modId) {
    try {
        const mod = DB.modules.find(m => m.id === modId);
        const modState = state.progress[modId] || { levelIndex: 0, attempts: 0, gold: false, completed: false };
        if (modState.completed) { showToast('✅ Модуль уже пройден!'); return; }
        const topicName = mod.topics[modState.levelIndex] || `Уровень ${modState.levelIndex + 1}`;
        let qs = DB.questions[modId]?.filter(q => q.level === (modState.levelIndex + 1)) || [];
        if (qs.length === 0) { qs = [{ level: modState.levelIndex + 1, q: `Вопрос уровня ${modState.levelIndex + 1}`, options: ["Верно", "Неверно", "Не знаю"], correct: 0, explanation: "Правильный ответ." }]; }
        currentQuiz = { moduleId: modId, level: modState.levelIndex + 1, topic: topicName, questions: qs, index: 0, correctCount: 0, streak: 0 };
        navTo('quiz');
        renderQuestion();
    } catch (e) {
        console.error('Ошибка открытия модуля:', e);
    }
}

function renderQuestion() {
    try {
        const q = currentQuiz.questions[currentQuiz.index];
        document.getElementById('quizTaskNum').innerText = currentQuiz.moduleId;
        document.getElementById('quizCurrent').innerText = currentQuiz.index + 1;
        document.getElementById('quizTotal').innerText = currentQuiz.questions.length;
        document.getElementById('quizStreak').innerText = currentQuiz.streak;
        document.getElementById('questionText').innerText = q.q;
        const optsContainer = document.getElementById('optionsContainer');
        optsContainer.innerHTML = '';
        selectedOptions = [];
        q.options.forEach((opt, idx) => {
            const div = document.createElement('div');
            div.className = 'quiz-option';
            div.innerHTML = `<span class="option-number">${idx + 1}</span><span>${opt}</span>`;
            div.onclick = () => selectOption(idx, div);
            optsContainer.appendChild(div);
        });
        document.getElementById('checkAnswerBtn').style.display = 'block';
        document.getElementById('nextQuestionBtn').style.display = 'none';
        document.getElementById('quizResult').classList.add('hidden');
    } catch (e) {
        console.error('Ошибка отрисовки вопроса:', e);
    }
}

function selectOption(idx, el) {
    try {
        const q = currentQuiz.questions[currentQuiz.index];
        const isMultipleChoice = Array.isArray(q.correct);
        if (isMultipleChoice) {
            if (selectedOptions.includes(idx)) {
                selectedOptions = selectedOptions.filter(i => i !== idx);
                el.classList.remove('selected');
            } else {
                selectedOptions.push(idx);
                el.classList.add('selected');
            }
        } else {
            selectedOptions = [idx];
            document.querySelectorAll('.quiz-option').forEach(d => d.classList.remove('selected'));
            el.classList.add('selected');
        }
    } catch (e) {
        console.error('Ошибка выбора ответа:', e);
    }
}

function checkAnswer() {
    try {
        if (selectedOptions.length === 0) { showToast('⚠️ Выберите вариант ответа!'); return; }
        const q = currentQuiz.questions[currentQuiz.index];
        const opts = document.querySelectorAll('.quiz-option');
        document.getElementById('checkAnswerBtn').style.display = 'none';
        document.getElementById('nextQuestionBtn').style.display = 'block';
        let isCorrect = false;
        if (Array.isArray(q.correct)) {
            const selectedSet = new Set(selectedOptions.sort());
            const correctSet = new Set(q.correct.sort());
            isCorrect = selectedSet.size === correctSet.size && [...selectedSet].every(val => correctSet.has(val));
        } else {
            isCorrect = selectedOptions.length === 1 && selectedOptions[0] === q.correct;
        }
        if (isCorrect) {
            selectedOptions.forEach(idx => opts[idx].classList.add('correct'));
            currentQuiz.correctCount++;
            currentQuiz.streak++;
            state.xp += 10;
            state.coins += 5;
            document.getElementById('quizResult').classList.remove('hidden');
            document.getElementById('quizResult').innerHTML = `<div class="result-icon">✅</div><h4>Отлично!</h4><p>${q.explanation || 'Правильный ответ!'}</p><button class="btn-secondary" onclick="showExplanation()">📖 Пояснение</button>`;
            showToast(`🎯 Верно! +10 XP, +5 🪙`);
        } else {
            selectedOptions.forEach(idx => opts[idx].classList.add('wrong'));
            if (Array.isArray(q.correct)) { q.correct.forEach(idx => opts[idx].classList.add('correct')); } else { opts[q.correct].classList.add('correct'); }
            currentQuiz.streak = 0;
            document.getElementById('quizResult').classList.remove('hidden');
            document.getElementById('quizResult').innerHTML = `<div class="result-icon">❌</div><h4 style="color:var(--error)">Ошибка</h4><p>${q.explanation || 'Правильный ответ подсвечен.'}</p>`;
            showToast('❌ Ошибка! Попробуйте еще раз.');
        }
        saveGame();
    } catch (e) {
        console.error('Ошибка проверки ответа:', e);
    }
}

function showExplanation() {
    const q = currentQuiz.questions[currentQuiz.index];
    alert(`📖 Пояснение:\n\n${q.explanation || 'Нет дополнительного пояснения.'}`);
}

function nextQuestion() {
    currentQuiz.index++;
    selectedOptions = [];
    if (currentQuiz.index < currentQuiz.questions.length) { renderQuestion(); } else { finishModule(); }
}

function finishModule() {
    try {
        const mod = DB.modules.find(m => m.id === currentQuiz.moduleId);
        if (!state.progress[currentQuiz.moduleId]) { state.progress[currentQuiz.moduleId] = { levelIndex: 0, attempts: 0, gold: false, completed: false }; }
        const p = state.progress[currentQuiz.moduleId];
        p.attempts++;
        const accuracy = currentQuiz.correctCount / currentQuiz.questions.length;
        const totalLevels = mod.levels || 1;
        if (accuracy >= 0.8) {
            if (p.levelIndex < totalLevels - 1) {
                p.levelIndex++;
                showToast(`📚 Уровень ${currentQuiz.level} завершён! Открыт уровень ${p.levelIndex + 1}`);
                state.xp += 50;
                state.coins += 25;
            } else {
                p.completed = true;
                if (p.attempts >= 3) { p.gold = true; showToast('🏆 ЗОЛОТО ПОЛУЧЕНО!'); state.xp += 100; state.coins += 50; checkAchievement('gold_student'); showCelebration(); }
                showToast('🎉 Модуль завершен!');
                state.xp += 200;
                checkAchievement('module_complete');
            }
        } else { showToast('💪 Попробуйте еще раз (нужно 80% правильных)'); }
        checkAchievement('first_blood');
        saveGame();
        navTo('roadmap');
    } catch (e) {
        console.error('Ошибка завершения модуля:', e);
    }
}

// ============================================
// ГОРОД
// ============================================
function renderCity() {
    try {
        const grid = document.getElementById('buildingsGrid');
        const mapGrid = document.getElementById('mapGrid');
        if (!grid || !mapGrid) { console.error('Элементы города не найдены!'); return; }
        grid.innerHTML = '';
        mapGrid.innerHTML = '';
        for (let i = 0; i < 25; i++) {
            const cell = document.createElement('div');
            cell.className = 'map-cell';
            cell.dataset.index = i;
            let buildingHere = null;
            for (const [buildingId, positions] of Object.entries(state.buildingPositions)) {
                if (positions.includes(i)) { const b = DB.buildings.find(x => x.id === buildingId); if (b) { buildingHere = b; break; } }
            }
            if (buildingHere) { cell.classList.add('occupied'); cell.innerHTML = `${buildingHere.icon}<span class="building-count">${state.buildings[buildingHere.id].count}</span>`; cell.onclick = () => showBuildingInfo(buildingHere); } else { cell.innerHTML = '📍'; cell.onclick = () => placeBuilding(i); }
            mapGrid.appendChild(cell);
        }
        DB.buildings.forEach(b => {
            const owned = state.buildings[b.id] || { count: 0, level: 1 };
            const canBuy = state.coins >= b.cost;
            grid.innerHTML += `<div class="building-card ${owned.count > 0 ? 'owned' : ''}"><span class="building-icon">${b.icon}</span><div class="building-name">${b.name}</div><div class="building-income">+${b.income} 🪙/сек</div><div class="building-level">Уровень: ${owned.level}</div><div class="building-cost">${b.cost.toLocaleString()} 🪙</div><div style="font-size:0.75rem; color:var(--text-sec); margin-bottom:10px;">У вас: ${owned.count}</div><button class="btn-buy" ${!canBuy ? 'disabled' : ''} onclick="buyBuilding('${b.id}')">${canBuy ? 'Купить' : 'Не хватает'}</button></div>`;
        });
    } catch (e) {
        console.error('Ошибка отрисовки города:', e);
    }
}

let selectedBuildingForPlacement = null;
function buyBuilding(id) {
    try {
        const b = DB.buildings.find(x => x.id === id);
        if (state.coins >= b.cost) {
            state.coins -= b.cost;
            if (!state.buildings[id]) { state.buildings[id] = { count: 0, level: 1 }; }
            state.buildings[id].count++;
            state.buildings[id].level = Math.min(state.buildings[id].level + 1, 10);
            b.cost = Math.floor(b.cost * 1.15);
            selectedBuildingForPlacement = id;
            showToast(`🏗️ ${b.name} куплено! Выберите место на карте.`);
            saveGame();
            renderCity();
            checkAchievement('magnate');
        } else { showToast('❌ Недостаточно монет!'); }
    } catch (e) {
        console.error('Ошибка покупки здания:', e);
    }
}

function placeBuilding(cellIndex) {
    try {
        if (!selectedBuildingForPlacement) { showToast('⚠️ Сначала купите здание!'); return; }
        for (const positions of Object.values(state.buildingPositions)) { if (positions.includes(cellIndex)) { showToast('⚠️ Эта ячейка занята!'); return; } }
        if (!state.buildingPositions[selectedBuildingForPlacement]) { state.buildingPositions[selectedBuildingForPlacement] = []; }
        state.buildingPositions[selectedBuildingForPlacement].push(cellIndex);
        selectedBuildingForPlacement = null;
        showToast('🏗️ Здание размещено!');
        saveGame();
        renderCity();
    } catch (e) {
        console.error('Ошибка размещения здания:', e);
    }
}

function showBuildingInfo(building) {
    const count = state.buildings[building.id].count;
    const income = count * building.income;
    alert(`📊 ${building.name}\n\nКоличество: ${count}\nДоход: ${income} 🪙/сек\nУровень: ${state.buildings[building.id].level}`);
}

function zoomMap(direction) { state.mapZoom += direction * 0.1; state.mapZoom = Math.max(0.5, Math.min(2, state.mapZoom)); document.getElementById('mapGrid').style.transform = `scale(${state.mapZoom})`; saveGame(); }
function resetMap() { state.mapZoom = 1; document.getElementById('mapGrid').style.transform = `scale(1)`; saveGame(); }

// ============================================
// МАГАЗИН
// ============================================
function renderShop(filter = 'all') {
    try {
        const grid = document.getElementById('shopGrid');
        if (!grid) { console.error('ShopGrid не найден!'); return; }
        grid.innerHTML = '';
        let count = 0;
        DB.shopItems.forEach(item => {
            if (filter !== 'all' && item.type !== filter) return;
            const owned = state.inventory.includes(item.id);
            const equipped = state.equipped[item.type] === item.id;
            count++;
            grid.innerHTML += `<div class="shop-item ${owned ? 'owned' : 'locked'} ${equipped ? 'equipped' : ''}" onclick="handleShopClick('${item.id}')"><span class="shop-icon">${item.icon}</span><div class="shop-name">${item.name}</div><div class="shop-bonus">+${item.bonus}/сек</div><div class="shop-price">${owned ? (equipped ? '✓ Выбрано' : 'Надеть') : item.cost + ' 🪙'}</div></div>`;
        });
        document.getElementById('shopCount').innerText = `${count} предметов`;
        updateUI();
    } catch (e) {
        console.error('Ошибка отрисовки магазина:', e);
    }
}

function filterShop(type) { document.querySelectorAll('.tab').forEach(t => t.classList.remove('active')); event.target.classList.add('active'); renderShop(type); }

function handleShopClick(id) {
    try {
        const item = DB.shopItems.find(i => i.id === id);
        const owned = state.inventory.includes(id);
        if (owned) { state.equipped[item.type] = id; saveGame(); renderShop(); showToast(`✅ ${item.name} надето`); }
        else {
            if (state.coins >= item.cost) { state.coins -= item.cost; state.inventory.push(id); state.equipped[item.type] = id; saveGame(); renderShop(); showToast(`🛒 Куплено: ${item.name}`); }
            else { showToast('❌ Недостаточно монет!'); }
        }
    } catch (e) {
        console.error('Ошибка покупки предмета:', e);
    }
}

function saveAvatar() { showToast('💾 Внешность сохранена!'); }
function resetAvatar() { state.equipped = { hair: 'hair_default', clothes: 'cloth_default', acc: 'acc_none' }; saveGame(); renderShop(); showToast('🔄 Внешность сброшена'); }

// ============================================
// ПРОФИЛЬ
// ============================================
function renderProfile() {
    try {
        updateUI();
        const list = document.getElementById('achievementsList');
        if (!list) { console.error('AchievementsList не найден!'); return; }
        list.innerHTML = '';
        const achievements = [
            { id: 'first_blood', icon: '🎯', name: 'Первая кровь', desc: 'Реши первый тест', unlocked: state.achievements.includes('first_blood') },
            { id: 'magnate', icon: '💰', name: 'Магнат', desc: 'Купи 5 зданий', unlocked: state.achievements.includes('magnate') },
            { id: 'gold_student', icon: '⭐', name: 'Золотой студент', desc: 'Получи золото в задании', unlocked: state.achievements.includes('gold_student') },
            { id: 'module_complete', icon: '📚', name: 'Эрудит', desc: 'Заверши модуль', unlocked: state.achievements.includes('module_complete') },
            { id: 'rich', icon: '🏆', name: 'Богач', desc: 'Накопи 10000 монет', unlocked: state.coins >= 10000 },
            { id: 'streak_7', icon: '🔥', name: 'Неделя подряд', desc: '7 дней стрик', unlocked: state.streak >= 7 }
        ];
        achievements.forEach(ach => {
            list.innerHTML += `<div class="achievement-item ${ach.unlocked ? 'unlocked' : 'locked'}"><span class="ach-icon">${ach.unlocked ? ach.icon : '🔒'}</span><div><strong>${ach.name}</strong><p>${ach.desc}</p></div></div>`;
        });
    } catch (e) {
        console.error('Ошибка отрисовки профиля:', e);
    }
}

function checkAchievement(id) { if (!state.achievements.includes(id)) { state.achievements.push(id); showToast(`🏆 Ачивка: ${id}!`); saveGame(); } }

function showCelebration() {
    try {
        const container = document.createElement('div');
        container.className = 'celebration-balloons';
        const colors = ['#7f2aff', '#ffcc00', '#2ed573', '#ff4757'];
        for (let i = 0; i < 15; i++) {
            const balloon = document.createElement('div');
            balloon.className = 'celebration-balloon';
            balloon.style.cssText = `position:absolute;left:${Math.random()*100}%;bottom:-150px;width:${60+Math.random()*40}px;height:${60+Math.random()*40}px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:50%;animation:floatUp ${3+Math.random()*2}s ease-in forwards;z-index:9999;`;
            container.appendChild(balloon);
        }
        document.body.appendChild(container);
        setTimeout(() => container.remove(), 6000);
    } catch (e) {
        console.error('Ошибка празднования:', e);
    }
}

// ============================================
// ЗАПУСК
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 DOM загружен, запускаем приложение...');
    console.log('📱 User Agent:', navigator.userAgent);
    console.log('📱 LocalStorage доступен:', !!window.localStorage);
    
    try {
        init();
    } catch (e) {
        console.error('❌ Критическая ошибка при запуске:', e);
        alert('Произошла ошибка при загрузке приложения. Попробуйте обновить страницу.');
    }
});
