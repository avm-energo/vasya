'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var dayjs = require('dayjs');
var vueScrollPicker = require('vue-scroll-picker');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var dayjs__default = /*#__PURE__*/_interopDefaultLegacy(dayjs);

const DEFAULT_MIN_DATE = '1900-01-01 00:00:00';

const MONTH_UNIT = 12;
const HOUR_UNIT = 24;
const MINUTE_UNIT = 60;

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

var customParseFormat = createCommonjsModule(function (module, exports) {
!function(t,e){module.exports=e();}(commonjsGlobal,(function(){var t={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},e=/(\[[^[]*\])|([-:/.()\s]+)|(A|a|YYYY|YY?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g,n=/\d\d/,r=/\d\d?/,i=/\d*[^\s\d-_:/()]+/,o={},s=function(t){return (t=+t)+(t>68?1900:2e3)};var a=function(t){return function(e){this[t]=+e;}},f=[/[+-]\d\d:?(\d\d)?|Z/,function(t){(this.zone||(this.zone={})).offset=function(t){if(!t)return 0;if("Z"===t)return 0;var e=t.match(/([+-]|\d\d)/g),n=60*e[1]+(+e[2]||0);return 0===n?0:"+"===e[0]?-n:n}(t);}],u=function(t){var e=o[t];return e&&(e.indexOf?e:e.s.concat(e.f))},h=function(t,e){var n,r=o.meridiem;if(r){for(var i=1;i<=24;i+=1)if(t.indexOf(r(i,0,e))>-1){n=i>12;break}}else n=t===(e?"pm":"PM");return n},d={A:[i,function(t){this.afternoon=h(t,!1);}],a:[i,function(t){this.afternoon=h(t,!0);}],S:[/\d/,function(t){this.milliseconds=100*+t;}],SS:[n,function(t){this.milliseconds=10*+t;}],SSS:[/\d{3}/,function(t){this.milliseconds=+t;}],s:[r,a("seconds")],ss:[r,a("seconds")],m:[r,a("minutes")],mm:[r,a("minutes")],H:[r,a("hours")],h:[r,a("hours")],HH:[r,a("hours")],hh:[r,a("hours")],D:[r,a("day")],DD:[n,a("day")],Do:[i,function(t){var e=o.ordinal,n=t.match(/\d+/);if(this.day=n[0],e)for(var r=1;r<=31;r+=1)e(r).replace(/\[|\]/g,"")===t&&(this.day=r);}],M:[r,a("month")],MM:[n,a("month")],MMM:[i,function(t){var e=u("months"),n=(u("monthsShort")||e.map((function(t){return t.substr(0,3)}))).indexOf(t)+1;if(n<1)throw new Error;this.month=n%12||n;}],MMMM:[i,function(t){var e=u("months").indexOf(t)+1;if(e<1)throw new Error;this.month=e%12||e;}],Y:[/[+-]?\d+/,a("year")],YY:[n,function(t){this.year=s(t);}],YYYY:[/\d{4}/,a("year")],Z:f,ZZ:f};function c(n){var r,i;r=n,i=o&&o.formats;for(var s=(n=r.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,(function(e,n,r){var o=r&&r.toUpperCase();return n||i[r]||t[r]||i[o].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,(function(t,e,n){return e||n.slice(1)}))}))).match(e),a=s.length,f=0;f<a;f+=1){var u=s[f],h=d[u],c=h&&h[0],l=h&&h[1];s[f]=l?{regex:c,parser:l}:u.replace(/^\[|\]$/g,"");}return function(t){for(var e={},n=0,r=0;n<a;n+=1){var i=s[n];if("string"==typeof i)r+=i.length;else {var o=i.regex,f=i.parser,u=t.substr(r),h=o.exec(u)[0];f.call(e,h),t=t.replace(h,"");}}return function(t){var e=t.afternoon;if(void 0!==e){var n=t.hours;e?n<12&&(t.hours+=12):12===n&&(t.hours=0),delete t.afternoon;}}(e),e}}return function(t,e,n){n.p.customParseFormat=!0,t&&t.parseTwoDigitYear&&(s=t.parseTwoDigitYear);var r=e.prototype,i=r.parse;r.parse=function(t){var e=t.date,r=t.utc,s=t.args;this.$u=r;var a=s[1];if("string"==typeof a){var f=!0===s[2],u=!0===s[3],h=f||u,d=s[2];u&&(d=s[2]),o=this.$locale(),!f&&d&&(o=n.Ls[d]),this.$d=function(t,e,n){try{if(["x","X"].indexOf(e)>-1)return new Date(("X"===e?1e3:1)*t);var r=c(e)(t),i=r.year,o=r.month,s=r.day,a=r.hours,f=r.minutes,u=r.seconds,h=r.milliseconds,d=r.zone,l=new Date,m=s||(i||o?1:l.getDate()),M=i||l.getFullYear(),Y=0;i&&!o||(Y=o>0?o-1:l.getMonth());var p=a||0,v=f||0,D=u||0,g=h||0;return d?new Date(Date.UTC(M,Y,m,p,v,D,g+60*d.offset*1e3)):n?new Date(Date.UTC(M,Y,m,p,v,D,g)):new Date(M,Y,m,p,v,D,g)}catch(t){return new Date("")}}(e,a,r),this.init(),d&&!0!==d&&(this.$L=this.locale(d).$L),h&&e!=this.format(a)&&(this.$d=new Date("")),o={};}else if(a instanceof Array)for(var l=a.length,m=1;m<=l;m+=1){s[1]=a[m-1];var M=n.apply(this,s);if(M.isValid()){this.$d=M.$d,this.$L=M.$L,this.init();break}m===l&&(this.$d=new Date(""));}else i.call(this,t);};}}));
});

var eras = [
    { name: '令和', from: '2019-05-01' },
    { name: '平成', from: '1989-01-08' },
    { name: '昭和', from: '1926-12-25' },
    { name: '大正', from: '1912-07-30' },
    { name: '明治', from: '1868-09-08' },
    { name: '慶応', from: '1865-04-07' },
    { name: '元治', from: '1864-02-20' },
    { name: '文久', from: '1861-02-19' },
    { name: '万延', from: '1860-03-18' },
    { name: '安政', from: '1854-11-27' },
    { name: '嘉永', from: '1848-02-28' },
    { name: '弘化', from: '1844-12-02' },
    { name: '天保', from: '1830-12-10' },
    { name: '文政', from: '1818-04-22' },
    { name: '文化', from: '1804-02-11' },
    { name: '享和', from: '1801-02-05' },
    { name: '寛政', from: '1789-01-25' },
    { name: '天明', from: '1781-04-02' },
    { name: '安永', from: '1772-11-16' },
    { name: '明和', from: '1764-06-02' },
    { name: '宝暦', from: '1751-10-27' },
    { name: '寛延', from: '1748-07-12' },
    { name: '延享', from: '1744-02-21' },
    { name: '寛保', from: '1741-02-27' },
    { name: '元文', from: '1736-04-28' },
    { name: '享保', from: '1716-06-22' },
    { name: '正徳', from: '1711-04-25' },
    { name: '宝永', from: '1704-03-13' },
    { name: '元禄', from: '1688-09-30' },
    { name: '貞享', from: '1684-02-21' },
    { name: '天和', from: '1681-09-29' },
    { name: '延宝', from: '1673-09-21' },
    { name: '寛文', from: '1661-04-25' },
    { name: '万治', from: '1658-07-23' },
    { name: '明暦', from: '1655-04-13' },
    { name: '承応', from: '1652-09-18' },
    { name: '慶安', from: '1648-02-15' },
    { name: '正保', from: '1644-12-16' },
    { name: '寛永', from: '1624-02-30' },
    { name: '元和', from: '1615-07-13' },
    { name: '慶長', from: '1596-10-27' },
    { name: '文禄', from: '1592-12-08' },
    { name: '天正', from: '1573-07-28' },
    { name: '元亀', from: '1570-04-23' },
    { name: '永禄', from: '1558-02-28' },
    { name: '弘治', from: '1555-10-23' },
    { name: '天文', from: '1532-07-29' },
    { name: '享禄', from: '1528-08-20' },
    { name: '大永', from: '1521-08-23' },
    { name: '永正', from: '1504-02-30' },
    { name: '文亀', from: '1501-02-29' },
    { name: '明応', from: '1492-07-19' },
    { name: '延徳', from: '1489-08-21' },
    { name: '長享', from: '1487-07-20' },
    { name: '文明', from: '1469-04-28' },
    { name: '応仁', from: '1467-03-05' },
    { name: '文正', from: '1466-02-28' },
    { name: '寛正', from: '1460-12-21' },
    { name: '長禄', from: '1457-09-28' },
    { name: '康正', from: '1455-07-25' },
    { name: '享徳', from: '1452-07-25' },
    { name: '宝徳', from: '1449-07-28' },
    { name: '文安', from: '1444-02-05' },
    { name: '嘉吉', from: '1441-02-17' },
    { name: '永享', from: '1429-09-05' },
    { name: '正長', from: '1428-04-27' },
    { name: '応永', from: '1394-07-05' },
    { name: '明徳', from: '1390-03-26' },
    { name: '元中', from: '1384-04-28' },
    { name: '弘和', from: '1381-02-10' },
    { name: '天授', from: '1375-05-27' },
    { name: '文中', from: '1372-04-？' },
    { name: '建徳', from: '1370-07-24' },
    { name: '正平', from: '1346-12-08' },
    { name: '興国', from: '1340-04-28' },
    { name: '延元', from: '1336-02-29' },
    { name: '建武', from: '1334-01-29' },
    { name: '元弘', from: '1331-08-09' },
    { name: '元徳', from: '1329-08-29' },
    { name: '嘉暦', from: '1326-04-26' },
    { name: '正中', from: '1324-12-09' },
    { name: '元亨', from: '1321-02-23' },
    { name: '元応', from: '1319-04-28' },
    { name: '文保', from: '1317-02-03' },
    { name: '正和', from: '1312-03-20' },
    { name: '応長', from: '1311-04-28' },
    { name: '延慶', from: '1308-10-09' },
    { name: '徳治', from: '1306-12-14' },
    { name: '嘉元', from: '1303-08-05' },
    { name: '乾元', from: '1302-11-21' },
    { name: '正安', from: '1299-04-25' },
    { name: '永仁', from: '1293-08-05' },
    { name: '正応', from: '1288-04-28' },
    { name: '弘安', from: '1278-02-29' },
    { name: '建治', from: '1275-04-25' },
    { name: '文永', from: '1264-02-28' },
    { name: '弘長', from: '1261-02-20' },
    { name: '文応', from: '1260-04-13' },
    { name: '正元', from: '1259-03-26' },
    { name: '正嘉', from: '1257-03-14' },
    { name: '康元', from: '1256-10-05' },
    { name: '建長', from: '1249-03-18' },
    { name: '宝治', from: '1247-02-28' },
    { name: '寛元', from: '1243-02-26' },
    { name: '仁治', from: '1240-07-16' },
    { name: '延応', from: '1239-02-07' },
    { name: '暦仁', from: '1238-11-23' },
    { name: '嘉禎', from: '1235-09-19' },
    { name: '文暦', from: '1234-11-05' },
    { name: '天福', from: '1233-04-15' },
    { name: '貞永', from: '1232-04-02' },
    { name: '寛喜', from: '1229-03-05' },
    { name: '安貞', from: '1227-12-10' },
    { name: '嘉禄', from: '1225-04-20' },
    { name: '元仁', from: '1224-11-20' },
    { name: '貞応', from: '1222-04-13' },
    { name: '承久', from: '1219-04-12' },
    { name: '建保', from: '1213-12-06' },
    { name: '建暦', from: '1211-03-09' },
    { name: '承元', from: '1207-10-25' },
    { name: '建永', from: '1206-04-27' },
    { name: '元久', from: '1204-02-20' },
    { name: '建仁', from: '1201-02-13' },
    { name: '正治', from: '1199-04-27' },
    { name: '建久', from: '1190-04-11' },
    { name: '文治', from: '1185-08-14' },
    { name: '元暦', from: '1184-04-16' },
    { name: '寿永', from: '1182-05-27' },
    { name: '養和', from: '1181-07-14' },
    { name: '治承', from: '1177-08-04' },
    { name: '安元', from: '1175-07-28' },
    { name: '承安', from: '1171-04-21' },
    { name: '嘉応', from: '1169-04-08' },
    { name: '仁安', from: '1166-08-27' },
    { name: '永万', from: '1165-06-05' },
    { name: '長寛', from: '1163-03-29' },
    { name: '応保', from: '1161-09-04' },
    { name: '永暦', from: '1160-01-10' },
    { name: '平治', from: '1159-04-20' },
    { name: '保元', from: '1156-04-27' },
    { name: '久寿', from: '1154-10-28' },
    { name: '仁平', from: '1151-01-26' },
    { name: '久安', from: '1145-07-22' },
    { name: '天養', from: '1144-02-23' },
    { name: '康治', from: '1142-04-28' },
    { name: '永治', from: '1141-07-10' },
    { name: '保延', from: '1135-04-27' },
    { name: '長承', from: '1132-08-11' },
    { name: '天承', from: '1131-01-29' },
    { name: '大治', from: '1126-01-22' },
    { name: '天治', from: '1124-04-03' },
    { name: '保安', from: '1120-04-10' },
    { name: '元永', from: '1118-04-03' },
    { name: '永久', from: '1113-07-13' },
    { name: '天永', from: '1110-07-13' },
    { name: '天仁', from: '1108-08-03' },
    { name: '嘉承', from: '1106-04-09' },
    { name: '長治', from: '1104-02-10' },
    { name: '康和', from: '1099-08-28' },
    { name: '承徳', from: '1097-11-21' },
    { name: '永長', from: '1096-12-17' },
    { name: '嘉保', from: '1094-12-15' },
    { name: '寛治', from: '1087-04-07' },
    { name: '応徳', from: '1084-02-07' },
    { name: '永保', from: '1081-02-10' },
    { name: '承暦', from: '1077-11-17' },
    { name: '承保', from: '1074-08-23' },
    { name: '延久', from: '1069-04-13' },
    { name: '治暦', from: '1065-08-02' },
    { name: '康平', from: '1058-08-29' },
    { name: '天喜', from: '1053-01-11' },
    { name: '永承', from: '1046-04-14' },
    { name: '寛徳', from: '1044-11-24' },
    { name: '長久', from: '1040-11-10' },
    { name: '長暦', from: '1037-04-21' },
    { name: '長元', from: '1028-07-25' },
    { name: '万寿', from: '1024-07-13' },
    { name: '治安', from: '1021-02-02' },
    { name: '寛仁', from: '1017-04-23' },
    { name: '長和', from: '1012-12-25' },
    { name: '寛弘', from: '1004-07-20' },
    { name: '長保', from: '999-01-13' },
    { name: '長徳', from: '995-02-22' },
    { name: '正暦', from: '990-11-07' },
    { name: '永祚', from: '989-08-08' },
    { name: '永延', from: '987-04-05' },
    { name: '寛和', from: '985-04-27' },
    { name: '永観', from: '983-04-15' },
    { name: '天元', from: '978-11-29' },
    { name: '貞元', from: '976-07-13' },
    { name: '天延', from: '973-12-20' },
    { name: '天禄', from: '970-03-25' },
    { name: '安和', from: '968-08-13' },
    { name: '康保', from: '964-07-10' },
    { name: '応和', from: '961-02-16' },
    { name: '天徳', from: '957-10-27' },
    { name: '天暦', from: '947-04-22' },
    { name: '天慶', from: '938-05-22' },
    { name: '承平', from: '931-04-26' },
    { name: '延長', from: '923-閏4-11' },
    { name: '延喜', from: '901-07-15' },
    { name: '昌泰', from: '898-04-26' },
    { name: '寛平', from: '889-04-27' },
    { name: '仁和', from: '885-02-21' },
    { name: '元慶', from: '877-04-16' },
    { name: '貞観', from: '859-04-15' },
    { name: '天安', from: '857-02-21' },
    { name: '斎衡', from: '854-11-30' },
    { name: '仁寿', from: '851-04-28' },
    { name: '嘉祥', from: '848-06-13' },
    { name: '承和', from: '834-01-03' },
    { name: '天長', from: '824-01-05' },
    { name: '弘仁', from: '810-09-19' },
    { name: '大同', from: '806-05-18' },
    { name: '延暦', from: '782-08-19' },
    { name: '天応', from: '781-01-01' },
    { name: '宝亀', from: '770-10-01' },
    { name: '神護景雲', from: '767-08-16' },
    { name: '天平神護', from: '765-01-07' },
    { name: '天平宝字', from: '757-08-18' },
    { name: '天平勝宝', from: '749-07-02' },
    { name: '天平感宝', from: '749-04-14' },
    { name: '天平', from: '729-08-05' },
    { name: '神亀', from: '724-02-04' },
    { name: '養老', from: '717-11-17' },
    { name: '霊亀', from: '715-09-02' },
    { name: '和銅', from: '708-01-11' },
    { name: '慶雲', from: '704-05-10' },
    { name: '大宝', from: '701-03-21' },
    { name: '朱鳥', from: '686-07-20' },
    { name: '白雉', from: '650-02-15' },
    { name: '大化', from: '645-06-19' },
];
var _default = eras;

var eras_1 = /*#__PURE__*/Object.defineProperty({
	default: _default
}, '__esModule', {value: true});

var utils = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJpEra = exports.getJpYear = exports.findEra = void 0;

exports.findEra = function (date) {
    var _a;
    var time = date.getTime();
    var era = eras_1.default.find(function (e) { return time >= (new Date(e.from)).getTime(); });
    return (_a = era === null || era === void 0 ? void 0 : era.name) !== null && _a !== void 0 ? _a : '';
};
exports.getJpYear = function (date) {
    var result;
    try {
        result = Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
            year: '2-digit',
            era: 'long'
        }).format(date).slice(0, -1);
        if (!isNaN(Number(result))) {
            result = exports.findEra(date) + result;
        }
    }
    catch (_a) {
        result = '該当なし';
    }
    return result;
};
exports.getJpEra = function (date) {
    var result;
    try {
        result = Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
            era: 'long'
        }).format(date).slice(0, 2);
        if (!isNaN(Number(result))) {
            result = exports.findEra(date) + result;
        }
    }
    catch (_a) {
        result = '不明';
    }
    return result;
};
});

var dist = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.jpFormat = void 0;

exports.jpFormat = function (_o, c) {
    var proto = c.prototype;
    var oldFormat = proto.format;
    proto.format = function (formatStr) {
        var _this = this;
        var result = formatStr.replace(/\[([^\]]+)]|r+|/g, function (match) {
            switch (match) {
                case 'rrrr':
                    return utils.getJpYear(_this.toDate());
                case 'rr':
                    return utils.getJpEra(_this.toDate());
                default:
                    return match;
            }
        });
        return oldFormat.bind(this)(result);
    };
};
});

dayjs__default["default"].extend(customParseFormat);
dayjs__default["default"].extend(dist.jpFormat);

const match = (pattern, format, index = 0) => {
  const match = format.match(pattern);
  return match ? match[index] : ''
};

const calculatePattern = format => {
  return {
    year: match(/Y+/, format),
    month: match(/M+/, format),
    date: match(/D+/, format),
    hour: match(/H+/i, format),
    minute: match(/m+/, format),
    dividerDate: match(/[YMD]+([^YMD]*)[YMD]+/, format, 1),
    dividerTime: match(/[Hms]+([^Hms]*)[Hms]+/, format, 1),
  }
};

/**
 * @param {string} baseFormat
 * @return {array}
 */
const guessDateOrder = (baseFormat) => {
  return [
    { type: 'year', index: baseFormat.indexOf('Y') },
    { type: 'month', index: baseFormat.indexOf('M') },
    { type: 'date', index: baseFormat.indexOf('D') },
  ]
    .sort((a, b) => a.index - b.index)
    .map(item => item.type)
};

/**
 * Format date string
 *
 * @param {string|number|Date} value
 * @param {string|undefined} modelFormat
 * @param {string} type
 * @return {string|undefined}
 */
const datestring = (value, modelFormat, type) => {
  if (!value) return undefined

  const baseFormat = '^' + modelFormat
    .replace(/(Aa|M{3,4}|d{2,4})/g, '[\\u\\l]+?')
    .replace(/([YMDHms])/g, '\\d');
  const format = new RegExp(baseFormat);
  if (format.test(value)) {
    const modelValue = dayjs__default["default"](value, modelFormat);
    if (modelValue.isValid()) {
      return modelValue.format(modelFormat)
    } else if (type === 'time' && typeof value === 'string') {
      const datetime = `1980-01-01 ${value}`;
      const date = dayjs__default["default"](datetime, `YYYY-MM-DD ${modelFormat}`);
      return date.isValid() ? datetime : undefined
    }
    return undefined
  } else {
    return undefined
  }
};

var useBindings = {
  props: {
    align: { type: String, default: 'right' },
    defaultValue: { type: String, default: undefined },
    pattern: { type: Object, default: undefined },
    format: { type: [String, Object], default: undefined },
    value: { type: [String, Number, Date], default: undefined },
  },
  computed: {
    modelValue: {
      get () {
        const modelValue = this.value || this.defaultValue || dayjs__default["default"]().format(this.modelFormat);
        return datestring(modelValue, this.modelFormat, this.type)
      },
      set (value) {
        const valueObj = dayjs__default["default"](value, this.format);
        if (this.minDate && valueObj.isBefore(this.minDate)) value = this.minDate;
        if (this.maxDate && valueObj.isAfter(this.maxDate)) value = this.maxDate;

        this.$emit('input', value);
      },
    },
    modelFormat () {
      if (this.format) return this.format
      switch (this.type) {
        case 'datetime': return 'YYYY-MM-DD HH:mm'
        case 'date': return 'YYYY-MM-DD'
        case 'time': return 'HH:mm'
        default: throw new Error('Invalid property. "type" is only allow "datetime/date/time".')
      }
    },
    drumPattern () {
      return {
        ...calculatePattern(this.modelFormat),
        ...(this.pattern || {}),
      }
    },
  },
  methods: {
    onInput (value) {
      if (dayjs__default["default"].unix(value).isBefore(this.minDate)) {
        this.modelValue = datestring(this.minDate, this.modelFormat, this.type);
      } else if (this.maxDate && dayjs__default["default"](value).isAfter(this.maxDate)) {
        this.modelValue = datestring(this.maxDate, this.modelFormat, this.type);
      } else {
        this.modelValue = datestring(value, this.modelFormat, this.type);
      }
    },

    onNativeInput (event) {
      const value = datestring(event.target.value, this.modelFormat, this.type);
      if (value) this.modelValue = value;
    },
  },
};

var OverlayLayer = {
  name: 'OverlayLayer',
  functional: true,
  props: {
    dark: { type: Boolean, default: false },
  },
  render (h, context) {
    return h('div', {
      class: [
        'v-drumroll-picker__overlay',
        context.props.dark ? '--dark' : '',
      ],
      on: {
        click: context.listeners.click,
      },
    })
  },
};

// Material Design Icons v5.9.55
var mdiCheckBold = "M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z";

var ConfirmButton = {
  name: 'ConfirmButton',

  functional: true,

  props: {
    size: { type: [Number, String], default: 24 },
  },

  render (h, { props, listeners }) {
    const icon = h('svg',
      {
        class: ['v-drumroll-picker__button--icon'],
        style: {
          height: `${props.size}px`,
          width: `${props.size}px`,
        },
        attrs: {
          viewBox: '0 0 24 24',
        },
      },
      [h('path', {
        attrs: { d: mdiCheckBold },
      })],
    );

    return h('button', {
      class: ['v-drumroll-picker__button'],
      on: { ...listeners },
    }, [icon])
  },
};

const pickerLayer = h => (
  h('div', { class: ['vue-scroll-picker-layer'] }, [
    h('div', { class: ['top'], ref: 'top' }),
    h('div', { class: ['middle'], ref: 'selection' }),
    h('div', { class: ['bottom'], ref: 'bottom' }),
  ])
);

const confirmButton = (h, { props, listeners }) => (
  !props.dialog || props.hideButton
    ? [] : [h(ConfirmButton, { on: listeners })]
);

var PickerContainer = {
  name: 'PickerContainer',

  functional: true,

  props: {
    dialog: { type: Boolean, default: false },
    height: { type: [Number, String], default: '10em' },
    hideButton: { type: Boolean, default: false },
  },

  render: (h, context) => (h('div',
    {
      class: 'v-drumroll-picker__container',
      style: {
        height: typeof context.props.height === 'string'
          ? context.props.height : context.props.height + 'px',
      },
    },
    [
      pickerLayer(h),
      ...context.children,
      pickerLayer(h),
      ...confirmButton(h, context),
    ],
  )),
};

const transitionLayer = (h, content) => (
  h('transition', {
    props: {
      name: 'v-drumroll-picker__slide-transition',
      mode: 'in-out',
      appear: true,
      duration: 300,
    },
  }, [content])
);

var ContentLayer = {
  name: 'ContentLayer',
  functional: true,
  render (h, context) {
    return transitionLayer(h, h('div', {
      class: 'v-drumroll-picker__content',
      on: { click: e => e.stopPropagation() },
    }, context.children))
  },
};

const disableScroll = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

var useDialog = {
  props: {
    dialog: { type: Boolean, default: false },
    hideOverlay: { type: Boolean, default: false },
    hideButton: { type: Boolean, default: false },
  },

  data () {
    return {
      active: false,
    }
  },

  methods: {
    generateDialogPicker (h) {
      const content = [this.generateActivator(h)];

      if (this.active) {
        // overlay
        content.push(h(OverlayLayer, {
          props: { dark: !this.hideOverlay },
          on: { click: this.offActivate },
        }));

        // picker
        const picker = h(PickerContainer, {
          props: this.$props,
          on: { click: this.offActivate },
        }, [this.pickers(h)]);
        content.push(h(ContentLayer, [picker]));
      }
      return h('div', { class: ['v-drumroll-picker', 'v-drumroll-picker--dialog'] }, content)
    },

    generateActivator (h) {
      const on = {
        click: this.onActivate,
        focus: this.onActivate,
        touchend: this.onActivate,
      };

      if (this.$scopedSlots.activator) {
        return this.$scopedSlots.activator({ on })
      }

      // Fallback default
      const options = {
        class: 'v-drumroll-picker__input',
        domProps: { value: this.value },
        on: { input: this.onNativeInput, ...on },
      };
      return h('input', options)
    },

    /**
     * @param {KeyboardEvent} e
     */
    onClose (e) {
      if (e.key.toUpperCase() === 'ESCAPE') this.offActivate(e);
    },

    /**
     * @param {MouseEvent} e
     */
    onActivate (e) {
      e.preventDefault();

      // Close on ESC
      document.addEventListener('keydown', this.onClose);
      document.addEventListener('scroll', disableScroll, { passive: false });
      document.addEventListener('wheel', disableScroll, { passive: false });
      document.addEventListener('touchmove', disableScroll, { passive: false });

      // Blur active element.
      const isElement = document.activeElement instanceof HTMLElement;
      if (!this.active && !this.hideOverlay && isElement) document.activeElement.blur();

      // Emit initial value
      const modelFormat = this.format || this.modelFormat;
      const modelValue = this.value || this.defaultValue || dayjs__default["default"]().format(modelFormat);
      const initialValue = datestring(modelValue, modelFormat, this.type);
      this.$emit('input', initialValue);

      this.active = !this.active;
    },

    /**
     * @param {MouseEvent|KeyboardEvent} e
     */
    offActivate (e) {
      e.preventDefault();
      document.removeEventListener('keydown', this.onClose);
      document.removeEventListener('scroll', disableScroll);
      document.removeEventListener('wheel', disableScroll);
      document.removeEventListener('touchmove', disableScroll);
      this.active = false;
    },
  },
};

var useSensitivity = {
  props: {
    /**
     * Dependency library properties
     * @see https://github.com/wan2land/vue-scroll-picker
     */
    dragSensitivity: { type: [String, Number], default: 1.7 },
    touchSensitivity: { type: [String, Number], default: 1.7 },
    scrollSensitivity: { type: [String, Number], default: 0.8 },
  },
};

var DrumDivider = {
  name: 'DrumDivider',

  functional: true,

  props: {
    divider: { type: String, required: true },
  },

  render (h, { props }) {
    return h('span', { class: 'v-drumroll-picker__divider -selected' }, [props.divider])
  },
};

var BasePicker = {
  name: 'BasePicker',

  functional: true,

  mixins: [
    useSensitivity,
  ],

  props: {
    align: { type: String, default: 'center' },
    items: { type: Array, required: true },
    format: { type: String, required: true },
    height: { type: [String, Number], default: '10em' },
    unit: { type: String, required: true },
    value: { type: [String, Number], default: undefined },
  },

  render (h, { props, listeners }) {
    return h(vueScrollPicker.ScrollPicker, {
      style: {
        '--picker-align': props.align,
        height: typeof props.height === 'string' ? props.height : props.height + 'px',
      },
      props: {
        options: props.items,
        dragSensitivity: props.dragSensitivity,
        touchSensitivity: props.touchSensitivity,
        scrollSensitivity: props.scrollSensitivity,
        value: dayjs__default["default"](props.value, props.format).get(props.unit),
      },
      on: {
        input: value => {
          if (!value) value = 0;

          const dateObj = props.value ? dayjs__default["default"](props.value, props.format) : dayjs__default["default"]();
          const current = dateObj.get(props.unit);
          const date = dateObj.set(props.unit, value);

          // 桁上がり抑止
          if (current <= value && date.get(props.unit) < value) return
          listeners.input(date.unix());
        },
      },
    })
  },
};

var BaseDatePicker = {
  name: 'BaseDatePicker',

  mixins: [useSensitivity],

  props: {
    align: { type: String, default: 'center' },
    dateOrder: { type: Array, default: undefined },
    defaultValue: { type: String, default: undefined },
    drumPattern: { type: Object, required: true },
    format: { type: [String, Object], default: 'YYYY-MM-DD' },
    height: { type: [String, Number], default: undefined },
    maxDate: { type: [String, Number, Date], default: undefined },
    minDate: { type: [String, Number, Date], default: DEFAULT_MIN_DATE },
    separator: { type: String, default: undefined }, // deprecated
    value: { type: [String, Number, Date], default: undefined },
  },

  data () {
    const date = dayjs__default["default"](this.value || this.defaultValue, this.format).endOf('month').date();
    return {
      date: date,
      numberOfDays: date,
      dateOfMin: 1,
      monthOfMin: 0,
    }
  },

  computed: {
    formatDefaultValue () {
      return dayjs__default["default"](this.defaultValue).format(this.format)
    },

    /**
     * 年配列
     *
     * @return {array}
     */
    years () {
      const value = this.value || this.defaultValue;
      const minYear = dayjs__default["default"](this.minDate).year();
      const maxYear = this.maxDate
        ? dayjs__default["default"](this.maxDate).year()
        : dayjs__default["default"](value, this.format).add(100, 'year').year();

      const years = [];
      const dateObj = dayjs__default["default"](value, this.format);
      for (let year = minYear; year <= maxYear; year++) {
        years.push({
          name: dateObj.set('year', year).format(this.drumPattern.year),
          value: year,
        });
      }

      return years
    },

    /**
     * 月配列
     *
     * @return {array}
     */
    months () {
      const value = this.value || this.defaultValue;
      const currentDate = dayjs__default["default"](value, this.format);
      const minDate = dayjs__default["default"](this.minDate);
      let min = currentDate.isSame(minDate, 'year') ? minDate.month() : 0;
      let max = this.maxDate && currentDate.isSame(this.maxDate, 'year')
        ? dayjs__default["default"](this.maxDate).month() + 1
        : MONTH_UNIT;

      if (min > currentDate.month() || max < currentDate.month()) {
        min = 0;
        max = MONTH_UNIT;
      }

      // 桁揃えをしつつ時刻を配列に追加
      const months = [];
      const dateObj = dayjs__default["default"](value, this.format);
      for (let month = Math.min(this.monthOfMin, min); month < max; month++) {
        months.push({
          name: dateObj.set('month', month).format(this.drumPattern.month),
          value: month,
        });
      }

      this.$nextTick(() => setTimeout(() => {
        this.monthOfMin = min;
      }, 100));

      return months
    },

    /**
     * 日配列
     *
     * @params {string} date
     * @return {array}
     */
    days () {
      const value = this.value || this.defaultValue;
      const currentDate = dayjs__default["default"](value, this.format);
      const minDate = dayjs__default["default"](this.minDate);
      let min = currentDate.isSame(minDate, 'month') ? minDate.date() : 1;
      let max = this.maxDate && currentDate.isSame(this.maxDate, 'month')
        ? dayjs__default["default"](this.maxDate).date()
        : this.numberOfDays;

      if (min > currentDate.date() || max < currentDate.date()) {
        min = 1;
        max = this.numberOfDays;
      }

      // 桁揃えをしつつ時刻を配列に追加
      const days = [];
      const dateObj = currentDate.clone();
      for (let date = Math.min(this.dateOfMin, min); date <= max; date++) {
        days.push({
          name: date <= this.date && date >= min ? dateObj.set('date', date).format(this.drumPattern.date) : '',
          value: date,
        });
      }

      this.$nextTick(() => setTimeout(() => {
        this.dateOfMin = min;
        this.numberOfDays = this.date;
      }, 100));

      return days
    },
  },

  watch: {
    value (newValue) {
      const newDate = dayjs__default["default"](newValue, this.format);
      this.date = newDate.endOf('month').date();
    },
  },

  methods: {
    onInput (value) {
      if (!value) return

      let valueObj = dayjs__default["default"].unix(value);
      if (valueObj.isBefore(this.minDate)) valueObj = dayjs__default["default"](this.minDate);
      if (this.maxDate && valueObj.isAfter(this.maxDate)) valueObj = dayjs__default["default"](this.maxDate);

      if (this.value || valueObj.format(this.format) !== this.formatDefaultValue) {
        this.$emit('input', valueObj.format(this.format));
      }
    },
  },

  render (h) {
    const divider = this.separator || this.drumPattern.dividerDate || this.drumPattern['divider-date'];
    const drumDivider = divider ? h(DrumDivider, { props: { divider } }) : null;

    const drums = {
      year: h(BasePicker, {
        props: {
          items: this.years,
          unit: 'year',
          ...this.$props,
          value: this.value || this.defaultValue,
        },
        on: {
          input: this.onInput,
        },
      }),
      month: h(BasePicker, {
        props: {
          items: this.months,
          unit: 'month',
          ...this.$props,
          value: this.value || this.defaultValue,
        },
        on: {
          input: this.onInput,
        },
      }),
      date: h(BasePicker, {
        props: {
          items: this.days,
          unit: 'date',
          ...this.$props,
          value: this.value || this.defaultValue,
        },
        on: {
          input: this.onInput,
        },
      }),
    };

    const pickers = [];
    const dateOrder = this.dateOrder || guessDateOrder(this.format);
    for (let i = 0; i < dateOrder.length; i++) {
      pickers.push(drums[dateOrder[i]]);
      if (divider && i < dateOrder.length - 1) pickers.push(drumDivider);
    }

    return h(vueScrollPicker.ScrollPickerGroup, pickers)
  },
};

var BaseTimePicker = {
  name: 'BaseTimePicker',

  mixins: [useSensitivity],

  props: {
    align: { type: String, default: 'center' },
    defaultValue: { type: String, default: undefined },
    drumPattern: { type: Object, required: true },
    format: { type: String, default: 'YYYY-MM-DD HH:mm' },
    height: { type: [String, Number], default: undefined },
    maxDate: { type: [String, Number, Date], default: undefined },
    minDate: { type: [String, Number, Date], default: undefined },
    minuteInterval: { type: [String, Number], default: 1 },
    separator: { type: String, default: undefined }, // deprecated
    value: { type: [String, Number, Date], default: undefined },
  },

  data () {
    return {
      hourOfMin: 0,
      minuteOfMin: 0,
    }
  },

  computed: {
    formatDefaultValue () {
      return dayjs__default["default"](this.defaultValue).format(this.format)
    },

    /**
     * 時配列
     *
     * @return {array}
     */
    hours () {
      let min = 0;
      let max = HOUR_UNIT;

      const value = this.value || this.defaultValue;
      const currentDate = value ? dayjs__default["default"](value, this.format) : dayjs__default["default"]();

      if (this.minDate) {
        const minDate = dayjs__default["default"](this.minDate);
        min = currentDate.isSame(minDate, 'date') ? minDate.hour() : 0;
      }
      if (this.maxDate) {
        max = this.maxDate && currentDate.isSame(this.maxDate, 'date')
          ? dayjs__default["default"](this.maxDate).hour() + 1 : HOUR_UNIT;
      }

      const hours = [];
      const dateObj = currentDate.clone();
      for (let hour = Math.min(this.hourOfMin, min); hour < max; hour++) {
        hours.push({
          name: dateObj.set('hour', hour).format(this.drumPattern.hour),
          value: hour,
        });
      }

      this.$nextTick(() => setTimeout(() => {
        this.hourOfMin = min;
      }, 100));

      return hours
    },

    /**
     * 分配列
     *
     * @return {array}
     */
    minutes () {
      let min = 0;
      let max = MINUTE_UNIT;

      const value = this.value || this.defaultValue;
      const currentDate = value ? dayjs__default["default"](value, this.format) : dayjs__default["default"]();

      if (this.minDate) {
        const minDate = dayjs__default["default"](this.minDate);
        min = currentDate.isSame(minDate, 'hour') ? minDate.minute() : 0;
      }
      if (this.maxDate) {
        max = this.maxDate && currentDate.isSame(this.maxDate, 'hour')
          ? dayjs__default["default"](this.maxDate).minute() + 1
          : MINUTE_UNIT;
      }

      const interval = Number(this.minuteInterval);
      const minutes = [];
      const dateObj = currentDate.clone();
      for (let minute = Math.min(this.minuteOfMin, min); minute < max; minute += interval) {
        minutes.push({
          name: dateObj.set('minute', minute).format(this.drumPattern.minute),
          value: minute,
        });
      }

      this.$nextTick(() => setTimeout(() => {
        this.minuteOfMin = min;
      }, 100));

      return minutes
    },
  },

  methods: {
    onInput (value) {
      if (value && (this.value || dayjs__default["default"].unix(value).format(this.format) !== this.formatDefaultValue)) {
        this.$emit('input', dayjs__default["default"].unix(value).format(this.format));
      }
    },
  },

  render (h) {
    const divider = this.separator || this.drumPattern.dividerTime || this.drumPattern['divider-time'];
    const drumDivider = divider ? h(DrumDivider, { props: { divider } }) : null;

    // 時
    const hourPicker = h(BasePicker, {
      props: {
        ...this.$props,
        items: this.hours,
        unit: 'hour',
      },
      on: {
        input: this.onInput,
      },
    });

    // 分
    const minutePicker = h(BasePicker, {
      props: {
        ...this.$props,
        items: this.minutes,
        unit: 'minute',
      },
      on: {
        input: this.onInput,
      },
    });

    return h(vueScrollPicker.ScrollPickerGroup, [
      hourPicker,
      drumDivider,
      minutePicker,
    ])
  },
};

const generateDatePicker = (h, options) => (
  h(BaseDatePicker, options())
);

const generateTimePicker = (h, options) => (
  h(BaseTimePicker, options())
);

var DateTimePicker = {
  name: 'DateTimePicker',

  mixins: [
    useBindings,
    useDialog,
    useSensitivity,
  ],

  props: {
    dateOrder: { type: Array, default: undefined },
    height: { type: [String, Number], default: undefined },
    hideButton: { type: Boolean, default: false },
    maxDate: { type: [String, Number, Date], default: undefined },
    minDate: { type: [String, Number, Date], default: () => DEFAULT_MIN_DATE },
    minuteInterval: { type: [String, Number], default: 1 },
    type: { type: String, default: 'datetime' },
  },

  methods: {
    pickers (h) {
      const options = props => ({
        props: {
          ...this.$props,
          ...props,
          value: this.modelValue,
          format: this.modelFormat,
          drumPattern: this.drumPattern,
        },
        on: { input: this.onInput },
      });

      switch (this.type) {
        case 'datetime': return [generateDatePicker(h, options), generateTimePicker(h, options)]
        case 'date': return [generateDatePicker(h, options)]
        case 'time': return [generateTimePicker(h, options)]
      }
    },
  },

  render (h) {
    if (this.dialog) {
      return this.generateDialogPicker(h)
    } else {
      const container = h(PickerContainer, { props: this.$props }, [this.pickers(h)]);
      return h('div', { class: ['v-drumroll-picker'] }, [container])
    }
  },
};

var DatePicker = {
  name: 'DatePicker',

  mixins: [
    useBindings,
    useDialog,
    useSensitivity,
  ],

  props: {
    dateOrder: { type: Array, default: undefined },
    height: { type: [String, Number], default: undefined },
    hideButton: { type: Boolean, default: false },
    maxDate: { type: [String, Number, Date], default: undefined },
    minDate: { type: [String, Number, Date], default: () => DEFAULT_MIN_DATE },
    separator: { type: String, default: undefined }, // deprecated
  },

  computed: {
    type () {
      return 'date'
    },
  },

  methods: {
    pickers (h) {
      const options = () => ({
        props: {
          ...this.$props,
          value: this.modelValue,
          format: this.modelFormat,
          drumPattern: this.drumPattern,
        },
        on: { input: this.onInput },
      });

      return [h(BaseDatePicker, options())]
    },
  },

  render (h) {
    if (this.dialog) {
      return this.generateDialogPicker(h)
    } else {
      const props = {
        ...this.$props,
        value: this.modelValue,
        format: this.modelFormat,
        drumPattern: this.drumPattern,
      };
      const container = h(PickerContainer, { props }, [this.pickers(h)]);
      return h('div', { class: ['v-drumroll-picker'] }, [container])
    }
  },
};

var TimePicker = {
  name: 'TimePicker',

  mixins: [
    useBindings,
    useDialog,
    useSensitivity,
  ],

  props: {
    height: { type: [String, Number], default: undefined },
    hideButton: { type: Boolean, default: false },
    minuteInterval: { type: [String, Number], default: 1 },
    separator: { type: String, default: undefined }, // deprecated
  },

  computed: {
    type: () => 'time',
  },

  methods: {
    onInput (value) {
      this.modelValue = datestring(value, this.modelFormat, this.type);
    },

    pickers (h) {
      const options = () => ({
        props: {
          ...this.$props,
          value: this.modelValue,
          format: this.modelFormat,
          drumPattern: this.drumPattern,
        },
        on: { input: this.onInput },
      });

      return [h(BaseTimePicker, options())]
    },
  },

  render (h) {
    if (this.dialog) {
      return this.generateDialogPicker(h)
    } else {
      const props = {
        ...this.$props,
        value: this.modelValue,
        format: this.modelFormat,
        drumPattern: this.drumPattern,
      };
      const container = h(PickerContainer, { props }, [this.pickers(h)]);
      return h('div', { class: ['v-drumroll-picker'] }, [container])
    }
  },
};

exports.DatePicker = DatePicker;
exports.DateTimePicker = DateTimePicker;
exports.TimePicker = TimePicker;
exports["default"] = DateTimePicker;
