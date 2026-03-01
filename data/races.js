const raceData = [
  {
    id: "race_001",
    name: "广州莫六公超级越野赛",
    date: "2026年 3月 29号",
    location: "广东省广州市天河区\n莫六公自然保护区",
    hasItra: true,
    coverImg: "/images/race_cover.jpg", // 顶部的方形小图
    // 首页的公里数小标签
    tags: [
      { dist: "12km", color: "#FF2222" },
      { dist: "21km", color: "#FFFB22" },
      { dist: "32km", color: "#22FF3C" },
      { dist: "48km", color: "#22B9FF" }
    ],
    // 详情页的具体组别数据
    groups: [
      { dist: "12km", themeColor: "#FF2222", startTime: "08:00", actualDist: "13.5 KM", elevation: "850 米", cutoffTime: "4 小时", detailMapImg: "/images/map_12km.jpg" },
      { dist: "21km", themeColor: "#FFFB22", startTime: "07:30", actualDist: "22.1 KM", elevation: "1400 米", cutoffTime: "7 小时", detailMapImg: "/images/map_21km.jpg" },
      { dist: "32km", themeColor: "#22FF3C", startTime: "07:00", actualDist: "34.5 KM", elevation: "2100 米", cutoffTime: "11 小时", detailMapImg: "/images/map_32km.jpg" },
      { dist: "48km", themeColor: "#22B9FF", startTime: "06:00", actualDist: "49.2 KM", elevation: "3200 米", cutoffTime: "15 小时", detailMapImg: "/images/map_48km.jpg" }
    ]
  },
  {
    id: "race_002",
    name: "东莞100超级越野赛",
    date: "2026年 4月 12号",
    location: "广东省东莞市大岭山镇\n大岭山自然公园",
    hasItra: true,
    coverImg: "/images/race_cover_dg.jpg", 
    tags: [
      { dist: "15km", color: "#FF2222" },
      { dist: "32km", color: "#FFFB22" },
      { dist: "42km", color: "#22FF3C" }
    ],
    groups: [
      { dist: "15km", themeColor: "#FF2222", startTime: "09:00", actualDist: "16.2 KM", elevation: "900 米", cutoffTime: "5 小时", detailMapImg: "/images/map_15km.jpg" },
      { dist: "32km", themeColor: "#FFFB22", startTime: "08:00", actualDist: "33.0 KM", elevation: "1800 米", cutoffTime: "10 小时", detailMapImg: "/images/map_32km.jpg" },
      { dist: "42km", themeColor: "#22FF3C", startTime: "07:00", actualDist: "43.5 KM", elevation: "2500 米", cutoffTime: "14 小时", detailMapImg: "/images/map_42km.jpg" }
    ]
  }
];

module.exports = raceData;