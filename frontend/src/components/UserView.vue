<template>
    <div class="userView">
        <div class="main-container" id="main-container">
            <div class="main-container-inner">
                <div class="sidebar" id="sidebar">
                    <ul class="nav nav-list" id="naviSubMenu">
                        <li :id="pickId1">
                            <a @click="menuPick(1)">
                                <i class="icon-user"></i>
                                <span class="menu-text">내 정보</span>
                            </a>
                        </li>
                        <li :id="pickId2">
                            <a @click="menuPick(2)">
                                <i class="icon-cog"></i>
                                <span class="menu-text">유저 등록</span>
                            </a>
                        </li>
                    </ul>
                </div>

                <UserInfo v-if="pick1"/>

                <UserInput v-if="pick2"/>
                
                
            </div>
        </div>
    </div>
</template>

<script>
import UserInfo from '@/components/UserInfo'
import UserInput from '@/components/UserInput'

export default {
    data(){
        return{
            pick1:true,
            pickId1:"selectList",
            pick2:false,
            pickId2:"",
        }
    },
    components:{
        UserInfo,
        UserInput
    },
    created(){
    },
    methods:{
        menuPick(pickNum){
            this.pick1 = false;
            this.pickId1 = "";
            this.pick2 = false;
            this.pickId2 = "";

            switch(pickNum){
                case 1:
                    this.pick1 = true;
                    this.pickId1 = "selectList";
                    break;
                case 2:
                    this.pick2 = true;
                    this.pickId2 = "selectList";
                    break;
            }
        }
    }
}
</script>

<style scoped>
#naviSubMenu>li{
    width:100%;
}
#selectList{
    border: 0.1px solid;
    border-color: #438eb9;
}
</style>
