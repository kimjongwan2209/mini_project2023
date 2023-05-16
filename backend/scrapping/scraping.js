import axios from "axios";
import cheerio from "cheerio";

export async function createBoardAPI(mydata) {
  // 1. 입력된 컨텐츠에서 http로 시작하는 글자 있는지 찾기
  const myurl = mydata.split(" ").filter((el) => el.includes("http"))[0]; // https://daum.net
  const data = {};
  // 2. 만약 있다면, 찾은 주소로 axios.get 요청해서 html코드 받아오기 => 스크래핑
  const result = await axios.get(myurl);
  //   console.log(result.data);

  // 3. 스크래핑 결과에서 OG(오픈그래프) 코드 골라내서 변수에 저장하기
  const $ = cheerio.load(result.data);
  $("meta").each((_, el) => {
    if ($(el).attr("property")) {
      const key = $(el).attr("property").split(":")[1];
      const value = $(el).attr("content");
      data[key] = value;
    }
  });
  return data;
}
