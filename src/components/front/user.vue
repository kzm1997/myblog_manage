<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="query.status" placeholder="用户状态" class="handle-select mr10">
                    <el-option key="1" label="禁用" value=1></el-option>
                    <el-option key="2" label="正常" value=0></el-option>
                </el-select>
                <el-input v-model="query.nickname" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="nickname" label="用户名" align="center"></el-table-column>
                <el-table-column label="邮箱" prop="email" align="center"></el-table-column>
                <el-table-column label="头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                                class="table-td-thumb"
                                :src="scope.row.avatar"
                                :preview-src-list="[scope.row.avatar]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="文章数" align="center">
                    <template slot-scope="scope">{{scope.row.articles}}</template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status===0?'success':(scope.row.status===1?'danger':'')"
                        >{{getStatus(scope.row.status)}}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="createTime" label="注册时间" align="center"></el-table-column>
                <el-table-column label="禁用操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.switch"
                                active-color="#13ce66"
                                @change="mychange(scope.row)"
                                inactive-color="#ff4949">
                        </el-switch>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.pageNum"
                        :page-size="query.pageSize"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import {getUser, forbid} from '@/api/user';

    export default {
        name: 'basetable',
        data() {
            return {
                query: {
                    nickname: '',
                    pageNum: 1,
                    pageSize: 5
                },
                form: {
                    nickname: '',
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                pageTotal: 0,
                idx: -1,
                id: -1,
            };
        },
        created() {
            this.getData();
        },
        methods: {
            getStatus(status) {
                if (status === 0) {
                    return '正常'
                } else if (status === 1) {
                    return '锁定';
                }
            },
            mychange(item) {
                if (item.status === 0) {
                    forbid(item.id, 1).then(res => {
                        if (res.data.status == 0) {
                            this.tableData.forEach((i, index) => {
                                if (i.id == item.id) {
                                    this.tableData[index].status = 1;
                                    this.$forceUpdate();
                                }
                            })
                        }
                    })
                } else if (item.status === 1) {
                    forbid(item.id, 0).then(res => {
                        if (res.data.status == 0) {
                            this.tableData.forEach((i, index) => {
                                if (i.id == item.id) {
                                    this.tableData[index].status = 0;
                                    this.$forceUpdate();
                                }
                            })
                        }
                    })
                }
            },
            getData() {
                getUser(this.query).then(res => {
                    this.tableData = res.data.data.list;
                    this.tableData.forEach(item => {
                        if (item.status == 0) {
                            item.switch = false;
                        } else if (item.status == 1) {
                            item.switch = true;
                        }
                    })
                    this.pageTotal = res.data.data.totalCount;

                });
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageNum', 1);
                this.getData();
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.$message.success('删除成功');
                        this.tableData.splice(index, 1);
                    })
                    .catch(() => {
                    });
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {
                const length = this.multipleSelection.length;
                let str = '';
                this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error(`删除了${str}`);
                this.multipleSelection = [];
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                this.editVisible = true;
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageNum', val);
                this.getData();
            },

        }
    };
</script>

<style lang="scss">
    .myheader {
        margin-top: 10px;
        padding: 10px;
        margin-bottom: 30px;
        border-bottom: 1px solid rgba(140, 147, 157, 0.19);
    }

    .myform {
        margin-left: 10px;
        text-align: left;

        input {
            margin-bottom: 15px;
        }

        width: 80%;
    }

    .el-drawer__wrapper {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: hidden;
        margin: 0;
    }

    .handle-box {
        margin-bottom: 20px;
    }

    .myadd {
        margin-bottom: 15px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 10px;
    }

    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }

</style>
