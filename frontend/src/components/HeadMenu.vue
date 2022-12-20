<template>
    <div class="headmenu">
        <div v-if="!login"></div>
        <div v-if="login" class="navbar navbar-default" id="navbar">
            <div class="navbar-container" id="navbar-container">
                <div class="navbar-header pull-left" id="commonHeaderMenu">
                    <a class="navbar-brand" @click="toUrl('Main')">
                        <small v-if="!menuColor">
                            <i class="icon-bar-chart"></i>
                            IBIZ 설정
                        </small>
                        <small v-if="menuColor" style="color:yellow;">
                            <i class="icon-bar-chart"></i>
                            IBIZ 설정
                        </small>
                    </a>
                    <a class="navbar-brand" @click="toUrl('User')">
                        <small v-if="menuColor">
                            <i class="icon-user-md"></i>
                            유저 관리
                        </small>
                        <small v-if="!menuColor" style="color:yellow;">
                            <i class="icon-user-md"></i>
                            유저 관리
                        </small>
                    </a>
                </div>

                
                <div class="navbar-header pull-right" role="navigation">
                    <ul class="nav ace-nav">
                        <li class="light-blue">
                            <a @click="logout" style="cursor:pointer;">
                                <i class="icon-external-link"></i>
                                logout
                            </a>
                        </li>
                    </ul>
                </div>

                <div class="navbar-header pull-right" role="navigation">
                    <ul class="nav ace-nav">
                        <li style="margin-right:10px;color:white;">
                            {{ userId }} 님
                        </li>
                    </ul>
                </div>

                <div class="navbar-header pull-right" role="navigation">
                    <ul class="nav ace-nav">
                        <li class="light-orange" style="padding-right:10px;">
                            <i class="icon-user-md"></i>
                            <label id="userIdInMenu"></label>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    </div>
    
</template>

<script>
import EventBus from '@/eventBus/event-bus'

export default {
    props:[],
    data(){
        return{
            menuColor:true,
            login:false,
            userId:"",
            url:"",
        }
    },
    created(){
        this.url = this.$cookies.get('url');
        this.userId = this.$cookies.get('userId');
        EventBus.$on('login', () => {
            this.userId = this.$cookies.get('userId');
            this.url = this.$cookies.get('url');
        });
    },
    beforeDestroy(){
        EventBus.$off('login');
    },
    methods:{
        logout(){
            this.$store.commit('removeMarker');
            this.$router.push({name: 'Login'}).catch(() => {});
        },
        toUrl(value){
            this.$store.commit('toUrl', value);
            if(value == 'Main'){
                this.menuColor = true;
            } else if(value == 'User'){
                this.menuColor = false;
            }
            this.$router.push({name: value}).catch(() => {});
        },
        async urlObserve(){
            if(this.url){
                this.login = true;
                
            } else {
                this.login = false;
            }
            if(this.url == 'Main'){
                this.menuColor = true;
            } else if(this.url == 'User'){
                this.menuColor = false;
            }
        }
    },
    watch:{
        url(){
            this.urlObserve();
        }
    }
}
</script>

<style scoped>
#commonHeaderMenu{
    line-height: 20px;
}
#navbar{
    display: block;
    padding: 0;
    height: 40px;
}
a{
    cursor: pointer;
}
small:hover{
    background: rgba(250, 237, 125, 0.2);
}
.headmenu{
    min-width: 1200px;
}
</style>
