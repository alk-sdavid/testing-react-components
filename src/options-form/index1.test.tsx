import { render } from '@testing-library/react';
import { OptionsForm } from '.';

describe('<OptionsForm />', () => {
  it('should be well rendered', () => {
    const { container } = render(<OptionsForm sendNotification={() => {}} />);
    expect(container).toMatchSnapshot();
  });

  it('should be still well rendered', () => {
    const { container } = render(
      <OptionsForm sendNotification={() => {}} canUpdate={false} />,
    );
    expect(container).toMatchSnapshot();
  });
});
