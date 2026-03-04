const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ─── Testaments ───────────────────────────────────────────────
  const ot = await prisma.testament.upsert({
    where: { name: 'Old Testament' },
    update: {},
    create: { name: 'Old Testament', order: 1 },
  });

  const nt = await prisma.testament.upsert({
    where: { name: 'New Testament' },
    update: {},
    create: { name: 'New Testament', order: 2 },
  });

  // ─── Books: Full Coptic Orthodox Canon ────────────────────────

  const oldTestamentBooks = [
    { name: 'Genesis', nameArabic: 'سفر التكوين', abbreviation: 'Gen', totalChapters: 50, order: 1 },
    { name: 'Exodus', nameArabic: 'سفر الخروج', abbreviation: 'Exo', totalChapters: 40, order: 2 },
    { name: 'Leviticus', nameArabic: 'سفر اللاويين', abbreviation: 'Lev', totalChapters: 27, order: 3 },
    { name: 'Numbers', nameArabic: 'سفر العدد', abbreviation: 'Num', totalChapters: 36, order: 4 },
    { name: 'Deuteronomy', nameArabic: 'سفر التثنية', abbreviation: 'Deu', totalChapters: 34, order: 5 },
    { name: 'Joshua', nameArabic: 'سفر يشوع', abbreviation: 'Jos', totalChapters: 24, order: 6 },
    { name: 'Judges', nameArabic: 'سفر القضاة', abbreviation: 'Jdg', totalChapters: 21, order: 7 },
    { name: 'Ruth', nameArabic: 'سفر راعوث', abbreviation: 'Rut', totalChapters: 4, order: 8 },
    { name: '1 Kingdoms', nameArabic: 'سفر الملوك الأول', abbreviation: '1Sa', totalChapters: 31, order: 9 },
    { name: '2 Kingdoms', nameArabic: 'سفر الملوك الثاني', abbreviation: '2Sa', totalChapters: 24, order: 10 },
    { name: '3 Kingdoms', nameArabic: 'سفر الملوك الثالث', abbreviation: '1Ki', totalChapters: 22, order: 11 },
    { name: '4 Kingdoms', nameArabic: 'سفر الملوك الرابع', abbreviation: '2Ki', totalChapters: 25, order: 12 },
    { name: '1 Chronicles', nameArabic: 'سفر أخبار الأيام الأول', abbreviation: '1Ch', totalChapters: 29, order: 13 },
    { name: '2 Chronicles', nameArabic: 'سفر أخبار الأيام الثاني', abbreviation: '2Ch', totalChapters: 36, order: 14 },
    { name: '1 Esdras', nameArabic: 'سفر عزرا الأول', abbreviation: '1Es', totalChapters: 9, order: 15, isDeuterocanon: true },
    { name: '2 Esdras', nameArabic: 'سفر عزرا الثاني', abbreviation: '2Es', totalChapters: 23, order: 16 },
    { name: 'Tobit', nameArabic: 'سفر طوبيا', abbreviation: 'Tob', totalChapters: 14, order: 17, isDeuterocanon: true },
    { name: 'Judith', nameArabic: 'سفر يهوديت', abbreviation: 'Jdt', totalChapters: 16, order: 18, isDeuterocanon: true },
    { name: 'Esther', nameArabic: 'سفر أستير', abbreviation: 'Est', totalChapters: 16, order: 19 },
    { name: 'Job', nameArabic: 'سفر أيوب', abbreviation: 'Job', totalChapters: 42, order: 20 },
    { name: 'Psalms', nameArabic: 'سفر المزامير', abbreviation: 'Psa', totalChapters: 151, order: 21, isSeptuagint: true },
    { name: 'Proverbs', nameArabic: 'سفر الأمثال', abbreviation: 'Pro', totalChapters: 31, order: 22 },
    { name: 'Ecclesiastes', nameArabic: 'سفر الجامعة', abbreviation: 'Ecc', totalChapters: 12, order: 23 },
    { name: 'Song of Songs', nameArabic: 'سفر نشيد الأنشاد', abbreviation: 'Sng', totalChapters: 8, order: 24 },
    { name: 'Wisdom of Solomon', nameArabic: 'سفر الحكمة', abbreviation: 'Wis', totalChapters: 19, order: 25, isDeuterocanon: true },
    { name: 'Sirach', nameArabic: 'سفر يشوع بن سيراخ', abbreviation: 'Sir', totalChapters: 51, order: 26, isDeuterocanon: true },
    { name: 'Isaiah', nameArabic: 'سفر إشعياء', abbreviation: 'Isa', totalChapters: 66, order: 27 },
    { name: 'Jeremiah', nameArabic: 'سفر إرميا', abbreviation: 'Jer', totalChapters: 52, order: 28 },
    { name: 'Baruch', nameArabic: 'سفر باروخ', abbreviation: 'Bar', totalChapters: 5, order: 29, isDeuterocanon: true },
    { name: 'Lamentations', nameArabic: 'سفر مراثي إرميا', abbreviation: 'Lam', totalChapters: 5, order: 30 },
    { name: 'Letter of Jeremiah', nameArabic: 'رسالة إرميا', abbreviation: 'LJe', totalChapters: 1, order: 31, isDeuterocanon: true },
    { name: 'Ezekiel', nameArabic: 'سفر حزقيال', abbreviation: 'Eze', totalChapters: 48, order: 32 },
    { name: 'Daniel', nameArabic: 'سفر دانيال', abbreviation: 'Dan', totalChapters: 14, order: 33 },
    { name: 'Hosea', nameArabic: 'سفر هوشع', abbreviation: 'Hos', totalChapters: 14, order: 34 },
    { name: 'Joel', nameArabic: 'سفر يوئيل', abbreviation: 'Joe', totalChapters: 3, order: 35 },
    { name: 'Amos', nameArabic: 'سفر عاموس', abbreviation: 'Amo', totalChapters: 9, order: 36 },
    { name: 'Obadiah', nameArabic: 'سفر عوبديا', abbreviation: 'Oba', totalChapters: 1, order: 37 },
    { name: 'Jonah', nameArabic: 'سفر يونان', abbreviation: 'Jon', totalChapters: 4, order: 38 },
    { name: 'Micah', nameArabic: 'سفر ميخا', abbreviation: 'Mic', totalChapters: 7, order: 39 },
    { name: 'Nahum', nameArabic: 'سفر ناحوم', abbreviation: 'Nah', totalChapters: 3, order: 40 },
    { name: 'Habakkuk', nameArabic: 'سفر حبقوق', abbreviation: 'Hab', totalChapters: 3, order: 41 },
    { name: 'Zephaniah', nameArabic: 'سفر صفنيا', abbreviation: 'Zep', totalChapters: 3, order: 42 },
    { name: 'Haggai', nameArabic: 'سفر حجي', abbreviation: 'Hag', totalChapters: 2, order: 43 },
    { name: 'Zechariah', nameArabic: 'سفر زكريا', abbreviation: 'Zec', totalChapters: 14, order: 44 },
    { name: 'Malachi', nameArabic: 'سفر ملاخي', abbreviation: 'Mal', totalChapters: 4, order: 45 },
    { name: '1 Maccabees', nameArabic: 'سفر المكابيين الأول', abbreviation: '1Ma', totalChapters: 16, order: 46, isDeuterocanon: true },
    { name: '2 Maccabees', nameArabic: 'سفر المكابيين الثاني', abbreviation: '2Ma', totalChapters: 15, order: 47, isDeuterocanon: true },
    { name: '3 Maccabees', nameArabic: 'سفر المكابيين الثالث', abbreviation: '3Ma', totalChapters: 7, order: 48, isDeuterocanon: true },
  ];

  const newTestamentBooks = [
    { name: 'Matthew', nameArabic: 'إنجيل متى', abbreviation: 'Mat', totalChapters: 28, order: 1 },
    { name: 'Mark', nameArabic: 'إنجيل مرقس', abbreviation: 'Mar', totalChapters: 16, order: 2 },
    { name: 'Luke', nameArabic: 'إنجيل لوقا', abbreviation: 'Luk', totalChapters: 24, order: 3 },
    { name: 'John', nameArabic: 'إنجيل يوحنا', abbreviation: 'Joh', totalChapters: 21, order: 4 },
    { name: 'Acts', nameArabic: 'أعمال الرسل', abbreviation: 'Act', totalChapters: 28, order: 5 },
    { name: 'Romans', nameArabic: 'رسالة رومية', abbreviation: 'Rom', totalChapters: 16, order: 6 },
    { name: '1 Corinthians', nameArabic: 'رسالة كورنثوس الأولى', abbreviation: '1Co', totalChapters: 16, order: 7 },
    { name: '2 Corinthians', nameArabic: 'رسالة كورنثوس الثانية', abbreviation: '2Co', totalChapters: 13, order: 8 },
    { name: 'Galatians', nameArabic: 'رسالة غلاطية', abbreviation: 'Gal', totalChapters: 6, order: 9 },
    { name: 'Ephesians', nameArabic: 'رسالة أفسس', abbreviation: 'Eph', totalChapters: 6, order: 10 },
    { name: 'Philippians', nameArabic: 'رسالة فيلبي', abbreviation: 'Php', totalChapters: 4, order: 11 },
    { name: 'Colossians', nameArabic: 'رسالة كولوسي', abbreviation: 'Col', totalChapters: 4, order: 12 },
    { name: '1 Thessalonians', nameArabic: 'رسالة تسالونيكي الأولى', abbreviation: '1Th', totalChapters: 5, order: 13 },
    { name: '2 Thessalonians', nameArabic: 'رسالة تسالونيكي الثانية', abbreviation: '2Th', totalChapters: 3, order: 14 },
    { name: '1 Timothy', nameArabic: 'رسالة تيموثاوس الأولى', abbreviation: '1Ti', totalChapters: 6, order: 15 },
    { name: '2 Timothy', nameArabic: 'رسالة تيموثاوس الثانية', abbreviation: '2Ti', totalChapters: 4, order: 16 },
    { name: 'Titus', nameArabic: 'رسالة تيطس', abbreviation: 'Tit', totalChapters: 3, order: 17 },
    { name: 'Philemon', nameArabic: 'رسالة فليمون', abbreviation: 'Phm', totalChapters: 1, order: 18 },
    { name: 'Hebrews', nameArabic: 'الرسالة إلى العبرانيين', abbreviation: 'Heb', totalChapters: 13, order: 19 },
    { name: 'James', nameArabic: 'رسالة يعقوب', abbreviation: 'Jas', totalChapters: 5, order: 20 },
    { name: '1 Peter', nameArabic: 'رسالة بطرس الأولى', abbreviation: '1Pe', totalChapters: 5, order: 21 },
    { name: '2 Peter', nameArabic: 'رسالة بطرس الثانية', abbreviation: '2Pe', totalChapters: 3, order: 22 },
    { name: '1 John', nameArabic: 'رسالة يوحنا الأولى', abbreviation: '1Jn', totalChapters: 5, order: 23 },
    { name: '2 John', nameArabic: 'رسالة يوحنا الثانية', abbreviation: '2Jn', totalChapters: 1, order: 24 },
    { name: '3 John', nameArabic: 'رسالة يوحنا الثالثة', abbreviation: '3Jn', totalChapters: 1, order: 25 },
    { name: 'Jude', nameArabic: 'رسالة يهوذا', abbreviation: 'Jud', totalChapters: 1, order: 26 },
    { name: 'Revelation', nameArabic: 'سفر الرؤيا', abbreviation: 'Rev', totalChapters: 22, order: 27 },
  ];

  // Create OT books
  for (const bookData of oldTestamentBooks) {
    await prisma.book.upsert({
      where: { abbreviation: bookData.abbreviation },
      update: {},
      create: {
        ...bookData,
        testamentId: ot.id,
        isSeptuagint: bookData.isSeptuagint || false,
        isDeuterocanon: bookData.isDeuterocanon || false,
      },
    });
  }

  // Create NT books
  for (const bookData of newTestamentBooks) {
    await prisma.book.upsert({
      where: { abbreviation: bookData.abbreviation },
      update: {},
      create: {
        ...bookData,
        testamentId: nt.id,
        isSeptuagint: false,
        isDeuterocanon: false,
      },
    });
  }

  // ─── Create chapters and sample verses ────────────────────────
  const allBooks = await prisma.book.findMany({ orderBy: { order: 'asc' } });

  for (const book of allBooks) {
    for (let ch = 1; ch <= book.totalChapters; ch++) {
      const chapter = await prisma.chapter.upsert({
        where: {
          bookId_chapterNumber: {
            bookId: book.id,
            chapterNumber: ch,
          },
        },
        update: {},
        create: {
          bookId: book.id,
          chapterNumber: ch,
        },
      });

      // Create sample verses (3 per chapter for demo purposes)
      // In production, these would be populated from actual Bible text data
      const sampleVerseCount = 3;
      for (let v = 1; v <= sampleVerseCount; v++) {
        await prisma.verse.upsert({
          where: {
            chapterId_verseNumber: {
              chapterId: chapter.id,
              verseNumber: v,
            },
          },
          update: {},
          create: {
            chapterId: chapter.id,
            verseNumber: v,
            textEnglish: `[${book.name} ${ch}:${v}] Sample verse text. This will be replaced with actual Septuagint/Orthodox Bible text.`,
            textArabic: `[${book.nameArabic || book.name} ${ch}:${v}] نص تجريبي. سيتم استبداله بالنص الفعلي.`,
          },
        });
      }
    }
  }

  // ─── Seed well-known verses for demo ──────────────────────────
  const genesisBook = await prisma.book.findUnique({ where: { abbreviation: 'Gen' } });
  if (genesisBook) {
    const gen1 = await prisma.chapter.findUnique({
      where: { bookId_chapterNumber: { bookId: genesisBook.id, chapterNumber: 1 } },
    });
    if (gen1) {
      const genesisVerses = [
        { verseNumber: 1, textEnglish: 'In the beginning God made the heaven and the earth.', textArabic: 'في البدء خلق الله السماوات والأرض.' },
        { verseNumber: 2, textEnglish: 'But the earth was unsightly and unfurnished, and darkness was over the deep, and the Spirit of God moved over the water.', textArabic: 'وكانت الأرض خربة وخالية، وعلى وجه الغمر ظلمة، وروح الله يرف على وجه المياه.' },
        { verseNumber: 3, textEnglish: 'And God said, Let there be light, and there was light.', textArabic: 'وقال الله: ليكن نور، فكان نور.' },
      ];

      for (const v of genesisVerses) {
        await prisma.verse.upsert({
          where: { chapterId_verseNumber: { chapterId: gen1.id, verseNumber: v.verseNumber } },
          update: { textEnglish: v.textEnglish, textArabic: v.textArabic },
          create: { chapterId: gen1.id, ...v },
        });
      }
    }
  }

  // Seed Psalm 23 (LXX Psalm 22)
  const psalmBook = await prisma.book.findUnique({ where: { abbreviation: 'Psa' } });
  if (psalmBook) {
    const psalm23 = await prisma.chapter.findUnique({
      where: { bookId_chapterNumber: { bookId: psalmBook.id, chapterNumber: 23 } },
    });
    if (psalm23) {
      const psalmVerses = [
        { verseNumber: 1, textEnglish: 'The Lord is my shepherd; I shall not want.', textArabic: 'الرب راعي فلا يعوزني شيء.' },
        { verseNumber: 2, textEnglish: 'He makes me to lie down in green pastures; He leads me beside the still waters.', textArabic: 'في مراعٍ خضر يربضني. إلى مياه الراحة يوردني.' },
        { verseNumber: 3, textEnglish: 'He restores my soul; He leads me in the paths of righteousness for His name\'s sake.', textArabic: 'يرد نفسي. يهديني إلى سبل البر من أجل اسمه.' },
      ];

      for (const v of psalmVerses) {
        await prisma.verse.upsert({
          where: { chapterId_verseNumber: { chapterId: psalm23.id, verseNumber: v.verseNumber } },
          update: { textEnglish: v.textEnglish, textArabic: v.textArabic },
          create: { chapterId: psalm23.id, ...v },
        });
      }
    }
  }

  // Seed John 1
  const johnBook = await prisma.book.findUnique({ where: { abbreviation: 'Joh' } });
  if (johnBook) {
    const john1 = await prisma.chapter.findUnique({
      where: { bookId_chapterNumber: { bookId: johnBook.id, chapterNumber: 1 } },
    });
    if (john1) {
      const johnVerses = [
        { verseNumber: 1, textEnglish: 'In the beginning was the Word, and the Word was with God, and the Word was God.', textArabic: 'في البدء كان الكلمة، والكلمة كان عند الله، وكان الكلمة الله.' },
        { verseNumber: 2, textEnglish: 'He was in the beginning with God.', textArabic: 'هذا كان في البدء عند الله.' },
        { verseNumber: 3, textEnglish: 'All things were made through Him, and without Him nothing was made that was made.', textArabic: 'كل شيء به كان، وبغيره لم يكن شيء مما كان.' },
      ];

      for (const v of johnVerses) {
        await prisma.verse.upsert({
          where: { chapterId_verseNumber: { chapterId: john1.id, verseNumber: v.verseNumber } },
          update: { textEnglish: v.textEnglish, textArabic: v.textArabic },
          create: { chapterId: john1.id, ...v },
        });
      }
    }
  }

  // ─── Seed Agpeya Hours ────────────────────────────────────────
  const agpeyaHours = [
    { name: 'First Hour', nameArabic: 'صلاة باكر', order: 1 },
    { name: 'Third Hour', nameArabic: 'صلاة الساعة الثالثة', order: 2 },
    { name: 'Sixth Hour', nameArabic: 'صلاة الساعة السادسة', order: 3 },
    { name: 'Ninth Hour', nameArabic: 'صلاة الساعة التاسعة', order: 4 },
    { name: 'Eleventh Hour', nameArabic: 'صلاة الغروب', order: 5 },
    { name: 'Twelfth Hour', nameArabic: 'صلاة النوم', order: 6 },
    { name: 'Midnight Hour', nameArabic: 'صلاة نصف الليل', order: 7 },
  ];

  for (const hourData of agpeyaHours) {
    const hour = await prisma.agpeyaHour.upsert({
      where: { name: hourData.name },
      update: {},
      create: hourData,
    });

    // Seed sample prayers for each hour
    const samplePrayers = [
      {
        title: 'Opening Prayer',
        titleArabic: 'صلاة الافتتاح',
        content: 'In the name of the Father, and the Son, and the Holy Spirit, one God. Amen.\n\nOur Father who art in heaven, hallowed be Thy name. Thy kingdom come. Thy will be done on earth as it is in heaven. Give us this day our daily bread, and forgive us our trespasses as we forgive those who trespass against us. And lead us not into temptation, but deliver us from evil. In Christ Jesus our Lord, for Thine is the kingdom, the power and the glory, forever. Amen.',
        contentArabic: 'بسم الآب والابن والروح القدس، إله واحد. آمين.\n\nأبانا الذي في السماوات، ليتقدس اسمك. ليأت ملكوتك. لتكن مشيئتك كما في السماء كذلك على الأرض. خبزنا الذي للغد أعطنا اليوم. واغفر لنا ذنوبنا كما نغفر نحن أيضاً للمذنبين إلينا. ولا تدخلنا في تجربة لكن نجنا من الشرير. بالمسيح يسوع ربنا. لأن لك الملك والقوة والمجد إلى الأبد. آمين.',
        type: 'prayer',
        order: 1,
      },
      {
        title: 'Psalm of the Hour',
        titleArabic: 'مزمور الساعة',
        content: 'A Psalm of David.\n\nThe Lord is my light and my salvation; whom shall I fear? The Lord is the strength of my life; of whom shall I be afraid?',
        contentArabic: 'مزمور لداود.\n\nالرب نوري وخلاصي ممن أخاف. الرب حصن حياتي ممن أرتعب.',
        type: 'psalm',
        order: 2,
      },
      {
        title: 'Gospel Reading',
        titleArabic: 'قراءة الإنجيل',
        content: 'A reading from the Holy Gospel according to St. John.\n\nIn the beginning was the Word, and the Word was with God, and the Word was God.',
        contentArabic: 'فصل من إنجيل القديس يوحنا.\n\nفي البدء كان الكلمة والكلمة كان عند الله وكان الكلمة الله.',
        type: 'gospel',
        order: 3,
      },
    ];

    for (const prayer of samplePrayers) {
      // Check if prayer already exists for this hour
      const existingPrayer = await prisma.agpeyaPrayer.findFirst({
        where: { hourId: hour.id, order: prayer.order },
      });

      if (!existingPrayer) {
        await prisma.agpeyaPrayer.create({
          data: {
            hourId: hour.id,
            ...prayer,
          },
        });
      }
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
