var utf8 = (utf8 => {
  utf8.toBytes = str => {
    const bytes = [];

    for (var i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);

      if (c < 0x80) {
        bytes.push(c);
      }
      else if (c < 0x0800) {
        bytes.push(0xC0 | c >> 6, 0x80 | c & 0x3F);
      }
      else if (c < 0xD800 || c >= 0xE000) {
        bytes.push(0xE0 | c >> 12, 0x80 | c >> 6 & 0x3F, 0x80 | c & 0x3F);
      }
      else {
        /* surrogate pair */
        i++;
        const c = 0x10000 + ((c & 0x03FF) << 10 | str.charCodeAt(i) & 0x03FF);

        bytes.push(0xF0 | c >> 18, 0x80 | c >> 12 & 0x3F, 0x80 | c >> 6 & 0x3F, 0x80 | c & 0x3f);
      }
    }
    return bytes;
  };
  utf8.toString = bytes => {
    var str = "";
    var i = 0;
    while (i < bytes.length) {
      const a = bytes[i++];

      if (a < 0x80) {
        str += String.fromCharCode(a);
      }
      else if (a >= 0xC0 && a < 0xE0) {
        const b = bytes[i++];
        str += String.fromCharCode((a & 31) << 6 | b & 0x3F);
      }
      else {
        const b = bytes[i++];
        const c = bytes[i++];
        str += String.fromCharCode((a & 0x0F) << 12 | (b & 0x3F) << 6 | c & 0x3F);
      }
    }

    return str;
  };

  return utf8;
})(utf8 || {});
