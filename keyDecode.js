window.keyDecode = (function() {

  // Abbreviations:
  // FF - Firefox
  // IE - Internet Explorer
  // C - Chrome
  // O - Opera
  // ON - Opera >= 9.50
  // OO - Opera < 9.50

  var operaOld = false;
  if (window.opera) {
    var operaVersion = window.navigator.userAgent.match(/Version\/(.+)$/)[1];
    var operaMajor = Number(operaVersion.match(/^\d+/));
    var operaMinor = Number(operaVersion.match(/\d+$/));
    if (operaMajor < 9 || (operaMajor === 9 && operaMinor < 50)) {
      operaOld = true;
    }
  }

  var browser = navigator.userAgent.match('Chrome') ? 'Chrome' :
                window.opera && operaOld ? 'Opera Old' :
                window.opera ? 'Opera New' :
                navigator.userAgent.match('Firefox') ? 'Firefox' :
                'IE';

  // key codes that are the same across browsers
  // not including 0-9, a-z, and f1-f12
  var globalMap = {
    32:'space',
    13:'enter',
    9:'tab',
    27:'escape',
    8:'backspace',
    16:'shift',
    17:'control',
    18:'alt',
    20:'caps lock',
    144:'num lock',
    37:'left',
    38:'up',
    39:'right',
    40:'down',
    45:'insert',
    46:'delete',
    36:'home',
    35:'end',
    33:'page up',
    34:'page down',
    19:'pause', // really global?
    145:'scroll lock' // really global?
  };

  // what do you get when you press a key holding shift
  var shiftMap = {
    '1':'!',
    '2':'@',
    '3':'#',
    '4':'$',
    '5':'%',
    '6':'^',
    '7':'&',
    '8':'*',
    '9':'(',
    '0':')',
    '[':'{',
    ']':'}',
    '\\':'|',
    ';':':',
    '\'':'"',
    ',':'<',
    '.':'>',
    '/':'?',
    '-':'_',
    '=':'+',
    '`':'~'
  };

  // opera numpad support caveats
  //  * opera treats numpad numbers as symbols as their normal counterpart
  //  * opera will treat numpad - as insert

  // TODO these need to be fixed
  // sends command as control (keycode 17)
  // sends - as insert (keycode 45)
  // sends . as delete (keycode 46)
  // sends ' as right arrow (keycode 39)

  // some old opera codes are also used by odd linux browsers
  var OO_Map = {
    78:'numpad .', // 78 not used elsewhere
    96:'`', // this is numpad 0 in other browsers
    42:'*', // can be sent by numpad or by shift-8 in rare cases
    47:'/', // can be sent by numpad or normally. ? support is tricky because of this
    219:'left start',
    220:'right start',
    59:';',
    44:',',
    91:'[', // this is left start elsewhere
    92:'\\', // this is right start elsewhere
    93:']' // this is menu elsewhere
  };

  var O_Map = {
    57392:'control' // mac-only control key. is this used by old opera?
  };

  var C_IE_Map = {
    186:';',
    187:'=',
    189:'-'
  };

  var ON_C_FF_Map = {
    224:'command'
  };

  var C_FF_O_Map = {
    59:';',
    61:'='
  };

  var ON_C_FF_IE_Map = {
    110:'numpad .', // 110 not used elsewhere, not same as .
    96:'numpad 0',
    97:'numpad 1',
    98:'numpad 2',
    99:'numpad 3',
    100:'numpad 4',
    101:'numpad 5',
    102:'numpad 6',
    103:'numpad 7',
    104:'numpad 8',
    105:'numpad 9',
    107:'+',
    109:'-',
    106:'*',
    111:'/',
    91:'left start',
    92:'right start',
    93:'menu',
    188:',',
    190:'.',
    191:'/',
    192:'`',
    219:'[', // opera uses 219 as left start
    220:'\\', // opera uses 220 as right start
    221:']',
    222:'\''
  };

  // give string representing key(s) pressed by given event
  return function(e) {
    var code = e.keyCode;

    if (code === 0) {
      return 'unrecognizeable';
    }

    var shift = e.shiftKey;
    var result;

    // cross browser map
    if (globalMap[code]) {
      return globalMap[code];
    }

    // a-z
    if (code >= 65 && code <= 90) {
      result = String.fromCharCode(code);
      if (!shift) {
        result = result.toLowerCase();
      }
      return result;
    }

    // 0-9
    if (code >= 48 && code <= 57) {
      result = String(code - 48);
    }

    // f1-f12
    else if (code >= 112 && code <= 123) {
      result = 'f' + (code - 111);
    }

    else if (browser === 'Opera Old' && OO_Map[code]) {
      result = OO_Map[code];
    }

    else if (browser.match(/Opera/) && O_Map[code]) {
      result = O_Map[code];
    }

    else if ((browser === 'Chrome' || browser === 'IE') && C_IE_Map[code]) {
      result = C_IE_Map[code];
    }

    else if ((browser === 'Opera New' || browser === 'Chrome' || browser === 'Firefox') && ON_C_FF_Map[code]) {
      result = ON_C_FF_Map[code];
    }

    else if ((browser === 'Opera New' || browser === 'Chrome' ||
              browser === 'Firefox' || browser === 'IE') && ON_C_FF_IE_Map[code]) {
      result = ON_C_FF_IE_Map[code];
    }

    else if ((browser === 'Chrome' || browser === 'Firefox' || browser.match(/Opera/)) && C_FF_O_Map[code]) {
      result = C_FF_O_Map[code];
    }

    if (shift) {
      result = shiftMap[result] || result;
    }

    return result || 'unknown code ' + code;

  };
})();
