<template>
    <div>
        <van-card v-for="(commodity, index) in info_list" :key = "index" :num="commodity.commodity_count"
            :price="commodity.commodity_total_price/100"
            :thumb="commodity.commodity_image" 
            :title="commodity.commodity_name"
            >
        </van-card>
        <van-submit-bar :price='total_price' button-text="提交订单" @submit="onSubmit">
            共{{ total_count }}件商品
        </van-submit-bar>
    </div>
</template>
  
<script>
import HTTP from '../utils/http'
import { Notify } from 'vant'


export default {
    name: 'OrderSubmit',
    components: {
    },
    data() {
        return {
            info_list: [],
            total_price: 0,
            total_count: 0
        }
    },
    async created() {
        this.calculatePrice()
       
    },

    methods: {
        async calculatePrice(){
            let shopping_cart = JSON.parse(localStorage.getItem('shopping_cart'))
            let res = await HTTP.request({
                url: '/commodity/calculate_price',
                method: 'post',
                data: {
                    shopping_cart: shopping_cart
                }
            })
            console.log(res.data)
            this.info_list = res.data.info_list
            this.total_price = res.data.total_price
            this.total_count = res.data.total_count
        }
       
    }
}
</script>
  