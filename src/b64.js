var b64 = (b64 => {
  "use strict";

  b64.padding = '=';
  b64.chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  b64.nums = [
    -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1,
    -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1,
    -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,62, -1,-1,-1,63,
    52,53,54,55, 56,57,58,59, 60,61,-1,-1, -1, 0,-1,-1,
    -1, 0, 1, 2,  3, 4, 5, 6,  7, 8, 9,10, 11,12,13,14,
    15,16,17,18, 19,20,21,22, 23,24,25,-1, -1,-1,-1,-1,
    -1,26,27,28, 29,30,31,32, 33,34,35,36, 37,38,39,40,
    41,42,43,44, 45,46,47,48, 49,50,51,-1, -1,-1,-1,-1
  ];

  b64.encode = (str, padding = b64.padding, chars = b64.chars, nums = b64.nums) => {
    var data = "";
    var bytes = utf8.toBytes(str);

    for (var i = 0; i < (bytes.length - 2); i += 3) {
      data += chars[bytes[i] >> 2];
      data += chars[((bytes[i] & 0x03) << 4) + (bytes[i + 1] >> 4)];
      data += chars[((bytes[i + 1] & 0x0F) << 2) + (bytes[i + 2] >> 6)];
      data += chars[bytes[i + 2] & 0x3F];
    }

    if (bytes.length % 3) {
      i = bytes.length - (bytes.length % 3);
      data += chars[bytes[i] >> 2];
      if ((bytes.length % 3) == 2) {
        data += chars[((bytes[i] & 0x03) << 4) + (bytes[i + 1] >> 4)];
        data += chars[(bytes[i + 1] & 0x0F) << 2];
        data += padding;
      }
      else {
        data += chars[(bytes[i] & 0x03) << 4];
        data += padding + padding;
      }
    }

    return data;
  };
  b64.decode = (data, padding = b64.padding, chars = b64.chars, nums = b64.nums) => {
    var bytes = [];
    var remSize = 0;
    var remData = 0;

    for (var i = 0; i < data.length; i++) {
      const c = data.charCodeAt(i);
      const v = nums[c & 0x7F];

      if (v == -1) {
        console.warn(`Illegal character (code: ${c}) in position ${i}`);
      }
      else {
        remData = remData << 6 | v;
        remSize += 6;
        if (remSize > 8) {
          remSize -= 8;
          if (data[i] != padding) bytes.push((remData >> remSize) & 0xFF);
          remData &= (1 << remSize) - 1;
        }
      }
    }

    if (remSize) throw new Error("Corrupted base64 string");

    return utf8.toString(bytes);
  };

  return b64;
})(b64 || {});
