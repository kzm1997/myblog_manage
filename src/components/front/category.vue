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
                <el-button type="primary" icon="el-icon-lx-add" @click="addCategory">新增分类</el-button>
                <el-button type="primary" v-if="son!=''" @click="go">返回上级分类</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="categoryName" label="分类名" align="center" width="180"></el-table-column>
                <el-table-column label="Logo(查看大图)" align="center" width="180">
                    <template slot-scope="scope">
                        <el-image
                                class="table-td-thumb"
                                :src="getAvatar(scope.row)"
                                :preview-src-list="[getAvatar(scope.row)]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="简介" align="center">
                    <template slot-scope="scope">{{scope.row.message}}</template>
                </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑
                        </el-button>
                        <el-button
                                v-if="scope.row.parentId==-1"
                                type="text"
                                class="yellow"
                                icon="el-icon-lx-forward"
                                @click="handleSon(scope.$index, scope.row)"
                        >查看子标签
                        </el-button>
                        <el-button
                                v-else
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除
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
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="45%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="分类名">
                    <el-input v-model="form.categoryName"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="form.message"></el-input>
                </el-form-item>
                <el-form-item label="Logo">
                    <div class="crop-demo">
                        <el-image :src="cropImg" class="pre-img"></el-image>
                        <div class="crop-demo-btn">

                            <span v-if="form.id!=0"> 更换图片</span>
                            <span v-if="form.id==0"> 上传图片</span>
                            <input ref="img" class="crop-input" type="file" name="image" accept="image/*"
                                   @change="setImage"/>
                        </div>
                        <div class="crop-demo-btn" v-if="form.id!=0">取消更换
                            <input ref="img" class="crop-input" type="button" name="image" accept="image/*"
                                   @click="canalsetImage"/>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%"
                   :close-on-press-escape="false" :show-close="false" :close-on-click-modal="false">
            <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage"
                         style="width:100%;height:300px;"></vue-cropper>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelCrop">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getCategoryList, categoryEdit, categoryAdd,deleteCatgeory} from "../../api/category";
    import {uploadFile} from '../../api/upload'
    import VueCropper from 'vue-cropperjs';

    export default {
        name: 'basetable',
        data() {
            return {
                defaultImg: '',
                fileList: [],
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
                query: {
                    id: '',
                    pageNum: 1,
                    pageSize: 5
                },
                file: Object,
                form: {
                    id: 0,
                    categoryName: '',
                    message: '',
                    avatar: '',
                    parentId: 0,
                },
                tableData: [],
                editVisible: false,
                multipleSelection: [],
                delList: [],
                pageTotal: 0,
                idx: -1,
                id: -1,
                son: '',
            };
        },
        components: {
            VueCropper
        },
        created() {
            this.getCategory(-1);
        },
        methods: {
            go() {
                this.getCategory(-1);
                this.son = '';
            },
            canalsetImage() {
                this.cropImg = this.defaultImg;
                this.imgSrc = "";
            },
            addCategory() {
                this.form.id = 0;
                this.form.categoryName = '';
                this.form.message = '';
                this.form.avatar = '';
                if (this.son == '') {
                    this.form.parentId = -1;
                } else {
                    this.form.parentId = this.son;
                }
                this.defaultImg = "";
                this.cropImg = ""
                this.editVisible = true;
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
            getAvatar(item) {
                return item.avatar;
            },
            // 获取分类
            getCategory(id) {
                this.query.id = id;
                getCategoryList(this.query).then(res => {
                    if (res.data.status == 0) {
                        this.tableData = res.data.data.list;
                        this.pageTotal = res.data.data.totalCount;
                    }
                });
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        deleteCatgeory(row.id).then(res=>{
                            if (res.data.status==0){
                                this.$message.success('删除成功');
                                this.tableData.splice(index, 1);
                            }
                        })
                    })
                    .catch(() => {
                    });
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
                this.cropImg = this.getAvatar(row);
                this.defaultImg = this.cropImg;
                this.editVisible = true;

            },
            handleSon(index, row) {
                this.query.id = row.id;
                this.son = row.id;
                getCategoryList(this.query).then(res => {
                    if (res.data.status == 0) {
                        this.tableData = res.data.data.list;
                        this.pageTotal = res.data.data.totalCount;
                    }
                })
            },
            // 保存编辑
            saveEdit() {
                if (this.form.id != 0) {
                    if (this.cropImg != this.defaultImg) {
                        let formData = new FormData();
                        formData.append('file', this.file);
                        formData.append('type', 'common');
                        uploadFile(formData).then(res => {
                            if (res.data.status == 0) {
                                this.form.avatar = res.data.data;
                                categoryEdit(this.form).then(data => {
                                    if (data.data.status == 0) {
                                        this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                                        this.$set(this.tableData, this.idx, this.form);
                                    }
                                })
                            }
                        })
                        this.editVisible = false;
                    } else {
                        categoryEdit(this.form).then(data => {
                            if (data.data.status == 0) {
                                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                                this.$set(this.tableData, this.idx, this.form);
                            }
                        })
                        this.editVisible = false;
                    }
                } else {
                    //新增
                    if (this.cropImg == "" || this.form.categoryName == "" || this.form.message == "") {
                        this.$message({
                            type: 'warning',
                            message: '请把信息填写完整'
                        })
                    } else {
                        let formData = new FormData();
                        formData.append('file', this.file);
                        formData.append('type', 'common');
                        uploadFile(formData).then(res => {
                            if (res.data.status == 0) {
                                this.form.avatar = res.data.data;
                                categoryAdd(this.form).then(data => {
                                    if (data.data.status == 0) {
                                        this.$message.success(`新增成功`);
                                        this.getCategory(this.form.parentId);
                                    }
                                })
                            }
                        })
                        this.editVisible = false;
                    }
                }
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageNum', val);
                this.getCategory(this.query.id);
            }
        }
    };
</script>

<style lang="scss">

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

    .yellow {
        color: #262424;
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
