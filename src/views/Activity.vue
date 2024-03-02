<template>
    <el-container>
        <el-main>
            <div class="operation-container">
            </div>
            <div class="table-container">
                <el-table :data="tableData" style="width: 100%" height="95%">
                    <el-table-column prop="activity_id" label="ID" width="60">
                    </el-table-column>

                    <el-table-column prop="activity_name" label="活动名" width="180">
                    </el-table-column>
                    <el-table-column prop="activity_start_time" label="开始时间" width="180">
                        <template slot-scope="scope">
                            {{ new Date(scope.row.activity_start_time).Format("yyyy-MM-dd hh:mm:ss") }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="activity_end_time" label="结束时间" width="180">
                        <template slot-scope="scope">
                            {{ new Date(scope.row.activity_end_time).Format("yyyy-MM-dd hh:mm:ss") }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="activity_detail" label="活动详情" width="180">
                    </el-table-column>

                    <el-table-column prop="branch.branch_name" label="所属分店" width="180">
                    </el-table-column>

                    <el-table-column prop="" label="图片" width="180">
                        <template slot-scope="scope">
                            <img width="80" :src="scope.row.activity_image">
                        </template>
                    </el-table-column>

                    <el-table-column prop="" label="操作" width="120" fixed="left">
                        <template slot-scope="scope">
                            <div> <el-button @click="openModifyDrawer(scope.row, scope.row.activity_id)"
                                    type="small">修改信息</el-button>
                            </div>
                            <div> <el-button @click="deleteOne(scope.row.activity_id)" type="small">删除</el-button></div>
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

        <el-drawer :title="!isModify ? '添加活动' : '修改信息'" :visible.sync="drawer" direction="ltr" size="60%"
            @close = "refreshPage">
            <el-form :model="Info" ref="Info" label-width="120px" style="margin: 20px;">
                <el-form-item label="归属门店" prop="">
                    <el-input v-model="branch_name" placeholder="请输入活动名称" disabled></el-input>
                </el-form-item>
                <el-form-item label="活动名称" prop="">
                    <el-input v-model="Info.activity_name" placeholder="请输入活动名称"></el-input>
                </el-form-item>
                <el-form-item label="活动细节" prop="">
                    <el-input v-model="Info.activity_detail" placeholder="请输入活动细节"></el-input>
                </el-form-item>
                <el-form-item label="活动开始时间" prop="">
                    <el-date-picker v-model="Info.activity_start_time" type="datetime" placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="活动结束时间" prop="">
                    <el-date-picker v-model="Info.activity_end_time" type="datetime" placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>


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
import '../utils/date.js'
function deepClone(target) {
    return JSON.parse(JSON.stringify(target))
}

export default {
    data() {
        return {
            tableData: [],
            Info: {
                
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
        this.branch_id = this.$route.query.branch_id
        this.branch_name = this.$route.query.branch_name
        await this.getList()
        if (this.branch_id) {
            this.openAddDrawer()
        }
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

        openAddDrawer() {
            this.Info = {
                activity_name: '',
                activity_detail: '',
                activity_start_time: '',
                activity_end_time: '',
                activity_image: '',
                branch_id: this.branch_id
            }
            this.drawer = true
            this.isModify = false
        },
        /* 待填充 */
        openModifyDrawer(info, current_id) {
            this.current_id = current_id
            this.isModify = true
            this.Info = deepClone(info)
            this.branch_name = this.Info.branch.branch_name
            this.Info.activity_image = info.activity_image.split('/')[info.activity_image.split('/').length - 1]
            this.toggleDrawerShow()
        },
        /* 如有图片 则需此函数 待填充 */
        async uploadImage(e) {
            let formData = new FormData()
            formData.append('file', e.file)

            let res = await HTTP.request({
                url: '/file/upload',
                method: 'post',
                data: formData
            })
            this.Info.activity_image = res.data.url
        },
        handlePageChange(e) {
            this.page = e - 1
            this.getList()
        },
        handlePageRefresh() {
            this.page = 0
            this.getList()
        },
        refreshPage() {
            this.$router.push('/activity')
        },
        toggleDrawerShow() {
            this.drawer = !this.drawer
        },
        /* 待填充 */
        async add() {
            let res = await HTTP.request({
                url: '/admin/activity/add',
                method: 'post',
                data: this.Info
            })
            this.toggleDrawerShow() // this.drawer = false
            this.getList()
        },
        /* 待填充 */
        async modify() {
            await HTTP.request({
                url: '/admin/activity/update',
                method: 'put',
                data: {
                    ...this.Info,
                    activity_id: this.current_id
                }
            })
            this.toggleDrawerShow()
            this.getList()
            this.$refs.upload.clearFiles()
        },
        /* 待填充 */
        async getList() {
            let res = await HTTP.request({
                url: '/admin/activity/list',
                method: 'get',
                params: {
                    offset: this.page * this.count,
                    limit: this.count
                }
            })
            this.tableData = res.data.data
            this.totalCount = res.data.all_count

        },
        /* 待填充 */
        openDetail(id) {
            // this.$router.push(`/-detail?_id=${}`)
        },
        /* 待填充 */
        async deleteOne(id) {
            await HTTP.request({
                url: '/admin/activity/delete',
                method: 'delete',
                params: {
                    activity_id: id
                }
            })
            this.getList()
        }
    },
}
</script>

<style scoped></style>