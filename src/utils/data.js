/**
 * wudong 2018.3.15
 * dataSelectProcessing [用于把后台返回的select列表数据处理为elementUI可用的select数据]
 * @param data [原始数据]
 * @param labelKey [原始数据里对应label的key]
 * @param valueKey [原始数据里对应value的key]
 * @return {Array}
 */
export function dataSelectProcessing(data, labelKey, valueKey) {
  let list = []
  data.forEach((item) => {
    let select = {
      label: item[labelKey],
      value: item[valueKey]
    }
    list.push(select)
  })
  list.reverse()
  return list
}
