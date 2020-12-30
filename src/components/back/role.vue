<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 角色管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
<!--                <el-button type="primary" icon="el-icon-plus" class="myadd" @click="addRole">新增角色</el-button>-->
            </div>
            <el-table
                    :data="tableData"
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header">
                <el-table-column prop="roleId" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="roleName" label="角色名" align="center"></el-table-column>
                <el-table-column label="描述" align="center">
                    <template slot-scope="scope">{{scope.row.pemark}}</template>
                </el-table-column>
                <el-table-column prop="createTime" label="注册时间" align="center"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
                <!--<el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-lx-settings"
                                style="font-size: 18px"
                                @click="handleEdit(scope.$index, scope.row)"
                        ></el-button>
                        <el-button
                                type="text"
                                style="font-size: 18px"
                                icon="el-icon-view"
                                class="green"
                        ></el-button>
                    </template>
                </el-table-column>-->
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.pageIndex"
                        :page-size="query.pageSize"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>


        <el-drawer
                size="40%"
                :withHeader="false"
                :show-close="false"
                :visible.sync="drawer"
                :direction="direction"
                :append-to-body="true"
        >
            <div class="editUser">
                <div>
                    <div class="myheader">
                        <span>新增角色</span>
                    </div>
                    <el-form class="myform" ref="form" :model="form" label-width="70px" label-position="left"
                             size="small">
                        <el-form-item label="角色名称" >
                            <el-input v-model="form.roleName"></el-input>
                        </el-form-item>
                        <el-form-item label="角色描述" >
                            <el-input v-model="form.password"
                                      type="textarea"></el-input>
                        </el-form-item>
                  <!--      <el-form-item label="权限选择" >
                            <el-tree
                                    :props="props"
                                    show-checkbox
                                    >
                            </el-tree>
                        </el-form-item>-->
                    </el-form>
                </div>
                <div class="myset">
                    <el-popconfirm
                            @onConfirm="cancal('form')"
                            title="确定取消编辑？">
                        <el-button slot="reference">取消</el-button>
                    </el-popconfirm>
                    <el-button type="primary" class="confirm" @click="confirmUser('form')">确定</el-button>
                </div>
            </div>
        </el-drawer>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {rolePage} from "../../api/role";

    export default {
        name: 'role',
        data() {
            return {
                drawer: false,
                direction: 'rtl',
                query: {
                    pageNum: 1,
                    pageSize: 5
                },
                form: {
                    roleName: '',
                    pemark: ''
                },
                props:{
                    label:'menuName',
                    children: 'zones'
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1
            };
        },
        created() {
            this.getData();
        },
        methods: {

            // 取消编辑
            cancal(formName) {
                this.$refs[formName].resetFields();
                this.drawer = false;
            },

            addRole() {
                this.drawer = true;
            },
            getData() {
                rolePage(this.query).then(res => {
                    if (res.data.status == 0) {
                        this.tableData = res.data.data.list;
                        this.pageTotal = res.data.data.totalCount;
                    }
                });
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                this.editVisible = true;
            },
            // 保存编辑
            saveEdit() {
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                this.$set(this.tableData, this.idx, this.form);
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
                this.getData();
            }
        }
    };
</script>

<style scoped lang="scss">

    .editUser {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .myset {
            margin-right: 15px;
            align-self: flex-end;
        }

        .myheader {
            margin-top: 10px;
            padding: 10px;
            margin-bottom: 30px;
            border-bottom: 1px solid rgba(140, 147, 157, 0.19);
        }

        .myform {
            margin-left: 15px;
            text-align: left;

            input {
                margin-bottom: 15px;
            }

            width: 80%;
        }

        .confirm {
            margin-left: 15px;
        }
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

    .green {
        color: #0073ff;
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
