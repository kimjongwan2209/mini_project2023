export function checked_user_id(name) {
  const create_user_id = /^[A-Za-z0-9]{8,12}$/;

  if (!create_user_id.test(name)) {
  } else return name;
}

export function checked_user_password(pwd) {
  const create_user_pass =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,16}$/;

  if (!create_user_pass.test(pwd)) {
    console.log("비밀번호 형식이 올바르지 않습니다.");
    return false;
  } else return checked_user_password;
}
