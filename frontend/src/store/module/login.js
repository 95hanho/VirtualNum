import axios from 'axios';
import Crypto from 'crypto';
import VueCookies from 'vue-cookies';
import EventBus from '@/eventBus/event-bus'

export const login = {
    state:{
        sequence: 0,
        sessionKey: null,
        message: null
    },
    mutations: {
        autoSequence(state) {
            state.sequence++    
        },
        aesOn(){
            VueCookies.set('aesOn', 'on', '1800s');
        },
        login(state, value){
            VueCookies.set('loginMarker', value.loginMarker, '1800s');
            VueCookies.set('userId', value.userId, '1800s');
            VueCookies.set('clientCode', value.clientCode, '1800s');
            VueCookies.set('url', 'Main', '1800s');
        },
        toUrl(state, value){
            VueCookies.set('url', value, '1800s');
        },
        refreshMarker(){
            VueCookies.set('loginMarker', VueCookies.get('loginMarker'), '1800s');
            VueCookies.set('userId', VueCookies.get('userId'), '1800s');
            VueCookies.set('clientCode', VueCookies.get('clientCode'), '1800s');
            VueCookies.set('url', VueCookies.get('url'), '1800s');
            if(VueCookies.get('aesOn')){
                VueCookies.set('aesOn', VueCookies.get('aesOn'), '1800s');
            }
        },
        removeMarker(){
            VueCookies.remove('loginMarker');
            VueCookies.remove('userId');
            VueCookies.remove('clientCode');
            VueCookies.remove('aesOn');
            VueCookies.remove('url');
            EventBus.$emit('login','');
        }
    },
    getters: {

    },
    actions: {
        aes128: (store, value) => {
            return new Promise((resolve, reject) => {
                //store.commit('autoSequence');
                const sequence = store.state.sequence;
                axios.get('/sequence/select?sequence='+ sequence +'&responseType=json')
                .then((res) => {
                    if(res.data.result.resultCode == '00'){
                        const sessionKey = res.data.session.sessionKey;

                        const aes_config = {
                            AES_MODE: 'AES-128-ECB',
                            ORIGIN_MODE: 'UTF-8',
                            PADDING_MODE: 'BASE64'
                        }

                        const cipher = Crypto.createCipheriv(aes_config.AES_MODE, sessionKey, '');
                        let encrypted = cipher.update(JSON.stringify(value), aes_config.ORIGIN_MODE, aes_config.PADDING_MODE);
                        encrypted += cipher.final(aes_config.PADDING_MODE);
                        let message = [];
                        message.push(encrypted);
                        resolve(message);
                    } else {
                        console.log('????')
                        alert(res.data.result.resultMessage);
                        reject(res.data.result.resultMessage);
                    }
                });
            })
        },
    }
}
