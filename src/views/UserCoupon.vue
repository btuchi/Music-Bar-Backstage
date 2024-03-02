<template>
    <el-container>
        <el-main>
            <div class="operation-container">
            </div>
            <div class="table-container">
                <el-table :data="tableData" style="width: 100%" height="95%">
                    <el-table-column prop="user_coupon_id" label="ID" width="60">
                    </el-table-column>
                    <el-table-column prop="user_coupon_name" label="优惠券名称" width="180">
                    </el-table-column>
                    <el-table-column prop="" label="优惠券有效" width="180">
                        <template slot-scope="scope">
                            {{ new Date(scope.row.user_coupon_valid_start_date).Format("yyyy-MM-dd hh:mm:ss") }} ~ 
                            {{ new Date(scope.row.user_coupon_valid_end_date).Format("yyyy-MM-dd hh:mm:ss") }}
                        </template>
                    </el-table-column>

                    <el-table-column prop="" label="优惠券类型" width="180">
                        <template slot-scope="scope">
                            <div> {{ scope.row.user_coupon_type == 'DISCOUNT' ? "折扣券" : "满减券" }}</div>
                            <div v-if="scope.row.user_coupon_type == 'DISCOUNT'"> 折扣率: {{ scope.row.user_coupon_discount }}</div>
                            <div v-else> 立减 ¥ {{ scope.row.user_coupon_limit_amount / 100 }}</div> 
                            <div> 满 ¥ {{ scope.row.user_coupon_limit_amount / 100 }} 可用 </div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="user_coupon_status" label="使用状态" width="180">
                    </el-table-column>

                    <el-table-column prop="user.user_name" label="归属用户" width="180">
                    </el-table-column>


                

                    <el-table-column prop="" label="操作" width="120" fixed="left">
                        <template slot-scope="scope">
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

        <el-drawer :title="!isModify ? '添加普通商品' : '修改信息'" :visible.sync="drawer" direction="ltr" size="60%">
            <el-form :model="Info" ref="Info" label-width="120px" style="margin: 20px;">

                <!-- <el-form-item label="商品名称" prop="">
                    <el-input v-model="Info." placeholder="请输入商品名称"></el-input>
                </el-form-item> -->

                <el-form-item label="缩略图" prop="indexImage">
                    <!-- 商品首页缩略图 -->
                    <div v-if="isModify">如需修改请重新上传，否则忽略即可</div>
                    <el-upload :http-request="uploadImage" class="upload-demo" drag ref="upload" action=""
                        :on-exceed="handleExceed" :limit="1" list-type="picture">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>

                <el-button v-if="!isModify" style="width: 100%;" type="primary" @click="add">添加</el-button>
                <el-button v-else style="width: 100%;" type="primary" @click="modify">修改</el-button>
            </el-form>
        </el-drawer>

    </el-container>
</template>

<script>
import HTTP from '../utils/http'

export default {
    data() {
        return {
            tableData: [],
            Info: {
                /* 待填充 */
            },
            drawer: false,
            count: 10,
            page: 0,
            totalCount: 0,
            current_id: 1,
            isModify: false,
        }
    },
    name: ' ',
    /* 待填充 */
    async created() {
        await this.getList()
    },
    methods: {
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
                /* 待填充 */
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
            // await Model.add(
            //     ...this.Info
            // )
            // this.toggleDrawerShow()
            // this.handlePageRefresh()
            // this.$refs.upload.clearFiles()
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
                url: '/admin/user_coupon/list',
                method: 'get',
                params: {
                    offset: this.page * this.count,
                    limit: this.count,
                }
            })
            console.log(res.data)
            this.tableData = res.data.data
            this.totalCount = res.data.all_count

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