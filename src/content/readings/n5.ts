export interface ReadingPassage {
  id: string;
  slug: string;
  title: string;
  level: "absolute-beginner" | "n5" | "n4";
  content: string;
  furigana: string;
  translation: string;
  vocab: { word: string; reading: string; meaning: string }[];
  metaTitle: string;
  metaDescription: string;
}

export const readingPassages: ReadingPassage[] = [
  {
    id: "reading-n5-001",
    slug: "watashi-no-kazoku",
    title: "私の家族 (My Family)",
    level: "n5",
    content: "私の家族は四人です。父と母と妹と私です。父は会社員です。母は医者です。妹は高校生です。私は大学生です。毎日、家族で夕ご飯を食べます。",
    furigana: "私(わたし)の家族(かぞく)は四人(よにん)です。父(ちち)と母(はは)と妹(いもうと)と私(わたし)です。父(ちち)は会社員(かいしゃいん)です。母(はは)は医者(いしゃ)です。妹(いもうと)は高校生(こうこうせい)です。私(わたし)は大学生(だいがくせい)です。毎日(まいにち)、家族(かぞく)で夕ご飯(ゆうごはん)を食(た)べます。",
    translation: "My family has four people. My father, mother, younger sister, and me. My father is a company employee. My mother is a doctor. My sister is a high school student. I am a university student. Every day, my family eats dinner together.",
    vocab: [
      { word: "家族", reading: "かぞく", meaning: "family" },
      { word: "四人", reading: "よにん", meaning: "four people" },
      { word: "父", reading: "ちち", meaning: "father" },
      { word: "母", reading: "はは", meaning: "mother" },
      { word: "妹", reading: "いもうと", meaning: "younger sister" },
      { word: "会社員", reading: "かいしゃいん", meaning: "company employee" },
      { word: "医者", reading: "いしゃ", meaning: "doctor" },
      { word: "高校生", reading: "こうこうせい", meaning: "high school student" },
      { word: "大学生", reading: "だいがくせい", meaning: "university student" },
      { word: "毎日", reading: "まいにち", meaning: "every day" },
      { word: "夕ご飯", reading: "ゆうごはん", meaning: "dinner" },
    ],
    metaTitle: "Reading Practice: 私の家族 (My Family) | JLPT N5",
    metaDescription: "Practice reading Japanese with this JLPT N5 passage about family. Includes furigana, translation, and vocabulary list.",
  },
  {
    id: "reading-n5-002",
    slug: "nichijou-no-seikatsu",
    title: "日常の生活 (Daily Life)",
    level: "n5",
    content: "私は毎朝六時に起きます。朝ご飯を食べて、学校に行きます。学校で日本語を勉強します。友達と話すのが楽しいです。夜は宿題をしてから、テレビを見ます。",
    furigana: "私(わたし)は毎朝(まいあさ)六時(ろくじ)に起(お)きます。朝ご飯(あさごはん)を食(た)べて、学校(がっこう)に行(い)きます。学校(がっこう)で日本語(にほんご)を勉強(べんきょう)します。友達(ともだち)と話(はな)すのが楽(たの)しいです。夜(よる)は宿題(しゅくだい)をしてから、テレビを見(み)ます。",
    translation: "I wake up at 6 every morning. I eat breakfast and go to school. I study Japanese at school. Talking with friends is fun. At night, I do my homework and then watch TV.",
    vocab: [
      { word: "毎朝", reading: "まいあさ", meaning: "every morning" },
      { word: "起きる", reading: "おきる", meaning: "to get up" },
      { word: "朝ご飯", reading: "あさごはん", meaning: "breakfast" },
      { word: "学校", reading: "がっこう", meaning: "school" },
      { word: "日本語", reading: "にほんご", meaning: "Japanese language" },
      { word: "勉強", reading: "べんきょう", meaning: "study" },
      { word: "友達", reading: "ともだち", meaning: "friend" },
      { word: "話す", reading: "はなす", meaning: "to talk" },
      { word: "楽しい", reading: "たのしい", meaning: "fun" },
      { word: "宿題", reading: "しゅくだい", meaning: "homework" },
    ],
    metaTitle: "Reading Practice: 日常の生活 (Daily Life) | JLPT N5",
    metaDescription: "Practice reading Japanese with this JLPT N5 passage about daily life. Includes furigana, translation, and vocabulary list.",
  },
  {
    id: "reading-ab-001",
    slug: "aisatsu",
    title: "挨拶 (Greetings)",
    level: "absolute-beginner",
    content: "おはようございます。こんにちは。こんばんは。さようなら。ありがとうございます。すみません。",
    furigana: "おはようございます。こんにちは。こんばんは。さようなら。ありがとうございます。すみません。",
    translation: "Good morning. Hello. Good evening. Goodbye. Thank you. Excuse me / I'm sorry.",
    vocab: [
      { word: "おはようございます", reading: "おはようございます", meaning: "good morning (polite)" },
      { word: "こんにちは", reading: "こんにちは", meaning: "hello / good afternoon" },
      { word: "こんばんは", reading: "こんばんは", meaning: "good evening" },
      { word: "さようなら", reading: "さようなら", meaning: "goodbye" },
      { word: "ありがとうございます", reading: "ありがとうございます", meaning: "thank you (polite)" },
      { word: "すみません", reading: "すみません", meaning: "excuse me / sorry" },
    ],
    metaTitle: "Reading Practice: 挨拶 (Greetings) | Absolute Beginner",
    metaDescription: "Practice reading basic Japanese greetings. Perfect for absolute beginners learning hiragana and common phrases.",
  },
  {
    id: "reading-n4-001",
    slug: "shuumatsu-no-keikaku",
    title: "週末の計画 (Weekend Plans)",
    level: "n4",
    content: "今週末、友達と一緒に京都に行く予定です。新幹線で行きます。京都では、有名なお寺を見たり、美味しい料理を食べたりしたいです。天気が良ければ、嵐山に行って竹林を散歩するつもりです。",
    furigana: "今週末(こんしゅうまつ)、友達(ともだち)と一緒(いっしょ)に京都(きょうと)に行(い)く予定(よてい)です。新幹線(しんかんせん)で行(い)きます。京都(きょうと)では、有名(ゆうめい)なお寺(てら)を見(み)たり、美味(おい)しい料理(りょうり)を食(た)べたりしたいです。天気(てんき)が良(よ)ければ、嵐山(あらしやま)に行(い)って竹林(ちくりん)を散歩(さんぽ)するつもりです。",
    translation: "This weekend, I'm planning to go to Kyoto with my friend. We'll go by Shinkansen. In Kyoto, I want to see famous temples and eat delicious food. If the weather is good, I plan to go to Arashiyama and take a walk in the bamboo grove.",
    vocab: [
      { word: "今週末", reading: "こんしゅうまつ", meaning: "this weekend" },
      { word: "一緒", reading: "いっしょ", meaning: "together" },
      { word: "予定", reading: "よてい", meaning: "plan" },
      { word: "新幹線", reading: "しんかんせん", meaning: "bullet train" },
      { word: "有名", reading: "ゆうめい", meaning: "famous" },
      { word: "お寺", reading: "おてら", meaning: "temple" },
      { word: "美味しい", reading: "おいしい", meaning: "delicious" },
      { word: "料理", reading: "りょうり", meaning: "cooking / cuisine" },
      { word: "天気", reading: "てんき", meaning: "weather" },
      { word: "嵐山", reading: "あらしやま", meaning: "Arashiyama (place name)" },
      { word: "竹林", reading: "ちくりん", meaning: "bamboo grove" },
      { word: "散歩", reading: "さんぽ", meaning: "walk / stroll" },
    ],
    metaTitle: "Reading Practice: 週末の計画 (Weekend Plans) | JLPT N4",
    metaDescription: "Practice reading Japanese with this JLPT N4 passage about weekend plans in Kyoto. Includes furigana, translation, and vocabulary.",
  },
];
