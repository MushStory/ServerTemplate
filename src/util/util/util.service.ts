import {Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilService {
  constructor() {}

  // 영문자로 시작하는 영문자 또는 숫자 6~20자
  isId(value: string) {
    return /^[a-z]+[a-z0-9]{5,19}$/g.test(value);
  }

  // 8~16자 영문, 숫자, 특수문자를 최소 한가지씩 조합
  isPassword(value: string) {
    const regExp = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;

    return regExp.test(value);
  }

  // bcrypt: 단방향 암호화
  async bcryptHash(plainText: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(plainText, salt);
  }

  // bcrypt: 평문, 해시 일치하는지 비교
  async isBcryptHashValid(plainText: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hash);
  }
}
