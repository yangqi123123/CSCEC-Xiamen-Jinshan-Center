(function () {
  window.APP_SYSTEM_TYPES = [
    { id: 1, name: "机电系统", code: "MEP", sort: 1, intro: "建筑机电设备及相关专业系统。", image: "", parent: null },
    { id: 2, name: "暖通空调", code: "MEP-HVAC", sort: 1, intro: "采暖、通风与空气调节系统。", parent: 1 },
    { id: 3, name: "电气系统", code: "MEP-ELEC", sort: 2, intro: "建筑供配电及照明系统。", parent: 1 },
    { id: 4, name: "给排水系统", code: "MEP-WATER", sort: 3, intro: "建筑给水、排水及相关设备。", parent: 1 },
    { id: 5, name: "消防系统", code: "MEP-FIRE", sort: 4, intro: "建筑消防设施与联动系统。", parent: 1 },
    { id: 6, name: "电梯系统", code: "MEP-LIFT", sort: 5, intro: "建筑电梯及运行管理系统。", parent: 1 },
    { id: 7, name: "燃气系统", code: "MEP-GAS", sort: 6, intro: "建筑燃气供应与安全系统。", parent: 1 },
    { id: 8, name: "光伏系统", code: "MEP-PV", sort: 7, intro: "建筑光伏发电系统。", parent: 1 },
    { id: 9, name: "自然通风系统", code: "MEP-NV", sort: 8, intro: "建筑自然通风及排烟系统。", parent: 1 },
    { id: 10, name: "弱电系统", code: "ELV", sort: 2, intro: "建筑弱电及智能化专业系统。", image: "", parent: null },
    { id: 11, name: "会议办公", code: "ELV-MEET", sort: 1, intro: "会议、办公及协同应用系统。", parent: 10 },
    { id: 12, name: "智慧停车", code: "ELV-PARK", sort: 2, intro: "停车场出入口及停车引导系统。", parent: 10 },
    { id: 13, name: "综合安防", code: "ELV-SEC", sort: 3, intro: "视频监控、门禁及报警系统。", parent: 10 },
    { id: 14, name: "信息网络", code: "ELV-NET", sort: 4, intro: "综合布线与信息网络系统。", parent: 10 },
  ];
})();
