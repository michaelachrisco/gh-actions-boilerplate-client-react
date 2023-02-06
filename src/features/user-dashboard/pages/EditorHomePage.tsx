import { FC } from 'react';
import { PageHeader } from 'common/styles/page';
import { Container } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import { TableCard } from 'common/styles/card';
import { NoContent } from 'common/styles/utilities';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

export const EditorHomePage: FC = () => {
  return (
    <Container>
      <PageHeader>
        <div>
          <h1>
            <Trans i18nKey='editorHomePage.heading'>Editor Home Page</Trans>
          </h1>
          <p>
            <Trans i18nKey='editorHomePage.subheading'>Placeholder homepage for editors</Trans>
          </p>
        </div>
      </PageHeader>
      <TableCard>
        <NoContent
          title={
            <p className='lead mb-0'>
              This is the homepage for <b>Editor</b> users. Replace this content with whatever you would like!
            </p>
          }
          icon={faExclamationCircle}
        />
      </TableCard>
    </Container>
  );
};