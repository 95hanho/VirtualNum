import axios from "axios";
import VueCookies from "vue-cookies";
import { store } from "@/store/store";
import router from "@/router";

// 요청 전 처리
axios.interceptors.request.use(
  async (config) => {
    //console.log(config);
    //console.log(config.url.replace('http://203.240.244.25:8090/','').replace('&responseType=json',''));
    // **** Test Ibiz API ****
    config.url = "http://203.240.244.25:8090" + config.url;
    //console.log(store.state.login.sequence);
    //console.log(config.data);
    /*
    ※ config 설정(요청 떄 보내는 모든 것)
    */
    config.timeout = 60000; // 요청시간 1분이상은 실패

    // 로그인 일때를 제외
    if (
      !config.url.includes("encrypt/state") &&
      !config.url.includes("user/login") &&
      !config.url.includes("sequence/select") &&
      !config.url.includes("upload/ment")
    ) {
      // aes 확인 => on 일 시 data를 aes128암호화
      const aesOn = VueCookies.get("aesOn");
      if (aesOn == "on") {
        await store.dispatch("aes128", config.data).then((res) => {
          config.data = res;
        });
      }
      // 요청이 있을 때 마다 쿠키 refresh
      if (
        VueCookies.get("loginMarker") !== null &&
        VueCookies.get("userId") !== null &&
        VueCookies.get("url") !== null &&
        VueCookies.get("clientCode") !== null
      ) {
        store.commit("refreshMarker");
      }

      // 쿠키 없으면 로그아웃
      if (VueCookies.get("loginMarker") === null) {
        alert("로그인마커 정보가 없어요.");
        store.commit("removeMarker");
        router.push("/");
        return Promise.reject();
      } else if (VueCookies.get("userId") === null) {
        alert("유저아이디 정보가 없어요.");
        store.commit("removeMarker");
        router.push("/");
        return Promise.reject();
      } else if (VueCookies.get("url") === null) {
        alert("유저아이디 정보가 없어요.");
        store.commit("removeMarker");
        router.push("/");
        return Promise.reject();
      } else if (VueCookies.get("clientCode") === null) {
        alert("ClientCode 정보가 없어요.");
        store.commit("removeMarker");
        router.push("/");
        return Promise.reject();
      }
    }

    return config;
  },
  (error) => {
    console.log("axios request error : ", error);
    return Promise.reject(error);
  }
);

// 요청 후 처리
axios.interceptors.response.use(
  async (response) => {
    // response에는 요청 때 보낸 config와 결과데이터, 결과정보가 담겨있음
    //console.log(response);

    return response;
  },
  (error) => {
    console.log("axios response error : ", error);
    return Promise.reject(error);
  }
);

export default axios;
