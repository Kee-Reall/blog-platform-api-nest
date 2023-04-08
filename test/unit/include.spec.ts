import { ObjectId } from 'mongodb';

describe('how it wrill work?', () => {
  const id1 = new ObjectId();
  const id2 = new ObjectId();
  const id3 = new ObjectId();
  const id4 = new ObjectId();
  const id5 = new ObjectId();
  const id6 = new ObjectId();
  const id7 = new ObjectId();
  const objIdArray: ObjectId[] = [id1, id2, id3, id4, id5, id6, id7];
  const hexIdArray: string[] = objIdArray.map((id) => id.toHexString());
  it('test obj id1', () => {
    expect(objIdArray.includes(id1)).not.toBe(false);
  });
  it('test obj id2', () => {
    //@ts-ignore
    expect(objIdArray.includes(id1.toHexString())).toBe(false);
  });
  it('test obj id3', () => {
    //@ts-ignore
    expect(hexIdArray.includes(id1)).toBe(false);
  });
  it('test obj id3', () => {
    //@ts-ignore
    expect(hexIdArray.includes(id1.toHexString())).toBe(true);
  });
});
