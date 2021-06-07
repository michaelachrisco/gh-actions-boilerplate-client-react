import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Form from 'react-bootstrap/Form';
import { CustomButton } from 'components/button/styled';
import { SetPasswordFormSchema } from './schema';
import { SetPasswordFormType } from './types';

export const SetPasswordForm: SetPasswordFormType = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    resolver: yupResolver(SetPasswordFormSchema),
    mode: 'onChange'
  });

  return (
    <Form data-testid="spf" onSubmit={handleSubmit(onSubmit)}>
      <Form.Group>
        <Form.Label htmlFor="password">Password</Form.Label>
        <Form.Control id="password" type="password" {...register('password')} />
        {errors.password?.message && (
          <span role="alert" className="danger">
            {errors.password?.message}
          </span>
        )}
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="confirmPassword">Confirm Password</Form.Label>
        <Form.Control id="confirmPassword" type="password" {...register('confirmPassword')} />
        {errors.confirmPassword?.message && (
          <span role="alert" className="danger">
            {errors.confirmPassword?.message}
          </span>
        )}
      </Form.Group>
      <CustomButton type="submit" name="submit" disabled={!isValid}>
        Login
      </CustomButton>
    </Form>
  );
};

export default SetPasswordForm;