<template>
    <div class="p-2">
        <el-card :body-style="{ padding: '8px' }">
            <el-form ref="formRef" :model="getForm" :inline="true" label-width="auto" size="small">
                <el-form-item :label="$t('oqcInspection.OQCNumber')" class="mb-2">
                    <el-input style="width: 180px" v-model="getForm.OQCNumber" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.workerOrder')" class="mb-2">
                    <el-input style="width: 180px" v-model="getForm.MfgOrderName" placeholder="" clearable></el-input>
                </el-form-item>

                <el-form-item :label="$t('oqcInspection.creatTime')" class="mb-2"><el-date-picker :shortcuts="shortcuts"
                        v-model="searchDate" value-format="YYYY-MM-DD" type="daterange" range-separator="-" size="small"
                        style="width: 200px" :clearable="false" :disabled-date="disabledDate" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.inspectionStatus')" class="mb-2">
                    <el-select v-model="getForm.InspectionStatus" placeholder="" style="width: 180px" clearable>
                        <el-option :label="'全部'" :value="''">
                        </el-option>
                        <el-option :label="'待检验'" :value="1">
                        </el-option>
                        <el-option :label="t('oqcInspection.status3')" :value="2">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('oqcInspection.productCategory')" class="mb-2">
                    <el-input style="width: 180px" v-model="getForm.ProductType" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.productName')" class="mb-2">
                    <el-input style="width: 180px" v-model="getForm.ProductName" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.customerName')" class="mb-2">
                    <el-input style="width: 180px" v-model="getForm.ToCustomerName" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.customerPO')" class="mb-2">
                    <el-input style="width: 200px" v-model="getForm.PartNo" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.customerPN')" class="mb-2">
                    <el-input style="width: 180px" v-model="getForm.CustomerPN" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.LOtNO')" class="mb-2">
                    <el-input style="width: 180px" v-model="getForm.LotNo" placeholder="" clearable></el-input>
                </el-form-item>

                <el-form-item class="mb-2">
                    <el-button type="primary" size="small" @click="getData">
                        {{ $t("publicText.query") }}
                    </el-button>
                    <el-button type="info" size="small">
                        {{ $t("publicText.reset") }}
                    </el-button>
                    <!-- <el-button type="warning" size="small" @click="openAdd">
                        {{ $t("publicText.add") }}
                    </el-button> -->
                    <!-- <el-button type="success" size="small" @click="testClick">
                        导出Excel
                    </el-button> -->
                    <el-button type="warning" size="small" @click="handleOpenSplit"
                        :disabled="selectionList.length !== 1">

                        {{ '拆分' }}
                    </el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableData.slice(
                (pageObj.currentPage - 1) * pageObj.pageSize,
                pageObj.currentPage * pageObj.pageSize
            )
                " size="small" :style="{ width: '100%' }" ref="rawRef" :height="tableHeight" border fit
                highlight-current-row @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
                            }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="OQCNumber" :label="$t('oqcInspection.OQCNumber')" width="200">
                </el-table-column>
                <el-table-column prop="MfgOrder" :label="$t('oqcInspection.workerOrder')" />
                <el-table-column prop="Customer" :label="$t('oqcInspection.customerName')" />
                <el-table-column prop="ProductName" :label="$t('oqcInspection.productName')" width="130" />
                <el-table-column prop="ProductType" :label="$t('oqcInspection.productCategory')" />
                <el-table-column prop="CustomerPO" :label="$t('oqcInspection.customerPO')" width="130" />
                <el-table-column prop="CustomerPN" :label="$t('oqcInspection.customerPN')" width="130" />
                <el-table-column prop="LotNo" :label="$t('oqcInspection.LOtNO')" />
                <el-table-column prop="InspectionStatus" :label="$t('oqcInspection.inspectionStatus')" />
                <el-table-column prop="ApprovalStatus" :label="$t('oqcInspection.ApprovalStatus')" />
                <el-table-column prop="Date" :label="$t('oqcInspection.Date')" width="100" />
                <el-table-column prop="ShippingQty" :label="$t('oqcInspection.ShippingQty')" width="100" />
                <el-table-column prop="QtyShiped" :label="$t('oqcInspection.QtyShiped')" width="100" />
                <el-table-column prop="TotalEvaluation" :label="$t('oqcInspection.TotalEvaluation')" width="150" />
                <el-table-column prop="SpecificationNo" :label="$t('oqcInspection.SpecificationNo')" />
                <el-table-column prop="OrderTypeName" :label="$t('oqcInspection.OrderTypeName')" width="100" />
                <el-table-column prop="CreateUser" :label="$t('oqcInspection.CreateUser')" width="110" />
                <el-table-column prop="CreateTime" :label="$t('oqcInspection.CreateTime')" width="150" />
                <el-table-column prop="UpdateUser" :label="$t('oqcInspection.UpdateUser')" width="110" />
                <el-table-column prop="UpdateTime" :label="$t('oqcInspection.UpdateTime')" width="150" />
                <el-table-column :label="$t('publicText.operation')" width="70" fixed="right" align="center">
                    <template #default="scope">
                        <el-tooltip :content="$t('publicText.look')" placement="top">
                            <el-button type="primary" icon="Document" size="small"
                                @click.stop="handleEdit(scope.row)"></el-button>
                        </el-tooltip>
                        <!-- <el-tooltip :content="$t('publicText.look')" placement="top">
                            <el-button type="primary" icon="Reading" size="small"
                                @click.stop="handleEdit(scope.row)"></el-button>
                        </el-tooltip> -->
                    </template>
                </el-table-column>

                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>
            <div class="mt-2">
                <el-pagination :size="'small'" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="pageObj.currentPage"
                    :page-size="pageObj.pageSize" :page-sizes="[30, 50, 100, 200, 300]"
                    layout="total,sizes, prev, pager, next" :total="tableData.length">
                </el-pagination>
            </div>
        </el-card>
        <el-dialog v-model="addVisible" align-center title="新增OQC" width="500px" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" @close="handleAddClose">
            <el-form ref="addFormRef" :model="addForm" label-width="auto" :size="'small'" @submit.native.prevent>
                <el-form-item :label="$t('oqcInspection.workerOrder')" prop="MfgOrderName">
                    <el-input v-model="addForm.MfgOrderName" placeholder="" style="width: 200px"
                        @keyup.enter.native="getChange" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.OrderQt')" prop="OrderQty">
                    <el-input v-model="addForm.OrderQty" placeholder="" style="width: 200px" type="number" disabled />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.ShippingQty')" prop="ShippingQty">
                    <el-input-number v-model="addForm.ShippingQty" :min="0" style="width: 200px" />
                    <!-- <el-input v-model="addForm.ShippingQty" placeholder="" style="width: 200px" type="number" /> -->
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.RemainingQty')" prop="RemainingQty">
                    <el-input-number v-model="addForm.RemainingQty" :min="0" style="width: 200px" />
                    <!-- <el-input v-model="addForm.RemainingQty" placeholder="" style="width: 200px" type="number" /> -->
                </el-form-item>

                <el-form-item :label="$t('oqcInspection.customerPO')" prop="PartNo">
                    <el-input v-model="addForm.PartNo" placeholder="" style="width: 200px" disabled />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.customerPN')" prop="CustomerPN">
                    <el-input v-model="addForm.CustomerPN" placeholder="" style="width: 200px" disabled />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.LOtNO')" prop="LotNo">
                    <el-input v-model="addForm.LotNo" placeholder="" style="width: 200px" disabled />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.TotalEvaluation')" prop="TotalEvaluation">
                    <el-input v-model="addForm.TotalEvaluation" placeholder="" style="width: 200px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.productName')" prop="ProductName">
                    <el-input v-model="addForm.ProductName" placeholder="" style="width: 200px" disabled />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.productCategory')" prop="ProductType">
                    <el-input v-model="addForm.ProductType" placeholder="" style="width: 200px" disabled />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.customerName')" prop="ToCustomerName">
                    <el-input v-model="addForm.ToCustomerName" placeholder="" style="width: 200px" disabled />
                </el-form-item>

                <!-- <el-form-item :label="$t('oqcInspection.Date')" prop="Date">
                     <el-input v-model="addForm.Date" placeholder="" style="width: 200px"  />
                </el-form-item> -->
            </el-form>
            <template #footer>
                <el-button @click="handleAddClose">{{
                    $t("publicText.close")
                    }}</el-button>
                <el-button @click="handleAddConfirm" type="primary">{{
                    $t("publicText.confirm")
                    }}</el-button>
            </template>
        </el-dialog>

        <el-dialog v-model="inspectVisible" :title="'检验'" width="95%" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center @close="handleInspectClose">
            <el-form ref="headerFormRef" :model="headerForm" label-width="auto" :inline="true" :size="'small'">
                <el-form-item :label="'OQC单号'" prop="OQCNumber">
                    <el-input v-model="headerForm.OQCNumber" placeholder="" style="width: 200px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="'工单号'" prop="MfgOrderName">
                    <el-input v-model="headerForm.MfgOrderName" placeholder="" style="width: 200px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="'产品名称'" prop="ProductName">
                    <el-input v-model="headerForm.ProductName" placeholder="" style="width: 200px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="'产品名称'" prop="ProductName">
                    <el-input v-model="headerForm.ProductName" placeholder="" style="width: 200px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="'客户名称'" prop="ToCustomerName">
                    <el-input v-model="headerForm.ToCustomerName" placeholder="" style="width: 200px"
                        :disabled="true" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.customerPN')" prop="PartNo">
                    <el-input v-model="headerForm.PartNo" placeholder="" style="width: 200px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.LOtNO')" prop="LotNo">
                    <el-input v-model="headerForm.LotNo" placeholder="" style="width: 200px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.materialSource')" prop="MaterialSource">
                    <el-input v-model="headerForm.MaterialSource" placeholder="" style="width: 200px"
                        :disabled="true" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.ShippingQty')" prop="QtyShiped">
                    <el-input v-model="headerForm.ShippingQty" placeholder="" style="width: 200px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.QtyShiped')" prop="QtyShiped">
                    <el-input v-model="headerForm.QtyShiped" placeholder="" style="width: 200px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.RemainingQty')" prop="RemainingQty">
                    <el-input v-model="headerForm.RemainingQty" placeholder="" style="width: 200px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.OrderQty')" prop="OrderQty">
                    <el-input v-model="headerForm.OrderQty" placeholder="" style="width: 200px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.TotalEvaluation')" prop="TotalEvaluation">
                    <el-input v-model="headerForm.TotalEvaluation" placeholder="" style="width: 200px"
                        :disabled="true" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.Date')" prop="Date">
                    <el-input v-model="headerForm.Date" placeholder="" style="width: 200px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="'AC'" prop="AC">
                    <el-input v-model="DetailInfoForm.AC" placeholder="" style="width: 200px" disabled />
                </el-form-item>
                <el-form-item :label="'RE'" prop="RE">
                    <el-input v-model="DetailInfoForm.RE" placeholder="" style="width: 200px" disabled />
                </el-form-item>
                <!-- <el-form-item>
                 
                </el-form-item> -->
            </el-form>
            <el-table :data="eqTable" border stripe style="width: 100%" size="small" :height="150">
                <el-table-column prop="ResourceName" :label="$t('oqcInspection.instrumentName')">
                    <template #default="{ row }">
                        <el-select v-model="row.ResourceName" placeholder="" style="width: 200px" :size="'small'">
                            <el-option v-for="item in eqList" :key="item.ResourceId" :label="item.ResourceName"
                                :value="item.ResourceName">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="StatusText" :label="$t('oqcInspection.instrumenStatus')">
                    <template #default="{ row }">
                        <el-select v-model="row.Status" placeholder="" style="width: 200px" :size="'small'">
                            <el-option label="Y" :value="0" />
                            <el-option label="N" :value="1" />
                        </el-select>
                    </template>
                </el-table-column>
                <!-- <el-table-column :label="$t('publicText.operation')" width="120" align="center">
                    <template #default="{ row, $index }">
                        <el-button v-if="isLastRow($index)" :size="'small'" :type="'primary'" icon="Plus"
                            @click="addEqRow"></el-button>
                        <el-button type="danger" icon="Delete" size="small" @click="removeEqRow(row)"></el-button>

                    </template>
                </el-table-column> -->
            </el-table>

            <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane :label="'计数检验'" name="first">
                    <el-table :data="CountTable" border stripe style="width: 100%" size="small" :height="300">
                        <el-table-column prop="ProjectCategoryName" :label="$t('aqlrules.ProjectCategoryName')">
                        </el-table-column>
                        <el-table-column prop="ProjectName" :label="$t('aqlrules.ProjectName')">
                        </el-table-column>
                        <!-- <el-table-column prop="InspectionType" :label="$t('aqlrules.DBType')">
                        </el-table-column> -->
                        <el-table-column prop="CharacteristicGrade" :label="$t('aqlrules.CharaCteristicGrade')">
                        </el-table-column>
                        <el-table-column prop="InspectionToolName" :label="$t('aqlrules.ToolName')">
                        </el-table-column>
                        <el-table-column prop="InspectionBasis" :label="$t('aqlrules.InspectionBasis')">
                        </el-table-column>
                        <el-table-column prop="SampleSize" :label="$t('incomeSheet.numberOfSample')">
                            <template #default="scope">
                                <!-- <el-input v-model="scope.row.SampleSize" size="small" type="number"></el-input> -->
                                <el-input-number v-model="scope.row.SampleSize" :min="0" size="small" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="DefectCount" :label="$t('incomeSheet.numberOfDefect')">
                            <template #default="scope">
                                <!-- {{ scope.row.DefectCount || calculateDefectCount(scope.row) }} -->
                                <!-- <el-input v-model="scope.row.DefectCount" size="small"  type="number"></el-input> -->
                                <el-input-number v-model="scope.row.DefectCount" :min="0" size="small" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="DefectDescription" :label="'缺陷描述'">
                            <template #default="scope">
                                <!-- {{ scope.row.DefectCount || calculateDefectCount(scope.row) }} -->
                                <el-input v-model="scope.row.DefectDescription" size="small"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="UnqualifiedHandlingResults" :label="'不良处理结果'" width="180">
                            <template #default="scope">
                                <!-- {{ scope.row.DefectCount || calculateDefectCount(scope.row) }} -->
                                <el-input v-model="scope.row.UnqualifiedHandlingResults" size="small"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane :label="'计量检验'" name="second">
                    <el-table :data="MeasurTable" border stripe style="width: 100%" size="small" :height="300">
                        <el-table-column prop="ProjectCategoryName" :label="$t('aqlrules.ProjectCategoryName')">
                        </el-table-column>
                        <el-table-column prop="ProjectName" :label="$t('aqlrules.ProjectName')">
                        </el-table-column>
                        <!-- <el-table-column prop="InspectionType" :label="$t('aqlrules.DBType')">
                        </el-table-column> -->
                        <el-table-column prop="CharacteristicGrade" :label="$t('aqlrules.CharaCteristicGrade')">
                        </el-table-column>
                        <el-table-column prop="TargetValue" :label="$t('aqlrules.TargetValue')">
                        </el-table-column>

                        <el-table-column prop="MinValue" :label="$t('aqlrules.MinValue')">
                        </el-table-column>
                        <el-table-column prop="MaxValue" :label="$t('aqlrules.MaxValue')">
                        </el-table-column>
                        <el-table-column prop="InspectionToolName" :label="$t('aqlrules.ToolName')">
                        </el-table-column>
                        <el-table-column prop="uomname" :label="$t('aqlrules.uomname')">
                        </el-table-column>
                        <el-table-column prop="InspectionBasis" :label="$t('aqlrules.InspectionBasis')">
                        </el-table-column>
                        <el-table-column prop="SampleSize" :label="$t('incomeSheet.numberOfSample')">
                            <template #default="scope">
                                <el-input v-model="scope.row.SampleSize" size="small" type="number" min="1" max="10"
                                    @change="handleSampleSizeChange(scope.row)"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="DefectCount" :label="$t('incomeSheet.numberOfDefect')">
                            <template #default="scope">
                                {{ calculateDefectCount(scope.row) }}
                                <!-- <el-input v-model="scope.row.DefectCount" size="small" :disabled="scope.row.StatusText!==''"></el-input> -->
                            </template>
                        </el-table-column>
                        <el-table-column prop="MeasuredValue" :align="'center'"
                            :label="$t('incomeSheet.MeasurementNumber')">
                            <template #default="scope">
                                <span @click="openMeasurementDialog(scope.row, scope.$index)">{{
                                    formatMeasuredValues(scope.row) }}</span>
                                <!-- <el-button type="primary" icon="Plus" :size="'small'"
                                    @click="openMeasurementDialog(scope.row, scope.$index)" /> -->
                            </template>
                        </el-table-column>

                        <el-table-column prop="numberOfDefect" :label="'总和'">
                            <template #default="scope">
                                <span>{{ calculateSum(scope.row) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="numberOfDefect" :label="'平均数'">
                            <template #default="scope">
                                <span>{{ calculateAverage(scope.row) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="numberOfDefect" :label="'结果'">
                            <template #default="scope">
                                {{ getResultText(scope.row) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="UnqualifiedHandlingResults" :label="'不良处理结果'" width="180">
                            <template #default="scope">
                                <!-- {{ scope.row.DefectCount || calculateDefectCount(scope.row) }} -->
                                <el-input v-model="scope.row.UnqualifiedHandlingResults" size="small"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
            <el-form class="mt-2" ref="DetailInfoFormRef" :model="DetailInfoForm" label-width="auto" :inline="true"
                :size="'small'">
                <el-form-item :label="$t('oqcInspection.SamplingPlan')" prop="SamplingPlan">
                    <el-select v-model="DetailInfoForm.SamplingPlan" placeholder="" style="width: 150px">
                        <el-option v-for="item in aqlLevelList" :key="item.AQLLevelId" :label="item.AQLLevelName"
                            :value="item.AQLLevelName">
                        </el-option>
                    </el-select>
                    <!-- <el-input v-model="DetailInfoForm.SamplingPlan" placeholder="" style="width: 150px" /> -->
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.TechnicalRequirements')" prop="TechnicalRequirements">
                    <el-input v-model="DetailInfoForm.TechnicalRequirements" placeholder="" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.Severity')" prop="Severity">
                    <el-select v-model="DetailInfoForm.Severity" placeholder="" style="width: 150px">
                        <el-option v-for="item in seriousList" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option></el-select>
                    <!-- <el-input v-model="DetailInfoForm.Severity" placeholder="" style="width: 150px" /> -->
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.InspectionLevel')" prop="InspectionLevel">
                    <el-select v-model="DetailInfoForm.InspectionLevel" placeholder="" style="width: 150px">
                        <el-option v-for="item in testLevelList" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option></el-select>
                    <!-- <el-input v-model="DetailInfoForm.InspectionLevel" placeholder="" style="width: 150px" /> -->
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.SampleSize')" prop="SampleSize">
                    <!-- <el-input v-model="DetailInfoForm.SampleSize" placeholder="" type="number" style="width: 150px" /> -->
                    <el-input-number v-model="DetailInfoForm.SampleSize" :min="0" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.PinHole')" prop="PinHole">
                    <el-select v-model="DetailInfoForm.PinHole" placeholder="" style="width: 150px" disabled>
                        <el-option label="OK" :value="0" />
                        <el-option label="NG" :value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.Dirt')" prop="Dirt">
                    <el-select v-model="DetailInfoForm.Dirt" placeholder="" style="width: 150px" disabled>
                        <el-option label="OK" :value="0" />
                        <el-option label="NG" :value="1" /></el-select>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.Flaw')" prop="Flaw">
                    <el-select v-model="DetailInfoForm.Flaw" placeholder="" style="width: 150px" disabled>
                        <el-option label="OK" :value="0" />
                        <el-option label="NG" :value="1" /></el-select>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.Result')" prop="Result">
                    <el-select v-model="DetailInfoForm.Result" placeholder="" style="width: 150px" disabled>
                        <el-option label="OK" :value="0" />
                        <el-option label="NG" :value="1" /></el-select>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.Reject')" prop="Reject">
                    <el-input v-model="rejectValue" placeholder="" type="number" style="width: 150px" disabled />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.PinHoleDefectCount')" prop="PinHoleDefectCount">
                    <el-input-number v-model="DetailInfoForm.PinHoleDefectCount" :min="0" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.DirtDefectCount')" prop="DirtDefectCount">
                    <el-input-number v-model="DetailInfoForm.DirtDefectCount" :min="0" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.FlawDefectCount')" prop="FlawDefectCount">
                    <el-input-number v-model="DetailInfoForm.FlawDefectCount" :min="0" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.ResultDefectCount')" prop="ResultDefectCount">
                    <el-input-number v-model="DetailInfoForm.ResultDefectCount" :min="0" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="'Accept'" prop="Accept">
                    <el-input v-model="acceptValue" placeholder="" style="width: 150px" disabled />
                </el-form-item>
                <!-- <el-form-item :label="'AC'" prop="AC">
                    <el-input v-model="DetailInfoForm.AC" placeholder="" style="width: 150px" disabled />
                </el-form-item>
                <el-form-item :label="'RE'" prop="RE">
                    <el-input v-model="DetailInfoForm.RE" placeholder="" style="width: 150px" disabled />
                </el-form-item> -->
            </el-form>
            <el-table :data="CharactTable" border stripe style="width: 100%" size="small" :height="200">
                <el-table-column prop="OQCCharacteristicsName" :label="$t('oqcInspection.characteristicName')">
                    <template #default="scope">
                        <el-input v-model="scope.row.OQCCharacteristicsName" size="small"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="OQCCharacteristicsDesc" :label="$t('oqcInspection.characteristicDesc')">
                    <template #default="scope">
                        <el-input v-model="scope.row.OQCCharacteristicsDesc" size="small"></el-input>
                    </template></el-table-column>

                <!-- <el-table-column :label="$t('publicText.operation')" width="150" fixed="right" align="center">
                    <template #default="{ row, $index }">
                        <el-button v-if="isLastCharact($index)" :size="'small'" :type="'primary'" icon="Plus"
                            @click="addCharactTable"></el-button>
                        <el-button :size="'small'" :type="'danger'" icon="Delete"
                            @click="deleteCharactTable(row)"></el-button>
                    </template>
                </el-table-column> -->

            </el-table>
            <el-form class="mt-2" ref="DetailInfoFormRef" :model="DetailInfoForm" label-width="auto" :inline="true"
                :size="'small'">
                <el-form-item :label="$t('oqcInspection.measurementLocation')" prop="MeasurementLocation">

                    <el-select v-model="DetailInfoForm.MeasurementLocation" placeholder="" style="width: 450px">
                        <el-option v-for="item in LocationList" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option></el-select>

                </el-form-item>
                <el-form-item :label="$t('oqcInspection.measurementMethod')" prop="MeasurementLocation">

                    <el-select v-model="MeasurValur" multiple placeholder="" style="width: 450px">
                        <el-option v-for="item in MethodList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option></el-select>

                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleInspectClose">{{
                        $t("publicText.close")
                        }}</el-button>
                    <!-- <el-button type="warning" @click="handleInspectZCConfirm" :disabled="isDisable">
                        {{ "暂存" }}
                    </el-button>
                    <el-button type="primary" @click="handleInspectConfirm" :disabled="isDisable">
                        {{ $t("publicText.confirm") }}
                    </el-button> -->
                </div>
            </template>
        </el-dialog>

        <el-dialog v-model="dialogVisible" :title="'输入测量值'" width="500px">
            <el-form ref="formRef" label-width="auto" size="small">
                <el-form-item :label="'样本值' + i" prop="name" v-for="i in currentSampleSize" :key="i">
                    <el-input v-model="measurementValues[i - 1]" placeholder="请输入测量值" style="width: 200px" />
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="saveMeasurements">保存</el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog v-model="appVisible" title="审批" width="500" :append-to-body="true" :close-on-click-modal="false"
            :close-on-press-escape="false" align-center @close="handleAppClose">
            <el-form ref="appFormRef" :model="appForm" label-width="auto">
                <el-form-item label="结果" prop="ApprovalResult">
                    <el-select v-model="appForm.ApprovalStatus" placeholder="" style="width: 200px">
                        <el-option label="通过" value="通过"> </el-option>
                        <el-option label="不通过" value="不通过"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="ApprovalRemarks">
                    <el-input type="textarea" v-model="appForm.ApprovalRemarks" :rows="4" style="width: 400px" />
                </el-form-item>

            </el-form>
            <template #footer>

                <el-button @click="handleAppClose">{{
                    $t("publicText.cancel")
                    }}</el-button>
                <el-button type="primary" @click="handleAppConfirm">
                    {{ $t("publicText.confirm") }}
                </el-button>
            </template>
        </el-dialog>
         <el-dialog v-model="splitVisible" title="拆分" width="80%" :append-to-body="true" :close-on-click-modal="false"
            :close-on-press-escape="false" align-center @close="handleCloseSplit">
            <el-form ref="appFormRef" :model="splitForm" label-width="auto" :inline="true">
                 <el-form-item label="OQC单号" prop="OQCNumber">
                    <el-input  v-model="splitForm.OQCNumber" disabled style="width: 200px" />
                </el-form-item>
                 <el-form-item label="工单号" prop="MfgOrder">
                    <el-input  v-model="splitForm.MfgOrder" disabled  style="width: 200px" />
                </el-form-item>
                 <el-form-item label="产品分类" prop="ProductType">
                    <el-input  v-model="splitForm.ProductType" disabled  style="width: 200px" />
                </el-form-item>
                 <el-form-item label="产品名称" prop="ProductName">
                    <el-input  v-model="splitForm.ProductName" disabled  style="width: 200px" />
                </el-form-item>
                
                 <el-form-item label="发货数量" prop="OrderQty">
                    <el-input  v-model="splitForm.OrderQty" disabled  style="width: 200px" />
                </el-form-item>
                <el-table :data="splitForm.oQCSpitDetails" border stripe style="width: 100%" size="small" :height="350">
                    <el-table-column prop="LineNo" label="序号" width="55" />
                    <el-table-column prop="SplitQty" label="发货数量" >
                        <template #default="scope">
                            <el-input-number v-model="scope.row.SplitQty" :min="1" :max="splitForm.OrderQty" style="width: 200px" />
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('publicText.operation')" width="150" fixed="right" align="center">
                    <template #default="{ row, $index }">
                        <el-button v-if="isLastSplitForm($index)" :size="'small'" :type="'primary'" icon="Plus"
                            @click="addSplitTable"></el-button>
                        <el-button :size="'small'" :type="'danger'" icon="Delete" :disabled="$index<=1"
                            @click="deleteSplitTable(row)"></el-button>
                    </template>
                </el-table-column>
                </el-table>
            </el-form>
            <template #footer>

                <el-button @click="handleCloseSplit">{{
                    $t("publicText.cancel")
                    }}</el-button>
                <el-button type="primary" @click="handleConfirmSplit">
                    {{ $t("publicText.confirm") }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    QueryOQCDocumentNumbersByCriteria,
    QueryOQCNewWorkOrderDetailsByWorkOrder,
    FTPSearchAndDownloadSpecificationDocumentFile,
    OQCDocumentExecution,
    GetOQCDetailInfo,
    SaveWithStatus,
    DownloadAndFillOQCFile,
    DownloadAndFillCOCFile,
    QueryOQCCorrelationIQCModelSpec,
    OQCOrderSplitting
} from "@/api/smtSpotCheck/oqc";
import {
    ref,
    watch,
    onBeforeMount,
    onMounted,
    onBeforeUnmount,
    nextTick,
    reactive,
    computed
} from "vue";
import {
    shortcuts,
    setTodayDate,
    setLastDate,
    disabledDate,
} from "@/utils/dataMenu";
import { ElNotification, ElMessageBox, ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import { useUserStoreWithOut } from "@/stores/modules/user";
import dayjs from "dayjs";
const userStore = useUserStoreWithOut();
const addForm = ref({
    MfgOrderName: "",
    OrderQty: 0,
    ShippingQty: 0,
    RemainingQty: 0,
    PartNo: "",
    LotNo: "",
    TotalEvaluation: "",
    ProductName: "",
    ToCustomerName: "",
    ProductType: "",
    CustomerPN: "",
    MaterialSource: "",

    Date: "",
    DataStatus: 0,
    OperatorUser: userStore.getUserInfo2 !== '' ? userStore.getUserInfo2 : userStore.getUserInfo,
    OperationType: "Add",
});
const addVisible = ref(false);
const getForm = ref({
    OQCName: "",
    OQCNumber: "",
    MfgOrderName: "",
    StartTime: "",
    EndTime: "",
    InspectionStatus: 1,
    ProductType: "",
    ProductName: "",
    ToCustomerName: "",
    PartNo: "",
    CustomerPN: "",
    LotNo: "",
    SpecificationNo: "",
    SpecName: "",
    OrderTypeName: "",
});
const searchDate = ref<any[]>([]);
const tableHeight = ref(0);
const tableData = ref([]);
const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});
const aqlLevelList = ref<any[]>([]);
const seriousList = ref<any[]>([
    { label: "一般", value: "一般" },
    { label: "正常", value: "正常" },
    { label: "严重", value: "正常" },
]);
const testLevelList = ref<any[]>([
    { label: "一般", value: "一般" },
    { label: "正常", value: "正常" },
]);
const activeName = ref("first");
const detailTableData = ref<any[]>([]);
const detailVisible = ref(false);
const testVisible = ref(false);
const isDisable = ref(false);
const tableData1 = ref<any[]>([]);
const tableData2 = ref<any[]>([]);
const dialogVisible = ref(false);
const currentRow = ref<any>(null);
const currentRowIndex = ref(-1);
const currentSampleSize = ref(0);
const measurementValues = ref<any[]>([]);
const lookFormRef = ref();
const lookVisible = ref(false);
const headerForm = ref({
    OQCName: "",
    OQCNumber: "",
    MfgOrderName: "",
    OrderQty: 0,
    ShippingQty: 0,
    PartNo: "",
    LotNo: "",
    TotalEvaluation: "",
    ProductName: "",
    ToCustomerName: "",
    ProductType: "",
    CustomerPN: "",
    Date: "",
    MaterialSource: "",
    RemainingQty: 0,
    QtyShiped: 0,
    SpecificationNo: "",
    ApprovalStatus: "",
    InspectionStatus: "",
});

const eqTable = ref([{
    ResourceName: "",
    Status: 0,
}]);
const QCInspectDetail = ref<any[]>([]);
const DetailInfoForm = ref({
    SamplingPlan: "",
    TechnicalRequirements: "SIP-01E",
    Severity: "",
    InspectionLevel: "",
    SampleSize: 0,
    PinHole: 0,
    Dirt: 0,
    Flaw: 0,
    Result: 0,
    PinHoleDefectCount: 0,
    DirtDefectCount: 0,
    FlawDefectCount: 0,
    ResultDefectCount: 0,
    Reject: 0,
    Accept: 0,
    AC: 0,
    RE: 0,
    MeasurementLocation: "",
    MeasurementMethod: ""
});
const CharactTable = ref<any[]>([
    {
        OQCCharacteristicsName: "",
        OQCCharacteristicsDesc: "",
    },
]);
const MeasurTable = ref<any[]>([]);
const CountTable = ref<any[]>([]);
const eqList = ref<any[]>([]);
const inspectVisible = ref(false);

const appVisible = ref(false);
const appForm = ref({
    "ApprovalStatus": "",
    "ApprovalRemarks": "",
})
const MeasurFormRef = ref("");
const MeasurValur = ref([]);
const LocationList = ref([
    {
        label: "Note 1 Meaurements are taken in Fujipoly Thailand",
        value: "Note 1 Meaurements are taken in Fujipoly Thailand"
    },
    {
        label: "Note 1 Meaurements are taken in Fujipoly Japan",
        value: "Note 1 Meaurements are taken in Fujipoly Japan"
    }
])
const MethodList = ref([
    {
        label: "Tool Microscope",
        value: "Tool Microscope"
    },
    {
        label: "Dialgauge",
        value: "Dialgauge"
    },
    {
        label: "Verniar caliper",
        value: "Verniar caliper"
    },
    {
        label: "Multimeter",
        value: "Multimeter"
    },
    {
        label: "Ruler",
        value: "Ruler"
    }
])
const OQCName = ref("");
const selectionList = ref<any[]>([]);
const splitVisible = ref(false);
const splitForm = ref<any>({
    OQCName: "",
    OQCNumber: "",
    ProductName: "",
    ProductType:'',
    MfgOrder: "",
    OrderQty: 0,
    Operator: '',
    oQCSpitDetails: []

})
watch(
    () => searchDate.value,
    (newVal: any, oldVal: any) => {
        if (newVal === null) {
            getForm.value.StartTime = "";
            getForm.value.EndTime = "";
            // getForm.value.PageNumber = 1

            return;
        }
        if (newVal !== oldVal) {
            getForm.value.StartTime = newVal[0];
            getForm.value.EndTime = newVal[1] + ' 23:59:59';
            // getForm.value.PageNumber = 1
        }
    }
);
const rejectValue = computed(() => {
    const { PinHoleDefectCount, DirtDefectCount, FlawDefectCount, ResultDefectCount } = DetailInfoForm.value;
    const pinHole = Number(PinHoleDefectCount) || 0;
    const dirt = Number(DirtDefectCount) || 0;
    const flaw = Number(FlawDefectCount) || 0;
    const result = Number(ResultDefectCount) || 0;
    DetailInfoForm.value.Reject = pinHole + dirt + flaw + result;
    return pinHole + dirt + flaw + result;
})
const acceptValue = computed(() => {
    const SampleSize = Number(DetailInfoForm.value.SampleSize) || 0;
    const reject = Number(DetailInfoForm.value.Reject) || 0;
    DetailInfoForm.value.Accept = SampleSize - reject;
    return SampleSize - reject;
})
const isLastSplitForm = computed(() => {
    return (index: number) => {
        return index === splitForm.value.oQCSpitDetails.length - 1
    }
})

onBeforeMount(() => {
    getScreenHeight();
    let end: string = setTodayDate();
    let start: string = setLastDate();
    searchDate.value = [start, end];
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getData();
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});

const getData = () => {
    QueryOQCDocumentNumbersByCriteria(getForm.value).then((res: any) => {
        tableData.value = res.content;
    });
};

const getChange = () => {
    QueryOQCNewWorkOrderDetailsByWorkOrder(addForm.value.MfgOrderName).then((res: any) => {
        if (res.success) {
            let data = res.content[0];
            addForm.value.OrderQty = data.OrderQty;
            addForm.value.ShippingQty = data.ShippingQty;
            addForm.value.PartNo = data.PartNo;
            addForm.value.LotNo = data.EarliestLotFormatted;
            addForm.value.TotalEvaluation = data.TotalEvaluation;
            addForm.value.ProductName = data.ProductName;
            addForm.value.ToCustomerName = data.CustomerName;
            addForm.value.ProductType = data.ProductTypeName;
            addForm.value.CustomerPN = data.CustomerPN;
            // addForm.value.MaterialSource=data.MaterialSource;
        } else {
            ElMessage({
                title: t("message.tipTitle"),
                message: res.msg,
                type: "error",
            });
        }
    });
}
const openAdd = () => {
    addVisible.value = true;
};
const handleAddClose = () => {
    addVisible.value = false;
    addForm.value = {
        MfgOrderName: "",
        OrderQty: 0,
        ShippingQty: 0,
        RemainingQty: 0,
        PartNo: "",
        LotNo: "",
        TotalEvaluation: "",
        ProductName: "",
        ToCustomerName: "",
        ProductType: "",
        CustomerPN: "",
        MaterialSource: "",
        Date: "",
        DataStatus: 0,
        OperatorUser: userStore.getUserInfo2 !== '' ? userStore.getUserInfo2 : userStore.getUserInfo,
        OperationType: "Add",
    };
};
const handleAddConfirm = () => {
    addForm.value.Date = dayjs().format("DD-MMM-YYYY");

    OQCDocumentExecution(addForm.value).then((res: any) => {
        ElMessage({
            title: t("message.tipTitle"),
            message: res.msg,
            type: res.success ? "success" : "error",
        });
        if (!res.success) {
            return;
        }
        addVisible.value = false;
        getData();
    });
};

const handleEdit = (row: any) => {
    OQCName.value = row.OQCName;
    getInspectDetilData()
    inspectVisible.value = true;
};
const getInspectDetilData = () => {
    GetOQCDetailInfo({ OQCName: OQCName.value }).then(
        (res: any) => {
            let data = res.content;
            headerForm.value = {
                OQCName: data.OQCHead[0].oqcName,
                OQCNumber: data.OQCHead[0].oqcNumber,
                MfgOrderName: data.OQCHead[0].mfgOrderNo,
                OrderQty: data.OQCHead[0].orderQty,
                ShippingQty: data.OQCHead[0].shippingQty,
                PartNo: data.OQCHead[0].customerPo,
                LotNo: data.OQCHead[0].lotNo,
                TotalEvaluation: data.OQCHead[0].totalEvaluation,
                ProductName: data.OQCHead[0].productName,
                ToCustomerName: data.OQCHead[0].toCustomer,
                ProductType: data.OQCHead[0].productType,
                CustomerPN: data.OQCHead[0].customerPartNo,
                Date: data.OQCHead[0].inspectionDate,
                MaterialSource: data.OQCHead[0].materialSource,
                RemainingQty: data.OQCHead[0].remainingQty,
                QtyShiped: data.OQCHead[0].shippedQty,
                SpecificationNo: data.OQCHead[0].SpecificationNo,
                ApprovalStatus: data.OQCHead[0].ApprovalStatus,
                InspectionStatus: data.OQCHead[0].InspectionStatus,
            };
            DetailInfoForm.value = {
                SamplingPlan: data.OQCDetailInfo[0].samplingPlan,
                TechnicalRequirements: 'SIP-01E',
                Severity: data.OQCDetailInfo[0].severityLevel,
                InspectionLevel: data.OQCDetailInfo[0].inspectionLevel,
                SampleSize: data.OQCDetailInfo[0].oqcSampleSize,
                PinHole: data.OQCDetailInfo[0].pinHoleFlag,
                Dirt: data.OQCDetailInfo[0].dirtFlag,
                Flaw: data.OQCDetailInfo[0].flawFlag,
                Result: data.OQCDetailInfo[0].finalResult,
                PinHoleDefectCount: data.OQCDetailInfo[0].pinHoleDefectCount,
                DirtDefectCount: data.OQCDetailInfo[0].dirtDefectCount,
                FlawDefectCount: data.OQCDetailInfo[0].flawDefectCount,
                ResultDefectCount: data.OQCDetailInfo[0].resultDefectCount,
                Reject: data.OQCDetailInfo[0].isRejected,
                Accept: data.OQCDetailInfo[0].isAccepted,
                AC: data.OQCDetailInfo[0].AC,
                RE: data.OQCDetailInfo[0].RE,
                MeasurementLocation: data.OQCDetailInfo[0].measurementLocation,
                MeasurementMethod: data.OQCDetailInfo[0].measurementMethod
            };
            MeasurValur.value = data.OQCDetailInfo[0].measurementMethod ? data.OQCDetailInfo[0].measurementMethod.split(',') : []
            if (data.OQCInstrumentDetails.length == 0) {
                eqTable.value = [{
                    ResourceName: "",
                    Status: 0,
                }];
            } else {
                eqTable.value = data.OQCInstrumentDetails.map((item: any) => ({
                    ResourceName: item.instrumentName,
                    Status: item.instrumentStatus,
                }));
            }

            // console.log(eqList.value);
            if (data.OQCCharacteristicDetails.length == 0) {
                CharactTable.value = [
                    {
                        OQCCharacteristicsName: "",
                        OQCCharacteristicsDesc: "",
                    },
                ];
            } else {
                CharactTable.value = data.OQCCharacteristicDetails.map((item: any) => ({
                    OQCCharacteristicsName: item.characteristicName,
                    OQCCharacteristicsDesc: item.characteristicDesc,
                }));
            }

            MeasurTable.value = data.OQCInspectionDetails.filter(
                (item: any) => item.measurementType == "计量"
            ).map((item: any) => ({
                Inspectiondetail: item.inspectionItemName,
                ProjectCategoryName: item.projectCategoryName,
                ProjectName: item.projectName,
                CharacteristicGrade: item.characteristicGrade,
                TargetValue: item.targetValue,
                MinValue: item.minValue,
                MaxValue: item.maxValue,
                InspectionToolName: item.inspectionToolName,
                uomname: item.uomname,
                InspectionBasis: item.inspectionBasis,
                SampleSize: item.sampleSize,
                DefectCount: item.defectCount,
                MeasuredValue1: item.measuredValue1,
                MeasuredValue2: item.measuredValue2,
                MeasuredValue3: item.measuredValue3,
                MeasuredValue4: item.measuredValue4,
                MeasuredValue5: item.measuredValue5,
                MeasuredValue6: item.measuredValue6,
                MeasuredValue7: item.measuredValue7,
                MeasuredValue8: item.measuredValue8,
                MeasuredValue9: item.measuredValue9,
                MeasuredValue10: item.measuredValue10,
                UnqualifiedHandlingResults: item.UnqualifiedHandlingResults,
            }));
            CountTable.value = data.OQCInspectionDetails.filter(
                (item: any) => item.measurementType == "计数"
            ).map((item: any) => ({
                Inspectiondetail: item.inspectionItemName,
                ProjectCategoryName: item.projectCategoryName,
                ProjectName: item.projectName,
                CharacteristicGrade: item.characteristicGrade,
                TargetValue: item.targetValue,
                MinValue: item.minValue,
                MaxValue: item.maxValue,
                InspectionToolName: item.inspectionToolName,
                uomname: item.uomname,
                InspectionBasis: item.inspectionBasis,
                SampleSize: item.sampleSize,
                DefectCount: item.defectCount,
                MeasuredValue1: item.measuredValue1,
                MeasuredValue2: item.measuredValue2,
                MeasuredValue3: item.measuredValue3,
                MeasuredValue4: item.measuredValue4,
                MeasuredValue5: item.measuredValue5,
                MeasuredValue6: item.measuredValue6,
                MeasuredValue7: item.measuredValue7,
                MeasuredValue8: item.measuredValue8,
                MeasuredValue9: item.measuredValue9,
                MeasuredValue10: item.measuredValue10,
                UnqualifiedHandlingResults: item.UnqualifiedHandlingResults,
            }));

        }
    );
}
const handleInspectClose = () => {
    inspectVisible.value = false;
};

// const addCharactTable = () => {
//     CharactTable.value.push({
//         OQCCharacteristicsName: "",
//         OQCCharacteristicsDesc: "",
//         MeasurementLocation: "",
//         MeasurementMethod: "",
//     });
// };
// const deleteCharactTable = (val: any) => {
//     const index = CharactTable.value.indexOf(val);
//     if (index > -1) {
//         CharactTable.value.splice(index, 1);
//     }
//     if (CharactTable.value.length === 0) {
//         CharactTable.value.push({
//             OQCCharacteristicsName: "",
//             OQCCharacteristicsDesc: "",
//             MeasurementLocation: "",
//             MeasurementMethod: "",
//         });
//     }
// };

const dataProcessing = () => {
    // 数据处理逻辑
    QCInspectDetail.value = MeasurTable.value.map((item: any) => {
        return {
            SampleSize: item.SampleSize,
            DefectCount: item.DefectCount,
            MeasuredValue1: item.MeasuredValue1,
            MeasuredValue2: item.MeasuredValue2,
            MeasuredValue3: item.MeasuredValue3,
            MeasuredValue4: item.MeasuredValue4,
            MeasuredValue5: item.MeasuredValue5,
            MeasuredValue6: item.MeasuredValue6,
            MeasuredValue7: item.MeasuredValue7,
            MeasuredValue8: item.MeasuredValue8,
            MeasuredValue9: item.MeasuredValue9,
            MeasuredValue10: item.MeasuredValue10,
            Sum: item.Sum,
            Average: item.Average,
            DefectDescription: item.DefectDescription,
            Inspectiondetail: item.Inspectiondetail,
            // Status: 0,
            UnqualifiedHandlingResults: "",
        };
    });
    QCInspectDetail.value.push(...CountTable.value.map((item: any) => {
        return {
            SampleSize: item.SampleSize,
            DefectCount: item.DefectCount,
            MeasuredValue1: item.MeasuredValue1,
            MeasuredValue2: item.MeasuredValue2,
            MeasuredValue3: item.MeasuredValue3,
            MeasuredValue4: item.MeasuredValue4,
            MeasuredValue5: item.MeasuredValue5,
            MeasuredValue6: item.MeasuredValue6,
            MeasuredValue7: item.MeasuredValue7,
            MeasuredValue8: item.MeasuredValue8,
            MeasuredValue9: item.MeasuredValue9,
            MeasuredValue10: item.MeasuredValue10,
            Sum: item.Sum,
            Average: item.Average,
            DefectDescription: item.DefectDescription,
            Inspectiondetail: item.Inspectiondetail,
            // Status: 0,
            UnqualifiedHandlingResults: "",
        };
    }));
    let data = {
        OQCName: headerForm.value.OQCName,
        OQCNumber: headerForm.value.OQCNumber,
        MfgOrderName: headerForm.value.MfgOrderName,
        OrderQty: headerForm.value.OrderQty,
        ShippingQty: headerForm.value.ShippingQty,
        PartNo: headerForm.value.PartNo,
        LotNo: headerForm.value.LotNo,
        TotalEvaluation: headerForm.value.TotalEvaluation,
        ProductName: headerForm.value.ProductName,
        ToCustomerName: headerForm.value.ToCustomerName,
        ProductType: headerForm.value.ProductType,
        CustomerPN: headerForm.value.CustomerPN,
        Date: headerForm.value.Date,
        DataStatus: 0,
        OperatorUser: userStore.getUserInfo2 !== '' ? userStore.getUserInfo2 : userStore.getUserInfo,
        ApprovalStatus: "",
        ApprovalRemarks: "",
        InspectionStatus: "",
        RemainingQty: headerForm.value.RemainingQty,
        QtyShiped: headerForm.value.QtyShiped,
        SpecificationNo: "",
        OperationType: "",
        oQCInstrumentDetails: [
            {
                ResourceName: "",
                Status: 0,
            },
        ],
        oQCCharacteristicsDetails: [...CharactTable.value],
        oQCInspectionDetails: [
            ...QCInspectDetail.value
        ],
        oQCDetail: {
            ...DetailInfoForm.value,
        },
    };
    // console.log(data);
    return data
};
const handleInspectZCConfirm = () => {
    // 暂存逻辑
    let data = dataProcessing()
    data.InspectionStatus = "1"
    SaveWithStatus(data).then((res: any) => {
        ElMessage({
            title: t("message.tipTitle"),
            message: res.msg,
            type: res.success ? "success" : "error",
        });
        if (!res.success) {
            return;
        }
        inspectVisible.value = false;
        getData();
    });

};
const handleInspectConfirm = () => {
    // 提交逻辑
    let data = dataProcessing()
    data.InspectionStatus = "2"
    SaveWithStatus(data).then((res: any) => {
        ElMessage({
            title: t("message.tipTitle"),
            message: res.msg,
            type: res.success ? "success" : "error",
        });
        if (!res.success) {
            return;
        }
        inspectVisible.value = false;
        getData();
    });
};

const handleAppClose = () => {
    appVisible.value = false
}
const handleAppConfirm = () => {
    let data = dataProcessing()
    data.OperatorUser = userStore.getUserInfo2 !== '' ? userStore.getUserInfo2 : userStore.getUserInfo
    data.OperationType = "Approve"
    data.ApprovalStatus = appForm.value.ApprovalStatus
    data.ApprovalRemarks = appForm.value.ApprovalRemarks
    OQCDocumentExecution(data).then((res: any) => {
        ElMessage({
            title: t("message.tipTitle"),
            message: res.msg,
            type: res.success ? "success" : "error",
        });
        if (!res.success) {
            return;
        }
        appForm.value.ApprovalStatus = ""
        appForm.value.ApprovalRemarks = ""
        appVisible.value = false
        getData();
    });
}
const handleApproval = (row: any) => {
    appVisible.value = true
    // let data=dataProcessing()
    // data.OperatorUser= userStore.getUserInfo2!==''?userStore.getUserInfo2:userStore.getUserInfo
    // data.OperationType="Approve"
    // OQCDocumentExecution(data).then((res: any) => {
    //     ElMessage({
    //         title: t("message.tipTitle"),
    //         message: res.msg,
    //         type: res.success ? "success" : "error",
    //     });
    //     if (!res.success) {
    //         return;
    //     }
    //     getData();
    // });
}
const openMeasurementDialog = (row: any, index: any) => {
    currentRow.value = row;
    currentRowIndex.value = index;
    currentSampleSize.value = parseInt(row.SampleSize) || 0;
    measurementValues.value = [];
    for (let i = 0; i < currentSampleSize.value; i++) {
        measurementValues.value.push(row[`MeasuredValue${i + 1}`] || "");
    }

    dialogVisible.value = true;
};

const saveMeasurements = () => {
    for (let i = 0; i < currentSampleSize.value; i++) {
        currentRow.value[`MeasuredValue${i + 1}`] = measurementValues.value[i];
    }

    dialogVisible.value = false;
};

const calculateDefectCount = (row: any) => {
    // 获取MinValue和MaxValue的数值
    const minValue = parseFloat(row.MinValue);
    const maxValue = parseFloat(row.MaxValue);

    // 检查MinValue和MaxValue是否有效
    if (isNaN(minValue) || isNaN(maxValue)) {
        return 0; // 范围无效时返回0
    }

    let defectCount = 0;

    // 检查所有测量值
    for (let i = 1; i <= 10; i++) {
        const value = row[`MeasuredValue${i}`];

        // 跳过空值
        if (value === null || value === undefined || value === "") {
            continue;
        }

        // 转换为数字
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            continue; // 非数字值不计入缺陷
        }

        // 检查是否不在范围内
        if (numValue < minValue || numValue > maxValue) {
            defectCount++;
        }
    }

    return defectCount;
};
const getResultText = (row: any) => {
    // 获取MinValue和MaxValue的数值
    const minValue = parseFloat(row.MinValue);
    const maxValue = parseFloat(row.MaxValue);

    // 检查MinValue和MaxValue是否有效
    if (isNaN(minValue) || isNaN(maxValue)) {
        return "范围无效";
    }

    // 检查所有测量值
    for (let i = 1; i <= 10; i++) {
        const value = row[`MeasuredValue${i}`];

        // 跳过空值
        if (value === null || value === undefined || value === "") {
            continue;
        }

        // 转换为数字
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            return "数据异常"; // 如果有非数字值，返回异常
        }

        // 检查是否在范围内
        if (numValue < minValue || numValue > maxValue) {
            row.Status = "不合格";
            return "不合格";
        }
    }

    // 检查是否有至少一个测量值
    const hasValues = Array.from({ length: 10 }, (_, i) => i + 1).some(
        (i) =>
            row[`MeasuredValue${i}`] !== null &&
            row[`MeasuredValue${i}`] !== undefined &&
            row[`MeasuredValue${i}`] !== ""
    );
    row.Status = hasValues ? "合格" : "无数据";
    return hasValues ? "合格" : "无数据";
};
const handleSampleSizeChange = (row: any) => {
    const newSize = parseInt(row.SampleSize) || 0;
    // 清空多余的测量值
    for (let i = newSize; i < 10; i++) {
        row[`MeasuredValue${i + 1}`] = null;
    }
};
const calculateSum = (row: any) => {
    let sum = 0;
    for (let i = 1; i <= 10; i++) {
        const value = row[`MeasuredValue${i}`];
        if (value !== null && value !== undefined && value !== "") {
            sum += Number(value);
        }
    }
    row.Sum = sum;
    return sum;
};
const calculateAverage = (row: any) => {
    let sum = 0;
    let count = 0;
    for (let i = 1; i <= 10; i++) {
        const value = row[`MeasuredValue${i}`];
        if (value !== null && value !== undefined && value !== "") {
            sum += Number(value);
            count++;
        }
    }
    row.Average = count > 0 ? sum / count : 0;
    return count > 0 ? (sum / count).toFixed(2) : 0;
};
const formatMeasuredValues = (row: any) => {
    const values = [];
    for (let i = 1; i <= 10; i++) {
        const value = row[`MeasuredValue${i}`];
        if (value !== null && value !== undefined && value !== "") {
            values.push(value);
        }
    }
    return values.join(", ");
};
const handleSelectionChange = (val: any) => {
    selectionList.value = val;
    // console.log(selectionList.value);
    
}
const handleOpenSplit = () => {
    splitForm.value.OQCName = selectionList.value[0].OQCName;
    splitForm.value.OQCNumber = selectionList.value[0].OQCNumber;
    splitForm.value.ProductName = selectionList.value[0].ProductName;
    splitForm.value.ProductType = selectionList.value[0].ProductType;
    splitForm.value.MfgOrder = selectionList.value[0].MfgOrder;
    splitForm.value.OrderQty = selectionList.value[0].ShippingQty;
    splitForm.value.Operator = userStore.getUserInfo2 !== '' ? userStore.getUserInfo2 : userStore.getUserInfo;
    splitForm.value.oQCSpitDetails = [
        {
            LineNo: 1,
            SplitQty: 0
        },
        {
            LineNo: 2,
            SplitQty: 0
        },
    ]
    splitVisible.value = true;
}
const addSplitTable = () => {
    const newLineNo = splitForm.value.oQCSpitDetails.length + 1;
    splitForm.value.oQCSpitDetails.push({
        LineNo: newLineNo,
        SplitQty: 0
    });
}
const deleteSplitTable = (row: any) => {
    const index = splitForm.value.oQCSpitDetails.indexOf(row);
    if (index > -1) {
        splitForm.value.oQCSpitDetails.splice(index, 1);
    }
    // 重新设置行号
    splitForm.value.oQCSpitDetails.forEach((item: any, idx: number) => {
        item.LineNo = idx + 1;
    });
    if (splitForm.value.oQCSpitDetails.length === 0) {
        splitForm.value.oQCSpitDetails.push({
            LineNo: 1,
            SplitQty: 0
        });
    }
}
const handleCloseSplit = () => {

    
    splitForm.value = {
        OQCName: "",
        OQCNumber: "",
        MfgOrder: "",
        ProductName: "",
        ProductType:"",
        OrderQty: 0,
        Operator: '',
        oQCSpitDetails: []
    }
    splitVisible.value = false;

}
const handleConfirmSplit = () => {
    // 提交逻辑
    console.log(splitForm.value);
    const totalSplitQty = splitForm.value.oQCSpitDetails.reduce((sum:any, item:any) => {
        return sum + (Number(item.SplitQty) || 0);
    }, 0);
    if (totalSplitQty > splitForm.value.OrderQty) {
        ElMessage({
            message: '拆分已超过订单数量', // 请使用你的国际化翻译
            type: "error",
        });
        return;
    }
    OQCOrderSplitting(splitForm.value).then((res: any) => {
        ElMessage({
            title: t("message.tipTitle"),
            message: res.msg,
            type: res.success ? "success" : "error",
        });
        if (!res.success) {
            return;
        }
        splitForm.value = {
            OQCName: "",
            OQCNumber: "",
            MfgOrder: "",
            ProductName: "",
            ProductType:'',
            OrderQty: 0,
            Operator: '',
            oQCSpitDetails: []
        }
        splitVisible.value = false;
        getData();
    });
};

const handleSizeChange = (val: any) => {
    pageObj.pageSize = val;
};
const handleCurrentChange = (val: any) => {
    pageObj.currentPage = val;
};
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 250;
    });
};
const headerRowStyle = (row: any) => {
    console.log(row);
};
</script>
<style scoped>
.el-pagination {
    justify-content: center;
}

.table-container {
    display: flex;
    width: 100%;
    height: 100%;
}

.left {
    flex: 1;
}

.right {
    flex: 1;
}
</style>

<style lang="scss" scoped>
.container {
    max-width: 800px;
    margin: 0 auto;
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.report-title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
}

.info-section {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 15px;
}

.info-item {
    display: flex;
    margin-right: 30px;
    margin-bottom: 10px;
}

.info-label {
    font-weight: bold;
    margin-right: 5px;
    white-space: nowrap;
}

.table-container {
    overflow-x: auto;
}

.export-btn {
    margin-top: 20px;
    text-align: right;
}

.remark {
    margin-top: 15px;
    padding: 8px;
    background-color: #f5f7fa;
    border-radius: 4px;
    color: #606266;
}

.el-table .header-row {
    background-color: #f0f9ff;
}

.el-table .header-row th {
    background-color: #f0f9ff !important;
}

.el-table .cell {
    padding: 4px 8px;
    font-size: 12px;
}

.el-table th {
    padding: 8px 0;
}

.el-table--border {
    border: 1px solid #ebeef5;
}

.el-table--border th,
.el-table--border td {
    border-right: 1px solid #ebeef5;
}

.el-table--border::after,
.el-table--group::after,
.el-table::before {
    background-color: #ebeef5;
}

.header-cell {
    font-weight: bold;
    background-color: #f5f7fa;
}

.content-cell {
    background-color: #ffffff;
}

.info-row {
    display: flex;
    margin-bottom: 10px;
}

.info-box {
    flex: 1;
    padding: 5px 10px;
    border: 1px solid #ebeef5;
    margin-right: 10px;
}

.info-box:last-child {
    margin-right: 0;
}

.info-box-title {
    font-weight: bold;
    margin-bottom: 5px;
}
</style>
