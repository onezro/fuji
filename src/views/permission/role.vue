<template>
  <div class="p-[10px]">
    <el-card shadow="always" :body-style="{ padding: '10px' }">
      <div class="mb-[10px]">
        <el-button type="primary" @click="openAdd">添加</el-button>
      </div>
      <el-table
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        border
        :height="tableHeight"
        stripe
      >
        <el-table-column label="序号" type="index" width="60"></el-table-column>
        <el-table-column label="角色名称" prop="RoleName"> </el-table-column>
        <el-table-column label="描述" prop="description"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <!-- <el-button
              type="primary"
                icon="el-icon-edit"
                size="mini"
              @click="handleEdit(scope.$index, scope.row)"
              >修改</el-button
            > -->

            <el-tooltip content="编辑" placement="top">
              <el-button
                type="primary"
                icon="EditPen"
                size="small"
                @click.prevent="handleAssigned(scope.row)"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                type="danger"
                icon="Delete"
                size="small"
                @click.prevent="handleDelete(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-3">
        <el-pagination
          size="large"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="tableData.length"
        >
        </el-pagination>
      </div>
    </el-card>
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      title="新增"
      v-model="addVisible"
      width="30%"
      @close="addCancel()"
    >
      <el-form :model="form" ref="formRef" label-width="auto">
        <el-form-item label="角色名称" prop="RoleName">
          <el-input v-model="form.RoleName"></el-input>
        </el-form-item>
        <el-form-item label="菜单分配" prop="MenuId">
          <el-tree
            :data="treeData"
            show-checkbox
            node-key="id"
            :props="defaultProps"
            ref="tree"
          >
          </el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="onSubmit()">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      title="编辑"
      v-model="editVisible"
      width="30%"
      @close="editCancel()"
    >
      <el-form :model="editForm" ref="editRef" label-width="auto">
        <el-form-item label="角色名称">
          <el-input v-model="editForm.RoleName"></el-input>
        </el-form-item>
        <el-form-item label="菜单">
          <el-tree
            :data="treeData"
            show-checkbox
            node-key="id"
            :props="{ label: 'title', children: 'childMenu' }"
            ref="tree1"
          >
          </el-tree>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="editSubmit()">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  getAllRole,
  addRole,
  getFirstMeun,
  getMeunRole,
  updateRoleMeun,
  deleteRole,
} from "@/api/permiss";
import { ElMessage, ElMessageBox, ElTree, ElNotification } from "element-plus";
import {
  ref,
  unref,
  nextTick,
  reactive,
  onBeforeMount,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue";

interface Form {
  MenuId: string[];
  RoleName: string;
}
interface EditForm {
  Add: string[];
  Deletes: string[];
  id: string;
  RoleName: string;
}

const tableData = ref<any>([]);
const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const addVisible = ref(false);
const editVisible = ref(false);
const form = reactive<Form>({
  MenuId: [],
  RoleName: "",
});
const editForm = reactive<EditForm>({
  Add: [],
  Deletes: [],
  id: "",
  RoleName: "",
});
const formRef = ref();
const treeData = ref([]);
const defaultProps = ref({ label: "title", children: "childMenu" });
// const tree = ref(null||'');
const tree = ref<InstanceType<typeof ElTree>>();
const tree1 = ref<InstanceType<typeof ElTree>>();
const roleAllMeun = ref<string[]>([]);
const roleData = ref<string[]>([]);

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getData();
  getMeun();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getData = () => {
  getAllRole().then((data: any) => {
    tableData.value = JSON.parse(data.content);
  });
};

const getMeun = () => {
  // this.dialogVisible = true;

  getFirstMeun().then((data: any) => {
    treeData.value = JSON.parse(data.content);
    // console.log(data);
  });
};
const openAdd = () => {
  addVisible.value = !unref(addVisible);
};
const addCancel = () => {
  addVisible.value = false;
  formRef.value.resetFields();
};
const onSubmit = () => {
  form.MenuId = tree.value.getCheckedKeys();
  const prarentTree = tree.value.getHalfCheckedKeys();
  form.MenuId.push(...prarentTree);
  form.MenuId = Array.from(new Set(form.MenuId));
  // console.log(form.MenuId)
  addRole(form).then(() => {
    // console.log(data);
    getData();
    addVisible.value = false;
  });
};
const editCancel = () => {
  editVisible.value = false;
  roleData.value = [];
};
const handleAssigned = (row: any) => {
  editForm.id = row.id;
  editForm.RoleName = row.RoleName;

  editVisible.value = true;
  // console.log(editVisible.value);
  getMeunRole(row.id).then((data: any) => {
    const dataText = JSON.parse(data.content);
    // console.log(dataText);
    dataText.forEach((item: any) => {
      if (item.childMenu!==null) {
        item.childMenu.forEach((i: any) => {
          // console.log(i.childMenu)
          if (i.childMenu == null) {
            roleData.value.push(i.id);
          } else {
            i.childMenu.forEach((v:any)=>{
               roleData.value.push(v.id)
            })
           
            // console.log(i.childMenu);
          }
        });
      } else {
        // console.log(1111)
        roleData.value.push(item.id);
      }
    });
    // console.log(roleData.value);
    tree1.value.setCheckedKeys(roleData.value);
    roleAllMeun.value = [
      ...tree1.value.getCheckedKeys(),
      ...tree1.value.getHalfCheckedKeys(),
    ];
  });
};

const editSubmit = () => {
  let meun = [
    ...tree1.value.getCheckedKeys(),
    ...tree1.value.getHalfCheckedKeys(),
  ];
  console.log(meun);

  comparefunction(roleAllMeun.value, meun);
  // console.log(editForm);
  updateRoleMeun(editForm).then((data: any) => {
    if ((data.code = 100200)) {
      getData();
      roleData.value = [];
      ElNotification({
        title: "修改成功",
        // message: "取消操作",
        type: "success",
      });
    } else {
      ElNotification({
        title: "修改失败",
        message: "data.msg",
        type: "error",
      });
    }
    editVisible.value = false;
  });
};
const comparefunction = (arr1: any, arr2: any) => {
  editForm.Add = [];
  editForm.Deletes = [];
  for (let i = 0; i < arr2.length; i++) {
    let item = arr2[i];
    if (arr1.indexOf(item) === -1) {
      // 在新数据中找不到原来的数据表示这个被移除了
      editForm.Add.push(item);
    }
  }
  // 新数据循环
  for (let i = 0; i < arr1.length; i++) {
    let item = arr1[i];
    if (arr2.indexOf(item) === -1) {
      // 在旧数据中找不到新元素，表示这个元素被添加了
      editForm.Deletes.push(item);
    }
  }
};

const handleDelete = (row: any) => {
  ElMessageBox.confirm("确定删除", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteRole(row.id).then((data: any) => {
        // console.log(res);
        if ((data.code = 100200)) {
          getData();
          ElNotification({
            title: "删除成功",
            // message: "取消操作",
            type: "success",
          });
        } else {
          ElNotification({
            title: "删除失败",
            // message: "取消操作",
            type: "error",
          });
          // this.$message({
          //   type: "error",
          //   message: data.msg,
          // });
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消操作",
      });
      //   ElNotification({
      //     title: "取消操作",
      //     // message: "取消操作",
      //     type: "info",
      //   });
    });
};

const handleSizeChange = (val: any) => {
  currentPage.value = 1;
  pageSize.value = val;
};
const handleCurrentChange = (val: any) => {
  currentPage.value = val;
};
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 220;
  });
};
</script>

<style lang="scss" scoped></style>
<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
