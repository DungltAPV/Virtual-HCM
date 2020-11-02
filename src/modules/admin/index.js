import Admin from 'src/modules/admin/components/Admin';
import ContributorsList from 'src/modules/admin/components/manage-contributor/ContributorsList';
import ContributorCreate from 'src/modules/admin/components/manage-contributor/ContributorCreate';
import ContributorEdit from 'src/modules/admin/components/manage-contributor/ContributorEdit';
import BtnChangeStatus from 'src/modules/admin/components/manage-contributor/BtnChangeStatus';
import ConfigureSystem from 'src/modules/admin/components/configure-system/ConfigureSystem';
import ManageTrainingProcess from 'src/modules/admin/components/manage-training-process/ManageTrainingProcess';

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
};
