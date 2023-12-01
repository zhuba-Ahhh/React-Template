/**
 *
 * @param len 长度
 * @param pre 前缀
 * @returns uuid
 */
export const uuid = (len: number = 6, pre: string = 'u_'): string => {
  const seed = 'abcdefhijkmnprstwxyz0123456789',
    maxPos = seed.length;
  let rtn = '';
  for (let i = 0; i < len; i++) {
    rtn += seed.charAt(Math.floor(Math.random() * maxPos));
  }
  return pre + rtn;
};
