export function listenCallbackFunction(port: number | string) {
  return () => console.log(`App is listening: ${port} port`);
}
