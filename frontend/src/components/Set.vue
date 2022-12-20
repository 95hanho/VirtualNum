<template>
  <div class="setInput">
    <div class="main-content">
      <div class="page-content" id="acsSetPageContent">
        <div class="row">
          <div class="widget-header widget-header-small">
            <h5 v-if="!updating && !prioritizing" class="lighter">
              IBIZ 설정 등록
            </h5>
            <h5
              v-if="updating && !prioritizing"
              class="lighter"
              style="color:red;"
            >
              IBIZ 설정(Idx={{ setIdx }}) 수정
            </h5>
            <h5 v-if="prioritizing" class="lighter" style="color:orange;">
              IBIZ 설정 우선순위 변경 중
            </h5>
          </div>
          <div class="widget-body">
            <div class="widget-main">
              <div class="row" style="height:70px;">
                <div class="input-group col-xs-3">
                  <label>설정 이름</label>
                  <div class="input-group bootstrap-timepicker">
                    <span class="input-group-addon">
                      <i class="icon-gear bigger-110"></i>
                    </span>
                    <input
                      class="form-control"
                      v-model="setName"
                      @keyup.enter="setInput"
                      ref="setNameRef"
                      :disabled="prioritizing"
                    />
                  </div>
                </div>
                <div class="input-group col-xs-3">
                  <label>설정 타입</label>
                  <div class="input-group bootstrap-timepicker">
                    <span class="input-group-addon">
                      <i class="icon-home bigger-110"></i>
                    </span>
                    <select
                      class="form-control"
                      v-model="setType"
                      :disabled="prioritizing"
                    >
                      <option value="1">호 연결</option>
                      <option value="2">호 종료</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="row" style="height:70px;">
                <div class="input-group col-xs-6">
                  <label>스케줄</label>
                  <div
                    class="input-group bootstrap-timepicker"
                    @click="showView(2)"
                  >
                    <span class="input-group-addon">
                      <i class="icon-time bigger-110"></i>
                    </span>
                    <input
                      class="form-control"
                      v-model="schedule"
                      style="cursor:pointer;"
                      disabled
                    />
                  </div>
                </div>
                <div class="input-group col-xs-6">
                  <label>VNS 번호</label>
                  <div
                    class="input-group bootstrap-timepicker"
                    @click="showView(3)"
                  >
                    <span class="input-group-addon">
                      <i class="icon-phone bigger-110"></i>
                    </span>
                    <input
                      class="form-control"
                      v-model="vns"
                      style="cursor:pointer;"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div class="row" style="height:90px;">
                <div class="input-group col-xs-6">
                  <label>착신 번호</label>
                  <div
                    class="input-group bootstrap-timepicker"
                    @click="showView(4)"
                  >
                    <span class="input-group-addon">
                      <i class="icon-phone bigger-110"></i>
                    </span>
                    <input
                      class="form-control"
                      v-model="called"
                      style="cursor:pointer;"
                      disabled
                    />
                  </div>
                </div>
                <div class="input-group col-xs-6">
                  <label>멘트</label>
                  <div
                    class="input-group bootstrap-timepicker"
                    @click="showView(5)"
                  >
                    <span class="input-group-addon">
                      <i class="icon-play-circle bigger-110"></i>
                    </span>
                    <input
                      class="form-control"
                      v-model="ment"
                      style="cursor:pointer;"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="input-group pull-left col-xs-3">
                  <button
                    v-if="!prioritizing"
                    @click="showView(1)"
                    class="btn btn-primary btn-sm callDiv"
                    style="margin-left:5px;"
                  >
                    설정 조회<i
                      class="icon-search icon-on-right bigger-110"
                    ></i>
                  </button>
                  <button
                    v-if="setView && !prioritizing && !updating"
                    @click="prioritize"
                    class="btn btn-info btn-sm callDiv"
                    style="margin-left:5px;width:50%;"
                  >
                    WEIGHT 변경<i
                      class="icon-rotate-right icon-on-right bigger-110"
                    ></i>
                  </button>
                </div>
                <div class="input-group pull-right col-xs-3">
                  <div class="input-group" id="inputBtn">
                    <button
                      v-if="!updating && !prioritizing"
                      @click="formReset"
                      class="btn btn-primary btn-sm callDiv"
                      style="margin-left:5px;"
                    >
                      리셋<i class="icon-download icon-on-right bigger-110"></i>
                    </button>
                    <button
                      v-if="!updating && !prioritizing"
                      @click="setInput"
                      class="btn btn-success btn-sm callDiv"
                    >
                      입력<i class="icon-magic icon-on-right bigger-110"></i>
                    </button>

                    <button
                      v-if="updating && !prioritizing"
                      @click="updateCancel"
                      class="btn btn-danger btn-sm callDiv"
                      style="margin-left:5px;"
                    >
                      취소<i class="icon-download icon-on-right bigger-110"></i>
                    </button>
                    <button
                      v-if="updating && !prioritizing"
                      @click="updateSet"
                      class="btn btn-warning btn-sm callDiv"
                    >
                      수정<i class="icon-magic icon-on-right bigger-110"></i>
                    </button>

                    <button
                      v-if="prioritizing"
                      @click="prioritizeCancel"
                      class="btn btn-danger btn-sm callDiv"
                      style="margin-left:5px;"
                    >
                      그만하기<i
                        class="icon-download icon-on-right bigger-110"
                      ></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <SetList
      v-show="setView"
      :setObject="setObject"
      :updateSetIdx="setIdx"
      @setUpdateForm="setUpdateForm"
    />
    <SetSchedule v-show="scheduleView" :scheduleObject="scheduleObject" />
    <SetVns v-show="vnsView" :vnsNumberObject="vnsNumberObject" />
    <SetCalled v-show="calledView" :calledNumberObject="calledNumberObject" />
    <SetMent v-show="mentView" :mentObject="mentObject" />
  </div>
</template>

<script>
import EventBus from "@/eventBus/event-bus";

import SetList from "@/components/SetList";
import SetSchedule from "@/components/SetSchedule";
import SetVns from "@/components/SetVns";
import SetCalled from "@/components/SetCalled";
import SetMent from "@/components/SetMent";

export default {
  data() {
    return {
      // 우선순위 변경 중
      prioritizing: false,
      // 업데이트 중 인지
      updating: false,
      setIdx: "",
      // 입력값
      setName: "",
      setType: "1",
      schedule: "클릭하여 스케줄을 선택해주세요.",
      scheduleData: "",
      vns: "클릭하여 050번호를 선택해주세요.",
      vnsData: "",
      called: "클릭하여 착신번호를 선택해주세요.",
      callNameList: [],
      callData: [],
      ment: "클릭하여 멘트를 선택해주세요.",
      mentData: [],
      // 조회를 위한
      setObject: {
        setList: [],
        zeroList: false,
      },
      scheduleObject: {
        scheduleList: [],
        zeroList: false,
      },
      vnsNumberObject: {
        vnsNumberList: [],
        zeroList: false,
      },
      calledNumberObject: {
        calledNumberList: [],
        zeroList: false,
      },
      mentObject: {
        mentList: [],
        zeroList: false,
      },
      // 보여줄 조회 화면
      setView: true,
      scheduleView: false,
      vnsView: false,
      calledView: false,
      mentView: false,
    };
  },
  components: {
    SetList,
    SetSchedule,
    SetVns,
    SetCalled,
    SetMent,
  },
  created() {
    this.allselect();
    // 이벤트버스 요청올 때 작동
    // 스케줄 선택
    EventBus.$on("pickSchedule", (scheduleIdx, scheduleName) => {
      if (this.schedule == scheduleName) {
        this.schedule = "클릭하여 스케줄을 선택해주세요.";
        this.scheduleData = "";
      } else {
        this.schedule = scheduleName;
        this.scheduleData = scheduleIdx;
      }
    });
    // 050번호 선택
    EventBus.$on("pickVnsNumber", (vnsIdx, vnsNumber) => {
      if (this.vns == vnsNumber) {
        this.vns = "클릭하여 050번호를 선택해주세요.";
        this.vnsData = "";
      } else {
        this.vns = vnsNumber;
        this.vnsData = vnsIdx;
      }
    });
    // 착신번호 선택
    EventBus.$on("pickcalledNumber", (calledIdx, calledNumber) => {
      var exist = false;
      for (let key in this.callData) {
        if (this.callData[key] == calledIdx) {
          exist = true;
          this.callData.splice(key, 1);
          this.callNameList.splice(key, 1);
        }
      }
      if (!exist) {
        this.callData.push(calledIdx);
        this.callNameList.push(calledNumber);
      }

      if (this.callNameList.length == 0) {
        this.called = "클릭하여 착신번호를 선택해주세요.";
      } else {
        this.called = this.callNameList[0];
        for (let key in this.callNameList) {
          if (key > 0) {
            this.called += ", " + this.callNameList[key];
          }
        }
      }
    });
    // 멘트 선택
    EventBus.$on("pickMent", (pickList) => {
      this.mentData = pickList;
      this.ment = "";
      if (pickList.length == 0) {
        this.ment = "클릭하여 멘트를 선택해주세요.";
      } else {
        this.ment =
          "[" + pickList[0].mentName + ", " + pickList[0].type + "타입]";
        for (let key in pickList) {
          if (key > 0) {
            this.ment +=
              ", [" +
              pickList[key].mentName +
              ", " +
              pickList[key].type +
              "타입]";
          }
        }
      }
    });

    // 설정 삭제
    EventBus.$on("deleteSet", () => {
      this.updating = false;
      this.formReset();
      this.setSelect();
    });
  },
  beforeDestroy() {
    EventBus.$off("pickSchedule");
    EventBus.$off("pickVnsNumber");
    EventBus.$off("pickcalledNumber");
    EventBus.$off("pickMent");
    EventBus.$off("deleteSet");
  },
  methods: {
    async allselect() {
      let message = {
        userId: this.$cookies.get("userId"),
        loginMarker: this.$cookies.get("loginMarker"),
        clientCode: this.$cookies.get("clientCode"),
        clientCodeType: "1",
      };

      // 설정 조회
      this.$store.commit("autoSequence");
      let sequence = this.$store.state.login.sequence;
      await this.$http
        .post(
          "/set/select?sequence=" + sequence + "&responseType=json",
          message
        )
        .then((res) => {
          if (res.data.result.resultCode == "00") {
            if (res.data.setList.length == 0) {
              this.setObject.zeroList = true;
            } else {
              this.setObject.zeroList = false;
              this.setObject.setList = res.data.setList;
            }
          } else {
            alert(res.data.result.resultMessage);
          }
        });

      // 스케줄 조회
      this.$store.commit("autoSequence");
      sequence = this.$store.state.login.sequence;
      await this.$http
        .post(
          "/schedule/select?sequence=" + sequence + "&responseType=json",
          message
        )
        .then((res) => {
          if (res.data.result.resultCode == "00") {
            if (res.data.scheduleList.length == 0) {
              this.scheduleObject.zeroList = true;
            } else {
              this.scheduleObject.zeroList = false;
              this.scheduleObject.scheduleList = res.data.scheduleList;
            }
          } else {
            alert(res.data.result.resultMessage);
          }
        });

      // 050번호 조회
      this.$store.commit("autoSequence");
      sequence = this.$store.state.login.sequence;
      await this.$http
        .post(
          "/number/ibiz/vns/select?sequence=" + sequence + "&responseType=json",
          message
        )
        .then((res) => {
          if (res.data.result.resultCode == "00") {
            if (res.data.vnsNumberList.length == 0) {
              this.vnsNumberObject.zeroList = true;
            } else {
              this.vnsNumberObject.zeroList = false;
              this.vnsNumberObject.vnsNumberList = res.data.vnsNumberList;
            }
          } else {
            alert(res.data.result.resultMessage);
          }
        });

      // 착신번호 조회
      this.$store.commit("autoSequence");
      sequence = this.$store.state.login.sequence;
      await this.$http
        .post(
          "/number/ibiz/called/select?sequence=" +
            sequence +
            "&responseType=json",
          message
        )
        .then((res) => {
          if (res.data.result.resultCode == "00") {
            if (res.data.calledNumberList.length == 0) {
              this.calledNumberObject.zeroList = true;
            } else {
              this.calledNumberObject.zeroList = false;
              this.calledNumberObject.calledNumberList =
                res.data.calledNumberList;
            }
          } else {
            alert(res.data.result.resultMessage);
          }
        });

      // 멘트 조회
      this.$store.commit("autoSequence");
      sequence = this.$store.state.login.sequence;
      await this.$http
        .post(
          "/ment/select?sequence=" + sequence + "&responseType=json",
          message
        )
        .then((res) => {
          if (res.data.result.resultCode == "00") {
            if (res.data.mentList.length == 0) {
              this.mentObject.zeroList = true;
            } else {
              this.mentObject.zeroList = false;
              this.mentObject.mentList = res.data.mentList;
            }
          } else {
            alert(res.data.result.resultMessage);
          }
        });
    },
    setSelect() {
      let message = {
        userId: this.$cookies.get("userId"),
        loginMarker: this.$cookies.get("loginMarker"),
        clientCode: this.$cookies.get("clientCode"),
        clientCodeType: "1",
      };

      this.$store.commit("autoSequence");
      const sequence = this.$store.state.login.sequence;
      this.$http
        .post(
          "/set/select?sequence=" + sequence + "&responseType=json",
          message
        )
        .then((res) => {
          if (res.data.result.resultCode == "00") {
            if (res.data.setList.length == 0) {
              this.setObject.zeroList = true;
            } else {
              this.setObject.zeroList = false;
              this.setObject.setList = res.data.setList;
            }
          } else {
            alert(res.data.result.resultMessage);
          }
        });
    },
    setInput() {
      if (this.setName.length == 0) {
        alert("설정 이름을 입력해주세요.");
        this.$refs.setNameRef.focus();
      } else if (this.scheduleData.length == 0) {
        alert("스케줄을 선택해주세요.");
        this.showView(2);
      } else if (this.vnsData.length == 0) {
        alert("050번호를 선택해주세요.");
        this.showView(3);
      } else {
        let calledNumberSetList = [];
        for (let key in this.callData) {
          let calledNumberSet = {
            calledIdx: this.callData[key],
          };
          calledNumberSetList.push(calledNumberSet);
        }
        if (this.setType == 1 && calledNumberSetList.length == 0) {
          alert("호 연결 타입일 시 착신번호를 필수적으로 선택해주세요.");
          this.showView(4);
          return;
        }
        let mentSetList = [];
        for (let key in this.mentData) {
          let mentSet = {
            mentIdx: this.mentData[key].idx,
            mentType: this.mentData[key].type,
          };
          mentSetList.push(mentSet);
        }
        if (this.setType == 2 && mentSetList.length == 0) {
          alert("호 종료 타입일 시 멘트를 필수적으로 선택해주세요.");
          this.showView(5);
          return;
        }

        const message = {
          userId: this.$cookies.get("userId"),
          loginMarker: this.$cookies.get("loginMarker"),
          clientCode: this.$cookies.get("clientCode"),
          clientCodeType: "1",
          setName: encodeURIComponent(this.setName),
          setType: this.setType,
          scheduleSetIdx: this.scheduleData,
          vnsNumberSetIdx: this.vnsData,
          calledNumberSetList: calledNumberSetList,
          mentSetList: mentSetList,
        };

        // 설정 등록
        this.$store.commit("autoSequence");
        const sequence = this.$store.state.login.sequence;
        this.$http
          .post(
            "/set/insert?sequence=" + sequence + "&responseType=json",
            message
          )
          .then((res2) => {
            if (res2.data.result.resultCode == "00") {
              alert(res2.data.result.resultMessage);
              this.setSelect();
              this.formReset();
              this.showView(1);
            } else {
              alert(res2.data.result.resultMessage);
            }
          });
      }
    },
    formReset() {
      this.setIdx = "";
      this.setName = "";
      this.setType = "1";
      this.schedule = "클릭하여 스케줄을 선택해주세요.";
      this.scheduleData = "";
      this.vns = "클릭하여 050번호를 선택해주세요.";
      this.vnsData = "";
      this.called = "클릭하여 착신번호를 선택해주세요.";
      this.callNameList = [];
      this.callData = [];
      this.ment = "클릭하여 멘트를 선택해주세요.";
      this.mentData = [];
      this.showView(1);
      // 스케줄 리셋
      EventBus.$emit("ScheduleReset");
      // 050번호 리셋
      EventBus.$emit("VnsNumberReset");
      // 착신번호 리셋
      EventBus.$emit("CalledNumberReset");
      // 멘트 리셋
      EventBus.$emit("MentReset");
    },
    showView(value) {
      if (this.prioritizing) {
        return;
      }
      this.setView = false;
      this.scheduleView = false;
      this.vnsView = false;
      this.calledView = false;
      this.mentView = false;
      if (value == 1) {
        this.setView = true;
      } else if (value == 2) {
        this.scheduleView = true;
      } else if (value == 3) {
        this.vnsView = true;
      } else if (value == 4) {
        this.calledView = true;
      } else if (value == 5) {
        this.mentView = true;
      }
    },
    updateCancel() {
      this.updating = false;
      this.formReset();
    },
    // 수정ing 요청
    async setUpdateForm(set) {
      this.updating = true;
      this.formReset();
      this.setIdx = set.setIdx;
      this.setName = set.setName;
      this.setType = set.setType;

      // 이벤트 버스 요청
      // 스케줄 불러오기
      EventBus.$emit("updatingSetSchedule", set.schedule.scheduleIdx);
      // 050번호 불러오기
      EventBus.$emit("updatingVnsNumber", set.vnsNumber.vnsIdx);
      // 착신번호 불러오기
      EventBus.$emit("updatingCalledNumber", set.calledNumberList);
      // 멘트 불러오기
      await EventBus.$emit("MentReset");
      await EventBus.$emit("updatingMent", set.mentList);
    },
    updateSet() {
      if (this.setName.length == 0) {
        alert("설정 이름을 입력해주세요.");
        this.$refs.setNameRef.focus();
      } else if (this.scheduleData.length == 0) {
        alert("스케줄을 선택해주세요.");
        this.showView(2);
      } else if (this.vnsData.length == 0) {
        alert("050번호를 선택해주세요.");
        this.showView(3);
      } else {
        let calledNumberSetList = [];
        for (let key in this.callData) {
          let calledNumberSet = {
            calledIdx: this.callData[key],
          };
          calledNumberSetList.push(calledNumberSet);
        }
        if (this.setType == 1 && calledNumberSetList.length == 0) {
          alert("호 연결 타입일 시 착신번호를 필수적으로 선택해주세요.");
          this.showView(4);
          return;
        }
        let mentSetList = [];
        for (let key in this.mentData) {
          let mentSet = {
            mentIdx: this.mentData[key].idx,
            mentType: this.mentData[key].type,
          };
          mentSetList.push(mentSet);
        }
        if (this.setType == 2 && mentSetList.length == 0) {
          alert("호 종료 타입일 시 멘트를 필수적으로 선택해주세요.");
          this.showView(5);
          return;
        }

        const message = {
          userId: this.$cookies.get("userId"),
          loginMarker: this.$cookies.get("loginMarker"),
          clientCode: this.$cookies.get("clientCode"),
          clientCodeType: "1",
          setIdx: this.setIdx,
          setName: encodeURIComponent(this.setName),
          setType: this.setType,
          scheduleSetIdx: this.scheduleData,
          vnsNumberSetIdx: this.vnsData,
          calledNumberSetList: calledNumberSetList,
          mentSetList: mentSetList,
        };

        // 설정 수정
        this.$store.commit("autoSequence");
        const sequence = this.$store.state.login.sequence;
        this.$http
          .post(
            "/set/update?sequence=" + sequence + "&responseType=json",
            message
          )
          .then((res2) => {
            if (res2.data.result.resultCode == "00") {
              alert(res2.data.result.resultMessage);
              this.updating = false;
              this.setSelect();
              this.formReset();
              this.showView(1);
            } else {
              alert(res2.data.result.resultMessage);
            }
          });
      }
    },
    prioritize() {
      this.prioritizing = true;
      // 이벤트 버스 요청 우선순위 변경ing
      EventBus.$emit("prioritize");
    },
    prioritizeCancel() {
      this.prioritizing = false;
      this.setSelect();
      // 이벤트 버스 요청 우선순위 변경취소
      EventBus.$emit("prioritizeCancel");
    },
  },
};
</script>

<style scoped>
input[disabled] {
  background-color: beige;
}
</style>
