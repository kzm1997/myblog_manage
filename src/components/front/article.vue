<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 文章管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">

                <el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                    :data="tableData"
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="商品名称">
                                <span>{{ props.row.name }}</span>
                            </el-form-item>
                            <el-form-item label="所属店铺">
                                <span>{{ props.row.shop }}</span>
                            </el-form-item>
                            <el-form-item label="商品 ID">
                                <span>{{ props.row.id }}</span>
                            </el-form-item>
                            <el-form-item label="店铺 ID">
                                <span>{{ props.row.shopId }}</span>
                            </el-form-item>
                            <el-form-item label="商品分类">
                                <span>{{ props.row.category }}</span>
                            </el-form-item>
                            <el-form-item label="店铺地址">
                                <span>{{ props.row.address }}</span>
                            </el-form-item>
                            <el-form-item label="商品描述">
                                <span>{{ props.row.desc }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="文章名"></el-table-column>
                <el-table-column label="作者">
                    <template slot-scope="scope">￥{{scope.row.money}}</template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                                :type="scope.row.state==='成功'?'success':(scope.row.state==='失败'?'danger':'')"
                        >未审核</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="date" label="注册时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                        >审核内容</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="推荐" width="180" align="center">
                    <template slot-scope="scope">
                        <el-switch
                                v-model="value"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                        </el-switch>
                    </template>
                </el-table-column>

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

        <!-- 编辑弹出框 -->
        <el-dialog title="文章内容" :visible.sync="editVisible" width="60%">
             <div v-html="content" class="markdown-body">
             </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">审核通过</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { fetchData } from '../../api/index';
    import 'github-markdown-css/github-markdown.css';
    import marked from 'marked'
    export default {
        name: 'basetable',
        data() {
            return {
                query: {
                    name: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1,
                content:''
            };
        },
        created() {
            this.getData();
            this.getArticle();
        },
        methods: {
            // 获取 easy-mock 的模拟数据

            getArticle(){
                  this.content=  marked('# 分支的新建与合并\n' +
                    '现在让我们来看一个简单的分支与合并的例子，实际工作中大体也会用到这样的工作流程:  \n' +
                    '1. 开发某个网站。\n' +
                    '2. 为实现某个新的需求，创建一个分支。\n' +
                    '3. 在这个分支上开展工作  \n' +
                    '\n' +
                    '假设此时，你突然接到一个电话说有个很严重的问题需要紧急修补，那么可以按照下面的方式处理：  \n' +
                    '1. 返回到原先已经发布到生产服务器上的分支。\n' +
                    '2. 为这次紧急修补建立一个新分支，并在其中修复问题。\n' +
                    '3. 通过测试后，回到生产服务器所在的分支，将修补分支合并进来，然后再推送到生产服务器上。\n' +
                    '4. 切换到之前实现新需求的分支，继续工作。\n' +
                    '\n' +
                    '**分支的新建与切换**  \n' +
                    '首先，我们假设你正在项目中愉快地工作，并且已经提交了几次更新  \n' +
                    '![image](https://git-scm.com/figures/18333fig0310-tn.png)  \n' +
                    '为了开发新功能,你创建了iss53分支,并切换到该分支,执行**git checkout -b iss53**  \n' +
                    '![image](https://git-scm.com/figures/18333fig0311-tn.png)  \n' +
                    '当你对新功能分支多次提交后:  \n' +
                    '![image](https://git-scm.com/figures/18333fig0312-tn.png)  \n' +
                    '\n' +
                    '此时有个bug需要你解决,你需要切换到master分支,但是在切换之前,你需要注意: **保证你当前分支的所有修改都已经提交**,或者你也可以绕过这种问题.  \n' +
                    '\n' +
                    '现在为了修布bug,你回到master分支并创建了一个hotfix分支,当你修改完并提交后,大概是这样:  \n' +
                    '![image](https://git-scm.com/figures/18333fig0313-tn.png)  \n' +
                    '回到master分支并把它合并进来,然后发布到生产服务器,用**git merge 分支名**命令来进行合并,此时master分支和hotfix分支指向同一位置:  \n' +
                    '![image](https://git-scm.com/figures/18333fig0314-tn.png)  \n' +
                    '现在可以删除hotfix分支,现在回到之前未完成的 #53 问题修复分支上继续工作  \n' +
                    '![image](https://git-scm.com/figures/18333fig0315-tn.png)  \n' +
                    '值得注意的是之前hotfix分支的修改内容尚未包含到iss53中来,如果需要纳入此次修补,可以用git merge master把master分支合并到iss53;或者等iss53完成之后,再将iss53分支中的更新并入master.  \n' +
                    '\n' +
                    '**分支的合并**  \n' +
                    '此时你想把iss53分支合并到master分支中,这次合并操作的底层实现,并不同于之前hotfix的并入方式,因为这次你的开发历史是从更早的地方开始分叉的,由于当前master分支所指向的提交对象c4并不是iss53的直接祖先,git不得不进行一些额外处理,就此列而言,git会用两个分支的末端(c4和c5)以及他们的共同祖先c2进行一次简单的三方合并计算.  \n' +
                    '这次git没有简单的把分支指针右移,而是对三方合并后的结果重新做一个新的快照,并自动创建一个指向他的提交对象c6,这个提交对象有两个祖先c4和c5.  \n' +
                    '![image](https://git-scm.com/figures/18333fig0317-tn.png)  \n' +
                    '\n' +
                    '**遇到冲突时的分支合并**  \n' +
                    '如果在不同的分支中都修改了同一个文件的同一部分，Git 就无法干净地把两者合到一起,如果你在解决问题 #53 的过程中修改了 hotfix 中修改的部分，将得到类似下面的结果： \n' +
                    '```git\n' +
                    '$ git merge iss53\n' +
                    'Auto-merging index.html\n' +
                    'CONFLICT (content): Merge conflict in index.html\n' +
                    'Automatic merge failed; fix conflicts and then commit the result.\n' +
                    '```\n' +
                    'Git 作了合并，但没有提交，它会停下来等你解决冲突。要看看哪些文件在合并时发生冲突，可以用 git status 查阅：  \n' +
                    '```git\n' +
                    '$ git status\n' +
                    'On branch master\n' +
                    'You have unmerged paths.\n' +
                    '  (fix conflicts and run "git commit")\n' +
                    '\n' +
                    'Unmerged paths:\n' +
                    '  (use "git add <file>..." to mark resolution)\n' +
                    '\n' +
                    '        both modified:      index.html\n' +
                    '\n' +
                    'no changes added to commit (use "git add" and/or "git commit -a")\n' +
                    '```\n' +
                    '任何包含未解决冲突的文件都会以未合并（unmerged）的状态列出。Git 会在有冲突的文件里加入标准的冲突解决标记，可以通过它们来手工定位并解决这些冲突。可以看到此文件包含类似下面这样的部分：\n' +
                    '```git\n' +
                    '<<<<<<< HEAD\n' +
                    '<div id="footer">contact : email.support@github.com</div>\n' +
                    '=======\n' +
                    '<div id="footer">\n' +
                    '  please contact us at support@github.com\n' +
                    '</div>\n' +
                    '>>>>>>> iss53\n' +
                    '```\n' +
                    '可以看到 ======= 隔开的上半部分，是 HEAD（即 master 分支，在运行 merge 命令时所切换到的分支）中的内容，下半部分是在 iss53 分支中的内容。解决冲突的办法无非是二者选其一或者由你亲自整合到一起。  \n' +
                    '删除<<<<<<,=====和>>>>>这些行,并解决了冲突后,运行**git add**命令将他们标记为已解决状态,因为一旦暂存,就表示冲突已经解决.然后就可以commit了.\n' +
                    '\n' +
                    '\n')
            },
            getData() {
                fetchData(this.query).then(res => {
                    console.log(res);
                    this.tableData = res.list;
                    this.pageTotal = res.pageTotal || 50;
                });
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
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
                    .catch(() => {});
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

<style scoped>
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
