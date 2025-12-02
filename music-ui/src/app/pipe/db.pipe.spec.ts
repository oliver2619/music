import { DbPipe } from './db.pipe';

describe('DbPipe', () => {
  it('create an instance', () => {
    const pipe = new DbPipe();
    expect(pipe).toBeTruthy();
  });
});
