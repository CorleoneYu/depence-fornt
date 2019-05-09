import request from './request';

export function getDeps(filepath) {
  return request({
    url: `api/deps/getDeps`,
    data: {}
  });
}