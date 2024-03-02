<template>
    <div>
        <van-form @submit="onSubmit" v-if="login_type == '100'">
            <van-field v-model="username" name="username" label="用户名" placeholder="用户名/邮箱/手机号"
                :rules="[{ required: true, message: '请填写用户名' }]" />
            <van-field v-model="password" type="password" name="password" label="密码" placeholder="密码"
                :rules="[{ required: true, message: '请填写密码' }]" />
            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">提交</van-button>
            </div>
        </van-form>

        <!-- 邮箱验证登录 -->
        <van-form @submit="onVerificationLogin" v-if="login_type == '102'">
            <van-field v-model="email" name="email" label="邮箱" placeholder="邮箱"
                :rules="[{ required: true, message: '请填写邮箱' }]" />
            <van-row>
                <van-col span="16">
                    <van-field v-model="verification_code" name="verification_code" label="验证码" placeholder="验证码"
                        :rules="[{ required: true, message: '请填写验证码' }]" />
                </van-col>
                <van-col span="8">
                    <van-button v-if= "!button_disabled" type="primary" @click="sendVerificationCode" native-type="button">发送验证码</van-button>
                    <van-button v-else type="primary" @click="sendVerificationCode" native-type="button" disabled>{{count}}s后重发验证码</van-button>

                </van-col>
            </van-row>
            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">提交</van-button>
            </div>
        </van-form>

        <van-button type="primary" size="mini" v-if="login_type != '100'" @click="loginWithPassword">密码登录</van-button>
        <van-button type="primary" size="mini" v-if="login_type != '102'" @click = "loginWithEmail">邮箱验证码注册/登录</van-button>
        <van-button type="primary" size="mini">Google登录</van-button>
    </div>
</template>

<script>
import { Notify } from 'vant'
import HTTP from '../utils/http'
export default {
    name: "LoginView",
    components: {
    },
    data() {
        return {
            button_disabled: false,
            count: 180,
            username: '',
            password: '',
            email: '',
            verification_code: '',
            login_type: '100'
        }
    },
    created() {

    },
    methods: {
        async onVerificationLogin(values) {
            let res = await HTTP.request({
                url: '/user/login',
                method: 'post',
                data: {
                    account: values.email,
                    password: values.verification_code,
                    type: '102'
                }
            })
            
            
            if(res.code == 0) {
                localStorage.setItem('token', res.data.token)
                this.$router.push('/info')
            }
        },
        loginWithPassword() {
            this.login_type = '100'
        },
        loginWithEmail() {
            this.login_type = '102'
        },
        async sendVerificationCode() {
            let res = await HTTP.request({
                url: '/user/send_email_code',
                method: 'post',
                data: {
                    email_address: this.email
                }
            })
            this.button_disabled = true
            this.timer = setInterval(() => {
                this.count--
                if (this.count <= 0) {
                    clearInterval(this.timer)
                    this.count = 180
                    this.button_disabled = false
                }
            }, 1000)
            if(res.code == 0) {
                Notify({ type: 'success', message: '验证码发送成功' })
            }
        },

        async onSubmit(values) {
            let res = await HTTP.request({
                url: '/user/login',
                method: 'post',
                data: {
                    account: values.username,
                    password: values.password,
                    type: this.login_type
                }
            })
            localStorage.setItem('token', res.data.token)
            this.$router.push('/info')
        }
    }
}
</script>