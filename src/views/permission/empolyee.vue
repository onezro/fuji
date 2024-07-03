<template>
  <div class="p-[10px] flex gap-[15px]">
    <el-card shadow="always" :body-style="{ padding: '10px' }" class="w-[250px]">
      <template #header>
      <div class="card-header">
        <span>部门</span>
      </div>
    </template>
     
      <!-- card body -->
    </el-card>
    
    <el-card shadow="always" :body-style="{ padding: '10px' }" class="flex-1">
      <div class="mb-[10px]">
        <el-button type="primary" @click="syncPeople">同步人员</el-button>
        <el-button type="primary" @click="syncOrganizate"
          >同步组织架构</el-button
        >
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
        <el-table-column label="账号" prop="employeeName"> </el-table-column>
        <el-table-column label="员工" prop="fullName"> </el-table-column>

        <el-table-column label="角色" prop="RoleName">
          <template #default="scope">
            <el-tag
              v-for="item in scope.row.RoleName"
              :key="item"
              type="primary"
            >
              {{ item }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120" align="center">
          <template #default="scope">
            <el-tooltip content="编辑" placement="top">
              <el-button
                type="primary"
                icon="EditPen"
                size="small"
                @click="handleEdit(scope.row)"
              />
            </el-tooltip>
            <!-- <el-tooltip content="删除" placement="top">
              <el-button
                type="danger"
                icon="Delete"
                size="small"
                @click="handleDelete(scope.row)"
              />
            </el-tooltip> -->
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
      title="角色添加"
      v-model="addVisible"
      width="30%"
      @close="addCancel()"
    >
      <el-form :model="form" ref="formRef" label-width="auto">
        <el-form-item label="员工" prop="roleName">
          <el-input v-model="roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前角色" prop="role">
          <el-tag
            :key="tag.Id"
            v-for="tag in hasRole"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag.RoleName }}
          </el-tag>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select
            v-model="form.roleId"
            placeholder="请选择角色"
            clearable=""
          >
            <el-option
              v-for="item in noRole"
              :key="item.value"
              :label="item.lable"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
        <el-form-item label="员工名" prop="FullName">
          <el-input
            v-model="editForm.FullName"
            placeholder="请输入员工名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="EmployeeName">
          <el-input
            v-model="editForm.EmployeeName"
            placeholder="请输入账号"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="DocManagerUser">
          <el-input
            v-model="editForm.DocManagerUser"
            placeholder="请输入密码"
            clearable
          ></el-input>
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

<script setup lang="ts">
import { getToken } from "@/utils/auth";
import {
  getAllRole,
  getEmployee,
  findEmployeeRoles,
  addEmployeeRole,
  deletefirstRole,
  deleteEmployee,
  addEmployee,
} from "@/api/permiss";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import {
  ref,
  unref,
  nextTick,
  reactive,
  onBeforeMount,
  watch,
  onMounted,
  computed,
  onBeforeUnmount,
} from "vue";

interface Tag {
  Id: string;
  RoleName: string;
}

interface Optiotpe {
  value: string;
  lable: string;
}
interface Table {
  employeeId: string;
  employeeName: string;
  fullName: string;
  RoleName: string[];
}
interface EditForm {
  EmployeeId: string;
  EmployeeName: string;
  CanLogin: number;
  FullName: string;
  DocManagerUser: string;
  IsDelete: string;
  CreateBy: string;
  CreateDate: string;
  UpdateBy: string;
  UpdateDate: string;
}

const tableData = ref<Table[]>([]);
const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const addVisible = ref(false);
const editVisible = ref(false);
const formRef = ref();
const form = ref({
  employeeId: "",
  id: 0,
  roleId: "",
  IsDelete: "",
  CreateBy: getToken(),
  CreateDate: "",
  UpdateBy: "",
  UpdateDate: "",
});
const hasRole = ref<Tag[]>([]);
const roleName = ref("");
const optionArr = ref<Optiotpe[]>([]);
const editForm = reactive<EditForm>({
  EmployeeId: "",
  EmployeeName: "",
  CanLogin: 1,
  FullName: "",
  DocManagerUser: "",
  IsDelete: "",
  CreateBy: "",
  CreateDate: "",
  UpdateBy: getToken() || "",
  UpdateDate: "",
});
const editRef = ref();

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getData();
  getRoleMeun();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const noRole = computed(() => {
  // console.log( hasRole.value)
  const data = optionArr.value.filter(
    (item: any) => !hasRole.value.some((ele) => ele.Id == item.value)
  );
  // console.log(data, hasRole.value);
  return data;
});

const getData = () => {
  getEmployee().then((data: any) => {
    // this.tableData = data;
    dataPrecc(JSON.parse(data.content));
    // })
  });
};

const getRoleMeun = () => {
  getAllRole().then((data: any) => {
    const dataText = JSON.parse(data.content);
    optionArr.value = dataText.map((item: any) => {
      return {
        value: item.id,
        lable: item.RoleName,
      };
    });
    // console.log(optionArr.value);
  });
  // console.log(optionArr.value);
};
const editCancel = () => {
  editVisible.value = false;
  editRef.value.resetFields();
};
const editSubmit = () => {
  addEmployee(editForm).then((data: any) => {
    if (data.code == 100200) {
      getData();
      editVisible.value = false;
      ElNotification({
        title: "添加成功",
        // message: "取消操作",
        type: "success",
      });
    }
  });
};

const getHasRole = () => {
  findEmployeeRoles(form.value.employeeId).then((data: any) => {
    if (data.code == 100200) {
      //  console.log(data);
      hasRole.value = JSON.parse(data.content);
    } else {
      ElMessage({
        type: "error",
        message: data.msg,
      });
    }
  });
};
const openAdd = () => {
  editVisible.value = true;
};
const syncPeople = () => {};
const syncOrganizate = () => {};
const dataPrecc = (data: any) => {
  console.log(data);
  let beforeData = data; //将dataArr赋值给beforeData  也可直接操作dataArr
  let tempArr = [];
  let afterData = []; //新数组
  for (let i = 0; i < beforeData.length; i++) {
    if (tempArr.indexOf(beforeData[i].EmployeeId) === -1) {
      // console.log(beforeData[i].RoleName);
      afterData.push({
        employeeId: beforeData[i].EmployeeId,
        employeeName: beforeData[i].EmployeeName,
        fullName: beforeData[i].FullName,
        RoleName:
          beforeData[i].RoleName == null ? [] : [beforeData[i].RoleName],
      });
      tempArr.push(beforeData[i].EmployeeId);
    } else {
      // console.log(1)
      for (let j = 0; j < afterData.length; j++) {
        if (afterData[j].employeeId == beforeData[i].EmployeeId) {
          afterData[j].RoleName.push(beforeData[i].RoleName);
          break;
        }
      }
    }
  }
  tableData.value = afterData;
};

const handleEdit = (row: any) => {
  // console.log(row);
  addVisible.value = true;
  roleName.value = row.fullName;
  // form.value.roleId = row.RoleId;
  form.value.employeeId = row.employeeId;
  findEmployeeRoles(row.employeeId).then((data: any) => {
    if (data.code == 100200) {
      //  console.log(data);
      const dataText = JSON.parse(data.content);

      hasRole.value = dataText;
      // console.log(dataText)
      // addVisible.value = true;
      // roleName.value = row.fullName;
      // // form.value.roleId = row.RoleId;
      // form.value.employeeId = row.employeeId;
    } else {
      // this.$message({
      //   type: "error",
      //   message: data.msg,
      // });
    }
  });
};
const addCancel = () => {
  addVisible.value = false;
};
const onSubmit = () => {
  if (
    form.value.roleId == "" ||
    form.value.roleId == undefined ||
    form.value.roleId == null
  ) {
    addVisible.value = false;
    formRef.value.resetFields();
    // console.log(this.form.roleId);
  } else {
    console.log(form.value);
    addEmployeeRole(form.value).then((res) => {
      getData();
      addVisible.value = false;
      formRef.value.resetFields();
    });
  }
};

const handleClose = (tag: any) => {
  ElMessageBox.confirm("确定删除", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deletefirstRole({
        EmpId: form.value.employeeId,
        RoleId: tag.Id,
      }).then((data: any) => {
        // console.log(data);
        if ((data.code = 100200)) {
          getHasRole();
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

const handleDelete = (row: any) => {
  ElMessageBox.confirm("确定删除", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteEmployee(row.employeeId).then((data: any) => {
        if (data.code == 100200) {
          // console.log()
          // getHasRole();
          getData();
          //  console.log(data);
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
    tableHeight.value = window.innerHeight - 215;
  });
};
</script>
<style scoped>
.el-pagination {
  justify-content: center;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
