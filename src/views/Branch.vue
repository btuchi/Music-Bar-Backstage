<template>
    <el-container>
        <el-main>
            <div class="operation-container">
                <el-button type="primary" @click="openAddDrawer" plain>添加</el-button>
            </div>
            <div class="table-container">
                <el-table :data="tableData" style="width: 100%" height="95%">
                    <el-table-column prop="branch_id" label="ID" width="60">
                    </el-table-column>

                    <el-table-column prop="branch_name" label="门店名称" width="180">
                    </el-table-column>

                    <el-table-column prop="branch_address" label="门店地址" width="180">
                    </el-table-column>

                    <el-table-column prop="branch_phone" label="门店电话" width="180">
                    </el-table-column>

                    <el-table-column prop="branch_open_time" label="开始营业时间" width="180">
                    </el-table-column>

                    <el-table-column prop="branch_close_time" label="结束营业时间" width="180">
                    </el-table-column>

                    <el-table-column prop="branch_status" label="门店状态" width="180">
                    </el-table-column>


                    <el-table-column prop="" label="操作" width="120" fixed="left">
                        <template slot-scope="scope">
                            <div> <el-button @click="openModifyDrawer(scope.row, scope.row.branch_id)"
                                    type="small">修改信息</el-button>
                            </div>
                            <div> <el-button @click="deleteOne(scope.row.branch_id)" type="small">删除</el-button></div>
                            <div> <el-button @click="online(scope.row.branch_id)" v-if="scope.row.branch_status == 'CLOSED' " type="small"> 上线</el-button></div>
                            <div> <el-button @click="offline(scope.row.branch_id)" v-if="scope.row.branch_status == 'OPEN' " type="small">下线</el-button></div>
                            <div> <el-button @click="addActivity(scope.row.branch_id, scope.row.branch_name)" type="small">添加活动</el-button></div>

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

        <el-drawer :title="!isModify ? '添加门店' : '修改信息'" :visible.sync="drawer" direction="ltr" size="60%">
            <el-form :model="Info" ref="Info" label-width="120px" style="margin: 20px;">

                <el-form-item label="门店名称" prop="">
                    <el-input v-model="Info.branch_name" placeholder="请输入门店名称"></el-input>
                </el-form-item>
                <el-form-item label="门店关门时间（HH:MM）" prop="">
                    <el-input v-model="Info.branch_close_time" placeholder="请输入门店关门时间（HH:MM）"></el-input>
                </el-form-item>
                <el-form-item label="门店开门时间（HH:MM）" prop="">
                    <el-input v-model="Info.branch_open_time" placeholder="请输入门店关门时间（HH:MM）"></el-input>
                </el-form-item>
                <el-form-item label="门店经度" prop="">
                    <el-input v-model="Info.branch_longitude" placeholder="请输入门店经度"></el-input>
                </el-form-item>
                <el-form-item label="门店纬度" prop="">
                    <el-input v-model="Info.branch_latitude" placeholder="请输入门店纬度"></el-input>
                </el-form-item>
                <el-form-item label="门店地址" prop="">
                    <el-input v-model="Info.branch_address" placeholder="请输入门店地址"></el-input>
                </el-form-item>
                <el-form-item label="门店联系方式" prop="">
                    <el-input v-model="Info.branch_phone" placeholder="请输入门店联系方式"></el-input>
                </el-form-item>
                <el-form-item label="门店座位行数" prop="">
                    <el-input v-model="Info.branch_seat_row" placeholder="请输入门店座位行数"></el-input>
                </el-form-item>
                <el-form-item label="门店座位列数" prop="">
                    <el-input v-model="Info.branch_seated_column" placeholder="请输入门店座位列数"></el-input>
                </el-form-item>
                <el-form-item label="门店座位推荐消费" prop="">
                    <el-input v-model="Info.branch_one_seat_price" placeholder="请输入门店座位推荐消费"></el-input>
                </el-form-item>
                <el-form-item label="门店座位容量" prop="">
                    <el-input v-model="Info.branch_one_seat_capacity" placeholder="请输入门店座位容量"></el-input>
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
                branch_name:"",
                branch_close_time:"",
                branch_open_time:"",
                branch_longitude:"",
                branch_latitude:"",
                branch_address:"",
                branch_phone:"",
                branch_seat_row:"",
                branch_seated_column:"",
                branch_one_seat_price:"",
                branch_one_seat_capacity:"",
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
        addActivity(branch_id, branch_name) {
            this.$router.push({
                path: '/activity',
                query: {
                    branch_id: branch_id,
                    branch_name: branch_name
                }
            })
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
                branch_name:"",
                branch_close_time:"",
                branch_open_time:"",
                branch_longitude:"",
                branch_latitude:"",
                branch_address:"",
                branch_phone:"",
                branch_seat_row:"",
                branch_seated_column:"",
                branch_one_seat_price:"",
                branch_one_seat_capacity:"",
            }
            this.drawer = true
            this.isModify = false
        },
        /* 待填充 */
        openModifyDrawer(info, current_id) {
            this.current_id = current_id
            this.isModify = true
            this.Info = deepClone(info)
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
                url: '/admin/branch/add',
                method: 'post',
                data: this.Info
            })
            this.$message({
                type: 'success',
                message: '添加成功!'
            });
            this.toggleDrawerShow()
            this.handlePageRefresh()
        },
        /* 待填充 */
        async modify() {

            let res = await HTTP.request({
                url: '/admin/branch/update',
                method: 'put',
                data: {
                    branch_id: this.current_id,
                    ...this.Info
                }
            })
            if (res.code == 0){
                this.$message({
                    message: '修改成功!'
                });
            }

            this.toggleDrawerShow()
            this.getList()
        },
        /* 待填充 */
        async getList() {
            let res = await HTTP.request({
                url: '/admin/branch/list',
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
            this.$confirm('此操作将永久删除该门店, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await HTTP.request({
                    url: '/admin/branch/delete',
                    method: 'delete',
                    params: {
                        branch_id: id
                    }
                })
                await this.getList()
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
            
        },
        async online(id) {
            await HTTP.request({
                url: '/admin/branch/open',
                method: 'put',
                data: {
                    branch_id: id
                }
            })
            await this.getList()
        },
        async offline(id) {
            await HTTP.request({
                url: '/admin/branch/close',
                method: 'put',
                data: {
                    branch_id: id
                }
            })
            await this.getList()
        }
    },
}
</script>

<style scoped></style>