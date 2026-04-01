export type DiscoverCandidate = {
  id: string;
  name: string;
  age: number;
  city: string;
  lookingFor: string;
  games: string[];
  vibeTags: string[];
  bio: string;
  compatibility: number;
};

export const demoCandidates: DiscoverCandidate[] = [
  {
    id: "1",
    name: "Mira",
    age: 22,
    city: "Sofia",
    lookingFor: "late-night chat, duo games, relationship",
    games: ["Valorant", "Genshin Impact", "Minecraft"],
    vibeTags: ["introvert", "comfort talk", "soft energy"],
    bio: "Usually online at night. I like calm conversations, co-op games, and people who do not force fast communication.",
    compatibility: 92,
  },
  {
    id: "2",
    name: "Kai",
    age: 24,
    city: "Warsaw",
    lookingFor: "duo queue, memes, online connection",
    games: ["League of Legends", "Overwatch 2", "Lethal Company"],
    vibeTags: ["ironic", "night owl", "memes"],
    bio: "I am here for someone with the same online rhythm. I like irony, low-pressure chats, and chaotic co-op sessions.",
    compatibility: 87,
  },
  {
    id: "3",
    name: "Yuna",
    age: 21,
    city: "Prague",
    lookingFor: "friendship, fandom talks, maybe something deeper",
    games: ["Stardew Valley", "The Sims 4", "Honkai: Star Rail"],
    vibeTags: ["fandom", "cozy", "deep talks"],
    bio: "I like long messages, anime, music, and people who can switch from memes to serious talks in one minute.",
    compatibility: 84,
  },
  {
    id: "4",
    name: "Ren",
    age: 23,
    city: "Berlin",
    lookingFor: "voice chat, duo games, comfort connection",
    games: ["Apex Legends", "Phasmophobia", "Minecraft"],
    vibeTags: ["voice first", "low energy", "warm vibe"],
    bio: "I open up slowly, but I value consistency. Mostly here for one real connection instead of random small talk.",
    compatibility: 81,
  },
];