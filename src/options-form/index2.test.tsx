import { render, waitFor } from '@testing-library/react';
import { OptionsForm } from '.';
import { fetchOptions } from '../api';

jest.mock('../api', () => ({
  fetchOptions: jest.fn(() => Promise.resolve({ a: true })),
}));

describe('<OptionsForm />', () => {
  afterEach(() => {
    (fetchOptions as jest.Mock).mockClear();
  });

  it('should be well rendered', async () => {
    const { container } = render(<OptionsForm sendNotification={() => {}} />);
    await waitFor(() => expect(fetchOptions).toHaveBeenCalled());
    expect(container).toMatchSnapshot();
  });

  it('should be still well rendered', async () => {
    const { container } = render(
      <OptionsForm sendNotification={() => {}} canUpdate={false} />,
    );
    await waitFor(() => expect(fetchOptions).toHaveBeenCalled());
    expect(container).toMatchSnapshot();
  });
});
