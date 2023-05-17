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
export function checked_user_password(pwd) {
  const create_user_pass =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,16}$/;

  if (!create_user_pass.test(pwd)) {
    return false;
  }
  if (pwd.match(/\s/g) !== null) {
    return false;
  }
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
