function isHidden(key: string): boolean {
  return key.startsWith('_');
}

export function deleteHidden(_: any, ret: any): any {
  for (const key in ret) {
    if (isHidden(key)) {
      delete ret[key];
    }
  }
}
