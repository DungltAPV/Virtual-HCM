import Admin from 'src/modules/admin/components/Admin';
import ContributorsList from 'src/modules/admin/components/manage-contributor/ContributorsList';
import ContributorCreate from 'src/modules/admin/components/manage-contributor/ContributorCreate';
import ContributorEdit from 'src/modules/admin/components/manage-contributor/ContributorEdit';
import BtnChangeStatus from 'src/modules/admin/components/manage-contributor/BtnChangeStatus';
import ConfigureSystem from 'src/modules/admin/components/configure-system/ConfigureSystem';
import ManageTrainingProcess from 'src/modules/admin/components/manage-training-process/ManageTrainingProcess';
import ControlPanel from 'src/modules/admin/components/manage-training-process/ControlPanel';
import SelectFileModal from 'src/modules/admin/components/manage-training-process/SelectFileModal';
import TrainDataList from 'src/modules/admin/components/train-data/TrainDataList';
import TrainDataType from 'src/modules/admin/components/train-data/TrainDataType';
import TrainDataCreate from 'src/modules/admin/components/train-data/TrainDataCreate';
import TrainDataEdit from 'src/modules/admin/components/train-data/TrainDataEdit';
import TrainDataDelete from 'src/modules/admin/components/train-data/TrainDataDelete';
import TrainDataDeletedList from 'src/modules/admin/components/train-data/TrainDataDeletedList';
import TrainData from 'src/modules/admin/components/train-data/TrainData';
import AccountRole from 'src/modules/admin/components/manage-contributor/AccountRole';
import NlpSetting from 'src/modules/admin/components/configure-system/NlpSetting';
import ReviewProcessSetting from 'src/modules/admin/components/configure-system/ReviewProcessSetting';
import SystemSetting from 'src/modules/admin/components/configure-system/SystemSetting';
import ConfigureSystemHook from 'src/modules/admin/components/configure-system/ConfigureSystemHook';
import SettingComponent from 'src/modules/admin/components/configure-system/SettingComponent';
import TrainDataUsed from 'src/modules/admin/components/train-data/TrainDataUsed';

export * from 'src/modules/admin/components/configure-system/axiosCall';
export * from 'src/modules/admin/admin.actions';
export * from 'src/modules/admin/admin.constants.js';
export * from 'src/modules/admin/admin.reducer.js';
export * from 'src/modules/admin/admin.selectors.js';

export {
  Admin,
  ContributorsList,
  ContributorCreate,
  BtnChangeStatus,
  ContributorEdit,
  ConfigureSystem,
  ManageTrainingProcess,
  ControlPanel,
  SelectFileModal,
  TrainDataList,
  TrainDataType,
  TrainDataCreate,
  TrainDataDelete,
  TrainDataDeletedList,
  TrainDataEdit,
  TrainData,
  AccountRole,
  NlpSetting,
  ReviewProcessSetting,
  SystemSetting,
  ConfigureSystemHook,
  TrainDataUsed,
  SettingComponent,
};
