/*
 * @Author: 18059301505 275895816@qq.com
 * @Date: 2023-03-29 08:28:52
 * @LastEditors: 18059301505 275895816@qq.com
 * @LastEditTime: 2023-04-10 16:07:06
 * @FilePath: \quickstart-demo\src\api\user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/util/request';
/**
 * 调用后端接口增加用户
 * @param {*} userDTO
 */

export function add(userDTO) {
  return request({
    url: '/user',
    method: 'post',
    data: userDTO
  });
}

/**
 * 调用后端接口更新用户
 * @param {*} userDTO
 */
export function update(userDTO) {
  return request({
    url: '/user',
    method: 'put',
    data: userDTO
  });
}

/**
 * 调用后端接口根据id取得用户
 * @param {*} id
 */
export function findById(id) {
  return request({
    url: '/user/' + id,
    method: 'get'
  });
}

/**
 *  查询用户信息
 * @param {*} userQuery
 */
export function search(userQuery) {
  return request({
    url: '/user',
    method: 'get',
    params: userQuery
  });
}

/**
 *  查询用户信息
 * @param id 当前行的id
 * @param version  当前版本
 */
export function remove(id, version) {
  return request({
    url: '/optimism/user',
    method: 'delete',
    params: { id: id, version: version }
  });
}

/**
 *  查询用户信息
 * @param id 当前行的id
 * @param version  当前版本
 */
export function batchRemove(idVersions) {
  return request({
    url: '/batch/user',
    method: 'delete',
    data: idVersions
  });
}
