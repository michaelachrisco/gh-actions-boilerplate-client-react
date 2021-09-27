import { CustomRenderer, GenericTable, TableHeader } from 'common/components';
import ActionButton, { ActionButtonProps } from 'common/components/ActionButton';
import { useConfirmationModal } from 'common/hooks';
import { Agency } from 'common/models';
import { Link, useHistory } from 'react-router-dom';
import { useDeleteAgencyMutation, useGetAgenciesQuery } from 'features/agency-dashboard/agencyApi';
import { FC } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { useShowNotification } from 'core/modules/notifications/application/useShowNotification';

type AgencyTableItem = {
  id: number;
  name: string;
  actions: ActionButtonProps[];
};

export const AgencyListView: FC = () => {
  const history = useHistory();
  const { data: agencies = [] } = useGetAgenciesQuery();
  const [deleteAgency] = useDeleteAgencyMutation();
  const { Modal: ConfirmationModal, openModal, closeModal } = useConfirmationModal();
  const { showSuccessNotification } = useShowNotification();

  const handleDelete = (agency: Agency) => {
    const message = `Delete ${agency.agencyName}?`;
    showSuccessNotification('Agency deleted.');

    const onConfirm = () => {
      deleteAgency(agency.id);
      closeModal();
      showSuccessNotification('Agency deleted.');
    };

    const onCancel = () => closeModal();

    openModal(message, onConfirm, onCancel);
  };

  // Set up table headers
  const headers: TableHeader<AgencyTableItem>[] = [
    { key: 'name', label: 'AGENCY NAME' },
    { key: 'actions', label: 'ACTIONS' },
  ];

  // Transform Agency objects returned from the API into the table item data format expected by the table.
  const items: AgencyTableItem[] = agencies.map((agency) => ({
    id: agency.id,
    name: agency.agencyName,
    actions: [
      { icon: 'edit', tooltipText: 'Edit', onClick: () => history.push(`/agencies/update-agency/${agency.id}`) },
      {
        icon: 'trash-alt',
        tooltipText: 'Delete',
        onClick: () => handleDelete(agency),
      },
    ],
  }));

  // Specify custom render methods for any property in the table items that need to be rendered as a custom component.
  // Here we want the actions to be rendered using a custom component.
  const customRenderers: CustomRenderer<AgencyTableItem>[] = [
    {
      key: 'actions',
      renderer: ({ actions }: AgencyTableItem) => (
        <>
          {actions.map((action, index) => (
            <ActionButton key={index} icon={action.icon} tooltipText={action.tooltipText} onClick={action.onClick} />
          ))}
        </>
      ),
    },
  ];

  return (
    <Container>
      <div className='pb-4 text-right'>
        <Link to='/agencies/create-agency'>
          <Button>ADD AGENCY</Button>
        </Link>
      </div>
      <GenericTable<AgencyTableItem> headers={headers} items={items} customRenderers={customRenderers} />
      <ConfirmationModal />
    </Container>
  );
};
