import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { ResetPasswordForm } from '../resetPasswordForm';
import { IResetPasswordFormData } from '../resetPasswordForm/types';
import { Wrapper } from './styled';

export const ResetPasswordPage: FC = () => {
  const history = useHistory();

  // TODO: we need to make an API call and handle
  // success and error cases.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = (formData: IResetPasswordFormData) => {
    history.push('/');
  };

  const onCancel = () => {
    history.push('/');
  };

  return (
    <Wrapper data-testid='wrapper'>
      <ResetPasswordForm onSubmit={onSubmit} onCancel={onCancel} />
    </Wrapper>
  );
};