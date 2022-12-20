# VirtualNum
가상 번호 조회 웹
![image](https://user-images.githubusercontent.com/64001275/208710682-208f389d-d6e4-48a6-aac2-508b4ada0239.png)

## 컴포넌트 설명

> HeadMenu.vue : 헤더
> 
> LoginView.vue : 로그인
> 
> MainView.vue : 메인페이지
> 
>> MentInput.vue : 멘트 등록
>> 
>> MentList.vue : 멘트 조회
>> 
>>> MentUnit.vue : 멘트 리스트
>>> 
>> ScheduleInput.vue : 스케줄 등록
>> 
>> ScheduleList.vue : 스케줄 조회
>> 
>>> ScheduleUnit.vue : 스케줄 리스트
>>> 
>> CalledInput.vue : 번호 등록
>> 
>> CalledList.vue : 번호 조회
>> 
>>> CalledUnit.vue : 번호 리스트
>>> 
>> VnsInput.vue : 가상번호 등록
>> 
>> VnsList.vue : 가상번호 조회
>> 
>>> VnsUnit.vue : 가상번호 리스트
>>> 
>> Set.vue : 설정 페이지
>> 
>>> SetList.vue : 등록된 설정 조회
>>> 
>>>> SetUnit.vue : 설정 리스트
>>>> 
>>> SetCalled.vue : 등록할 번호 조회
>>> 
>>>> SetCalledUnit.vue
>>>> 
>>> SetMent.vue : 등록할 멘트 조회
>>> 
>>>> SetMentUnit.vue
>>>> 
>>> SetSchedule.vue : 등록할 스케줄 조회
>>>> SetScheduleUnit.vue
>>>> 
>>> SetVns.vue : 등록할 가상번호 조회
>>> 
>>>> SetVnsUnit.vue
>>>> 
> UserView.vue : 유저관리 페이지
> 
>> UserInfo.vue : 로그인유저 정보 보여줌
>> 
>> UserInput : 유저 등록

## 주요 기능 디렉토리
- 로그인 시 암호화 확인 후 암호화 시 암호화표시 쿠키 생성
https://github.com/95hanho/VirtualNum/blob/c5561b178c1f215b311650fc79233b24c02fa8dc/frontend/src/components/LoginView.vue#L122
- 암호화 vuex aes128 암호화
https://github.com/95hanho/VirtualNum/blob/c5561b178c1f215b311650fc79233b24c02fa8dc/frontend/src/store/module/login.js#L50
- 데이터 요청이 있을 시 암호화서버일 때 파라미터 암호화
https://github.com/95hanho/VirtualNum/blob/c5561b178c1f215b311650fc79233b24c02fa8dc/frontend/src/axios/axios.js#L25
- 데이터 버스를 이용하여 등록할 객체데이터 가져오기
https://github.com/95hanho/VirtualNum/blob/c5561b178c1f215b311650fc79233b24c02fa8dc/frontend/src/components/Set.vue#L189
