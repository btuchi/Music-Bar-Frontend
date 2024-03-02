<template>
    <div>
        <van-cell-group>
            <van-field v-model="value" label="搜索商品" placeholder="请输入商品名称" @input="onSearchNameChange" />
        </van-cell-group>
        <van-col span="4">
            <van-sidebar v-model="activeKey" @change="onChange">
                <van-sidebar-item v-for="(tag, index) in commodity_tags" :key="index" :title="tag" />
            </van-sidebar>
        </van-col>
        <van-col span="18">
            <van-card v-for="(commodity, index) in commodities" :key="index" num="1"
                :price="commodity.commodity_unit_price / 100 + '/' + commodity.commodity_unit"
                :desc="'月售' + commodity.commodity_sales + '份'" :title="commodity.commodity_name"
                :thumb="commodity.commodity_image">
                <template #tags>
                    <van-tag plain v-for="(tag, index) in commodity.commodity_tag.split(',')" :key="index">{{ tag
                    }}</van-tag>
                </template>

                <template #footer>
                    <van-button v-if="commodity.buy_num == 0" @click="addCommodity(commodity)"> 添加商品 </van-button>
                    <van-stepper v-if="commodity.buy_num != 0" v-model="commodity.buy_num" :min="0"
                        @change="onChange2(commodity)" />

                </template>
            </van-card>
        </van-col>

        <van-submit-bar :price='total_price' button-text="提交订单" @submit="onSubmit">
            共{{ total_count }}件商品
        </van-submit-bar>

    </div>
</template>
  
<script>
import HTTP from '../utils/http'
import { Notify } from 'vant'


export default {
    name: 'OrderView',
    components: {
    },
    data() {
        return {
            commodity_tags: [],
            activeKey: "",
            commodities: [],
            value: "",
            total_price: 0,
            total_count: 0
        }
    },
    async created() {
        await this.getTotalCommodityType()
        await this.getCommodity()
    },

    methods: {
        onChange2(commodity) {
            // 更新local storage
            this.modifyBuyCommodity(commodity, commodity.buy_num)
        },
        addCommodity(commodity) {
            // 点第一次的效果
            commodity.buy_num = 1
            this.modifyBuyCommodity(commodity, 1)
        },

        onSearchNameChange(value) {
            this.value = value
            this.getCommodity()
        },
        async getTotalCommodityType() {
            let branch_id = JSON.parse(localStorage.getItem('branch_id')).branch_id
            let res = await HTTP.request({
                url: '/commodity/type_list',
                method: 'get',
                params: {
                    branch_id: branch_id
                }
            })
            this.commodity_tags = res.data
            this.activeKey = 0
        },

        async getCommodity() {
            let branch_id = JSON.parse(localStorage.getItem('branch_id')).branch_id
            let res = await HTTP.request({
                url: '/commodity/list',
                method: 'get',
                params: {
                    branch_id: branch_id,
                    tag: this.commodity_tags[this.activeKey],
                    commodity_name: this.value
                }
            })
            let shoppingCart = localStorage.getItem('shopping_cart')
            if (shoppingCart == null) {
                shoppingCart = {}
            } else {
                shoppingCart = JSON.parse(shoppingCart)
            }
            for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].commodity_id in shoppingCart) {
                    res.data[i].buy_num = shoppingCart[res.data[i].commodity_id]
                } else {
                    res.data[i].buy_num = 0
                }
            }
            let PriceMap = localStorage.getItem('price_map')
            if (PriceMap == null) {
                PriceMap = {}
            } else {
                PriceMap = JSON.parse(PriceMap)
            }
            for (let i = 0; i < res.data.length; i++) {
                PriceMap[res.data[i].commodity_id] = res.data[i].commodity_unit_price
            }
            localStorage.setItem('price_map', JSON.stringify(PriceMap))
            this.calculateCountAndPrice()
            this.commodities = res.data
        },
        onChange(index) {
            this.activeKey
            this.getCommodity()
        },
        modifyBuyCommodity(commodity, num) {
            let shoppingCart = localStorage.getItem('shopping_cart')
            if (shoppingCart == null) {
                shoppingCart = {}
            } else {
                shoppingCart = JSON.parse(shoppingCart)
            }
            if (num == 0 && commodity.commodity_id in shoppingCart) {
                delete shoppingCart[commodity.commodity_id]
            } else {
                shoppingCart[commodity.commodity_id] = num
            }
            localStorage.setItem('shopping_cart', JSON.stringify(shoppingCart))
            this.calculateCountAndPrice()
        },
        calculateCountAndPrice() {
            let shoppingCart = localStorage.getItem('shopping_cart')
            if (shoppingCart == null) {
                shoppingCart = {}
            } else {
                shoppingCart = JSON.parse(shoppingCart)
            }
            let total_price = 0
            let total_count = 0
            let PriceMap = JSON.parse(localStorage.getItem('price_map'))
            for (let commodity_id in shoppingCart) {
                total_price += shoppingCart[commodity_id] * PriceMap[commodity_id]
                total_count += shoppingCart[commodity_id]
            }
            this.total_price = total_price
            this.total_count = total_count
        },
        onSubmit() {
            this.$router.push('/orderSubmit')
        }
    }
}
</script>
  