<template>
    <div class="p-2">
        <el-card :body-style="{ padding: '8px' }">
            <el-form ref="formRef" :model="getForm" :inline="true" label-width="auto" size="small">
                <el-form-item :label="$t('oqcInspection.creatTime')" class="mb-2"><el-date-picker :shortcuts="shortcuts"
                        v-model="searchDate" value-format="YYYY-MM-DD" type="daterange" range-separator="-" size="small"
                        style="width: 190px" :clearable="false" :disabled-date="disabledDate" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.SpecName')" class="mb-2">
                    <el-select v-model="getForm.SpecName" placeholder="" @change="getData" clearable
                        style="width: 190px">
                        <el-option label="模切" value="模切" />
                        <el-option label="裁切" value="裁切" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.inspectionStatus')" class="mb-2">
                    <el-select v-model="getForm.InspectionStatus" placeholder="" @change="getData" style="width: 190px"
                        clearable>
                        <el-option :label="'全部'" :value="''"> </el-option>
                        <el-option :label="'未完成'" :value="1"> </el-option>
                        <el-option :label="t('oqcInspection.status3')" :value="2">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产品类型" prop="ProductType" class="mb-2">
                    <el-select style="width: 190px" v-model="getForm.ProductType" @change="getData" placeholder="请选择"
                        clearable filterable size="small">
                        <el-option :label="p.ProductTypeName" :value="p.ProductTypeName" :key="p.ProductTypeId"
                            v-for="p in produstTypeList" />
                    </el-select>
                </el-form-item>
                <!-- <el-form-item :label="$t('oqcInspection.productCategory')" class="mb-2">
                    <el-input style="width: 180px" v-model="getForm.ProductType" placeholder="" clearable></el-input>
                </el-form-item> -->
                <el-form-item :label="$t('oqcInspection.customerName')" class="mb-2">
                    <el-input style="width: 190px" v-model="getForm.ToCustomerName" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.productName')" class="mb-2">
                    <el-input style="width: 190px" v-model="getForm.ProductName" placeholder="" clearable></el-input>
                </el-form-item>

                <el-form-item :label="$t('oqcInspection.customerPO')" class="mb-2">
                    <el-input style="width: 190px" v-model="getForm.PartNo" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.LOtNO')" class="mb-2">
                    <el-input style="width: 190px" v-model="getForm.LotNo" placeholder="" clearable></el-input>
                </el-form-item>

                <el-form-item :label="$t('oqcInspection.customerPN')" class="mb-2">
                    <el-input style="width: 190px" v-model="getForm.CustomerPN" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.OQCNumber')" class="mb-2">
                    <el-input style="width: 190px" v-model="getForm.OQCNumber" placeholder="" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.workerOrder')" class="mb-2">
                    <el-input style="width: 190px" v-model="getForm.MfgOrderName" placeholder="" clearable></el-input>
                </el-form-item>

                <el-form-item class="mb-2">
                    <el-button type="primary" size="small" @click="getData">
                        {{ $t("publicText.query") }}
                    </el-button>
                    <el-button type="info" size="small" @click="resetForm">
                        {{ $t("publicText.reset") }}
                    </el-button>
                    <el-button type="success" :disabled="tableData.length == 0" size="small" @click="exportTable">
                        导出Excel
                    </el-button>
                </el-form-item>
            </el-form>
            <el-table fit ref="oqcInspectionRef" :data="tableData.slice(
                (pageObj.currentPage - 1) * pageObj.pageSize,
                pageObj.currentPage * pageObj.pageSize,
            )
                " size="small" :style="{ width: '100%' }" :height="tableHeight" border highlight-current-row
                :row-class-name="tableRowClassName">
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="PriorityCodeName" :label="$t('batchCreation.Priority')" width="60"
                    :align="'center'" fixed />
                <el-table-column prop="MfgOrder" :label="$t('oqcInspection.workerOrder')" fixed />
                <el-table-column prop="Customer" :label="$t('oqcInspection.customerName')"
                    :min-width="getColumnWidth('Customer')" fixed />
                <el-table-column prop="ProductName" :label="$t('oqcInspection.productName')"
                    :min-width="getColumnWidth('ProductName')" fixed />
                <el-table-column prop="CustomerPO" :label="$t('oqcInspection.customerPO')"
                    :min-width="getColumnWidth('CustomerPO')" />
                <el-table-column prop="CustomerPN" :label="$t('oqcInspection.customerPN')"
                    :min-width="getColumnWidth('CustomerPN')" />
                <el-table-column prop="SpecificationNo" :label="$t('oqcInspection.SpecificationNo')">
                    <template #default="{ row }">
                        <span class="underline cursor-pointer text-cyan-800" @click="openFile(row.SpecificationNo)">{{
                            row.SpecificationNo }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="LotNo" :label="$t('oqcInspection.LOtNO')" />
                <el-table-column prop="LotNumber" :label="'原料批次'" :min-width="getColumnWidth('LotNumber')" />
                <el-table-column prop="InspectionStatus" :label="$t('oqcInspection.inspectionStatus')" />
                <el-table-column prop="ApprovalStatus" :label="$t('oqcInspection.ApprovalStatus')" />
                <el-table-column prop="OrderQty" :label="'订单总数量'" width="100" />
                <el-table-column prop="ShippingQty" :label="'生产数量'" width="100" />
                <el-table-column prop="SpecName" :label="$t('oqcInspection.SpecName')" />
                <el-table-column prop="ProductType" :label="$t('oqcInspection.productCategory')" />
                <el-table-column prop="OQCNumber" :label="$t('oqcInspection.OQCNumber')" width="200">
                </el-table-column>
                <!-- <el-table-column prop="QtyShiped" :label="$t('oqcInspection.QtyShiped')" width="100" /> -->
                <el-table-column prop="TotalEvaluation" :label="$t('oqcInspection.TotalEvaluation')" width="120" />
                <el-table-column prop="OrderTypeName" :label="$t('oqcInspection.OrderTypeName')" width="100" />
                <el-table-column prop="CreateUser" :label="$t('oqcInspection.CreateUser')" width="120" />
                <el-table-column prop="CreateTime" :label="$t('oqcInspection.CreateTime')" width="150" />
                <el-table-column prop="UpdateUser" :label="$t('oqcInspection.UpdateUser')" width="120" />
                <el-table-column prop="UpdateTime" :label="$t('oqcInspection.UpdateTime')" width="150" />
                <el-table-column prop="MfgorderTime" :label="'工单最后修改时间'" :min-width="getColumnWidth('MfgorderTime')" />
                <!-- <el-table-column prop="SpecificationNo" :label="$t('oqcInspection.SpecificationNo')" /> -->
                <el-table-column :label="$t('publicText.operation')" width="220" fixed="right" align="center">
                    <template #default="scope">
                        <el-tooltip :content="$t('publicText.check')" placement="top">
                            <el-button type="primary" icon="EditPen" size="small"
                                @click.stop="handleEdit(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip :content="$t('oqcInspection.lookIQC')" placement="top">
                            <el-button type="warning" icon="Tickets" size="small"
                                @click.stop="handleLookIQC(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip :content="'下载OQC'" placement="top">
                            <el-button type="success" icon="Download" size="small"
                                :disabled="scope.row.ApprovalStatus !== '完成'"
                                @click.stop="handleDownloadOQC(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip :content="'下载COC'" placement="top">
                            <el-button type="info" icon="Download" size="small"
                                :disabled="scope.row.ApprovalStatus !== '完成'"
                                @click.stop="handleDownloadCOC(scope.row)"></el-button>
                        </el-tooltip>
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

        <el-dialog v-model="inspectVisible" :title="'检验'" width="95%" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center @close="handleInspectClose">
            <!-- <div class="flex items-center justify-center gap-2"> -->

            <el-form ref="headerFormRef" :model="headerForm" label-width="auto" :inline="true" :size="'small'">
                <el-form-item :label="'OQC单号'" prop="OQCNumber" class="mb-2">
                    <el-input v-model="headerForm.OQCNumber" placeholder="" style="width: 150px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="'工单号'" prop="MfgOrderName" class="mb-2">
                    <el-input v-model="headerForm.MfgOrderName" placeholder="" style="width: 150px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="'汽车产品'" prop="IsCarProduct" class="mb-2">
                    <el-input v-model="headerForm.IsCarProduct" placeholder="" style="width: 150px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.Date')" prop="Date" class="mb-2">
                    <el-input v-model="headerForm.Date" placeholder="" style="width: 150px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.TotalEvaluation')" prop="TotalEvaluation" class="mb-2">
                    <el-input v-model="headerForm.TotalEvaluation" placeholder="" style="width: 150px"
                        :disabled="true" />
                </el-form-item>
                <el-form-item :label="'客户名称'" prop="ToCustomerName" class="mb-2">
                    <el-input v-model="headerForm.ToCustomerName" placeholder="" style="width: 150px"
                        :disabled="true" />
                </el-form-item>
                <el-form-item :label="'产品名称'" prop="ProductName" class="mb-2">
                    <el-input v-model="headerForm.ProductName" placeholder="" style="width: 150px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.customerPN')" prop="PartNo" class="mb-2">
                    <el-input v-model="headerForm.PartNo" placeholder="" style="width: 150px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.materialSource')" prop="MaterialSource" class="mb-2">
                    <el-input v-model="headerForm.MaterialSource" placeholder="" style="width: 150px"
                        :disabled="true" />
                </el-form-item>
                <el-form-item :label="'外观Ac'" prop="AC" class="mb-2">
                    <el-input v-model="DetailInfoForm.AC" placeholder="" style="width: 150px" disabled />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.OrderQty')" prop="OrderQty" class="mb-2">
                    <el-input v-model="headerForm.OrderQty" placeholder="" style="width: 150px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="'生产数量'" prop="QtyShiped" class="mb-2">
                    <el-input v-model="headerForm.ShippingQty" placeholder="" style="width: 150px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.LOtNO')" prop="LotNo" class="mb-2">
                    <el-input v-model="headerForm.LotNo" placeholder="" style="width: 150px" :disabled="true" />
                </el-form-item>
                <el-form-item :label="'原料批次'" prop="RE" class="mb-2">
                    <el-input v-model="headerForm.LotNumber" placeholder="" style="width: 150px" disabled />
                </el-form-item>
                <el-form-item :label="'外观Re'" prop="RE" class="mb-2">
                    <el-input v-model="DetailInfoForm.RE" placeholder="" style="width: 150px" disabled />
                </el-form-item>
                <!-- <el-form-item>
                 
                </el-form-item> -->
            </el-form>
            <el-row :gutter="20">
                <el-col :span="15">
                    <el-form ref="splitFormRef" :model="splitForm" :inline="true" label-width="92px" :size="'small'">
                        <el-form-item :label="'出货批次'" prop="LotNo" class="mb-2">
                            <el-input v-model="splitForm.lotNo" style="width: 150px" disabled />
                        </el-form-item>
                        <el-form-item :label="'出货数量'" prop="shippingQty" class="mb-2">
                            <el-input v-model="splitForm.shippingQty" style="width: 150px" disabled />
                        </el-form-item>
                        <el-form-item :label="'生产确认人'" prop="CreateUser" class="mb-2">
                            <el-input v-model="splitForm.CreateUser" style="width: 150px" disabled />
                        </el-form-item>
                        <el-form-item :label="'出货时间'" prop="UpdateTime" class="mb-2">
                            <el-input v-model="splitForm.UpdateTime" style="width: 150px" disabled />
                        </el-form-item>

                        <el-form-item :label="'品质确认人'" prop="UpdateUser" class="mb-2">
                            <el-input v-model="splitForm.UpdateUser" style="width: 150px" disabled />
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="9">


                    <el-table :data="eqTable" border stripe style="width: 100%" size="small" :height="105">
                        <el-table-column prop="ResourceName" :label="$t('oqcInspection.instrumentName')">
                            <template #default="{ row }">
                                <el-select v-model="row.ResourceName" placeholder="" style="width: 100%"
                                    :size="'small'">
                                    <el-option v-for="item in eqList" :key="item.ResourceId" :label="item.ResourceName"
                                        :value="item.ResourceName">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="StatusText" :label="$t('oqcInspection.instrumenStatus')" width="150">
                            <template #default="{ row }">
                                <el-select v-model="row.Status" placeholder="" style="width: 100%" :size="'small'">
                                    <el-option label="Y" :value="0" />
                                    <el-option label="N" :value="1" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('publicText.operation')" width="120" align="center">
                            <template #default="{ row, $index }">
                                <el-button v-if="isLastRow($index)" :size="'small'" :type="'primary'" icon="Plus"
                                    @click="addEqRow"></el-button>
                                <el-button type="danger" icon="Delete" size="small"
                                    @click="removeEqRow(row)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>



            <!-- </div> -->

            <el-form class="mt-2" ref="DetailInfoFormRef" :model="DetailInfoForm" label-width="auto" :inline="true"
                :size="'small'">
                <el-form-item :label="$t('oqcInspection.SamplingPlan')" prop="SamplingPlan" class="mb-2">
                    <el-select v-model="DetailInfoForm.SamplingPlan" placeholder="" style="width: 150px">
                        <el-option v-for="item in aqlLevelList" :key="item.AQLLevelId" :label="item.AQLLevelName"
                            :value="item.AQLLevelName">
                        </el-option>
                    </el-select>
                    <!-- <el-input v-model="DetailInfoForm.SamplingPlan" placeholder="" style="width: 150px" /> -->
                </el-form-item>
                <el-form-item :label="'SIP'" prop="TechnicalRequirements" class="mb-2">
                    <el-select v-model="DetailInfoForm.TechnicalRequirements" placeholder="" style="width: 150px">
                        <el-option v-for="item in TechnicalRequireList" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option></el-select>
                    <!-- <el-input v-model="DetailInfoForm.TechnicalRequirements" placeholder="" style="width: 150px" /> -->
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.Severity')" prop="Severity" class="mb-2">
                    <el-select v-model="DetailInfoForm.Severity" placeholder="" style="width: 150px">
                        <el-option v-for="item in seriousList" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option></el-select>
                    <!-- <el-input v-model="DetailInfoForm.Severity" placeholder="" style="width: 150px" /> -->
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.InspectionLevel')" prop="InspectionLevel" class="mb-2">
                    <el-select v-model="DetailInfoForm.InspectionLevel" placeholder="" style="width: 150px">
                        <el-option v-for="item in testLevelList" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option></el-select>
                    <!-- <el-input v-model="DetailInfoForm.InspectionLevel" placeholder="" style="width: 150px" /> -->
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.SampleSize')" prop="SampleSize" class="mb-2">
                    <!-- <el-input v-model="DetailInfoForm.SampleSize" placeholder="" type="number" style="width: 150px" /> -->
                    <el-input-number v-model="DetailInfoForm.SampleSize"
                        :disabled="headerForm.InspectionStatus == '检验完成'" :min="0" style="width: 150px"
                        @change="changeSampleSize" />
                </el-form-item>
                <el-form-item :class="{ 'ng-status': DetailInfoForm.PinHole === 1 }"
                    :label="$t('oqcInspection.PinHole')" prop="PinHole" class="mb-2">
                    <el-select :class="{
                        'ng-select': DetailInfoForm.PinHole === 1,
                        'ng-disabled': DetailInfoForm.PinHole === 1,
                    }" v-model="DetailInfoForm.PinHole" placeholder="" style="width: 150px" disabled>
                        <el-option label="OK" :value="0" />
                        <el-option label="NG" :value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item :class="{ 'ng-status': DetailInfoForm.Dirt === 1 }" :label="$t('oqcInspection.Dirt')"
                    prop="Dirt" class="mb-2">
                    <el-select :class="{
                        'ng-select': DetailInfoForm.Dirt === 1,
                        'ng-disabled': DetailInfoForm.Dirt === 1,
                    }" v-model="DetailInfoForm.Dirt" placeholder="" style="width: 150px" disabled>
                        <el-option label="OK" :value="0" />
                        <el-option label="NG" :value="1" /></el-select>
                </el-form-item>
                <el-form-item :class="{ 'ng-status': DetailInfoForm.Flaw === 1 }" :label="$t('oqcInspection.Flaw')"
                    prop="Flaw" class="mb-2">
                    <el-select :class="{
                        'ng-select': DetailInfoForm.Flaw === 1,
                        'ng-disabled': DetailInfoForm.Flaw === 1,
                    }" v-model="DetailInfoForm.Flaw" placeholder="" style="width: 150px" disabled>
                        <el-option label="OK" :value="0" />
                        <el-option label="NG" :value="1" /></el-select>
                </el-form-item>
                <el-form-item :class="{ 'ng-status': DetailInfoForm.Flaw === 1 }" :label="$t('oqcInspection.Result')"
                    prop="Result" class="mb-2">
                    <el-select :class="{
                        'ng-select': DetailInfoForm.Result === 1,
                        'ng-disabled': DetailInfoForm.Result === 1,
                    }" v-model="DetailInfoForm.Result" placeholder="" style="width: 150px" disabled>
                        <el-option label="OK" :value="0" />
                        <el-option label="NG" :value="1" /></el-select>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.Reject')" prop="Reject" class="mb-2">
                    <el-input v-model="rejectValue" placeholder="" type="number" style="width: 150px" disabled />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.PinHoleDefectCount')" prop="PinHoleDefectCount" class="mb-2">
                    <el-input-number v-model="DetailInfoForm.PinHoleDefectCount" :min="0" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.DirtDefectCount')" prop="DirtDefectCount" class="mb-2">
                    <el-input-number v-model="DetailInfoForm.DirtDefectCount" :min="0" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.FlawDefectCount')" prop="FlawDefectCount" class="mb-2">
                    <el-input-number v-model="DetailInfoForm.FlawDefectCount" :min="0" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.ResultDefectCount')" prop="ResultDefectCount" class="mb-2">
                    <el-input-number v-model="DetailInfoForm.ResultDefectCount" :min="0" style="width: 150px" />
                </el-form-item>

                <el-form-item :label="'Accept'" prop="Accept" class="mb-2">
                    <el-input v-model="acceptValue" placeholder="" style="width: 150px" disabled />
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.measurementLocation')" prop="MeasurementLocation" class="mb-2">
                    <el-select v-model="DetailInfoForm.MeasurementLocation" clearable placeholder=""
                        style="width: 350px">
                        <el-option v-for="item in LocationList" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('oqcInspection.measurementMethod')" prop="MeasurementLocation" class="mb-2">
                    <el-select v-model="MeasurValur" multiple placeholder="" style="width: 350px">
                        <el-option v-for="item in MethodList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="'ES_Expand1'" prop="ES_Expand1" class="mb-2">
                    <el-input v-model="DetailInfoForm.ES_Expand1" :disabled="headerForm.InspectionStatus == '检验完成'"
                        placeholder="" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="'ES_Expand2'" prop="ES_Expand2" class="mb-2">
                    <el-input v-model="DetailInfoForm.ES_Expand2" :disabled="headerForm.InspectionStatus == '检验完成'"
                        placeholder="" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="'检验备注'" prop="OQCRemark" class="mb-2">
                    <el-input v-model="DetailInfoForm.OQCRemark" placeholder="" style="width: 350px" />
                </el-form-item>
            </el-form>

            <!-- <el-form class="mt-2" ref="DetailInfoFormRef" :model="DetailInfoForm" label-width="auto" :size="'small'">
                <el-form-item :label="'检验备注'" prop="OQCRemark" class="mb-2">
                    <el-input v-model="DetailInfoForm.OQCRemark" placeholder="" style="width: 100%" />
                </el-form-item>
            </el-form> -->
            <div class="p-2 flex justify-between items-center">
                <div>
                    <el-tooltip :content="'生产调控，原料出仓，生产过程，包装，过程检验，生产备注'" placement="top">
                        <el-button :type="'primary'" :size="'small'" @click="getProductControl">其他信息</el-button>
                    </el-tooltip>
                    <el-button :type="'warning'" :size="'small'"
                        :disabled="SpecificationNo == '' || SpecificationNo == null"
                        @click="openFile(SpecificationNo)">规格书查看</el-button>
                </div>
                <div>
                    <el-form-item :label="'最后包装时间'" prop="LastPackagingDate" class="mb-2">
                        <el-input v-model="headerForm.LastPackagingDate" placeholder="" disabled style="width: 200px" />
                    </el-form-item>
                </div>
            </div>
            <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane :label="'计数检验'" name="first">
                    <el-table :data="CountTable" border stripe style="width: 100%" size="small" :height="300"
                        :row-class-name="tableDetailRowClassName2">
                        <el-table-column prop="LineNos" :label="'检验序列'" :align="'center'" :fixed="'left'" width="80" />
                        <el-table-column prop="ProjectCategoryName" :label="$t('aqlrules.ProjectCategoryName')">
                        </el-table-column>
                        <el-table-column prop="ProjectName" :label="$t('aqlrules.ProjectName')"
                            :min-width="getColumnWidth2('ProjectName')">
                        </el-table-column>
                        <!-- <el-table-column prop="InspectionType" :label="$t('aqlrules.DBType')">
                        </el-table-column> -->
                        <el-table-column prop="CharacteristicGrade" :label="$t('aqlrules.CharaCteristicGrade')">
                        </el-table-column>
                        <el-table-column prop="InspectionToolName" :label="$t('aqlrules.ToolName')"
                            :min-width="getColumnWidth2('InspectionToolName')">
                        </el-table-column>
                        <el-table-column prop="InspectionBasis" :label="$t('aqlrules.InspectionBasis')"
                            :min-width="getColumnWidth2('InspectionBasis')">
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
                    <div class="flex justify-end gap-2 items-center">
                        <el-form-item class="mb-2">
                            <el-tooltip :content="$t('oqcInspection.lookIQC')" placement="top">
                                <el-button type="primary" icon="Tickets" size="small"
                                    @click.stop="getIQCData"></el-button>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item class="mb-2">
                            <el-button :size="'small'" :type="'success'" icon="Download"
                                @click="downloadTemp">导出模板</el-button>
                        </el-form-item>
                        <el-form-item class="mb-2">
                            <el-upload action="#" multiple :limit="1" v-model:file-list="fileList3" :auto-upload="false"
                                :on-change="fileUpChange2" :on-remove="fileUpRemove2" :before-upload="beforeUpload2"
                                accept=".xlsx" :show-file-list="false">
                                <el-button :size="'small'" :type="'warning'" icon="Upload">导入数据</el-button>
                            </el-upload>
                        </el-form-item>
                    </div>
                    <el-table ref="tempMeasureRef" :data="MeasurTable" border style="width: 100%" size="small"
                        :height="300" :row-class-name="tableDetailRowClassName">
                        <el-table-column prop="LineNos" :label="'检验序列'" :align="'center'" :fixed="'left'" width="80" />
                        <el-table-column prop="ProjectCategoryName" :label="$t('aqlrules.ProjectCategoryName')">
                        </el-table-column>
                        <el-table-column prop="ProjectName" :label="$t('aqlrules.ProjectName')"
                            :min-width="getColumnWidth2('ProjectName')">
                        </el-table-column>
                        <!-- <el-table-column prop="InspectionType" :label="$t('aqlrules.DBType')">
                        </el-table-column> -->
                        <el-table-column prop="CharacteristicGrade" :label="$t('aqlrules.CharaCteristicGrade')">
                        </el-table-column>
                        <el-table-column prop="TargetValue" :label="$t('aqlrules.TargetValue')">
                        </el-table-column>
                        <el-table-column prop="MaxValue" :label="$t('aqlrules.MaxValue')">
                        </el-table-column>
                        <el-table-column prop="MinValue" :label="$t('aqlrules.MinValue')">
                        </el-table-column>

                        <el-table-column prop="InspectionToolName" :label="$t('aqlrules.ToolName')"
                            :min-width="getColumnWidth2('InspectionToolName')">
                        </el-table-column>
                        <el-table-column prop="uomname" :label="$t('aqlrules.uomname')">
                        </el-table-column>
                        <el-table-column prop="InspectionBasis" :label="$t('aqlrules.InspectionBasis')"
                            :min-width="getColumnWidth2('InspectionBasis')">
                        </el-table-column>
                        <el-table-column prop="SampleSize" :label="$t('incomeSheet.numberOfSample')" width="120">
                            <template #default="scope">
                                <el-input-number v-model="scope.row.SampleSize" :min="1" style="width: 100%"
                                    size="small" @change="handleSampleSizeChange(scope.row)" />
                                <!-- <el-input v-model="scope.row.SampleSize" size="small" type="number" min="1" max="10"
                                    @change="handleSampleSizeChange(scope.row)"></el-input> -->
                            </template>
                        </el-table-column>
                        <el-table-column prop="DefectCount" :label="$t('incomeSheet.numberOfDefect')">
                            <template #default="scope">
                                {{ calculateDefectCount(scope.row) }}
                                <!-- <el-input v-model="scope.row.DefectCount" size="small" :disabled="scope.row.StatusText!==''"></el-input> -->
                            </template>
                        </el-table-column>
                        <el-table-column prop="MeasuredValue" :label="$t('incomeSheet.MeasurementNumber')" width="150">
                            <template #default="scope">
                                <span>{{ formatMeasuredValues(scope.row) }}</span>
                                <el-button type="primary" icon="Plus" :size="'small'"
                                    @click="openMeasurementDialog(scope.row, scope.$index)" />
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
                                <span v-if="scope.row.ProjectCategoryName != '特性'">{{
                                    getResultText(scope.row)
                                }}</span>
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

            <!-- <el-table :data="CharactTable" border stripe style="width: 100%" size="small" :height="200">
                <el-table-column prop="OQCCharacteristicsName" :label="$t('oqcInspection.characteristicName')">
                    <template #default="scope">
                        <el-input v-model="scope.row.OQCCharacteristicsName" size="small"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="OQCCharacteristicsDesc" :label="$t('oqcInspection.characteristicDesc')">
                    <template #default="scope">
                        <el-input v-model="scope.row.OQCCharacteristicsDesc" size="small"></el-input>
                    </template></el-table-column>

                <el-table-column :label="$t('publicText.operation')" width="150" fixed="right" align="center">
                    <template #default="{ row, $index }">
                        <el-button v-if="isLastCharact($index)" :size="'small'" :type="'primary'" icon="Plus"
                            @click="addCharactTable"></el-button>
                        <el-button :size="'small'" :type="'danger'" icon="Delete"
                            @click="deleteCharactTable(row)"></el-button>
                    </template>
                </el-table-column>

            </el-table> -->
            <!-- <el-form class="mt-2" ref="DetailInfoFormRef" :model="DetailInfoForm" label-width="auto" :inline="true"
                :size="'small'">
                <el-form-item :label="$t('oqcInspection.measurementLocation')" prop="MeasurementLocation">

                    <el-select v-model="DetailInfoForm.MeasurementLocation" clearable placeholder="" style="width: 450px">
                        <el-option v-for="item in LocationList" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option></el-select>

                </el-form-item>
                <el-form-item :label="$t('oqcInspection.measurementMethod')" prop="MeasurementLocation">

                    <el-select v-model="MeasurValur" multiple placeholder="" style="width: 450px">
                        <el-option v-for="item in MethodList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option></el-select>

                </el-form-item>
            </el-form> -->
            <template #footer>
                <div class="flex justify-between">
                    <!-- <el-button @click="handleInspectClose">{{
                        $t("publicText.close")
                        }}</el-button> -->
                    <div>
                        <el-button type="primary" @click="handleInspectConfirm"
                            :disabled="headerForm.InspectionStatus == '检验完成'">
                            {{ $t("publicText.submit") }}
                        </el-button>
                    </div>
                    <div>
                        <el-button @click="handlePreviewOQCReport" :type="'info'">
                            {{ "预览OQC报告" }}
                        </el-button>
                        <el-button type="warning" @click="handleInspectZCConfirm"
                            :disabled="headerForm.InspectionStatus == '检验完成'">
                            {{ "暂存" }}
                        </el-button>
                        <el-button @click="handleApproval" :type="'success'" :disabled="!(
                            headerForm.InspectionStatus == '检验完成' &&
                            headerForm.ApprovalStatus == '创建'
                        )
                            ">{{ $t("publicText.approval") }}</el-button>
                    </div>
                </div>
            </template>
        </el-dialog>

        <el-dialog v-model="dialogVisible" :title="'输入测量值'" width="500px">
            <el-form ref="formRef" label-width="auto" size="small" @submit.native.prevent>
                <el-form-item :label="'样本值' + i" prop="name" v-for="i in currentSampleSize" :key="i">
                    <el-input :ref="(el: any) => setInputRef(el, i)" @keyup.enter.native="handleEnterInput($event, i)"
                        v-model="measurementValues[i - 1]" placeholder="请输入测量值" style="width: 200px"
                        @blur="handleBlur(i - 1)" />
                    <!-- <el-input-number :ref="(el: any) => setInputRef(el, i)" @keyup.enter.native="handleEnterInput($event, i)"
                        v-model="measurementValues[i - 1]" placeholder="请输入测量值" style="width: 200px" :precision="precision" /> -->
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="info" @click="resetMeasurement">重置</el-button>
                    <el-button type="primary" @click="saveMeasurements">保存</el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog v-model="appVisible" title="审批" width="500" :append-to-body="true" :close-on-click-modal="false"
            :close-on-press-escape="false" align-center @close="handleAppClose">
            <el-form ref="appFormRef" :model="appForm" label-width="auto">
                <el-form-item label="结果" prop="ApprovalResult">
                    <el-select v-model="appForm.ApprovalStatus" placeholder="" style="width: 200px">
                        <el-option label="通过" value="1"> </el-option>
                        <el-option label="不通过" value="0"> </el-option>
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
        <el-dialog v-model="previewVisible" :title="previewTitle" width="80%" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center>
            <iframe :src="previewUrl" width="100%" height="650px" frameborder="0"></iframe>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handlePreviewClose">{{
                        $t("publicText.close")
                    }}</el-button>
                    <el-button type="primary" @click="handlePreviewDawnload">
                        {{ $t("publicText.dawnload") }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="iqcCharactVisit" :title="iqcCharactTitle + 'IQC明细'" width="80%" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center>
            <el-form ref="formRef" :model="iqcForm" :inline="true" label-width="auto">
                <el-form-item label="IQC明细序号" prop="ApprovalResult">
                    <el-select v-model="iqcDetailName" placeholder="" style="width: 300px" filterable
                        @change="getIqcDetailData">
                        <el-option v-for="i in iqcCharactList" :label="i.iqcDetailID" :value="i.iqcDetailName"
                            :key="i.iqcDetailID" />
                    </el-select>
                </el-form-item>
                <el-form-item label="原料编码" prop="ApprovalResult">
                    <el-input v-model="iqcForm.ProductName" placeholder="" style="width: 250px" disabled />
                </el-form-item>
                <el-form-item label="原料批次" prop="ApprovalResult">
                    <el-input v-model="iqcForm.LotNumber" placeholder="" style="width: 250px" disabled />
                </el-form-item>
            </el-form>
            <el-table :data="iqcCharactTable" border stripe style="width: 100%" size="small" :height="350">
                <el-table-column prop="ProjectCategoryName" :label="$t('aqlrules.ProjectCategoryName')">
                </el-table-column>
                <el-table-column prop="ProjectName" :label="$t('aqlrules.ProjectName')"
                    :min-width="getColumnWidth6('ProjectName')">
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
                <el-table-column prop="InspectionToolName" :label="$t('aqlrules.ToolName')"
                    :min-width="getColumnWidth6('InspectionToolName')">
                </el-table-column>
                <el-table-column prop="uomname" :label="$t('aqlrules.uomname')">
                </el-table-column>
                <el-table-column prop="InspectionBasis" :label="$t('aqlrules.InspectionBasis')"
                    :min-width="getColumnWidth6('InspectionBasis')">
                </el-table-column>
                <el-table-column prop="SampleSize" :label="$t('incomeSheet.numberOfSample')">
                </el-table-column>
                <el-table-column prop="DefectCount" :label="$t('incomeSheet.numberOfDefect')">
                </el-table-column>
                <el-table-column prop="MeasuredValue" :align="'center'" :label="$t('incomeSheet.MeasurementNumber')">
                    <template #default="scope">
                        <span>{{ formatMeasuredValues(scope.row) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="Sum" :label="'总和'"> </el-table-column>
                <el-table-column prop="Average" :label="'平均数'"> </el-table-column>
                <el-table-column prop="StatusText" :label="'结果'"> </el-table-column>
                <el-table-column prop="UnqualifiedHandlingResults" :label="'不良处理结果'" width="180">
                </el-table-column>
            </el-table>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleIQCCharactClose">{{
                        $t("publicText.close")
                    }}</el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="productConVisit" :title="'其他信息'" width="80%" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center @close="handleOtherClose">
            <el-tabs v-model="activeConName" @tab-change="handleClick" type="border-card">
                <el-tab-pane label="生产调控" name="first">
                    <el-table :data="ProControlTable" border stripe style="width: 100%" size="small" :height="350">
                        <el-table-column prop="MfgOrder" :label="$t('oqcInspection.workerOrder')" />
                        <el-table-column prop="Description" :label="'生产备注'"
                            :min-width="getColumnWidth3('Description')" />
                        <el-table-column prop="MfgOrderPO" :label="'工单PO'" :min-width="getColumnWidth3('MfgOrderPO')" />
                        <el-table-column prop="Quantity" :label="'生产数量'" />
                        <el-table-column prop="OrderQty" :label="'工单数量'" />
                        <el-table-column prop="ProductName" :label="$t('oqcInspection.productName')"
                            :min-width="getColumnWidth3('ProductName')" />
                        <el-table-column prop="ProductType" :label="$t('oqcInspection.productCategory')" />
                        <el-table-column prop="ProductDescription" :label="'产品描述'"
                            :min-width="getColumnWidth3('ProductDescription')" />
                        <el-table-column prop="CustomerName" :label="$t('oqcInspection.customerName')" />
                        <el-table-column prop="CustomerPO" :label="$t('oqcInspection.customerPO')" width="130" />
                        <el-table-column prop="CustomerPN" :label="$t('oqcInspection.customerPN')" width="130" />
                        <el-table-column prop="SpecName" :label="'工序'" width="130" />
                        <el-table-column prop="SpecificationNo" :label="'规格书编号'" width="130" />
                        <el-table-column prop="Tabulator" :label="$t('oqcInspection.CreateTime')" width="150" />
                        <el-table-column prop="AcceptOrdersDate" :label="'下单日期'" width="150" />
                        <el-table-column prop="PlaceAnOrderDate" :label="'排产日期'" width="150" />
                        <el-table-column prop="ShipmentDate" :label="'出货日期'" width="150" />
                        <el-table-column prop="SchedulingDate" :label="'接单日期'" width="150" />
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="物料出仓" name="second">
                    <el-table :data="MaterialDisTable" border stripe style="width: 100%" size="small" :height="350">
                        <el-table-column prop="MfgOrderName" :label="$t('oqcInspection.workerOrder')" />
                        <el-table-column prop="MfgOrderPO" :label="'产品分类'" />
                        <el-table-column prop="ProductName" :label="'原料名称'"
                            :min-width="getColumnWidth4('ProductName')" />
                        <el-table-column prop="MaterialSpecifications" :label="'原料规格'" />
                        <el-table-column prop="MaterialLot" :label="'原料批号'" width="130" />
                        <el-table-column prop="QtyRequired" :label="'申领数量'" />
                        <el-table-column prop="BatchLot" :label="'生产批号'" width="130" />
                        <el-table-column prop="MOSignForConfirmUserName" :label="'MO签收确认'" width="130" />
                        <el-table-column prop="MOSignForConfirmDate" :label="'MO签收确认时间'" width="130" />
                        <el-table-column prop="WareHouseConfirmUserName" :label="'仓管确认'" width="130" />
                        <el-table-column prop="WareHouseConfirmDate" :label="'仓管确认时间'" width="130" />
                        <el-table-column prop="LabelProductionConfirmUserName" :label="'标签制作确认'" width="130" />
                        <el-table-column prop="LabelSignForConfirmDate" :label="'标签制作确认时间'" width="150" />
                        <el-table-column prop="LabelSignForConfirmUserName" :label="'标签签收确认'" width="150" />
                        <el-table-column prop="LabelSignForConfirmDate" :label="'标签签收确认时间'" width="150" />
                        <el-table-column prop="CuttingQty" :label="'开料数量'" width="150" />
                        <el-table-column prop="MaterialReceiverName" :label="'领料人'" width="150" />
                        <el-table-column prop="MaterialRequisitionDate" :label="'领料时间'" width="150" />
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="生产过程" name="third">
                    <el-table :data="ProLineRealTable" border stripe style="width: 100%" size="small" :height="350">
                        <el-table-column prop="MfgOrderName" :label="$t('oqcInspection.workerOrder')" />
                        <el-table-column prop="ResourceName" :label="'设备编号'" />
                        <el-table-column prop="ProductName" :label="'模具编号'" />
                        <!-- <el-table-column prop="MaterialSpecifications" :label="'一模数'" />
                        <el-table-column prop="MaterialLot" :label="'片数/卷数'" width="130" /> -->
                        <el-table-column prop="MoveInDate" :label="'开始时间'" />
                        <el-table-column prop="TxnDate" :label="'终止时间'" width="130" />
                        <el-table-column prop="TimeDiff" :label="'时长'" />
                        <el-table-column prop="EmployeeName" :label="'工号'" width="130" />
                        <el-table-column prop="FullName" :label="'姓名'" width="130" /> </el-table></el-tab-pane>
                <el-tab-pane label="包装数据" name="fourth">
                    <el-table :data="FinishedProTable" border stripe style="width: 100%" size="small" :height="350">
                        <el-table-column prop="MfgOrderName" :label="$t('oqcInspection.workerOrder')" />
                        <el-table-column prop="count_records" :label="'整箱数量'" />
                        <el-table-column prop="avg_NumberOfBoxes" :label="'整箱箱数'" />
                        <el-table-column prop="MaterialSpecifications" :label="'尾箱数量'" />
                        <el-table-column prop="MaterialLot" :label="'尾箱箱数'" width="130" />
                        <el-table-column prop="QtyRequired" :label="'整包数量'" />
                        <el-table-column prop="BatchLot" :label="'整包包数'" width="130" />
                        <el-table-column prop="MOSignForConfirmUserName" :label="'尾箱：包/箱'" width="130" />
                        <el-table-column prop="MOSignForConfirmDate" :label="'整箱净重kg'" width="130" />
                        <el-table-column prop="WareHouseConfirmUserName" :label="'整箱毛重kg'" width="130" />
                        <el-table-column prop="BoxModlName" :label="'整箱外箱型'" width="100" />
                        <el-table-column prop="LabelProductionConfirmUserName" :label="'尾箱净重kg'" width="130" />
                        <el-table-column prop="LabelSignForConfirmDate" :label="'尾箱毛重kg'" width="150" />
                        <el-table-column prop="LabelSignForConfirmUserName" :label="'尾箱外箱型'" width="150" />
                        <el-table-column prop="total_gross_weight" :label="'整包净重kg'" width="150" />
                        <el-table-column prop="total_net_weight" :label="'整包毛重kg'" width="150" />
                        <el-table-column prop="MaterialReceiverName" :label="'尾包数量'" width="150" />
                        <el-table-column prop="MaterialRequisitionDate" :label="'尾包包数'" width="150" />
                        <el-table-column prop="MaterialReceiverName" :label="'尾包净重kg'" width="150" />
                        <el-table-column prop="MaterialRequisitionDate" :label="'尾包毛重kg'" width="150" />
                        <el-table-column prop="MaterialReceiverName" :label="'工号'" width="150" />
                        <el-table-column prop="MaterialRequisitionDate" :label="'姓名'" width="150" />
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="过程检验" name="five">
                    <el-table :data="ProStageTable" border stripe style="width: 100%" size="small" :height="350">
                        <el-table-column prop="order_no" :label="$t('oqcInspection.workerOrder')" />
                        <el-table-column prop="pass_rate_percent" label="合格率" />
                        <el-table-column prop="total_qty" label="总数量" />
                        <el-table-column prop="good_qty" label="良品数" />
                        <el-table-column prop="defect_qty" label="不良品数" />
                        <el-table-column prop="current_balance" label="本次结余" />
                        <el-table-column prop="process_defect_rate_percent" label="工序不良率" />
                        <el-table-column prop="process_defect_indentation" label="工序-压痕" />
                        <el-table-column prop="process_defect_uneven" label="工序-凹凸" />
                        <el-table-column prop="process_defect_burr" label="工序-毛边" />
                        <el-table-column prop="process_defect_crack" label="工序-开裂" />
                        <el-table-column prop="process_defect_foreign_matter" label="工序-异物" />
                        <el-table-column prop="process_defect_red_dot" label="工序-红点" />
                        <el-table-column prop="process_defect_over_cut" label="工序-多切" />
                        <el-table-column prop="process_defect_deformation" label="工序-变形" />
                        <el-table-column prop="process_defect_punch_break" label="工序-冲断" />
                        <el-table-column prop="raw_defect_bubble" label="工序-气泡" />
                        <el-table-column prop="process_defect_other" label="工序-其他" />
                        <el-table-column prop="raw_material_defect_rate_percent" label="原料不良率" />
                        <el-table-column prop="raw_defect_glue" label="原料-胶水" />
                        <el-table-column prop="raw_defect_scratch" label="原料-刮伤" />
                        <el-table-column prop="raw_defect_pinhole" label="原料-针孔" />
                        <el-table-column prop="raw_defect_stain" label="原料-污点" />
                        <el-table-column prop="raw_defect_bubble" label="原料-气泡" />
                        <el-table-column prop="raw_defect_broken_corner" label="原料-缺角" />
                        <el-table-column prop="raw_defect_uneven" label="原料-凹凸" />
                        <el-table-column prop="raw_defect_tilt" label="原料-倾斜" />
                        <el-table-column prop="process_defect_foreign_matter" label="原料-异物" />
                        <el-table-column prop="process_defect_red_dot" label="原料-红点" />
                        <el-table-column prop="raw_defect_other" label="原料-其他" />
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="生产备注" name="six">
                    <el-table :data="ManufactureTable" border stripe style="width: 100%" size="small" :height="350">
                        <el-table-column prop="MfgOrder" :label="$t('oqcInspection.workerOrder')" />
                        <el-table-column prop="DataValue" :label="'备注'" :min-width="getColumnWidth5('DataValue')" />
                        <el-table-column prop="LotNumber" :label="'出货批号'" />
                        <el-table-column prop="ShippingQty" :label="'送检数量'" />
                        <el-table-column prop="UnitOfMeasure" :label="'单位'" width="130" />
                        <el-table-column prop="FormattedDate" :label="'送检时间'" />
                        <el-table-column prop="SubmitterNo" :label="'送检人工号'" width="130" />
                        <el-table-column prop="Submitter" :label="'送检人'" />
                    </el-table>
                </el-tab-pane>
            </el-tabs>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleOtherClose">{{
                        $t("publicText.close")
                    }}</el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="previewOQCVisible" :title="'预览OQC报告'" width="90%" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center>
            <div style="height: 650px; overflow: auto">
                <VueOfficeExcel :src="excelSrc" style="width: 100%; height: 100%"></VueOfficeExcel>
            </div>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="previewOQCVisible = false">{{
                        $t("publicText.close")
                    }}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import VueOfficeExcel from "@vue-office/excel";

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
    GetAQLLevelQuery,
    GetResourceQuery,
    QueryProductionControlParameters,
    QueryMaterialDispatchDetails,
    QueryProductionLineRealTimeData,
    QueryProductionStageQCReports,
    QueryFinishedProductPackingData,
    QueryManufacturingNotesHistory,
    QueryResource,
} from "@/api/smtSpotCheck/oqc";
import { GetProductTypeQuery } from "@/api/incomingManage/aqlrules";
import { GetIQCInspectionDetailQuery } from "@/api/incomingManage/iqcApi";
import {
    ref,
    watch,
    onBeforeMount,
    onMounted,
    onBeforeUnmount,
    nextTick,
    reactive,
    computed,
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
import router from "@/router";
import { exportTableToExcel } from "@/utils/exportExcel";
import {
    exportMeasureTableToExcelVertical,
} from "@/utils/exportExcel1";
import {
    handleExcelUploadEnhanced,
} from "@/utils/analysisExcel";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import {
    calculateColumnsWidth,
    clearTextWidthCache,
} from "@/utils/tableminWidth";
import { log } from "console";
const userStore = useUserStoreWithOut();
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
    { label: "按抽样方案", value: "按抽样方案" },
    { label: "次要", value: "次要" },
    { label: "主要", value: "主要" },
    { label: "严重", value: "严重" },
]);
const testLevelList = ref<any[]>([
    { label: "正常", value: "正常" },
    { label: "按抽样方案", value: "按抽样方案" },
]);
const TechnicalRequireList = ref<any[]>([
    { label: "SIP-01E", value: "SIP-01E" },
    { label: "SIP-010", value: "SIP-010" },
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
    IsCarProduct: "",
    LastPackagingDate: "",
    LotNumber: "",
});

const eqTable = ref([
    {
        ResourceName: "Tool microscope FP138",

        Status: 0,
    },
    {
        ResourceName: "Dial gauge FP113",
        Status: 0,
    },
]);
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
    MeasurementMethod: "",
    OQCRemark: "",
    ES_Expand1: "",
    ES_Expand2: "",
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
    ApprovalStatus: "",
    ApprovalRemarks: "",
});
const MeasurFormRef = ref("");
const MeasurValur = ref([]);
const LocationList = ref([
    {
        label: "Note 1 Meaurements are taken in Fujipoly Thailand",
        value: "Note 1 Meaurements are taken in Fujipoly Thailand",
    },
    {
        label: "Note 1 Meaurements are taken in Fujipoly Japan",
        value: "Note 1 Meaurements are taken in Fujipoly Japan",
    },
]);
const MethodList = ref([
    {
        label: "Tool Microscope",
        value: "Tool Microscope",
    },
    {
        label: "Dialgauge",
        value: "Dialgauge",
    },
    {
        label: "Verniar caliper",
        value: "Verniar caliper",
    },
    {
        label: "Multimeter",
        value: "Multimeter",
    },
    {
        label: "Ruler",
        value: "Ruler",
    },
]);
const OQCName = ref("");
const previewVisible = ref(false);
const previewUrl = ref("");
const previewTitle = ref("");
const iqcCharactList = ref<any[]>([]);
const iqcCharactVisit = ref(false);
const iqcDetailName = ref("");
const iqcCharactTable = ref<any[]>([]);
const iqcCharactTitle = ref("");
const productConVisit = ref(false);
const activeConName = ref("first");
const ProControlTable = ref<any[]>([]);
const MaterialDisTable = ref<any[]>([]);
const ProLineRealTable = ref<any[]>([]);
const FinishedProTable = ref<any[]>([]);
const ProStageTable = ref<any[]>([]);
const ManufactureTable = ref<any[]>([]);
const oqcInspectionRef = ref();
const tempMeasureRef = ref();
const fileList3 = ref<any[]>([]);
const SpecificationNo = ref("");
const previewOQCVisible = ref(false);
const excelSrc = ref("");
const produstTypeList = ref<any[]>([]);
const splitForm = ref({
    CreateUser: "",
    UpdateTime: "",
    UpdateUser: "",
    lotNo: "",
    shippingQty: "",
});
const iqcOQCName = ref("");
const options = {
    xls: false, //预览xlsx文件设为false；预览xls文件设为true
    minColLength: 0, // excel最少渲染多少列，如果想实现xlsx文件内容有几列，就渲染几列，可以将此值设置为0.
    minRowLength: 0, // excel最少渲染多少行，如果想实现根据xlsx实际函数渲染，可以将此值设置为0.
    widthOffset: 10, //如果渲染出来的结果感觉单元格宽度不够，可以在默认渲染的列表宽度上再加 Npx宽
    heightOffset: 10, //在默认渲染的列表高度上再加 Npx高

    beforeTransformData: (workbookData: any) => {
        return workbookData;
    }, //底层通过exceljs获取excel文件内容，通过该钩子函数，可以对获取的excel文件内容进行修改，比如某个单元格的数据显示不正确，可以在此自行修改每个单元格的value值。
    transformData: (workbookData: any) => {
        return workbookData;
    },
};
const inputRefs = ref<any[]>([]);
const iqcForm = ref({
    LotNumber: "",
    ProductName: "",
});
const precision = ref(0)
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
            getForm.value.EndTime = newVal[1] + " 23:59:59";
            // getForm.value.PageNumber = 1
        }
    },
);
// 监听 PinHoleDefectCount 变化，自动设置 PinHole 字段
watch(
    () => DetailInfoForm.value.PinHoleDefectCount,
    (newVal) => {
        DetailInfoForm.value.PinHole = newVal > 0 ? 1 : 0;
    },
    { immediate: true },
);

// 监听 DirtDefectCount 变化，自动设置 Dirt 字段
watch(
    () => DetailInfoForm.value.DirtDefectCount,
    (newVal) => {
        DetailInfoForm.value.Dirt = newVal > 0 ? 1 : 0;
    },
    { immediate: true },
);

// 监听 FlawDefectCount 变化，自动设置 Flaw 字段
watch(
    () => DetailInfoForm.value.FlawDefectCount,
    (newVal) => {
        DetailInfoForm.value.Flaw = newVal > 0 ? 1 : 0;
    },
    { immediate: true },
);

// 监听 ResultDefectCount 变化，自动设置 Result 字段
watch(
    () => DetailInfoForm.value.ResultDefectCount,
    (newVal) => {
        DetailInfoForm.value.Result = newVal > 0 ? 1 : 0;
    },
    { immediate: true },
);
const isLastRow = computed(() => {
    return (index: number) => {
        return index === eqTable.value.length - 1;
    };
});
const isLastCharact = computed(() => {
    return (index: number) => {
        return index === CharactTable.value.length - 1;
    };
});
const rejectValue = computed(() => {
    const {
        PinHoleDefectCount,
        DirtDefectCount,
        FlawDefectCount,
        ResultDefectCount,
    } = DetailInfoForm.value;
    const pinHole = Number(PinHoleDefectCount) || 0;
    const dirt = Number(DirtDefectCount) || 0;
    const flaw = Number(FlawDefectCount) || 0;
    const result = Number(ResultDefectCount) || 0;
    DetailInfoForm.value.Reject = pinHole + dirt + flaw + result;
    return pinHole + dirt + flaw + result;
});
const acceptValue = computed(() => {
    const SampleSize = Number(DetailInfoForm.value.SampleSize) || 0;
    const reject = Number(DetailInfoForm.value.Reject) || 0;
    DetailInfoForm.value.Accept = SampleSize - reject;
    return SampleSize - reject;
});
onBeforeMount(() => {
    getScreenHeight();
    GetAQLLevelQueryData();
    GetResourceQueryData();
    getProductTypeData();
    let end: string = setTodayDate();
    let start: string = setLastDate();
    searchDate.value = [start, end];
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getData();
});
onBeforeUnmount(() => {
    window.removeEventListener("resize", getScreenHeight);
    clearTextWidthCache();
});
const tableRowClassName = (val: any) => {
    let row = val.row;
    if (row.StatusFlag == 1) {
        return "danger-row-invent";
    }
};
const tableDetailRowClassName = (val: any) => {
    let row = val.row;
    if (row.Status == 0) {
        return "danger-row-invent1";
    }
};
const tableDetailRowClassName2 = (val: any) => {
    let row = val.row;
    if (row.DefectCount > 0) {
        return "danger-row-invent1";
    }
};
const testClick = () => {
    router.push({
        path: "/incomingManage/inspectSheet/1",
        query: { title: "IQC-来料检验单-审核1" },
    });
};
const resetForm = () => {
    getForm.value = {
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
    };
    let end: string = setTodayDate();
    let start: string = setLastDate();
    searchDate.value = [start, end];
    // getData();
};
//
const getData = () => {
    QueryOQCDocumentNumbersByCriteria(getForm.value).then((res: any) => {
        tableData.value = res.content;
    });
};
//获取产品类别
const getProductTypeData = () => {
    GetProductTypeQuery({}).then((res: any) => {
        produstTypeList.value = res.content;
    });
};
//获取检验方案
const GetAQLLevelQueryData = () => {
    GetAQLLevelQuery({}).then((res: any) => {
        aqlLevelList.value = res.content;
    });
};
//获取设备
const GetResourceQueryData = () => {
    QueryResource("检验仪器设备组").then((res: any) => {
        eqList.value = res.content;
    });
};
//获取生产调控
const getProductControl = () => {
    productConVisit.value = true;
    QueryProductionControlParameters(headerForm.value.MfgOrderName).then(
        (res: any) => {
            ProControlTable.value = res.content;
        },
    );
};

const exportTable = () => {
    exportTableToExcel({
        tableRef: oqcInspectionRef.value,
        fetchAllData: fetchFinishAllData,
        fileName: `${"OQC-检验审批"}_${dayjs().format("YYYYMMDDHHmmss")}`,
        styles: {
            headerBgColor: "", // 灰色表头
            headerFont: {
                color: { argb: "" }, // 红色文字
                bold: false,
                size: 12,
            }, // 白色文字
            cell: { numFmt: "@" }, // 强制文本格式
        },
        t,
    });
};
const fetchFinishAllData = async () => {
    let data = await QueryOQCDocumentNumbersByCriteria(getForm.value).then(
        (res: any) => {
            return res.content.map((item: any) => {
                item.UpdateTime = dayjs(item.UpdateTime).format("YYYY-MM-DD HH:mm:ss");
                return item;
            });
        },
    );
    return data;
};
const handleClick = (val: any) => {
    console.log(val);
    if (val == "first") {
        QueryProductionControlParameters(headerForm.value.MfgOrderName).then(
            (res: any) => {
                ProControlTable.value = res.content;
            },
        );
    } else if (val == "second") {
        QueryMaterialDispatchDetails(headerForm.value.MfgOrderName).then(
            (res: any) => {
                MaterialDisTable.value = res.content;
            },
        );
    } else if (val == "third") {
        QueryProductionLineRealTimeData(headerForm.value.MfgOrderName).then(
            (res: any) => {
                ProLineRealTable.value = res.content;
            },
        );
    } else if (val == "fourth") {
        QueryFinishedProductPackingData(headerForm.value.MfgOrderName).then(
            (res: any) => {
                FinishedProTable.value = res.content;
            },
        );
    } else if (val == "five") {
        QueryProductionStageQCReports(headerForm.value.MfgOrderName).then(
            (res: any) => {
                ProStageTable.value = res.content;
            },
        );
    } else {
        QueryManufacturingNotesHistory(headerForm.value.MfgOrderName).then(
            (res: any) => {
                ManufactureTable.value = res.content;
            },
        );
    }
};
const handleOtherClose = () => {
    productConVisit.value = false;
    activeConName.value = "first";
};
const openFile = (val: any) => {
    FTPSearchAndDownloadSpecificationDocumentFile(val).then((res: any) => {
        if (res.success) {
            const base64Data = "data:application/pdf;base64," + res.content.FileData;
            previewUrl.value = base64Data;
            previewTitle.value = res.content.FileName;
            previewVisible.value = true;
        } else {
            ElMessage({
                title: t("message.tipTitle"),
                message: res.msg,
                type: "error",
            });
            // ElNotification({
            //          title: t("message.tipTitle"),
            //     message: res.msg,
            //     type: "error",
            // })
        }
    });
};
const handlePreviewClose = () => {
    previewVisible.value = false;
    previewUrl.value = "";
};
const handlePreviewDawnload = () => {
    downloadPDF(previewUrl.value, previewTitle.value);
};

const downloadPDF = (base64Data: any, fileName: any) => {
    try {
        // 创建下载链接
        const link = document.createElement("a");

        // 设置下载属性
        link.href = base64Data;
        link.download = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;

        // 添加到页面（需要添加到页面才能触发下载）
        document.body.appendChild(link);

        // 触发点击下载
        link.click();

        // 清理 DOM
        document.body.removeChild(link);

        ElMessage.success("文件下载成功");
    } catch (error) {
        console.error("下载失败:", error);
        ElMessage.error("文件下载失败");
    }
};
// 类型定义
interface IQCFile {
    FileData: string; // Base64 数据
    FileName: string;
}

interface DownloadResponse {
    content: IQCFile;
    success: boolean;
    msg?: string;
}

interface DownloadError {
    msg: string;
    fileName?: string;
}

// 新增 handleDownloadOQC 函数
const handleDownloadOQC = async (row: any): Promise<void> => {
    try {
        const oqcResponse = await DownloadAndFillOQCFile(row.OQCName);

        // 统一响应数据处理
        const response = {
            data: oqcResponse?.data || oqcResponse,
            type: "OQC文件",
            fileName: "OQC",
        };

        try {
            if (validateDownloadResponse(response.data, response.type)) {
                await downloadSingleFile(response.data.content, `${row.OQCNumber}_OQC`);
            }
        } catch (error: any) {
            const errorMsg =
                typeof error === "object" && error !== null && "msg" in error
                    ? error.msg || String(error)
                    : String(error);
            ElMessage.warning(`${response.type}: ${errorMsg}`);
        }
    } catch (error) {
        handleDownloadError(error);
    }
};

// 新增 handleDownloadCOC 函数
const handleDownloadCOC = async (row: any): Promise<void> => {
    try {
        const cocResponse = await DownloadAndFillCOCFile(row.OQCName);

        // 统一响应数据处理
        const response = {
            data: cocResponse?.data || cocResponse,
            type: "COC文件",
            fileName: "COC",
        };

        try {
            if (validateDownloadResponse(response.data, response.type)) {
                await downloadSingleFile(response.data.content, `${row.OQCNumber}_COC`);
            }
        } catch (error: any) {
            const errorMsg =
                typeof error === "object" && error !== null && "msg" in error
                    ? error.msg || String(error)
                    : String(error);
            ElMessage.warning(`${response.type}: ${errorMsg}`);
        }
    } catch (error) {
        handleDownloadError(error);
    }
};

// 修改 downloadSingleFile 函数，添加 fileName 参数
const downloadSingleFile = async (file: IQCFile, defaultFileName?: string) => {
    try {
        // 确保 Base64 数据格式正确
        let base64Data = file.FileData;

        // 如果 Base64 数据不包含 data URL 前缀，添加它
        if (!base64Data.startsWith("data:")) {
            base64Data = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64Data}`;
        }

        // 使用更可靠的下载方式
        const response = await fetch(base64Data);
        const blob = await response.blob();

        // 创建下载链接
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        // 设置文件名，优先使用传入的默认文件名，否则使用文件中的文件名
        let fileName = defaultFileName || file.FileName;
        if (!fileName.toLowerCase().endsWith(".xlsx")) {
            fileName = `${fileName}.xlsx`;
        }

        link.href = url;
        link.download = fileName;
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();

        // 清理
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 100);

        ElMessage.success("文件下载成功");
    } catch (error) {
        console.error("文件下载失败:", error);
        ElMessage.error("文件下载失败");
    }
};

// 验证响应数据函数保持不变
const validateDownloadResponse = (
    response: DownloadResponse,
    fileName?: string,
): boolean => {
    if (!response.success) {
        throw { msg: response.msg || "下载失败", fileName };
    }

    if (!response.content || !response.content.FileData) {
        throw { msg: "文件数据为空", fileName };
    }

    return true;
};

// 统一的错误处理函数保持不变
const handleDownloadError = (error: unknown) => {
    let errorMsg = "文件下载失败";

    if (typeof error === "string") {
        errorMsg = error;
    } else if (error instanceof Error) {
        errorMsg = error.message || errorMsg;
    } else if (error && typeof error === "object") {
        const e: any = error;
        if (typeof e.msg === "string" && e.msg) {
            errorMsg = e.msg;
        } else if (typeof e.message === "string" && e.message) {
            errorMsg = e.message;
        }
    }

    console.error("下载失败:", error);
    ElMessage.error(errorMsg);
};

const handleLookIQC = (val: any) => {
    iqcCharactTitle.value = val.OQCNumber;
    iqcOQCName.value = val.OQCName;
    getIQCData();
};
const getIQCData = () => {
    QueryOQCCorrelationIQCModelSpec(iqcOQCName.value)
        .then((res: any) => {
            // 检查返回数据是否为空
            if (!res.content || res.content.length === 0) {
                ElMessage({
                    title: t("message.tipTitle"),
                    message: "暂无IQC数据",
                    type: "error",
                });
                return;
            }

            // 过滤掉三个关键字段中任意一个为 null/undefined/空字符串 的数据
            const validItems = res.content.filter((item: any) => {
                // 检查三个关键字段是否都有有效值
                return (
                    item.iqcNumber != null &&
                    item.modelSpec != null &&
                    item.iqcDetailName != null &&
                    item.iqcNumber !== "" &&
                    item.modelSpec !== "" &&
                    item.iqcDetailName !== ""
                );
            });

            // 如果过滤后没有有效数据
            if (validItems.length === 0) {
                ElMessage({
                    title: t("message.tipTitle"),
                    message: "没有有效的IQC数据（缺少关键字段）",
                    type: "warning",
                });
                return;
            }

            // 将过滤后的数据映射到需要的格式
            iqcCharactList.value = validItems.map((item: any, index: number) => {
                return {
                    iqcDetailName: item.iqcDetailName,
                    iqcDetailID: `${item.iqcNumber}-${item.modelSpec}-${index + 1}`,
                    LotNumber: item.LotNumber,
                    ProductName: item.ProductName,
                };
            });

            iqcCharactVisit.value = true;
            console.log("有效IQC数据:", iqcCharactList.value);

            // 可选：如果过滤掉了部分数据，可以给用户提示
            const filteredCount = res.content.length - validItems.length;
            if (filteredCount > 0) {
                console.warn(`过滤掉了 ${filteredCount} 条无效的IQC数据`);
                // 如果需要显示给用户，可以取消注释下面的代码
                // ElMessage.info(`过滤掉了 ${filteredCount} 条无效的IQC数据`);
            }
        })
        .catch((error: any) => {
            console.error("查询IQC数据失败:", error);
            ElMessage({
                title: t("message.tipTitle"),
                message: "查询IQC数据失败",
                type: "error",
            });
        });
};
const handleIQCCharactClose = () => {
    iqcCharactVisit.value = false;
    iqcCharactList.value = [];
    iqcCharactTable.value = [];
    iqcDetailName.value = "";
};
const getIqcDetailData = () => {
    let isEixt = iqcCharactList.value.find(
        (v: any) => v.iqcDetailName == iqcDetailName.value,
    );
    iqcForm.value = { ...isEixt };
    GetIQCInspectionDetailQuery({ IQC_DetailName: iqcDetailName.value }).then(
        (res: any) => {
            iqcCharactTable.value = res.content.filter(
                (item: any) => item.MeasurementType == "计量",
            );
            // console.log( iqcCharactTable.value);
        },
    );
};

const handleEdit = (row: any) => {
    OQCName.value = row.OQCName;
    SpecificationNo.value = row.SpecificationNo;
    iqcCharactTitle.value = row.OQCNumber;
    iqcOQCName.value = row.OQCName;
    getInspectDetilData();
    inspectVisible.value = true;
};
const getInspectDetilData = () => {
    GetOQCDetailInfo({ OQCName: OQCName.value }).then((res: any) => {
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
            IsCarProduct: data.OQCHead[0].ProductType == "汽车产品" ? "是" : "否",
            LastPackagingDate: data.OQCHead[0].LastPackagingDate,
            LotNumber: data.OQCHead[0].LotNumber,
        };
        splitForm.value = {
            CreateUser: data.OQCHead[0].CreateUser,
            UpdateTime: data.OQCHead[0].UpdateTime,
            UpdateUser: data.OQCHead[0].UpdateUser,
            lotNo: data.OQCHead[0].lotNo,
            shippingQty: data.OQCHead[0].shippingQty,
        };
        DetailInfoForm.value = {
            SamplingPlan: data.OQCDetailInfo[0].samplingPlan,
            TechnicalRequirements: "SIP-01E",
            Severity:
                data.OQCDetailInfo[0].severityLevel == null
                    ? "按抽样方案"
                    : data.OQCDetailInfo[0].severityLevel,
            InspectionLevel:
                data.OQCDetailInfo[0].inspectionLevel == null
                    ? "按抽样方案"
                    : data.OQCDetailInfo[0].inspectionLevel,
            SampleSize: data.OQCDetailInfo[0].oqcSampleSize,
            PinHole: data.OQCDetailInfo[0].pinHoleFlag,
            Dirt: data.OQCDetailInfo[0].dirtFlag,
            Flaw: data.OQCDetailInfo[0].flawFlag,
            Result: data.OQCDetailInfo[0].finalResult,
            PinHoleDefectCount:
                data.OQCDetailInfo[0].pinHoleDefectCount == null
                    ? 0
                    : data.OQCDetailInfo[0].pinHoleDefectCount,
            DirtDefectCount:
                data.OQCDetailInfo[0].dirtDefectCount == null
                    ? 0
                    : data.OQCDetailInfo[0].dirtDefectCount,
            FlawDefectCount:
                data.OQCDetailInfo[0].flawDefectCount == null
                    ? 0
                    : data.OQCDetailInfo[0].flawDefectCount,
            ResultDefectCount:
                data.OQCDetailInfo[0].resultDefectCount == null
                    ? 0
                    : data.OQCDetailInfo[0].resultDefectCount,
            Reject: data.OQCDetailInfo[0].isRejected,
            Accept: data.OQCDetailInfo[0].isAccepted,
            AC: data.OQCDetailInfo[0].AC,
            RE: data.OQCDetailInfo[0].RE,
            MeasurementLocation: data.OQCDetailInfo[0].measurementLocation,
            MeasurementMethod: data.OQCDetailInfo[0].measurementMethod,
            OQCRemark: data.OQCDetailInfo[0].OQCRemark,
            ES_Expand1: data.OQCDetailInfo[0].ES_Expand1,
            ES_Expand2: data.OQCDetailInfo[0].ES_Expand2,
        };
        MeasurValur.value =
            data.OQCDetailInfo[0].measurementMethod == null ||
                data.OQCDetailInfo[0].measurementMethod == ""
                ? ["Tool Microscope", "Dialgauge"]
                : data.OQCDetailInfo[0].measurementMethod.split(",");
        if (data.OQCInstrumentDetails.length == 0) {
            eqTable.value = [
                {
                    ResourceName: "Tool microscope FP138",

                    Status: 0,
                },
                {
                    ResourceName: "Dial gauge FP113",
                    Status: 0,
                },
            ];
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
            (item: any) => item.measurementType == "计量",
        ).map((item: any, i: any) => ({
            LineNos: i + 1,
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
            SampleSize:
                item.sampleSize == null
                    ? item.projectCategoryName == "特性"
                        ? "1"
                        : "10"
                    : item.sampleSize,
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
            (item: any) => item.measurementType == "计数",
        ).map((item: any, i: any) => ({
            LineNos: i + 1,
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
            SampleSize:
                DetailInfoForm.value.SampleSize == null
                    ? 1
                    : DetailInfoForm.value.SampleSize,
            DefectCount:
                item.defectCount == null || item.defectCount == ""
                    ? "0"
                    : item.defectCount,
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
    });
};
const changeSampleSize = () => {
    console.log(CountTable.value);

    if (CountTable.value.length == 0 || CountTable.value == null) {
        return;
    }
    CountTable.value = CountTable.value.map((v: any) => {
        return {
            ...v,
            SampleSize: DetailInfoForm.value.SampleSize,
        };
    });
    console.log(CountTable.value);
};
const removeEqRow = (row: any) => {
    const index = eqTable.value.indexOf(row);
    if (index > -1) {
        eqTable.value.splice(index, 1);
    }
    if (eqTable.value.length === 0) {
        eqTable.value.push({
            ResourceName: "",
            Status: 0,
        });
    }
};
const addEqRow = () => {
    eqTable.value.push({
        ResourceName: "",
        Status: 0,
    });
};
const handleInspectClose = () => {
    activeName.value = "first";
    inspectVisible.value = false;
};

const addCharactTable = () => {
    CharactTable.value.push({
        OQCCharacteristicsName: "",
        OQCCharacteristicsDesc: "",
    });
};
const deleteCharactTable = (val: any) => {
    const index = CharactTable.value.indexOf(val);
    if (index > -1) {
        CharactTable.value.splice(index, 1);
    }
    if (CharactTable.value.length === 0) {
        CharactTable.value.push({
            OQCCharacteristicsName: "",
            OQCCharacteristicsDesc: "",
        });
    }
};

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
            Status: item.Status,
            // status: 0,
            UnqualifiedHandlingResults: item.UnqualifiedHandlingResults,
        };
    });
    QCInspectDetail.value.push(
        ...CountTable.value.map((item: any) => {
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
                Status: item.DefectCount == 0 ? 1 : 0,
                UnqualifiedHandlingResults: item.UnqualifiedHandlingResults,
            };
        }),
    );

    let data = {
        OQCName: headerForm.value.OQCName,
        OQCNumber: headerForm.value.OQCNumber,
        MfgOrderName: headerForm.value.MfgOrderName,
        OrderQty: headerForm.value.OrderQty,
        ShippingQty: headerForm.value.ShippingQty,
        PartNo: headerForm.value.PartNo,
        LotNo: headerForm.value.LotNo,
        TotalEvaluation: calculateTotalEvaluation(DetailInfoForm.value),
        ProductName: headerForm.value.ProductName,
        ToCustomerName: headerForm.value.ToCustomerName,
        ProductType: headerForm.value.ProductType,
        CustomerPN: headerForm.value.CustomerPN,
        Date: headerForm.value.Date,
        DataStatus: 0,
        OperatorUser:
            userStore.getUserInfo2 !== ""
                ? userStore.getUserInfo2
                : userStore.getUserInfo,
        ApprovalStatus: "",
        ApprovalRemarks: "",
        InspectionStatus: "",
        RemainingQty: headerForm.value.RemainingQty,
        QtyShiped: headerForm.value.QtyShiped,
        SpecificationNo: headerForm.value.SpecificationNo,
        OperationType: "",
        oQCInstrumentDetails: [...eqTable.value],
        oQCCharacteristicsDetails: [
            ...CharactTable.value.filter(
                (item: any) => item.OQCCharacteristicsName == null,
            ),
        ],
        oQCInspectionDetails: [...QCInspectDetail.value],
        oQCDetail: {
            ...DetailInfoForm.value,
            MeasurementMethod: MeasurValur.value.join(","),
        },
    };

    // console.log(data);
    return data;
};

const calculateTotalEvaluation = (val: any) => {
    const pinHole = parseInt(val.PinHoleDefectCount) || 0;
    const dirt = parseInt(val.DirtDefectCount) || 0;
    const flaw = parseInt(val.FlawDefectCount) || 0;
    const result = parseInt(val.ResultDefectCount) || 0;

    // 如果四个缺陷数量全部为0，则返回"Accept"，否则返回空字符串
    if (pinHole === 0 && dirt === 0 && flaw === 0 && result === 0) {
        return "Accept";
    } else {
        return ""; // 默认空白
    }
};
const handlePreviewOQCReport = () => {
    DownloadAndFillOQCFile(OQCName.value).then((res: any) => {
        if (res.success) {
            excelSrc.value = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${res.content.FileData}`;
            previewOQCVisible.value = true;
        } else {
            excelSrc.value = "";
            ElMessage({
                title: t("message.tipTitle"),
                message: res.msg,
                type: "error",
            });
        }
    });
};
const handleInspectZCConfirm = () => {
    // 暂存逻辑
    let data = dataProcessing();
    data.InspectionStatus = "1";
    // console.log(data);

    SaveWithStatus(data).then((res: any) => {
        ElMessage({
            title: t("message.tipTitle"),
            message: res.msg,
            type: res.success ? "success" : "error",
        });
        if (!res.success) {
            return;
        }
        // inspectVisible.value = false;
        getInspectDetilData();
        getData();
    });
};
const handleInspectConfirm = () => {
    // 提交逻辑
    let data = dataProcessing();
    data.InspectionStatus = "2";
    console.log(data);
    let isEixt = data.oQCInspectionDetails.findIndex(
        (item: any) => item.Status == 0 || item.Status == "无数据",
    );
    if (isEixt != -1) {
        ElMessage({
            title: t("message.tipTitle"),
            message: "检验项目存在不合格项，请处理后再提交",
            type: "error",
        });
        return;
    }

    SaveWithStatus(data).then((res: any) => {
        ElMessage({
            title: t("message.tipTitle"),
            message: res.msg,
            type: res.success ? "success" : "error",
        });
        if (!res.success) {
            return;
        }
        activeName.value = "first";
        // inspectVisible.value = false;
        getInspectDetilData();
        getData();
    });
};

const handleAppClose = () => {
    appVisible.value = false;
};
const handleAppConfirm = () => {
    let data = dataProcessing();
    data.OperatorUser =
        userStore.getUserInfo2 !== ""
            ? userStore.getUserInfo2
            : userStore.getUserInfo;
    data.OperationType = "Approve";
    data.ApprovalStatus = appForm.value.ApprovalStatus;
    data.ApprovalRemarks = appForm.value.ApprovalRemarks;
    // console.log(data);

    OQCDocumentExecution(data).then((res: any) => {
        ElMessage({
            title: t("message.tipTitle"),
            message: res.msg,
            type: res.success ? "success" : "error",
        });
        if (!res.success) {
            return;
        }
        appForm.value.ApprovalStatus = "";
        appForm.value.ApprovalRemarks = "";
        appVisible.value = false;
        getInspectDetilData();
        getData();
    });
};
const handleApproval = (row: any) => {
    appVisible.value = true;
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
};
const openMeasurementDialog = (row: any, index: any) => {
    let parts = row.MinValue.split('.');
    precision.value = parts.length > 1 ? parts[1].length : 0;
    // console.log("Precision:", precision.value);

    currentRow.value = row;
    currentRowIndex.value = index;
    currentSampleSize.value = parseInt(row.SampleSize) || 0;
    measurementValues.value = [];
    for (let i = 0; i < currentSampleSize.value; i++) {
        measurementValues.value.push(row[`MeasuredValue${i + 1}`] || "");
    }

    dialogVisible.value = true;
    nextTick(() => {
        // console.log(currentIndex);
        setTimeout(() => {
            const inputRefsArray = inputRefs.value as unknown as HTMLInputElement[];
            if (inputRefsArray.length > 0) {
                const nextInput = inputRefsArray[0];
                if (nextInput) {
                    nextInput.focus();
                }
            }
        }, 100);
        // const nextInput = inputRefs.value[0];
        // if (nextInput) {
        //     nextInput.focus();
        // }
    });
};
const resetMeasurement = () => {
    measurementValues.value = [];
    for (let i = 0; i < currentSampleSize.value; i++) {
        measurementValues.value.push("");
    }
};
// 处理失去焦点事件，确保格式正确
const handleBlur = (index: number) => {
    const value = measurementValues.value[index];
    if (value === '' || value === null || value === undefined) return;

    // 确保是有效的数字格式
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
        measurementValues.value[index] = '';
        return;
    }

    // 处理截断逻辑
    if (precision.value === 0) {
        // 精度为0，取整
        measurementValues.value[index] = Math.trunc(numValue).toString();
    } else {
        // 精度大于0，截断小数部分
        const factor = Math.pow(10, precision.value);
        const truncated = Math.trunc(numValue * factor) / factor;
        measurementValues.value[index] = truncated.toFixed(precision.value);
    }
};
// const saveMeasurements = () => {
//     for (let i = 0; i < currentSampleSize.value; i++) {
//         currentRow.value[`MeasuredValue${i + 1}`] = measurementValues.value[i];
//     }

//     dialogVisible.value = false;
// };
const saveMeasurements = () => {
    // 先触发所有输入框的blur事件，确保格式正确
    for (let i = 0; i < currentSampleSize.value; i++) {
        handleBlur(i);
    }

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
    // 定义常量
    const NUM_MEASUREMENTS = 10;

    // 辅助函数：安全转换为数字
    const safeParseFloat = (value: any): number | null => {
        if (value === null || value === undefined || value === '') {
            return null;
        }
        const num = parseFloat(value);
        return isNaN(num) ? null : num;
    };

    // 辅助函数：检查是否有至少一个测量值
    const hasValidMeasurements = () => {
        for (let i = 1; i <= NUM_MEASUREMENTS; i++) {
            const value = row[`MeasuredValue${i}`];
            if (value !== null && value !== undefined && value !== '') {
                return true;
            }
        }
        return false;
    };

    // 获取最小值和最大值
    const minValue = safeParseFloat(row.MinValue);
    const maxValue = safeParseFloat(row.MaxValue);

    // 处理无测量值的情况
    if (!hasValidMeasurements()) {
        row.Status = '无数据';
        return '无数据';
    }

    // 根据项目类别采用不同的判断逻辑
    if (row.ProjectCategoryName === "特性") {
        // 特性项目：根据最小值/最大值情况灵活判断

        // 情况1：只有最小值有效
        if (minValue !== null && maxValue === null) {
            for (let i = 1; i <= NUM_MEASUREMENTS; i++) {
                const value = safeParseFloat(row[`MeasuredValue${i}`]);
                if (value === null) continue; // 跳过空值

                if (value < minValue) {
                    row.Status = 0;
                    return "不合格";
                }
            }
            row.Status = 1;
            return "合格";
        }

        // 情况2：只有最大值有效（虽然需求没要求，但保持逻辑完整性）
        if (minValue === null && maxValue !== null) {
            for (let i = 1; i <= NUM_MEASUREMENTS; i++) {
                const value = safeParseFloat(row[`MeasuredValue${i}`]);
                if (value === null) continue;

                if (value > maxValue) {
                    row.Status = 0;
                    return "不合格";
                }
            }
            row.Status = 1;
            return "合格";
        }

        // 情况3：最小值和最大值都有效
        if (minValue !== null && maxValue !== null) {
            for (let i = 1; i <= NUM_MEASUREMENTS; i++) {
                const value = safeParseFloat(row[`MeasuredValue${i}`]);
                if (value === null) continue;

                if (value < minValue || value > maxValue) {
                    row.Status = 0;
                    return "不合格";
                }
            }
            row.Status = 1;
            return "合格";
        }

        // 情况4：最小值和最大值都无效
        row.Status = 1;
        return "合格"; // 没有有效范围，默认合格
    } else {
        // 非特性项目：原逻辑，要求最小值和最大值都有效

        // 检查MinValue和MaxValue是否有效
        if (minValue === null || maxValue === null) {
            row.Status = 1; // 注意：这里是否应该设置为其他状态？
            return "范围无效";
        }

        // 检查所有测量值
        for (let i = 1; i <= NUM_MEASUREMENTS; i++) {
            const value = safeParseFloat(row[`MeasuredValue${i}`]);

            // 跳过空值
            if (value === null) {
                continue;
            }

            // 检查是否在范围内
            if (value < minValue || value > maxValue) {
                row.Status = 0;
                return "不合格";
            }
        }

        // 所有测量值都在范围内
        row.Status = 1;
        return "合格";
    }
};
const handleSampleSizeChange = (row: any) => {
    const newSize = parseInt(row.SampleSize) || 0;
    // 清空多余的测量值
    for (let i = newSize; i < 10; i++) {
        row[`MeasuredValue${i + 1}`] = null;
    }
};
const calculateSum = (row: any) => {
    // let sum = 0;
    // for (let i = 1; i <= 10; i++) {
    //     const value = row[`MeasuredValue${i}`];
    //     if (value !== null && value !== undefined && value !== "") {
    //         console.log(value);

    //         sum +=value
    //     }
    // }
    // row.Sum = sum;
    // return sum;
    let sum = 0;
    for (let i = 1; i <= 10; i++) {
        const value = row[`MeasuredValue${i}`];
        if (value !== null && value !== undefined && value !== "") {
            // 使用 parseFloat 而不是 Number
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                sum += numValue;
            }
        }
    }
    // 使用 toFixed 处理精度问题
    row.Sum = parseFloat(sum.toFixed(2));
    return row.Sum;
};
const calculateAverage = (row: any) => {
    // let sum = 0;
    // let count = 0;
    // for (let i = 1; i <= 10; i++) {
    //     const value = row[`MeasuredValue${i}`];
    //     if (value !== null && value !== undefined && value !== "") {
    //         sum += Number(value)
    //         count++;
    //     }
    // }
    // row.Average = count > 0 ? (sum / count).toFixed(2) : 0;
    // return count > 0 ? (sum / count).toFixed(2) : 0;
    let integerSum = 0; // 存储乘以100后的整数和
    let count = 0;

    for (let i = 1; i <= 10; i++) {
        const value = row[`MeasuredValue${i}`];

        // 跳过空值
        if (value == null || value === "") continue;

        // 使用一元加运算符转换并乘以100转为整数
        const num = +value;

        // 检查是否为有效数字
        if (!isNaN(num) && isFinite(num)) {
            integerSum += Math.round(num * 100); // 乘以100并四舍五入
            count++;
        }
    }

    let average = 0;

    if (count > 0) {
        // 计算平均值（整数运算）
        average = integerSum / count;
        // 除以100转回小数，再四舍五入到2位小数
        average = Math.round(average) / 100;
    }

    // 格式化为字符串，保留2位小数
    const result = average.toFixed(2);
    row.Average = result;
    return result;
};
const formatMeasuredValues = (row: any) => {
    const values = [];
    for (let i = 1; i <= 10; i++) {
        const value = row[`MeasuredValue${i}`];
        if (value !== null && value !== undefined && value !== "") {
            values.push(value);
        }
    }
    row.MeasuredValue = values.join(", ");
    return values.join(", ");
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
const downloadTemp = () => {
    // exportTableToExcel1({
    //     tableRef: tempMeasureRef.value,
    //     fetchAllData: tempData,
    //     fileName: headerForm.value.OQCNumber,
    //     styles: {
    //         headerBgColor: "", // 灰色表头
    //         headerFont: {
    //             color: { argb: "" }, // 红色文字
    //             bold: false,
    //             size: 12,
    //         }, // 白色文字
    //         cell: { numFmt: "@" }, // 强制文本格式
    //     },
    //     t,
    //     stringColumns: ['MeasuredValue']
    // });
    // exportMeasureTableToExcel({
    //     tableRef: tempMeasureRef.value,
    //     fetchAllData: tempData,
    //     fileName: headerForm.value.OQCNumber,
    //     styles: {
    //         headerBgColor: "", // 灰色表头
    //         headerFont: {
    //             color: { argb: "" }, // 红色文字
    //             bold: false,
    //             size: 12,
    //         }, // 白色文字
    //         cell: { numFmt: "@" }, // 强制文本格式
    //     },
    //     t,
    // })
    exportMeasureTableToExcelVertical({
        tableRef: tempMeasureRef.value,
        fetchAllData: tempData,
        fileName: headerForm.value.OQCNumber,
        styles: {
            headerBgColor: "", // 灰色表头
            headerFont: {
                color: { argb: "" }, // 红色文字
                bold: false,
                size: 12,
            }, // 白色文字
            cell: { numFmt: "@" }, // 强制文本格式
        },
        t,
        fieldMapping: {
            toolName: "InspectionToolName",
            sampleNum: "SampleSize",
            defectNum: "DefectCount",
            observedValueSum: "Sum",
            averageNum: "Average", // 如果有单独的Average字段
        },
    });
};
const tempData = async (): Promise<any[]> => {
    // 返回实际数组而不是 Ref，确保类型为 Promise<any[]>
    // console.log(MeasurTable.value);
    return Array.isArray(MeasurTable.value) ? MeasurTable.value : [];
};
const fileUpChange2 = async (file: any, fileList1: any) => {
    // if (file.raw) {
    //     convertToBase64(file.raw, 1);
    // }
    // uploadTemp(file.raw,'11')
    // const result = handleExcelUpload(file.raw)
    // // handleExcelUpload1(file.raw)
    // console.log(result);
    const fileNameList = file.name.split("_");
    //   console.log(fileNameList,editdetailForm.value.IQCNumber);
    if (fileNameList[0] !== headerForm.value.OQCNumber) {
        ElMessage.error("导入失败，请导入检验对应的Excel");
        return;
    }
    try {
        const result = await handleExcelUploadEnhanced(file.raw, {
            forceFormat: "auto",
        });

        if (result.success) {
            // parsedData.value = result.data
            console.log(result.data, 1);

            assignValuesMulti(result.data, MeasurTable.value);
            ElNotification.success({
                title: "导入成功",
                message: result.message,
                duration: 3000,
            });
            fileList3.value = [];
            // 触发数据更新事件（如果需要传递给父组件）
            // emit('data-parsed', result.data)
        } else {
            ElMessage.error(result.message || "导入失败");
            fileList3.value = [];
        }
    } catch (error: any) {
        ElMessage.error(`导入失败: ${error.message}`);
        fileList3.value = [];
    } finally {
    }
};
const fileUpRemove2 = (file: any, fileList1: any) => {
    fileList3.value = [];
};
const beforeUpload2 = (file: any) => {
    const isPDF = file.type === "application/xlsx";
    const isLt10M = file.size / 1024 / 1024 < 5;

    if (!isPDF) {
        console.error("只能上传 xlsx 文件");
        return false;
    }

    if (!isLt10M) {
        console.error("文件大小不能超过 10MB");
        return false;
    }

    return true;
};

const assignValuesMulti = (sourceData: any, targetData: any) => {
    // 创建源数据的查找映射，提高查找效率
    const sourceMap = new Map();

    sourceData.forEach((item: any) => {
        const key = `${item.LineNos}_${item.ProjectName}`;
        sourceMap.set(key, item);
    });

    // 遍历目标数组并赋值
    targetData.forEach((targetItem: any) => {
        const key = `${targetItem.LineNos}_${targetItem.ProjectName}`;
        const sourceItem = sourceMap.get(key);

        if (sourceItem) {
            targetItem.SampleSize = sourceItem.SampleNum;
            targetItem.MeasuredValue = sourceItem.ObservedValue;
            let valData = sourceItem.ObservedValue.split(",");

            if (targetItem.SampleSize < valData.length) {
                targetItem.SampleSize = valData.length;
            }

            // 无论是否有值，都先初始化所有 MeasuredValue1-10 为空字符串
            for (let i = 0; i < 10; i++) {
                targetItem[`MeasuredValue${i + 1}`] = "";
            }
            let parts = targetItem.MinValue.split('.');
            let precision = parts.length > 1 ? parts[1].length : 0;
            // 只有当 valData[0] 不为空时，才填充实际值
            if (valData[0] !== "") {
                valData.forEach((item: any, i: any) => {
                    if (i <= 9) {
                        targetItem[`MeasuredValue${i + 1}`] = truncateDecimal(item, precision);
                    }
                });
            }
        }
    });

    return targetData;
};
const truncateDecimal = (value: number | string, precision: number): string => {
    const numValue = parseFloat(String(value));
    if (isNaN(numValue)) return '';

    if (precision === 0) {
        return Math.trunc(numValue).toString();
    }

    const factor = Math.pow(10, precision);
    const truncated = Math.trunc(numValue * factor) / factor;
    return truncated.toFixed(precision);
};
// 使用计算属性缓存列宽计算结果
const columnWidths = computed(() => {
    const columns = [
        { label: "产品名称", prop: "ProductName" },
        { label: "工单最后修改时间", prop: "MfgorderTime" },
        { label: "原料批次", prop: "LotNumber" },
        { label: "客户PN", prop: "CustomerPN" },
        { label: "客户PO", prop: "CustomerPO" },
        { label: "客户名称", prop: "Customer" },
        // { label: 'FA', prop: 'ES_FaUrl' },
        // { label: 'CPK', prop: 'ES_CPKUrl' },
        // 添加其他需要自适应宽度的列
    ];

    // 批量计算列宽
    return calculateColumnsWidth(columns, tableData.value, {
        padding: 25,
        fontSize: 13,
    });
});

// 在模板中使用
const getColumnWidth = (prop: string) => {
    return columnWidths.value[prop] || "auto";
};

const columnWidths2 = computed(() => {
    const columns = [
        { label: "检验工具", prop: "InspectionToolName" },
        { label: "检验依据", prop: "InspectionBasis" },
        { label: "项目名称", prop: "ProjectName" },
    ];

    // 批量计算列宽
    return calculateColumnsWidth(columns, MeasurTable.value, {
        padding: 25,
        fontSize: 13,
    });
});

// 在模板中使用
const getColumnWidth2 = (prop: string) => {
    return columnWidths2.value[prop] || "auto";
};
const columnWidths3 = computed(() => {
    const columns = [
        { label: "生产备注", prop: "Description" },
        { label: "产品名称", prop: "ProductName" },
        { label: "产品描述", prop: "ProductDescription" },
        { label: "工单PO", prop: "MfgOrderPO" },
    ];

    // 批量计算列宽
    return calculateColumnsWidth(columns, ProControlTable.value, {
        padding: 25,
        fontSize: 13,
    });
});

// 在模板中使用
const getColumnWidth3 = (prop: string) => {
    return columnWidths3.value[prop] || "auto";
};
const columnWidths4 = computed(() => {
    const columns = [{ label: "原材料名称", prop: "ProductName" }];

    // 批量计算列宽
    return calculateColumnsWidth(columns, MaterialDisTable.value, {
        padding: 25,
        fontSize: 13,
    });
});

// 在模板中使用
const getColumnWidth4 = (prop: string) => {
    return columnWidths4.value[prop] || "auto";
};
const columnWidths5 = computed(() => {
    const columns = [{ label: "备注", prop: "DataValue" }];

    // 批量计算列宽
    return calculateColumnsWidth(columns, ManufactureTable.value, {
        padding: 25,
        fontSize: 13,
    });
});

// 在模板中使用
const getColumnWidth5 = (prop: string) => {
    return columnWidths5.value[prop] || "auto";
};
const columnWidths6 = computed(() => {
    const columns = [
        { label: "检验工具", prop: "InspectionToolName" },
        { label: "检验依据", prop: "InspectionBasis" },
        { label: "项目名称", prop: "ProjectName" },
    ];

    // 批量计算列宽
    return calculateColumnsWidth(columns, iqcCharactTable.value, {
        padding: 25,
        fontSize: 13,
    });
});

// 在模板中使用
const getColumnWidth6 = (prop: string) => {
    return columnWidths6.value[prop] || "auto";
};
const setInputRef = (el: any, index: any) => {
    if (el) {
        inputRefs.value[index - 1] = el;
    }
};
const handleEnterInput = (e: any, currentIndex: any) => {
    e.preventDefault();
    console.log(currentIndex);

    if (currentIndex < currentSampleSize.value) {
        // 使用 nextTick 确保 DOM 已更新
        nextTick(() => {
            console.log(currentIndex);
            const nextInput = inputRefs.value[currentIndex];
            if (nextInput) {
                nextInput.focus();
            }
        });
    }
};
// const flexColumnWidth = (label: any, prop: any) => {
//     const arr = tableData?.value.map((x: { [x: string]: any }) => x[prop]);
//     arr.push(label); // 把每列的表头也加进去算
//     return getMaxLength(arr) + 25 + "px";
// };

// const getMaxLength = (arr: any) => {
//     return arr.reduce((acc: any, item: any) => {
//         if (item) {
//             const calcLen = getTextWidth(item);

//             if (acc < calcLen) {
//                 acc = calcLen;
//             }
//         }
//         return acc;
//     }, 0);
// };
// const getTextWidth = (str: string) => {
//     let width = 0;
//     const html = document.createElement("span");
//     html.style.cssText = `padding: 0; margin: 0; border: 0; line-height: 1; font-size: ${13}px; font-family: Arial, sans-serif;`;
//     html.innerText = str; // 去除字符串前后的空白字符
//     document.body?.appendChild(html);

//     const spanElement = html; // 无需再次查询，直接使用创建的元素
//     if (spanElement) {
//         width = spanElement.offsetWidth;
//         spanElement.remove();
//     }
//     // console.log(width);
//     return width;
// };
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

/* NG状态样式 */
:deep(.ng-status .el-form-item__label) {
    color: #f56c6c !important;
    font-weight: bold;
}

:deep(.ng-select .el-input__wrapper) {
    background-color: #fef0f0 !important;
    border-color: #f56c6c !important;
}

:deep(.ng-select .el-input__inner) {
    color: #f56c6c !important;
    font-weight: bold;
}

/* disabled 状态下的 NG 样式 */
:deep(.ng-disabled.el-select.is-disabled .el-input__wrapper) {
    background-color: #fef0f0 !important;
    border-color: #f56c6c !important;
}

:deep(.ng-disabled.el-select.is-disabled .el-input__inner) {
    color: #f56c6c !important;
    font-weight: bold;
    -webkit-text-fill-color: #f56c6c !important;
    /* 修复 Safari 中的文字颜色 */
}

/* 如果使用 el-select 的选项，确保选项文本也是红色 */
:deep(.ng-select .el-select__caret),
:deep(.ng-disabled .el-select__caret) {
    color: #f56c6c !important;
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
<style>
.el-table .danger-row-invent {
    --el-table-tr-bg-color: var(--el-color-danger-light-7);
}

.el-table .success-row-invent {
    --el-table-tr-bg-color: var(--el-color-success-light-5);
}

.el-table .danger-row-invent1 {
    --el-table-tr-bg-color: #f56c6c;
    /* color: #ffffff; */
}
</style>
