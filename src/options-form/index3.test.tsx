import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { OptionsForm } from '.';
import { fetchOptions, saveOptions } from '../api';

jest.mock('../api', () => ({
  fetchOptions: jest.fn(() => Promise.resolve({ a: true, b: false, c: false })),
  saveOptions: jest.fn(() => Promise.resolve()),
}));

describe('<OptionsForm />', () => {
  afterEach(() => {
    (fetchOptions as jest.Mock).mockClear();
    (saveOptions as jest.Mock).mockClear();
  });

  it('should render options form with 3 checkboxes', async () => {
    render(<OptionsForm sendNotification={() => {}} canUpdate={true} />);
    await waitFor(() =>
      expect(screen.getAllByRole('checkbox')).toHaveLength(3),
    );
    expect(
      screen.getByRole('checkbox', { name: 'Option A' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Option A' })).toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: 'Option B' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Option B' }),
    ).not.toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: 'Option C' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Option C' }),
    ).not.toBeChecked();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('should select 1 option and save', async () => {
    let resolve: any;
    (saveOptions as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((r) => {
          resolve = r;
        }),
    );
    render(<OptionsForm sendNotification={() => {}} canUpdate={true} />);
    await waitFor(() =>
      expect(screen.getAllByRole('checkbox')).toHaveLength(3),
    );

    expect(
      screen.getByRole('checkbox', { name: 'Option C' }),
    ).not.toBeChecked();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Option C' }));
    expect(screen.getByRole('checkbox', { name: 'Option C' })).toBeChecked();

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(
      screen.getByRole('button', { name: 'Saving...' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();

    resolve();
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
  });
});
