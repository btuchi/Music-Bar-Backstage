<template>
    <el-container>
        <el-main>
            <div class="operation-container">
                <el-button type="primary" @click="openAddDrawer" plain>添加</el-button>
                <el-select v-model="currentBranch" placeholder="请选择" @change="onBranchChange">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="table-container">
                <el-table :data="tableData" style="width: 100%" height="95%">
                    <el-table-column prop="commodity_id" label="ID" width="60">
                    </el-table-column>

                    <el-table-column prop="commodity_name" label="商品名称" width="180">
                    </el-table-column>
                    <el-table-column prop="" label="商品图片" width="180">
                        <template slot-scope="scope">
                            <img width="80" :src="scope.row.commodity_image">
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="商品价格" width="180">
                        <template slot-scope="scope">
                            ￥{{ scope.row.commodity_unit_price / 100 }} / {{ scope.row.commodity_unit }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="commodity_sales" label="售出数量" width="180">
                    </el-table-column>
                    <el-table-column prop="commodity_tag" label="商品标签" width="180">
                        <template slot-scope="scope">
                            <el-tag size="mini" v-for="tag in scope.row.commodity_tag.split(',')" :key="tag" closable
                                style="margin:5px;" @close="handleClose(scope.row.commodity_id, tag, scope.row)">
                                {{ tag }}
                            </el-tag>
                            <el-input class="input-new-tag" v-show="scope.row.inputVisible" v-model="scope.row.inputValue"
                                size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)">
                            </el-input>
                            <el-button v-show="!scope.row.inputVisible" class="button-new-tag" size="small"
                                @click="showInput(scope.row)">+ New Tag</el-button>
                        </template>
                    </el-table-column>

                    <el-table-column prop="" label="是否热销" width="180">
                        <template slot-scope="scope">
                            <el-switch @change="changeHot(scope.row.commodity_id, scope.row.commodity_is_hot)"
                                v-model="scope.row.commodity_is_hot" active-text="是" inactive-text="否">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="是否上线" width="180">
                        <template slot-scope="scope">
                            <el-switch @change="changeOnline(scope.row.commodity_id, scope.row.commodity_is_online)"
                                v-model="scope.row.commodity_is_online" active-text="是" inactive-text="否">
                            </el-switch> </template>
                    </el-table-column>
                    <el-table-column prop="commodity_priority" label="优先级" width="180">
                    </el-table-column>
                    <el-table-column prop="" label="操作" width="120" fixed="left">
                        <template slot-scope="scope">
                            <div> <el-button @click="openModifyDrawer(scope.row, scope.row.commodity_id)"
                                    type="small">修改信息</el-button>
                            </div>
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

                <el-form :model="Info" ref="Info" label-width="120px" style="margin: 20px;">
                    <el-form-item label="所属门店" prop="">
                        <el-input v-model="currentBranchName" placeholder="请输入所属门店" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="商品名称" prop="">
                        <el-input v-model="Info.commodity_name" placeholder="请输入商品名称"></el-input>
                    </el-form-item>
                    <el-form-item label="商品单位" prop="">
                        <el-input v-model="Info.commodity_unit" placeholder="请输入商品单位"></el-input>
                    </el-form-item>
                    <el-form-item label="商品类别" prop="">
                        <el-input v-model="Info.commodity_tag" placeholder="请输入商品类别，以英文逗号分隔"></el-input>
                    </el-form-item>
                    <el-form-item label="单价" prop="">
                        <el-input v-model="Info.commodity_unit_price" placeholder="请输入商品单价"></el-input>
                    </el-form-item>
                    <el-form-item label="优先级" prop="">
                        <el-input v-model="Info.commodity_priority" placeholder="请输入优先级"></el-input>
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
                commodity_name: '',
                commodity_unit: '',
                commodity_tag: '',
                commodity_unit_price: '',
                commodity_priority: 10,
                commodity_image: '',
            },
            drawer: false,
            count: 10,
            page: 0,
            totalCount: 0,
            current_id: 1,
            isModify: false,
            options: [],
            currentBranch: 1,
            currentBranchName: ''
        }
    },
    name: ' ',
    /* 待填充 */
    async created() {
        await this.getBranchList()
        await this.getList()
    },
    methods: {
        async handleInputConfirm(e) {
            if (e.inputValue == '') {
                e.inputVisible = false
                e.inputValue = ''
                return
            }
            let commodity_tags = e.commodity_tag.split(',')
            commodity_tags.push(e.inputValue)
            let new_commodity_tag = commodity_tags.join(',')
            await HTTP.request({
                url: '/admin/commodity/update_tags',
                method: 'put',
                data: {
                    commodity_id: e.commodity_id,
                    commodity_tag: new_commodity_tag
                }
            })
            await this.getList()
            e.inputVisible = false
            e.inputValue = ''
        },
        showInput(e) {
            e.inputVisible = true
        },
        async handleClose(commodity_id, tag, commodity_info) {
            let current_tags = commodity_info.commodity_tag.split(',')
            for (let i = 0; i < current_tags.length; i++) {
                if (current_tags[i] === tag) {
                    current_tags.splice(i, 1)
                    break
                }
            }
            let new_commodity_tag = current_tags.join(',')
            await HTTP.request({
                url: '/admin/commodity/update_tags',
                method: 'put',
                data: {
                    commodity_id: commodity_id,
                    commodity_tag: new_commodity_tag
                }
            })
            await this.getList()
        },

        async changeOnline(commodity_id, commodity_is_online) {
            if (commodity_is_online) {
                await HTTP.request({
                    url: '/admin/commodity/online',
                    method: 'put',
                    data: {
                        commodity_id: commodity_id,
                    }
                })
            } else {
                await HTTP.request({
                    url: '/admin/commodity/offline',
                    method: 'put',
                    data: {
                        commodity_id: commodity_id
                    }
                })
            }
        },
        async changeHot(commodity_id, commodity_is_hot) {
            if (commodity_is_hot) {
                await HTTP.request({
                    url: '/admin/commodity/onhot',
                    method: 'put',
                    data: {
                        commodity_id: commodity_id

                    }
                })
            } else {
                await HTTP.request({
                    url: '/admin/commodity/offhot',
                    method: 'put',
                    data: {
                        commodity_id: commodity_id
                    }
                })
            }
        },

        async onBranchChange(val) {
            this.currentBranch = val
            this.currentBranchName = this.options.find(item => item.value === val).label
            console.log(this.currentBranch)
            await this.getList()
        },
        async getBranchList() {
            let res = await HTTP.request({
                url: '/admin/branch/list',
                method: 'get',
                params: {
                    offset: 0,
                    limit: 10000000,
                }
            })
            console.log(res.data)
            for (let i = 0; i < res.data.data.length; i++) {
                this.options.push({
                    value: res.data.data[i].branch_id,
                    label: res.data.data[i].branch_name
                })
            }
            this.currentBranch = this.options[0].value
            this.currentBranchName = this.options[0].label

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
                branch_id: this.currentBranch,
                commodity_name: '',
                commodity_unit: '',
                commodity_tag: '',
                commodity_unit_price: '',
                commodity_image: '',
                priority: 10,
            }
            this.drawer = true
            this.isModify = false
        },
        /* 待填充 */
        openModifyDrawer(info, current_id) {
            this.current_id = current_id
            this.isModify = true
            this.Info = deepClone(info)
            this.Info.commodity_image = info.commodity_image.split('/')[info.commodity_image.split('/').length - 1]
            // 如有图片 则需此句内容 this.Info.indexImage = (urlencode.decode(info.normal_commodity_index_image, 'utf-8')).split('?')[0].split('.com')[1]
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
            this.Info.commodity_image = res.data.url
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
                url: '/admin/commodity/add',
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
                url: '/admin/commodity/update',
                method: 'put',
                data: {
                    ...this.Info,
                    commodity_id: this.current_id
                }
            })
            this.toggleDrawerShow()
            this.handlePageRefresh()
            this.$refs.upload.clearFiles()
        },
        /* 待填充 */
        async getList() {
            let res = await HTTP.request({
                url: '/admin/commodity/list',
                method: 'get',
                params: {
                    offset: this.page * this.count,
                    limit: this.count,
                    branch_id: this.currentBranch
                }
            })

            for (let i = 0; i < res.data.data.length; i++) {
                res.data.data[i].inputVisible = false
                res.data.data[i].inputValue = ''
            }
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