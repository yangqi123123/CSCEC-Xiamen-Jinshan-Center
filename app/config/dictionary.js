(function () {
  const defaults = {
    projectUsage: [
      { label: "办公建筑", value: "office" },
      { label: "园区", value: "park" }
    ],
    projectStatus: [
      { label: "未开工", value: "not-started" },
      { label: "在建", value: "building" },
      { label: "停工", value: "suspended" },
      { label: "竣备", value: "completed" },
      { label: "其他", value: "other" }
    ]
  };

  const stored = JSON.parse(localStorage.getItem("app-project-dictionary") || "null");
  window.APP_DICTIONARY = {
    ...defaults,
    ...(stored || {})
  };
})();
