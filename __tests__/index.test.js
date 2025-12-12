// @ts-check

import { test } from 'node:test';
import assert from 'assert/strict';
import Validator from '../index.js';

test('step1', () => {
  const v = new Validator();
  const schema = v.number();

  assert.equal(schema.isValid(null), false);
  assert.equal(schema.isValid(''), false);
  assert.equal(schema.isValid(true), false);
  assert.equal(schema.isValid(123), true);
  assert.equal(schema.isValid(0), true);
  assert.equal(schema.isValid(-3), true);
  assert.equal(schema.isValid(4.1), true);
});

test('step2', () => {
  const v = new Validator();

  const schema1 = v.number();
  assert.equal(schema1.isValid(123), true);

  const schema2 = v.number().integers();
  assert.equal(schema2.isValid(1.23), false);
  assert.equal(schema2.isValid(123), true);
});

test('step3', () => {
  const v = new Validator();

  const schema1 = v.array();
  assert.equal(schema1.isValid([]), true);
  assert.equal(schema1.isValid([1, 2]), true);
  assert.equal(schema1.isValid(12), false);
  assert.equal(schema1.isValid({}), false);

  const schema2 = v.array().integers();
  assert.equal(schema2.isValid([]), false);
  assert.equal(schema2.isValid([1, 2]), true);
  assert.equal(schema2.isValid([12, 'b']), false);
  assert.equal(schema2.isValid({}), false);
});

test('step4', () => {
  const v = new Validator();

  const schema1 = v.array().custom((element) => (element % 2) === 0);
  assert.equal(schema1.isValid([1, 2]), false);
  assert.equal(schema1.isValid([1.2]), false);
  assert.equal(schema1.isValid([2, 4, 8, 12]), true);
});

test('step5', () => {
  const v = new Validator();

  const schema = v.object().shape({
    num: v.number(),
    obj: v.object().shape({
      array: v.array().integers(),
      innerObj: v.object().shape({
        num: v.number(),
        deepestObj: v.object().shape({
          num: v.number(),
        }),
      }),
    }),
  });
  const schema1 = v.object().shape({});

  assert.deepEqual(schema1.isValid(null), false);

  assert.deepEqual((schema.isValid({
    num: 54,
    obj: {
      array: [1, 2],
      innerObj: {
        num: 2,
        deepestObj: { num: 5 },
      },
    },
  })), true);

  assert.deepEqual((schema.isValid({
    num: '54',
    obj: {
      array: [1, 2],
      innerObj: {
        num: 2,
        deepestObj: { num: 5 },
      },
    },
  })), false);

  assert.deepEqual((schema.isValid({
    num: null,
    obj: {
      array: [1, 2],
      innerObj: {
        num: 2,
        deepestObj: { num: 5 },
      },
    },
  })), false);
});
