import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form } from 'react-bootstrap';
import * as yup from 'yup';
import { Constants } from 'utils/constants';
import FormPrompt from 'common/components/FormPrompt';
import { LoadingButton } from 'common/components/LoadingButton';
import { SubmitButton } from 'common/styles/button';

export type FormData = {
  newPassword: string;
  confirmPassword: string;
};

type Props = {
  onSubmit: (data: FormData) => void;
};

const schema: yup.SchemaOf<FormData> = yup.object().shape({
  newPassword: yup
    .string()
    .required(Constants.errorMessages.NEW_PASSWORD_REQUIRED)
    .min(8, Constants.errorMessages.PASSWORD_LENGTH)
    .matches(Constants.patterns.LOWERCASE_REGEX, Constants.errorMessages.PASSWORD_LOWERCASE)
    .matches(Constants.patterns.UPPERCASE_REGEX, Constants.errorMessages.PASSWORD_UPPERCASE)
    .matches(Constants.patterns.SYMBOL_REGEX, Constants.errorMessages.PASSWORD_SPECIAL_CHARACTER)
    .matches(Constants.patterns.DIGIT_REGEX, Constants.errorMessages.PASSWORD_NUMBER),

  confirmPassword: yup
    .string()
    .required(Constants.errorMessages.CONFIRM_PASSWORD_REQUIRED)
    .oneOf([yup.ref('newPassword')], Constants.errorMessages.PASSWORD_MUST_MATCH),
});

export const ResetPasswordForm: FC<Props> = ({ onSubmit }) => {
  const {
    formState: { errors, isValid, isDirty, isSubmitting },
    handleSubmit,
    register,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  useEffect(() => {
    trigger();
  }, [trigger]);

  const [submitButtonLoading, setSubmitButtonloading] = useState(false);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group>
        <Form.Label htmlFor='newPassword'>New Password</Form.Label>
        <Form.Control
          id='newPassword'
          type='password'
          {...register('newPassword')}
          placeholder='Enter new password'
          isInvalid={!!errors.newPassword}
        />
        <Form.Control.Feedback type='invalid' role='alert'>
          {errors.newPassword?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor='confirmPassword'>Confirm Password</Form.Label>
        <Form.Control
          id='confirmPassword'
          type='password'
          {...register('confirmPassword')}
          placeholder='Confirm password'
          isInvalid={!!errors.confirmPassword}
        />
        <Form.Control.Feedback type='invalid' role='alert'>
          {errors.confirmPassword?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <div className='d-grid gap-2 mt-3'>
        <LoadingButton
          loading={submitButtonLoading}
          as={SubmitButton}
          onClick={() => {
            setSubmitButtonloading(true);
            setTimeout(() => setSubmitButtonloading(false), 3000);
          }}
        >
          SUBMIT
        </LoadingButton>
      </div>
      <FormPrompt isDirty={isDirty} isSubmitting={isSubmitting} />
    </Form>
  );
};
