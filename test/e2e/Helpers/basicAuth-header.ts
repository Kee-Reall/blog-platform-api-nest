import * as process from 'process';

export function getBasicAuth() {
  return (
    'Basic ' +
    Buffer.from(`${process.env.LOGIN}:${process.env.PASSWORD}`).toString(
      'base64',
    )
  );
}
