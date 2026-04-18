export type DiscoverCandidate = {
  id: string;
  name: string;
  age: number;
  city: string;
  pronouns?: string;
  lookingFor: string;
  games: string[];
  vibeTags: string[];
  bio: string;
  compatibility: number;
  likedYou: boolean;
  online?: "online" | "night" | "offline";
  prompt?: {
    question: string;
    answer: string;
  };
};

export const demoCandidates: DiscoverCandidate[] = [
  {
    id: "1",
    name: "Mira",
    age: 22,
    city: "Sofia",
    pronouns: "she/her",
    lookingFor: "late-night chat, duo games, maybe something deeper",
    games: ["Valorant", "Genshin Impact", "Minecraft"],
    vibeTags: ["introvert", "comfort talk", "soft energy", "night owl"],
    bio: "Usually online at night. I like calm conversations, co-op games, and people who do not force fast communication.",
    compatibility: 92,
    likedYou: true,
    online: "night",
    prompt: {
      question: "Идеальный вечер",
      answer: "Закрыть шторы, дискорд, одна фракция на двоих и тихий плейлист.",
    },
  },
  {
    id: "2",
    name: "Kai",
    age: 24,
    city: "Warsaw",
    pronouns: "he/him",
    lookingFor: "duo queue, memes, online connection",
    games: ["League of Legends", "Overwatch 2", "Lethal Company"],
    vibeTags: ["ironic", "night owl", "memes"],
    bio: "Здесь ради такого же онлайн-ритма. Люблю иронию, чаты без давления и хаотичные ко-оп сессии.",
    compatibility: 87,
    likedYou: false,
    online: "online",
    prompt: {
      question: "Что точно не я",
      answer: "Голосовое на 2 минуты в 3 утра без предупреждения.",
    },
  },
  {
    id: "3",
    name: "Yuna",
    age: 21,
    city: "Prague",
    pronouns: "she/they",
    lookingFor: "friendship, fandom talks, maybe something deeper",
    games: ["Stardew Valley", "The Sims 4", "Honkai: Star Rail"],
    vibeTags: ["fandom", "cozy", "deep talks"],
    bio: "Люблю длинные сообщения, аниме, музыку и людей, которые за минуту переключаются с мемов на серьёзный разговор.",
    compatibility: 84,
    likedYou: true,
    online: "online",
    prompt: {
      question: "Я ищу",
      answer: "Человека, с которым можно молчать в дискорде и при этом быть рядом.",
    },
  },
  {
    id: "4",
    name: "Ren",
    age: 23,
    city: "Berlin",
    pronouns: "he/him",
    lookingFor: "voice chat, duo games, comfort connection",
    games: ["Apex Legends", "Phasmophobia", "Minecraft"],
    vibeTags: ["voice first", "low energy", "warm vibe"],
    bio: "Открываюсь медленно, но ценю постоянство. Здесь ради одного настоящего контакта, а не для small talk.",
    compatibility: 81,
    likedYou: false,
    online: "offline",
    prompt: {
      question: "Что сразу ок",
      answer: "Писать поздно вечером, исчезать на пару часов, возвращаться как ни в чём не бывало.",
    },
  },
  {
    id: "5",
    name: "Nova",
    age: 25,
    city: "Lisbon",
    pronouns: "they/them",
    lookingFor: "co-op partners, long talks, slow romance",
    games: ["Baldur's Gate 3", "Stardew Valley", "Hollow Knight"],
    vibeTags: ["deep talks", "cozy", "soft energy"],
    bio: "Делаю инди-саундтреки по ночам, сплю днём. Ищу кого-то, с кем можно медленно строить свой маленький мир.",
    compatibility: 79,
    likedYou: true,
    online: "night",
    prompt: {
      question: "Мой топ",
      answer: "Дождь за окном, BG3, долгий голосовой с тем, кому доверяешь.",
    },
  },
  {
    id: "6",
    name: "Ilya",
    age: 26,
    city: "Tbilisi",
    pronouns: "he/him",
    lookingFor: "duo в рейтинге и спокойные вечера",
    games: ["CS2", "Dota 2", "Hades"],
    vibeTags: ["chill", "memes", "night owl"],
    bio: "Выгораю от созвонов, но отлично дружу в тексте. Хочу найти кого-то, с кем можно просто существовать в одной комнате.",
    compatibility: 76,
    likedYou: false,
    online: "offline",
  },
];
