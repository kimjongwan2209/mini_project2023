import * as bcrypt from "bcrypt";

//유저 아이디 검증
export function checked_user_id(name) {
  const create_user_id = /^[A-Za-z0-9]{8,12}$/;

  if (!create_user_id.test(name)) {
    return false;
  }
  if (name.match(/\s/g) !== null) {
    return false;
  }
}

//유저 패스워드 검증
export async function checked_user_password(pwd) {
  const create_user_pass =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,16}$/;

  if (!create_user_pass.test(pwd)) {
    return false;
  }
  if (pwd.match(/\s/g) !== null) {
    return false;
  }

  const hashedPassword = await bcrypt.hash(pwd, 10);
  return hashedPassword;
}

//유저 전화번호 검증
export function checked_user_phone(phone) {
  const create_user_phone = /^(01[016789]{1})[0-9]{3,4}[0-9]{4}$/;

  if (!create_user_phone.test(phone)) {
    return false;
  }
  if (phone.match(/\s/g) !== null) {
    return false;
  }
}

//유저 주민등록번호 검증

export function checked_user_personal(personal) {
  if (!personal.includes("-")) {
    return false;
  }
  // 주민번호 숫자갯수가 맞지 않았을 경우 검증 로직
  const parts = personal.split("-");
  if (parts.length !== 2 || parts[0].length !== 6 || parts[1].length !== 7) {
    return false;
  }
  //최종 출력 로직
  const masked = parts[1].substr(0, 1) + "******";
  return masked;
}
