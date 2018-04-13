/**
 * Created by wudong on 18/4/13.
 * 此文件用于存放常用form里的校验方法，把需要校验的代码直接复制到目标文件data下
 * 方法里出现的reg方法，记得引用validate.js的校验
 */

/**
 * 用于校验排序输入框
 */
var validateSort = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入排序数字"))
  } else if (!z1(value)) {
    // 正整数
    callback(new Error("请输入正确的数字"))
  } else {
    callback()
  }
}
