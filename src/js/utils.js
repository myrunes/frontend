/** @format */

const CHAMP_SHORTS = {
  mf: 'miss-fortune',
  ww: 'warwick',
  lb: 'leblanc',
  tf: 'twisted-fate',
  gp: 'gankplank',
  peach: 'kaisa',
};

function champNameFilter(champ, inpt) {
  inpt = inpt
    .toLowerCase()
    .replace(' ', '')
    .replace("'", '')
    .replace('.', '');

  return CHAMP_SHORTS[inpt] === champ || champ.includes(inpt);
}

function champObjectFilter(champ, inpt) {
  const name = champ.name.toLowerCase();
  const nameStripped = champ.uid.replace('-', ' ');
  const nameConcat = champ.uid.replace('-', '');

  inpt = inpt.toLowerCase();

  return (
    name.includes(inpt) ||
    nameStripped.includes(inpt) ||
    nameConcat.includes(inpt) ||
    CHAMP_SHORTS[inpt] === champ.uid
  );
}

function parseTime(date) {
  function btf(inp) {
    if (inp < 10) return '0' + inp;
    return inp;
  }
  var date = date ? date : new Date();
  var y = date.getFullYear(),
    m = btf(date.getMonth() + 1),
    d = btf(date.getDate()),
    h = btf(date.getHours()),
    min = btf(date.getMinutes()),
    s = btf(date.getSeconds());
  return { y, m, d, h, min, s };
}

function getCookies() {
  var c = {};
  document.cookie
    .split(';')
    .map((v) => v.trim().split('='))
    .forEach((v) => (c[v[0]] = v[1]));
  return c;
}

function getCookieValue(name) {
  return getCookies()[name];
}

function setWindowListener(event, cb) {
  if (typeof event === 'object') {
    event.forEach((e) => {
      setWindowListener(e, cb);
    });
  } else {
    window.addEventListener(event, cb);
  }
}

function removeWindowListener(event, cb) {
  if (typeof event === 'object') {
    event.forEach((e) => {
      removeWindowListener(e, cb);
    });
  } else {
    window.removeEventListener(event, cb);
  }
}

function copyToClipboard(text) {
  return new Promise((resolve, reject) => {
    var id = 'hidden-clipboard-area';
    var existsTextarea = document.getElementById(id);
    if (!existsTextarea) {
      var textarea = document.createElement('textarea');
      textarea.id = id;
      document.querySelector('body').appendChild(textarea);
      existsTextarea = document.getElementById(id);
    }
    existsTextarea.value = text;
    existsTextarea.select();
    var status = document.execCommand('copy');
    if (!status) {
      reject('Could not copy shortlink to clipboard.');
    } else {
      resolve();
    }
  });
}

function getEnv() {
  return process.env;
}

function capString(str, len) {
  return str.length > len ? str.substring(0, len - 3) + '...' : str;
}

// ----------------------------------

export default {
  champObjectFilter,
  champNameFilter,
  parseTime,
  getCookies,
  getCookieValue,
  setWindowListener,
  removeWindowListener,
  copyToClipboard,
  getEnv,
  capString,
};
