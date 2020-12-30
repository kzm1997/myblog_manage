<template>
    <div>
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
                        <span>新增用户</span>
                    </div>
                    <el-form class="myform" ref="form" :model="form" label-width="65px" label-position="left"
                             size="small" :rules="rules">
                        <el-form-item label="账号" prop="account">
                            <el-input v-model="form.account" name="account"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="form.password" show-password name="password"
                                      placeholder="请输入密码"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="form.email" name="email"></el-input>
                        </el-form-item>
                        <el-form-item label="昵称" prop="nickname">
                            <el-input v-model="form.nickname" name="nickname"></el-input>
                        </el-form-item>
                        <el-form-item label="角色" prop="role">
                            <el-select v-model="form.roleId" placeholder="请选择角色">
                                <el-option
                                        v-for="item in roles"
                                        :key="item.roleId"
                                        :label="item.roleName"
                                        :value="item.roleId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-radio v-model="form.status" label="0">有效</el-radio>
                            <el-radio v-model="form.status" label="1">锁定</el-radio>
                        </el-form-item>
                        <el-form-item label="Logo">
                            <div class="crop-demo">
                                <el-image :src="cropImg" class="pre-img"></el-image>
                                <div class="crop-demo-btn">
                                    更换头像
                                    <input ref="img" class="crop-input" type="file" name="image" accept="image/*"
                                           @change="setImage"/>
                                </div>
                                <div class="crop-demo-btn">取消更换
                                    <input ref="img" class="crop-input" type="button" name="image" accept="image/*"
                                           @click="canalsetImage"/>
                                </div>
                            </div>
                        </el-form-item>
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
            <el-button type="primary" icon="el-icon-plus" class="myadd" @click="addUser">新增用户</el-button>
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
                <el-table-column label="角色" align="center">
                    <template slot-scope="scope">{{scope.row.roleName}}</template>
                </el-table-column>
                <el-table-column label="状态" align="center" width="100">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status===0?'success':(scope.row.status===1?'danger':'')"
                        >{{getStatus(scope.row.status)}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" width="130" label="注册时间" align="center"></el-table-column>
                <el-table-column label="禁用操作" width="140" align="center">
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.switch"
                                active-color="#13ce66"
                                @change="mychange(scope.row)"
                                inactive-color="#ff4949">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="编辑" width="100" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                class="settings"
                                icon="el-icon-lx-settings"
                                @click="handleEdit(scope.$index, scope.row)"
                        >
                        </el-button>
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
        <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%"
                   :close-on-press-escape="false" :show-close="false" :close-on-click-modal="false">
            <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage"
                         style="width:100%;height:300px;"></vue-cropper>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelCrop">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
        </el-dialog>
        <el-dialog
                title="修改角色"
                :visible.sync="roleVisible"
                style="text-align: center"
                width="30%"
        >
            <el-select v-model="roleform.roleId" placeholder="请选择角色" >
                <el-option
                        v-for="item in roles"
                        :key="item.roleId"
                        :label="item.roleName"
                        :value="item.roleId">
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
    <el-button @click="roleVisible= false">取 消</el-button>
    <el-button type="primary" @click="updateRole">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getBackUser, forbid} from "../../api/user";
    import {uploadFile} from '../../api/upload'
    import VueCropper from 'vue-cropperjs';
    import {addUser, editUser} from "../../api/user";
    import {roleList} from "../../api/role";

    export default {
        name: 'basetable',
        data() {
            return {
                roles: [],
                dialogVisible: false,
                defaultImg: '',
                fileList: [],
                roleVisible: false,
                imgSrc: '',
                cropImg: '',
                file: Object,
                drawer: false,
                direction: 'rtl',
                query: {
                    nickname: '',
                    pageNum: 1,
                    pageSize: 5
                },
                form: {
                    id: 0,
                    account: '',
                    nickname: '',
                    password: '',
                    roleId: '',
                    email: '',
                    status: '',
                    avatar: ''
                },
                roleform:{
                  userId:'',
                  roleId:''
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                pageTotal: 0,
                idx: -1,
                id: -1,
                rules: {
                    account: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                        {min: 6, message: '不能小于6个字符', trigger: 'blur'}
                    ],
                    nickname: [
                        {required: true, message: '请输入昵称', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                    ]
                }
            }
        },
        components: {
            VueCropper
        },
        created() {
            this.getData();
            this.getAllROle();
        },
        methods: {
            addUser() {
                this.form.nickname = '';
                this.form.account = '';
                this.form.password = '';
                this.form.avatar = '';
                this.form.status = '';
                this.form.id = 0;
                this.form.email = '';
                this.drawer = true;
            },
            updateRole(){
                editUser(this.roleform).then(res=>{
                    if (res.data.status==0){
                        this.$message({
                            type:'success',
                            message:'修改成功'
                        })
                        this.getData();
                    }
                })
                this.roleVisible=false;
            },
            // 取消编辑
            cancal(formName) {
                this.$refs[formName].resetFields();
                this.drawer = false;
            },
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
                getBackUser(this.query).then(res => {
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
            //获取所有角色
            getAllROle() {
                roleList().then(res => {
                    if (res.data.status == 0) {
                        this.roles = res.data.data;
                    }
                })
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
                this.roleform.userId=row.id;
                this.roleVisible=true;
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageNum', val);
                this.getData();
            },
            setImage(e) {
                const file = e.target.files[0];
                const reader = new FileReader();
                if (file != undefined && file != null) {
                    reader.onload = (event) => {
                        this.dialogVisible = true;
                        this.imgSrc = event.target.result;
                        this.file = file;
                        this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
                    };
                    reader.readAsDataURL(file);
                }
                e.target.value = '';
            },
            cropImage() {
                this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
            },
            cancelCrop() {
                this.dialogVisible = false;
                this.cropImg = this.defaultImg;
            },
            canalsetImage() {
                this.cropImg = this.defaultImg;
                this.imgSrc = "";
            },
            confirmUser(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid && this.cropImg != '') {
                        let formData = new FormData();
                        formData.append('file', this.file);
                        formData.append('type', 'common');
                        uploadFile(formData).then(res => {
                            if (res.data.status == 0) {
                                this.form.avatar = res.data.data;
                                addUser(this.form).then(data => {
                                    if (data.data.status == 0) {
                                        this.$message({
                                            type: 'success',
                                            message: '添加用户成功'
                                        })
                                        this.getData();
                                    }
                                })
                            }
                        })
                        this.drawer = false;
                    } else {
                        this.$message({
                            type: 'warning',
                            message: '请输入完整信息'
                        })
                    }
                })
            }
        }

    }
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

    .pre-img {
        width: 100px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }

    .crop-demo {
        display: flex;
        align-items: flex-end;
    }

    .crop-demo-btn {
        position: relative;
        width: 100px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin-left: 30px;
        background-color: rgb(0, 209, 178);
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        box-sizing: border-box;
    }

    .crop-input {
        position: absolute;
        width: 100px;
        height: 40px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }

    .settings {
        font-size: 20px;
        color: #242f42;
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
