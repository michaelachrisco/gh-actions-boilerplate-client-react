import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCreateAgentMutation } from 'common/api/agentApi';
import { FormCard, PageCrumb, PageHeader, SmallContainer } from 'common/components/Common';
import * as notificationService from 'common/services/notification';
import { StyledFormWrapper } from 'common/styles/form';
import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AgentDetailForm, FormData } from '../components/AgentDetailForm';

export const CreateAgentView: FC = () => {
  const navigate = useNavigate();
  const [createAgent] = useCreateAgentMutation();

  const handleFormCancel = () => {
    navigate(-1);
  };

  const handleFormSubmit = async (data: FormData) => {
    try {
      await createAgent({ ...data, thumbnail: 'https://shift3tech.com/images/s3-logo-white.svg' }).unwrap();
      notificationService.showSuccessMessage('Agent created.');
      navigate('/agents');
    } catch (error) {
      notificationService.showErrorMessage('Unable to add agent.');
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
          <h1>Create Agent</h1>
          <p className='text-muted'>Add a new agent to the system.</p>
        </div>
      </PageHeader>

      <FormCard>
        <FormCard.Body>
          <StyledFormWrapper>
            <AgentDetailForm submitButtonLabel='Create' onCancel={handleFormCancel} onSubmit={handleFormSubmit} />
          </StyledFormWrapper>
        </FormCard.Body>
      </FormCard>
    </SmallContainer>
  );
};
