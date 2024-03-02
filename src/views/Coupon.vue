<template>
    <el-container>
        <el-main>
            <div class="operation-container">
                <el-button type="primary" @click="openAddDrawer" plain>添加</el-button>
            </div>
            <div class="table-container">
                <el-table :data="tableData" style="width: 100%" height="95%">
                    <el-table-column prop="coupon_id" label="ID" width="60">
                    </el-table-column>

                    <el-table-column prop="coupon_name" label="优惠券名称" width="180">
                    </el-table-column>

                    <el-table-column prop="coupon_name" label="优惠券有效" width="300">
                        <template slot-scope="scope">
                            <div>{{scope.row.coupon_expire_type == 'FIXED' ? "固定日期" : "动态过期"}}</div>
                            <div v-if="scope.row.coupon_expire_type == 'FIXED'"> 
                                {{new Date(scope.row.coupon_valid_start_date).Format("yyyy-MM-dd hh:mm:ss")}} ~
                                {{new Date(scope.row.coupon_valid_end_date).Format("yyyy-MM-dd hh:mm:ss")}}</div>
                            
                            <div v-else> 
                                {{scope.row.coupon_valid_days}}(天)
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="coupon_type" label="优惠券类型" width="180">
                        <template slot-scope="scope">
                            <div>{{scope.row.coupon_type == 'DISCOUNT' ? "折扣券" : "满减券"}}</div>
                            <div v-if="scope.row.coupon_type == 'DISCOUNT'"> 
                                {{scope.row.coupon_discount_rate}}(折)
                            </div>
                            <div v-else> 
                                满{{scope.row.coupon_limit_amount / 100}}减{{scope.row.coupon_reduction_amount/100}}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="" label="发放情况" width="180">
                        <template slot-scope="scope">
                            <div> {{ scope.row.coupon_distributed_count }} / {{ scope.row.coupon_count_limit}} </div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="" label="操作" width="120" fixed="left">
                        <template slot-scope="scope">
                            <div> 
                                <el-button @click="openDistributeDialog(scope.row.coupon_id)" type="small">分发</el-button>
                            </div>
                            <!-- <div> <el-button @click="openModifyDrawer(scope.row, scope.row.  )"
                                    type="small">修改信息</el-button>
                            </div>
                            <div> <el-button @click="openDetail(scope.row.  )" type="small">查看详情</el-button></div>
                            <div> <el-button @click="deleteOne(scope.row. )" type="small">删除</el-button></div> -->
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange" :current-page="page"
                    :page-sizes="[10, 20, 50, 100, 200, 400]" :page-size="count"
                    layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
                </el-pagination>
            </div>
        </el-main>

        <el-drawer :title="!isModify ? '添加优惠券' : '修改信息'" :visible.sync="drawer" direction="ltr" size="60%">
            <el-form :model="Info" ref="Info" label-width="120px" style="margin: 20px;">
                
                <el-form-item label="优惠券名称" prop="">
                    <el-input v-model="Info.coupon_name" placeholder="请输入优惠券名称"></el-input>
                </el-form-item>

                <el-form-item label="优惠券过期类型" prop="">
                    <el-radio v-model="Info.coupon_expire_type" label="FIXED">固定日期</el-radio>
                    <el-radio v-model="Info.coupon_expire_type" label="DYNAMIC">动态过期</el-radio>
                </el-form-item>

                <el-form-item label="有效时间 (天)" prop="" v-if = "Info.coupon_expire_type == 'DYNAMIC'" >
                    <el-input v-model = "Info.coupon_valid_days" placeholder="请输入有效天数"></el-input>
                </el-form-item>

                <el-form-item label="优惠券有效期开始时间" prop="" v-if = "Info.coupon_expire_type == 'FIXED'" >
                    <el-date-picker v-model="Info.coupon_valid_start_date" type="datetime" placeholder="选择日期时间"></el-date-picker>
                </el-form-item>

                <el-form-item label="优惠券有效期结束时间" prop="" v-if = "Info.coupon_expire_type == 'FIXED'" >
                    <el-date-picker v-model="Info.coupon_valid_end_date" type="datetime" placeholder="选择日期时间"></el-date-picker>
                </el-form-item>

                <el-form-item label="优惠券使用门槛金额(分)" prop="" >
                    <el-input v-model = "Info.coupon_limit_amount" placeholder="请输入使用门槛金额(分)"></el-input>
                </el-form-item>

                <el-form-item label="优惠券类型" prop="" >
                    <el-radio v-model="Info.coupon_type" label="DISCOUNT">折扣</el-radio>
                    <el-radio v-model="Info.coupon_type" label="REDUCTION">满减</el-radio>
                </el-form-item>

                <el-form-item label="折扣率(0-1小数)" prop="" v-if = "Info.coupon_type == 'DISCOUNT'" >
                    <el-input v-model = "Info.coupon_discount_rate" placeholder="请输入折扣率"></el-input>
                </el-form-item>

                <el-form-item label="满减金额(分)" prop="" v-if = "Info.coupon_type == 'REDUCTION'" >
                    <el-input v-model = "Info.coupon_reduction_amount" placeholder="请输入满减金额(分)"></el-input>
                </el-form-item>

                <el-form-item label="限制发放数量" prop="" >
                    <el-input v-model = "Info.coupon_count_limit" placeholder="请输入限制发放数量"></el-input>
                </el-form-item>


                <el-button v-if="!isModify" style="width: 100%;" type="primary" @click="add">添加</el-button>
                <el-button v-else style="width: 100%;" type="primary" @click="modify">修改</el-button>
            </el-form>
        </el-drawer>

        <el-dialog title="发放优惠券" :visible.sync="distributeDialog" width="30%">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="接收手机">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="distributeDialog = false">取 消</el-button>
                <el-button type="primary" @click="distribute">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
import HTTP from '../utils/http'
import '../utils/date.js'

export default {
    data() {
        return {
            tableData: [],
            Info: {
                coupon_name: '',
                coupon_expire_type: 'FIXED',
                coupon_valid_start_date: null,
                coupon_valid_end_date: null,
                coupon_valid_days: null,
                coupon_limit_amount: null,
                coupon_type: 'DISCOUNT',
                coupon_discount_rate: null,
                coupon_reduction_amount: null,
                coupon_count_limit: null,
            },
            drawer: false,
            count: 10,
            page: 0,
            totalCount: 0,
            current_id: 1,
            isModify: false,
            distributeDialog: false,
            form: {
                phone: ''
            }
        }
    },
    name: ' ',
    /* 待填充 */
    async created() {
        await this.getList()
    },
    methods: {
        openDistributeDialog(coupon_id) {
            this.distributeDialog = true
            this.current_id = coupon_id
        },
        async distribute() {
            let res = await HTTP.request({
                url: '/admin/coupon/distribute',
                method: 'post',
                data: {
                    coupon_id: this.current_id,
                    user_phone: this.form.phone
                }
            })
            this.form.phone = ''
            this.distributeDialog = false
            if(res.code == 0) {
                this.$message({
                    message: '发放成功',
                    type: 'success'
                })
            }
        },
        handleSizeChange(val) {
            this.count = val
            this.page = 0
            this.getList()
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        /* 待填充 */
        openAddDrawer() {
            this.Info = {
                coupon_name: '',
                coupon_expire_type: 'FIXED',
                coupon_valid_start_date: null,
                coupon_valid_end_date: null,
                coupon_valid_days: null,
                coupon_limit_amount: null,
                coupon_type: 'DISCOUNT',
                coupon_discount_rate: null,
                coupon_reduction_amount: null,
                coupon_count_limit: null,
            }
            this.drawer = true
            this.isModify = false
        },
        /* 待填充 */
        openModifyDrawer(info, current_id) {
            this.current_id = current_id
            this.isModify = true
            this.Info = info

            // 如有图片 则需此句内容 this.Info.indexImage = (urlencode.decode(info.normal_commodity_index_image, 'utf-8')).split('?')[0].split('.com')[1]
            this.toggleDrawerShow()
        },
        /* 如有图片 则需此函数 待填充 */
        uploadImage(e) {
            // OSSModel.uploadImage(e, "/").then(res => {
            //     this.Info. = res
            // })
        },
        handlePageChange(e) {
            this.page = e - 1
            this.getList()
        },
        handlePageRefresh() {
            this.page = 0
            this.getList()
        },
        toggleDrawerShow() {
            this.drawer = !this.drawer
        },
        /* 待填充 */
        async add() {
            await HTTP.request({
                url: '/admin/coupon/add',
                method: 'post',
                data: this.Info
            })
            this.toggleDrawerShow()
            this.handlePageRefresh()
        },
        /* 待填充 */
        async modify() {
            // await Model.modify(
            //     this.current_id,
            //     ...this.Info
            // )
            // this.toggleDrawerShow()
            // this.getList()
            // this.$refs.upload.clearFiles()
        },
        /* 待填充 */
        async getList() {
            let res = await HTTP.request({
                url: '/admin/coupon/list',
                method: 'get',
                params: {
                    offset: this.page * this.count,
                    limit: this.count,
                }
            })
            this.totalCount = res.data.all_count
            this.tableData = res.data.data

        },
        /* 待填充 */
        openDetail(id) {
            // this.$router.push(`/-detail?_id=${}`)
        },
        /* 待填充 */
        async deleteOne(id) {
            // await Model.delete(id)
            // await this.getList()
        }
    },
}
</script>

<style scoped></style>