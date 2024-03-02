<template>
    <el-container>
        <el-main>
            <div class="operation-container">
                <el-button type="primary" @click="openAddDrawer" plain>添加</el-button>
            </div>
            <div class="table-container">
                <el-table :data="tableData" style="width: 100%" height="95%">
                    <el-table-column prop="poster_id" label="ID" width="60">
                    </el-table-column>

                    <el-table-column prop="poster_priority" label="优先级" width="180">
                    </el-table-column>

                    <el-table-column prop="poster_is_online" label="是否上线" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.poster_is_online ? "是" : "否" }}
                        </template>
                    </el-table-column>

                    <el-table-column prop="" label="图片" width="180">
                        <template slot-scope="scope">
                            <img width="80" :src="scope.row.poster_image">
                        </template>
                    </el-table-column>

                    <el-table-column prop="" label="操作" width="120" fixed="left">
                        <template slot-scope="scope">
                            <div> <el-button @click="openModifyDrawer(scope.row, scope.row.poster_id)"
                                    type="small">修改信息</el-button>
                            </div>
                            <div> <el-button @click="online(scope.row.poster_id)" v-if="!scope.row.poster_is_online" type="small">上线</el-button></div>
                            <div> <el-button @click="offline(scope.row.poster_id)" v-if="scope.row.poster_is_online" type="small">下线</el-button></div>
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

        <el-drawer :title="!isModify ? '添加海报' : '修改信息'" :visible.sync="drawer" direction="ltr" size="60%">
            <el-form :model="Info" ref="Info" label-width="120px" style="margin: 20px;">

                <el-form-item label="优先级" prop="">
                    <el-input v-model="Info.poster_priority" placeholder="请输入海报优先级"></el-input>
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
function deepClone(target) {
    return JSON.parse(JSON.stringify(target))
}

export default {
    data() {
        return {
            tableData: [],
            Info: {
                poster_priority: 10,
                poster_image: ''
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
                poster_priority: 10,
                poster_image: ''
            }
            this.drawer = true
            this.isModify = false
        },
        /* 待填充 */
        openModifyDrawer(info, current_id) {
            this.current_id = current_id
            this.isModify = true
            this.Info = deepClone(info)
            this.Info.poster_image = info.poster_image.split('/')[info.poster_image.split('/').length - 1]
            this.toggleDrawerShow()
        },
        /* 如有图片 则需此函数 待填充 */
        async uploadImage(e) {
            console.log("uploadImage", e)
            let formData = new FormData()
            formData.append('file', e.file)

            let res = await HTTP.request({
                url: '/file/upload',
                method: 'post',
                data: formData
            })
            this.Info.poster_image = res.data.url
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
                url: '/admin/poster/add',
                method: 'post',
                data: this.Info
            })
            this.toggleDrawerShow()
            this.handlePageRefresh()
            this.$refs.upload.clearFiles()
        },
        /* 待填充 */
        async modify() {
            await HTTP.request({
                url: '/admin/poster/update',
                method: 'put',
                data: {
                    ...this.Info,
                    poster_id: this.current_id
                }
            })
            this.toggleDrawerShow()
            this.getList()
            this.$refs.upload.clearFiles()
        },
        /* 待填充 */
        async getList() {
            let res = await HTTP.request({
                url: '/admin/poster/list',
                method: 'get',
                params: {
                    offset: this.page * this.count,
                    limit: this.count,
                }
            })
            this.totalCount = res.data.all_count
            this.tableData = res.data.objects
        },
        /* 待填充 */
        openDetail(id) {
            // this.$router.push(`/-detail?_id=${}`)
        },
        /* 待填充 */
        async deleteOne(id) {
            // await Model.delete(id)
            // await this.getList()
        },
        async online(id) {
            await HTTP.request({
                url: '/admin/poster/online',
                method: 'put',
                data: {
                    poster_id: id
                }
            })
            await this.getList()
        },
        async offline(id) {
            await HTTP.request({
                url: '/admin/poster/offline',
                method: 'put',
                data: {
                    poster_id: id
                }
            })
            await this.getList()
        }
    },
}
</script>

<style scoped></style>