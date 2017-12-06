/* 类型 通过key 显示 value */
export function filterType(type, list) {
  const typeMap = list;
  return typeMap[type];
}

export function filterTypeName(type, list) {
  let label = '';
  list.forEach(item => {
    if (item.value === type) {
      label = item.label
    }
  })
  return label;
}