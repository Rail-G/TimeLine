import {describe} from 'yargs';
import News from '../news';

const data = [
  ['51.50851, -0.12572', true],
  ['-51.50851, -0.12572', true],
  ['51.50851, 0.12572', true],
  ['51.50851,-0.12572', true],
  ['-51.50851,-0.12572', true],
  ['51.50851,0.12572', true],
  ['[51.50851, -0.12572]', true],
  ['[-51.50851, -0.12572]', true],
  ['[51.50851, 0.12572]', true],
  ['90.01,0.12572', false],
  ['[51.50851, -180.0001]', false],
  ['[51.50851, 0,12572]', false],
];

test.each(data)('validation geo position %s', (value, res) => {
  const news = new News();
  const result = news.validateGeoPosition(value);
  expect(result).toEqual(res);
});
