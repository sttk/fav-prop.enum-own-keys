'use strict';

var chai = require('chai');
var expect = chai.expect;

var fav = {}; fav.prop = {}; fav.prop.enumOwnKeys = require('..');

var enumOwnKeys = fav.prop.enumOwnKeys;

describe('fav.prop.enumOwnKeys', function() {

  it('Should get all property keys when the argument is a plain object',
  function() {
    expect(enumOwnKeys({})).to.deep.equal([]);
    expect(enumOwnKeys({ a: 1, b: true, c: 'C' }).sort()).to.deep
      .equal(['a', 'b', 'c']);
  });

  it('Should not get properties of prototype', function() {
    function Fn0() {}
    Fn0.prototype.a = 1;
    expect(enumOwnKeys(new Fn0())).to.deep.equal([]);
    function Fn1() {
      this.b = true;
      this.c = 'C';
    }
    Fn1.prototype = new Fn0();
    Fn1.prototype.d = 'D';
    expect(enumOwnKeys(new Fn1()).sort()).to.deep.equal(['b', 'c']);
  });

  it('Should get only enumerable property keys', function() {
    var obj = {};
    Object.defineProperties(obj, {
      a: { enumerable: true, value: 1 },
      b: { value: true },
      c: { value: 'C' },
    });
    expect(enumOwnKeys(obj)).to.deep.equal(['a']);
  });

  it('Should return an empty array when the argument is nullish', function() {
    expect(enumOwnKeys(undefined)).to.deep.equal([]);
    expect(enumOwnKeys(null)).to.deep.equal([]);
  });

  it('Should return an empty array when the argument is primitive type',
  function() {
    expect(enumOwnKeys(true)).to.deep.equal([]);
    expect(enumOwnKeys(false)).to.deep.equal([]);
    expect(enumOwnKeys(0)).to.deep.equal([]);
    expect(enumOwnKeys(123)).to.deep.equal([]);
  });

  it('Should return an array having index strings when the argument is a ' +
  'string', function() {
    expect(enumOwnKeys('')).to.deep.equal([]);
    expect(enumOwnKeys('abc')).to.deep.equal(['0', '1', '2']);

    var s = 'abc';
    try {
      s.aaa = 'AAA';
    } catch (e) {
      // Throw TypeError on Node.js version 0.11 or later.
      //console.error('\t', e.message);
    }
    expect(enumOwnKeys(s)).to.deep.equal(['0', '1', '2']);

    try {
      Object.defineProperty(s, 'bbb', { value: 'BBB' });
    } catch (e) {
      // Throw TypeError on Node.js version 0.11 or later.
      //console.error('\t', e.message);
    }
    expect(enumOwnKeys(s)).to.deep.equal(['0', '1', '2']);
  });

  it('Should return an array of index strings when the argument is a String' +
  '\n\tobject', function() {
    var s = new String('abc');
    expect(enumOwnKeys(s).sort()).to.deep.equal(['0', '1', '2']);

    s.aaa = 'AAA';
    expect(enumOwnKeys(s).sort()).to.deep.equal(['0', '1', '2', 'aaa']);

    Object.defineProperty(s, 'bbb', { value: 'BBB' });
    expect(enumOwnKeys(s).sort()).to.deep
      .equal(['0', '1', '2', 'aaa']);
  });

  it('Should return an array of index strings when the argument is a array',
  function() {
    expect(enumOwnKeys([])).to.deep.equal([]);
    expect(enumOwnKeys([1, 2, 3]).sort()).to.deep.equal(['0', '1', '2']);

    var a = ['a', 'b'];
    a.aaa = 'AAA';
    expect(enumOwnKeys(a).sort()).to.deep.equal(['0', '1', 'aaa']);

    Object.defineProperty(a, 'bbb', { value: 'BBB' });
    expect(enumOwnKeys(a).sort()).to.deep
      .equal(['0', '1', 'aaa']);
  });

  it('Should return appended properties when the argument is a function',
  function() {
    var fn = function() {};
    expect(enumOwnKeys(fn)).to.deep.equal([]);

    fn.aaa = 'AAA';
    expect(enumOwnKeys(fn)).to.deep.equal(['aaa']);

    Object.defineProperty(fn, 'bbb', { value: 'BBB' });
    expect(enumOwnKeys(fn).sort()).to.deep.equal(['aaa']);
  });

  it('Should return an empty string when the argument is a symbol',
  function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var symbol = Symbol('foo');
    expect(enumOwnKeys(symbol)).to.deep.equal([]);

    try {
      symbol.aaa = 'AAA';
    } catch (e) {
      //console.error('\t', e.message);
    }
    expect(enumOwnKeys(symbol)).to.deep.equal([]);

    try {
      Object.defineProperty(symbol, 'bbb', { value: 'BBB' });
    } catch (e) {
      //console.error('\t', e.message);
    }
    expect(enumOwnKeys(symbol)).to.deep.equal([]);
  });
});
