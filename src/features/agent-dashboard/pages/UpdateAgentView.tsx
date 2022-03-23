import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGetAgentByIdQuery, useUpdateAgentMutation } from 'common/api/agentApi';
import { FormCard, PageCrumb, PageHeader, SmallContainer } from 'common/components/Common';
import { WithLoadingOverlay } from 'common/components/LoadingSpinner';
import * as notificationService from 'common/services/notification';
import { StyledFormWrapper } from 'common/styles/form';
import { FC, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AgentDetailForm, FormData } from '../components/AgentDetailForm';

export type RouteParams  = {
  id: string;
}

export const UpdateAgentView: FC = () => {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const [updateAgent] = useUpdateAgentMutation();
  const { data: agent, isLoading: isLoadingAgent, error } = useGetAgentByIdQuery(id!);

  useEffect(() => {
    if (error) {
      notificationService.showErrorMessage('Unable to load agent. Returning to agent list.');
      navigate('/agents', { replace: true });
    }
  }, [error, navigate]);

  const handleFormCancel = () => {
    navigate(-1);
  };

  const handleFormSubmit = async (data: FormData) => {
    const updateRequest = { id: Number(id), ...data };
    try {
      await updateAgent(updateRequest).unwrap();
      notificationService.showSuccessMessage('Agent updated.');
      navigate('/agents');
    } catch (error) {
      notificationService.showErrorMessage('Unable to update agent.');
    }
  };

  return (
    <SmallContainer>
      <PageCrumb>
        <Link to='/agents'>
          <FontAwesomeIcon icon={['fas', 'chevron-left']} /> Back to Agent List
        </Link>
      </PageCrumb>

      <PageHeader>
        <div>
          <h1>Edit Agent</h1>
          <p className='text-muted'>Update this agents details here.</p>
        </div>
      </PageHeader>

      <FormCard>
        <Card.Body>
          <WithLoadingOverlay isLoading={isLoadingAgent} containerHasRoundedCorners containerBorderRadius='6px'>
            <StyledFormWrapper>
              <AgentDetailForm
                defaultValues={agent}
                submitButtonLabel='Save'
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </StyledFormWrapper>
          </WithLoadingOverlay>
        </Card.Body>
      </FormCard>
    </SmallContainer>
  );
};
