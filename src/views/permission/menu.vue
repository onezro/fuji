<template>
  <div class="p-[10px]">
    <el-card shadow="always" :body-style="{ padding: '10px' }">
      <div class="mb-[10px]">
        <el-button type="primary" @click="openAdd">添加</el-button>
      </div>
      <div class="w-full">
        <el-table
          :data="tableData"
          stripe
          border
          fit
          :height="tableHeight"
          row-key="id"
          :tree-props="{ children: 'childMenu' }"
        >
          <!-- <el-table-column label="序号" width="60px" type="index" align="center" /> -->
          <el-table-column prop="title" label="菜单名称"> </el-table-column>
          <el-table-column prop="icon" label="图标" align="center">
          </el-table-column>
          <el-table-column prop="component" label="组件路径" align="center">
          </el-table-column>
          <el-table-column prop="path" label="链接路径" align="center">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="120"
            align="center"
          >
            <template #default="scope">
              <el-tooltip content="编辑" placement="top">
                <el-button
                  type="primary"
                  icon="EditPen"
                  size="small"
                  @click.prevent="handleEdit(scope.row)"
                ></el-button>
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
      </div>
    </el-card>
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      v-model="addVisible"
      title="新增"
      width="30%"
    >
      <el-form
        ref="formRef"
        :model="form"
        label-position="left"
        label-width="auto"
      >
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="tabPosition" aria-label="label position">
            <el-radio-button value="目录">目录</el-radio-button>
            <el-radio-button value="菜单">菜单</el-radio-button>
          </el-radio-group></el-form-item
        >
        <el-form-item label="父级菜单" prop="">
          <el-select
            ref="selectUpResId"
            v-model="chooseName"
            placeholder="请选择"
            clearable
          >
            <el-option
              :value="chooseName"
              disabled
              style="overflow: auto; height: 100%"
            >
              <el-tree
                style="min-height: 150px; max-height: 300px"
                :props="defaultProps"
                :data="tableData"
                node-key="id"
                :expand-on-click-node="false"
                :check-on-click-node="true"
                @node-click="handleNodeClick"
              >
              </el-tree
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="type"
          ><el-input v-model="form.title" placeholder="请输入"
        /></el-form-item>
        <el-form-item label="图标" prop="time"
          ><el-input v-model="form.icon" placeholder="请输入"
        /></el-form-item>
        <el-form-item label="链接路径" prop=""
          ><el-input v-model="form.path" placeholder="请输入"
        /></el-form-item>
        <el-form-item label="路由名称" prop=""
          ><el-input v-model="form.MenuName" placeholder="请输入"
        /></el-form-item>
        <el-form-item label="重定向" prop=""
          ><el-input v-model="form.redirect" placeholder="请输入"
        /></el-form-item>
        <el-form-item label="组件路径" prop=""
          ><el-input
            :disabled="fmeun"
            v-model="form.component"
            placeholder="请输入"
        /></el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="onSubmit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      title="修改"
      :append-to-body="true"
      :close-on-click-modal="false"
      @close="editCancel()"
      v-model="editVisible"
      width="50%"
    >
      <el-form :model="editForm"  label-width="auto">
        <!-- <el-form-item label="父级菜单">
          <el-select
            ref="selectUpResId"
            v-model="editPName"
            placeholder="请选择"
            clearable
          >
            <el-option
              :value="editPName"
              disabled
              style="overflow: auto; height: 100%"
            >
              <el-tree
                style="min-height: 150px; max-height: 300px"
                :props="defaultProps"
                :data="tableData"
                node-key="id"
                :expand-on-click-node="false"
                :check-on-click-node="true"
                @node-click="handleENodeClick"
              >
              </el-tree
            ></el-option>
          </el-select>
        
        </el-form-item> -->
        <el-form-item label="路径">
          <el-input v-model="editForm.path" placeholder="路径"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称">
          <el-input v-model="editForm.title" placeholder="菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="组件">
          <el-input
            :disabled="fmeun"
            v-model="editForm.component"
            placeholder="组件"
          ></el-input>
        </el-form-item>
        <el-form-item label="组件名称">
          <el-input
            v-model="editForm.MenuName"
            placeholder="组件名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="editForm.icon" placeholder="图标"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editSubmit()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox, ElTree } from "element-plus";
import { getFirstMeun, addMeun, deleteMeun, updateMeun } from "@/api/permiss";
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
const tableData = ref([]);
const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const addVisible = ref(false);
const editVisible = ref(false);
const tabPosition = ref("菜单");
const chooseName = ref("");
const fmeun = ref(false);
const selectUpResId = ref<any>(null);
const defaultProps = reactive({ label: "title", children: "childMenu" });
const form = reactive({
  title: "",
  icon: "",
  path: "",
  MenuName: "",
  component: "",
  MenuLevel: 0,
  MenuFID: "",
  redirect: "",
  sonNum: 0,
});
let editForm = reactive({
  path: "",
  title: "",
  component: "",
  MenuName: "",
  icon: "",
  MenuFID: "",
  MenuLevel: "",
  id:''
});
const editPName = ref();
const editid = ref();
const arrID = ref([] as any[]);
onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getData();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

watch(
  () => tabPosition.value,
  (newValue) => {
    if (newValue == "目录") {
      fmeun.value = false;
      form.MenuLevel = 1;
      // form.component = "Layout";
    } else {
      fmeun.value = false;
      form.component = "";
    }
  }
);

const getData = () => {
  getFirstMeun().then((data: any) => {
    // console.log(JSON.parse(data.content));
    tableData.value = JSON.parse(data.content);
  });
};
const openAdd = () => {
  addVisible.value = !unref(addVisible);
};
const handleNodeClick = (data: any) => {
  chooseName.value = data.title;
  form.MenuFID = data.id;
  form.MenuLevel = data.MenuLevel + 1;
  selectUpResId.value.blur();
};
const onSubmit = () => {
  // console.log(form);
  addMeun(form).then((res) => {
    // console.log(res.data);
    getData();
    addVisible.value = false;
  });
};
const handleEdit = (row: any) => {
  // console.log(row);
  const data = row;
  delete data.childMenu;
  // console.log(data)
  editForm.MenuFID=row.MenuFID
  editForm.MenuLevel=row.MenuLevel
  editForm.MenuName=row.MenuName
  editForm.component=row.component
  editForm.icon=row.icon
  editForm.path=row.path
  editForm.title=row.title
  editForm.id=row.id

  editVisible.value = true;
  if (row.MenuFID != null) {
    // console.log(row.MenuFID)
    editid.value = row.MenuFID;
    editPName.value = findNameById(row.MenuFID, tableData.value);
    // console.log( editPName.value)
  }
};
const handleENodeClick = (data: any) => {
  editPName.value = data.title;
  editForm.MenuFID = data.id;
  editForm.MenuLevel = data.MenuLevel;
  selectUpResId.value.blur();
};
const handleDelete = (row: any) => {
  
  ElMessageBox.confirm("确定删除", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // console.log(row.id)
      arrID.value.unshift(row.id);
      // row.sonNum!=null? dataDispose(row):false
      console.log(arrID.value);
      arrID.value.forEach((item) => {
        deleteMeun(item).then(({ data }) => {
          // console.log(data);
          arrID.value = arrID.value.filter((id) => id != item);
          // console.log(this.arrID);
          if (arrID.value.length == 0) {
            getData();
          }
        });
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消操作",
      });
    });
};
const editCancel = () => {
  editVisible.value = false;
};
const editSubmit = () => {
  updateMeun(editForm).then((res) => {
    // console.log(res);
    editVisible.value = false;
    getData();
  });
};
const findNameById = (id: any, data: any) => {
  data.forEach((x: any, i: any) => {
    if (data[i].id == id) {
      console.log(data[i].title);
      return data[i].title; //名称
    } else if (data[i].childMenu) {
      const resultData = void findNameById(id, data[i].childMenu);
      if (resultData) {
        return resultData;
      }
    }
  });
};
const dataDispose = (row: any) => {
  // console.log(row.sonNum)
  if (row.sonNum != null) {
    
    row.childMenu.forEach((item: any) => {
      arrID.value.unshift(row.id);
      if (item.sonNum != 0) {
        return dataDispose(item);
      }
    });
  } else {
    return;
  }
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
    //后面的50：根据需求空出的高度，自行调整
  });
};
</script>

<style lang="scss" scoped></style>
<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
