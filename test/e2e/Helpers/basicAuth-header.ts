import * as process from 'process';

export function getBasicAuth() {
  return (
    'Basic ' +
    new Buffer(`${process.env.LOGIN}:${process.env.PASSWORD}`).toString(
      'base64',
    )
  );
}
