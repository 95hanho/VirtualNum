<template>
    <div class="mainview">
        <div class="main-container" id="main-container">
            <div class="main-container-inner">
                <div class="sidebar" id="sidebar">
                    <ul class="nav nav-list" id="naviSubMenu">
                        <li :id="pickId1">
                            <a @click="menuPick(1)">
                                <i class="icon-cog"></i>
                                <span class="menu-text">IBIZ 설정</span>
                            </a>
                        </li>
                        <li :id="pickId2">
                            <a @click="menuPick(2)">
                                <i class="icon-phone"></i>
                                <span class="menu-text">VNS 번호</span>
                            </a>
                        </li>
                        <li :id="pickId3">
                            <a @click="menuPick(3)">
                                <i class="icon-phone"></i>
                                <span class="menu-text">착신번호</span>
                            </a>
                        </li>
                        <li :id="pickId4">
                            <a @click="menuPick(4)">
                                <i class="icon-time"></i>
                                <span class="menu-text">스케줄</span>
                            </a>
                        </li>
                        <li :id="pickId5">
                            <a @click="menuPick(5)">
                                <i class="icon-upload"></i>
                                <span class="menu-text">멘트</span>
                            </a>
                        </li>
                    </ul>
                </div>

                <Set v-if="pick1"/>

                <VnsInput v-if="pick2"/>
                <VnsList v-if="pick2"/>

                <CalledInput v-if="pick3"/>
                <CalledList v-if="pick3"/>

                <ScheduleInput v-if="pick4"/>
                <ScheduleList v-if="pick4"/>

                <MentInput v-if="pick5"/>
                <MentList v-if="pick5"/>
                
            </div>
        </div>
    </div>    
</template>

<script>
import VnsInput from '@/components/VnsInput'
import VnsList from '@/components/VnsList'
import CalledInput from '@/components/CalledInput'
import CalledList from '@/components/CalledList'
import ScheduleInput from '@/components/ScheduleInput'
import ScheduleList from '@/components/ScheduleList'
import MentInput from '@/components/MentInput'
import MentList from '@/components/MentList'
import Set from '@/components/Set'


export default {
    data(){
        return{
            pick1:true,
            pickId1:"selectList",
            pick2:false,
            pickId2:"",
            pick3:false,
            pickId3:"",
            pick4:false,
            pickId4:"",
            pick5:false,
            pickId5:"",
        }
    },
    components:{
        VnsInput,
        VnsList,
        CalledInput,
        CalledList,
        ScheduleInput,
        ScheduleList,
        MentInput,
        MentList,
        Set
    },
    created(){
    },
    methods:{
        menuPick(pickNum){
            this.pick1 = false;
            this.pickId1 = "";
            this.pick2 = false;
            this.pickId2 = "";
            this.pick3 = false;
            this.pickId3 = "";
            this.pick4 = false;
            this.pickId4 = "";
            this.pick5 = false;
            this.pickId5 = "";
            
            switch(pickNum){
                case 1:
                    this.pick1 = true;
                    this.pickId1 = "selectList";
                    break;
                case 2:
                    this.pick2 = true;
                    this.pickId2 = "selectList";
                    break;
                case 3:
                    this.pick3 = true;
                    this.pickId3 = "selectList";
                    break;
                case 4:
                    this.pick4 = true;
                    this.pickId4 = "selectList";
                    break;
                case 5:
                    this.pick5 = true;
                    this.pickId5 = "selectList";
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