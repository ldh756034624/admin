export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
   return null;
 }
 const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
 let date;
 if (typeof time == 'object') {
   date = time;
 } else {
   if (('' + time).length === 10) time = parseInt(time) * 1000;
   date = new Date(time);
 }
 const formatObj = {
   y: date.getFullYear(),
   m: date.getMonth() + 1,
   d: date.getDate(),
   h: date.getHours(),
   i: date.getMinutes(),
   s: date.getSeconds(),
   a: date.getDay()
 };
 const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
   let value = formatObj[key];
   if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
   if (result.length > 0 && value < 10) {
     value = '0' + value;
   }
   return value || 0;
 });
 return time_str;
}

export function formatTime(time, option) {
 time = +time * 1000;
 const d = new Date(time);
 const now = Date.now();

 const diff = (now - d) / 1000;

 if (diff < 30) {
   return '刚刚'
 } else if (diff < 3600) { // less 1 hour
   return Math.ceil(diff / 60) + '分钟前'
 } else if (diff < 3600 * 24) {
   return Math.ceil(diff / 3600) + '小时前'
 } else if (diff < 3600 * 24 * 2) {
   return '1天前'
 }
 if (option) {
   return parseTime(time, option)
 } else {
   return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
 }
}


/**
 * [formatData description]
 * @param  {[type]} object [需要遍历object里面的所属id然后添加pledge_name]
 * @param  {[type]} list   [list里面id中对应的name]
 * @return {[type]}        [description]
 */
export function formatData(object, list) {  // 遍历list，查找对应的company_id或者pledge_id的名称
  object.forEach(item => {
    list.forEach(item2 => {
      if (item2.id === (item.company_id || item.pledge_id)) {
        item.pledge_name = item2.name
      }
    })
  })
  return object;
}

export function formatObj(lists) {
  const arr = []
  for (const item in lists) {
    const obj = {};
    obj.value = parseInt(item);
    obj.label = lists[item]
    arr.push(obj)
  }
  return arr;
}


Array.prototype.remove = function(val) {
  let index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};


