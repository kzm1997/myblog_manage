<template>
    <div class="sidebar">
        <el-menu
                class="sidebar-el-menu"
                :default-active="onRoutes"
                :collapse="collapse"
                unique-opened
                router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                    v-if="subItem.subs"
                                    :index="subItem.index"
                                    :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                        v-for="(threeItem,i) in subItem.subs"
                                        :key="i"
                                        :index="threeItem.index"
                                >{{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                    v-else
                                    :index="subItem.index"
                                    :key="subItem.index"
                            >{{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';

    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'icon-backshouye iconfont',
                        index: 'dashboard',
                        title: '系统首页'
                    },
                    {
                        icon: 'icon-backxitongcanshu iconfont',
                        index: 'front',
                        title: '前台管理',
                        subs: [
                            {
                                index: 'userfront',
                                title: '用户管理'
                            },
                            {
                                index: 'articlefront',
                                title: '文章管理'
                            },
                            {
                                index: 'commentfront',
                                title: '评论管理'
                            },
                            {
                                index:'categoryfront',
                                title:'分类管理'
                            }
                        ]
                    },
                    {
                        icon: 'iconfont icon-backxitongjiankong',
                        index: 'back',
                        title: '后台管理',
                        subs: [
                            {
                                index: 'user',
                                title: '用户管理'
                            },
                            {
                                index: 'role',
                                title: '角色管理',
                            },
                            {
                                index: 'menu',
                                title: '菜单管理'
                            },
                            {
                                index:'sys',
                                title: '系统营销'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-warn',
                        index: '7',
                        title: '错误处理',
                        subs: [
                            {
                                index: 'permission',
                                title: '权限测试'
                            },
                            {
                                index: '404',
                                title: '404页面'
                            }
                        ]
                    }
                ]
            };
        },
        computed: {
            onRoutes() {
                return this.$route.path.replace('/', '');
            }
        },
        created() {
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
                bus.$emit('collapse-content', msg);
            });
        }
    };
</script>

<style scoped lang="scss">
    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom: 0;
        overflow-y: scroll;
    }
    .icon-backxitongcanshu{
        margin-right: 10px;
    }
    .icon-backxitongjiankong{
        margin-right: 10px;
    }
    .icon-backshouye{
        margin-right: 10px;
    }


    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 250px;
    }

    .sidebar > ul {
        height: 100%;
    }
</style>
