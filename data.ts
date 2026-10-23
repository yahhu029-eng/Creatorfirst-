import type { Creator, Video } from "@/types";

export const creators: Creator[] = [
  {
    id: "c1",
    name: "Nova Ray",
    handle: "@novaray",
    avatar:
      "https://images.pexels.com/photos/10230832/pexels-photo-10230832.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    banner:
      "https://images.pexels.com/photos/33050959/pexels-photo-33050959.jpeg?auto=compress&cs=tinysrgb&w=940&h=400&fit=crop",
    bio: "Gaming content creator — speedruns, reviews, and late-night rage. Building a community one clip at a time.",
    followers: 124000,
    following: 312,
    totalLikes: 2400000,
    isVerified: true,
    category: "Gaming",
  },
  {
    id: "c2",
    name: "Mia Cooks",
    handle: "@miacooks",
    avatar:
      "https://images.pexels.com/photos/5240251/pexels-photo-5240251.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    banner:
      "https://images.pexels.com/photos/407073/breaking-egg-flour-spices-407073.jpeg?auto=compress&cs=tinysrgb&w=940&h=400&fit=crop",
    bio: "Home-cooked meals with a twist. New recipes every week — simple, bold, and always delicious.",
    followers: 89200,
    following: 150,
    totalLikes: 1800000,
    isVerified: true,
    category: "Food",
  },
  {
    id: "c3",
    name: "Leo Trek",
    handle: "@leotrek",
    avatar:
      "https://images.pexels.com/photos/33680709/pexels-photo-33680709.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    banner:
      "https://images.pexels.com/photos/19273401/pexels-photo-19273401.jpeg?auto=compress&cs=tinysrgb&w=940&h=400&fit=crop",
    bio: "Chasing sunsets and mountain trails. Adventure travel filmmaker sharing the world one hike at a time.",
    followers: 56000,
    following: 89,
    totalLikes: 920000,
    isVerified: false,
    category: "Travel",
  },
  {
    id: "c4",
    name: "DJ Pulse",
    handle: "@djpulse",
    avatar:
      "https://images.pexels.com/photos/33148747/pexels-photo-33148747.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    banner:
      "https://images.pexels.com/photos/11114670/pexels-photo-11114670.jpeg?auto=compress&cs=tinysrgb&w=940&h=400&fit=crop",
    bio: "Producer & DJ. Mixing beats and breaking barriers. New drops every Friday.",
    followers: 210000,
    following: 45,
    totalLikes: 5100000,
    isVerified: true,
    category: "Music",
  },
  {
    id: "c5",
    name: "Flex With Kai",
    handle: "@flexwithkai",
    avatar:
      "https://images.pexels.com/photos/33680674/pexels-photo-33680674.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    banner:
      "https://images.pexels.com/photos/3888405/pexels-photo-3888405.jpeg?auto=compress&cs=tinysrgb&w=940&h=400&fit=crop",
    bio: "Fitness coach helping you build strength and confidence. Form > ego. Let's get to work.",
    followers: 73000,
    following: 201,
    totalLikes: 1600000,
    isVerified: false,
    category: "Fitness",
  },
  // Small / emerging creators
  {
    id: "c6",
    name: "Luna Art",
    handle: "@lunaart",
    avatar:
      "https://images.pexels.com/photos/35725749/pexels-photo-35725749.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    banner:
      "https://images.pexels.com/photos/933255/pexels-photo-933255.jpeg?auto=compress&cs=tinysrgb&w=940&h=400&fit=crop",
    bio: "Self-taught illustrator. Sharing my art journey from sketch to finish. Just getting started!",
    followers: 1840,
    following: 67,
    totalLikes: 24000,
    isVerified: false,
    isSmallCreator: true,
    category: "Art",
  },
  {
    id: "c7",
    name: "Code With Sam",
    handle: "@codewithsam",
    avatar:
      "https://images.pexels.com/photos/24017554/pexels-photo-24017554.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    banner:
      "https://images.pexels.com/photos/7325498/pexels-photo-7325498.jpeg?auto=compress&cs=tinysrgb&w=940&h=400&fit=crop",
    bio: "Indie dev building cool things in public. Tutorials, tips, and honest dev diary entries.",
    followers: 920,
    following: 34,
    totalLikes: 11000,
    isVerified: false,
    isSmallCreator: true,
    category: "Tech",
  },
  {
    id: "c8",
    name: "Maya Beauty",
    handle: "@mayabeauty",
    avatar:
      "https://images.pexels.com/photos/5240241/pexels-photo-5240241.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    banner:
      "https://images.pexels.com/photos/1722868/pexels-photo-1722868.jpeg?auto=compress&cs=tinysrgb&w=940&h=400&fit=crop",
    bio: "Makeup enthusiast sharing everyday looks and bold experiments. Small creator, big dreams.",
    followers: 2600,
    following: 120,
    totalLikes: 38000,
    isVerified: false,
    isSmallCreator: true,
    category: "Beauty",
  },
  {
    id: "c9",
    name: "Street Moves",
    handle: "@streetmoves",
    avatar:
      "https://images.pexels.com/photos/8727669/pexels-photo-8727669.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    banner:
      "https://images.pexels.com/photos/22944672/pexels-photo-22944672.jpeg?auto=compress&cs=tinysrgb&w=940&h=400&fit=crop",
    bio: "Street dance crew from the city. Freestyle battles, choreo, and raw energy. New drops weekly.",
    followers: 4100,
    following: 55,
    totalLikes: 67000,
    isVerified: false,
    isSmallCreator: true,
    category: "Dance",
  },
];

export const videos: Video[] = [
  {
    id: "v1",
    title: "I Beat the Hardest Boss in Under 60 Seconds (World Record Attempt)",
    thumbnail:
      "https://images.pexels.com/photos/9072202/pexels-photo-9072202.jpeg?auto=compress&cs=tinysrgb&w=940&h=560&fit=crop",
    creatorId: "c1",
    views: 340000,
    likes: 28000,
    uploadDate: "2 days ago",
    duration: "12:34",
    description:
      "After 200+ attempts, I finally pulled off the fastest boss kill yet. This run was insane — stick around for the reaction at the end!",
    isShort: false,
    comments: [
      {
        id: "cm1",
        authorName: "SpeedyGonzalez",
        authorAvatar:
          "https://images.pexels.com/photos/2341350/pexels-photo-2341350.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        text: "That ending was unreal! Congrats on the record!",
        timestamp: "1 day ago",
        likes: 340,
      },
      {
        id: "cm2",
        authorName: "PixelKnight",
        authorAvatar:
          "https://images.pexels.com/photos/40268447/pexels-photo-40268447.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        text: "I've been trying this for weeks. Teach me your ways.",
        timestamp: "1 day ago",
        likes: 120,
      },
    ],
  },
  {
    id: "v2",
    title: "15-Minute Pasta That Tastes Like a 5-Star Restaurant",
    thumbnail:
      "https://images.pexels.com/photos/33707461/pexels-photo-33707461.jpeg?auto=compress&cs=tinysrgb&w=940&h=560&fit=crop",
    creatorId: "c2",
    views: 189000,
    likes: 21000,
    uploadDate: "4 days ago",
    duration: "15:02",
    description:
      "You won't believe how easy this is. A restaurant-quality pasta dish you can make in 15 minutes with ingredients you already have.",
    isShort: false,
    comments: [
      {
        id: "cm3",
        authorName: "FoodLover22",
        authorAvatar:
          "https://images.pexels.com/photos/36271952/pexels-photo-36271952.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        text: "Made this tonight and my whole family loved it!",
        timestamp: "3 days ago",
        likes: 580,
      },
    ],
  },
  {
    id: "v3",
    title: "Sunrise at 3000m — The Most Beautiful Hike of My Life",
    thumbnail:
      "https://images.pexels.com/photos/24879596/pexels-photo-24879596.jpeg?auto=compress&cs=tinysrgb&w=940&h=560&fit=crop",
    creatorId: "c3",
    views: 92000,
    likes: 15000,
    uploadDate: "1 week ago",
    duration: "08:47",
    description:
      "Started the hike at 3 AM to catch the sunrise from the summit. Every step was worth it. Full vlog of the trek up!",
    isShort: false,
    comments: [
      {
        id: "cm4",
        authorName: "WanderlustJane",
        authorAvatar:
          "https://images.pexels.com/photos/36271927/pexels-photo-36271927.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        text: "Adding this trail to my bucket list immediately.",
        timestamp: "5 days ago",
        likes: 210,
      },
    ],
  },
  {
    id: "v4",
    title: "New Track Drop — 'Neon Skyline' (Live Studio Session)",
    thumbnail:
      "https://images.pexels.com/photos/2919003/pexels-photo-2919003.jpeg?auto=compress&cs=tinysrgb&w=940&h=560&fit=crop",
    creatorId: "c4",
    views: 520000,
    likes: 64000,
    uploadDate: "3 days ago",
    duration: "05:21",
    description:
      "Brand new single recorded live in the studio. Neon Skyline drops on all platforms this Friday. Full production breakdown included!",
    isShort: false,
    comments: [
      {
        id: "cm5",
        authorName: "BeatDropper",
        authorAvatar:
          "https://images.pexels.com/photos/33136738/pexels-photo-33136738.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        text: "The bass on this is absolutely insane. Can't wait for Friday!",
        timestamp: "2 days ago",
        likes: 890,
      },
    ],
  },
  {
    id: "v5",
    title: "Full Body Strength Workout — No Equipment Needed",
    thumbnail:
      "https://images.pexels.com/photos/6388452/pexels-photo-6388452.jpeg?auto=compress&cs=tinysrgb&w=940&h=560&fit=crop",
    creatorId: "c5",
    views: 140000,
    likes: 18000,
    uploadDate: "5 days ago",
    duration: "22:15",
    description:
      "A complete full-body strength session you can do anywhere. No weights, no gym, just you and 22 minutes. Let's go!",
    isShort: false,
    comments: [
      {
        id: "cm6",
        authorName: "GetFitGina",
        authorAvatar:
          "https://images.pexels.com/photos/32449512/pexels-photo-32449512.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        text: "Did this 3 times this week and I'm already feeling stronger!",
        timestamp: "4 days ago",
        likes: 420,
      },
    ],
  },
  {
    id: "v6",
    title: "My First Digital Painting — From Sketch to Final",
    thumbnail:
      "https://images.pexels.com/photos/933255/pexels-photo-933255.jpeg?auto=compress&cs=tinysrgb&w=940&h=560&fit=crop",
    creatorId: "c6",
    views: 3100,
    likes: 890,
    uploadDate: "6 days ago",
    duration: "10:30",
    description:
      "Walkthrough of my first complete digital painting. I'm still learning but so proud of how this turned out!",
    isShort: false,
    comments: [
      {
        id: "cm7",
        authorName: "ArtFanMia",
        authorAvatar:
          "https://images.pexels.com/photos/40322798/pexels-photo-40322798.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        text: "For a first painting this is incredible! Keep going!",
        timestamp: "5 days ago",
        likes: 45,
      },
    ],
  },
  {
    id: "v7",
    title: "I Built a Full Stack App in 24 Hours (Dev Diary)",
    thumbnail:
      "https://images.pexels.com/photos/5483077/pexels-photo-5483077.jpeg?auto=compress&cs=tinysrgb&w=940&h=560&fit=crop",
    creatorId: "c7",
    views: 1800,
    likes: 420,
    uploadDate: "1 week ago",
    duration: "14:08",
    description:
      "Honest dev diary of building and deploying a full stack app in 24 hours. Bugs, breakthroughs, and everything in between.",
    isShort: false,
    comments: [
      {
        id: "cm8",
        authorName: "DevDan",
        authorAvatar:
          "https://images.pexels.com/photos/2341350/pexels-photo-2341350.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        text: "The bug at 8:32 is exactly what happened to me last week. Great video!",
        timestamp: "6 days ago",
        likes: 30,
      },
    ],
  },
  {
    id: "v8",
    title: "Everyday Glam Makeup Look in Under 5 Minutes",
    thumbnail:
      "https://images.pexels.com/photos/8387380/pexels-photo-8387380.jpeg?auto=compress&cs=tinysrgb&w=940&h=560&fit=crop",
    creatorId: "c8",
    views: 5400,
    likes: 1200,
    uploadDate: "3 days ago",
    duration: "05:12",
    description:
      "Quick and easy glam look for everyday wear. Using affordable products you can find at any drugstore!",
    isShort: false,
    comments: [
      {
        id: "cm9",
        authorName: "GlowGetter",
        authorAvatar:
          "https://images.pexels.com/photos/36271952/pexels-photo-36271952.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        text: "That eyeliner trick is a game changer, thank you!",
        timestamp: "2 days ago",
        likes: 80,
      },
    ],
  },
  // Shorts
  {
    id: "s1",
    title: "The clutch play that won the tournament",
    thumbnail:
      "https://images.pexels.com/photos/9071735/pexels-photo-9071735.jpeg?auto=compress&cs=tinysrgb&w=600&h=1067&fit=crop",
    creatorId: "c1",
    views: 1200000,
    likes: 89000,
    uploadDate: "1 day ago",
    duration: "0:28",
    description: "Last second 1v3 clutch to win it all!",
    isShort: true,
    comments: [
      {
        id: "cm10",
        authorName: "GGMaster",
        authorAvatar:
          "https://images.pexels.com/photos/40268447/pexels-photo-40268447.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        text: "GOAT play. I've watched this 20 times.",
        timestamp: "20 hours ago",
        likes: 1200,
      },
    ],
  },
  {
    id: "s2",
    title: "Flipping this pancake like a pro",
    thumbnail:
      "https://images.pexels.com/photos/39519751/pexels-photo-39519751.jpeg?auto=compress&cs=tinysrgb&w=600&h=1067&fit=crop",
    creatorId: "c2",
    views: 890000,
    likes: 67000,
    uploadDate: "2 days ago",
    duration: "0:15",
    description: "Perfect flip every time.",
    isShort: true,
    comments: [
      {
        id: "cm11",
        authorName: "BreakfastKing",
        authorAvatar:
          "https://images.pexels.com/photos/2341350/pexels-photo-2341350.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        text: "I need this skill in my life.",
        timestamp: "1 day ago",
        likes: 340,
      },
    ],
  },
  {
    id: "s3",
    title: "POV: You reached the summit",
    thumbnail:
      "https://images.pexels.com/photos/25225802/pexels-photo-25225802.jpeg?auto=compress&cs=tinysrgb&w=600&h=1067&fit=crop",
    creatorId: "c3",
    views: 670000,
    likes: 52000,
    uploadDate: "3 days ago",
    duration: "0:22",
    description: "The view made every step worth it.",
    isShort: true,
    comments: [
      {
        id: "cm12",
        authorName: "MountainSoul",
        authorAvatar:
          "https://images.pexels.com/photos/33136738/pexels-photo-33136738.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        text: "Goosebumps. Pure goosebumps.",
        timestamp: "2 days ago",
        likes: 560,
      },
    ],
  },
  {
    id: "s4",
    title: "30-second beat from scratch",
    thumbnail:
      "https://images.pexels.com/photos/7446857/pexels-photo-7446857.jpeg?auto=compress&cs=tinysrgb&w=600&h=1067&fit=crop",
    creatorId: "c4",
    views: 2100000,
    likes: 180000,
    uploadDate: "1 day ago",
    duration: "0:30",
    description: "Made this in 30 seconds. Imagine what I do in 30 minutes.",
    isShort: true,
    comments: [
      {
        id: "cm13",
        authorName: "RhythmRider",
        authorAvatar:
          "https://images.pexels.com/photos/8727669/pexels-photo-8727669.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        text: "Drop this as a single RIGHT NOW.",
        timestamp: "12 hours ago",
        likes: 2100,
      },
    ],
  },
  {
    id: "s5",
    title: "Street dance battle — final round",
    thumbnail:
      "https://images.pexels.com/photos/35782304/pexels-photo-35782304.jpeg?auto=compress&cs=tinysrgb&w=600&h=1067&fit=crop",
    creatorId: "c9",
    views: 8900,
    likes: 2100,
    uploadDate: "2 days ago",
    duration: "0:35",
    description: "We took the whole block. Insane energy!",
    isShort: true,
    comments: [
      {
        id: "cm14",
        authorName: "DanceFan99",
        authorAvatar:
          "https://images.pexels.com/photos/35725749/pexels-photo-35725749.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        text: "You guys deserve way more views! Incredible.",
        timestamp: "1 day ago",
        likes: 120,
      },
    ],
  },
  {
    id: "s6",
    title: "Speed sketch — 60 second portrait",
    thumbnail:
      "https://images.pexels.com/photos/39205316/pexels-photo-39205316.jpeg?auto=compress&cs=tinysrgb&w=600&h=1067&fit=crop",
    creatorId: "c6",
    views: 4200,
    likes: 980,
    uploadDate: "4 days ago",
    duration: "0:60",
    description: "Timed myself drawing a portrait in 60 seconds.",
    isShort: true,
    comments: [
      {
        id: "cm15",
        authorName: "SketchQueen",
        authorAvatar:
          "https://images.pexels.com/photos/40322798/pexels-photo-40322798.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        text: "In 60 seconds?! I can't even draw a circle that fast!",
        timestamp: "3 days ago",
        likes: 55,
      },
    ],
  },
];

export const currentUser: Creator = {
  id: "me",
  name: "You",
  handle: "@you",
  avatar:
    "https://images.pexels.com/photos/32449512/pexels-photo-32449512.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  banner:
    "https://images.pexels.com/photos/7858742/pexels-photo-7858742.jpeg?auto=compress&cs=tinysrgb&w=940&h=400&fit=crop",
  bio: "This is your creator profile. Videos you upload in demo mode will appear here. Your likes and follows are saved on this device.",
  followers: 0,
  following: 0,
  totalLikes: 0,
  isVerified: false,
  category: "Creator",
};

export function getCreatorById(id: string): Creator | undefined {
  if (id === "me") return currentUser;
  return creators.find((c) => c.id === id);
}

export function getVideosByCreator(creatorId: string, userVideos: Video[] = []): Video[] {
  const all = [...userVideos, ...videos];
  return all.filter((v) => v.creatorId === creatorId);
}

export function getVideoById(id: string, userVideos: Video[] = []): Video | undefined {
  const userVid = userVideos.find((v) => v.id === id);
  if (userVid) return userVid;
  return videos.find((v) => v.id === id);
}

export function getShorts(userVideos: Video[] = []): Video[] {
  const all = [...userVideos, ...videos];
  return all.filter((v) => v.isShort);
}

export function getRegularVideos(userVideos: Video[] = []): Video[] {
  const all = [...userVideos, ...videos];
  return all.filter((v) => !v.isShort);
}

export function getSmallCreators(): Creator[] {
  return creators.filter((c) => c.isSmallCreator);
}
