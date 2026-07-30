import { type JLPTLevel, type GrammarPoint } from "../../lib/types";

export const n5Grammar: GrammarPoint[] = [
  {
    id: "n5-grammar-001",
    slug: "desu",
    title: "です (desu) — Polite Copula",
    level: "n5" as JLPTLevel,
    meaning: "The polite copula 'to be' used to end a sentence or clause politely.",
    structure: "Noun / な-adjective stem + です",
    formation:
      "Simply attach です to a noun or な-adjective stem. です conjugates: でした (past), でしょう (volitional/conjecture), ではありません / じゃないです (negative).",
    usage:
      "Used in polite speech to assert that something is something else. The most fundamental sentence-ender in polite Japanese.",
    examples: [
      { japanese: "私は学生です。", reading: "わたしはがくせいです。", english: "I am a student." },
      { japanese: "これは本です。", reading: "これはほんです。", english: "This is a book." },
      { japanese: "昨日はいい天気でした。", reading: "きのうはいい てんきでした。", english: "Yesterday was nice weather." },
    ],
    relatedPoints: ["masu", "wa-particle", "da"],
    metaTitle: "です (desu) — Japanese Polite Copula | JLPT N5 Grammar",
    metaDescription: "Learn how to use です (desu), the Japanese polite copula. JLPT N5 grammar lesson with formation, examples, and related grammar points.",
  },
  {
    id: "n5-grammar-002",
    slug: "da",
    title: "だ (da) — Plain Copula",
    level: "n5" as JLPTLevel,
    meaning: "The plain (casual) copula 'to be', used in informal speech and writing.",
    structure: "Noun / な-adjective stem + だ",
    formation:
      "Attach だ after a noun or な-adjective stem in plain speech. Conjugations: だった (past), だろう (volitional/conjecture), ではない / じゃない (negative).",
    usage:
      "Used in casual conversation between friends, in writing, and before 〜と思う, 〜と言う, and other constructions requiring plain form.",
    examples: [
      { japanese: "これは猫だ。", reading: "これはねこだ。", english: "This is a cat." },
      { japanese: "彼は学生だった。", reading: "かれはがくせいだった。", english: "He was a student." },
      { japanese: "明日は休みだ。", reading: "あしたはやすみだ。", english: "Tomorrow is a day off." },
    ],
    relatedPoints: ["desu", "to-omou", "to-iu"],
    metaTitle: "だ (da) — Japanese Plain Copula | JLPT N5 Grammar",
    metaDescription: "Learn how to use だ (da), the Japanese plain copula. JLPT N5 grammar lesson with formation, examples, and related grammar points.",
  },
  {
    id: "n5-grammar-003",
    slug: "masu",
    title: "ます (masu) — Polite Verb Ending",
    level: "n5" as JLPTLevel,
    meaning: "The polite ending attached to the verb stem to make speech courteous.",
    structure: "Verb (stem) + ます",
    formation:
      "Take the verb stem (remove 〜ます from ます-form) or conjugate from dictionary form. ます conjugates: ました (past), ません (negative), ませんでした (past negative), ましょう (volitional).",
    usage:
      "The standard polite verb ending used in most social interactions, with teachers, strangers, superiors, and in formal writing.",
    examples: [
      { japanese: "毎日学校へ行きます。", reading: "まいにちがっこうへいきます。", english: "I go to school every day." },
      { japanese: "昨日勉強しました。", reading: "きのうべんきょうしました。", english: "I studied yesterday." },
      { japanese: "コーヒーを飲みません。", reading: "コーヒーをのみません。", english: "I do not drink coffee." },
    ],
    relatedPoints: ["te-form", "ta-form", "nai-form", "desu"],
    metaTitle: "ます (masu) — Japanese Polite Verb Ending | JLPT N5 Grammar",
    metaDescription: "Learn how to use ます (masu), the Japanese polite verb ending. JLPT N5 grammar lesson with formation, conjugations, and examples.",
  },
  {
    id: "n5-grammar-004",
    slug: "te-form",
    title: "〜て Form — Te-Form Connections",
    level: "n5" as JLPTLevel,
    meaning:
      "The て-form connects verbs to express sequence, reason, or concurrent actions.",
    structure: "Verb (て-form) + clause",
    formation:
      "Conjugate verbs to て-form: う・つ・る → って, む・ぶ・ぬ → んで, く → いて, ぐ → いで, す → して, する → して, くる → きて. い-adjectives: 〜くて, な-adjectives/nouns: 〜で.",
    usage:
      "Used to link verbs in a sequence (do A and then B), give reasons, or describe concurrent states. Essential for many compound grammar patterns.",
    examples: [
      { japanese: "スーパーへ行って、買い物をします。", reading: "スーパーへいって、かいものをします。", english: "I go to the supermarket and shop." },
      { japanese: "朝起きて、歯を磨きます。", reading: "あさおきて、はをみがきます。", english: "I wake up and brush my teeth." },
      { japanese: "安くておいしいです。", reading: "やすくておいしいです。", english: "It's cheap and delicious." },
    ],
    relatedPoints: ["te-iru", "te-aru", "te-oku", "te-shimau", "te-mo-ii", "te-wa-ikenai", "te-kudasai"],
    metaTitle: "〜て Form — Japanese Te-Form | JLPT N5 Grammar",
    metaDescription: "Learn how to use the Japanese て-form to connect verbs and adjectives. JLPT N5 grammar lesson with formation rules, examples, and related patterns.",
  },
  {
    id: "n5-grammar-005",
    slug: "ta-form",
    title: "〜た Form — Past Tense (Plain)",
    level: "n5" as JLPTLevel,
    meaning: "The plain past tense form of verbs and adjectives.",
    structure: "Verb (た-form) / い-adjective (〜かった) / な-adjective (〜だった) / Noun (〜だった)",
    formation:
      "The た-form is formed identically to て-form but with た instead of て: う・つ・る → った, む・ぶ・ぬ → んだ, く → いた, ぐ → いだ, す → した. い-adjectives drop い and add かった. な-adjectives and nouns add だった.",
    usage:
      "Used in casual speech to express past actions or states. Also forms the base of many grammar patterns like 〜たことがある, 〜たほうがいい, 〜たあとで.",
    examples: [
      { japanese: "映画を見た。", reading: "えいがをみた。", english: "I watched a movie." },
      { japanese: "昨日は寒かった。", reading: "きのうはさむかった。", english: "Yesterday was cold." },
      { japanese: "京都に行ったことがある。", reading: "きょうとにいったことがある。", english: "I have been to Kyoto." },
    ],
    relatedPoints: ["te-form", "ta-koto-ga-aru", "ta-hou-ga-ii", "masu"],
    metaTitle: "〜た Form — Japanese Plain Past Tense | JLPT N5 Grammar",
    metaDescription: "Learn how to use the Japanese た-form for plain past tense. JLPT N5 grammar lesson with formation rules, examples, and related grammar patterns.",
  },
  {
    id: "n5-grammar-006",
    slug: "nai-form",
    title: "〜ない Form — Negative (Plain)",
    level: "n5" as JLPTLevel,
    meaning: "The plain negative form of verbs, equivalent to 'not do'.",
    structure: "Verb (ない-form) / い-adjective (〜くない) / な-adjective (〜ではない / じゃない) / Noun (〜ではない / じゃない)",
    formation:
      "For verbs: change the final う-column kana to the corresponding あ-column kana and add ない (exception: する→しない, くる→こない). い-adjectives: replace い with くない. な-adjectives and nouns: add ではない (or じゃない).",
    usage:
      "Used in casual speech to negate verbs and adjectives. Also forms the base for 〜ないでください, 〜なければならない, and other negative-based patterns.",
    examples: [
      { japanese: "寿司を食べない。", reading: "すしをたべない。", english: "I don't eat sushi." },
      { japanese: "その映画は面白くない。", reading: "そのえいがはおもしろくない。", english: "That movie is not interesting." },
      { japanese: "彼は学生じゃない。", reading: "かれはがくせいじゃない。", english: "He is not a student." },
    ],
    relatedPoints: ["masu", "ta-form", "te-form", "nakereba-naranai", "naide-kudasai"],
    metaTitle: "〜ない Form — Japanese Plain Negative | JLPT N5 Grammar",
    metaDescription: "Learn how to use the Japanese ない-form for plain negation. JLPT N5 grammar lesson with formation, examples, and related grammar patterns.",
  },
  {
    id: "n5-grammar-007",
    slug: "tai",
    title: "〜たい (tai) — Want To",
    level: "n5" as JLPTLevel,
    meaning: "Expresses the desire to do something — 'want to'.",
    structure: "Verb (ます-stem) + たい",
    formation:
      "Remove ます from the ます-form and add たい. Conjugates like an い-adjective: たかった (past), たくない (negative), たくなかった (past negative). The object can take が or を.",
    usage:
      "Used to express what one wants to do. First-person desires are common in statements; for others, use 〜たがっている for observable desire.",
    examples: [
      { japanese: "日本へ行きたいです。", reading: "にほんへいきたいです。", english: "I want to go to Japan." },
      { japanese: "何を食べたいですか。", reading: "なにをたべたいですか。", english: "What do you want to eat?" },
      { japanese: "新しいパソコンが欲しいです。", reading: "あたらしいパソコンがほしいです。", english: "I want a new computer." },
    ],
    relatedPoints: ["masu", "te-form", "koto-ga-dekiru"],
    metaTitle: "〜たい (tai) — Japanese 'Want To' Expression | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜たい (tai) to express wanting to do something. JLPT N5 grammar lesson with formation, examples, and usage notes.",
  },
  {
    id: "n5-grammar-008",
    slug: "koto-ga-dekiru",
    title: "〜ことができる (koto ga dekiru) — Can Do / Ability",
    level: "n5" as JLPTLevel,
    meaning: "Expresses ability or possibility — 'can do something' or 'be able to do'.",
    structure: "Verb (dictionary form) + ことができる",
    formation:
      "Place ことができる after the dictionary form of a verb. できる conjugates: できます (polite), できた (past), できない (negative). ことが is sometimes shortened to のが in speech.",
    usage:
      "Used to describe one's ability to perform an action or that something is possible. For pure ability, 〜られる (potential form) is also common at higher levels.",
    examples: [
      { japanese: "漢字を書くことができます。", reading: "かんじをかくことができます。", english: "I can write kanji." },
      { japanese: "ここでタバコを吸うことはできません。", reading: "ここでタバコをすうことはできません。", english: "You cannot smoke here." },
      { japanese: "日本語を話すことができる。", reading: "にほんごをはなすことができる。", english: "I can speak Japanese." },
    ],
    relatedPoints: ["masu", "te-form", "yasui", "nikui"],
    metaTitle: "〜ことができる (koto ga dekiru) — Japanese Ability Expression | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜ことができる to express ability in Japanese. JLPT N5 grammar lesson with formation, examples, and related grammar.",
  },
  {
    id: "n5-grammar-009",
    slug: "toki",
    title: "〜とき (toki) — When / At the Time",
    level: "n5" as JLPTLevel,
    meaning: "Expresses 'when' or 'at the time that' something happens or happened.",
    structure: "Verb (plain form) + とき / い-adjective + とき / な-adjective + なとき / Noun + のとき",
    formation:
      "Attach とき to the plain form of a verb or adjective. For な-adjectives and nouns, insert な or の respectively before とき. Tense in the とき clause indicates whether the action is before, during, or after the main action.",
    usage:
      "Used to indicate the time or occasion when something takes place. The tense of the とき clause determines temporal relationship: present tense = before/at the same time, past tense = after.",
    examples: [
      { japanese: "日本へ行くとき、お土産を買います。", reading: "にほんへいくとき、おみやげをかいます。", english: "When I go to Japan, I'll buy souvenirs." },
      { japanese: "子供のとき、よく公園で遊びました。", reading: "こどものとき、よくこうえんであそびました。", english: "When I was a child, I often played in the park." },
      { japanese: "疲れたとき、休みます。", reading: "つかれたとき、やすみます。", english: "When I'm tired, I rest." },
    ],
    relatedPoints: ["mae-ato", "nagara", "kara-because", "node"],
    metaTitle: "〜とき (toki) — Japanese 'When' Expression | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜とき (toki) to express 'when' in Japanese. JLPT N5 grammar lesson with formation, examples, and temporal nuances.",
  },
  {
    id: "n5-grammar-010",
    slug: "kara-because",
    title: "〜から (kara) — Because / Since",
    level: "n5" as JLPTLevel,
    meaning: "Expresses a reason or cause — 'because', 'since', 'as'.",
    structure: "Clause (plain/polite) + から + Main clause",
    formation:
      "Attach から to the end of a reason clause. The clause before から can be in plain or polite form. The main clause states the result or consequence. から follows the reason; the main clause can be omitted if obvious.",
    usage:
      "Used to state a reason or justification. More subjective and personal than 〜ので. Often used in explanations, excuses, and when offering reasons to a listener.",
    examples: [
      { japanese: "雨が降ったから、試合は中止です。", reading: "あめがふったから、しあいはちゅうしです。", english: "Because it rained, the match is cancelled." },
      { japanese: "安いから買いました。", reading: "やすいからかいました。", english: "I bought it because it was cheap." },
      { japanese: "時間がないから、急ごう。", reading: "じかんがないから、いそごう。", english: "Because there's no time, let's hurry." },
    ],
    relatedPoints: ["node", "kara-particle", "ga-but"],
    metaTitle: "〜から (kara) — Japanese 'Because' Expression | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜から (kara) to express reasons in Japanese. JLPT N5 grammar lesson with formation, examples, and comparison with 〜ので.",
  },
  {
    id: "n5-grammar-011",
    slug: "node",
    title: "〜ので (node) — Because / Since (Polite Reason)",
    level: "n5" as JLPTLevel,
    meaning: "Expresses a reason or cause politely — 'because', 'since'.",
    structure: "Verb / い-adjective (plain) + ので / な-adjective + なので / Noun + なので",
    formation:
      "Attach ので to the plain form of verbs and adjectives. For な-adjectives and nouns, use なので. ので sounds softer and more objective than から. Polite forms (です/ます + ので) are also common.",
    usage:
      "Used to give a reason in a polite, softer tone than から. Preferred in formal situations, polite requests, apologies, and when the reason is objective or circumstantial.",
    examples: [
      { japanese: "お金がないので、買えません。", reading: "おかねがないので、かえません。", english: "Since I don't have money, I can't buy it." },
      { japanese: "天気がいいので、散歩しましょう。", reading: "てんきがいいので、さんぽしましょう。", english: "Since the weather is nice, let's go for a walk." },
      { japanese: "日本人なので、日本語が上手です。", reading: "にほんじんなので、にほんごがじょうずです。", english: "Since he's Japanese, he's good at Japanese." },
    ],
    relatedPoints: ["kara-because", "kara-particle", "no-da"],
    metaTitle: "〜ので (node) — Japanese Polite Reason Expression | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜ので (node) to express reasons politely in Japanese. JLPT N5 grammar lesson with formation, examples, and comparison with 〜から.",
  },
  {
    id: "n5-grammar-012",
    slug: "ga-but",
    title: "〜が (ga) — But / However",
    level: "n5" as JLPTLevel,
    meaning: "A conjunctive particle meaning 'but', 'however', or 'and' (soft contrast/intro).",
    structure: "Clause + が + Clause",
    formation:
      "Place が between two clauses. The clause before が can end in plain or polite form. が can also be used without a contrasting second clause as a soft lead-in or buffer.",
    usage:
      "Used to connect two contrasting clauses. Also frequently used as a conversational buffer at the end of a sentence to soften requests, introductions, or refusals (trailing off).",
    examples: [
      { japanese: "日本語は難しいですが、面白いです。", reading: "にほんごはむずかしいですが、おもしろいです。", english: "Japanese is difficult, but interesting." },
      { japanese: "行きたいですが、時間がありません。", reading: "いきたいですが、じかんがありません。", english: "I want to go, but I don't have time." },
      { japanese: "すみませんが、駅はどこですか。", reading: "すみませんが、えきはどこですか。", english: "Excuse me, but where is the station?" },
    ],
    relatedPoints: ["kara-because", "node", "wa-particle", "ga-subject"],
    metaTitle: "〜が (ga) — Japanese 'But' Conjunctive Particle | JLPT N5 Grammar",
    metaDescription: "Learn how to use the conjunctive particle 〜が (ga) to express 'but' or 'however' in Japanese. JLPT N5 grammar lesson with formation and examples.",
  },
  {
    id: "n5-grammar-013",
    slug: "te-mo-ii",
    title: "〜てもいい (te mo ii) — May Do / Permission",
    level: "n5" as JLPTLevel,
    meaning: "Expresses permission — 'may do', 'can do', 'it's okay to do'.",
    structure: "Verb (て-form) + もいい",
    formation:
      "Add もいい to the て-form of a verb. も can be omitted in casual speech. For questions, use 〜てもいいですか to ask for permission. The negative is 〜てはいけない or 〜なくてもいい (don't have to).",
    usage:
      "Used to grant or ask for permission. 〜てもいいです is the polite affirmative; 〜ても大丈夫です is another common variant. Answer with はい、いいですよ or いいえ、〜てはいけません.",
    examples: [
      { japanese: "ここで写真を撮ってもいいです。", reading: "ここでしゃしんをとってもいいです。", english: "You may take photos here." },
      { japanese: "トイレに行ってもいいですか。", reading: "トイレにいってもいいですか。", english: "May I go to the bathroom?" },
      { japanese: "これを食べてもいい？", reading: "これをたべてもいい？", english: "Can I eat this?" },
    ],
    relatedPoints: ["te-wa-ikenai", "te-form", "nakereba-naranai", "te-kudasai"],
    metaTitle: "〜てもいい (te mo ii) — Japanese Permission Expression | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜てもいい (te mo ii) to express permission in Japanese. JLPT N5 grammar lesson with formation, examples, and related expressions.",
  },
  {
    id: "n5-grammar-014",
    slug: "te-wa-ikenai",
    title: "〜てはいけない (te wa ikenai) — Must Not / Prohibition",
    level: "n5" as JLPTLevel,
    meaning: "Expresses prohibition — 'must not', 'cannot', 'it is not allowed'.",
    structure: "Verb (て-form) + はいけない",
    formation:
      "Add はいけない to the て-form. In casual speech, ちゃいけない (for 〜て) or じゃいけない (for 〜で) are common contractions. The polite form is 〜てはいけません. A softer prohibition uses 〜ないでください.",
    usage:
      "Used to forbid an action. Often seen in rules, signs, and warnings. 〜てはだめ (casual) is also common. いけない literally means 'won't go' — 'it won't do if you do X'.",
    examples: [
      { japanese: "教室で携帯を使ってはいけません。", reading: "きょうしつでけいたいをつかってはいけません。", english: "You must not use cell phones in the classroom." },
      { japanese: "ここに車を止めてはいけない。", reading: "ここにくるまをとめてはいけない。", english: "You must not park here." },
      { japanese: "宿題を忘れてはいけませんよ。", reading: "しゅくだいをわすれてはいけませんよ。", english: "You must not forget your homework." },
    ],
    relatedPoints: ["te-mo-ii", "te-form", "nakereba-naranai", "naide-kudasai"],
    metaTitle: "〜てはいけない (te wa ikenai) — Japanese Prohibition Expression | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜てはいけない (te wa ikenai) to express prohibition in Japanese. JLPT N5 grammar lesson with formation, examples, and related expressions.",
  },
  {
    id: "n5-grammar-015",
    slug: "nakereba-naranai",
    title: "〜なければならない (nakereba naranai) — Must Do / Obligation",
    level: "n5" as JLPTLevel,
    meaning: "Expresses obligation — 'must do', 'have to do', 'it is necessary to do'.",
    structure: "Verb (ない-form) + なければならない",
    formation:
      "Remove い from the ない-form and add ければならない. For する → しなければならない, くる → こなければならない. The polite form is 〜なければなりません. Casual contractions: なきゃ (いけない/ならない) or なくちゃ.",
    usage:
      "Used to express that something must be done. Common in rules, duties, and strong suggestions. 〜ないと (いけない) is a common casual abbreviation.",
    examples: [
      { japanese: "宿題をしなければなりません。", reading: "しゅくだいをしなければなりません。", english: "I must do my homework." },
      { japanese: "毎日薬を飲まなければならない。", reading: "まいにちくすりをのまなければならない。", english: "I have to take medicine every day." },
      { japanese: "あしたまでにレポートを書かなければなりません。", reading: "あしたまでにレポートをかかなければなりません。", english: "I must write the report by tomorrow." },
    ],
    relatedPoints: ["te-mo-ii", "te-wa-ikenai", "nai-form", "ta-hou-ga-ii"],
    metaTitle: "〜なければならない (nakereba naranai) — Japanese Obligation Expression | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜なければならない (nakereba naranai) to express obligation in Japanese. JLPT N5 grammar lesson with formation, examples, and contractions.",
  },
  {
    id: "n5-grammar-016",
    slug: "ta-koto-ga-aru",
    title: "〜たことがある (ta koto ga aru) — Have Done Before / Experience",
    level: "n5" as JLPTLevel,
    meaning: "Expresses past experience — 'have done something before'.",
    structure: "Verb (た-form) + ことがある",
    formation:
      "Add ことがある after the た-form of a verb. ある can be conjugated: あります (polite), なかった (negative — haven't experienced), ありましたか (polite question). For 'never done', use 〜たことがない.",
    usage:
      "Used to talk about life experiences or whether someone has ever done something. The focus is on the experience itself, not when it happened.",
    examples: [
      { japanese: "富士山に登ったことがあります。", reading: "ふじさんにのぼったことがあります。", english: "I have climbed Mt. Fuji." },
      { japanese: "すき焼きを食べたことがない。", reading: "すきやきをたべたことがない。", english: "I have never eaten sukiyaki." },
      { japanese: "日本に行ったことがありますか。", reading: "にほんにいったことがありますか。", english: "Have you ever been to Japan?" },
    ],
    relatedPoints: ["ta-form", "koto-ga-dekiru", "te-iru"],
    metaTitle: "〜たことがある (ta koto ga aru) — Japanese Experience Expression | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜たことがある (ta koto ga aru) to express past experiences in Japanese. JLPT N5 grammar lesson with formation and examples.",
  },
  {
    id: "n5-grammar-017",
    slug: "to-omou",
    title: "〜と思う (to omou) — Think That",
    level: "n5" as JLPTLevel,
    meaning: "Expresses one's thought or opinion — 'I think that', 'I believe that'.",
    structure: "Clause (plain form) + と思う",
    formation:
      "Quote a clause in plain form and attach と思う. The subject is typically first-person (私は) for statements, and second-person (〜と思う？) for questions. と思っています indicates ongoing or held belief.",
    usage:
      "Used to report one's own thoughts and opinions. The quoted clause must be in plain form regardless of the politeness level. 〜と思います adds politeness.",
    examples: [
      { japanese: "明日は雨が降ると思います。", reading: "あしたはあめがふるとおもいます。", english: "I think it will rain tomorrow." },
      { japanese: "その映画は面白いと思う。", reading: "そのえいがはおもしろいとおもう。", english: "I think that movie is interesting." },
      { japanese: "日本語は難しいと思いますか。", reading: "にほんごはむずかしいとおもいますか。", english: "Do you think Japanese is difficult?" },
    ],
    relatedPoints: ["to-iu", "to-particle", "da"],
    metaTitle: "〜と思う (to omou) — Japanese 'I Think' Expression | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜と思う (to omou) to express thoughts and opinions in Japanese. JLPT N5 grammar lesson with formation, examples, and usage notes.",
  },
  {
    id: "n5-grammar-018",
    slug: "to-iu",
    title: "〜と言う (to iu) — Say That",
    level: "n5" as JLPTLevel,
    meaning: "Quotes what someone says — 'say that', 'call'.",
    structure: "Clause (plain form) + と言う",
    formation:
      "Quote a clause in plain form and attach と言う. For direct quotes, use と with the exact words before it. For indirect quotes, use plain form before と. 言う conjugates: 言います (polite), 言った (past), 言わない (negative).",
    usage:
      "Used to quote speech, thoughts, or names. 〜という means 'called/named' when describing names or terms. 〜と言っていました is used to report what someone else said politely.",
    examples: [
      { japanese: "彼は明日来ると言いました。", reading: "かれはあしたくると いいました。", english: "He said he will come tomorrow." },
      { japanese: "これは「さくら」と言います。", reading: "これは「さくら」といいます。", english: "This is called 'sakura'." },
      { japanese: "先生が宿題を出せと言った。", reading: "せんせいがしゅくだいをだせといった。", english: "The teacher said to submit the homework." },
    ],
    relatedPoints: ["to-omou", "to-particle", "da"],
    metaTitle: "〜と言う (to iu) — Japanese Quotation Expression | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜と言う (to iu) to quote speech and name things in Japanese. JLPT N5 grammar lesson with formation and examples.",
  },
  {
    id: "n5-grammar-019",
    slug: "yasui",
    title: "〜やすい (yasui) — Easy To Do",
    level: "n5" as JLPTLevel,
    meaning: "Expresses that an action is easy to do — 'easy to', 'easy to do'.",
    structure: "Verb (ます-stem) + やすい",
    formation:
      "Remove ます from the ます-form of a verb and attach やすい. Conjugates as an い-adjective: やすくない (negative), やすかった (past). The opposite is 〜にくい (hard to do).",
    usage:
      "Used to describe actions that are physically or mentally easy to perform. Also used to describe the inherent quality of something (e.g., a pen that writes smoothly).",
    examples: [
      { japanese: "この漢字は覚えやすいです。", reading: "このかんじはおぼえやすいです。", english: "This kanji is easy to remember." },
      { japanese: "このペンは書きやすい。", reading: "このペンはかきやすい。", english: "This pen is easy to write with." },
      { japanese: "このアプリは使いやすいですね。", reading: "このアプリはつかいやすいですね。", english: "This app is easy to use, isn't it." },
    ],
    relatedPoints: ["nikui", "sugiru", "masu", "koto-ga-dekiru"],
    metaTitle: "〜やすい (yasui) — Japanese 'Easy To' Expression | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜やすい (yasui) to express that something is easy to do in Japanese. JLPT N5 grammar lesson with formation and examples.",
  },
  {
    id: "n5-grammar-020",
    slug: "nikui",
    title: "〜にくい (nikui) — Hard To Do",
    level: "n5" as JLPTLevel,
    meaning: "Expresses that an action is difficult to do — 'hard to', 'difficult to'.",
    structure: "Verb (ます-stem) + にくい",
    formation:
      "Remove ます from the ます-form of a verb and attach にくい. Conjugates as an い-adjective: にくくない (negative), にくかった (past). The opposite is 〜やすい (easy to do).",
    usage:
      "Used to describe actions that are physically or mentally difficult to perform. Can also describe inherent properties (e.g., a phone that is hard to use).",
    examples: [
      { japanese: "この名前は発音しにくいです。", reading: "このなまえははつおんしにくいです。", english: "This name is hard to pronounce." },
      { japanese: "この靴は歩きにくい。", reading: "このくつはあるきにくい。", english: "These shoes are hard to walk in." },
      { japanese: "外国語を覚えるのは難しいです。", reading: "がいこくごをおぼえるのはむずかしいです。", english: "Learning a foreign language is difficult." },
    ],
    relatedPoints: ["yasui", "sugiru", "masu", "koto-ga-dekiru"],
    metaTitle: "〜にくい (nikui) — Japanese 'Hard To' Expression | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜にくい (nikui) to express that something is hard to do in Japanese. JLPT N5 grammar lesson with formation and examples.",
  },
  {
    id: "n5-grammar-021",
    slug: "sugiru",
    title: "〜すぎる (sugiru) — Too Much / Excessive",
    level: "n5" as JLPTLevel,
    meaning: "Expresses excess — 'too much', 'excessive', 'overdo'.",
    structure: "Verb (ます-stem) + すぎる / い-adjective (stem) + すぎる / な-adjective (stem) + すぎる",
    formation:
      "Remove ます from the ます-form of a verb, or remove い from い-adjectives (or use stem for な-adjectives), and add すぎる. すぎる itself conjugates as a ru-verb: すぎます (polite), すぎた (past), すぎない (negative).",
    usage:
      "Used to indicate that an action or state is excessive. Often carries a negative connotation of 'too much'. Can also be used as a standalone verb 過ぎる (to pass through/go beyond).",
    examples: [
      { japanese: "このスープは熱すぎます。", reading: "このスープはあつすぎます。", english: "This soup is too hot." },
      { japanese: "食べすぎてお腹が痛い。", reading: "たべすぎておなかがいたい。", english: "I ate too much and my stomach hurts." },
      { japanese: "この問題は難しすぎる。", reading: "このもんだいはむずかしすぎる。", english: "This problem is too difficult." },
    ],
    relatedPoints: ["yasui", "nikui", "te-form", "masu"],
    metaTitle: "〜すぎる (sugiru) — Japanese 'Too Much' Expression | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜すぎる (sugiru) to express excess in Japanese. JLPT N5 grammar lesson with formation, examples, and usage notes.",
  },
  {
    id: "n5-grammar-022",
    slug: "ta-hou-ga-ii",
    title: "〜たほうがいい (ta hou ga ii) — Should Do / Recommendation",
    level: "n5" as JLPTLevel,
    meaning: "Expresses a recommendation or advice — 'should do', 'it's better to do'.",
    structure: "Verb (た-form) + ほうがいい / Verb (ない-form) + ないほうがいい",
    formation:
      "Add ほうがいい after the た-form of a verb to recommend doing it. For negative recommendations, use ない-form + ないほうがいい. The set phrase 〜たほうがいいです is polite. More casual: 〜たほうがいいよ.",
    usage:
      "Used to give advice or make suggestions about what someone should do. The た-form here is not past tense — it's part of the set phrase. 〜しないほうがいい is 'should not'.",
    examples: [
      { japanese: "早く寝たほうがいいですよ。", reading: "はやくねたほうがいいですよ。", english: "You should go to sleep early." },
      { japanese: "タバコはやめたほうがいい。", reading: "タバコはやめたほうがいい。", english: "You should quit smoking." },
      { japanese: "無理をしないほうがいいです。", reading: "むりをしないほうがいいです。", english: "You shouldn't overdo it." },
    ],
    relatedPoints: ["ta-form", "nai-form", "nakereba-naranai", "te-mo-ii"],
    metaTitle: "〜たほうがいい (ta hou ga ii) — Japanese Recommendation Expression | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜たほうがいい (ta hou ga ii) to give recommendations in Japanese. JLPT N5 grammar lesson with formation and examples.",
  },
  {
    id: "n5-grammar-023",
    slug: "kamo-shirenai",
    title: "〜かもしれない (kamo shirenai) — Might / Perhaps",
    level: "n5" as JLPTLevel,
    meaning: "Expresses possibility or uncertainty — 'might', 'maybe', 'perhaps'.",
    structure: "Clause (plain form) + かもしれない",
    formation:
      "Add かもしれない after the plain form of a verb, adjective, or noun. For な-adjectives and nouns, the だ is omitted (直接 noun + かもしれない). Polite form: かもしれません. More casual: かも.",
    usage:
      "Used when the speaker is uncertain but thinks something is possible. Less certain than でしょう; more conversational. Often pairs with たぶん (probably).",
    examples: [
      { japanese: "明日は雨が降るかもしれません。", reading: "あしたはあめがふるかもしれません。", english: "It might rain tomorrow." },
      { japanese: "彼はもう帰ったかもしれない。", reading: "かれはもうかえったかもしれない。", english: "He might have already gone home." },
      { japanese: "それ、もしかして高かったんじゃない？", reading: "それ、もしかしてたかかったんじゃない？", english: "That might have been expensive, right?" },
    ],
    relatedPoints: ["to-omou", "darou", "desu"],
    metaTitle: "〜かもしれない (kamo shirenai) — Japanese Possibility Expression | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜かもしれない (kamo shirenai) to express possibility in Japanese. JLPT N5 grammar lesson with formation and examples.",
  },
  {
    id: "n5-grammar-024",
    slug: "kureru-ageru-morau",
    title: "〜くれる・あげる・もらう — Giving and Receiving",
    level: "n5" as JLPTLevel,
    meaning:
      "Verbs of giving and receiving: あげる (give out), くれる (give in), もらう (receive).",
    structure: "Person は/が Person に Object を あげる/くれる/もらう",
    formation:
      "あげる: the giver gives to someone (outward). くれる: someone gives to the speaker or in-group (inward). もらう: the receiver receives from someone. 〜てあげる/くれる/もらう extends these to favours (do for / receive the favour of).",
    usage:
      "Choosing the correct verb depends on the direction of giving relative to the speaker. あげる for giving away from speaker, くれる for giving toward speaker, もらう for receiving. Critical for social relationships.",
    examples: [
      { japanese: "友達にプレゼントをあげました。", reading: "ともだちにプレゼントをあげました。", english: "I gave a present to my friend." },
      { japanese: "母が本をくれました。", reading: "ははがほんをくれました。", english: "My mother gave me a book." },
      { japanese: "先生に辞書をもらいました。", reading: "せんせいにじしょをもらいました。", english: "I received a dictionary from my teacher." },
    ],
    relatedPoints: ["te-form", "te-kureru", "te-ageru", "te-morau"],
    metaTitle: "〜くれる・あげる・もらう — Japanese Giving & Receiving | JLPT N5 Grammar",
    metaDescription: "Learn how to use くれる, あげる, and もらう for giving and receiving in Japanese. JLPT N5 grammar lesson with formation and examples.",
  },
  {
    id: "n5-grammar-025",
    slug: "te-iru",
    title: "〜ている (te iru) — Ongoing / Continuous State",
    level: "n5" as JLPTLevel,
    meaning:
      "Expresses an ongoing action (progressive) or a resultant state — 'is doing', 'is in a state'.",
    structure: "Verb (て-form) + いる",
    formation:
      "Add いる to the て-form. Conjugates as a ru-verb. Polite: 〜ています. Past: 〜ていた. Negative: 〜ていない. For some verbs (e.g., 知る, 結婚する), 〜ている describes a resultant state rather than progressive action.",
    usage:
      "One of the most common Japanese constructions. For action verbs, it indicates an action in progress. For change-of-state verbs, it indicates a state resulting from a change. Also used for habitual actions.",
    examples: [
      { japanese: "今、本を読んでいます。", reading: "いま、ほんをよんでいます。", english: "I am reading a book now." },
      { japanese: "彼は結婚しています。", reading: "かれはけっこんしています。", english: "He is married." },
      { japanese: "東京に住んでいます。", reading: "とうきょうにすんでいます。", english: "I live in Tokyo." },
    ],
    relatedPoints: ["te-aru", "te-oku", "te-shimau", "te-form"],
    metaTitle: "〜ている (te iru) — Japanese Progressive / State Expression | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜ている (te iru) for ongoing actions and resultant states in Japanese. JLPT N5 grammar lesson with formation and examples.",
  },
  {
    id: "n5-grammar-026",
    slug: "te-aru",
    title: "〜てある (te aru) — Resultant State (Prepared/Planned)",
    level: "n5" as JLPTLevel,
    meaning: "Expresses a resultant state resulting from a purposeful action — 'is done', 'has been done'.",
    structure: "Verb (て-form) + ある",
    formation:
      "Add ある to the て-form of a transitive verb. The object is usually marked with が (not を). Polite: 〜てあります. Past: 〜てあった. The focus is on the finished state, not the actor.",
    usage:
      "Distinct from 〜ている: 〜てある implies someone deliberately did the action and the result remains. While 〜ている describes a state as-is, 〜てある emphasizes that it was intentionally prepared.",
    examples: [
      { japanese: "窓が開けてあります。", reading: "まどがあけてあります。", english: "The window is open (someone opened it)." },
      { japanese: "部屋はもう掃除してあります。", reading: "へやはもうそうじしてあります。", english: "The room is already cleaned." },
      { japanese: "必要な資料は準備してあります。", reading: "ひつようなしりょうはじゅんびしてあります。", english: "The necessary materials have been prepared." },
    ],
    relatedPoints: ["te-iru", "te-oku", "te-shimau", "te-form"],
    metaTitle: "〜てある (te aru) — Japanese Resultant State Expression | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜てある (te aru) to express prepared resultant states in Japanese. JLPT N5 grammar lesson with formation and examples.",
  },
  {
    id: "n5-grammar-027",
    slug: "te-oku",
    title: "〜ておく (te oku) — Do in Advance / Preparation",
    level: "n5" as JLPTLevel,
    meaning: "Expresses doing something in advance for future benefit — 'do beforehand', 'do in preparation'.",
    structure: "Verb (て-form) + おく",
    formation:
      "Add おく to the て-form. Polite: 〜ておきます. Past: 〜ておいた. Casual contraction: 〜とく (e.g., しとく, 読んどく). Often used when preparing for guests, future needs, or anticipated events.",
    usage:
      "Used when an action is performed as preparation for a future event or purpose. Can also mean 'leave something as-is' (do something and leave it in that state).",
    examples: [
      { japanese: "お客さんが来るから、部屋を掃除しておきます。", reading: "おきゃくさんがくるから、へやをそうじしておきます。", english: "I'll clean the room in advance because guests are coming." },
      { japanese: "明日の試験のために勉強しておく。", reading: "あしたのしけんのためにべんきょうしておく。", english: "I'll study in advance for tomorrow's exam." },
      { japanese: "冷蔵庫に入れておいてください。", reading: "れいぞうこにいれておいてください。", english: "Please put it in the refrigerator (for later)." },
    ],
    relatedPoints: ["te-iru", "te-aru", "te-shimau", "te-form"],
    metaTitle: "〜ておく (te oku) — Japanese Preparation Expression | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜ておく (te oku) to express doing something in advance in Japanese. JLPT N5 grammar lesson with formation and examples.",
  },
  {
    id: "n5-grammar-028",
    slug: "te-shimau",
    title: "〜てしまう (te shimau) — Completion / Regret",
    level: "n5" as JLPTLevel,
    meaning:
      "Expresses that an action is completed (often with regret or finality) — 'end up doing', 'finish completely'.",
    structure: "Verb (て-form) + しまう",
    formation:
      "Add しまう to the て-form. Polite: 〜てしまいます. Past: 〜てしまった. Casual contraction: 〜ちゃう (e.g., 食べちゃう, 読んじゃう). The contracted forms are very common in everyday speech.",
    usage:
      "Has two main uses: (1) expressing that something is done completely or thoroughly, and (2) expressing regret, embarrassment, or disappointment about an action or outcome. The nuance depends on context.",
    examples: [
      { japanese: "宿題を全部やってしまいました。", reading: "しゅくだいをぜんぶやってしまいました。", english: "I finished all my homework." },
      { japanese: "うっかり財布を忘れてしまった。", reading: "うっかりさいふをわすれてしまった。", english: "I accidentally forgot my wallet." },
      { japanese: "ケーキを全部食べちゃった。", reading: "ケーキをぜんぶたべちゃった。", english: "I ended up eating all the cake." },
    ],
    relatedPoints: ["te-form", "te-iru", "te-aru", "te-oku"],
    metaTitle: "〜てしまう (te shimau) — Japanese Completion / Regret Expression | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜てしまう (te shimau) for completed actions and regret in Japanese. JLPT N5 grammar lesson with formation, contractions, and examples.",
  },
  {
    id: "n5-grammar-029",
    slug: "e-iku-kuru",
    title: "〜へ行く・来る (e iku / kuru) — Go To / Come To",
    level: "n5" as JLPTLevel,
    meaning: "Expresses movement toward a destination — 'go to', 'come to'.",
    structure: "Place / Direction + へ + 行く / 来る / 帰る",
    formation:
      "Use the particle へ (pronounced 'e') after a place or direction noun, followed by a movement verb: 行く (go), 来る (come), 帰る (return). へ indicates the general direction or destination. に can replace へ for specific destinations.",
    usage:
      "One of the most fundamental motion expressions. へ emphasizes direction ('toward'), while に emphasizes the specific destination. For actions with a purpose, use 〜に行く/来る (e.g., 映画を見に行く).",
    examples: [
      { japanese: "学校へ行きます。", reading: "がっこうへいきます。", english: "I go to school." },
      { japanese: "日本へ来ました。", reading: "にほんへきました。", english: "I came to Japan." },
      { japanese: "図書館へ本を返しに行く。", reading: "としょかんへほんをかえしにいく。", english: "I'm going to the library to return a book." },
    ],
    relatedPoints: ["ni-particle", "e-iku-kuru", "o-particle", "de-particle"],
    metaTitle: "〜へ行く・来る (e iku/kuru) — Japanese Movement Expression | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜へ行く・来る (e iku/kuru) for movement in Japanese. JLPT N5 grammar lesson with particles, formation, and examples.",
  },
  {
    id: "n5-grammar-030",
    slug: "de-particle",
    title: "〜で (de) — Location of Action / Means",
    level: "n5" as JLPTLevel,
    meaning:
      "Particle indicating the location of an action or the means/instrument used.",
    structure: "Place + で + Verb / Tool/Method + で + Verb",
    formation:
      "Place で after a place noun to mark where an action occurs, or after a tool/method/language to mark the means by which something is done. Do not confuse with に (point of existence) which uses いる/ある.",
    usage:
      "で has three primary uses: (1) location of action (vs に for existence), (2) means/ instrument (by train, with a pen, in Japanese), (3) material composition (made of wood).",
    examples: [
      { japanese: "図書館で勉強します。", reading: "としょかんでべんきょうします。", english: "I study at the library." },
      { japanese: "電車で学校へ行きます。", reading: "でんしゃでがっこうへいきます。", english: "I go to school by train." },
      { japanese: "日本語で手紙を書きました。", reading: "にほんごでてがみをかきました。", english: "I wrote a letter in Japanese." },
    ],
    relatedPoints: ["ni-particle", "o-particle", "wa-particle", "ga-subject"],
    metaTitle: "〜で (de) — Japanese Particle for Action Location & Means | JLPT N5 Grammar",
    metaDescription: "Learn how to use the Japanese particle で (de) for location of action and means. JLPT N5 grammar lesson with formation, examples, and particle contrasts.",
  },
  {
    id: "n5-grammar-031",
    slug: "ni-particle",
    title: "〜に (ni) — Time / Destination / Purpose",
    level: "n5" as JLPTLevel,
    meaning:
      "Multi-purpose particle indicating time, destination, indirect object, or purpose.",
    structure: "Time + に / Place + に + いる/ある / Person + に + Object + をあげる/もらう",
    formation:
      "に attaches after: (1) specific clock times/days — but not relative time like 昨日 or 今朝; (2) destination after 行く/来る/帰る; (3) indirect object with giving/receiving verbs; (4) purpose when paired with a movement verb (〜に + movement verb).",
    usage:
      "A core particle with many roles. Key distinctions: に for existence/static location, で for dynamic action location. に for specific time points, no particle for relative time. に for purpose in 〜に行く patterns.",
    examples: [
      { japanese: "七時に起きます。", reading: "しちじにおきます。", english: "I wake up at 7 o'clock." },
      { japanese: "東京に行きたいです。", reading: "とうきょうにいきたいです。", english: "I want to go to Tokyo." },
      { japanese: "映画を見に行きます。", reading: "えいがをみにいきます。", english: "I'm going to watch a movie." },
    ],
    relatedPoints: ["de-particle", "o-particle", "wa-particle", "ga-subject", "e-iku-kuru"],
    metaTitle: "〜に (ni) — Japanese Particle for Time, Destination & Purpose | JLPT N5 Grammar",
    metaDescription: "Learn how to use the Japanese particle に (ni) for time, destination, and purpose. JLPT N5 grammar lesson with formation, examples, and particle contrasts.",
  },
  {
    id: "n5-grammar-032",
    slug: "o-particle",
    title: "〜を (o) — Direct Object Particle",
    level: "n5" as JLPTLevel,
    meaning: "Particle marking the direct object of a transitive verb.",
    structure: "Noun + を + Transitive Verb",
    formation:
      "Place を after the noun that is the direct object. を marks what the verb acts upon. It is always followed by a transitive verb (a verb that takes an object). を is also used with certain movement verbs (e.g., 公園を散歩する — to walk 'through' the park).",
    usage:
      "The standard object marker in Japanese. Essential for constructing sentences with transitive verbs like 食べる, 読む, 見る, etc. With motion verbs, を indicates the space 'through which' movement occurs.",
    examples: [
      { japanese: "ご飯を食べます。", reading: "ごはんをたべます。", english: "I eat a meal." },
      { japanese: "テレビを見ます。", reading: "テレビをみます。", english: "I watch television." },
      { japanese: "毎朝公園を散歩します。", reading: "まいあさこうえんをさんぽします。", english: "I walk through the park every morning." },
    ],
    relatedPoints: ["ni-particle", "de-particle", "wa-particle", "ga-subject"],
    metaTitle: "〜を (o) — Japanese Direct Object Particle | JLPT N5 Grammar",
    metaDescription: "Learn how to use the Japanese particle を (o) to mark direct objects. JLPT N5 grammar lesson with formation, examples, and movement verb usage.",
  },
  {
    id: "n5-grammar-033",
    slug: "wa-particle",
    title: "は (wa) — Topic Particle",
    level: "n5" as JLPTLevel,
    meaning:
      "Particle that marks the topic of a sentence — 'as for', 'speaking of'.",
    structure: "Noun + は + [Comment about the noun]",
    formation:
      "Place は (pronounced 'wa') after a noun or phrase to mark it as the topic. The rest of the sentence provides information about the topic. Can replace が, を, but combines with other particles (には, では, とは).",
    usage:
      "Fundamental to Japanese sentence structure. は introduces the topic, while が marks the subject. は can indicate contrast when used multiple times or when contrasted with an implicit alternative. は sets the frame of reference for the sentence.",
    examples: [
      { japanese: "私は田中です。", reading: "わたしはたなかです。", english: "I am Tanaka." },
      { japanese: "今日はいい天気ですね。", reading: "きょうはいいてんきですね。", english: "It's nice weather today, isn't it." },
      { japanese: "日本語は難しいですが、面白いです。", reading: "にほんごはむずかしいですが、おもしろいです。", english: "Japanese is difficult but interesting." },
    ],
    relatedPoints: ["ga-subject", "mo", "o-particle", "ni-particle", "de-particle"],
    metaTitle: "は (wa) — Japanese Topic Particle | JLPT N5 Grammar",
    metaDescription: "Learn how to use the Japanese particle は (wa) to mark topics. JLPT N5 grammar lesson with formation, examples, and contrastive usage.",
  },
  {
    id: "n5-grammar-034",
    slug: "ga-subject",
    title: "が (ga) — Subject Particle",
    level: "n5" as JLPTLevel,
    meaning: "Particle that marks the grammatical subject of a sentence.",
    structure: "Noun + が + Predicate",
    formation:
      "Place が after the subject noun. Used when the subject is new information or when it is the focus of the sentence. が also marks the object of potential/ability expressions (〜ができる, 〜が見える) and states of being (〜が欲しい, 〜が好き).",
    usage:
      "Distinct from は (topic): が marks the subject and emphasizes new information. が answers 'who/what' questions. は sets the topic and provides context. が is required with 好き, 欲しい, できる, and in subordinate clauses.",
    examples: [
      { japanese: "猫がいます。", reading: "ねこがいます。", english: "There is a cat." },
      { japanese: "誰が来ましたか。", reading: "だれがきましたか。", english: "Who came?" },
      { japanese: "私は寿司が好きです。", reading: "わたしはすしがすきです。", english: "I like sushi." },
    ],
    relatedPoints: ["wa-particle", "mo", "o-particle", "ni-particle"],
    metaTitle: "が (ga) — Japanese Subject Particle | JLPT N5 Grammar",
    metaDescription: "Learn how to use the Japanese particle が (ga) to mark subjects. JLPT N5 grammar lesson with formation, examples, and comparison with は.",
  },
  {
    id: "n5-grammar-035",
    slug: "mo",
    title: "も (mo) — Also / Too",
    level: "n5" as JLPTLevel,
    meaning: "Particle meaning 'also', 'too', 'as well', or 'even'.",
    structure: "Noun + も + Predicate",
    formation:
      "Replace は, が, を with も to indicate that the same predicate applies to another item. For particles に, で, へ, と, から, まで, も follows the particle (にも, でも, へも, とも, からも, までも).",
    usage:
      "Used to add items that share the same predicate. も in negative sentences means 'either' or 'neither'. When used in contrasting pairs (AもBも), it means 'both' or 'neither' depending on the verb polarity.",
    examples: [
      { japanese: "私も行きます。", reading: "わたしもいきます。", english: "I will also go." },
      { japanese: "猫も犬も好きです。", reading: "ねこもいぬもすきです。", english: "I like both cats and dogs." },
      { japanese: "田中さんも来ましたか。", reading: "たなかさんもきましたか。", english: "Did Tanaka come too?" },
    ],
    relatedPoints: ["wa-particle", "ga-subject", "o-particle"],
    metaTitle: "も (mo) — Japanese 'Also' Particle | JLPT N5 Grammar",
    metaDescription: "Learn how to use the Japanese particle も (mo) for 'also', 'too', and 'both'. JLPT N5 grammar lesson with formation, examples, and usage patterns.",
  },
  {
    id: "n5-grammar-036",
    slug: "to-particle",
    title: "〜と (to) — Quotation / Conditional 'When'",
    level: "n5" as JLPTLevel,
    meaning: "Particle for quotations and the 'when/then' conditional.",
    structure:
      "Quote + と + 言う/思う/聞く (quotation) / Clause (plain, non-past) + と + Result clause (conditional)",
    formation:
      "As a quotation particle, と follows a direct or indirect quote before 言う, 思う, 聞く, etc. As a conditional, と connects two clauses where the first naturally leads to the second — when A happens, B naturally follows (natural consequence).",
    usage:
      "Two distinct uses: (1) quoting speech and thoughts (see 〜と思う, 〜と言う), (2) conditional 'when' for natural or inevitable results. The conditional と cannot be used for volitional, hypothetical, or request-based conditionals.",
    examples: [
      { japanese: "春になると、花が咲きます。", reading: "はるになると、はながさきます。", english: "When spring comes, flowers bloom." },
      { japanese: "ここを押すと、ドアが開きます。", reading: "ここをおすと、ドアがあきます。", english: "When you push here, the door opens." },
      { japanese: "右に曲がると、駅があります。", reading: "みぎにまがると、えきがあります。", english: "When you turn right, there's the station." },
    ],
    relatedPoints: ["to-omou", "to-iu", "toki", "nagara"],
    metaTitle: "〜と (to) — Japanese Quotation & Conditional Particle | JLPT N5 Grammar",
    metaDescription: "Learn how to use the Japanese particle と (to) for quotations and the 'when' conditional. JLPT N5 grammar lesson with formation and examples.",
  },
  {
    id: "n5-grammar-037",
    slug: "nagara",
    title: "〜ながら (nagara) — While Doing",
    level: "n5" as JLPTLevel,
    meaning: "Expresses two simultaneous actions by the same subject — 'while doing'.",
    structure: "Verb (ます-stem) + ながら + Main verb",
    formation:
      "Remove ます from the ます-form of a verb and add ながら. The action in ながら is secondary/background, and the main action is in the main clause. The subject must be the same for both actions.",
    usage:
      "Used to describe doing two things at the same time. The ながら action is the subordinate action happening simultaneously with the main verb. Cannot be used with state verbs or to describe two separate subjects.",
    examples: [
      { japanese: "音楽を聞きながら勉強します。", reading: "おんがくをききながらべんきょうします。", english: "I study while listening to music." },
      { japanese: "テレビを見ながらご飯を食べます。", reading: "テレビをみながらごはんをたべます。", english: "I eat while watching TV." },
      { japanese: "歩きながら電話をしています。", reading: "あるきながらでんわをしています。", english: "I'm talking on the phone while walking." },
    ],
    relatedPoints: ["toki", "masu", "te-form"],
    metaTitle: "〜ながら (nagara) — Japanese 'While Doing' Expression | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜ながら (nagara) to express simultaneous actions in Japanese. JLPT N5 grammar lesson with formation and examples.",
  },
  {
    id: "n5-grammar-038",
    slug: "mae-ato",
    title: "〜前 / 〜後 (mae / ato) — Before / After",
    level: "n5" as JLPTLevel,
    meaning: "Expresses temporal sequence — 'before doing' / 'after doing'.",
    structure:
      "Verb (dictionary form) + 前に / Verb (た-form) + 後(で) / Noun + の前に / Noun + の後で",
    formation:
      "For 'before': attach 前に to the dictionary form of a verb (present tense only, regardless of actual timing). For 'after': attach 後で or 後に to the た-form of a verb. Nouns take の前に and の後で. 後で implies the result, 後に emphasizes sequence.",
    usage:
      "Used to clearly sequence two actions. 前に always takes the non-past form. 後で is more common in casual speech than 後に. あと can also be used as an adverb (あとで — later).",
    examples: [
      { japanese: "食べる前に手を洗います。", reading: "たべるまえにてをあらいます。", english: "I wash my hands before eating." },
      { japanese: "仕事の後で飲みに行きます。", reading: "しごとのあとでのみにいきます。", english: "I'll go for a drink after work." },
      { japanese: "日本に来た後で日本語を勉強し始めた。", reading: "にほんにきたあとでにほんごをべんきょうしはじめた。", english: "I started studying Japanese after coming to Japan." },
    ],
    relatedPoints: ["toki", "te-form", "ta-form", "mae-ato"],
    metaTitle: "〜前 / 〜後 (mae / ato) — Japanese Before & After | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜前 (mae) and 〜後 (ato) to express 'before' and 'after' in Japanese. JLPT N5 grammar lesson with formation and examples.",
  },
  {
    id: "n5-grammar-039",
    slug: "naide-kudasai",
    title: "〜ないでください (naide kudasai) — Please Don't",
    level: "n5" as JLPTLevel,
    meaning: "A polite request not to do something — 'please don't'.",
    structure: "Verb (ない-form) + でください",
    formation:
      "Attach でください to the ない-form of a verb (remove the final い). For する → しないでください, くる → こないでください. 〜ないで is sometimes used alone as a casual 'please don't' or 'no need'.",
    usage:
      "The negative counterpart of 〜てください. Used to politely ask someone not to do something. More polite than 〜てはいけません which is a prohibition.",
    examples: [
      { japanese: "ここでタバコを吸わないでください。", reading: "ここでタバコをすわないでください。", english: "Please don't smoke here." },
      { japanese: "写真を撮らないでください。", reading: "しゃしんをとらないでください。", english: "Please don't take photos." },
      { japanese: "遅れないでください。", reading: "おくれないでください。", english: "Please don't be late." },
    ],
    relatedPoints: ["te-wa-ikenai", "nai-form", "te-kudasai", "nakereba-naranai"],
    metaTitle: "〜ないでください (naide kudasai) — Japanese 'Please Don't' | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜ないでください (naide kudasai) to politely ask someone not to do something. JLPT N5 grammar lesson with formation and examples.",
  },
  {
    id: "n5-grammar-040",
    slug: "te-kudasai",
    title: "〜てください (te kudasai) — Please Do",
    level: "n5" as JLPTLevel,
    meaning: "A polite request expression — 'please do'.",
    structure: "Verb (て-form) + ください",
    formation:
      "Add ください to the て-form of a verb. ください is the imperative form of くださる (honorific 'give'), so the structure is literally 'please give me the favour of doing X'. More formal than imperative forms, less formal than 〜ていただけませんか.",
    usage:
      "The standard way to make polite requests in Japanese. Used in everyday situations, stores, classrooms, and workplaces. For negative requests, use 〜ないでください.",
    examples: [
      { japanese: "名前を書いてください。", reading: "なまえをかいてください。", english: "Please write your name." },
      { japanese: "ここに座ってください。", reading: "ここにすわってください。", english: "Please sit here." },
      { japanese: "すみません、もう一度言ってください。", reading: "すみません、もういちどいってください。", english: "Excuse me, please say it again." },
    ],
    relatedPoints: ["naide-kudasai", "te-form", "te-mo-ii", "te-wa-ikenai"],
    metaTitle: "〜てください (te kudasai) — Japanese 'Please Do' Request | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜てください (te kudasai) to make polite requests in Japanese. JLPT N5 grammar lesson with formation and examples.",
  },
  {
    id: "n5-grammar-041",
    slug: "no-da",
    title: "〜のだ / 〜んだ (no da / n da) — Explanatory Tone",
    level: "n5" as JLPTLevel,
    meaning:
      "Adds explanatory or emphatic nuance — 'it is that', 'the fact is that'.",
    structure: "Clause (plain form) + のだ / のです / んだ / んです",
    formation:
      "Attach のだ (or polite のです) to the plain form of a clause. For な-adjectives and nouns, insert な before のだ (e.g., 学生なのだ). Casual speech shortens to んだ / んです. Past: 〜んだった / 〜たんだ.",
    usage:
      "Used to provide an explanation, justification, or to soften statements. 〜のですか seeks an explanation ('is it that...?'). 〜んだ is extremely common in casual conversation for explanatory or emphatic tone.",
    examples: [
      { japanese: "風邪をひいたんです。", reading: "かぜをひいたんです。", english: "I caught a cold (that's why...)." },
      { japanese: "どうしたんですか。", reading: "どうしたんですか。", english: "What happened? (seeking explanation)" },
      { japanese: "本当は行きたくなかったんだ。", reading: "ほんとうはいきたくなかったんだ。", english: "The truth is, I didn't want to go." },
    ],
    relatedPoints: ["node", "kara-because", "da", "desu"],
    metaTitle: "〜のだ / 〜んだ (no da / n da) — Japanese Explanatory Expression | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜のだ (no da) and 〜んだ (n da) for explanatory and emphatic expressions in Japanese. JLPT N5 grammar lesson with formation and examples.",
  },
  {
    id: "n5-grammar-042",
    slug: "kara-particle",
    title: "〜から (kara) — From / Since (Starting Point)",
    level: "n5" as JLPTLevel,
    meaning: "Particle marking a starting point in time or space — 'from', 'since'.",
    structure: "Time / Place / Person + から",
    formation:
      "Place から after a noun indicating the starting point temporally or spatially. Paired with まで (until) to express ranges. For giving, use から with あげる/もらう to indicate the giver. から can also follow the て-form (てから — after doing).",
    usage:
      "Distinct from から (because). This から marks the origin or beginning point. Commonly paired with まで for 'from X to Y'. Also used in giving/receiving to mark the giver.",
    examples: [
      { japanese: "東京から大阪まで新幹線で行きます。", reading: "とうきょうからおおさかまでしんかんせんでいきます。", english: "I go from Tokyo to Osaka by Shinkansen." },
      { japanese: "会議は九時からです。", reading: "かいぎはくじからです。", english: "The meeting is from 9 o'clock." },
      { japanese: "友達からプレゼントをもらいました。", reading: "ともだちからプレゼントをもらいました。", english: "I received a present from my friend." },
    ],
    relatedPoints: ["kara-because", "ni-particle", "made"],
    metaTitle: "〜から (kara) — Japanese 'From' Particle | JLPT N5 Grammar",
    metaDescription: "Learn how to use the Japanese particle から (kara) for starting points in time and space. JLPT N5 grammar lesson with formation and examples.",
  },
  {
    id: "n5-grammar-043",
    slug: "made",
    title: "〜まで (made) — Until / Up To",
    level: "n5" as JLPTLevel,
    meaning: "Particle expressing a limit or endpoint — 'until', 'up to', 'as far as'.",
    structure: "Time / Place / Quantity + まで",
    formation:
      "Place まで after a noun marking the endpoint. Often paired with から (from) for 'from X to Y'. までに (by/until) sets a deadline. でも (even) contrasts with まで.",
    usage:
      "Indicates a temporal or spatial limit. まで has two variants: まで (continuous — 'until') and までに (by a deadline). まで alone indicates that the action continues to the endpoint.",
    examples: [
      { japanese: "図書館は五時までです。", reading: "としょかんはごじまでです。", english: "The library is open until 5 o'clock." },
      { japanese: "駅まで歩いて十分です。", reading: "えきまであるいてじゅっぷんです。", english: "It's a 10-minute walk to the station." },
      { japanese: "明日までにレポートを出してください。", reading: "あしたまでにレポートをだしてください。", english: "Please submit the report by tomorrow." },
    ],
    relatedPoints: ["kara-particle", "ni-particle", "made-ni"],
    metaTitle: "〜まで (made) — Japanese 'Until' Particle | JLPT N5 Grammar",
    metaDescription: "Learn how to use the Japanese particle まで (made) for limits and endpoints. JLPT N5 grammar lesson with formation and examples.",
  },
  {
    id: "n5-grammar-044",
    slug: "te-kureru-ageru-morau",
    title: "〜てくれる / 〜てあげる / 〜てもらう — Doing Favours",
    level: "n5" as JLPTLevel,
    meaning: "Expresses actions done as favours — 'do for me', 'do for you', 'receive the favour of'.",
    structure:
      "Verb (て-form) + くれる / Verb (て-form) + あげる / Verb (て-form) + もらう",
    formation:
      "Combine the て-form of an action verb with くれる, あげる, or もらう. 〜てくれる: someone does a favour for the speaker/in-group (inward). 〜てあげる: speaker does a favour for someone else (outward). 〜てもらう: speaker receives the favour of someone doing something.",
    usage:
      "Critical for polite social interaction. Choose the verb based on the direction of the favour relative to the speaker. 〜てくださる (honorific of くれる) and 〜ていただく (humble of もらう) are formal alternatives.",
    examples: [
      { japanese: "友達が駅まで送ってくれました。", reading: "ともだちがえきまでおくってくれました。", english: "My friend saw me off to the station (for me)." },
      { japanese: "荷物を持ってあげましょうか。", reading: "にもつをもってあげましょうか。", english: "Shall I carry your luggage (for you)?" },
      { japanese: "先生に漢字を教えてもらいました。", reading: "せんせいにかんじをおしえてもらいました。", english: "I had my teacher teach me kanji." },
    ],
    relatedPoints: ["kureru-ageru-morau", "te-form", "te-kudasai"],
    metaTitle: "〜てくれる・あげる・もらう — Japanese Favour Expressions | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜てくれる, 〜てあげる, and 〜てもらう for favour expressions in Japanese. JLPT N5 grammar lesson with formation and examples.",
  },
  {
    id: "n5-grammar-045",
    slug: "hoshii",
    title: "〜が欲しい (ga hoshii) — Want Something",
    level: "n5" as JLPTLevel,
    meaning: "Expresses desire for an object — 'want', 'would like'.",
    structure: "Noun + が欲しい",
    formation:
      "Mark the desired item with が (or を in some dialects) and attach 欲しい. Conjugates as an い-adjective: 欲しくない (negative), 欲しかった (past). To express desire for another person, use 〜たがっている.",
    usage:
      "Used to express wanting to possess or obtain a physical item. For wanting to perform an action, use 〜たい. 欲しい expresses the speaker's desire; for others' desires, use 〜欲しがっている.",
    examples: [
      { japanese: "新しいスマートフォンが欲しいです。", reading: "あたらしいスマートフォンがほしいです。", english: "I want a new smartphone." },
      { japanese: "子供が犬を欲しがっています。", reading: "こどもがいぬをほしがっています。", english: "My child wants a dog." },
      { japanese: "何が一番欲しいですか。", reading: "なにがいちばんほしいですか。", english: "What do you want most?" },
    ],
    relatedPoints: ["tai", "kureru-ageru-morau"],
    metaTitle: "〜が欲しい (ga hoshii) — Japanese 'Want Something' Expression | JLPT N5 Grammar",
    metaDescription: "Learn how to use 〜が欲しい (ga hoshii) to express desire for objects in Japanese. JLPT N5 grammar lesson with formation and examples.",
  },
];

export const grammarMap: Record<string, GrammarPoint> = Object.fromEntries(
  n5Grammar.map((point) => [point.slug, point]),
);

export const grammarSlugs: string[] = n5Grammar.map((point) => point.slug);
